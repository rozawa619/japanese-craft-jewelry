import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=process.env.CHECK_BASE_URL||'http://127.0.0.1:4321';
const base='/'+(process.env.PUBLIC_BASE_PATH||'').split('/').filter(Boolean).join('/')+((process.env.PUBLIC_BASE_PATH||'').split('/').filter(Boolean).length?'/':'');
const route=(locale,path='')=>new URL(base+locale+'/'+path,origin).href;
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const editorialImages=JSON.parse(await readFile(resolve(root,'src/data/editorial-images.json'),'utf8'));
const published=catalog.products.filter(product=>product.publishStatus==='published');
const longest=[...published].sort((a,b)=>b.title.length-a.title.length)[0];
const selectedIds=['hamamatsuya-catch-pierced','hamamatsuya-clip'];
const selected=selectedIds.map(id=>published.find(product=>product.id===id));
if(selected.some(product=>!product))throw new Error('Selected product is missing from the published catalog.');
const featuredByKind={featurePierced:selected[0],featureClip:selected[1],...Object.fromEntries(published.filter(product=>editorialImages[product.id]&&!selectedIds.includes(product.id)).map((product,index)=>['featureAdditional'+index,product]))};
const routes={home:'',objects:'objects/',product:'objects/'+longest.slug+'/',...Object.fromEntries(Object.entries(featuredByKind).map(([kind,product])=>[kind,'objects/'+product.slug+'/'])),regions:'places/',region:'places/kanagawa/',craft:'crafts/hakone-yosegi/',policy:'editorial-policy/'};
const legacyTargets={"":"objects/","hakone-yosegi-pierced-earrings":"objects/hamamatsuya-surgical-stainless-pierced-earrings/","hakone-yosegi-non-pierced-earrings":"objects/hamamatsuya-yosegi-non-pierced-earrings/","everyday-craft-earrings":"objects/","pierced-or-clip-on":"objects/","buying-from-overseas":"objects/","understanding-yosegi":"crafts/hakone-yosegi/"};
const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh headless Chrome with no existing user profile. EN/JA routes, product appeal before technical detail, visible price/retailer action, native details, no-blog/no-Contact navigation, unpublished Contact 404, all registered styling images, materials and combined filters, language switching, query/hash, jewelry scope, UI and accessibility checks. Does not open retailer destinations or submit affiliate applications.',checks:[],pages:[],screenshots:[],pageErrors:[],consoleErrors:[],failures:[]};
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
 assert.match(caption,/\bAI\b/i,'Styling imagery needs a visible AI label.');
 assert.match(caption,locale==='ja'?/(?:実物|再現)[\s\S]*(?:ではありません|異なります)/i:/not (?:a |the )?(?:product |actual )?(?:photograph|photo|reproduction)|not the actual/i,'Styling imagery must stay distinct from an actual product photo or reproduction.');
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
async function assertProductFlow(page,locale){
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
 return {technicalDetailsInitiallyClosed:true,keyboardDisclosure:true,priceAndPrimaryBeforeDetails:true,primaryTop:position?.y,viewport:page.viewportSize()?.height,stickyAction,locale};
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
     if(kind==='home')assert.ok(await page.locator('[data-product-card]').count()>=2,'Home should present selected products directly.');
     if(kind.startsWith('feature')){
      const figure=page.locator('figure[data-editorial-asset]').first();
      assert.equal(await figure.count(),1);
      assert.equal(await figure.locator('figcaption').isVisible(),true,'AI/non-product caption must be visible.');assertStylingDisclosure(await figure.locator('figcaption').innerText(),locale);
      const image=figure.locator('img');
      const asset=editorialImages[featuredByKind[kind].id];
      assert.ok(new URL(await image.getAttribute('src'),page.url()).pathname.endsWith('/'+asset.path));
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(node=>node.decode());
      const intrinsic=await image.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight}));
      assert.deepEqual(intrinsic,{width:asset.width,height:asset.height});
      const peer=locale==='en'?'ja':'en';
      await switchTo(page,peer,path);await switchTo(page,locale,path);
     }
     let purchaseFlow=null;
     if(kind==='product'||kind.startsWith('feature'))purchaseFlow=await assertProductFlow(page,locale);
     if(kind==='objects'){
      const images=page.locator('[data-product-card] figure[data-editorial-asset]');
      assert.ok(await images.count()>=2,'Both selected products should show their labeled styling images.');
      for(const figure of await images.all()){assertStylingDisclosure(await figure.locator('figcaption').innerText(),locale);}
     }
     const measured=['home','objects','product'].includes(kind)||kind.startsWith('feature');
     let axe=null;
     if(measured){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();axe=result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));assert.equal(axe.length,0,JSON.stringify(axe))}
     const retail=await page.locator('a[data-sponsored]').evaluateAll(links=>links.map(link=>({sponsored:link.getAttribute('data-sponsored'),rel:link.getAttribute('rel')})));
     for(const link of retail){assert.equal(link.sponsored,'false');assert.equal(link.rel.split(/\s+/).includes('sponsored'),false)}
     report.pages.push({viewport:viewport.name,locale,kind,url:page.url(),status:response.status(),dimensions:dims,axeViolations:axe,retailerLinks:retail.length});
     return {status:response.status(),dimensions:dims,axeMeasured:measured,purchaseFlow};
    });
    if(locale==='ja'&&kind==='featurePierced'&&['desktop','mobile'].includes(viewport.name))await screenshot(page,'artifacts/clear-stage-ja-'+viewport.name+'-product.png');
    if(locale==='ja'&&kind==='featureClip'&&viewport.name==='mobile')await screenshot(page,'artifacts/clear-stage-ja-mobile-clip.png');
    if(locale==='ja'&&kind.startsWith('featureAdditional')&&viewport.name==='mobile')await screenshot(page,'artifacts/clear-stage-ja-mobile-'+featuredByKind[kind].id+'.png');
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
    await setFilters(page,{type:'clip-on-earrings',material:'gold-18k'});
    assert.equal(await page.locator('[data-product-card]:visible').count(),0);
    await page.locator('#empty-reset').click();
    assert.equal(await page.locator('[data-product-card]:visible').count(),published.length);
    assert.equal(new URL(page.url()).search,'');
    const materials=[...new Set(published.flatMap(product=>product.materialIds))];
    assert.ok(materials.includes('wood')&&materials.includes('glass'),'The published selection should now include both wood and glass.');
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
 await check('Publication metadata, withdrawn hairpin and empty categories are correct',async()=>{
  const page=await browser.newPage();
  for(const locale of ['en','ja']){
   await page.goto(route(locale));
   if(process.env.PUBLIC_PUBLISH_MODE==='public'){
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/^index, follow$/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),new URL(base+locale+'/',process.env.PUBLIC_SITE_URL).href);
    assert.equal(await page.locator('link[hreflang]').count(),2);
   }else{
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
    assert.equal(await page.locator('link[rel="canonical"]').count(),0);
   }
   assert.equal((await page.request.get(route(locale,'objects/hamamatsuya-yosegi-kanzashi/'))).status(),404);
   assert.equal((await page.request.get(route(locale,'contact/'))).status(),404,'Deferred Contact route must return 404.');
  }
  await page.close();
 });
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
 await check('No unexpected console errors',()=>{
  const unexpected=report.consoleErrors.filter(error=>!(/kanzashi/.test(error.url)&&/404/.test(error.message)));
  assert.deepEqual(unexpected,[]);
 });
}finally{
 await browser.close();
 report.completedAt=new Date().toISOString();
 report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,pages:report.pages.length,axeViolations:report.pages.reduce((sum,page)=>sum+(page.axeViolations?.length||0),0),screenshots:report.screenshots.length};
 await writeFile(resolve(root,process.env.CHECK_REPORT_PATH||'docs/clear-stage-browser-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));
 if(report.failures.length)process.exitCode=1;
}
