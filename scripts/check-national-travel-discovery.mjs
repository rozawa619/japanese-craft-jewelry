import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {chromium} from '@playwright/test';

// Run against a stable local build. Retailer destinations are compared as
// URLs only. No shopping controls or live shop pages are opened.
const origin = new URL(process.env.CHECK_BASE_URL || 'http://127.0.0.1:4328').origin;
const segments = (process.env.PUBLIC_BASE_PATH ?? '/japanese-craft-jewelry/').split('/').filter(Boolean);
const base = '/' + segments.map(encodeURIComponent).join('/') + (segments.length ? '/' : '');
const reportPath = process.env.CHECK_REPORT_PATH || 'artifacts/national-035/national-travel-browser.json';
const locales = ['ja','en'];
const surfaces = ['', 'places/', 'objects/'];
const widths = [320,390,1440];
const introduced = [
 'miyagi','fukushima','ibaraki','tochigi','gunma','saitama','niigata','nagano','shizuoka','shiga',
 'hyogo','wakayama','okayama','yamaguchi','kagawa','ehime','kochi','nagasaki','miyazaki',
];
const readJson = async file => JSON.parse(await readFile(file,'utf8'));
const [geometry,catalog,portraits,details,purchases] = await Promise.all([
 'japan-map-geometry','catalog','editorial-images','product-detail-images','purchase-evidence',
].map(name=>readJson('src/data/'+name+'.json')));
const prefectures = geometry.prefectures.map(prefecture=>prefecture.id).sort();
const published = catalog.products.filter(product=>product.publishStatus==='published');
const productById = new Map(published.map(product=>[product.id,product]));
const purchaseByProduct = new Map(purchases.products.map(purchase=>[purchase.productId,purchase]));
const newProducts = introduced.flatMap(id=>published.filter(product=>product.prefectureIds.includes(id)));
const expectedPlace = (locale,id) => base+locale+'/places/'+id+'/';
const expectedProduct = (locale,slug) => base+locale+'/objects/'+slug+'/';
const url = (locale,route='') => origin+base+locale+'/'+route;
const pathname = (href,current) => new URL(href,current).pathname;
const evidenceStarts = '2026-11-24';
// In 0.29.2 the unavailable N-15 listing left Shimane with two published pieces.
const minimumPieces = prefecture => prefecture === 'shimane' ? 2 : 3;
const report = {checkedAt:new Date().toISOString(), origin, base, prefectures:prefectures.length,
 introducedPrefectures:introduced.length, checkedProductIds:[...new Set(newProducts.map(product=>product.id))],
 viewports:widths, checks:[], failures:[], screenshots:[]};

await mkdir(dirname(reportPath),{recursive:true});
const browser = await chromium.launch({channel:'chrome',headless:true});
const trackedContext = async options => {
 const context = await browser.newContext(options);
 const unexpected = [];
 const errors = [];
 context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
 await context.route('**/*',async route=>{
  const requestUrl = route.request().url();
  if (new URL(requestUrl).origin===origin || requestUrl.startsWith('data:')) await route.continue();
  else {unexpected.push(requestUrl); await route.abort();}
 });
 return {context,unexpected,errors};
};
const check = async (name,verify) => {
 try {
  const result = await verify();
  report.checks.push({name,status:'passed',...result});
 } catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  report.checks.push({name,status:'failed'});
  report.failures.push({name,message});
 }
};
const goto = async (page,location) => {
 const response = await page.goto(location,{waitUntil:'domcontentloaded'});
 assert.equal(response?.status(),200,location);
};
const noOverflow = async page =>
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow on '+page.url());
const hrefs = locator => locator.evaluateAll(links=>links.map(link=>link.href));
const withPage = async (locale,width,verify,javaScriptEnabled=true) => {
 const {context,unexpected,errors} = await trackedContext({
  locale:locale==='ja'?'ja-JP':'en-US',viewport:{width,height:width===1440?960:844},
  hasTouch:width<500,isMobile:width<500,javaScriptEnabled,
 });
 try {
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const result = await verify(page);
  assert.deepEqual(unexpected,[],'Unexpected requests to external sites');
  assert.deepEqual(errors,[],'Uncaught page errors');
  return result;
 } finally {await context.close();}
};

