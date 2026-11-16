import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/market-stage-browser-results.json';
const screenshotPrefix=(process.env.CHECK_SCREENSHOT_PREFIX||'market-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const published=catalog.products.filter(product=>product.publishStatus==='published');
const dual=published.filter(product=>product.localizedPrices?.ja&&product.priceCurrency!=='JPY');
const specialIds=['cocoon-ori-nonhole-earrings','hamamatsuya-catch-pierced'];
const targets=[...dual,...specialIds.map(id=>published.find(product=>product.id===id))];
assert.ok(dual.length>=9,'The actual dual-market products must be included.');
assert.ok(targets.every(Boolean),'A required unknown or single-market product is missing.');
const normalize=value=>value.replace(/\s+/g,' ').trim();
const route=(locale,path='')=>origin+base+locale+'/'+path;

// Oracle uses the researched raw data, not the UI price helper or localized catalog.
function japanPrice(product){
 const local=product.localizedPrices?.ja;
 if(local)return {amount:local.amount,currency:local.currency,checkedAt:local.checkedAt};
 return product.priceAmount!==null&&product.priceCurrency==='JPY'?{amount:product.priceAmount,currency:'JPY',checkedAt:product.priceCheckedAt}:null;
}
function overseasPrice(product){return product.priceAmount!==null&&product.priceCurrency&&product.priceCurrency!=='JPY'?{amount:product.priceAmount,currency:product.priceCurrency,checkedAt:product.priceCheckedAt}:null}
function format(expected,locale){return normalize(new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:expected.currency,currencyDisplay:'code',minimumFractionDigits:Number.isInteger(expected.amount)?0:2,maximumFractionDigits:expected.currency==='JPY'?0:2}).format(expected.amount))}
function officialURLs(product,market){
 const wanted=market==='japan'?'ja':'en';
 return catalog.links.filter(link=>link.productId===product.id&&(!link.locale||link.locale===wanted)&&link.officialProductUrl).map(link=>new URL(link.officialProductUrl).href);
}
const report={checkedAt:new Date().toISOString(),origin,base,method:'Focused market-price verification against raw researched catalog values. English and Japanese at 1440, 390 and 320 px; all current dual-market products plus unknown and JPY-only examples. Checks visible price/currency/date, price-to-store destination pairing, sticky purchase meaning, language roundtrip, all product cards, the earrings comparison, Tokyo regional cards, representatives and the home hero. Also checks overflow and runs 18 accessibility scans with every axe rule enabled. Does not use the UI price helper to generate expected figures, open merchant checkouts, claim physical shelf prices, or perform currency conversion.',checks:[],pages:[],screenshots:[],failures:[],pageErrors:[],consoleErrors:[]};
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}};
async function assertMoney(locator,expected,locale){
 assert.equal(await locator.count(),1,'Each market needs one quoted amount in this price context.');
 const text=normalize(await locator.innerText());
 if(!expected){assert.doesNotMatch(text,/[0-9]|JPY|USD/,'Unknown price must not look like a calculated amount.');return {text,unknown:true}}
 assert.equal(text,format(expected,locale));
 assert.equal(await locator.getAttribute('data-price-currency'),expected.currency);
 assert.equal(Number(await locator.getAttribute('data-price-amount')),expected.amount);
 assert.equal(await locator.getAttribute('data-price-checked-at'),expected.checkedAt);
 return {text,...expected};
}
const quoted=(scope,market)=>scope.locator('[data-price-market="'+market+'"]');
function purchaseLinks(scope,market){return scope.locator('a[data-purchase-market="'+market+'"], [data-purchase-market="'+market+'"] a[href]')}
async function assertMarketLinks(scope,product,market){
 const links=purchaseLinks(scope,market);assert.ok(await links.count()>0,'Missing '+market+' purchase link for '+product.id);
 const allowed=officialURLs(product,market);assert.ok(allowed.length>0,'Expected source URL absent');
 const results=[];
 for(const link of await links.all()){
  const href=new URL(await link.getAttribute('href'),origin+base).href;
  assert.ok(allowed.includes(href),'A '+market+' quote must lead to its own official store: '+href);
  assert.equal((await link.getAttribute('rel')||'').split(/\s+/).includes('sponsored'),false,'Live links are still unapproved.');
  const advertised=await link.getAttribute('data-sponsored');if(advertised!==null)assert.equal(advertised,'false');
  results.push(href);
 }
 return results;
}
async function assertNoOverflow(page,width){const sizes=await page.evaluate(()=>({document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));assert.ok(sizes.document<=width+1&&sizes.body<=width+1,JSON.stringify(sizes));return sizes}
async function scanAxe(page,name){
 const result=await new AxeBuilder({page}).analyze();
 report.pages.push({name,url:page.url(),axeViolations:result.violations.map(v=>({id:v.id,impact:v.impact,tags:v.tags,nodes:v.nodes.map(node=>({target:node.target,html:node.html,failureSummary:node.failureSummary}))}))});
 assert.deepEqual(result.violations.map(v=>v.id),[]);
}
async function screenshot(page,name){
 for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(node=>node.decode())}
 await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();scrollTo(0,0)});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const path='artifacts/'+screenshotPrefix+'-'+name+'.png';await page.screenshot({path:resolve(root,path),fullPage:true});report.screenshots.push(path);
}
async function assertDomesticContextPrice(scope,product,locale){
 const expected=japanPrice(product),record=await assertMoney(quoted(scope,'japan'),expected,locale);
 if(expected)assert.match(await scope.innerText(),locale==='ja'?/国内|日本/:/Japan/);
 return record;
}
async function assertDetail(page,product,locale,width){
 const response=await page.goto(route(locale,'objects/'+product.slug+'/'),{waitUntil:'load'});assert.equal(response.status(),200);
 assert.equal(await page.locator('html').getAttribute('lang'),locale);
 const buy=page.locator('.purchase-buy');
 const primary=page.locator('[data-product-price]');
 const japan=await assertMoney(primary,japanPrice(product),locale);
 assert.equal(await primary.getAttribute('data-price-market'),'japan');
 assert.match(await buy.innerText(),locale==='ja'?/国内|日本/:/Japan/);
 const domestic=await assertMarketLinks(buy,product,'japan');
 const overseas=overseasPrice(product);
 let international=null;
 if(overseas){
  international=await assertMoney(quoted(buy,'international'),overseas,locale);
  assert.match(await buy.innerText(),locale==='ja'?/海外/:/International|Global|Overseas/);
  await assertMarketLinks(buy,product,'international');
  assert.doesNotMatch(await buy.innerText(),/at the current exchange rate|為替換算額です|現在の為替で計算/i,'Actual market prices must not be described as currency conversions.');
  assert.match(await buy.innerText(),locale==='ja'?/別ストア|換算額ではありません/:/different.*price|not a currency conversion|separate.*price/i);
 }else assert.equal(await quoted(buy,'international').count(),0,'Do not invent an overseas quote.');
 const inJapan=page.locator('a[data-price-visit-link]');
 assert.ok(await inJapan.count()>0,'Details need a direct store-guide entrance.');
 const destination=await inJapan.first().getAttribute('href');
 assert.ok(await page.locator(destination).count()>0,'The physical-store entrance needs an existing anchor.');
 const note=await buy.innerText();assert.doesNotMatch(note,/確定した店頭価格|guaranteed in-store price|tax-free price/i);
 const sticky=page.locator('[data-product-sticky-cta]');
 if(width<720&&await sticky.count()){
  await page.locator('details[data-product-details]').scrollIntoViewIfNeeded();await sticky.waitFor({state:'visible'});
  await assertMoney(quoted(sticky,'japan'),japanPrice(product),locale);
  const stickyLinks=await assertMarketLinks(sticky,product,'japan');
  assert.ok(stickyLinks.every(url=>domestic.includes(url)),'Sticky domestic price and CTA must stay on the primary domestic store.');
 }
 await assertNoOverflow(page,width);
 return {japan,international,domestic,storeAnchor:destination};
}

