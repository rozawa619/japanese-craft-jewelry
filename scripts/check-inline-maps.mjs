import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {reviewedMapEmbedUrl} from '../src/lib/map-embed-url.ts';

const origin=process.env.CHECK_BASE_URL||'http://127.0.0.1:4322';
const reportPath=process.env.CHECK_REPORT_PATH||'docs/visual-mobile-stage-maps-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-mobile-stage-map').replace(/[^a-zA-Z0-9_-]/g,'-');
const base='/'+(process.env.PUBLIC_BASE_PATH||'japanese-craft-jewelry').split('/').filter(Boolean).join('/')+'/';
const catalog=JSON.parse(await readFile('src/data/catalog.json','utf8'));
const visits=JSON.parse(await readFile('src/data/visits.json','utf8'));
const cases=['hamamatsuya-hatajuku-main','hakone-maruyama-main'];
const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh Chrome contexts with no existing profile. Only public map display controls are clicked; no forms, directions or retailer links are submitted. Screenshots are private QA evidence and are not site map assets.',checks:[],failures:[]};
await mkdir('artifacts',{recursive:true});
await mkdir(dirname(reportPath),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const externalGoogle=value=>/^https:\/\/([^/]+\.)?(google\.[^/]+|gstatic\.com|googleapis\.com|googleusercontent\.com)(?:\/|$)/i.test(value);
try{
 for(const storeId of cases)for(const locale of ['ja','en'])for(const width of [1440,320]){
  const entry=visits.products.find(e=>e.storeIds.includes(storeId));const product=catalog.products.find(p=>p.id===entry.productId);
  const context=await browser.newContext({viewport:{width,height:1000},locale:locale==='ja'?'ja-JP':'en-US'});
  const page=await context.newPage();const requests=[];const errors=[];
  page.on('request',r=>{if(externalGoogle(r.url()))requests.push({origin:new URL(r.url()).origin,path:new URL(r.url()).pathname})});
  page.on('pageerror',e=>errors.push(String(e)));
  const key=storeId+'-'+locale+'-'+width;
  try{
   const response=await page.goto(new URL(base+locale+'/objects/'+product.slug+'/',origin).href,{waitUntil:'networkidle',timeout:30000});assert.equal(response.status(),200);
   const csp=await page.locator('meta[http-equiv="Content-Security-Policy" i]').getAttribute('content');assert.match(csp,/frame-src https:\/\/www\.google\.com(?:;|$)/);
   const panel=page.locator('[data-store-id="'+storeId+'"] [data-inline-map]');assert.equal(await panel.count(),1);
   assert.equal(await panel.locator('iframe').count(),0);assert.equal(requests.length,0,'No Google request is allowed before the map action.');
   assert.equal(await panel.locator('[data-load-map]').isVisible(),true);assert.equal(await panel.locator('[data-close-map]').isHidden(),true);
   const localBefore=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage)}));
   const official=page.locator('[data-visit-guide] a[data-official-product-url], [data-visit-guide] a[data-official-home-url]');
   for(const link of await official.all())assert.equal(/https?:\/\//i.test(await link.innerText()),false,'Visible links should have readable names.');
   await panel.locator('[data-load-map]').focus();await page.keyboard.press('Enter');
   const iframe=panel.locator('iframe[data-inline-map-frame]');await iframe.waitFor({state:'visible'});assert.ok(reviewedMapEmbedUrl(await iframe.getAttribute('src')));
   const frame=iframe.contentFrame();await frame.locator('.gm-style').waitFor({state:'visible',timeout:30000});
   await frame.getByText(/©\s*\d{4}\s*Google|Map data.*©|地図データ.*©/).first().waitFor({timeout:30000});
   const body=await frame.locator('body').innerText();const attribution=body.split('\n').filter(s=>/©|Terms|利用規約|地図データ/.test(s));assert.ok(attribution.length>0);
   assert.ok(requests.some(r=>r.origin==='https://www.google.com'&&r.path==='/maps/embed'));
   const dimensions=await iframe.boundingBox();const expectedHeight=width<=720?210:230;assert.ok(Math.abs(Math.round(dimensions.height)-expectedHeight)<=2,'The nominal map height includes its 2px border.');if(width===1440)assert.ok(Math.abs(Math.round(dimensions.width)-320)<=2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'The map must fit a 320px page.');
   await frame.locator('body').evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))});
   await panel.scrollIntoViewIfNeeded();const screenshot='artifacts/'+prefix+'-'+key+'.png';await page.screenshot({path:screenshot,fullPage:false});
   await panel.locator('[data-close-map]').click();assert.equal(await panel.locator('iframe').count(),0);assert.equal(await panel.locator('[data-load-map]').isVisible(),true);assert.equal(await panel.locator('[data-load-map]').getAttribute('aria-expanded'),'false');
   const localAfter=await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage)}));assert.deepEqual(localAfter,localBefore,'Map choice must not be persisted by this site.');
   requests.length=0;await page.reload({waitUntil:'networkidle'});assert.equal(await panel.locator('iframe').count(),0);assert.equal(requests.length,0,'Reload must not restore a map or connect to Google.');
   assert.equal(errors.length,0);
   report.checks.push({key,status:'passed',dimensions,attribution,screenshot,initialGoogleRequests:0,reloadedGoogleRequests:0,closedIframeCount:0,ownStorageChanged:false,officialLinkNames:true});console.log('PASS '+key);
  }catch(error){const message=String(error);report.checks.push({key,status:'failed',message});report.failures.push({key,message});console.error('FAIL '+key+' '+message)}finally{await context.close()}
  await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 }
 // An edited or injected provider URL must not create an iframe even after a click.
 const context=await browser.newContext();const page=await context.newPage();const entry=visits.products.find(e=>e.storeIds.includes(cases[0]));const product=catalog.products.find(p=>p.id===entry.productId);
 try{await page.goto(new URL(base+'en/objects/'+product.slug+'/',origin).href);const panel=page.locator('[data-inline-map]').first();await panel.evaluate(e=>e.dataset.mapEmbed='https://www.google.com.evil.test/maps/embed?pb=!1m18!1m12!1m3!1d1000');await panel.locator('[data-load-map]').click();assert.equal(await panel.locator('iframe').count(),0);assert.equal(await page.locator('[data-map-action="search"]').first().isVisible(),true);report.checks.push({key:'untrusted-provider-rejected-with-fallback',status:'passed'});}catch(error){report.failures.push({key:'untrusted-provider-rejected-with-fallback',message:String(error)})}finally{await context.close()}
}finally{await browser.close();report.finishedAt=new Date().toISOString();await writeFile(reportPath,JSON.stringify(report,null,2)+'\n')}
if(report.failures.length)process.exitCode=1;