try {
 await check('Every prefecture meets the current published product minimum',async()=>{
  assert.equal(prefectures.length,47);
  assert.deepEqual([...new Set(published.flatMap(product=>product.prefectureIds))].sort(),prefectures);
  for (const id of prefectures) {
   const local = published.filter(product=>product.prefectureIds.includes(id));
   assert.ok(local.length>=minimumPieces(id),id+' needs at least '+minimumPieces(id)+' published products');
  }
  for (const id of introduced) assert.ok(newProducts.some(product=>product.prefectureIds.includes(id)),id);
 });

 for (const locale of locales) {
  await check(locale+' nationwide finder routes',()=>withPage(locale,1440,async page=>{
   for (const surface of surfaces) {
    await goto(page,url(locale,surface));
    const finder = page.locator('[data-travel-finder]');
    assert.equal(await finder.count(),1,surface);
    const directory = await finder.locator('[data-travel-prefecture-link]').evaluateAll(links=>
     links.map(link=>[link.dataset.travelPrefectureLink,link.pathname]));
    assert.deepEqual(directory.map(([id])=>id).sort(),prefectures,surface);
    for (const [id,path] of directory) assert.equal(path,expectedPlace(locale,id));
    if (!surface) {
     const mapLinks = await page.locator('[data-hero-choice]').evaluateAll(anchors=>
      anchors.map(anchor=>[anchor.getAttribute('data-hero-choice'),new URL(anchor.getAttribute('href'),location.href).pathname]));
     assert.deepEqual(mapLinks.map(([id])=>id).sort(),prefectures);
     for (const [id,path] of mapLinks) assert.equal(path,expectedPlace(locale,id));
    }
   }
   for (let offset=0;offset<prefectures.length;offset+=6) {
    await Promise.all(prefectures.slice(offset,offset+6).map(async id=>{
     const response = await page.request.get(origin+expectedPlace(locale,id),{maxRedirects:0});
     assert.equal(response.status(),200,id);
     const productCards = (await response.text()).match(/data-product-card(?:\s|>)/g) ?? [];
     assert.ok(productCards.length>=minimumPieces(id),id+' needs at least '+minimumPieces(id)+' visible product cards');
     await response.dispose();
    }));
   }
   return {surfaces:surfaces.length,prefecturePages:prefectures.length};
  }));

  for (const width of widths) await check(locale+' cascaded travel selection at '+width,()=>withPage(locale,width,async page=>{
   await goto(page,url(locale)+'?utm_source=check');
   const entry = page.locator('[data-region-hero] a[href="#travel-finder"]');
   const entryBox = await entry.boundingBox();
   assert.ok(entryBox && entryBox.height>=44 && entryBox.width>=44 && entryBox.y>=0 && entryBox.y+entryBox.height<=page.viewportSize().height,
    'The travel search link is a visible tap target in the initial viewport');
   await (width<500 ? entry.tap() : entry.click());
   assert.equal(new URL(page.url()).hash,'#travel-finder');
   const finder = page.locator('[data-travel-finder]');
   const controls = finder.locator('[data-travel-controls]');
   await controls.waitFor({state:'visible'});
   const region = controls.locator('[data-travel-region]');
   const prefecture = controls.locator('[data-travel-prefecture]');
   const area = controls.locator('[data-travel-area]');
   for (const field of [region,prefecture,area]) {
    const geometry = await field.evaluate(element=>({
     height:element.getBoundingClientRect().height,
     font:Number.parseFloat(getComputedStyle(element).fontSize),
     label:element.labels?.[0]?.textContent.trim(),
    }));
    assert.ok(geometry.height>=44 && geometry.font>=16 && geometry.label,JSON.stringify(geometry));
   }
   await region.selectOption('kansai');
   assert.equal(await prefecture.locator('option[value="kanagawa"]').count(),0);
   assert.equal(await prefecture.locator('option[value="kyoto"]').count(),1);
   assert.equal(await area.isDisabled(),true);
   await region.selectOption('metropolitan');
   const choices = await prefecture.locator('option').evaluateAll(options=>options.map(option=>option.value));
   assert.ok(choices.includes('tokyo') && choices.includes('kanagawa'),'Greater Tokyo includes both destinations');
   await prefecture.selectOption('tokyo');
   assert.equal(pathname(await finder.locator('[data-travel-destination]').getAttribute('href'),page.url()),expectedPlace(locale,'tokyo'));
   await prefecture.selectOption('kanagawa');
   const byArea = {};
   for (const id of ['hakone','kamakura']) {
    await area.selectOption(id);
    const destination = new URL(await finder.locator('[data-travel-destination]').getAttribute('href'),page.url());
    assert.equal(destination.pathname,expectedPlace(locale,'kanagawa'));
    assert.equal(destination.hash,'#area-'+id);
    const previews = finder.locator('[data-travel-product-links] a');
    const productLinks = await hrefs(previews);
    assert.ok(productLinks.length>=1 && productLinks.length<=3);
    assert.ok(productLinks.every(link=>new URL(link).pathname.startsWith(base+locale+'/objects/')));
    const previewTargets = await previews.evaluateAll(links=>links.map(link=>link.getBoundingClientRect().height));
    assert.ok(previewTargets.every(height=>height>=44),'Dynamically added product links have at least 44px touch targets');
    byArea[id] = productLinks;
   }
   assert.ok(byArea.hakone.every(link=>!byArea.kamakura.includes(link)),'Area previews show distinct items');
   const query = new URL(page.url());
   assert.equal(query.searchParams.get('utm_source'),'check');
   assert.equal(query.searchParams.get('travel-region'),'metropolitan');
   assert.equal(query.searchParams.get('travel-prefecture'),'kanagawa');
   assert.equal(query.searchParams.get('travel-area'),'kamakura');
   assert.equal(query.hash,'#travel-finder');
   await page.reload({waitUntil:'domcontentloaded'});
   await controls.waitFor({state:'visible'});
   assert.equal(await area.inputValue(),'kamakura','Restores the selected area after reload');
   await noOverflow(page);
   const screenshot = join(dirname(reportPath),locale+'-travel-finder-'+width+'.png');
   await finder.screenshot({path:screenshot});
   report.screenshots.push(screenshot);
   const nextLocale = locale==='ja'?'en':'ja';
   await page.locator('.language-switch:visible').first().click();
   await page.waitForURL(target=>target.pathname===base+nextLocale+'/',{waitUntil:'domcontentloaded'});
   await controls.waitFor({state:'visible'});
   assert.equal(new URL(page.url()).pathname,base+nextLocale+'/');
   assert.equal(await area.inputValue(),'kamakura','Retains selection across languages');
   await finder.locator('[data-travel-destination]').click();
   await page.waitForURL(target=>target.pathname===expectedPlace(nextLocale,'kanagawa'),{waitUntil:'domcontentloaded'});
   assert.equal(new URL(page.url()).pathname,expectedPlace(nextLocale,'kanagawa'));
   assert.equal(new URL(page.url()).hash,'#area-kamakura');
   const areaGroup = page.locator('[data-travel-area-group="kamakura"]');
   assert.ok(await areaGroup.isVisible());
   const link = areaGroup.locator('[data-travel-area-product]').first();
   const item = productById.get(await link.getAttribute('data-travel-area-product'));
   assert.ok(item);
   await link.click();
   await page.waitForURL(target=>target.pathname===expectedProduct(nextLocale,item.slug),{waitUntil:'domcontentloaded'});
   assert.equal(new URL(page.url()).pathname,expectedProduct(nextLocale,item.slug));
   assert.ok(await page.locator('[data-product-page]').isVisible());
   return {selectedArea:'kamakura',productId:item.id};
  }));

  await check(locale+' ordinary travel links without JavaScript at 390',()=>withPage(locale,390,async page=>{
   await goto(page,url(locale,'places/'));
   assert.equal(await page.locator('[data-travel-controls]').isVisible(),false);
   const directory = page.locator('[data-travel-directory]');
   if (await directory.getAttribute('open')===null) await directory.locator('summary').click();
   await directory.locator('[data-travel-prefecture-link="kanagawa"]').click();
   await page.waitForURL(target=>target.pathname===expectedPlace(locale,'kanagawa'),{waitUntil:'domcontentloaded'});
   assert.equal(new URL(page.url()).pathname,expectedPlace(locale,'kanagawa'));
   await page.locator('[data-travel-area-link="hakone"]').click();
   assert.equal(new URL(page.url()).hash,'#area-hakone');
   const link = page.locator('[data-travel-area-group="hakone"] [data-travel-area-product]').first();
   const item = productById.get(await link.getAttribute('data-travel-area-product'));
   assert.ok(item);
   await link.click();
   await page.waitForURL(target=>target.pathname===expectedProduct(locale,item.slug),{waitUntil:'domcontentloaded'});
   assert.equal(new URL(page.url()).pathname,expectedProduct(locale,item.slug));
   assert.ok(await page.locator('[data-product-page]').isVisible());
   await noOverflow(page);
   return {selectedArea:'hakone',productId:item.id};
  },false));

  for (const product of new Set(newProducts)) await check(locale+' verified listing '+product.id,()=>withPage(locale,390,async page=>{
   const purchase = purchaseByProduct.get(product.id);
   assert.equal(purchase?.kind,'online-order',product.id);
   assert.ok(purchase.checkedAt>=evidenceStarts,'Recent evidence for this release');
   const exactEntry = catalog.links.find(link=>link.id===purchase.linkId && link.productId===product.id);
   assert.ok(exactEntry?.officialProductUrl);
   assert.ok(purchase.listingSelection?.label[locale],'Exact option is recorded');
   const portrait = portraits[product.id], detail = details[product.id];
   assert.ok(portrait && detail,'Both reviewed AI images are registered');
   await goto(page,url(locale,'objects/'+product.slug+'/'));
   const buy = page.locator('[data-market-section="japan"]');
   const purchaseLink = buy.locator('[data-product-primary-cta] a[data-market-link-id="'+purchase.linkId+'"]');
   assert.equal(await purchaseLink.count(),1);
   assert.equal(new URL(await purchaseLink.getAttribute('href')).href,new URL(exactEntry.officialProductUrl).href);
   assert.equal(await purchaseLink.getAttribute('data-sponsored'),'false');
   assert.equal(await buy.locator('[data-purchase-evidence]').getAttribute('data-purchase-checked-at'),purchase.checkedAt);
   assert.equal(await buy.locator('[data-purchase-selection] .selected-label').innerText(),purchase.listingSelection.label[locale]);
   const price = buy.locator('[data-product-price]');
   assert.equal(await price.getAttribute('data-price-currency'),'JPY');
   assert.equal(Number(await price.getAttribute('data-price-amount')),product.priceAmount);
   for (const [attribute,image] of [['data-editorial-asset',portrait],['data-product-detail-asset',detail]]) {
    const figure = page.locator('figure['+attribute+'="'+image.assetId+'"]').first();
    const photo = figure.locator('img');
    assert.equal(await photo.getAttribute('alt'),image.alt[locale]);
    assert.equal(pathname(await photo.getAttribute('src'),page.url()),base+image.path.replace(/^\/+/,''));
    await photo.scrollIntoViewIfNeeded();
    assert.deepEqual(await photo.evaluate(async img=>{await img.decode();return [img.naturalWidth,img.naturalHeight];}),[image.width,image.height]);
    assert.match(await figure.locator('figcaption').innerText(),/AI/);
   }
   await noOverflow(page);
   return {productId:product.id,checkedOn:purchase.checkedAt};
  }));
 }
}finally{
 await browser.close();
 report.status = report.failures.length ? 'failed' : 'passed';
 await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
}
if (report.failures.length) {
 for (const {name,message} of report.failures) console.error(name+': '+message);
 process.exitCode = 1;
} else console.log('PASS '+report.checks.length+' checks for the 47-prefecture finder, narrow screens and verified product pages.');