await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'narrow',width:320,height:740}]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});const page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:error.message}));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text(),resourceUrl:message.location().url})});
  for(const locale of ['en','ja']){
   await check(viewport.name+' '+locale+' home market prices',async()=>{
    const response=await page.goto(route(locale),{waitUntil:'load'});assert.equal(response.status(),200);
    const hero=page.locator('.selection-hero-product');const href=await hero.getAttribute('href');const heroProduct=published.find(product=>href.endsWith('/objects/'+product.slug+'/'));assert.ok(heroProduct);await assertDomesticContextPrice(hero,heroProduct,locale);
    const rows=page.locator('[data-representative-product]');
    for(const row of await rows.all()){const productId=await row.getAttribute('data-representative-product');const product=published.find(item=>item.id===productId);assert.ok(product);await assertDomesticContextPrice(row,product,locale)}
    await assertNoOverflow(page,viewport.width);await scanAxe(page,viewport.name+' '+locale+' home');
    return {representatives:await rows.count(),heroProduct:heroProduct.id};
   });
   await check(viewport.name+' '+locale+' all product cards keep Japan market pricing',async()=>{
    await page.goto(route(locale,'objects/#all-jewelry'),{waitUntil:'load'});const cards=page.locator('[data-product-card]');assert.equal(await cards.count(),published.length);
    for(const card of await cards.all()){
     const href=await card.locator('h3 a').getAttribute('href');const product=published.find(item=>href.endsWith('/objects/'+item.slug+'/'));assert.ok(product);await assertDomesticContextPrice(card,product,locale);
     await assertMarketLinks(card,product,'japan');
    }
    const comparison=page.locator('table tbody tr');
    const comparisonProducts=published.filter(product=>product.productType.some(type=>type.includes('earrings')));
    assert.equal(await comparison.count(),comparisonProducts.length,'The earrings comparison must retain every listed earring, including unknown prices.');
    const comparisonIds=[];
    for(const row of await comparison.all()){
     const href=await row.locator('th a').getAttribute('href');const product=comparisonProducts.find(item=>href.endsWith('/objects/'+item.slug+'/'));assert.ok(product);comparisonIds.push(product.id);await assertMoney(quoted(row,'japan'),japanPrice(product),locale);
    }
    assert.deepEqual(comparisonIds.sort(),comparisonProducts.map(product=>product.id).sort(),'The comparison must not duplicate a known price or omit an unknown one.');
    await assertNoOverflow(page,viewport.width);await scanAxe(page,viewport.name+' '+locale+' all jewelry');
    const listing={cards:await cards.count(),comparisonRows:await comparison.count()};
    const regionalProducts=published.filter(product=>product.prefectureIds.includes('tokyo'));
    const regionalResponse=await page.goto(route(locale,'places/tokyo/'),{waitUntil:'load'});assert.equal(regionalResponse.status(),200);
    const regionalCards=page.locator('[data-product-card]');assert.equal(await regionalCards.count(),regionalProducts.length);
    const regionalIds=[];
    for(const card of await regionalCards.all()){
     const href=await card.locator('h3 a').getAttribute('href');const product=regionalProducts.find(item=>href.endsWith('/objects/'+item.slug+'/'));assert.ok(product);regionalIds.push(product.id);
     await assertDomesticContextPrice(card,product,locale);await assertMarketLinks(card,product,'japan');
    }
    assert.deepEqual(regionalIds.sort(),regionalProducts.map(product=>product.id).sort());await assertNoOverflow(page,viewport.width);
    return {...listing,regionalRoute:'places/tokyo/',regionalCards:await regionalCards.count()};
   });
   for(const product of targets)await check(viewport.name+' '+locale+' detail '+product.id,async()=>{
    const result=await assertDetail(page,product,locale,viewport.width);
    if(product.id==='rinzen-seika-amber-pierced-earrings'){
     await scanAxe(page,viewport.name+' '+locale+' RINZEN dual market');
     const before=normalize(await page.locator('[data-product-price]').innerText());const peer=locale==='ja'?'en':'ja';
     await page.locator('a.language-switch').click();await page.waitForURL(route(peer,'objects/'+product.slug+'/'));
     assert.equal(normalize(await page.locator('[data-product-price]').innerText()),before,'Changing display language must not silently change the primary purchase market.');
     await page.locator('a.language-switch').click();await page.waitForURL(route(locale,'objects/'+product.slug+'/'));
     await screenshot(page,locale+'-'+viewport.name+'-rinzen-market-prices');
    }
    return result;
   });
  }
  await context.close();
 }
 await check('No client errors during focused market checks',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[])});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;
 report.summary={checks:report.checks.length,passed:report.checks.filter(item=>item.status==='passed').length,failed:report.failures.length,dualMarketProducts:dual.length,productDetailChecks:targets.length*6,axeScreens:report.pages.length,axeViolations:report.pages.reduce((sum,item)=>sum+item.axeViolations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
