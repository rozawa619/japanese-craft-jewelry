/** Read-only geographic browsing regression. Use a stable build; never build
 * while this runs. The small SVG shapes have equivalent 44px+ select/list UI. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL to the stable local or hosted origin');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH to match that build');
const input=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(input.protocol)&&input.pathname==='/'&&!input.search&&!input.hash&&!input.username&&!input.password);
const origin=input.origin,parts=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/click-map-stage-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'click-map-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const [catalog,ja,images,geometry,editorialImages]=await Promise.all(['src/data/catalog.json','src/data/translations/ja.json','src/data/product-detail-images.json','src/data/japan-map-geometry.json','src/data/editorial-images.json'].map(read));
const baselinePath=process.env.CHECK_TOP10_BASELINE_REPORT_PATH||'';
const baseline=baselinePath?await read(baselinePath):null;
if(baseline)assert.equal(baseline.status,'passed','An explicitly supplied old-public baseline must be verified.');
const [selectionSource,regionalConfig,discoveryConfig]=await Promise.all(['src/config/selection.ts','src/config/region-selection.ts','src/config/japan-map.ts'].map(p=>readFile(p,'utf8')));
const orderedIds=[...(selectionSource.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/['"]([a-z0-9-]+)['"]/g)].map(m=>m[1]);
const ordering=new Map(orderedIds.map((id,index)=>[id,index]));
const products=catalog.products.filter(p=>p.publishStatus==='published').sort((a,b)=>(ordering.get(a.id)??9999)-(ordering.get(b.id)??9999));
const prefectures=catalog.prefectures.filter(p=>products.some(product=>product.prefectureIds.includes(p.id)));
const prefectureIds=prefectures.map(p=>p.id).sort();
const representatives=Object.fromEntries([...(regionalConfig.split('export const regionalRepresentatives')[1]||'').matchAll(/\b([a-z0-9-]+):\s*'([a-z0-9-]+)'/g)].map(m=>[m[1],m[2]]));
const topTen=[...(regionalConfig.match(/destinations:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/prefectureId:'([a-z0-9-]+)'/g)].map(m=>m[1]);
const picks=[...(discoveryConfig.match(/discoveryPrefectureIds\s*=\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/'([a-z0-9-]+)'/g)].map(m=>m[1]);
assert.equal(topTen.length,10);assert.equal(picks.length,3);
const paths=['src/components/JapanJewelryMap.astro','src/components/RegionSelection.astro','src/config/japan-map.ts','src/config/region-selection.ts','src/config/selection.ts','src/data/japan-map-geometry.json','src/data/catalog.json','src/data/translations/ja.json','src/data/product-detail-images.json','src/data/editorial-images.json'];
const hash=async()=>Object.fromEntries(await Promise.all(paths.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,method:'Independent raw catalog/localization/image registries and display configuration supply expected membership, prices and routes. Fresh Chrome verifies native SVG-anchor clicks, taps and Enter navigation, enlarged geometry, zoom/pan/reset, hover/focus/select previews, noJS and responsive accessibility. Top10 image/row dimensions, original source dimensions and contain fitting are measured in every viewport/surface. Actual filled-path screen coordinates and native pointer events are used; no forced clicks or DOM click dispatch. External requests are observed and aborted, not live Google Maps tests.',limits:'Chrome emulation only; small SVG areas additionally have44px zoom/select/list controls. Geography is a destination overview, not a navigation/boundary survey.',baselineComparison:baselinePath||null,sourceInputs:{started:await hash()},checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],externalRequests:[],selectionChecks:0,nativeNavigations:0,zoomCases:0,mobilePanCases:0,compactScenes:0,topTenImageChecks:0,axeScreens:0,axeViolations:0};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const norm=s=>s.replace(/\s+/g,' ').trim();
const pathname=(lang,route='')=>base+lang+'/'+route;
const regionItems=id=>products.filter(p=>p.prefectureIds.includes(id));
const chosen=id=>{const items=regionItems(id);return items.find(p=>p.id===representatives[id])||items[0]};
const expectedPrice=(product,lang)=>{const domestic=product.localizedPrices?.ja;const amount=domestic?.currency==='JPY'?domestic.amount:product.priceCurrency==='JPY'?product.priceAmount:null;assert.notEqual(amount,null);return new Intl.NumberFormat(lang==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:0}).format(amount)};
async function check(name,action){try{const detail=await action();report.checks.push({name,status:'passed',detail});console.log('PASS '+name);}catch(error){report.checks.push({name,status:'failed',message:error.stack||String(error)});report.failures.push({name,message:error.stack||String(error)});console.error('FAIL '+name+' '+String(error))}}
const browser=await chromium.launch({channel:'chrome',headless:true});
async function context(options){const c=await browser.newContext({reducedMotion:'reduce',...options});await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==origin&&!['data:','about:'].includes(u.protocol)){report.externalRequests.push(route.request().url());await route.abort();}else await route.continue()});c.on('page',p=>{p.on('pageerror',e=>report.pageErrors.push(String(e)));p.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text())})});return c}
async function selection(map,id,lang){
 const product=chosen(id),region=prefectures.find(p=>p.id===id),image=images[product.id];
 assert.ok(product&&region&&image&&product.prefectureIds.includes(id));
 assert.equal(await map.locator('[data-map-preview]').getAttribute('data-map-selected'),id);
 assert.equal(norm(await map.locator('[data-map-name]').innerText()),lang==='ja'?ja.prefectures[id].name:region.name);
 assert.equal(norm(await map.locator('[data-map-count]').innerText()),lang==='ja'?`${regionItems(id).length}点のジュエリー`:`${regionItems(id).length} ${regionItems(id).length===1?'piece':'pieces'}`);
 assert.equal(await map.locator('[data-map-destination]').getAttribute('href'),pathname(lang,`places/${id}/`));
 for(const node of await map.locator('[data-map-product-link],[data-map-product-title]').all())assert.equal(await node.getAttribute('href'),pathname(lang,`objects/${product.slug}/`));
 assert.equal(norm(await map.locator('[data-map-product-title]').innerText()),lang==='ja'?ja.products[product.id].title:product.title);
 assert.equal(norm(await map.locator('[data-map-price]').innerText()),norm(expectedPrice(product,lang)));
 const img=map.locator('[data-map-image]');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
 assert.equal(await img.getAttribute('src'),base+image.path);assert.equal(await img.getAttribute('alt'),image.alt[lang]);
 const rendered=await img.evaluate(el=>({loaded:el.complete&&el.naturalWidth>0,fit:getComputedStyle(el).objectFit,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));assert.ok(rendered.loaded&&rendered.fit==='contain'&&rendered.width>0&&rendered.height>0);
 assert.equal(norm(await map.locator('figcaption').innerText()),lang==='ja'?'AIイメージ':'AI image');
 assert.equal(await map.locator('[data-map-choice][aria-current=true]').getAttribute('data-map-choice'),id);
 report.selectionChecks++;
 return {prefecture:id,product:product.id,price:expectedPrice(product,lang),image:image.path};
}
async function pointOnPath(control){
 await control.scrollIntoViewIfNeeded();
 return control.locator('path').evaluate(path=>{
  const box=path.getBBox(),viewport=path.closest('[data-map-viewport]'),anchor=path.closest('a');
  if(!viewport||!anchor)throw Error('Missing scroll viewport or link');
  let chosen;
  for(const grid of [8,16,32,64,128]){for(let y=1;y<grid&&!chosen;y++)for(let x=1;x<grid;x++){const p=new DOMPoint(box.x+box.width*x/grid,box.y+box.height*y/grid);if(path.isPointInFill(p)){chosen=p;break;}}if(chosen)break;}
  if(!chosen)throw Error('No interior point in prefecture');
  let matrix=path.getScreenCTM();if(!matrix)throw Error('SVG matrix unavailable');
  const rect=viewport.getBoundingClientRect(),screen=chosen.matrixTransform(matrix);
  viewport.scrollBy({left:screen.x-(rect.left+rect.width/2),top:screen.y-(rect.top+rect.height/2),behavior:'instant'});
  matrix=path.getScreenCTM();let point=chosen.matrixTransform(matrix);
  if(point.y<50||point.y>innerHeight-50){window.scrollBy({top:point.y-innerHeight/2,left:0,behavior:'instant'});matrix=path.getScreenCTM();point=chosen.matrixTransform(matrix);}
  const hit=document.elementFromPoint(point.x,point.y);
  if(!hit||!anchor.contains(hit))throw Error('The filled-path click point is obscured or not inside its native anchor');
  if(point.x<0||point.y<0||point.x>=innerWidth||point.y>=innerHeight)throw Error('The filled-path click point is outside the viewport');
  return{x:point.x,y:point.y,prefecture:anchor.getAttribute('data-map-choice')};
 });
}
async function regionPage(page,id,lang){
 assert.equal(new URL(page.url()).pathname,pathname(lang,`places/${id}/`));
 assert.equal(await page.locator(`[data-regional-choice="${id}"]`).count(),1);
 const ids=await page.locator('.product-grid').first().locator('[data-product-card]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-product-id')).sort());
 assert.deepEqual(ids,regionItems(id).map(p=>p.id).sort(),'A direct map link must land on that prefecture’s actual jewelry.');
 report.nativeNavigations++;
 return {prefecture:id,products:ids.length,url:page.url()};
}
async function navigate(page,id,lang,action){
 await Promise.all([page.waitForURL(u=>u.pathname===pathname(lang,`places/${id}/`),{waitUntil:'domcontentloaded'}),action()]);
 await page.waitForLoadState('networkidle');return regionPage(page,id,lang);
}
async function back(page,lang,route){
 await page.goBack({waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle');
 assert.equal(new URL(page.url()).pathname,pathname(lang,route));await expect(page.locator('[data-region-selection] [data-japan-map]')).toHaveCount(1);
}
async function zoom(map,level){
 const viewport=map.locator('[data-map-viewport]'),drawing=map.locator('[data-map-drawing]');
 while(Number(await viewport.getAttribute('data-map-zoom'))<level)await map.locator('[data-map-zoom-in]').click();
 while(Number(await viewport.getAttribute('data-map-zoom'))>level)await map.locator('[data-map-zoom-out]').click();
 await expect.poll(async()=>Number(await viewport.getAttribute('data-map-zoom'))).toBe(level);
 const dimensions=await viewport.evaluate(el=>({width:el.clientWidth,height:el.clientHeight,scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight})),draw=await drawing.boundingBox();
 assert.ok(draw&&draw.width>=dimensions.width*level-3&&draw.height>=dimensions.height*level-3,'Zoom enlarges actual drawing within the viewport.');
 return{level,viewport:dimensions,drawing:{width:draw.width,height:draw.height}};
}
try{
 await check('Validated local geography has47 distinct safe prefecture paths',async()=>{assert.equal(geometry.prefectures.length,47);assert.equal(new Set(geometry.prefectures.map(p=>p.id)).size,47);assert.deepEqual(geometry.prefectures.map(p=>p.code),Array.from({length:47},(_,i)=>'JP-'+String(i+1).padStart(2,'0')));for(const p of geometry.prefectures)assert.match(p.d,/^[MmLlHhVvCcSsQqTtAaZz0-9eE,.\s+-]+$/);assert.equal(geometry.source.license,'CC0-1.0');return {paths:47,license:geometry.source.license};});
 for(const lang of ['ja','en'])for(const width of [320,390,1440]){
  const c=await context({viewport:{width,height:width===1440?1000:844},locale:lang==='ja'?'ja-JP':'en-US'});
  const page=await c.newPage();
  for(const route of ['','objects/','places/']){
   const key=`${lang}/${route||'home'}/${width}`;
   let map;
   await check(key+' structure and route membership',async()=>{
    const response=await page.goto(origin+pathname(lang,route),{waitUntil:'networkidle'});assert.equal(response.status(),200);
    map=page.locator('[data-region-selection] [data-japan-map]');assert.equal(await map.count(),1);assert.equal(await map.getAttribute('data-map-enhanced'),'true');
    assert.deepEqual((await page.locator('[data-region-group=ranked] [data-region-row]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-region-row')))),topTen);
    assert.deepEqual(await page.locator('[data-region-group=additional] [data-region-row]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-region-row'))),picks);
    const order=await page.locator('[data-region-selection]').evaluate(root=>{const rank=root.querySelector('[data-region-group=ranked]'),map=root.querySelector('[data-japan-map]'),extra=root.querySelector('[data-region-group=additional]');return !!(rank&&map&&extra&&(rank.compareDocumentPosition(map)&Node.DOCUMENT_POSITION_FOLLOWING)&&(map.compareDocumentPosition(extra)&Node.DOCUMENT_POSITION_FOLLOWING))});assert.ok(order);
    assert.equal(await map.locator('svg path').count(),47);
    assert.deepEqual((await map.locator('[data-map-choice]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-map-choice')))).sort(),prefectureIds);
    assert.equal(await map.locator('[data-map-unlisted]').count(),47-prefectureIds.length);assert.equal(await map.locator('[data-map-unlisted] a').count(),0);
    assert.deepEqual((await map.locator('[data-map-select] option').evaluateAll(nodes=>nodes.map(n=>n.value))).sort(),prefectureIds);
    assert.deepEqual((await map.locator('[data-map-region-link]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-map-region-link')))).sort(),prefectureIds);
    for(const link of await map.locator('[data-map-choice],[data-map-region-link]').all()){const id=await link.getAttribute('data-map-choice')||await link.getAttribute('data-map-region-link');assert.equal(await link.getAttribute('href'),pathname(lang,`places/${id}/`))}
    const jump=page.locator('[data-map-jump]');const jumpBox=await jump.boundingBox();assert.ok(jumpBox.height>=44);await jump.click();assert.equal(new URL(page.url()).hash,'#'+await map.getAttribute('id'));
    return {prefectures:prefectureIds.length,unlisted:47-prefectureIds.length,discoveryRows:picks.length,topTenPreserved:true};
   });
   if(!map||await map.count()!==1)continue;
   await check(key+' compact Top10 images, fitting and total row height',async()=>{
    const rows=page.locator('[data-region-group=ranked] [data-region-row]');assert.equal(await rows.count(),10);const metrics=[];
    for(const row of await rows.all()){
     const id=await row.getAttribute('data-region-row'),piece=row.locator('[data-representative-product]'),productId=await piece.getAttribute('data-representative-product'),product=products.find(p=>p.id===productId),asset=editorialImages[productId];
     assert.ok(product?.prefectureIds.includes(id)&&asset,'Every thumbnail is an actual image from the represented prefecture.');
     const img=piece.locator('.region-selection-image-link img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
     assert.equal(await img.getAttribute('src'),base+asset.path);assert.equal(await img.getAttribute('alt'),asset.alt[lang]);
     const image=await img.evaluate(el=>{const b=el.getBoundingClientRect(),style=getComputedStyle(el);return{width:b.width,height:b.height,fit:style.objectFit,naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight,sourceWidth:Number(el.getAttribute('width')),sourceHeight:Number(el.getAttribute('height'))};});
     assert.ok(image.width>0&&image.height>0&&image.height<=(width<=720?110:180)+1,'Top10 thumbnails remain compact at this viewport.');
     assert.equal(image.fit,'contain');assert.equal(image.naturalWidth,asset.width);assert.equal(image.naturalHeight,asset.height);assert.equal(image.sourceWidth,asset.width);assert.equal(image.sourceHeight,asset.height);
     const b=await row.boundingBox();metrics.push({id,productId,rank:Number(await row.getAttribute('data-tourism-rank')),rowHeight:b.height,image});report.topTenImageChecks++;
    }
    assert.deepEqual(metrics.map(r=>r.id),topTen);assert.deepEqual(metrics.map(r=>r.rank),Array.from({length:10},(_,i)=>i+1));
    const totalRowHeight=metrics.reduce((n,r)=>n+r.rowHeight,0),imageMeanHeight=metrics.reduce((n,r)=>n+r.image.height,0)/metrics.length;
    const old=baseline?.measurements.find(r=>r.locale===lang&&r.width===width);let comparison;
    if(old){assert.deepEqual(old.rows.map(r=>r.id),topTen);assert.ok(imageMeanHeight<old.imageMeanHeight-1,'Mean thumbnail height is reduced from the verified old public version.');assert.ok(totalRowHeight<old.totalRowHeight,'The Top10 list takes less vertical space.');comparison={baseline:baselinePath,baselineRoute:old.route,oldImageMeanHeight:old.imageMeanHeight,imageHeightReductionPercent:Number((100*(1-imageMeanHeight/old.imageMeanHeight)).toFixed(1)),oldTotalRowHeight:old.totalRowHeight,totalRowHeightReductionPercent:Number((100*(1-totalRowHeight/old.totalRowHeight)).toFixed(1))};}
    report.compactScenes++;return{width,images:metrics.length,totalRowHeight,imageMeanHeight,rows:metrics,...(comparison?{comparison}:{})};
   });
   if(width===390)for(const id of prefectureIds)await check(key+' select '+id,async()=>{await map.locator('[data-map-select]').selectOption(id);return selection(map,id,lang)});
   await check(key+' keyboard, touch-equivalent targets and visible layout',async()=>{
    const control=map.locator('[data-map-choice=akita]');await control.focus();await selection(map,'akita',lang);
    const entered=await navigate(page,'akita',lang,()=>control.press('Enter'));await back(page,lang,route);map=page.locator('[data-region-selection] [data-japan-map]');
    const select=map.locator('[data-map-select]');await select.focus();await select.press('Home');await select.press('ArrowDown');await select.press('Enter');
    const current=await select.inputValue();assert.ok(prefectureIds.includes(current));await selection(map,current,lang);
    for(const node of [select,map.locator('[data-map-destination]')]){const box=await node.boundingBox();assert.ok(box.width>=44&&box.height>=44)}
    const details=map.locator('.map-destination-list');await details.locator('summary').click();for(const link of await map.locator('[data-map-region-link]').all()){const b=await link.boundingBox();assert.ok(b.width>=44&&b.height>=44)}await details.locator('summary').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
    assert.equal(await map.locator('[data-map-image]').evaluate(img=>getComputedStyle(img).objectFit),'contain');
    return {width,selectValue:current,overflow:false,nativeEnter:entered};
   });
   if(route==='places/'){
    await check(key+' enlarged drawing, zoom reset and native pointer navigation',async()=>{
     const viewport=map.locator('[data-map-viewport]');await expect(map.locator('[data-map-zoom-controls]')).toBeVisible();
     const initial=await zoom(map,1);if(width===1440)assert.ok(initial.viewport.height>=720,'Desktop map is materially larger than the old560px cap.');
     for(const name of ['in','out','reset']){const b=await map.locator(`[data-map-zoom-${name}]`).boundingBox();assert.ok(b&&b.width>=44&&b.height>=44,'Zoom controls have44px targets.');}
     const enlarged=await zoom(map,3);assert.ok(enlarged.viewport.scrollWidth>enlarged.viewport.width&&enlarged.viewport.scrollHeight>enlarged.viewport.height);
     await viewport.focus();await viewport.press('ArrowRight');await viewport.press('ArrowDown');
     assert.ok(await viewport.evaluate(el=>el.scrollTop>0||el.scrollLeft>0),'Zoomed map pans inside its own viewport.');
     await map.locator('[data-map-zoom-reset]').click();await expect.poll(()=>viewport.getAttribute('data-map-zoom')).toBe('1');
     const reset=await viewport.evaluate(el=>({left:el.scrollLeft,top:el.scrollTop}));assert.ok(reset.left<=1&&reset.top<=1,'Full overview reset restores its initial position.');
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.zoomCases++;
     if(width<768)await zoom(map,3);
     const point=await pointOnPath(map.locator('[data-map-choice=tokyo]'));
     const direct=await navigate(page,'tokyo',lang,()=>page.mouse.click(point.x,point.y));await back(page,lang,route);map=page.locator('[data-region-selection] [data-japan-map]');
     return{initial,enlarged,reset,direct,nativePointerPoint:point};
    });
    await check(key+' hover geography and axe',async()=>{if(Number(await map.locator('[data-map-viewport]').getAttribute('data-map-zoom'))>1)await map.locator('[data-map-zoom-reset]').click();const control=map.locator('[data-map-choice=kagoshima]'),point=await pointOnPath(control);await page.mouse.move(point.x,point.y);await selection(map,'kagoshima',lang);const result=await new AxeBuilder({page}).include('[data-japan-map]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.axeScreens++;report.axeViolations+=result.violations.length;assert.deepEqual(result.violations,[]);return {hover:'kagoshima',axeViolations:0};});
    await map.scrollIntoViewIfNeeded();const shot=`artifacts/${prefix}-${lang}-${width}.png`;await page.screenshot({path:shot});report.screenshots.push(shot);
   }
  }
  await c.close();
 }
 for(const lang of ['ja','en']){
  const c=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}),page=await c.newPage();
  await check(lang+' real touch zoom pan and direct prefecture navigation',async()=>{
   await page.goto(origin+pathname(lang,'places/'),{waitUntil:'networkidle'});let map=page.locator('[data-region-selection] [data-japan-map]');
   const first=await pointOnPath(map.locator('[data-map-choice=hokkaido]'));
   const direct=await navigate(page,'hokkaido',lang,()=>page.touchscreen.tap(first.x,first.y));
   await back(page,lang,'places/');map=page.locator('[data-region-selection] [data-japan-map]');
   if(Number(await map.locator('[data-map-viewport]').getAttribute('data-map-zoom'))>1)await map.locator('[data-map-zoom-reset]').tap();
   for(let i=0;i<3;i++)await map.locator('[data-map-zoom-in]').tap();
   const viewport=map.locator('[data-map-viewport]');await expect.poll(()=>viewport.getAttribute('data-map-zoom')).toBe('3');
   await viewport.scrollIntoViewIfNeeded();
   const b=await viewport.boundingBox(),before=await viewport.evaluate(el=>({x:el.scrollLeft,y:el.scrollTop}));assert.ok(b&&b.width>0&&b.height>0);
   const cdp=await c.newCDPSession(page),start={x:b.x+b.width*.65,y:b.y+b.height*.65};
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
   for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x-i*10,y:start.y-i*12}]});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
   await expect.poll(()=>viewport.evaluate(el=>({x:el.scrollLeft,y:el.scrollTop}))).not.toEqual(before);
   assert.equal(new URL(page.url()).pathname,pathname(lang,'places/'),'Panning must not accidentally activate a prefecture.');
   const after=await viewport.evaluate(el=>({x:el.scrollLeft,y:el.scrollTop}));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const tokyoPoint=await pointOnPath(map.locator('[data-map-choice=tokyo]'));
   const dense=await navigate(page,'tokyo',lang,()=>page.touchscreen.tap(tokyoPoint.x,tokyoPoint.y));report.mobilePanCases++;
   return{touch:true,direct,dense,pan:{before,after},noPreviewButtonRequired:true};
  });
  await c.close();
  const nojs=await context({viewport:{width:320,height:844},javaScriptEnabled:false}),np=await nojs.newPage();
  await check(lang+' noJS native map and complete destination links',async()=>{await np.goto(origin+pathname(lang,'places/'),{waitUntil:'networkidle'});let map=np.locator('[data-region-selection] [data-japan-map]');assert.equal(await map.locator('[data-map-select]').isVisible(),false);assert.equal(await map.locator('[data-map-zoom-controls]').isVisible(),false);assert.equal(await map.locator('[data-map-choice]').count(),prefectures.length);const point=await pointOnPath(map.locator('[data-map-choice=hokkaido]'));const direct=await navigate(np,'hokkaido',lang,()=>np.mouse.click(point.x,point.y));await back(np,lang,'places/');map=np.locator('[data-region-selection] [data-japan-map]');await map.locator('.map-destination-list summary').click();assert.equal(await map.locator('[data-map-region-link]').count(),prefectures.length);await navigate(np,'akita',lang,()=>map.locator('[data-map-region-link=akita]').click());return {noJS:true,links:prefectures.length,directSvg:direct,listTarget:'places/akita/'};});
  await nojs.close();
 }
 await check('No application/browser errors or external connections',async()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.externalRequests,[]);return {pageErrors:0,consoleErrors:0,externalRequests:0};});
 report.sourceInputs.finished=await hash();await check('All tested inputs remained unchanged',async()=>assert.deepEqual(report.sourceInputs.finished,report.sourceInputs.started));
}finally{await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,regions:prefectureIds.length,geographicShapes:47,locales:2,surfaces:3,viewports:3,selectionChecks:report.selectionChecks,nativeNavigations:report.nativeNavigations,zoomCases:report.zoomCases,mobilePanCases:report.mobilePanCases,compactScenes:report.compactScenes,topTenImageChecks:report.topTenImageChecks,axeScreens:report.axeScreens,axeViolations:report.axeViolations,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length};await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));if(report.failures.length)process.exitCode=1;}
