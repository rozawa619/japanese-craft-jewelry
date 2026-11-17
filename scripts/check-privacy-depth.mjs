import{chromium}from'@playwright/test';
import AxeBuilder from'@axe-core/playwright';
import assert from'node:assert/strict';
import{readFile,writeFile,mkdir}from'node:fs/promises';
import{existsSync}from'node:fs';
import{resolve,dirname}from'node:path';
import{fileURLToPath}from'node:url';
import{createHash}from'node:crypto';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/visual-mobile-stage-browser-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-mobile-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const readJson=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
const catalog=await readJson('src/data/catalog.json'),translations=await readJson('src/data/translations/ja.json');
const guides=await readJson('src/data/product-buying-guides.json'),state=await readJson('src/data/advertising-privacy.json');
const detailImages=await readJson('src/data/product-detail-images.json');
const sourceRecords=await readJson('docs/research/sources.json'),sources=Array.isArray(sourceRecords)?sourceRecords:sourceRecords.sources;
const published=catalog.products.filter(product=>product.publishStatus==='published');
assert.ok(published.length,'Published catalog required.');
assert.deepEqual(Object.keys(guides).sort(),published.map(product=>product.id).sort(),'All and only published products need Q&A guides.');
assert.equal(state.mode,'off');assert.equal(state.policyVersion,'2026-11-17-v14');
const sourcePaths=['src/data/catalog.json','src/data/translations/ja.json','src/data/product-buying-guides.json','docs/research/sources.json','src/data/advertising-privacy.json','src/lib/advertising-privacy.ts','src/components/ProductBuyingGuide.astro','src/components/AdvertisingPrivacyStatus.astro','src/layouts/Base.astro','src/pages/[lang]/[policy].astro','src/pages/[lang]/objects/[slug].astro','src/content/policies/privacy.md','src/content/policies/ja/privacy.md','scripts/check-privacy-depth.mjs'];
sourcePaths.push('src/data/product-detail-images.json','src/components/ProductDetailImage.astro','src/components/VisitGuide.astro','src/lib/store-map-embeds.ts','src/lib/map-embed-url.ts','astro.config.mjs');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const inputHashes=async()=>Object.fromEntries(await Promise.all(sourcePaths.map(async path=>[path,hash(await readFile(resolve(root,path)))])));
const initialHashes=await inputHashes(),norm=value=>value.replace(/\s+/g,' ').trim();
const route=(locale,path='')=>origin+base+locale+'/'+path;
const expectedPrivacy=locale=>route(locale,'privacy/')+'#advertising-choices';
const representative=(preferred,type)=>published.find(product=>product.id===preferred)||published.find(product=>product.productType.includes(type));
const representatives=[representative('hario-little-tears-clip-on-earrings','clip-on-earrings'),representative('sangetsu-irodori-tombodama-necklace','necklace'),representative('simprich-reversible-topaz-ruby-chain-ring','ring')];
assert.ok(representatives.every(Boolean),'Ear/necklace/ring representatives required.');
const representativeIds=new Set(representatives.map(product=>product.id));

