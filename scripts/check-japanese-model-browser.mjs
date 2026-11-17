/** Release 023 browser coverage: verify rendered assets, never infer identity from pixels. */
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {assertStylingFigure} from './image-display-assertions.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const target=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4323');
const parts=(process.env.PUBLIC_BASE_PATH||'/japanese-craft-jewelry/').split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=resolve(root,process.env.CHECK_REPORT_PATH||'docs/japanese-models-stage-browser-results.json');
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'japanese-models-stage-browser').replace(/[^a-zA-Z0-9_-]/g,'-');
const hosted=!['localhost','127.0.0.1','[::1]'].includes(target.hostname);
const json=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
const catalog=await json('src/data/catalog.json');
const registry=await json('src/data/editorial-images.json');
const manifest=await json('docs/image-generation-japanese-v23.json');
const published=catalog.products.filter(product=>product.publishStatus==='published');
const replacementIds=new Set(manifest.images.map(image=>image.productId));
const retiredPaths=[...new Set(manifest.images.map(image=>image.replaces.publicPath.replace(/^public\//,'')))];
const representatives=new Set([
 'shimadzu-satsuma-kiriko-hikari-l-pendant',
 'yadome-akita-rice-silver-pierced-earrings',
 'sghr-kolmio-glass-ear-cuff',
 'simprich-reversible-topaz-ruby-chain-ring'
]);
const inputPaths=['src/data/catalog.json','src/data/editorial-images.json','src/components/EditorialImage.astro','docs/image-generation-japanese-v23.json'];
const digest=async path=>createHash('sha256').update(await readFile(resolve(root,path))).digest('hex');
const inputs=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async path=>[path,await digest(path)])));
const startedInputs=await inputs();
const report={
 checkedAt:new Date().toISOString(),origin:target.origin,base,hosted,
 method:'Fresh headless installed Chrome at390×844; real page.goto GET navigation of every published JA/EN product detail. Registry-oracle comparison of styling source, asset id, localized alt, width/height attributes, actual decoded intrinsic dimensions, full-frame ratio, contain fit and visible AI caption; per-page console/page exceptions and horizontal overflow. Four representative replacement figures only are captured. Hosted-only GET of every replaced public image requires404; local preview is explicitly skipped because fallback200 is not an availability test. No nationality/ethnicity/exact-age inference or real SKU reproduction claim; no merchant navigation or form submission.',
 scope:{browser:'installed Google Chrome, headless',viewport:{width:390,height:844},locales:['ja','en'],publishedProducts:published.length,expectedProductNavigations:published.length*2,uniqueRegistryImages:new Set(Object.values(registry).map(image=>image.path)).size,replacementProducts:replacementIds.size,oldImageUrls:retiredPaths.length},
 sourceInputs:{started:startedInputs},checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],externalRequests:[],retiredImages:[]
};
const check=async(name,fn)=>{
 try{const detail=await fn();report.checks.push({name,status:'passed',detail});}
 catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+' '+message);}
};
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 await check('Registry covers exactly the published catalog',()=>{
  assert.deepEqual(Object.keys(registry).sort(),published.map(product=>product.id).sort());
  assert.equal(manifest.images.length,22);assert.equal(retiredPaths.length,22);
  for(const id of representatives)assert.ok(replacementIds.has(id),'Representative must be a new replacement '+id);
  return {products:published.length,images:new Set(Object.values(registry).map(image=>image.path)).size};
 });
 const context=await browser.newContext({viewport:report.scope.viewport,reducedMotion:'reduce'});
 const page=await context.newPage();page.setDefaultTimeout(15000);
 page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:error.message}));
 page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()});});
 page.on('request',request=>{if(new URL(request.url()).origin!==target.origin)report.externalRequests.push({page:page.url(),url:request.url(),resourceType:request.resourceType()});});
 for(const locale of report.scope.locales)for(const product of published){
  const url=target.origin+base+locale+'/objects/'+product.slug+'/';
  await check(locale+' mobile styling '+product.id,async()=>{
   const errorStart={page:report.pageErrors.length,console:report.consoleErrors.length};
   const response=await page.goto(url,{waitUntil:'load',timeout:30000});
   assert.ok(response,'A real GET navigation must return a response');assert.equal(response.status(),200);
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   const figure=page.locator('.purchase-visual figure[data-editorial-asset]');
   const expected=registry[product.id];assert.deepEqual([expected.width,expected.height],[1536,1024]);
   const image=await assertStylingFigure(figure,expected,locale,url);
   assert.equal(image.objectFit,'contain');assert.equal(image.fullFrame,true);
   assert.equal(await page.locator('.purchase-visual [data-official-preview]').count(),0);
   const actualSrc=await figure.locator('img').getAttribute('src');
   assert.equal(new URL(actualSrc,url).pathname,base+expected.path,'Exact base-aware styling image source');
   const overflow=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
   assert.ok(overflow.document<=390+1&&overflow.body<=390+1,'Horizontal overflow '+JSON.stringify(overflow));
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const newPageErrors=report.pageErrors.slice(errorStart.page),newConsoleErrors=report.consoleErrors.slice(errorStart.console);
   assert.deepEqual(newPageErrors,[]);assert.deepEqual(newConsoleErrors,[]);
   if(locale==='ja'&&representatives.has(product.id)){
    const path='artifacts/'+prefix+'-'+product.id+'-ja-390.png';
    await mkdir(resolve(root,'artifacts'),{recursive:true});await figure.screenshot({path:resolve(root,path)});
    report.screenshots.push({path,url,productId:product.id,locale,kind:'styling figure including AI caption',recordedStyle:manifest.images.find(image=>image.productId===product.id).model.style});
   }
   return {url,method:'GET page.goto',status:response.status(),productId:product.id,locale,isNewReplacement:replacementIds.has(product.id),image,actualSrc,overflow,pageErrors:0,consoleErrors:0};
  });
  if(report.checks.length%20===1)console.log('Checked '+(report.checks.length-1)+'/'+(published.length*2)+' detail routes');
 }
 if(hosted)for(const path of retiredPaths)await check('Retired hosted image returns404 '+path,async()=>{
  const url=target.origin+base+path;const response=await context.request.get(url,{timeout:30000,failOnStatusCode:false,maxRedirects:0});
  const item={url,method:'GET Playwright APIRequestContext',status:response.status()};report.retiredImages.push(item);
  assert.equal(response.status(),404,'Old styling asset must no longer be served');return item;
 });
 else report.retiredImages.push({status:'skipped',reason:'Local Astro preview may return its fallback200 for absent assets. Hosted404 coverage is required after deployment.',urls:retiredPaths.map(path=>target.origin+base+path)});
 await check('No client exceptions or console errors across all detail navigations',()=>{
  assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);return {pageErrors:0,consoleErrors:0};
 });
 await check('Browser pass covered every product and localized route',()=>{
  const rows=report.checks.filter(row=>row.detail?.method==='GET page.goto');
  assert.equal(rows.length,published.length*2);assert.equal(new Set(rows.map(row=>row.detail.url)).size,published.length*2);
  assert.equal(rows.filter(row=>row.detail.isNewReplacement).length,replacementIds.size*2);
  assert.equal(report.screenshots.length,representatives.size);return {productDetailNavigations:rows.length,replacementNavigations:rows.filter(row=>row.detail.isNewReplacement).length};
 });
 await check('Browser QA inputs were unchanged during this run',async()=>{
  report.sourceInputs.completed=await inputs();assert.deepEqual(report.sourceInputs.completed,startedInputs);return {inputFiles:inputPaths.length};
 });
 await context.close();
}catch(error){report.failures.push({name:'browser runtime',message:error.stack||String(error)});}
finally{
 await browser.close();report.completedAt=new Date().toISOString();
 const routes=report.checks.filter(row=>row.detail?.method==='GET page.goto');
 report.summary={checks:report.checks.length,passed:report.checks.filter(row=>row.status==='passed').length,failed:report.failures.length,publishedProducts:published.length,productDetailNavigations:routes.length,newReplacementNavigations:routes.filter(row=>row.detail.isNewReplacement).length,locales:report.scope.locales,viewport:report.scope.viewport,uniqueImagesDecoded:new Set(routes.map(row=>row.detail.image.path)).size,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length,hostedRetired404Checks:report.retiredImages.filter(row=>row.status===404).length,localRetiredUrlsSkipped:hosted?0:retiredPaths.length};
 await mkdir(dirname(reportPath),{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));
 if(report.failures.length)process.exitCode=1;
}
