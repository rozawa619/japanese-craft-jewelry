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
const published=catalog.products.filter(product=>product.publishStatus==='published');
const longest=[...published].sort((a,b)=>b.title.length-a.title.length)[0];
const selectedIds=['hamamatsuya-catch-pierced','hamamatsuya-clip'];
const selected=selectedIds.map(id=>published.find(product=>product.id===id));
if(selected.some(product=>!product))throw new Error('Selected product is missing from the published catalog.');
const routes={home:'',objects:'objects/',product:'objects/'+longest.slug+'/',featurePierced:'objects/'+selected[0].slug+'/',featureClip:'objects/'+selected[1].slug+'/',regions:'places/',region:'places/kanagawa/',craft:'crafts/hakone-yosegi/',contact:'contact/'};
const legacyTargets={"":"objects/","hakone-yosegi-pierced-earrings":"objects/hamamatsuya-surgical-stainless-pierced-earrings/","hakone-yosegi-non-pierced-earrings":"objects/hamamatsuya-yosegi-non-pierced-earrings/","everyday-craft-earrings":"objects/","pierced-or-clip-on":"objects/","buying-from-overseas":"objects/","understanding-yosegi":"crafts/hakone-yosegi/"};
const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh headless Chrome with no existing user profile. EN/JA route, product-led selection, no-blog navigation, current-product language switching, query/hash, jewelry scope, UI and accessibility checks. Does not open retailer destinations.',checks:[],pages:[],screenshots:[],pageErrors:[],consoleErrors:[],failures:[]};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}catch(error){const message=error instanceof Error?error.message:String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}};
async function screenshot(page,file){await page.screenshot({path:resolve(root,file),fullPage:true});report.screenshots.push(file)}
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
     if(kind==='home')assert.ok(await page.locator('[data-product-card]').count()>=2,'Home should present selected products directly.');
     if(kind.startsWith('feature')){
      const figure=page.locator('figure[data-editorial-asset]').first();
      assert.equal(await figure.count(),1);
      assert.match(await figure.locator('figcaption').innerText(),locale==='ja'?/AI生成.*実物写真ではありません/:/AI styling illustration.*not a photograph/);
      const image=figure.locator('img');
      assert.match(await image.getAttribute('src'),kind==='featurePierced'?/hakone-yosegi-pierced-styling\.webp$/:/hakone-yosegi-clipon-styling\.webp$/);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(node=>node.decode());
      const intrinsic=await image.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight}));
      assert.deepEqual(intrinsic,{width:1536,height:1024});
      const peer=locale==='en'?'ja':'en';
      await switchTo(page,peer,path);await switchTo(page,locale,path);
     }
     if(kind==='objects'){
      const images=page.locator('[data-product-card] figure[data-editorial-asset]');
      assert.ok(await images.count()>=2,'Both selected products should show their labeled styling images.');
      for(const figure of await images.all()){assert.match(await figure.locator('figcaption').innerText(),locale==='ja'?/AI生成.*実物写真ではありません/:/AI styling illustration.*(?:not a product photograph|not a photograph of (?:this|the featured) product)/);}
     }
     const measured=['home','objects','product','featurePierced','featureClip'].includes(kind);
     let axe=null;
     if(measured){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();axe=result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));assert.equal(axe.length,0,JSON.stringify(axe))}
     const retail=await page.locator('a[data-sponsored]').evaluateAll(links=>links.map(link=>({sponsored:link.getAttribute('data-sponsored'),rel:link.getAttribute('rel')})));
     for(const link of retail){assert.equal(link.sponsored,'false');assert.equal(link.rel.split(/\s+/).includes('sponsored'),false)}
     report.pages.push({viewport:viewport.name,locale,kind,url:page.url(),status:response.status(),dimensions:dims,axeViolations:axe,retailerLinks:retail.length});
     return {status:response.status(),dimensions:dims,axeMeasured:measured};
    });
    if(locale==='ja'&&kind==='home'&&['desktop','mobile'].includes(viewport.name))await screenshot(page,'artifacts/bilingual-ja-'+viewport.name+'-home.png');
    if(locale==='ja'&&kind==='product'&&viewport.name==='mobile')await screenshot(page,'artifacts/bilingual-ja-mobile-product.png');
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
    await setFilters(page,{material:'surgical-stainless-steel'});
    await page.locator('button[type="reset"]').click();
    assert.equal(await page.locator('[data-product-card]:visible').count(),published.length);
    return {combinedCount:count,total:published.length};
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
 await writeFile(resolve(root,process.env.CHECK_REPORT_PATH||'docs/selection-browser-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));
 if(report.failures.length)process.exitCode=1;
}
