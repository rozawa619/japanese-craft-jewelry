// Reusable maintenance check; run from the repository root. See docs/verification-guide.md.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
if(existsSync('.env'))process.loadEnvFile('.env');
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'artifacts/maintenance-type-images-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'maintenance-type-images').replace(/[^a-zA-Z0-9_-]/g,'-');
const readJson=async file=>JSON.parse(await readFile(file,'utf8'));
const catalog=await readJson('src/data/catalog.json'),registry=await readJson('src/data/product-detail-images.json');
const config=await readFile('src/config/selection.ts','utf8');
const order=[...(config.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/['"]([a-z0-9-]+)['"]/g)].map(match=>match[1]);
assert.ok(order.length);
const rank=new Map(order.map((id,index)=>[id,index]));
const products=catalog.products.filter(p=>p.publishStatus==='published').sort((a,b)=>(rank.get(a.id)??9999)-(rank.get(b.id)??9999));
const regions=catalog.prefectures.filter(region=>products.some(product=>product.prefectureIds.includes(region.id)));
const sourcePaths=['src/data/catalog.json','src/data/product-detail-images.json','src/config/selection.ts','src/lib/type-choices.ts','src/components/TypeChoiceImage.astro','src/components/RegionalChoiceGuide.astro','src/pages/[lang]/index.astro','src/styles/global.css'];
const hashes=async()=>Object.fromEntries(await Promise.all(sourcePaths.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,node:process.version,sourceInputs:{started:await hashes()},method:'Independent raw catalog and editorial-ID ordering oracle; all active regions and home type entries, EN/JA at 320x844. No production selection helper imports. Verify actual representative membership/order, registered src/asset/alt/caption, decode/dimensions/contain, 44px link target and query/hash. No external navigation or map activation.',checks:[],failures:[],screenshots:[],imagesChecked:0,pageErrors:[],consoleErrors:[]};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const norm=text=>text.replace(/\s+/g,' ').trim();
async function inspect(link,type,items,locale,region){
 assert.equal(await link.count(),1);
 const expected=items[0];assert.ok(expected);
 const figure=link.locator('figure[data-type-choice-product]');
 assert.equal(await figure.count(),1);assert.equal(await figure.getAttribute('data-type-choice-product'),expected.id);
 assert.ok(expected.publishStatus==='published'&&expected.productType.includes(type));
 if(region)assert.ok(expected.prefectureIds.includes(region));
 const image=registry[expected.id];assert.ok(image);
 assert.equal(await figure.getAttribute('data-type-choice-asset'),image.assetId);
 const img=figure.locator('img[data-type-choice-image]');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
 assert.equal(await img.getAttribute('src'),base+image.path);
 assert.equal(await img.getAttribute('alt'),image.alt[locale]);
 assert.deepEqual(await img.evaluate(el=>({width:el.naturalWidth,height:el.naturalHeight,fit:getComputedStyle(el).objectFit})),{width:image.width,height:image.height,fit:'contain'});
 assert.equal(norm(await figure.locator('figcaption').innerText()),locale==='ja'?'AIイメージ':'AI image');
 const box=await link.boundingBox();assert.ok(box&&box.width>=44&&box.height>=44&&box.x>=-1&&box.x+box.width<=321,JSON.stringify(box));
 const href=new URL(await link.getAttribute('href'),origin);
 assert.equal(href.origin,origin);assert.equal(href.pathname,base+locale+'/objects/');assert.equal(href.searchParams.get('type'),type);assert.equal(href.hash,'#all-jewelry');
 assert.equal(href.searchParams.get('prefecture'),region||null);
 report.imagesChecked++;
 return {type,representative:expected.id,count:items.length,src:image.path,target:{width:box.width,height:box.height},href:href.href};
}
async function check(name,action){try{const detail=await action();report.checks.push({name,status:'passed',detail});}catch(error){report.checks.push({name,status:'failed',message:error.stack||String(error)});report.failures.push({name,message:error.stack||String(error)});}}
try{
 for(const locale of ['en','ja']){
  const context=await browser.newContext({viewport:{width:320,height:844},locale:locale==='ja'?'ja-JP':'en-US',reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  await check(locale+' home type image membership',async()=>{
   assert.equal((await page.goto(origin+base+locale+'/',{waitUntil:'load'})).status(),200);
   const types=['pierced-earrings','clip-on-earrings','necklace','ring','bracelet'];
   assert.deepEqual(await page.locator('[data-home-type-choice]').evaluateAll(nodes=>nodes.map(n=>n.dataset.homeTypeChoice)),types);
   const details=[];
   for(const type of types)details.push(await inspect(page.locator('[data-home-type-choice="'+type+'"]'),type,products.filter(p=>p.productType.includes(type)),locale));
   const shot='artifacts/'+prefix+'-'+locale+'-home-320.png';await page.locator('.kind-choices').screenshot({path:shot});report.screenshots.push(shot);
   return details;
  });
  for(const region of regions)await check(locale+' '+region.id+' regional type image membership',async()=>{
   assert.equal((await page.goto(origin+base+locale+'/places/'+region.id+'/',{waitUntil:'load'})).status(),200);
   const local=products.filter(p=>p.prefectureIds.includes(region.id));
   const types=[...new Set(local.flatMap(p=>p.productType))];
   const section=page.locator('[data-regional-choice="'+region.id+'"]');
   assert.deepEqual(await section.locator('[data-regional-type-choice]').evaluateAll(nodes=>nodes.map(n=>n.dataset.regionalTypeChoice)),types);
   const details=[];for(const type of types)details.push(await inspect(section.locator('[data-regional-type-choice="'+type+'"]'),type,local.filter(p=>p.productType.includes(type)),locale,region.id));
   if(region.id==='tokyo'){const shot='artifacts/'+prefix+'-'+locale+'-tokyo-320.png';await section.screenshot({path:shot});report.screenshots.push(shot);}
   return details;
  });
  await context.close();
 }
 await check('No browser exceptions',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);});
 await check('Selection and layout sources stayed unchanged',async()=>{report.sourceInputs.completed=await hashes();assert.deepEqual(report.sourceInputs.completed,report.sourceInputs.started);});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();
 report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,regions:regions.length,locales:2,imagesChecked:report.imagesChecked,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));if(report.failures.length){console.error(JSON.stringify(report.failures));process.exitCode=1;}
}

