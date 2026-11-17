/** New national-expansion store records through the real mobile UI.
 * Run against a stable preview; never build while this check is running.
 * CHECK_BASE_URL must be an origin, PUBLIC_BASE_PATH must match that build.
 */
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {reviewedStoreMapEmbeds} from '../src/lib/store-map-embeds.ts';

assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL explicitly, for example http://127.0.0.1:4323');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH explicitly to match the stable build.');
const inputOrigin=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(inputOrigin.protocol));
assert.ok(inputOrigin.pathname==='/'&&!inputOrigin.search&&!inputOrigin.hash&&!inputOrigin.username&&!inputOrigin.password,'CHECK_BASE_URL must contain only an origin.');
const origin=inputOrigin.origin,baseParts=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/national-stage-new-maps-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'national-stage-new-maps').replace(/[^a-zA-Z0-9_-]/g,'-');
const readJson=async path=>JSON.parse(await readFile(path,'utf8'));
const [catalog,visits,manifest,acquisition]=await Promise.all(['src/data/catalog.json','src/data/visits.json','docs/image-generation-solo-v16.json','docs/research/national-map-embeds-v16.json'].map(readJson));
const productIds=manifest.images.map(image=>image.productId);
assert.ok(productIds.length>0,'The expansion manifest must contain adopted product images.');
assert.equal(new Set(productIds).size,productIds.length,'A product must not be counted twice through duplicate image entries.');
const cases=productIds.flatMap(productId=>{
 const product=catalog.products.find(p=>p.id===productId);
 assert.equal(product?.publishStatus,'published','Expansion product must be published: '+productId);
 const visit=visits.products.find(v=>v.productId===productId);
 assert.ok(visit?.storeIds.length,'Expansion product must have a verified visiting record: '+productId);
 return visit.storeIds.map(storeId=>{
  const store=visits.stores.find(s=>s.id===storeId),proof=acquisition.records.find(r=>r.storeId===storeId);
  assert.ok(store&&proof,'Store and independently acquired map proof required: '+storeId);
  const url=new URL(proof.url);
  assert.equal(url.origin,'https://www.google.com');assert.equal(url.pathname,'/maps/embed');
  assert.deepEqual([...url.searchParams.keys()],['pb'],'No copied third-party API key or extra provider parameter.');
  assert.ok(url.searchParams.get('pb')?.startsWith('!'));
  for(const locale of ['ja','en'])assert.equal(new URL(reviewedStoreMapEmbeds[storeId]?.[locale]).href,url.href,'Registry/acquisition mismatch: '+storeId+'/'+locale);
  return{product,store,expectedUrl:url.href};
 });
});
const inputPaths=['src/data/catalog.json','src/data/visits.json','src/lib/store-map-embeds.ts','src/components/VisitGuide.astro','docs/image-generation-solo-v16.json','docs/research/national-map-embeds-v16.json'];
const hashes=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async path=>[path,createHash('sha256').update(await readFile(path)).digest('hex')])));
const report={version:manifest.version,checkedAt:new Date().toISOString(),origin,base,viewport:{width:390,height:844},method:'One sequential fresh Chrome mobile context per new product/store and locale. Product IDs come from the adopted expansion image manifest; store identity and address come from raw visits, and the exact Google URL is checked independently against the acquisition record and registry. All external requests are intercepted and aborted before network fulfilment. The test opens/closes/reloads the actual map UI; no cart, retailer, directions or location action is submitted.',limits:'The Google provider document/tiles/attribution and geographical pin are not rendered in this test because external requests are intentionally aborted. Name/address and Share URL acquisition were checked separately in docs/research/national-map-embeds-v16.json. This is Chrome emulation, not physical iOS/Safari or current SKU shelf-stock verification.',sourceInputs:{started:await hashes()},expectedFlows:cases.length*2,checks:[],failures:[],screenshots:[]};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const normalize=value=>value.replace(/\s+/g,' ').trim();
const isGoogle=value=>{const host=new URL(value).hostname.toLowerCase();return /(^|\.)(google\.[a-z.]+|gstatic\.com|googleapis\.com|googleusercontent\.com)$/.test(host);};
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const{product,store,expectedUrl}of cases)for(const locale of ['ja','en']){
  const key=store.id+'-'+locale+'-390',attempts=[],pageErrors=[];let phase='initial';
  const context=await browser.newContext({viewport:report.viewport,isMobile:true,hasTouch:true,deviceScaleFactor:1,locale:locale==='ja'?'ja-JP':'en-US',serviceWorkers:'block'});
  // Observe writes as well as the resulting keys; no application storage is
  // created by this observer, and no third-party iframe document is loaded.
  await context.addInitScript(()=>{
   window.__nationalMapStorageWrites=[];
   for(const method of ['setItem','removeItem','clear']){
    const original=Storage.prototype[method];
    Storage.prototype[method]=function(...args){window.__nationalMapStorageWrites.push({method,key:args[0]??null});return original.apply(this,args)};
   }
  });
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.origin===origin){await route.continue();return;}
   attempts.push({phase,url:request.url(),resourceType:request.resourceType(),google:isGoogle(request.url()),action:'aborted'});
   await route.abort('blockedbyclient');
  });
  const page=await context.newPage();page.on('pageerror',error=>pageErrors.push(String(error)));
  const state=async()=>({
   ...await page.evaluate(()=>({localKeys:Object.keys(localStorage),sessionKeys:Object.keys(sessionStorage),cookie:document.cookie,storageWrites:window.__nationalMapStorageWrites||[],openSourceLists:document.querySelectorAll('details[data-source-disclosure][open]').length,sourceLists:document.querySelectorAll('details[data-source-disclosure]').length,iframes:document.querySelectorAll('iframe').length})),
   cookies:(await context.cookies(origin)).map(c=>({name:c.name,domain:c.domain})),
  });
  const assertPrivate=(snapshot,label)=>{
   assert.deepEqual(snapshot.localKeys,[],label+': own localStorage');assert.deepEqual(snapshot.sessionKeys,[],label+': own sessionStorage');
   assert.deepEqual(snapshot.storageWrites,[],label+': own Storage writes');assert.equal(snapshot.cookie,'',label+': document.cookie');assert.deepEqual(snapshot.cookies,[],label+': own cookies');
   assert.ok(snapshot.sourceLists>0,label+': sources retained');assert.equal(snapshot.openSourceLists,0,label+': sources initially closed and unchanged by maps');
  };
  try{
   const url=origin+base+locale+'/objects/'+product.slug+'/';
   const response=await page.goto(url,{waitUntil:'networkidle',timeout:45000});assert.equal(response.status(),200);
   const article=page.locator('[data-store-id="'+store.id+'"]');assert.equal(await article.count(),1,'One matching store card in this product.');
   assert.equal(normalize(await article.locator('h3').innerText()),normalize(store.name[locale]));
   const rows=await article.locator('.visit-meta > div').evaluateAll(elements=>elements.map(el=>({label:el.querySelector('dt')?.textContent?.trim(),value:el.querySelector('dd')?.textContent?.trim()})));
   const address=rows.find(row=>row.label===(locale==='ja'?'住所':'Address'))?.value;
   assert.equal(normalize(address||''),normalize(store.address[locale]),'Localized store address must belong to the same locator.');
   assert.equal(await article.locator('[data-store-official-url]').getAttribute('href'),store.officialStoreUrl);
   for(const [action,parameter]of [['search','query'],['directions','destination']]){
    const href=new URL(await article.locator('[data-map-action="'+action+'"]').getAttribute('href'));
    assert.equal(href.origin,'https://www.google.com');assert.equal(href.searchParams.get(parameter),store.mapQuery,'Map action targets the same store query.');
   }
   const panel=article.locator('[data-inline-map]');assert.equal(await panel.count(),1,'New store must expose its reviewed opt-in panel.');
   assert.equal(new URL(await panel.getAttribute('data-map-embed')).href,expectedUrl,'Panel must carry the matching reviewed store URL.');
   const initial=await state();assertPrivate(initial,'initial');assert.equal(initial.iframes,0);assert.equal(attempts.length,0,'No external attempt before explicit map display.');
   const open=panel.locator('[data-load-map]'),close=panel.locator('[data-close-map]');
   assert.equal(await open.isVisible(),true);assert.equal(await open.getAttribute('aria-expanded'),'false');assert.equal(await close.isHidden(),true);
   const controls=await open.getAttribute('aria-controls');assert.ok(controls);assert.equal(await article.locator('[data-map-canvas][id="'+controls+'"]').count(),1);
   phase='explicit-open';
   const embedRequest=page.waitForRequest(request=>request.url()===expectedUrl,{timeout:15000});
   await open.tap();await embedRequest;
   const iframe=panel.locator('iframe[data-inline-map-frame]');await iframe.waitFor({state:'visible',timeout:10000});
   assert.equal(await iframe.count(),1);assert.equal(await page.locator('iframe').count(),1);
   assert.equal(new URL(await iframe.getAttribute('src')).href,expectedUrl,'Created iframe URL must match the reviewed registry for this store.');
   const expectedTitle=(locale==='ja'?'地図：':'Map: ')+store.name[locale];assert.equal(await iframe.getAttribute('title'),expectedTitle);
   assert.equal(await iframe.locator('..').getAttribute('id'),controls,'The requested canvas contains this store iframe.');
   assert.equal(await open.getAttribute('aria-expanded'),'true');assert.equal(await close.isVisible(),true);
   const bounds=await iframe.boundingBox();assert.ok(bounds&&bounds.width>0&&bounds.width<=390&&bounds.height>0&&bounds.height<300,'Map stays small and within mobile width.');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No mobile horizontal overflow.');
   const opened=await state();assertPrivate(opened,'opened');
   assert.equal(attempts.filter(x=>x.phase==='explicit-open').length,1,'Only one external iframe navigation should be attempted.');
   assert.equal(attempts[0].url,expectedUrl);assert.equal(attempts[0].google,true);
   phase='closed';await close.tap();
   assert.equal(await panel.locator('iframe').count(),0);assert.equal(await open.isVisible(),true);assert.equal(await open.getAttribute('aria-expanded'),'false');
   const closed=await state();assertPrivate(closed,'closed');assert.equal(closed.iframes,0);
   // Use an ordinary phone viewport. A tall element screenshot can composite
   // sticky UI across the clipped element and is not a real viewport view.
   await panel.scrollIntoViewIfNeeded();
   await page.screenshot({path:'artifacts/'+prefix+'-'+key+'.png',fullPage:false,timeout:30000});report.screenshots.push('artifacts/'+prefix+'-'+key+'.png');
   const beforeReloadAttempts=attempts.length;phase='reload';await page.reload({waitUntil:'networkidle',timeout:45000});
   const reloaded=await state();assertPrivate(reloaded,'reload');assert.equal(reloaded.iframes,0);assert.equal(attempts.length,beforeReloadAttempts,'Reload must not restore the map or reconnect externally.');
   assert.equal(pageErrors.length,0,'No application page error.');
   report.checks.push({key,status:'passed',productId:product.id,storeId:store.id,locale,url,name:store.name[locale],address:store.address[locale],expectedEmbedUrl:expectedUrl,sourceLists:initial.sourceLists,initialIframeCount:0,openedIframeCount:1,closedIframeCount:0,reloadedIframeCount:0,initialExternalAttempts:0,explicitGoogleAttempts:1,reloadedExternalAttempts:0,allExternalRequestsAborted:true,ownStorageChanged:false,ownStorageWrites:0,cookiesWritten:0,dimensions:bounds,pageErrors,externalAttempts:attempts,screenshot:'artifacts/'+prefix+'-'+key+'.png',screenshotStage:'closed map placeholder in an ordinary390x844 viewport; no provider document rendered'});
   console.log('PASS '+key);
  }catch(error){const failure={key,status:'failed',productId:product.id,storeId:store.id,locale,message:String(error),pageErrors,externalAttempts:attempts};report.checks.push(failure);report.failures.push(failure);console.error('FAIL '+key+' '+String(error));}
  finally{await context.close();await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');}
 }
}finally{
 await browser.close();report.sourceInputs.finished=await hashes();
 report.sourceInputs.unchanged=JSON.stringify(report.sourceInputs.started)===JSON.stringify(report.sourceInputs.finished);
 if(!report.sourceInputs.unchanged)report.failures.push({key:'stable-source-inputs',message:'Source/data inputs changed during the run.'});
 report.finishedAt=new Date().toISOString();
 report.summary={expectedFlows:report.expectedFlows,checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,products:productIds.length,uniqueStores:new Set(cases.map(c=>c.store.id)).size,locales:2,initialExternalAttempts:report.checks.reduce((n,c)=>n+(c.externalAttempts||[]).filter(r=>r.phase==='initial').length,0),explicitGoogleAttempts:report.checks.reduce((n,c)=>n+(c.externalAttempts||[]).filter(r=>r.phase==='explicit-open'&&r.google).length,0),reloadExternalAttempts:report.checks.reduce((n,c)=>n+(c.externalAttempts||[]).filter(r=>r.phase==='reload').length,0),screenshots:report.screenshots.length,sourceInputsUnchanged:report.sourceInputs.unchanged};
 if(report.summary.checks!==report.expectedFlows)report.failures.push({key:'coverage',message:'Not every derived product/store/locale flow completed.'});
 report.summary.failed=report.failures.length;
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.summary);
}
if(report.failures.length)process.exitCode=1;
