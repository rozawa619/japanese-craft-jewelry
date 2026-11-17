/** Read-only geographic browsing regression. Use a stable build; never build
 * while this runs. The small SVG shapes have equivalent 44px+ select/list UI. */
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL to the stable local or hosted origin');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH to match that build');
const input=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(input.protocol)&&input.pathname==='/'&&!input.search&&!input.hash&&!input.username&&!input.password);
const origin=input.origin,parts=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/geography-stage-japan-map-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'geography-stage-japan-map').replace(/[^a-zA-Z0-9_-]/g,'-');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const [catalog,ja,images,geometry]=await Promise.all(['src/data/catalog.json','src/data/translations/ja.json','src/data/product-detail-images.json','src/data/japan-map-geometry.json'].map(read));
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
const paths=['src/components/JapanJewelryMap.astro','src/components/RegionSelection.astro','src/config/japan-map.ts','src/config/region-selection.ts','src/config/selection.ts','src/data/japan-map-geometry.json','src/data/catalog.json','src/data/translations/ja.json','src/data/product-detail-images.json'];
const hash=async()=>Object.fromEntries(await Promise.all(paths.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,method:'Independent raw catalog/localization/image registries and parsed display configuration supply expected membership, prices and routes. Fresh Chrome exercises stable built pages, all published destinations, hover/focus/select/touch, keyboard, noJS fallback and responsive accessibility. External requests are observed and aborted, never counted as live Google Maps tests.',limits:'Chrome emulation only; SVG small-area hit targets use an equivalent 44px+ select and destination list. Geography is a destination overview, not a navigation/boundary survey.',sourceInputs:{started:await hash()},checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],externalRequests:[],selectionChecks:0,axeScreens:0,axeViolations:0};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const norm=s=>s.replace(/\s+/g,' ').trim();
const pathname=(lang,route='')=>base+lang+'/'+route;
const regionItems=id=>products.filter(p=>p.prefectureIds.includes(id));
const chosen=id=>{const items=regionItems(id);return items.find(p=>p.id===representatives[id])||items[0]};
const expectedPrice=(product,lang)=>{const domestic=product.localizedPrices?.ja;const amount=domestic?.currency==='JPY'?domestic.amount:product.priceCurrency==='JPY'?product.priceAmount:null;assert.notEqual(amount,null);return new Intl.NumberFormat(lang==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:0}).format(amount)};
async function check(name,action){try{const detail=await action();report.checks.push({name,status:'passed',detail});}catch(error){report.checks.push({name,status:'failed',message:error.stack||String(error)});report.failures.push({name,message:error.stack||String(error)})}}
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
 return control.locator('path').evaluate(path=>{const box=path.getBBox(),matrix=path.getScreenCTM();if(!matrix)throw Error('SVG matrix unavailable');for(let grid=2;grid<=14;grid+=2)for(let y=1;y<grid;y++)for(let x=1;x<grid;x++){const p=new DOMPoint(box.x+box.width*x/grid,box.y+box.height*y/grid);if(path.isPointInFill(p)){const screen=p.matrixTransform(matrix);if(screen.x>=0&&screen.y>=0&&screen.x<innerWidth&&screen.y<innerHeight)return {x:screen.x,y:screen.y}}}throw Error('No visible interior point in prefecture');});
}
async function previewVisible(map,page){
 const box=await map.locator('[data-map-preview]').boundingBox(),height=await page.evaluate(()=>innerHeight);
 assert.ok(box&&box.y>=-1&&box.y+box.height<=height+1,'Explicit narrow-screen activation must reveal the whole preview before the test performs any helper scroll');
 return {top:box.y,bottom:box.y+box.height,viewportHeight:height};
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
    map=page.locator('[data-japan-map]');assert.equal(await map.count(),1);assert.equal(await map.getAttribute('data-map-enhanced'),'true');
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
   if(width===390)for(const id of prefectureIds)await check(key+' select '+id,async()=>{await map.locator('[data-map-select]').selectOption(id);return selection(map,id,lang)});
   await check(key+' keyboard, touch-equivalent targets and visible layout',async()=>{
    const control=map.locator('[data-map-choice=akita]');await control.focus();await control.press('Enter');if(width<=620)await previewVisible(map,page);await selection(map,'akita',lang);
    assert.equal(new URL(page.url()).pathname,pathname(lang,route));
    const select=map.locator('[data-map-select]');await select.focus();await select.press('Home');await select.press('ArrowDown');await select.press('Enter');
    const current=await select.inputValue();assert.ok(prefectureIds.includes(current));await selection(map,current,lang);
    for(const node of [select,map.locator('[data-map-destination]')]){const box=await node.boundingBox();assert.ok(box.width>=44&&box.height>=44)}
    const details=map.locator('.map-destination-list');await details.locator('summary').click();for(const link of await map.locator('[data-map-region-link]').all()){const b=await link.boundingBox();assert.ok(b.width>=44&&b.height>=44)}await details.locator('summary').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
    assert.equal(await map.locator('[data-map-image]').evaluate(img=>getComputedStyle(img).objectFit),'contain');
    return {width,selectValue:current,overflow:false};
   });
   if(route==='places/'){
    await check(key+' hover geography and axe',async()=>{const control=map.locator('[data-map-choice=kagoshima]'),point=await pointOnPath(control);await page.mouse.move(point.x,point.y);await selection(map,'kagoshima',lang);const result=await new AxeBuilder({page}).include('[data-japan-map]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report.axeScreens++;report.axeViolations+=result.violations.length;assert.deepEqual(result.violations,[]);return {hover:'kagoshima',axeViolations:0};});
    await map.scrollIntoViewIfNeeded();const shot=`artifacts/${prefix}-${lang}-${width}.png`;await page.screenshot({path:shot});report.screenshots.push(shot);
   }
  }
  await c.close();
 }
 for(const lang of ['ja','en']){
  const c=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}),page=await c.newPage();
  await check(lang+' real touch selection and destination navigation',async()=>{await page.goto(origin+pathname(lang,'places/'),{waitUntil:'networkidle'});const map=page.locator('[data-japan-map]'),point=await pointOnPath(map.locator('[data-map-choice=hokkaido]'));await page.touchscreen.tap(point.x,point.y);const visible=await previewVisible(map,page);await selection(map,'hokkaido',lang);await map.locator('[data-map-destination]').tap();await page.waitForURL(origin+pathname(lang,'places/hokkaido/'));assert.equal((await page.request.get(page.url())).status(),200);return {selected:'hokkaido',target:'places/hokkaido/',touch:true,previewVisibleBeforeHelperScroll:visible};});
  await c.close();
  const nojs=await context({viewport:{width:320,height:844},javaScriptEnabled:false}),np=await nojs.newPage();
  await check(lang+' noJS overview and complete destination links',async()=>{await np.goto(origin+pathname(lang,'places/'),{waitUntil:'networkidle'});const map=np.locator('[data-japan-map]');assert.equal(await map.locator('[data-map-select]').isVisible(),false);assert.equal(await map.locator('[data-map-choice]').count(),prefectures.length);await map.locator('.map-destination-list summary').click();assert.equal(await map.locator('[data-map-region-link]').count(),prefectures.length);await map.locator('[data-map-region-link=akita]').click();await np.waitForURL(origin+pathname(lang,'places/akita/'));assert.ok(await np.locator('h1').isVisible());return {noJS:true,links:prefectures.length,target:'places/akita/'};});
  await nojs.close();
 }
 await check('No application/browser errors or external connections',async()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.externalRequests,[]);return {pageErrors:0,consoleErrors:0,externalRequests:0};});
 report.sourceInputs.finished=await hash();await check('All tested inputs remained unchanged',async()=>assert.deepEqual(report.sourceInputs.finished,report.sourceInputs.started));
}finally{await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,regions:prefectureIds.length,geographicShapes:47,locales:2,surfaces:3,viewports:3,selectionChecks:report.selectionChecks,axeScreens:report.axeScreens,axeViolations:report.axeViolations,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length};await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));if(report.failures.length)process.exitCode=1;}
