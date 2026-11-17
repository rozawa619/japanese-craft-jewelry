import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {assertVisitGuide} from './visit-assertions.mjs';
import {assertRegionSelection} from './region-selection-assertions.mjs';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {assertStylingFigure,assertPageStylingFigures} from './image-display-assertions.mjs';
import {assertPublicationMetadata} from './publication-metadata-assertions.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=process.env.CHECK_BASE_URL||'http://127.0.0.1:4321';
const screenshotPrefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-seo-stage-full').replace(/[^a-zA-Z0-9_-]/g,'-');
const base='/'+(process.env.PUBLIC_BASE_PATH||'').split('/').filter(Boolean).join('/')+((process.env.PUBLIC_BASE_PATH||'').split('/').filter(Boolean).length?'/':'');
const route=(locale,path='')=>new URL(base+locale+'/'+path,origin).href;
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const editorialImages=JSON.parse(await readFile(resolve(root,'src/data/editorial-images.json'),'utf8'));
const visits=JSON.parse(await readFile(resolve(root,'src/data/visits.json'),'utf8'));
const stories=JSON.parse(await readFile(resolve(root,'src/data/product-stories.json'),'utf8'));
const choiceNotes=JSON.parse(await readFile(resolve(root,'src/data/selection-notes.json'),'utf8'));
const japanese=JSON.parse(await readFile(resolve(root,'src/data/translations/ja.json'),'utf8'));
const sourcePaths=['src/data/catalog.json','src/data/translations/ja.json','src/data/product-stories.json','src/data/selection-notes.json','src/data/editorial-images.json','src/data/visits.json','src/config/selection.ts'];
const hashInputs=async()=>Object.fromEntries(await Promise.all(sourcePaths.map(async path=>[path,createHash('sha256').update(await readFile(resolve(root,path))).digest('hex')])));
const sourceInputs=await hashInputs();
const published=catalog.products.filter(product=>product.publishStatus==='published');
const activeRegions=catalog.prefectures.filter(region=>published.some(product=>product.prefectureIds.includes(region.id)));
const regionByKind=Object.fromEntries(activeRegions.map((region,index)=>['regionAdditional'+index,region.id]));
const titleLength=product=>Math.max(product.title.length,japanese.products[product.id]?.title?.length||0);
const longest=[...published].sort((a,b)=>titleLength(b)-titleLength(a))[0];
const storyLength=product=>Math.max(...['en','ja'].map(locale=>{const story=stories[product.id]?.[locale];return [story?.standfirst,story?.decision?.bestFor,story?.decision?.consider].join(' ').length}));
const wordiest=[...published].sort((a,b)=>storyLength(b)-storyLength(a))[0];
const longestPreview=[...published].filter(product=>!editorialImages[product.id]).sort((a,b)=>titleLength(b)-titleLength(a))[0];
const manualProductIds=new Set([longest?.id,wordiest?.id,longestPreview?.id].filter(Boolean));
const manualShotsTaken=new Set();
const firstSelection=published.find(product=>product.id==='hamamatsuya-catch-pierced')||published.find(product=>product.productType.includes('pierced-earrings'))||published[0];
const secondSelection=published.find(product=>product.id==='hamamatsuya-clip')||published.find(product=>product.productType.includes('clip-on-earrings')&&product.id!==firstSelection?.id)||published.find(product=>product.id!==firstSelection?.id);
const selected=[firstSelection,secondSelection];
if(selected.some(product=>!product))throw new Error('Two real published selections are required for the browser comparison.');
const selectedIds=selected.map(product=>product.id);
const featuredByKind={featurePierced:selected[0],featureClip:selected[1],...Object.fromEntries(published.filter(product=>editorialImages[product.id]&&!selectedIds.includes(product.id)).map((product,index)=>['featureAdditional'+index,product]))};
const unillustrated=Object.fromEntries(published.filter(product=>!editorialImages[product.id]).map((product,index)=>['productAdditional'+index,product]));
const routes={...Object.fromEntries(Object.entries(unillustrated).map(([kind,product])=>[kind,'objects/'+product.slug+'/'])),home:'',objects:'objects/',product:'objects/'+longest.slug+'/',...Object.fromEntries(Object.entries(featuredByKind).map(([kind,product])=>[kind,'objects/'+product.slug+'/'])),regions:'places/',...Object.fromEntries(Object.entries(regionByKind).map(([kind,id])=>[kind,'places/'+id+'/'])),craft:'crafts/hakone-yosegi/',policy:'editorial-policy/'};
const legacyTargets={"":"objects/","hakone-yosegi-pierced-earrings":"objects/hamamatsuya-surgical-stainless-pierced-earrings/","hakone-yosegi-non-pierced-earrings":"objects/hamamatsuya-yosegi-non-pierced-earrings/","everyday-craft-earrings":"objects/","pierced-or-clip-on":"objects/","buying-from-overseas":"objects/","understanding-yosegi":"crafts/hakone-yosegi/"};
const report={checkedAt:new Date().toISOString(),origin,base,sourceInputs:{started:sourceInputs},method:'Fresh headless Chrome with no existing user profile. EN/JA at 1440, 390 and 320px: all published products, every nonempty maker region from the actual catalog, product-specific decision and comparison copy, price/official destination pairing, native details, no-blog/no-Contact navigation, withdrawn Contact 404, all registered styling images and truthful OfficialPreview fallback, filters, language/query/hash and accessibility with every axe rule enabled. Source data hashes are compared at completion. Does not open retailer destinations or submit affiliate applications.',checks:[],pages:[],screenshots:[],pageErrors:[],consoleErrors:[],failures:[]};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}catch(error){const message=error instanceof Error?error.message:String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}};
async function screenshot(page,file){
 for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());}
 await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0)});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.screenshot({path:resolve(root,file),fullPage:true});report.screenshots.push(file);
}
async function switchTo(page,locale,path,keyboard=false){
 const toggle=page.locator('a.language-switch');
 assert.equal(await toggle.count(),1);
 assert.equal(await toggle.isVisible(),true);
 const expected=route(locale,path);
 if(keyboard){await toggle.focus();await page.keyboard.press('Enter')}else await toggle.click();
 await page.waitForURL(url=>url.pathname===new URL(expected).pathname);
 assert.equal(await page.locator('html').getAttribute('lang'),locale);
}
function expectedCount(filters){return published.filter(product=>(!filters.type||product.productType.includes(filters.type))&&(!filters.prefecture||product.prefectureIds.includes(filters.prefecture))&&(!filters.material||product.materialIds.includes(filters.material))&&(!filters.craft||product.craftIds.includes(filters.craft))).length}
function assertStylingDisclosure(caption,locale){
 assert.equal(caption.trim(),locale==='ja'?'AIイメージ':'AI image','The user requested a short, exact AI image label.');
}
async function assertStickyPurchaseAction(page,primary){
 const sticky=page.locator('[data-product-sticky-cta]').first();
 if(!await sticky.count())return {present:false};
 await page.evaluate(()=>window.scrollTo(0,0));
 if(page.viewportSize().width>=720){assert.equal(await sticky.isVisible(),false);return {present:true,desktopHidden:true}}
 await sticky.waitFor({state:'hidden'});
 await page.locator('details[data-product-details]').first().scrollIntoViewIfNeeded();
 await sticky.waitFor({state:'visible'});
 const link=sticky.locator('a[data-sponsored]').first();
 assert.equal(await link.getAttribute('href'),await primary.getAttribute('href'),'Sticky action must use the same approved/fallback destination as the primary action.');
 const width=page.viewportSize().width;
 const dimensions=await page.evaluate(()=>({document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(dimensions.document<=width+1&&dimensions.body<=width+1,'Visible sticky action must fit the viewport.');
 await page.locator('.site-footer').scrollIntoViewIfNeeded();
 await sticky.waitFor({state:'hidden'});
 await page.evaluate(()=>window.scrollTo(0,0));
 return {present:true,initiallyHidden:true,appearsAfterMainAction:true,hidesAtFooter:true,sameRetailerDestination:true};
}
async function assertProductFlow(page,locale,product){
 const intro=page.locator('[data-product-intro]').first();
 const price=page.locator('[data-product-price]').first();
 const details=page.locator('details[data-product-details]').first();
 const primary=page.locator('[data-product-primary-cta] a[data-sponsored], a[data-product-primary-cta][data-sponsored]').first();
 assert.equal(await intro.count(),1,'Product introduction needs a distinct customer-facing section.');
 assert.equal(await price.count(),1,'Product price must remain outside the technical disclosure.');
 assert.equal(await details.count(),1,'Technical details need a real keyboard-operable disclosure.');
 assert.equal(await details.evaluate(node=>node.open),false,'Technical details should not dominate the initial product introduction.');
 assert.equal(await primary.isVisible(),true,'The main retailer route must be rendered before technical details.');
 assert.equal(await price.isVisible(),true);
 const story=stories[product.id]?.[locale];
 assert.ok(story?.decision?.bestFor&&story?.decision?.consider,'A real published product needs its own localized decision.');
 const decision=page.locator('[data-product-decision]');
 assert.equal(await decision.count(),1);assert.equal(await decision.isVisible(),true);
 assert.equal((await decision.locator('[data-decision-best-for]').innerText()).trim(),story.decision.bestFor.trim());
 assert.equal((await decision.locator('[data-decision-consider]').innerText()).trim(),story.decision.consider.trim());
 assert.equal(await intro.evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('[data-product-decision]'))&Node.DOCUMENT_POSITION_FOLLOWING)),true,'The decision follows the product/price introduction.');
 assert.equal(await decision.evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('details[data-product-details]'))&Node.DOCUMENT_POSITION_FOLLOWING)),true,'Choice guidance must precede technical disclosures.');
 const method=decision.locator('a[data-selection-method]');assert.equal(await method.count(),1);
 assert.equal(new URL(await method.getAttribute('href'),page.url()).pathname,new URL(route(locale,'editorial-policy/')).pathname);
 const comparison=page.locator('[data-choice-details]');
 const comparisonIds=[product.id,...choiceNotes[product.id].compareWith];
 assert.deepEqual(await comparison.locator('[data-choice-product]').evaluateAll(nodes=>nodes.map(node=>node.dataset.choiceProduct)),comparisonIds);
 for(const id of comparisonIds){
  const card=comparison.locator('[data-choice-product="'+id+'"]');
  assert.equal((await card.locator('[data-choice-hook]').innerText()).trim(),stories[id][locale].headline.trim());
  assert.equal((await card.locator('[data-choice-reason]').innerText()).trim(),choiceNotes[id][locale].chooseFor.trim());
 }
 for(const element of [price,primary]){
  assert.equal(await element.evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('details[data-product-details]'))&Node.DOCUMENT_POSITION_FOLLOWING)),true,'Price and main retailer CTA must precede technical details.');
  assert.equal(await element.evaluate(node=>!node.closest('details')),true,'Price and primary action must not be collapsed.');
 }
 const lead=await intro.innerText();
 assert.doesNotMatch(lead,/ピアスの穴があり[、,\s]|for (?:people|those) (?:with|who have) pierced ears/i,'The introduction must offer a reason to choose the piece, not an obvious piercing prerequisite.');
 const disclosure=page.locator('[data-disclosure]').first();
 assert.equal(await disclosure.isVisible(),true,'Link relationship disclosure must stay visible.');
 await page.evaluate(()=>window.scrollTo(0,0));
 const position=await primary.boundingBox();
 const summary=details.locator('summary').first();
 await summary.focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('details[data-product-details]')?.open===true);
 assert.ok((await details.innerText()).trim().length>30,'Expanded details need useful purchase information.');
 await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('details[data-product-details]')?.open===false);
 await page.evaluate(()=>window.scrollTo(0,0));
 const stickyAction=await assertStickyPurchaseAction(page,primary);
 return {productId:product.id,localizedDecision:true,comparisonIds,technicalDetailsInitiallyClosed:true,keyboardDisclosure:true,priceAndPrimaryBeforeDetails:true,primaryTop:position?.y,viewport:page.viewportSize()?.height,stickyAction,locale};
}
async function setFilters(page,filters){
 for(const name of ['type','prefecture','material','craft'])await page.locator('select[name="'+name+'"]').selectOption(filters[name]||'');
 const expected=expectedCount(filters);
 await page.waitForFunction(count=>document.querySelectorAll('[data-product-card]:not([hidden])').length===count,expected);
 assert.equal(await page.locator('[data-product-card]:visible').count(),expected);
 assert.equal(await page.locator('#empty-state').isVisible(),expected===0);
 return expected;
}
try{
 assert.ok(published.length>0,'The jewelry edit must contain published items.');
 assert.equal(published.some(product=>product.productType.includes('hair-accessory')),false);
 for(const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'narrow',width:320,height:740}]){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:error.message}));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()})});
  for(const locale of ['en','ja']){
   for(const [kind,path]of Object.entries(routes)){
    await check(viewport.name+' '+locale+' '+kind+' is localized and fits',async()=>{
     const response=await page.goto(route(locale,path),{waitUntil:'load'});
     assert.equal(response?.status(),200);
     assert.equal(await page.locator('html').getAttribute('lang'),locale);
     assert.equal(await page.locator('h1').count(),1);
     const dims=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
     assert.ok(dims.document<=viewport.width+1&&dims.body<=viewport.width+1,JSON.stringify(dims));
     const toggle=page.locator('a.language-switch');
     assert.equal(await toggle.count(),1);
     const box=await toggle.boundingBox(),headerBox=await page.locator('.site-header').boundingBox();
     assert.ok(box&&headerBox&&box.y>=0&&box.y<160&&box.x+box.width>=headerBox.x+headerBox.width-15,'Language button must be visible at the right edge of the header.');
     assert.match(await toggle.innerText(),locale==='en'?/日本語/:/English/i);
     const peer=locale==='en'?'ja':'en';
     assert.equal(new URL(await toggle.getAttribute('href'),page.url()).pathname,new URL(route(peer,path)).pathname);
     const text=await page.locator('main').innerText();
     assert.equal(text.includes('hamamatsuya-yosegi-kanzashi'),false);
     if(locale==='ja')assert.ok((text.match(/[ぁ-んァ-ヶ一-龠]/g)||[]).length>30,'Japanese page needs translated main content.');
     assert.equal(await page.locator('a[href*="/journal/"]').count(),0,'Regular pages must not link to retired reading pages.');
     assert.equal(await page.locator('a[href$="/en/contact/"], a[href$="/ja/contact/"]').count(),0,'Contact is intentionally unpublished and must not remain in navigation or content links.');
     if(kind==='home'){
      for(const figure of await page.locator('figure[data-editorial-asset]').all())assertStylingDisclosure(await figure.locator('figcaption').innerText(),locale);
     }
     if(['home','objects','regions'].includes(kind)){await assertRegionSelection(page,locale,catalog,editorialImages);await assertPageStylingFigures(page,locale,editorialImages);}
     if(kind.startsWith('feature')&&editorialImages[featuredByKind[kind].id]){
      const figure=page.locator('figure[data-editorial-asset]').first();
      assert.equal(await figure.count(),1);
      assert.equal(await figure.locator('figcaption').isVisible(),true,'AI image label must remain visible.');assertStylingDisclosure(await figure.locator('figcaption').innerText(),locale);
      const image=figure.locator('img');
      const asset=editorialImages[featuredByKind[kind].id];
      assert.ok(new URL(await image.getAttribute('src'),page.url()).pathname.endsWith('/'+asset.path));
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(node=>node.decode());
      const intrinsic=await image.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight}));
      assert.deepEqual(intrinsic,{width:asset.width,height:asset.height});
      await assertStylingFigure(figure,asset,locale,page.url());
      const peer=locale==='en'?'ja':'en';
      await switchTo(page,peer,path);await switchTo(page,locale,path);
     }
     const activeProduct=kind.startsWith('feature')?featuredByKind[kind]:kind==='product'?longest:unillustrated[kind]||null;
     if(activeProduct){
      if(!editorialImages[activeProduct.id]){
       const visual=page.locator('.purchase-visual');
       assert.equal(await visual.locator('[data-official-preview]').count(),1,'An unillustrated product needs the factual official-photo preview, not an invented photograph.');
       assert.equal(await visual.locator('img').count(),0);
       assert.equal(await visual.locator('a[data-official-visual-url]').count(),1);
      }
      // Independent source-data oracle: language never changes the main Japan market.
      const sourceLinks=catalog.links.filter(link=>link.productId===activeProduct.id);
      const official=sourceLinks.find(link=>link.locale==='ja')||sourceLinks.find(link=>!link.locale&&(!activeProduct.priceCurrency||activeProduct.priceCurrency==='JPY'));
      assert.ok(official,'The main Japan reference needs a verified Japan or shared maker destination.');
      assert.equal(await page.locator('[data-product-primary-cta] a[data-sponsored]').first().getAttribute('href'),official.officialProductUrl,'Both languages must pair the primary Japan reference price with the Japan destination.');
      const domestic=activeProduct.localizedPrices?.ja;
      const japanPrice=domestic?.currency==='JPY'?{amount:domestic.amount,currency:domestic.currency,checkedAt:domestic.checkedAt}:activeProduct.priceCurrency==='JPY'&&activeProduct.priceAmount!==null?{amount:activeProduct.priceAmount,currency:'JPY',checkedAt:activeProduct.priceCheckedAt}:null;
      const primaryPrice=page.locator('[data-product-price]'),visiblePrice=(await primaryPrice.innerText()).replace(/\s+/g,' ').trim();
      assert.equal(await primaryPrice.getAttribute('data-price-market'),'japan');
      if(japanPrice){
       const expected=new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',minimumFractionDigits:0,maximumFractionDigits:0}).format(japanPrice.amount).replace(/\s+/g,' ').trim();
       assert.equal(visiblePrice,expected,'Displayed amount must use the recorded Japan source, not a conversion.');
       assert.equal(await primaryPrice.getAttribute('data-price-checked-at'),japanPrice.checkedAt);
      }else assert.doesNotMatch(visiblePrice,/[0-9]|JPY|USD/,'An unknown Japan price must remain unknown in both languages.');
     }
     const visitFlow=activeProduct?await assertVisitGuide(page,activeProduct,locale,catalog,visits):null;
     let purchaseFlow=null;
     if(activeProduct)purchaseFlow=await assertProductFlow(page,locale,activeProduct);
     if(regionByKind[kind]){
      const regionId=regionByKind[kind],expected=published.filter(product=>product.prefectureIds.includes(regionId)).map(product=>product.id).sort();
      assert.ok(expected.length>0,'Do not test an invented empty region.');
      assert.equal(await page.locator('[data-regional-choice="'+regionId+'"]').count(),1);
      const actual=await page.locator('.product-grid').first().locator('[data-product-card]').evaluateAll(nodes=>nodes.map(node=>node.dataset.productId).sort());
      assert.deepEqual(actual,expected,'The maker-region list must match its real published set; retailer-only products stay in their separate section.');
     }
     if(kind==='objects'){
      const images=page.locator('[data-product-card] figure[data-editorial-asset]');
      assert.equal(await images.count(),published.filter(product=>editorialImages[product.id]).length,'Only source-registered published styling images should appear on cards.');
      for(const figure of await images.all()){assertStylingDisclosure(await figure.locator('figcaption').innerText(),locale);}
     }
     const measured=['home','objects','product'].includes(kind)||kind.startsWith('feature')||kind.startsWith('productAdditional')||!!regionByKind[kind];
     let axe=null;
     if(measured){const result=await new AxeBuilder({page}).analyze();axe=result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));assert.equal(axe.length,0,JSON.stringify(axe))}
     const retail=await page.locator('a[data-sponsored]').evaluateAll(links=>links.map(link=>({sponsored:link.getAttribute('data-sponsored'),rel:link.getAttribute('rel')})));
     for(const link of retail){assert.equal(link.sponsored,'false');assert.equal(link.rel.split(/\s+/).includes('sponsored'),false)}
     report.pages.push({viewport:viewport.name,locale,kind,productId:activeProduct?.id||null,regionId:regionByKind[kind]||null,url:page.url(),status:response.status(),dimensions:dims,axeViolations:axe,retailerLinks:retail.length});
     return {status:response.status(),dimensions:dims,axeMeasured:measured,purchaseFlow,visitFlow};
    });
    if(locale==='ja'&&kind==='featurePierced'&&['desktop','mobile'].includes(viewport.name))await screenshot(page,'artifacts/'+screenshotPrefix+'-ja-'+viewport.name+'-product.png');
    if(locale==='ja'&&kind==='featureClip'&&viewport.name==='mobile')await screenshot(page,'artifacts/'+screenshotPrefix+'-ja-mobile-clip.png');
    if(locale==='ja'&&kind.startsWith('featureAdditional')&&viewport.name==='mobile')await screenshot(page,'artifacts/'+screenshotPrefix+'-ja-mobile-'+featuredByKind[kind].id+'.png');
    const manualProduct=unillustrated[kind]||featuredByKind[kind]||(kind==='product'?longest:null);
    if(viewport.name==='narrow'&&manualProductIds.has(manualProduct?.id)&&!manualShotsTaken.has(locale+'/'+manualProduct.id)){
     manualShotsTaken.add(locale+'/'+manualProduct.id);
     await screenshot(page,'artifacts/'+screenshotPrefix+'-'+locale+'-narrow-focus-'+manualProduct.id+'.png');
     for(const [selector,suffix]of [['[data-product-decision]','decision'],['[data-choice-details]','comparison']]){
      const file='artifacts/'+screenshotPrefix+'-'+locale+'-narrow-focus-'+manualProduct.id+'-'+suffix+'.png';
      await page.locator(selector).screenshot({path:resolve(root,file)});report.screenshots.push(file);
     }
    }
    if(viewport.name==='narrow'&&regionByKind[kind])await screenshot(page,'artifacts/'+screenshotPrefix+'-'+locale+'-narrow-region-'+regionByKind[kind]+'.png');
   }
   await check(viewport.name+' '+locale+' current product switches language and returns',async()=>{
    await page.goto(route(locale,routes.product));
    const initial=await page.locator('h1').innerText(),peer=locale==='en'?'ja':'en';
    await switchTo(page,peer,routes.product,true);
    assert.notEqual(await page.locator('h1').innerText(),initial);
    await switchTo(page,locale,routes.product);
    assert.equal(await page.locator('h1').innerText(),initial);
   });
   await check(viewport.name+' '+locale+' selected product has translated detail and retailer CTA',async()=>{
    const path=routes.featurePierced;
    await page.goto(route(locale,path));
    if(locale==='en')await switchTo(page,'ja',path);
    const japanese=await page.locator('main').innerText();
    assert.ok((japanese.match(/[ぁ-んァ-ヶ一-龠]/g)||[]).length>=100,'Japanese product detail was not translated.');
    assert.ok(await page.locator('main a[data-sponsored]').count()>0,'Product detail needs a real retailer destination.');
    await switchTo(page,'en',path);
    assert.match(await page.locator('main').innerText(),/[A-Za-z]{6}/);
    const structured=await page.locator('script[type="application/ld+json"]').allTextContents();
    assert.equal(structured.some(value=>JSON.parse(value)['@type']==='Article'),false,'Products must not use blog Article schema.');
    if(locale==='ja')await switchTo(page,'ja',path);
   });
   await check(viewport.name+' '+locale+' filters and language preserve current query and hash',async()=>{
    await page.goto(route(locale,routes.objects));
    assert.equal(await page.locator('select[name="type"] option[value="hair-accessory"]').count(),0);
    const count=await setFilters(page,{type:'pierced-earrings',prefecture:'kanagawa',material:'wood'});
    await page.evaluate(()=>history.replaceState(null,'',location.pathname+location.search+'#object-results'));
    const peer=locale==='en'?'ja':'en';
    await switchTo(page,peer,routes.objects,true);
    assert.equal(new URL(page.url()).searchParams.get('type'),'pierced-earrings');
    assert.equal(new URL(page.url()).searchParams.get('prefecture'),'kanagawa');
    assert.equal(new URL(page.url()).hash,'#object-results');
    assert.equal(await page.locator('select[name="type"]').inputValue(),'pierced-earrings');
    assert.equal(await page.locator('[data-product-card]:visible').count(),count);
    for(const value of await page.locator('[data-product-card]:visible').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-prefecture'))))assert.ok(value.split(' ').includes('kanagawa'));
    const emptyCombination=catalog.productTypes.flatMap(type=>[...new Set(published.flatMap(product=>product.materialIds))].map(material=>({type:type.id,material}))).find(filters=>published.some(product=>product.productType.includes(filters.type))&&expectedCount(filters)===0);
    assert.ok(emptyCombination,'Exercise the real empty state with an available but nonmatching filter combination.');
    await setFilters(page,emptyCombination);
    assert.equal(await page.locator('[data-product-card]:visible').count(),0);
    await page.locator('#empty-reset').click();
    assert.equal(await page.locator('[data-product-card]:visible').count(),published.length);
    assert.equal(new URL(page.url()).search,'');
    const materials=[...new Set(published.flatMap(product=>product.materialIds))];
    assert.ok(['wood','glass','porcelain'].every(material=>materials.includes(material)),'Published material choices should include wood, glass and porcelain.');
    assert.ok(published.filter(product=>!product.materialIds.includes('wood')).length>=Math.ceil(published.length/2),'At least half of the published selection should now be non-wood.');
    const materialCounts={};
    for(const material of materials){
     materialCounts[material]=await setFilters(page,{material});
     for(const values of await page.locator('[data-product-card]:visible').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-material')||'')))assert.ok(values.split(' ').includes(material),'Material filter included an unsupported product.');
    }
    await setFilters(page,{material:'surgical-stainless-steel'});
    await page.locator('button[type="reset"]').click();
    assert.equal(await page.locator('[data-product-card]:visible').count(),published.length);
    return {combinedCount:count,total:published.length,materialCounts};
   });
   if(viewport.width<720)await check(viewport.name+' '+locale+' mobile navigation retains locale',async()=>{
    await page.goto(route(locale));
    await page.locator('.mobile-nav summary').click();
    await page.locator('.mobile-nav nav a[href$="/objects/"]').click();
    await page.waitForURL(route(locale,routes.objects));
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
   });
  }
  await context.close();
 }
 for(const browserLocale of ['ja-JP','en-US','fr-FR'])for(const width of [1440,320])await check('Language entry '+browserLocale+' '+width+' keeps both languages accessible',async()=>{
  const context=await browser.newContext({locale:browserLocale,viewport:{width,height:840}});const page=await context.newPage();
  try{
   const rootUrl=new URL(base,origin).href;const response=await page.goto(rootUrl+'?source=entry#selection',{waitUntil:'load'});assert.equal(response.status(),200);
   assert.equal(new URL(page.url()).pathname,new URL(rootUrl).pathname,'The selector must not force a language redirect.');
   assert.equal(await page.locator('meta[http-equiv="refresh"]').count(),0);
   assert.equal(await page.locator('[data-entry-language]').count(),2);
   const preferred=browserLocale.startsWith('ja')?'ja':'en';assert.equal(await page.locator('[data-entry-language]').first().getAttribute('data-entry-language'),preferred);
   for(const locale of ['en','ja']){const link=page.locator('[data-entry-language="'+locale+'"]');assert.equal(await link.isVisible(),true);const destination=new URL(await link.getAttribute('href'),page.url());assert.equal(destination.pathname,new URL(route(locale)).pathname);assert.equal(destination.search,'?source=entry');assert.equal(destination.hash,'#selection')}
   const dimensions=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth}));assert.ok(dimensions.document<=width+1);
   await page.locator('[data-entry-language="'+preferred+'"]').click();await page.waitForURL(url=>url.pathname===new URL(route(preferred)).pathname);assert.equal(await page.locator('html').getAttribute('lang'),preferred);
   return {preferred,width,bothLanguageLinks:true,noForcedRedirect:true};
  }finally{await context.close()}
 });
 await check('Language entry works without JavaScript',async()=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const page=await context.newPage();try{await page.goto(new URL(base,origin).href);for(const locale of ['en','ja'])assert.equal(await page.locator('[data-entry-language="'+locale+'"]').isVisible(),true);await page.locator('[data-entry-language="ja"]').click();assert.equal(await page.locator('html').getAttribute('lang'),'ja')}finally{await context.close()}
 });
 await check('Publication metadata, withdrawn hairpin and empty categories are correct',()=>assertPublicationMetadata(browser,{route,origin,base,publishMode:process.env.PUBLIC_PUBLISH_MODE,siteUrl:process.env.PUBLIC_SITE_URL}));
 for(const locale of ['en','ja'])await check(locale+' retired reading routes move to product selections',async()=>{
  const page=await browser.newPage();
  const results=[];
  for(const [slug,target]of Object.entries(legacyTargets)){
   const legacy='journal/'+(slug?slug+'/':'');
   const response=await page.request.get(route(locale,legacy));
   assert.equal(response.status(),200);
   const html=await response.text();
   assert.match(html,/<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/);
   assert.equal(/rel="canonical"|hreflang=|"@type"\s*:\s*"Article"/.test(html),false);
   const expected=new URL(route(locale,target));
   assert.ok(html.includes('data-legacy-redirect="'+expected.pathname+'"'));
   assert.ok(html.includes('0;url='+expected.pathname));
   await page.goto(route(locale,legacy)+'?next=https%3A%2F%2Funtrusted.invalid%2F#old-anchor');
   await page.waitForURL(url=>url.pathname===expected.pathname);
   assert.equal(new URL(page.url()).search,'','Legacy migration must use its fixed destination, not user query input.');
   assert.equal(new URL(page.url()).hash,'');
   results.push({from:legacy,to:target});
  }
  const sitemap=await (await page.request.get(new URL(base+'sitemap.xml',origin).href)).text();
  assert.equal(/\/(en|ja)\/journal\//.test(sitemap),false);
  assert.equal(/\/(en|ja)\/contact\//.test(sitemap),false);
  await page.close();return results;
 });
 await check('No uncaught client exceptions',()=>assert.deepEqual(report.pageErrors,[]));
 await check('Source data remains unchanged during the full browser run',async()=>{report.sourceInputs.completed=await hashInputs();assert.deepEqual(report.sourceInputs.completed,sourceInputs)});
 await check('No unexpected console errors',()=>{
  const unexpected=report.consoleErrors.filter(error=>!(/kanzashi/.test(error.url)&&/404/.test(error.message)));
  assert.deepEqual(unexpected,[]);
 });
}finally{
 await browser.close();
 report.completedAt=new Date().toISOString();
 report.finalizedAt=report.completedAt;
 report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,pages:report.pages.length,pageVisits:report.pages.length,uniqueRoutes:new Set(report.pages.map(page=>new URL(page.url).pathname)).size,uniqueProductsChecked:new Set(report.pages.flatMap(page=>page.productId?[page.productId]:[])).size,uniqueRegionsChecked:new Set(report.pages.flatMap(page=>page.regionId?[page.regionId]:[])).size,productDetailChecks:report.pages.filter(page=>page.productId).length,regionPageChecks:report.pages.filter(page=>page.regionId).length,axeScreens:report.pages.filter(page=>page.axeViolations!==null).length,axeViolations:report.pages.reduce((sum,page)=>sum+(page.axeViolations?.length||0),0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(resolve(root,process.env.CHECK_REPORT_PATH||'docs/visual-seo-stage-full-browser-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));
 if(report.failures.length)process.exitCode=1;
}
