// Reusable maintenance check; run from the repository root. See docs/verification-guide.md.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
if(existsSync('.env'))process.loadEnvFile('.env');
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'artifacts/maintenance-headings-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'maintenance-headings').replace(/[^a-zA-Z0-9_-]/g,'-');
const readJson=async path=>JSON.parse(await readFile(path,'utf8'));
const catalog=await readJson('src/data/catalog.json'),registry=await readJson('src/data/product-detail-images.json'),sourceData=await readJson('docs/research/sources.json');
const sources=Array.isArray(sourceData)?sourceData:sourceData.sources;
const config=await readFile('src/config/selection.ts','utf8');
const ids=[...(config.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/['"]([a-z0-9-]+)['"]/g)].map(m=>m[1]);assert.ok(ids.length);
const rank=new Map(ids.map((id,index)=>[id,index]));
const published=catalog.products.filter(p=>p.publishStatus==='published').sort((a,b)=>(rank.get(a.id)??9999)-(rank.get(b.id)??9999));
const regions=['kanagawa','tokyo'];
const inputPaths=['src/components/RegionalChoiceGuide.astro','src/components/TypeChoiceImage.astro','src/lib/type-choices.ts','src/data/catalog.json','src/data/product-detail-images.json','src/data/translations/ja.json','src/data/region-choice-notes.json','src/config/selection.ts','src/styles/global.css','docs/research/sources.json',...['en','ja'].flatMap(locale=>regions.map(region=>'src/content/places/'+(locale==='ja'?'ja/':'')+region+'.md'))];
const hashes=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,node:process.version,method:'Twelve real regional pages: Kanagawa/Tokyo, EN/JA, 320/390/1440px. Measure each visible h2 text character with DOM Range and group by physical line; JA390 final line must exceed two characters. Independently check catalog/editorial-order representatives, image decode/registry, JPY range/count, source disclosure/date/URLs, actual filter click/back, and overflow. Ordinary viewport screenshots, no stylesheet overrides or CSS-property mirror assertions.',sourceInputs:{started:await hashes()},checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],thumbChecks:0,sourceControls:0,queryRoundtrips:0};
const norm=value=>value.replace(/\s+/g,' ').trim();
const money=(amount,locale)=>norm(new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(amount));
const japanPrice=p=>p.localizedPrices?.ja?.currency==='JPY'?p.localizedPrices.ja.amount:p.priceCurrency==='JPY'?p.priceAmount:null;
const route=(locale,region)=>origin+base+locale+'/places/'+region+'/';
async function headingLines(heading){return heading.evaluate(el=>{
 const lines=[],walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
 while(node=walk.nextNode()){let offset=0;for(const character of node.textContent||''){
  const range=document.createRange();range.setStart(node,offset);range.setEnd(node,offset+character.length);offset+=character.length;
  const box=range.getBoundingClientRect();if(!box.height)continue;
  let line=lines.find(line=>Math.abs(line.top-box.top)<1);if(!line){line={top:box.top,text:''};lines.push(line);}line.text+=character;
 }}
 return lines.sort((a,b)=>a.top-b.top).map(line=>({top:line.top,text:line.text.trim()})).filter(line=>line.text);
});}
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const width of [320,390,1440])for(const locale of ['ja','en']){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},locale:locale==='ja'?'ja-JP':'en-US',reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  for(const region of regions){
   const name=locale+' '+width+' '+region;
   try{
    assert.equal((await page.goto(route(locale,region),{waitUntil:'load'})).status(),200);
    await page.evaluate(async()=>{await document.fonts.ready;});
    const section=page.locator('[data-regional-choice="'+region+'"]'),heading=section.locator('h2');
    assert.equal(await heading.innerText(),locale==='ja'?'この産地なら、何から選ぶ？':'Where would you start?');
    const actualLines=await headingLines(heading);
    const lastLineLength=[...actualLines.at(-1).text.replace(/\s/g,'')].length;
    if(locale==='ja'&&width===390)assert.ok(lastLineLength>2,JSON.stringify(actualLines));
    const local=published.filter(p=>p.prefectureIds.includes(region)),types=[...new Set(local.flatMap(p=>p.productType))],typeChecks=[];
    assert.deepEqual(await section.locator('[data-regional-type-choice]').evaluateAll(nodes=>nodes.map(n=>n.dataset.regionalTypeChoice)),types);
    const sourceBody=await readFile('src/content/places/'+(locale==='ja'?'ja/':'')+region+'.md','utf8');
    const sourceIds=JSON.parse(sourceBody.match(/^sourceIds:\s*(\[[^\r\n]*\])/m)[1]);
    const expectedSources=sources.filter(source=>sourceIds.includes(source.id));
    const disclosure=page.locator('[data-source-disclosure]');assert.equal(await disclosure.count(),1);assert.equal(await disclosure.evaluate(node=>node.open),false);
    await disclosure.locator('summary').click();assert.equal(await disclosure.evaluate(node=>node.open),true);
    const actualSources=await disclosure.locator('.source-list li').evaluateAll(nodes=>nodes.map(node=>({url:node.querySelector('a').getAttribute('href'),date:node.querySelector('time').getAttribute('datetime')})));
    assert.deepEqual(actualSources,expectedSources.map(source=>({url:source.url,date:source.checkedAt})));
    await disclosure.locator('summary').click();assert.equal(await disclosure.evaluate(node=>node.open),false);report.sourceControls++;
    for(const type of types){
     const items=local.filter(p=>p.productType.includes(type)),representative=items[0],image=registry[representative.id];
     const link=section.locator('[data-regional-type-choice="'+type+'"]'),figure=link.locator('[data-type-choice-product]');
     assert.equal(await figure.getAttribute('data-type-choice-product'),representative.id);assert.equal(await figure.getAttribute('data-type-choice-asset'),image.assetId);
     const img=figure.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());
     assert.equal(await img.getAttribute('src'),base+image.path);assert.equal(await img.getAttribute('alt'),image.alt[locale]);
     assert.deepEqual(await img.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight,fit:getComputedStyle(node).objectFit})),{width:image.width,height:image.height,fit:'contain'});
     assert.equal(norm(await figure.locator('figcaption').innerText()),locale==='ja'?'AIイメージ':'AI image');
     assert.equal(norm(await link.locator('strong span').innerText()),locale==='ja'?items.length+'点':items.length+' piece'+(items.length===1?'':'s'));
     const amounts=items.map(japanPrice).filter(amount=>typeof amount==='number'&&Number.isFinite(amount)).sort((a,b)=>a-b);
     const expectedRange=amounts.length?money(amounts[0],locale)+(amounts.at(-1)!==amounts[0]?' – '+money(amounts.at(-1),locale):''):locale==='ja'?'価格未確認':'Price not confirmed';
     assert.ok(norm(await link.locator('.regional-type-price').innerText()).includes(expectedRange));
     const href=new URL(await link.getAttribute('href'),page.url());assert.equal(href.origin,origin);assert.equal(href.pathname,base+locale+'/objects/');assert.equal(href.searchParams.get('prefecture'),region);assert.equal(href.searchParams.get('type'),type);assert.equal(href.hash,'#all-jewelry');
     await link.click();await page.waitForURL(url=>url.pathname===href.pathname&&url.searchParams.get('type')===type&&url.searchParams.get('prefecture')===region);
     const wanted=items.map(item=>item.id);
     await page.waitForFunction(ids=>JSON.stringify([...document.querySelectorAll('#object-results [data-product-card]:not([hidden])')].map(node=>node.dataset.productId))===JSON.stringify(ids),wanted,{timeout:7000});
     const actualIds=await page.locator('#object-results [data-product-card]:not([hidden])').evaluateAll(nodes=>nodes.map(node=>node.dataset.productId));assert.deepEqual(actualIds,wanted);
     await page.goBack({waitUntil:'load'});assert.equal(page.url(),route(locale,region));
     typeChecks.push({type,representative:representative.id,priceRange:expectedRange,ids:actualIds});report.thumbChecks++;report.queryRoundtrips++;
    }
    const dimensions=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    assert.ok(dimensions.document<=width+1&&dimensions.body<=width+1,JSON.stringify(dimensions));
    for(const element of await section.locator('h2,.regional-type-copy').all()){const box=await element.boundingBox();assert.ok(box&&box.x>=-1&&box.x+box.width<=width+1);}
    if(locale==='ja'&&width===390){
     await section.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
     await section.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
     const path='artifacts/'+prefix+'-ja-390-'+region+'.png';await page.screenshot({path,fullPage:false});report.screenshots.push(path);
    }
    report.checks.push({name,status:'passed',detail:{locale,width,region,actualLines,lastLineLength,dimensions,sourceIds,typeChecks}});
   }catch(error){report.checks.push({name,status:'failed',message:error.stack||String(error)});report.failures.push({name,message:error.stack||String(error)});}
  }
  await context.close();
 }
 report.sourceInputs.completed=await hashes();assert.deepEqual(report.sourceInputs.completed,report.sourceInputs.started);
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);
}catch(error){report.failures.push({name:'Global freeze and browser errors',message:error.stack||String(error)});}
finally{
 await browser.close();report.completedAt=new Date().toISOString();
 report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,thumbChecks:report.thumbChecks,sourceControls:report.sourceControls,queryRoundtrips:report.queryRoundtrips,ja390LineChecks:report.checks.filter(check=>check.detail?.locale==='ja'&&check.detail.width===390).length,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length){console.error(JSON.stringify(report.failures));process.exitCode=1;}
}

