import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'').split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const screenshotPrefix=(process.env.CHECK_SCREENSHOT_PREFIX||'destination-regions').replace(/[^a-zA-Z0-9_-]/g,'-');
const fullScreenshotPrefix=(process.env.CHECK_FULL_SCREENSHOT_PREFIX||screenshotPrefix).replace(/[^a-zA-Z0-9_-]/g,'-');
const focusOnly=process.env.CHECK_FOCUS_ONLY==='1';
const reportPath=resolve(root,process.env.CHECK_REPORT_PATH||'docs/destination-stage-regions-results.json');
const json=async file=>JSON.parse(await readFile(resolve(root,file),'utf8'));
const [catalog,registry,research]=await Promise.all([
 json('src/data/catalog.json'),json('src/data/editorial-images.json'),json('docs/research/tourism-top10-v9.json'),
]);
const published=catalog.products.filter(product=>product.publishStatus==='published');
// This expectation comes from the primary-source extraction, not the UI config.
const expectedRanking=[...research.ranking].sort((a,b)=>a.rank-b.rank);
assert.equal(expectedRanking.length,10,'The independently researched annual ranking must have ten entries.');
assert.deepEqual(expectedRanking.map(row=>row.rank),[1,2,3,4,5,6,7,8,9,10]);
const expectedOrder=expectedRanking.map(row=>row.prefectureId);
const additionalOrder=['ishikawa','saga'];
const route=(locale,path='')=>new URL(base+locale+'/'+path,origin).href;
const report={
 checkedAt:new Date().toISOString(),origin,base,mode:focusOnly?'focused crop and layout recheck':'full navigation check',
 method:focusOnly?'Focused fresh-Chrome layout recheck after CSS polish: EN/JA home/selection/regions at1440/390/320, independent source ranking, complete representative-image decoding, natural aspect ratio for preserveRatio desktop images, unsplit short region names, left/right placement, overflow and accessibility. Six regional row crops per language/viewport support manual visual review. Does not repeat the earlier full region/product click roundtrips or navigate to external sites.':'Fresh Chrome, read-only internal navigation. Ranking expectation is the separately researched JTA2025 final Table6-1 extraction, not the display configuration. EN/JA at1440/390/320; exact ten ranked destinations plus Ishikawa/Saga; every ranked region and its representative are actually clicked, followed and returned from. Images, AI labels, region association, minimum five local products, keyboard/language flow, overflow, accessibility and full-page home/selection screenshots. No retailer/map/source navigation, forms, account actions or applications.',
 research:{year:research.year,table:research.table,source:research.dataUrl,checkedAt:research.checkedAt},
 checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],
};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const check=async(name,action)=>{
 try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}
 catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}
};
const browser=await chromium.launch({channel:'chrome',headless:true});
const dimensions=async(page,width)=>{
 const result=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(result.document<=width+1&&result.body<=width+1,'Horizontal overflow: '+JSON.stringify(result));
 return result;
};
async function goto(page,url){
 const response=await page.goto(url,{waitUntil:'load'});
 assert.equal(response?.status(),200,url);
 return response;
}
async function clickAndWait(page,link,url,keyboard=false){
 if(keyboard){await link.focus();await page.keyboard.press('Enter')}else await link.click();
 await page.waitForURL(current=>current.pathname===new URL(url).pathname);
 assert.equal(new URL(page.url()).origin,new URL(url).origin,'Internal selection must stay on this site.');
}
async function imageLoads(image,expected){
 await image.scrollIntoViewIfNeeded();
 await image.evaluate(node=>node.decode());
 const dimensions=await image.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight}));
 assert.deepEqual(dimensions,{width:expected.width,height:expected.height});
 assert.ok(new URL(await image.getAttribute('src'),origin).pathname.endsWith('/'+expected.path));
 return dimensions;
}
async function inspectDirectory(page,locale,width){
 const directory=page.locator('[data-region-selection]');
 assert.equal(await directory.count(),1);
 const ranked=directory.locator('[data-region-group="ranked"] [data-region-row]');
 assert.equal(await ranked.count(),10,'All ten ranked destinations must have actual products.');
 assert.deepEqual(await ranked.evaluateAll(rows=>rows.map(row=>row.getAttribute('data-region-row'))),expectedOrder);
 const extra=directory.locator('[data-region-group="additional"] [data-region-row]');
 assert.deepEqual((await extra.evaluateAll(rows=>rows.map(row=>row.getAttribute('data-region-row')))).sort(),additionalOrder);
 assert.equal(await directory.locator('[data-region-row]').count(),12,'Do not hide the existing out-of-top-ten destinations.');
 assert.equal(await extra.evaluateAll(rows=>rows.filter(row=>row.hasAttribute('data-tourism-rank')).length),0,'Additional regions must not be given travel ranks.');
 const note=directory.locator('[data-tourism-ranking-note]');
 const noteText=await note.innerText();
 assert.ok(noteText.includes(String(research.year)));
 assert.match(noteText,locale==='ja'?/全目的/:/all.*purposes/i);
 assert.match(noteText,locale==='ja'?/複数回答/:/multiple answers/i);
 const citation=directory.locator('[data-tourism-ranking-sources] a');
 assert.equal(await citation.getAttribute('href'),research.dataUrl);
 assert.equal(await citation.getAttribute('target'),'_blank');
 assert.equal(await citation.isVisible(),false,'The metric stays visible; the source list opens on request.');
 const rows=[];
 for(const expected of expectedRanking){
  const row=directory.locator('[data-region-group="ranked"] [data-region-row="'+expected.prefectureId+'"]');
  assert.equal(Number(await row.getAttribute('data-tourism-rank')),expected.rank);
  const text=await row.innerText();
  assert.ok(text.includes(Number(expected.displayPercent).toFixed(1)+'%'),'Displayed visit rate differs from the primary-source extraction.');
  const local=published.filter(product=>product.prefectureIds.includes(expected.prefectureId));
  assert.ok(local.length>=5,'Each top-ten region needs at least five published products: '+expected.prefectureId);
  assert.equal(Number(await row.getAttribute('data-region-product-count')),local.length);
  const piece=row.locator('[data-representative-product]');
  assert.equal(await piece.count(),1);
  const productId=await piece.getAttribute('data-representative-product');
  assert.ok(local.some(product=>product.id===productId));
  const asset=registry[productId];assert.ok(asset,'Representative needs a reviewed image: '+productId);
  const figures=piece.locator('figure');assert.equal(await figures.count(),1,'Exactly one illustration belongs beside each destination.');
  assert.equal((await figures.locator('figcaption').innerText()).trim(),locale==='ja'?'AIイメージ':'AI image');
  const intrinsic=await imageLoads(figures.locator('img'),asset);
  const left=await row.locator('.region-selection-copy').boundingBox(),right=await piece.boundingBox();
  assert.ok(left&&right&&left.x+left.width<=right.x+1,'Keep the destination on the left and its representative on the right.');
  const imageLayout=await figures.locator('img').evaluate(node=>{const box=node.getBoundingClientRect(),style=getComputedStyle(node);return {width:box.width,height:box.height,objectFit:style.objectFit,objectPosition:style.objectPosition}});
  const regionNameLines=await row.locator('a[data-region-link]').evaluate(node=>{const text=[...node.childNodes].find(child=>child.nodeType===Node.TEXT_NODE&&child.textContent.trim());if(!text)return 0;const range=document.createRange();range.selectNodeContents(text);return range.getClientRects().length});
  if(focusOnly){
   assert.equal(regionNameLines,1,'A short prefecture name must not split inside the word: '+expected.prefectureId);
   if(width>=721&&asset.preserveRatio)assert.ok(Math.abs(imageLayout.width/imageLayout.height-asset.width/asset.height)<.01,'Preserve the reviewed complete image for pendant/cuff composition: '+productId);
  }
  rows.push({prefectureId:expected.prefectureId,rank:expected.rank,displayPercent:Number(expected.displayPercent).toFixed(1),productId,count:local.length,image:intrinsic,imageLayout,regionNameLines});
 }
 return {rows,additional:additionalOrder,dimensions:await dimensions(page,width)};
}
async function screenshot(page,file){
 for(const image of await page.locator('img').all()){
  await image.scrollIntoViewIfNeeded();await image.evaluate(node=>node.decode());
 }
 await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0)});
 await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 await page.screenshot({path:resolve(root,file),fullPage:true});report.screenshots.push(file);
}
try{
 for(const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'narrow',width:320,height:740}]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:error.message}));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()})});
  for(const locale of ['en','ja']){
   for(const [kind,path]of [['home',''],['selection','objects/'],['regions','places/']])await check(viewport.name+' '+locale+' '+kind+' shows the sourced ranked regional selection',async()=>{
    await goto(page,route(locale,path));
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const directory=await inspectDirectory(page,locale,viewport.width);
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    const violations=result.violations.map(violation=>({id:violation.id,impact:violation.impact,targets:violation.nodes.map(node=>node.target)}));
    assert.deepEqual(violations,[],'Accessibility regression in the region selection.');
    if((!focusOnly||process.env.CHECK_REFRESH_FULLPAGES==='1')&&(kind==='home'||kind==='selection'))await screenshot(page,'artifacts/'+fullScreenshotPrefix+'-'+locale+'-'+viewport.name+'-'+kind+'.png');
    if(focusOnly&&kind==='home')for(const prefectureId of ['chiba','fukuoka','kanagawa','nara','yamanashi','hokkaido']){
     const file='artifacts/'+screenshotPrefix+'-'+locale+'-'+viewport.name+'-'+prefectureId+'.png';
     await page.locator('[data-region-row="'+prefectureId+'"]').screenshot({path:resolve(root,file)});report.screenshots.push(file);
    }
    return {...directory,axeViolations:violations.length};
   });
   if(focusOnly)continue;
   for(const expected of expectedRanking)await check(viewport.name+' '+locale+' '+expected.prefectureId+' region and representative actually open and return',async()=>{
    const indexUrl=route(locale,'places/');
    await goto(page,indexUrl);
    const row=page.locator('[data-region-row="'+expected.prefectureId+'"]');
    const productId=await row.locator('[data-representative-product]').getAttribute('data-representative-product');
    const product=published.find(product=>product.id===productId);assert.ok(product);
    const regionalUrl=route(locale,'places/'+expected.prefectureId+'/');
    await clickAndWait(page,row.locator('a[data-region-link]'),regionalUrl);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const cards=page.locator('main .product-grid').first().locator('[data-product-card]');
    const local=published.filter(product=>product.prefectureIds.includes(expected.prefectureId));
    assert.equal(await cards.count(),local.length);
    assert.ok(await cards.count()>=2);
    const cardRegions=await cards.evaluateAll(cards=>cards.map(card=>(card.getAttribute('data-prefecture')||'').split(' ')));
    assert.ok(cardRegions.every(ids=>ids.includes(expected.prefectureId)),'A local collection must not claim unrelated products as local.');
    await dimensions(page,viewport.width);
    await page.goBack({waitUntil:'load'});assert.equal(new URL(page.url()).pathname,new URL(indexUrl).pathname);
    const representative=page.locator('[data-region-row="'+expected.prefectureId+'"] .region-selection-image-link');
    const productUrl=route(locale,'objects/'+product.slug+'/');
    await clickAndWait(page,representative,productUrl);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    assert.equal(await page.locator('[data-product-intro]').count(),1);
    const image=page.locator('.purchase-visual figure[data-editorial-asset]');assert.equal(await image.count(),1);
    assert.equal((await image.locator('figcaption').innerText()).trim(),locale==='ja'?'AIイメージ':'AI image');
    const intrinsic=await imageLoads(image.locator('img'),registry[productId]);
    await dimensions(page,viewport.width);
    await page.goBack({waitUntil:'load'});assert.equal(new URL(page.url()).pathname,new URL(indexUrl).pathname);
    assert.equal(await page.locator('[data-region-group="ranked"] [data-region-row]').count(),10);
    return {prefectureId:expected.prefectureId,localProducts:local.length,representative:productId,regionClicked:true,representativeClicked:true,returnedBothTimes:true,image:intrinsic};
   });
   await check(viewport.name+' '+locale+' keyboard navigation and same-page language roundtrip',async()=>{
    await goto(page,route(locale,'places/'));
    const expected=expectedRanking[0],regionalPath='places/'+expected.prefectureId+'/';
    await clickAndWait(page,page.locator('[data-region-row="'+expected.prefectureId+'"] a[data-region-link]'),route(locale,regionalPath),true);
    const peer=locale==='ja'?'en':'ja';
    await clickAndWait(page,page.locator('a.language-switch'),route(peer,regionalPath),true);
    assert.equal(await page.locator('html').getAttribute('lang'),peer);
    await clickAndWait(page,page.locator('a.language-switch'),route(locale,regionalPath),true);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const productLink=page.locator('main .product-grid').first().locator('[data-product-card] h3 a').first();
    const productUrl=new URL(await productLink.getAttribute('href'),page.url()).href;
    await clickAndWait(page,productLink,productUrl,true);
    const productPath=new URL(productUrl).pathname.replace(base+locale+'/','');
    await clickAndWait(page,page.locator('a.language-switch'),route(peer,productPath),true);
    assert.equal(await page.locator('html').getAttribute('lang'),peer);
    await clickAndWait(page,page.locator('a.language-switch'),route(locale,productPath),true);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    await dimensions(page,viewport.width);
    return {regionKeyboard:true,productKeyboard:true,regionLanguageRoundtrip:true,productLanguageRoundtrip:true};
   });
  }
  await context.close();
 }
 await check('No uncaught client errors or browser console errors during regional navigation',()=>{
  assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);
 });
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;
 report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,screenshots:report.screenshots.length,rankedRegions:expectedRanking.length,additionalRegions:additionalOrder.length,actualRegionAndRepresentativeRoundtrips:report.checks.filter(check=>check.status==='passed'&&check.detail?.returnedBothTimes).length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await mkdir(resolve(reportPath,'..'),{recursive:true});
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
