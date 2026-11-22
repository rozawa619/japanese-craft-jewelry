import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname} from 'node:path';
import {selection} from '../src/config/selection.ts';

const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4322').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'japanese-craft-jewelry').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/mobile-refinement-stage-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'mobile-refinement-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const raw=async p=>JSON.parse(await readFile(p,'utf8'));
const catalog=await raw('src/data/catalog.json'),images=await raw('src/data/product-detail-images.json');
const rank=new Map(selection.catalogProductIds.map((id,i)=>[id,i]));
const published=catalog.products.filter(p=>p.publishStatus==='published').sort((a,b)=>(rank.get(a.id)??9999)-(rank.get(b.id)??9999));
const first=published.find(p=>p.id==='hamamatsuya-catch-pierced');
const longest=published.reduce((a,b)=>b.title.length>a.title.length?b:a,published[0]);
const routes=[['home',''],['listing','objects/'],['region','places/kanagawa/'],['detail','objects/'+first.slug+'/'],['long-detail','objects/'+longest.slug+'/'],['privacy','privacy/']];
const views=[{width:320,height:740},{width:360,height:780},{width:390,height:844},{width:768,height:1024},{width:768,height:430},{width:667,height:375},{width:1440,height:1000}];
const inputs=['src/styles/global.css','src/components/RegionalChoiceGuide.astro','src/components/TypeChoiceImage.astro','src/components/Sources.astro','src/components/MarketPrice.astro','src/components/PurchaseEvidence.astro','src/components/VisitGuide.astro','src/components/ProductBuyingGuide.astro','src/layouts/Base.astro','src/pages/[lang]/index.astro','src/pages/[lang]/objects/index.astro','src/pages/[lang]/objects/[slug].astro','src/data/product-detail-images.json','src/data/catalog.json','src/lib/map-preferences.ts','src/lib/map-preferences-client.ts','src/components/MapPreferences.astro','src/components/JapanJewelryMap.astro','src/components/RegionSelection.astro'];
const hashes=async()=>Object.fromEntries(await Promise.all(inputs.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const checkerSha256=createHash('sha256').update(await readFile(new URL(import.meta.url))).digest('hex');
const report={checkedAt:new Date().toISOString(),origin,base,checker:{path:'scripts/check-mobile-refinement.mjs',sha256:checkerSha256},method:'Focused responsive browser checks against a stable build. Raw catalog, display-order IDs and image registry independently supply expected representatives. No product/cookie/advertising data is changed. Standalone controls target44px; normal inline prose links and decorative captions are not claimed to be44px targets. Sticky CTA checks wait for the actual scroll predicates and rendered visibility using animation-frame polling; every visibility, geometry and source assertion is retained.',sourceInputs:await hashes(),views,routes:routes.map(([name,path])=>({name,path})),checks:[],failures:[],screenshots:[],axe:[],maps:[],stickySynchronization:[],sourceControls:0,typeImages:0};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const url=(locale,path='')=>origin+base+locale+'/'+path;
const capture=async(page,name)=>{const path='artifacts/'+prefix+'-'+name+'.png';await page.screenshot({path,fullPage:false});report.screenshots.push(path);return path;};
const overflow=async page=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Document must not overflow horizontally');
const measured=async locator=>locator.evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{x:r.x,y:r.y,width:r.width,height:r.height,font:parseFloat(s.fontSize),display:s.display};});
const touch=async(locator,label,min=44)=>{assert.ok(await locator.isVisible(),label+' visible');const m=await measured(locator);assert.ok(m.height>=min-1&&m.width>=min-1,label+' target: '+JSON.stringify(m));return m;};
const closedSources=async page=>{
 for(const fold of await page.locator('details[data-source-disclosure]').all()){
  assert.equal(await fold.getAttribute('open'),null,'Sources initially closed');
  assert.equal(await fold.locator('details').count(),0,'No nested source details');
  if(await fold.locator('.source-list').count())assert.equal(await fold.locator('.source-list').isVisible(),false);
 }
 assert.equal(await page.locator('.market-price-date:visible,.visit-checked:visible').count(),0,'Dates are not repeated beside every displayed price or store');
 if(await page.locator('[data-purchase-evidence]').count())assert.equal(await page.locator('[data-market-section="japan"] [data-purchase-evidence]').isVisible(),true,'Purchase confirmation remains visible beside the primary action');
};
const operateSources=async(page)=>{
 for(const fold of await page.locator('details[data-source-disclosure]').all()){
  const summary=fold.locator(':scope > summary');await touch(summary,'Source summary');
  await summary.focus();await page.keyboard.press('Enter');assert.notEqual(await fold.getAttribute('open'),null);
  const dates=fold.locator('time');assert.ok(await dates.count()>0,'Expanded source panel retains dates');
  for(const date of await dates.all())assert.match((await date.innerText()).trim(),/^\d{4}-\d{2}-\d{2}$/);
  await overflow(page);
  await summary.focus();await page.keyboard.press('Enter');assert.equal(await fold.getAttribute('open'),null);report.sourceControls++;
 }
};
const choiceImages=async(page,locale)=>{
 for(const link of await page.locator('[data-home-type-choice],[data-regional-type-choice]').all()){
  const type=await link.getAttribute('data-home-type-choice')||await link.getAttribute('data-regional-type-choice');
  const region=await link.evaluate(e=>e.closest('[data-regional-choice]')?.getAttribute('data-regional-choice')||null);
  const expected=published.find(p=>p.productType.includes(type)&&(!region||p.prefectureIds.includes(region)));
  assert.ok(expected,'Choice represents a published product');const image=images[expected.id];
  const figure=link.locator('[data-type-choice-product]');assert.equal(await figure.count(),1);
  assert.equal(await figure.getAttribute('data-type-choice-product'),expected.id);assert.equal(await figure.getAttribute('data-type-choice-asset'),image.assetId);
  const img=figure.locator('[data-type-choice-image]');assert.equal(await img.getAttribute('alt'),image.alt[locale]);
  assert.equal(new URL(await img.getAttribute('src'),page.url()).pathname,base+image.path);
  await link.scrollIntoViewIfNeeded();await img.evaluate(async e=>{await e.decode();});const natural=await img.evaluate(e=>({width:e.naturalWidth,height:e.naturalHeight,fit:getComputedStyle(e).objectFit}));
  assert.deepEqual(natural,{width:image.width,height:image.height,fit:'contain'});
  assert.equal((await figure.locator('figcaption').innerText()).trim(),locale==='ja'?'AIイメージ':'AI image');
  const href=new URL(await link.getAttribute('href'),page.url());assert.equal(href.searchParams.get('type'),type);assert.equal(href.hash,'#all-jewelry');if(region)assert.equal(href.searchParams.get('prefecture'),region);
  const m=await measured(link);assert.ok(m.width>=44&&m.height>=44);report.typeImages++;
 }
};
try{
 for(const locale of ['ja','en'])for(const view of views){
  const context=await browser.newContext({viewport:view,locale:locale==='ja'?'ja-JP':'en-US',hasTouch:view.width<1000,isMobile:view.width===390,deviceScaleFactor:view.width===390?2:1});
  for(const[name,path]of routes){
   const page=await context.newPage(),external=[],errors=[];page.on('request',r=>{if(new URL(r.url()).origin!==origin)external.push(r.url());});page.on('pageerror',e=>errors.push(String(e)));
   const key=locale+'-'+name+'-'+view.width+'x'+view.height;
   try{
    const response=await page.goto(url(locale,path),{waitUntil:'networkidle'});assert.equal(response.status(),200);
    await closedSources(page);await overflow(page);
    const language=await touch(page.locator('.language-switch'),'Language control');if(view.width<=720)assert.ok(language.font>=12);
    if(view.width<=720){
     const menu=page.locator('.mobile-nav'),summary=menu.locator('summary');await touch(summary,'Menu');
     await summary.focus();await page.keyboard.press('Enter');assert.notEqual(await menu.getAttribute('open'),null);
     for(const item of await menu.locator('nav a').all())await touch(item,'Menu link');
     await page.keyboard.press('Tab');assert.equal(await menu.locator('nav a').first().evaluate(e=>e===document.activeElement),true);
     if(name==='home'&&view.width===320)await capture(page,key+'-menu');
     await summary.focus();await page.keyboard.press('Enter');assert.equal(await menu.getAttribute('open'),null);
    }else for(const item of await page.locator('.desktop-nav a').all())await touch(item,'Desktop/tablet navigation');
    await choiceImages(page,locale);
    if(name==='listing'){
     for(const select of await page.locator('.filters select,#price-sort').all()){
      const m=await touch(select,'Filter/sort',view.width<=1000?48:44);if(view.width<=1000)assert.ok(m.font>=16,'Filter text16px');
     }
     if(view.width<=420){const rects=await page.locator('.filters select').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().x));assert.ok(rects.every(x=>Math.abs(x-rects[0])<1),'Narrow filters use one readable column');}
     await page.locator('select[name=prefecture]').selectOption('kanagawa');await page.locator('select[name=type]').selectOption('pierced-earrings');
     const expected=published.filter(p=>p.prefectureIds.includes('kanagawa')&&p.productType.includes('pierced-earrings')).map(p=>p.id).sort();
     assert.deepEqual((await page.locator('[data-product-card]:visible').evaluateAll(es=>es.map(e=>e.dataset.productId))).sort(),expected);
     await page.locator('.reset-button').first().focus();await page.keyboard.press('Space');assert.equal(await page.locator('[data-product-card]:visible').count(),published.length);
     await page.locator('#object-filters').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
     if(view.width===320||view.width===768&&view.height===430)await capture(page,key+'-filters');
    }
    if(name==='detail'||name==='long-detail'){
     assert.equal(await page.locator('#product-sources').count(),1);
     const sourceLink=page.locator('.buying-guide-sources');await sourceLink.evaluate(e=>e.scrollIntoView({block:'end',behavior:'instant'}));
     if(view.width<=720&&view.height>500){
      // The controller updates on scroll in requestAnimationFrame. Poll its actual
      // predicates and the resulting visibility instead of racing a fixed delay.
      const synchronizationStarted=Date.now();
      await page.waitForFunction(()=>{
       const sticky=document.querySelector('[data-product-sticky-cta]'),primary=document.querySelector('[data-product-primary-cta]'),footer=document.querySelector('.site-footer');
       if(!sticky||!primary)return false;
       const style=getComputedStyle(sticky);
       return matchMedia('(max-width: 720px)').matches&&primary.getBoundingClientRect().bottom<0&&(!footer||footer.getBoundingClientRect().top>=innerHeight)&&!sticky.hidden&&style.display!=='none'&&style.visibility!=='hidden'&&sticky.getBoundingClientRect().height>0;
      },null,{polling:'raf',timeout:5000});
      report.stickySynchronization.push({key,waitMs:Date.now()-synchronizationStarted});
     }
     const sticky=page.locator('[data-product-sticky-cta]');const shown=await sticky.isVisible();
     if(view.width<=720&&view.height>500){assert.equal(shown,true,'Sticky CTA is visible after scroll predicates and rendering settle');await touch(sticky.locator('a'),'Sticky listing');const a=await sourceLink.boundingBox(),b=await sticky.boundingBox();assert.ok(a.y+a.height<=b.y,'Focused source link stays above sticky bar');}
     else assert.equal(shown,false,'No sticky bar on desktop/tablet or short landscape');
     await sourceLink.focus();await page.keyboard.press('Enter');assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);
     assert.equal(await page.locator('[data-information-checks]').isVisible(),true);assert.equal(await page.locator('[data-purchase-evidence]').isVisible(),true);
     await page.locator('#product-sources>summary').focus();await page.keyboard.press('Enter');
     for(const panel of await page.locator('[data-inline-map]').all()){await touch(panel.locator('[data-load-map]'),'Map display');assert.ok((await measured(panel.locator('.map-caption p'))).font>=12);assert.equal(await panel.locator('iframe').count(),0);}
     if(view.width===320&&name==='detail'){await page.locator('#product-sources>summary').focus();await page.keyboard.press('Enter');await page.locator('#product-sources').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,key+'-sources');await page.locator('#product-sources>summary').focus();await page.keyboard.press('Enter');}
    }
    await operateSources(page);await overflow(page);assert.deepEqual(errors,[]);assert.deepEqual(external,[],'Unopened maps/source controls do not create external requests');
    const axeHere=view.width===320&&['home','listing','detail','privacy'].includes(name)||view.width===768&&view.height===1024&&name==='region';
    if(axeHere){const result=await new AxeBuilder({page}).analyze();report.axe.push({key,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});assert.equal(result.violations.length,0,'axe violations');}
    if(view.width===320&&['home','region','privacy'].includes(name)){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await capture(page,key+'-top');}
    report.checks.push({key,status:'passed',externalRequests:external.length,pageErrors:errors.length});console.log('PASS '+key);
   }catch(error){report.failures.push({key,message:String(error),stack:error.stack});report.checks.push({key,status:'failed',message:String(error),stack:error.stack});console.error('FAIL '+key+' '+(error.stack||String(error)));}
   await page.close();
  }await context.close();await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 }
 // Fragment opening and native source toggles are independent of the long mobile grid.
 for(const locale of ['ja','en']){
  const context=await browser.newContext({viewport:{width:320,height:740},locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage(),key=locale+'-source-hash';
  try{await page.goto(url(locale,'objects/'+first.slug+'/#product-sources'),{waitUntil:'networkidle'});assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);assert.equal(await page.locator('[data-information-checks]').isVisible(),true);report.checks.push({key,status:'passed'});}catch(error){report.failures.push({key,message:String(error),stack:error.stack});}finally{await context.close();}
 }
 for(const locale of ['ja','en'])for(const width of [320,768]){
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false,locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage(),key=locale+'-nojs-sources-'+width;
  try{await page.goto(url(locale,'objects/'+first.slug+'/'),{waitUntil:'networkidle'});await closedSources(page);await operateSources(page);await overflow(page);assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('.product-sticky-cta').isVisible(),false);report.checks.push({key,status:'passed'});}catch(error){report.failures.push({key,message:String(error),stack:error.stack});}finally{await context.close();}
 }
 // One live map per language is enough for responsive controls; Maps9 owns broader map-provider checks.
 for(const[locale,width]of [['ja',320],['en',390]]){
  const context=await browser.newContext({viewport:{width,height:844},locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage(),key=locale+'-live-map-'+width;
  try{await page.goto(url(locale,'objects/'+first.slug+'/'),{waitUntil:'networkidle'});const panel=page.locator('[data-inline-map]').first();await panel.locator('[data-load-map]').focus();await page.keyboard.press('Enter');const frame=panel.locator('iframe').contentFrame();await frame.locator('.gm-style').waitFor({state:'visible',timeout:30000});await frame.locator('body').evaluate(async()=>{await document.fonts.ready;});const close=panel.locator('[data-close-map]');await touch(close,'Map close');assert.ok((await measured(close)).font>=12);await overflow(page);await panel.scrollIntoViewIfNeeded();await capture(page,key);await close.focus();await page.keyboard.press('Enter');assert.equal(await panel.locator('iframe').count(),0);assert.equal(await panel.locator('[data-load-map]').evaluate(e=>e===document.activeElement),true);report.maps.push({key,status:'passed'});report.checks.push({key,status:'passed'});}catch(error){report.failures.push({key,message:String(error),stack:error.stack});}finally{await context.close();}
 }
 const final=await hashes();assert.deepEqual(final,report.sourceInputs,'Source inputs changed during responsive run');report.sourceInputsUnchanged=true;
}catch(error){report.failures.push({key:'focused-run-integrity',message:String(error),stack:error.stack});console.error(error);
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,viewports:views.length,locales:2,representativeRoutes:routes.length,sourceControls:report.sourceControls,typeImageInstances:report.typeImages,axeScreens:report.axe.length,axeViolations:report.axe.reduce((n,r)=>n+r.violations.length,0),liveMaps:report.maps.length,screenshots:report.screenshots.length};await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.summary);
}
if(report.failures.length)process.exitCode=1;

