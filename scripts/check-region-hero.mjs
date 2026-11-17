/** Read-only native-browser checks for the geographic styling hero, natural
 * photograph proportions and destination controls. Run only against a stable
 * build. No retailer/cart/form is submitted. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';

assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL to a stable origin');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH');
const given=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(given.protocol)&&given.pathname==='/'&&!given.search&&!given.hash&&!given.username&&!given.password);
const origin=given.origin,parts=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/compact-layout-stage-hero-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'compact-layout-stage-hero').replace(/[^a-zA-Z0-9_-]/g,'-');
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const [catalog,ja,images,selectionText,regionText,geometry]=await Promise.all([
 json('src/data/catalog.json'),json('src/data/translations/ja.json'),json('src/data/editorial-images.json'),readFile('src/config/selection.ts','utf8'),readFile('src/config/region-selection.ts','utf8'),json('src/data/japan-map-geometry.json'),
]);
const initialProductId=selectionText.match(/heroProductId\s*:\s*'([^']+)'/)[1];
const order=[...(selectionText.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/'([^']+)'/g)].map(m=>m[1]);
const ranks=new Map(order.map((id,i)=>[id,i]));
const published=catalog.products.filter(p=>p.publishStatus==='published').sort((a,b)=>(ranks.get(a.id)??9999)-(ranks.get(b.id)??9999));
const initialProduct=published.find(p=>p.id===initialProductId),initialRegion=initialProduct.prefectureIds[0];
const regionIds=catalog.prefectures.filter(r=>published.some(p=>p.prefectureIds.includes(r.id))).map(r=>r.id).sort();
const representatives=Object.fromEntries([...(regionText.split('export const regionalRepresentatives')[1]||'').matchAll(/\b([a-z0-9-]+):\s*'([^']+)'/g)].map(m=>[m[1],m[2]]));
const topTen=[...(regionText.match(/destinations:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/prefectureId:'([^']+)'/g)].map(m=>m[1]);
const productFor=id=>id===initialRegion?initialProduct:published.find(p=>p.id===representatives[id]&&p.prefectureIds.includes(id)&&images[p.id])||published.find(p=>p.prefectureIds.includes(id)&&images[p.id]);
const route=(lang,suffix='')=>base+lang+'/'+suffix;
const home=lang=>origin+route(lang);
const norm=s=>s.replace(/\s+/g,' ').trim();
const expectedPrice=(p,lang)=>{
 const price=p.localizedPrices?.ja?.currency==='JPY'?p.localizedPrices.ja:{amount:p.priceAmount,currency:p.priceCurrency,checkedAt:p.priceCheckedAt};
 assert.equal(price.currency,'JPY');
 return {...price,text:new Intl.NumberFormat(lang==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',minimumFractionDigits:Number.isInteger(price.amount)?0:2,maximumFractionDigits:0}).format(price.amount),unit:p.priceUnit};
};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});

async function rankedMeasurements(page){
 const rows=page.locator('[data-region-group=ranked] [data-region-row]');
 return rows.evaluateAll(nodes=>nodes.map(row=>{const img=row.querySelector('.region-selection-image-link img'),r=row.getBoundingClientRect(),i=img.getBoundingClientRect(),style=getComputedStyle(img);return{id:row.getAttribute('data-region-row'),rowHeight:r.height,imageWidth:i.width,imageHeight:i.height,objectFit:style.objectFit,descriptionVisible:getComputedStyle(row.querySelector('.region-selection-description')).display!=='none'};}));
}
if(process.env.CHECK_HERO_BASELINE_ONLY==='1'){
 const report={checkedAt:new Date().toISOString(),origin,base,method:'Read-only rendered pre-change Top10 baseline. Uses current public0.17 routes before the compact release; all image dimensions are measured after scrolling/decode.',views:[],failures:[]};
 try{for(const lang of ['ja','en'])for(const width of [320,390,1440]){const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();try{const r=await page.goto(home(lang),{waitUntil:'networkidle'});assert.equal(r.status(),200);await page.evaluate(()=>document.fonts.ready);for(const img of await page.locator('[data-region-group=ranked] .region-selection-image-link img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}const rows=await rankedMeasurements(page);assert.deepEqual(rows.map(r=>r.id),topTen);report.views.push({lang,width,rows,totalRowHeight:rows.reduce((n,r)=>n+r.rowHeight,0),maxImageHeight:Math.max(...rows.map(r=>r.imageHeight))});}catch(e){report.failures.push({lang,width,message:String(e)});}finally{await context.close();}}}finally{await browser.close();}
 report.status=report.failures.length?'failed':'passed';await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({baseline:report.status,views:report.views.length,failures:report.failures.length}));if(report.failures.length)process.exitCode=1;
}else{
 const inputPaths=['src/components/RegionHero.astro','src/components/RegionSelection.astro','src/pages/[lang]/index.astro','src/data/editorial-images.json','src/data/catalog.json','src/data/translations/ja.json','src/config/selection.ts','src/config/region-selection.ts','src/data/japan-map-geometry.json'];
 const hashes=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
 const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh native Chrome uses raw catalog, translation, image/CC0 geometry registries and source display configuration as independent expectations. Tests first-fold natural-proportion female-image/enlarged-mainland-map layout, contained image content-box paint and surrounding frame/caption gaps in every source-correct state, 47 unchanged unique shapes/24 unique destinations, a labelled 44px Okinawa inset, native filled-path clicks and inset-label clicks, all24 source-correct states, URL/language/history behavior, Top10 ordering (regional image sizing is independently covered by check-region-photos), noJS, keyboard/touch, axe and zero external requests. No product purchase, retailer visit or Google map activation.',limits:'Chrome emulation is not a physical Safari/iOS test. Natural proportions and contain/full-frame layout avoid CSS cropping or artificial letterbox bars, but do not inspect background pixels inside the original AI artwork or independently verify what it depicts. Bounce/retention is not measured.',sourceInputs:{started:await hashes()},expectedChecks:77,checks:[],failures:[],screenshots:[],axe:[],selections:0,modelSwitches:0,firstFold:[],geometryChecks:[],imagePaintChecks:[],compactMeasurements:[],externalRequests:[],pageErrors:[],consoleErrors:[]};
 const flush=()=>writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 async function check(name,fn){try{const detail=await fn();report.checks.push({name,status:'passed',...detail});console.log('PASS '+name);}catch(error){report.checks.push({name,status:'failed',message:error.stack||String(error)});report.failures.push({name,message:error.stack||String(error)});console.error('FAIL '+name+' '+String(error));}await flush();}
 async function setup({lang='ja',width=390,height=844,touch=false,nojs=false}={}){
  const context=await browser.newContext({viewport:{width,height},locale:lang==='ja'?'ja-JP':'en-US',reducedMotion:'reduce',isMobile:touch,hasTouch:touch,javaScriptEnabled:!nojs,serviceWorkers:'block'});
  await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.origin!==origin&&!['about:','data:'].includes(u.protocol)){report.externalRequests.push(r.request().url());await r.abort();}else await r.continue();});
  const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});return{context,page};
 }
 const hero=page=>page.locator('[data-region-hero]');
 async function go(page,lang,query=''){const r=await page.goto(home(lang)+query,{waitUntil:'networkidle'});assert.equal(r.status(),200);await page.evaluate(()=>document.fonts.ready);await expect(hero(page)).toHaveCount(1);const store=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage),cookie:document.cookie}));assert.deepEqual(store,{local:[],session:[],cookie:''},'Hero choices must not write persistent storage or cookies');}
 async function naturalImageMetrics(h,id,lang){
  const img=h.locator('[data-hero-image-frame] img');await img.evaluate(i=>i.decode());
  const metrics=await img.evaluate(i=>{
   const box=i.getBoundingClientRect(),style=getComputedStyle(i),figure=i.closest('figure'),frame=i.closest('[data-hero-image-frame]'),caption=figure.querySelector('figcaption');
   if(!frame||!caption)throw Error('The hero photo needs its frame and visible AI caption');
   const num=(s,key)=>parseFloat(s[key])||0;
   const paddingX=num(style,'paddingLeft')+num(style,'paddingRight'),paddingY=num(style,'paddingTop')+num(style,'paddingBottom'),borderX=num(style,'borderLeftWidth')+num(style,'borderRightWidth'),borderY=num(style,'borderTopWidth')+num(style,'borderBottomWidth');
   const cssWidth=num(style,'width'),cssHeight=num(style,'height'),borderBoxWidth=cssWidth+(style.boxSizing==='border-box'?0:paddingX+borderX),borderBoxHeight=cssHeight+(style.boxSizing==='border-box'?0:paddingY+borderY),scaleX=box.width/borderBoxWidth,scaleY=box.height/borderBoxHeight;
   const contentWidth=(borderBoxWidth-paddingX-borderX)*scaleX,contentHeight=(borderBoxHeight-paddingY-borderY)*scaleY,paintScale=Math.min(contentWidth/i.naturalWidth,contentHeight/i.naturalHeight),paintWidth=i.naturalWidth*paintScale,paintHeight=i.naturalHeight*paintScale;
   const f=figure.getBoundingClientRect(),fs=getComputedStyle(figure),outer=frame.getBoundingClientRect(),os=getComputedStyle(frame),c=caption.getBoundingClientRect();
   return{loaded:i.complete&&i.naturalWidth>0,width:box.width,height:box.height,contentWidth,contentHeight,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,fit:style.objectFit,paintWidth,paintHeight,verticalLetterbox:contentHeight-paintHeight,horizontalLetterbox:contentWidth-paintWidth,naturalRatioHeight:contentWidth*i.naturalHeight/i.naturalWidth,naturalRatioError:Math.abs(contentHeight-contentWidth*i.naturalHeight/i.naturalWidth),imageVerticalPadding:paddingY*scaleY,frameTopBlank:f.top-(outer.top+num(os,'borderTopWidth')+num(os,'paddingTop')),figureTopBlank:box.top-(f.top+num(fs,'borderTopWidth')+num(fs,'paddingTop')),imageToCaptionGap:c.top-box.bottom,figureBottomBlank:f.bottom-num(fs,'borderBottomWidth')-num(fs,'paddingBottom')-c.bottom,frameBottomBlank:outer.bottom-num(os,'borderBottomWidth')-num(os,'paddingBottom')-f.bottom,captionWidth:c.width,captionHeight:c.height};
  });
  assert.ok(metrics.loaded&&metrics.width>0&&metrics.height>0);assert.equal(metrics.fit,'contain');
  for(const key of ['verticalLetterbox','horizontalLetterbox','naturalRatioError','imageVerticalPadding','frameTopBlank','figureTopBlank','imageToCaptionGap','figureBottomBlank','frameBottomBlank'])assert.ok(Number.isFinite(metrics[key])&&Math.abs(metrics[key])<=1.5,'No artificial hero photograph gap: '+key+'='+metrics[key]);
  assert.ok(metrics.captionWidth>0&&metrics.captionHeight>0);assert.equal(await h.locator('[data-hero-image-frame] figcaption').isVisible(),true);
  report.imagePaintChecks.push({region:id,lang,viewportWidth:await img.evaluate(()=>innerWidth),...metrics});return metrics;
 }
 async function imageState(page,id,lang){
  const h=hero(page),p=productFor(id),asset=images[p.id],price=expectedPrice(p,lang),img=h.locator('[data-hero-image-frame] img');
  await expect(h).toHaveAttribute('data-hero-selected',id);await img.evaluate(i=>i.decode());
  assert.equal(await img.getAttribute('src'),base+asset.path);assert.equal(await img.getAttribute('alt'),asset.alt[lang]);assert.equal(Number(await img.getAttribute('width')),asset.width);assert.equal(Number(await img.getAttribute('height')),asset.height);
  const figure=img.locator('xpath=..');assert.equal(await figure.getAttribute('data-editorial-asset'),asset.assetId);assert.equal(norm(await figure.locator('figcaption').innerText()),lang==='ja'?'AIイメージ':'AI image');
  await naturalImageMetrics(h,id,lang);
  const card=h.locator('[data-hero-card="'+id+'"]');assert.equal(await card.isVisible(),true);assert.equal(await h.locator('[data-hero-card]:visible').count(),1);assert.equal(await h.locator('.selection-hero-product').count(),1);assert.equal(await card.getAttribute('data-hero-product'),p.id);assert.equal(await card.getAttribute('href'),route(lang,'objects/'+p.slug+'/'));assert.ok(norm(await card.innerText()).includes(norm(lang==='ja'?ja.products[p.id].title:p.title)));
  const block=card.locator('[data-market-price-block]');assert.equal(await block.getAttribute('data-price-product'),p.id);assert.equal(await block.getAttribute('data-market-price-block'),'japan');const amount=block.locator('[data-price-amount]');assert.equal(Number(await amount.getAttribute('data-price-amount')),price.amount);assert.equal(await amount.getAttribute('data-price-currency'),'JPY');assert.equal(await amount.getAttribute('data-price-checked-at'),price.checkedAt);assert.equal(norm(await amount.innerText()),norm(price.text));if(price.unit){assert.equal(await block.locator('[data-price-unit]').getAttribute('data-price-unit'),price.unit);}else assert.equal(await block.locator('[data-price-unit]').count(),0);
  assert.equal(await h.locator('[data-hero-destination]').getAttribute('href'),route(lang,'places/'+id+'/'));
  assert.ok(norm(await h.locator('[data-hero-region-name]').innerText()).includes(lang==='ja'?ja.prefectures[id].name:catalog.prefectures.find(r=>r.id===id).name));
  const count=published.filter(item=>item.prefectureIds.includes(id)).length;assert.equal(norm(await h.locator('[data-hero-region-count]').innerText()),lang==='ja'?count+'点のジュエリー':count+' '+(count===1?'piece':'pieces'));assert.equal(await h.locator('[data-hero-select]').inputValue(),id);assert.equal(await h.locator('[data-hero-choice][aria-pressed=true]').getAttribute('data-hero-choice'),id);assert.equal(await h.locator('[data-hero-choice][role=button]').count(),regionIds.length);report.selections++;return{region:id,product:p.id,image:asset.path,price:price.text};
 }
 async function point(control){await control.scrollIntoViewIfNeeded();return control.locator('path').evaluate(path=>{const b=path.getBBox(),a=path.closest('a');let hit;for(const grid of [8,16,32,64,128]){for(let y=1;y<grid&&!hit;y++)for(let x=1;x<grid;x++){const p=new DOMPoint(b.x+b.width*x/grid,b.y+b.height*y/grid);if(path.isPointInFill(p)){const q=p.matrixTransform(path.getScreenCTM()),e=document.elementFromPoint(q.x,q.y);if(e&&a.contains(e)){hit=q;break;}}}if(hit)break;}if(!hit)throw Error('No visible filled point in hero prefecture');return{x:hit.x,y:hit.y};});}
 async function chooseNative(page,id,action='mouse'){
  const control=hero(page).locator('[data-hero-choice="'+id+'"]'),before=new URL(page.url());
  if(action==='enter'){await control.focus();await control.press('Enter');}else if(action==='space'){await control.focus();await control.press('Space');}else{const at=await point(control);if(action==='touch')await page.touchscreen.tap(at.x,at.y);else await page.mouse.click(at.x,at.y);}
  await expect(hero(page)).toHaveAttribute('data-hero-selected',id);assert.equal(new URL(page.url()).pathname,before.pathname,'Hero interaction must stay on the home page');report.modelSwitches++;
 }
 async function mapGeometry(page,lang,width){
  const h=hero(page),paths=await h.locator('[data-hero-shape]').evaluateAll(es=>es.map(e=>({id:e.getAttribute('data-hero-shape'),d:e.getAttribute('d')})).sort((a,b)=>a.id.localeCompare(b.id)));
  assert.equal(paths.length,47);assert.equal(new Set(paths.map(p=>p.id)).size,47);assert.deepEqual(paths,geometry.prefectures.map(p=>({id:p.id,d:p.d})).sort((a,b)=>a.id.localeCompare(b.id)),'The two SVG viewports retain exactly the original 47 CC0 paths');
  const controls=await h.locator('[data-hero-choice]').evaluateAll(es=>es.map(e=>e.getAttribute('data-hero-choice')).sort());assert.deepEqual(controls,regionIds);assert.equal(new Set(controls).size,24);assert.equal(await h.locator('[data-hero-map] [data-hero-shape]').count(),46);assert.equal(await h.locator('[data-hero-map] [data-hero-shape=okinawa]').count(),0);assert.equal(await h.locator('[data-hero-okinawa-svg] [data-hero-shape=okinawa]').count(),1);
  for(const shape of await h.locator('[data-hero-unlisted]').all())assert.equal(await shape.locator('xpath=ancestor::a').count(),0,'Unlisted prefectures stay unlinked');
  const inset=h.locator('[data-hero-okinawa-inset]');assert.equal(await inset.getAttribute('data-hero-choice'),'okinawa');assert.equal(await inset.getAttribute('href'),route(lang,'places/okinawa/'));assert.equal(norm(await inset.locator('.hero-okinawa-label').innerText()).replace(/\s*↗$/,''),lang==='ja'?'沖縄（拡大）':'Okinawa · enlarged');
  const bounds=await inset.boundingBox();assert.ok(bounds&&bounds.width>=44&&bounds.height>=44,'The whole Okinawa inset is a 44px touch target');
  const metrics=await h.locator('[data-hero-map]').evaluate((svg,oldViewBox)=>{const view=svg.viewBox.baseVal,b=svg.getBoundingClientRect(),stage=svg.parentElement.getBoundingClientRect(),inset=svg.parentElement.querySelector('[data-hero-okinawa-inset]').getBoundingClientRect(),wrap=svg.closest('[data-region-hero]').getBoundingClientRect(),oldGap=innerWidth>1000?52:innerWidth>720?30:innerWidth>480?18:12,oldWidth=(wrap.width-oldGap)/2,oldHeight=innerWidth>1000?330:innerWidth>720?280:innerWidth>480?220:170,oldScale=Math.min(oldWidth/oldViewBox[2],oldHeight/oldViewBox[3]),scale=svg.getScreenCTM().a;const occluded=[...svg.querySelectorAll('path')].filter(path=>{const r=path.getBoundingClientRect();if(r.right<=inset.left||r.left>=inset.right||r.bottom<=inset.top||r.top>=inset.bottom)return false;const box=path.getBBox();for(let y=1;y<24;y++)for(let x=1;x<24;x++){const local=new DOMPoint(box.x+box.width*x/24,box.y+box.height*y/24);if(!path.isPointInFill(local))continue;const point=local.matrixTransform(path.getScreenCTM());if(point.x>inset.left&&point.x<inset.right&&point.y>inset.top&&point.y<inset.bottom)return true;}return false;}).map(e=>e.getAttribute('data-hero-shape'));return {viewBox:[view.x,view.y,view.width,view.height],mainlandScale:scale,previousFullMapScale:oldScale,magnification:scale/oldScale,insetWithinStage:inset.left>=stage.left-1&&inset.right<=stage.right+1&&inset.top>=stage.top-1&&inset.bottom<=stage.bottom+1,occluded,svgWidth:b.width,svgHeight:b.height};},geometry.viewBox.split(/\s+/).map(Number));
  assert.deepEqual(metrics.viewBox,[89,-8,356,400]);assert.ok(metrics.magnification>=1.35,'The mainland must be visibly enlarged relative to the previous full-country viewport');assert.equal(metrics.insetWithinStage,true);assert.deepEqual(metrics.occluded,[],'The inset must not cover any mainland island');
  // A visible filled point, rather than a path bounding-box centre, proves that
  // each published prefecture remains independently reachable after the inset.
  for(const id of regionIds)await point(h.locator('[data-hero-choice="'+id+'"]'));
  const detail={lang,width,uniqueShapes:47,uniqueDestinations:24,unchangedGeometry:true,inset:bounds,...metrics};report.geometryChecks.push(detail);return detail;
 }
 async function layout(page,lang,width,height){
  await page.evaluate(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
  const h=hero(page),image=await h.locator('[data-hero-image-frame] img').boundingBox(),map=await h.locator('[data-hero-map]').boundingBox();assert.ok(image&&map);if(width>480)assert.ok(image.x+image.width<=map.x+2,'The desktop model stays left and Japan map right');else assert.ok(image.y<map.y,'The mobile full-width photo precedes the compact destination/map row');
  // imageState has just measured this exact initial image. Judge useful image
  // size against its natural height at the available column width, rather than
  // demanding a fixed tall canvas which recreates the reported blank bands.
  const latest=report.imagePaintChecks.at(-1);assert.equal(latest.region,initialRegion);assert.equal(latest.viewportWidth,width);const painted={width:latest.paintWidth,height:latest.paintHeight,naturalRatioHeight:latest.naturalRatioHeight,naturalRatioError:latest.naturalRatioError,verticalLetterbox:latest.verticalLetterbox,frameTopBlank:latest.frameTopBlank,frameBottomBlank:latest.frameBottomBlank};assert.ok(painted.height>=Math.min(width<=480?150:250,painted.naturalRatioHeight)-1.5,'The natural photograph fills its available width without a tall letterbox');
  const visible=r=>Math.max(0,Math.min(height,r.y+r.height)-Math.max(0,r.y));assert.ok(visible(image)>=Math.min(150,image.height*.7),'Woman image is visible on initial arrival');assert.ok(visible(map)>=Math.min(150,map.height*.7),'Japan map is visible on initial arrival');assert.equal(await page.evaluate(()=>scrollY),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  for(const q of ['[data-hero-select]','[data-hero-destination]']){const b=await h.locator(q).boundingBox();assert.ok(b.width>=44&&b.height>=44);}
  const rankedOrder=await page.locator('[data-region-group=ranked] [data-region-row]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-region-row')));assert.deepEqual(rankedOrder,topTen);
  const result={lang,width,height,image,map,paintedImage:painted,rankedOrder,compactSizingScope:'Independent check-region-photos report owns decoded regional-image/row-size measurements.'};report.firstFold.push({lang,width,height,image,map,paintedImage:painted});return result;
 }
 try{
  for(const lang of ['ja','en'])for(const [width,height]of [[320,740],[390,844],[1366,768],[1440,900]]){
   const {context,page}=await setup({lang,width,height});const name=lang+'-'+width+'x'+height;
   try{
    await check(name+' initial layout and compact Top10',async()=>{await go(page,lang);await imageState(page,initialRegion,lang);const detail=await layout(page,lang,width,height);if(width===320||width===1440){const axe=(await new AxeBuilder({page}).analyze()).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));report.axe.push({name,violations:axe});assert.deepEqual(axe,[]);}await page.evaluate(()=>scrollTo({top:0,left:0,behavior:'instant'}));const screenshot='artifacts/'+prefix+'-'+name+'.png';await page.screenshot({path:screenshot,fullPage:false});report.screenshots.push(screenshot);return detail;});
    await check(name+' explicit map controls preserve the page',async()=>{await go(page,lang);const previous=await hero(page).locator('[data-hero-image-frame] img').getAttribute('src'),before=page.url(),control=hero(page).locator('[data-hero-choice=hokkaido]');await control.hover();await control.focus();assert.equal(await hero(page).locator('[data-hero-image-frame] img').getAttribute('src'),previous);assert.equal(page.url(),before);await chooseNative(page,'hokkaido','enter');await imageState(page,'hokkaido',lang);await chooseNative(page,'akita','space');await imageState(page,'akita',lang);await chooseNative(page,'kyoto');await imageState(page,'kyoto',lang);return{explicitOnly:true,enter:true,space:true,nativeMouse:true};});
    await check(name+' enlarged mainland and native Okinawa inset',async()=>{await go(page,lang);const detail=await mapGeometry(page,lang,width);const inset=hero(page).locator('[data-hero-okinawa-inset]'),before=page.url(),initial=await hero(page).locator('[data-hero-image-frame] img').getAttribute('src');await inset.hover();await inset.focus();assert.equal(page.url(),before);assert.equal(await hero(page).locator('[data-hero-image-frame] img').getAttribute('src'),initial);for(const action of ['mouse','enter','space']){await chooseNative(page,'okinawa',action);await imageState(page,'okinawa',lang);await chooseNative(page,initialRegion);}
     await inset.locator('.hero-okinawa-label').click();await imageState(page,'okinawa',lang);assert.equal(new URL(page.url()).pathname,route(lang));if(width===390)for(const id of regionIds){await chooseNative(page,id);await imageState(page,id,lang);}return{...detail,nativeFilledPathClick:true,labelClick:true,enter:true,space:true,allRegionsClicked:width===390?24:0};});
    if(width===390)for(const id of regionIds)await check(name+' source-correct state '+id,async()=>{await hero(page).locator('[data-hero-select]').selectOption(id);return imageState(page,id,lang);});
   }finally{await context.close();}
  }
  for(const lang of ['ja','en'])await check(lang+' native touch, deep link and language retention',async()=>{
   const {context,page}=await setup({lang,width:390,height:844,touch:true});try{
    await go(page,lang,'?qa=kept&region=akita#main');await imageState(page,'akita',lang);await page.evaluate(()=>history.replaceState({qa:'existing-state'},'',location.href));await chooseNative(page,'okinawa','touch');await imageState(page,'okinawa',lang);await chooseNative(page,'hokkaido','touch');await imageState(page,'hokkaido',lang);const u=new URL(page.url());assert.equal(u.searchParams.get('qa'),'kept');assert.equal(u.searchParams.get('region'),'hokkaido');assert.equal(u.hash,'#main');assert.deepEqual(await page.evaluate(()=>history.state),{qa:'existing-state'});
    const other=lang==='ja'?'en':'ja';await Promise.all([page.waitForURL(u=>u.pathname===route(other),{waitUntil:'domcontentloaded'}),page.locator('.language-switch').click()]);await page.waitForLoadState('networkidle');await imageState(page,'hokkaido',other);assert.equal(new URL(page.url()).searchParams.get('region'),'hokkaido');assert.equal(new URL(page.url()).searchParams.get('qa'),'kept');assert.equal(new URL(page.url()).hash,'#main');
    await hero(page).locator('[data-hero-destination]').click();await page.waitForURL(u=>u.pathname===route(other,'places/hokkaido/'));await page.goBack({waitUntil:'networkidle'});await imageState(page,'hokkaido',other);
    await go(page,lang,'?qa=kept&region=not-a-published-region#main');await imageState(page,initialRegion,lang);assert.equal(new URL(page.url()).searchParams.has('region'),false);assert.equal(new URL(page.url()).searchParams.get('qa'),'kept');assert.equal(new URL(page.url()).hash,'#main');return{touch:true,okinawaInsetFilledPathTouch:true,queryHashAndHistoryState:true,languageRetainsRegion:true,backRetainsRegion:true,invalidRegionRemoved:true};
   }finally{await context.close();}
  });
  for(const lang of ['ja','en'])await check(lang+' no JavaScript initial model and ordinary region links',async()=>{
   const{context,page}=await setup({lang,width:390,height:844,nojs:true});try{
    await go(page,lang);const h=hero(page),img=h.locator('[data-hero-image-frame] img');assert.equal(await img.getAttribute('src'),base+images[initialProduct.id].path);await naturalImageMetrics(h,initialRegion,lang);
    assert.deepEqual((await h.locator('[data-hero-choice]').evaluateAll(es=>es.map(e=>e.getAttribute('data-hero-choice')))).sort(),regionIds);assert.equal(await h.locator('[data-hero-select]').isVisible(),false);
    for(const link of await h.locator('[data-hero-choice]').all()){const id=await link.getAttribute('data-hero-choice');assert.equal(await link.getAttribute('href'),route(lang,'places/'+id+'/'));}
    for(const id of ['hokkaido','okinawa']){if(id==='okinawa')await go(page,lang);const link=h.locator('[data-hero-choice="'+id+'"]'),at=await point(link);await Promise.all([page.waitForURL(u=>u.pathname===route(lang,'places/'+id+'/'),{waitUntil:'domcontentloaded'}),page.mouse.click(at.x,at.y)]);assert.equal(await page.locator('[data-regional-choice="'+id+'"]').count(),1);}
    return{nojs:true,initialImage:true,naturalProportionImage:true,ordinaryRegionLinks:regionIds.length,nativeLink:true,okinawaInsetNativeLink:true};
   }finally{await context.close();}
  });
  await check('No client errors, external requests or unexpected storage',async()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.externalRequests,[]);return{pageErrors:0,consoleErrors:0,externalRequests:0};});
 }finally{
  await browser.close();report.sourceInputs.finished=await hashes();report.sourceInputs.unchanged=JSON.stringify(report.sourceInputs.started)===JSON.stringify(report.sourceInputs.finished);if(report.checks.length!==report.expectedChecks)report.failures.push({name:'complete-coverage',message:'Not all planned hero cases completed'});if(!report.sourceInputs.unchanged)report.failures.push({name:'stable-inputs',message:'Application inputs changed during QA'});report.completedAt=new Date().toISOString();
  const maxPaintMetric=key=>Math.max(0,...report.imagePaintChecks.map(check=>Math.abs(check[key])));
  report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,locales:2,viewports:4,regions:regionIds.length,selections:report.selections,modelSwitches:report.modelSwitches,firstFoldScreens:report.firstFold.length,enlargedGeometryScreens:report.geometryChecks.length,uniquePrefectureShapes:47,okinawaInset:true,naturalImagePaintChecks:report.imagePaintChecks.length,maxVerticalLetterbox:maxPaintMetric('verticalLetterbox'),maxNaturalRatioError:maxPaintMetric('naturalRatioError'),maxContainerBlank:Math.max(...['frameTopBlank','figureTopBlank','imageToCaptionGap','figureBottomBlank','frameBottomBlank'].map(maxPaintMetric)),axeScreens:report.axe.length,axeViolations:report.axe.reduce((n,a)=>n+a.violations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length,sourceInputsUnchanged:report.sourceInputs.unchanged};await flush();console.log(JSON.stringify(report.summary,null,2));
 }
 if(report.failures.length)process.exitCode=1;
}
