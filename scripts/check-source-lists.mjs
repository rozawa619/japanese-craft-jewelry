import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,sep} from 'node:path';
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4323').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'japanese-craft-jewelry').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const catalog=await read('src/data/catalog.json'),sources=await read('docs/research/sources.json'),evidence=await read('src/data/purchase-evidence.json'),visits=await read('src/data/visits.json');
const report={checkedAt:new Date().toISOString(),origin,method:'Chrome DOMParser checks canonical HTML with no scripts or external assets. Source, product, market and store dates stay within their closed disclosures. The purchase-route date sits beside the domestic purchase action.',pages:[],failures:[],sourceDisclosures:0,sourceRecords:0,productPages:0};
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
try{
 const sitemap=await page.request.get(origin+base+'sitemap.xml');assert.equal(sitemap.status(),200);
 const urls=[...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replace(new URL(m[1]).origin,origin));
 for(const url of urls){try{
  const response=await page.request.get(url);assert.equal(response.status(),200);
  const html=await response.text(),pathname=new URL(url).pathname;assert.ok(pathname.startsWith(base));
  const relative=pathname.slice(base.length),distRoot=resolve('dist');
  const local=resolve(distRoot,relative.endsWith('/')||!relative?relative+'index.html':relative);
  assert.ok(local.startsWith(distRoot+sep),'Expected output must stay inside dist.');
  const actualSha256=createHash('sha256').update(html).digest('hex');
  assert.equal(actualSha256,createHash('sha256').update(await readFile(local)).digest('hex'),'Served HTML must equal the final local build, including source scripts.');
  const parsed=await page.evaluate(html=>{
   const doc=new DOMParser().parseFromString(html,'text/html');
   const details=[...doc.querySelectorAll('details[data-source-disclosure]')];
   return {closed:details.every(n=>!n.hasAttribute('open')),nested:details.some(n=>n.parentElement?.closest('[data-source-disclosure]')),details:details.length,
    uncontainedDates:[...doc.querySelectorAll('time')].filter(n=>!n.closest('details[data-source-disclosure], [data-market-section="japan"] [data-purchase-evidence]')).length,
    uncontainedSources:[...doc.querySelectorAll('.source-list')].filter(n=>!n.closest('details[data-source-disclosure]')).length,
    sources:[...doc.querySelectorAll('.source-list li')].map(n=>({url:n.querySelector('a')?.getAttribute('href'),title:n.querySelector('a')?.textContent,date:n.querySelector('time')?.getAttribute('datetime')})),
    productSources:[...doc.querySelectorAll('#product-sources .source-list li')].map(n=>({url:n.querySelector('a')?.getAttribute('href'),title:n.querySelector('a')?.textContent,date:n.querySelector('time')?.getAttribute('datetime')})),
    productDate:doc.querySelector('#product-sources [data-information-checks] dl time')?.getAttribute('datetime'),
    marketDates:Object.fromEntries([...doc.querySelectorAll('#product-sources [data-market-check]')].map(n=>[n.getAttribute('data-market-check'),n.querySelector('time')?.getAttribute('datetime')])),
    purchase:doc.querySelector('[data-market-section="japan"] [data-purchase-evidence] time')?.getAttribute('datetime'),
    storeDates:Object.fromEntries([...doc.querySelectorAll('[data-store-information-checked]')].map(n=>[n.getAttribute('data-store-information-checked'),n.querySelector('time')?.getAttribute('datetime')])),
    visiblePriceDates:doc.querySelectorAll('[data-market-price-block] time').length};
  },html);
  assert.ok(parsed.closed);assert.equal(parsed.nested,false);assert.equal(parsed.uncontainedDates,0);assert.equal(parsed.uncontainedSources,0);assert.equal(parsed.visiblePriceDates,0);
  for(const row of parsed.sources)assert.ok(sources.some(s=>s.url===row.url&&row.title.includes(s.title)&&s.checkedAt===row.date),'Rendered source must retain the registered URL/title/date.');
  const product=catalog.products.find(p=>p.publishStatus==='published'&&new URL(url).pathname.endsWith('/objects/'+p.slug+'/'));
  if(product){
   for(const id of product.sourceIds){const s=sources.find(s=>s.id===id);assert.ok(s&&parsed.productSources.some(row=>row.url===s.url&&row.title.includes(s.title)&&row.date===s.checkedAt),'Product source missing '+id)}
   assert.equal(parsed.productDate,product.lastVerifiedAt);
   const japan=product.localizedPrices?.ja?.checkedAt??(product.priceCurrency==='JPY'?product.priceCheckedAt:null);
   assert.equal(parsed.marketDates.japan??null,japan);
   if(product.priceCurrency!=='JPY'&&product.priceAmount!==null)assert.equal(parsed.marketDates.international,product.priceCheckedAt);
   assert.equal(parsed.purchase,evidence.products.find(e=>e.productId===product.id).checkedAt);
   for(const id of visits.products.find(v=>v.productId===product.id).storeIds)assert.equal(parsed.storeDates[id],visits.stores.find(s=>s.id===id).checkedAt);
   report.productPages++;
  }
  report.sourceDisclosures+=parsed.details;report.sourceRecords+=parsed.sources.length;report.pages.push({url,status:'passed',sourceDisclosures:parsed.details,sourceRecords:parsed.sources.length,finalLocalHtmlSha256:actualSha256});
 }catch(error){report.pages.push({url,status:'failed'});report.failures.push({url,message:String(error)})}}
 assert.equal(report.productPages,catalog.products.filter(p=>p.publishStatus==='published').length*2);
}catch(error){report.failures.push({message:String(error)})}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.pages.length,passed:report.pages.filter(p=>p.status==='passed').length,failed:report.failures.length,htmlSha256Comparisons:report.pages.filter(p=>p.finalLocalHtmlSha256).length,productPages:report.productPages,sourceDisclosures:report.sourceDisclosures,sourceRecords:report.sourceRecords};
 await writeFile(process.env.CHECK_REPORT_PATH||'docs/visual-mobile-stage-sources-results.json',JSON.stringify(report,null,2)+'\n');console.log(report.summary);if(report.failures.length){console.error(report.failures.slice(0,3));process.exitCode=1}
}