// Independent expectations expand raw editorial JSON using catalog facts and
// explicit JA overrides. Do not import the production renderBuyingGuide helper.
function expectedGuide(product,locale){
 const raw=guides[product.id],local=translations.products[product.id]||{};
 assert.ok(raw&&raw[locale]);assert.equal(raw[locale].questions.length,3);
 const expand=text=>text.replace(/\{([^{}]+)\}/g,(_all,token)=>{
  assert.ok(['size','findings','fastening'].includes(token),'Unknown raw guide token '+token);
  const value=locale==='ja'&&Object.hasOwn(local,token)?local[token]:product[token];
  assert.ok(typeof value==='string'&&value.trim(),'Missing raw guide fact '+product.id+'/'+locale+'/'+token);return value;
 });
 return{questions:raw[locale].questions.map(entry=>({question:expand(entry.question),answer:expand(entry.answer)})),sourceIds:raw.sourceIds};
}
const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh Chrome without a user profile. Every published product in EN/JA at1440/390/320 compares all three visible Q&A pairs against independently expanded raw JSON/catalog/JA facts, follows the source-details control and checks footer routing. Six privacy screens inspect inactive status, real external-control hrefs, absence of pretend consent controls, and privacy links. Cookie/local/session storage are checked throughout; each context also inspects IndexedDB/cache/service workers. All external resource requests, page errors and console errors are observed. External settings, merchant pages and applications are not opened. Selected templates use every enabled axe rule. Observed absence of tracking is limited to these scenarios and is not a legal or universal behavior certification.',sourceInputs:{started:initialHashes},checks:[],failures:[],screenshots:[],axePages:[],pageErrors:[],consoleErrors:[],externalRequests:[],adOrCmpRequests:[],detailChecks:0,questionPairs:0,sourceControls:0,privacyScreens:0,footerNavigations:0,storageInspections:0};
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',detail});console.log('PASS '+name);}catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message);}};
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir(resolve(root,'artifacts'),{recursive:true});
async function noOverflow(page,width){
 const value=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(value.document<=width+1&&value.body<=width+1,JSON.stringify(value));return value;
}
async function axe(page,label){
 const result=await new AxeBuilder({page}).analyze();
 const violations=result.violations.map(item=>({id:item.id,impact:item.impact,nodes:item.nodes.map(node=>({target:node.target,html:node.html,reason:node.failureSummary}))}));
 report.axePages.push({label,url:page.url(),violations});assert.deepEqual(violations,[]);
}
async function shot(locator,name){
 await locator.page().evaluate(async()=>{await document.fonts.ready;});await locator.scrollIntoViewIfNeeded();
 await locator.page().evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
 const file='artifacts/'+prefix+'-'+name+'.png';await locator.screenshot({path:resolve(root,file)});report.screenshots.push(file);
}
async function footer(page,locale){
 const link=page.locator('.site-footer a[data-advertising-choices]');assert.equal(await link.count(),1);
 assert.equal(new URL(await link.getAttribute('href'),page.url()).href,expectedPrivacy(locale));
 assert.ok(norm(await link.innerText()).length);return link;
}
async function noTracking(page,context,deep=false){
 const observed=await page.evaluate(async inspectDeep=>({cookie:document.cookie,localStorage:Object.keys(localStorage),sessionStorage:Object.keys(sessionStorage),...(inspectDeep?{indexedDB:typeof indexedDB.databases==='function'?(await indexedDB.databases()).map(database=>database.name):[],cacheStorage:'caches'in window?await caches.keys():[],serviceWorkers:'serviceWorker'in navigator?(await navigator.serviceWorker.getRegistrations()).map(registration=>registration.scope):[]}:{})}),deep);
 assert.equal(observed.cookie,'');assert.deepEqual(observed.localStorage,[]);assert.deepEqual(observed.sessionStorage,[]);assert.deepEqual(await context.cookies(),[]);
 if(deep){assert.deepEqual(observed.indexedDB,[]);assert.deepEqual(observed.cacheStorage,[]);assert.deepEqual(observed.serviceWorkers,[]);}
 const forbidden='ins.adsbygoogle,[data-ad-client],script[src*="adsbygoogle"],script[src*="fundingchoices"],script[src*="doubleclick"],script[src*="googletagmanager"],iframe';
 assert.equal(await page.locator(forbidden).count(),0,'Inactive deployment must not include an advertising/CMP integration or embedded frame.');
 assert.equal(await page.locator('[data-cookie-consent],[data-consent-banner],[data-cmp],#cookie-banner,#onetrust-banner-sdk,#didomi-host,#CybotCookiebotDialog,[role="dialog"]').count(),0,'No pretend or unconfigured consent banner.');
 assert.equal(await page.locator('button').filter({hasText:/^(?:Accept all|Reject all|Agree|I agree|すべて同意|同意する|拒否する)$/i}).count(),0);
 report.storageInspections++;return observed;
}
async function externalChoices(page){
 const links=page.locator('main .prose a[href^="https://"]'),observed=[];
 for(const link of await links.all()){
  const href=await link.getAttribute('href'),target=await link.getAttribute('target'),rel=(await link.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
  assert.ok([null,'_self','_blank'].includes(target));assert.equal(rel.includes('opener'),false);
  if(target==='_blank'){assert.ok(rel.includes('noopener'));assert.ok(rel.includes('noreferrer'));}
  observed.push({href,target,rel});
 }
 for(const required of ['https://adssettings.google.com/partnerads','https://optout.aboutads.info/'])assert.equal(observed.filter(link=>link.href===required).length,1,required);
 assert.ok(observed.some(link=>link.href.startsWith('https://policies.google.com/technologies/partner-sites?')));
 assert.ok(observed.some(link=>link.href.startsWith('https://support.google.com/adsense/answer/13554116?')));
 return observed;
}
try{
 for(const width of [1440,390,320])for(const locale of ['en','ja']){
  const context=await browser.newContext({viewport:{width,height:width>720?1000:844},locale:locale==='ja'?'ja-JP':'en-US',reducedMotion:'reduce'}),page=await context.newPage();
  context.on('request',request=>{
   const url=new URL(request.url());if(!['http:','https:'].includes(url.protocol))return;
   const safeUrl=url.origin+url.pathname;
   if(url.origin!==origin)report.externalRequests.push({page:page.url(),url:safeUrl,type:request.resourceType()});
   if(/(?:googlesyndication|doubleclick|googleadservices|googletagmanager|fundingchoices|privacy-mgmt|cookielaw|onetrust|cookiebot|didomi)/i.test(url.hostname+url.pathname))report.adOrCmpRequests.push({url:safeUrl,type:request.resourceType()});
  });
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:String(error)}));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()});});
  try{
   await check(locale+' '+width+' privacy and real advertising-choice links',async()=>{
    assert.equal((await page.goto(route(locale,'privacy/'),{waitUntil:'load'})).status(),200);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const status=page.locator('[data-ad-privacy-status]');assert.equal(await status.count(),1);assert.equal(await status.getAttribute('data-ad-serving'),state.mode);assert.equal(await status.getAttribute('data-ad-policy-version'),state.policyVersion);
    assert.equal(norm(await status.locator('strong').innerText()),locale==='ja'?'現在、Google AdSenseの広告は配信していません。':'Google AdSense ads are currently off.');
    assert.equal(await page.locator('h2#advertising-choices').count(),1);assert.equal(norm(await page.locator('#advertising-choices').innerText()),locale==='ja'?'広告に関する選択':'Advertising choices');
    const choices=await externalChoices(page);await footer(page,locale);const storage=await noTracking(page,context,true),dimensions=await noOverflow(page,width);
    await axe(page,locale+' '+width+' privacy');if([1440,320].includes(width))await shot(page.locator('.article-wrap'),locale+'-'+width+'-privacy');
    report.privacyScreens++;return{locale,width,choices,storage,dimensions};
   });
   for(const[productIndex,product]of published.entries())await check(locale+' '+width+' product Q&A '+product.id,async()=>{
    assert.equal((await page.goto(route(locale,'objects/'+product.slug+'/'),{waitUntil:'load'})).status(),200);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const detail=detailImages[product.id];assert.ok(detail,'Registered standalone AI image required');
    const detailFigure=page.locator('figure[data-product-detail-asset="'+detail.assetId+'"]');assert.equal(await detailFigure.count(),1);
    const detailImg=detailFigure.locator('img');await detailImg.scrollIntoViewIfNeeded();await detailImg.evaluate(image=>image.decode());
    assert.equal(await detailImg.getAttribute('src'),base+detail.path);assert.equal(await detailImg.getAttribute('alt'),detail.alt[locale]);
    const intrinsic=await detailImg.evaluate(image=>({width:image.naturalWidth,height:image.naturalHeight,fit:getComputedStyle(image).objectFit}));
    assert.deepEqual(intrinsic,{width:detail.width,height:detail.height,fit:'contain'});assert.equal(norm(await detailFigure.locator('figcaption').innerText()),locale==='ja'?'AIイメージ':'AI image');
    assert.equal(await page.locator('.purchase-story [data-detail-official-photo]').count(),1);
    for(const link of await page.locator('[data-japan-official-url],[data-official-product-url],[data-official-home-url]').all())assert.doesNotMatch(norm(await link.innerText()),/https?:\/\/|www\./i,'Raw URLs should be replaced by meaningful labels.');
    if([1440,320].includes(width)&&representativeIds.has(product.id)&&locale==='en')await shot(page.locator('.purchase-story'),locale+'-'+width+'-solo-'+product.id);
    const guide=page.locator('[data-product-buying-guide="'+product.id+'"]');assert.equal(await guide.count(),1);const articles=guide.locator('article[data-buying-question]');assert.equal(await articles.count(),3);
    const expected=expectedGuide(product,locale),answerHashes=[];
    for(const[questionIndex,entry]of expected.questions.entries()){
     const article=articles.nth(questionIndex);assert.equal(await article.locator('h3').count(),1);assert.equal(await article.locator('p').count(),1);
     const actualQuestion=norm(await article.locator('h3').innerText()),actualAnswer=norm(await article.locator('p').innerText());
     assert.equal(actualQuestion,norm(entry.question));assert.equal(actualAnswer,norm(entry.answer));assert.doesNotMatch(actualQuestion+' '+actualAnswer,/\{(?:size|findings|fastening)\}/);
     answerHashes.push(hash(actualAnswer));report.questionPairs++;
    }
    await guide.scrollIntoViewIfNeeded();
    for(const text of await guide.locator('h3,p').all()){const box=await text.boundingBox();assert.ok(box&&box.x>=-1&&box.x+box.width<=width+1,'Q&A text overflows viewport.');}
    const sourceDetails=page.locator('#product-sources');assert.equal(await sourceDetails.count(),1);assert.equal(await sourceDetails.evaluate(node=>node.open),false);
    const sourceControl=guide.locator('a[href="#product-sources"]');assert.equal(await sourceControl.count(),1);await sourceControl.click();
    await page.waitForFunction(()=>document.querySelector('#product-sources')?.open===true,undefined,{timeout:5000});
    assert.equal(new URL(page.url()).hash,'#product-sources');
    const sourceLinks=await sourceDetails.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>({href:node.getAttribute('href'),text:node.textContent,visible:!!node.getClientRects().length,context:node.closest('li')?.textContent||''})));
    for(const id of expected.sourceIds){const source=sources.find(item=>item.id===id);assert.ok(source&&product.sourceIds.includes(id),'Source must belong to the canonical product.');const sourceLink=sourceLinks.find(link=>link.href===source.url&&norm(link.text||'').includes(norm(source.title)));assert.ok(sourceLink?.visible,'Expected visible official source: '+id);assert.ok(sourceLink.context.includes(source.checkedAt));}
    if(width===320&&representativeIds.has(product.id))await axe(page,locale+' '+width+' Q&A '+product.id);
    await sourceDetails.locator('summary').click();assert.equal(await sourceDetails.evaluate(node=>node.open),false);await sourceDetails.locator('summary').click();assert.equal(await sourceDetails.evaluate(node=>node.open),true);await sourceDetails.locator('summary').click();
    report.sourceControls++;
    const footerLink=await footer(page,locale),dimensions=await noOverflow(page,width),storage=await noTracking(page,context);
    if([1440,320].includes(width)&&representativeIds.has(product.id)&&(locale==='en'||product.id===representatives[0].id))await shot(guide,locale+'-'+width+'-guide-'+product.id);
    if(productIndex===0){await footerLink.click();await page.waitForURL(expectedPrivacy(locale));assert.equal(await page.locator('h2#advertising-choices').isVisible(),true);report.footerNavigations++;}
    report.detailChecks++;return{productId:product.id,locale,width,questionTexts:expected.questions.map(entry=>entry.question),answerHashes,sourceIds:expected.sourceIds,dimensions,storage,footerNavigated:productIndex===0};
   });
   await check(locale+' '+width+' context retains no cookies or persisted storage',()=>noTracking(page,context,true));
  }finally{await context.close();}
 }
 await check('No advertising/CMP/external resource request was made',()=>{assert.deepEqual(report.adOrCmpRequests,[]);assert.deepEqual(report.externalRequests,[]);});
 await check('No page or console exception occurred',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);});
 await check('Q&A, privacy and layout inputs remain unchanged during the run',async()=>{report.sourceInputs.completed=await inputHashes();assert.deepEqual(report.sourceInputs.completed,initialHashes);});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(item=>item.status==='passed').length,failed:report.failures.length,publishedProducts:published.length,detailChecks:report.detailChecks,questionPairs:report.questionPairs,sourceControls:report.sourceControls,privacyScreens:report.privacyScreens,footerNavigations:report.footerNavigations,storageInspections:report.storageInspections,axeScreens:report.axePages.length,axeViolations:report.axePages.reduce((total,item)=>total+item.violations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length,adOrCmpRequests:report.adOrCmpRequests.length};
 await mkdir(dirname(resolve(root,reportPath)),{recursive:true});await writeFile(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
