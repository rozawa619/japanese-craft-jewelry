/** Read-only browser checks for the functional Google Maps preference.
 * Use a stable build; this script never builds or changes application inputs.
 * Most checks abort all external requests. Opt in to live Google separately:
 * CHECK_LIVE_GOOGLE_MAPS=1 (provider documents/tiles may use Google cookies).
 */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {reviewedStoreMapEmbeds} from '../src/lib/store-map-embeds.ts';

assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL explicitly to the stable preview or public origin.');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH to the stable build base.');
const inputOrigin=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(inputOrigin.protocol)&&inputOrigin.pathname==='/'&&!inputOrigin.search&&!inputOrigin.hash&&!inputOrigin.username&&!inputOrigin.password,'CHECK_BASE_URL must be an origin only.');
const origin=inputOrigin.origin,parts=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/discovery-map-stage-preferences-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'discovery-map-stage-preferences').replace(/[^a-zA-Z0-9_-]/g,'-');
const live=process.env.CHECK_LIVE_GOOGLE_MAPS==='1';
const onlyCase=process.env.CHECK_MAP_CASE||'';
// These expectations are deliberately independent of the parser under test.
const key='jcj.map-choice.v1',version='2026-11-17-maps-v17',ttl=30*24*60*60*1000;
const json=async p=>JSON.parse((await readFile(p,'utf8')).replace(/^\uFEFF/,''));
const [catalog,visits]=await Promise.all(['src/data/catalog.json','src/data/visits.json'].map(json));
const published=catalog.products.filter(p=>p.publishStatus==='published');
const candidates=visits.products.map(v=>({product:published.find(p=>p.id===v.productId),stores:v.storeIds.filter(id=>reviewedStoreMapEmbeds[id])})).filter(v=>v.product&&v.stores.length).sort((a,b)=>b.stores.length-a.stores.length);
assert.ok(candidates.length>=2,'Need two published products with verified map embeds.');
const primary=candidates[0],secondary=candidates.find(v=>v.product.id!==primary.product.id);
assert.ok(primary.stores.length>=2,'The global page choice must be tested with multiple stores.');
const url=(locale,route='')=>origin+base+locale+'/'+route;
const productUrl=(locale,item=primary)=>url(locale,'objects/'+item.product.slug+'/');
const pref=(choice='allowed',time=Date.now())=>({version,choice,savedAt:time,expiresAt:time+ttl});
const inputPaths=['src/components/VisitGuide.astro','src/components/MapPreferences.astro','src/lib/map-preferences.ts','src/lib/map-preferences-client.ts','src/lib/map-embed-url.ts','src/lib/store-map-embeds.ts','src/data/catalog.json','src/data/visits.json','src/content/policies/privacy.md','src/content/policies/ja/privacy.md'];
const hashes=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,expectedChecks:onlyCase?1:live?23:22,selectedCase:onlyCase||null,method:'Fresh Chrome contexts test real map controls, preference persistence across products/languages/reload, global revocation, invalid/expired state, blocked storage, cross-tab synchronization, no-JavaScript fallback, keyboard and responsive accessibility. Normal tests intercept and abort every external request, including Google iframe navigation; expected blocked-resource console messages are recorded separately from application errors.',limits:'Aborted Google requests prove connection intent, not rendered geographical accuracy, tiles, attribution or third-party cookie behavior. Optional live-provider checks are separate and require CHECK_LIVE_GOOGLE_MAPS=1. Chrome emulation is not physical iOS/Safari certification. Browser storage is functional map preference, not an advertising CMP.',sourceInputs:{started:await hashes()},representatives:{primary:{productId:primary.product.id,slug:primary.product.slug,storeIds:primary.stores},secondary:{productId:secondary.product.id,slug:secondary.product.slug,storeIds:secondary.stores}},liveGoogleRequested:live,checks:[],failures:[],axe:[],screenshots:[]};
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const google=value=>{const h=new URL(value).hostname;return /(^|\.)(google\.[a-z.]+|gstatic\.com|googleapis\.com|googleusercontent\.com|ggpht\.com)$/.test(h);};
const flush=()=>writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
async function setup({locale='ja',width=390,seed,blocked=false,writeBlocked=false,nojs=false,liveProvider=false}={}){
 const options={viewport:{width,height:width===1440?1000:844},locale:locale==='ja'?'ja-JP':'en-US',isMobile:width<768,hasTouch:width<768,deviceScaleFactor:1,javaScriptEnabled:!nojs,serviceWorkers:'block'};
 if(seed!==undefined)options.storageState={cookies:[],origins:[{origin,localStorage:[{name:key,value:typeof seed==='string'?seed:JSON.stringify(seed)}]}]};
 const context=await browser.newContext(options),attempts=[],errors=[],consoleErrors=[],expectedBlockedConsole=[],providerPageErrors=[],navigationEvents=[],navigations=[];
 await context.exposeBinding('__observeMapNavigation',({frame},event)=>{if(!frame.parentFrame())navigationEvents.push(event);});
 await context.addInitScript(()=>{if(window!==window.top)return;for(const type of ['pointerdown','pointerup','click'])document.addEventListener(type,event=>{const e=event.target;window.__observeMapNavigation({type,url:location.href,x:event.clientX,y:event.clientY,tag:e?.tagName,className:typeof e?.className==='string'?e.className:'',href:e?.closest?.('a')?.getAttribute('href'),defaultPrevented:event.defaultPrevented});},true);});
 if(blocked)await context.addInitScript(()=>{for(const method of ['getItem','setItem','removeItem'])Object.defineProperty(Storage.prototype,method,{configurable:true,value(){throw new DOMException('Storage is blocked for this test','SecurityError');}});});
 if(writeBlocked)await context.addInitScript(()=>Object.defineProperty(Storage.prototype,'setItem',{configurable:true,value(){throw new DOMException('Storage write quota is blocked for this test','QuotaExceededError');}}));
 await context.route('**/*',async route=>{
  const req=route.request(),u=new URL(req.url());
  if(u.origin===origin){await route.continue();return;}
  const attempt={url:req.url(),resourceType:req.resourceType(),google:google(req.url()),action:liveProvider&&google(req.url())?'continued-live-provider':'aborted'};attempts.push(attempt);
  if(attempt.action==='continued-live-provider')await route.continue();else await route.abort('blockedbyclient');
 });
 const observe=page=>{
  page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations.push(frame.url());});
  page.on('pageerror',e=>{const detail=String(e.stack||e);if(liveProvider&&/https:\/\/[^\s/]*(?:google|gstatic|googleapis|googleusercontent)[^\s/]*\//i.test(detail))providerPageErrors.push(detail);else errors.push(detail);});
  page.on('console',message=>{if(message.type()!=='error')return;const detail={text:message.text(),location:message.location()};if(!liveProvider&&/Failed to load resource: net::ERR_(?:BLOCKED_BY_CLIENT|FAILED|ABORTED)/.test(detail.text))expectedBlockedConsole.push(detail);else consoleErrors.push(detail);});
 };
 const page=await context.newPage();observe(page);
 return{context,page,attempts,errors,consoleErrors,expectedBlockedConsole,providerPageErrors,navigationEvents,navigations,observe};
}
async function goto(page,target){const r=await page.goto(target,{waitUntil:'networkidle',timeout:45000});assert.equal(r?.status(),200,'Expected200 '+target);}
const panels=page=>page.locator('[data-inline-map]');
const frames=page=>page.locator('iframe[data-inline-map-frame]');
async function empty(page){await expect(frames(page)).toHaveCount(0);}
async function loaded(page,item=primary,locale='ja'){
 await expect(panels(page)).toHaveCount(item.stores.length);
 await expect(frames(page)).toHaveCount(item.stores.length);
 for(const id of item.stores){const panel=page.locator('[data-store-id="'+id+'"] [data-inline-map]'),f=panel.locator('iframe');assert.equal(await f.getAttribute('src'),new URL(reviewedStoreMapEmbeds[id][locale]).href);assert.ok((await f.getAttribute('title'))?.trim());assert.equal(await f.getAttribute('referrerpolicy'),'strict-origin-when-cross-origin');await expect(panel.locator('[data-close-map]')).toBeVisible();}
}
async function storage(page,expectedChoice){
 const s=await page.evaluate(()=>({local:Object.fromEntries(Object.entries(localStorage)),session:Object.keys(sessionStorage),cookie:document.cookie}));
 assert.deepEqual(Object.keys(s.local),[key]);assert.deepEqual(s.session,[]);assert.equal(s.cookie,'');
 const p=JSON.parse(s.local[key]);assert.deepEqual(Object.keys(p).sort(),['choice','expiresAt','savedAt','version']);assert.equal(p.version,version);assert.equal(p.choice,expectedChoice);assert.ok(Number.isSafeInteger(p.savedAt)&&p.savedAt<=Date.now()+1000);assert.equal(p.expiresAt-p.savedAt,ttl);return p;
}
async function assertClean(test,{externalAllowed=false}={}){
 assert.deepEqual(test.errors,[],'No application page errors.');assert.deepEqual(test.consoleErrors,[],'No application/unexpected console errors.');
 if(!externalAllowed)assert.deepEqual(test.attempts,[],'No external connection before a valid opt-in.');else assert.ok(test.attempts.every(a=>a.google),'Only Google map-provider attempts permitted.');
 assert.equal((await test.context.cookies(origin)).length,0,'No first-party cookie written.');
}
async function axe(page,name){const r=await new AxeBuilder({page}).analyze();const violations=r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));report.axe.push({name,url:page.url(),violations});assert.deepEqual(violations,[],'axe violations in '+name);}
async function shot(page,name,selector='[data-inline-map]'){
 await page.locator(selector).first().scrollIntoViewIfNeeded();
 const file='artifacts/'+prefix+'-'+name+'.png';await page.screenshot({path:file,fullPage:false});report.screenshots.push(file);return file;
}
async function check(name,fn){
 if(onlyCase&&name!==onlyCase)return;
 try{const detail=await fn();report.checks.push({name,status:'passed',...detail});console.log('PASS '+name);}
 catch(error){const f={name,status:'failed',message:String(error)};report.checks.push(f);report.failures.push(f);console.error('FAIL '+name+' '+String(error));}
 await flush();
}

try{
 for(const locale of ['ja','en'])for(const width of [320,390,1440])await check(locale+'-responsive-consent-'+width,async()=>{
  const test=await setup({locale,width}),{page}=test;
  try{
   await goto(page,productUrl(locale));await empty(page);assert.deepEqual(test.attempts,[]);
   assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(await page.locator('details[data-source-disclosure][open]').count(),0);
   const panel=panels(page).first(),allow=panel.locator('[data-load-map]'),deny=panel.locator('[data-deny-map]');
   await expect(allow).toBeVisible();await expect(deny).toBeVisible();
   for(const control of [allow,deny]){const b=await control.boundingBox();assert.ok(b&&b.width>=44&&b.height>=44,'Equal availability includes44px controls.');}
   const treatment=await Promise.all([allow,deny].map(c=>c.evaluate(e=>{const s=getComputedStyle(e);return{background:s.backgroundColor,color:s.color,font:s.fontSize,border:s.borderStyle};})));assert.deepEqual(treatment[0],treatment[1],'Allow/refuse have the same visual treatment.');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await axe(page,locale+'-map-off-'+width);const screenshot=await shot(page,locale+'-off-'+width);
   await allow.focus();assert.equal(await allow.evaluate(e=>document.activeElement===e),true);await page.keyboard.press('Enter');
   await loaded(page,primary,locale);const record=await storage(page,'allowed');
   for(const p of await panels(page).all())await p.scrollIntoViewIfNeeded();
   await expect.poll(()=>test.attempts.length).toBeGreaterThanOrEqual(primary.stores.length);
   for(const p of await panels(page).all()){const b=await p.locator('.map-viewport').boundingBox();assert.ok(b&&b.width>200&&b.height>=250&&b.width<=width,'Map viewport is larger, visible, and fits.');if(width===1440)assert.ok(b.width>=400,'Desktop map uses available room.');}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.reload({waitUntil:'networkidle'});await loaded(page,primary,locale);assert.equal((await storage(page,'allowed')).savedAt,record.savedAt,'Reload does not silently renew expiry.');
   // Keep input/actionability and navigation diagnostics separate. A URL
   // predicate permits a preserved query/hash; assert those separately below.
   const other=locale==='ja'?'en':'ja',beforeSwitch=new URL(page.url());
   const language=page.locator('.language-switch');await language.scrollIntoViewIfNeeded();
   // CSS smooth scrolling and restored focus near a lazy iframe can leave the
   // compositor moving after an automatic jump to the distant header. Observe
   // stable scroll frames instead of disabling CSS or dispatching a DOM click.
   await page.evaluate(async()=>{let previous=scrollY,stable=0;for(let i=0;i<240;i++){await new Promise(resolve=>requestAnimationFrame(resolve));if(scrollY===previous)stable++;else stable=0;previous=scrollY;if(stable>=8)return;}throw Error('Header scroll never settled');});
   const point=await language.evaluate(e=>{const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;return{x,y,hit:e.contains(document.elementFromPoint(x,y))};});assert.equal(point.hit,true,'The language link is the real pointer hit target.');
   await page.mouse.click(point.x,point.y,{delay:50});
   await expect.poll(()=>test.navigationEvents.some(e=>e.type==='click'&&e.href&&new URL(e.href,origin).pathname===base+other+'/objects/'+primary.product.slug+'/')).toBe(true);
   await page.waitForURL(u=>u.pathname===base+other+'/objects/'+primary.product.slug+'/',{waitUntil:'domcontentloaded',timeout:15000});
   const switched=new URL(page.url());assert.equal(switched.search,beforeSwitch.search);assert.equal(switched.hash,beforeSwitch.hash);await loaded(page,primary,other);
   await goto(page,productUrl(other,secondary));await loaded(page,secondary,other);
   await panels(page).first().locator('[data-close-map]').click();await empty(page);await storage(page,'denied');
   await page.reload({waitUntil:'networkidle'});await empty(page);assert.equal(await panels(page).first().getAttribute('data-map-choice'),'denied');
   await goto(page,url(locale,'privacy/#map-preferences'));await expect(page.locator('[data-map-settings]')).toBeVisible();if(width===390)await axe(page,locale+'-privacy-settings-390');
   await page.locator('[data-map-allow-all]').click();await storage(page,'allowed');
   await goto(page,productUrl(locale));await loaded(page,primary,locale);
   await goto(page,url(locale,'privacy/#map-preferences'));await page.locator('[data-map-deny-all]').click();await storage(page,'denied');
   await goto(page,productUrl(locale));await empty(page);await assertClean(test,{externalAllowed:true});
   return{locale,width,productStores:primary.stores.length,initialFrames:0,initialExternalAttempts:0,googleAttempts:test.attempts.length,expectedBlockedConsole:test.expectedBlockedConsole.length,storageKeys:[key],expiryMilliseconds:ttl,screenshot,applicationErrors:0,languageClick:{point,settledAnimationFrames:8,inputEvents:test.navigationEvents.filter(e=>e.href&&new URL(e.href,origin).pathname===base+other+'/objects/'+primary.product.slug+'/')},navigations:test.navigations};
  }catch(error){
   const state={url:page.url(),languageHref:await page.locator('.language-switch').getAttribute('href').catch(()=>null),languageText:await page.locator('.language-switch').innerText().catch(()=>null),documentLanguage:await page.locator('html').getAttribute('lang').catch(()=>null),navigationEvents:test.navigationEvents,navigations:test.navigations,pageErrors:test.errors,consoleErrors:test.consoleErrors};
   const file='artifacts/'+prefix+'-'+locale+'-'+width+'-failure.png';await page.screenshot({path:file,fullPage:false}).catch(()=>{});report.screenshots.push(file);
   error.message+='; observed state: '+JSON.stringify(state);throw error;
  }finally{await test.context.close();}
 });

 const now=Date.now();
 const invalids=[['expired',pref('allowed',now-ttl-1000)],['old-version',{...pref(),version:'old-map-purpose'}],['malformed-json','{not-json'],['extra-tracking-field',{...pref(),visitorId:'not-allowed'}],['extended-lifetime',{...pref(),expiresAt:now+ttl*2}],['future-timestamp',pref('allowed',now+24*60*60*1000)]];
 for(const[name,seed]of invalids)await check('reject-'+name,async()=>{
  const test=await setup({seed});try{await goto(test.page,productUrl('ja'));await empty(test.page);assert.equal(await test.page.evaluate(k=>localStorage.getItem(k),key),null,'Invalid/expired preference must be removed, not retained indefinitely.');await assertClean(test);return{invalidSeed:name,frames:0,externalAttempts:0,invalidRecordRemoved:true};}finally{await test.context.close();}
 });

 for(const locale of ['ja','en'])await check(locale+'-blocked-storage',async()=>{
  const test=await setup({locale,blocked:true}),{page}=test;
  try{await goto(page,productUrl(locale));await empty(page);assert.deepEqual(test.attempts,[]);await panels(page).first().locator('[data-load-map]').click();await loaded(page,primary,locale);await expect(panels(page).first().locator('[data-map-status]')).toContainText(locale==='ja'?'保存':'save');await page.reload({waitUntil:'networkidle'});await empty(page);await expect(panels(page).first()).toHaveAttribute('data-map-choice','unselected');await assertClean(test,{externalAllowed:true});return{locale,pageContinuesWithoutStorage:true,reloadFrames:0,applicationErrors:0};}finally{await test.context.close();}
 });

 await check('readable-storage-with-write-failure-old-allow',async()=>{
  const test=await setup({seed:pref(),writeBlocked:true}),{page}=test;
  try{
   await goto(page,productUrl('ja'));await empty(page);assert.deepEqual(test.attempts,[],'A stale allow cannot autoload if writes cannot safely persist revocation.');assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null,'Best-effort remove the old allowed value.');
   await panels(page).first().locator('[data-load-map]').click();await loaded(page);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);
   await page.evaluate(()=>{window.dispatchEvent(new Event('pageshow'));document.dispatchEvent(new Event('visibilitychange'));});await loaded(page);
   await panels(page).first().locator('[data-close-map]').click();await empty(page);await page.reload({waitUntil:'networkidle'});await empty(page);await assertClean(test,{externalAllowed:true});return{getItemAvailable:true,setItemThrows:'QuotaExceededError',oldAllowRemoved:true,initialFrames:0,explicitPageOnlyAllow:true,pageshowKeepsMemoryChoice:true,revocationSurvivesReload:true};
  }finally{await test.context.close();}
 });

 await check('cross-tab-global-revocation-and-clear',async()=>{
  const test=await setup(),a=test.page,b=await test.context.newPage();test.observe(b);
  try{
   await goto(a,productUrl('ja'));await panels(a).first().locator('[data-load-map]').click();await loaded(a);
   await goto(b,productUrl('en',secondary));await loaded(b,secondary,'en');
   await panels(a).first().locator('[data-close-map]').click();await empty(a);await empty(b);await expect(panels(b).first()).toHaveAttribute('data-map-choice','denied');
   await panels(b).first().locator('[data-load-map]').click();await loaded(b,secondary,'en');await loaded(a);
   await goto(b,url('en','privacy/#map-preferences'));await b.locator('[data-map-deny-all]').click();await empty(a);await expect(panels(a).first()).toHaveAttribute('data-map-choice','denied');
   await b.locator('[data-map-allow-all]').click();await loaded(a);await goto(b,productUrl('en',secondary));await loaded(b,secondary,'en');
   await b.evaluate(()=>localStorage.clear());await empty(a);await expect(panels(a).first()).toHaveAttribute('data-map-choice','unselected');
   await b.reload({waitUntil:'networkidle'});await empty(b);await assertClean(test,{externalAllowed:true});return{tabs:2,sharedAcrossLanguages:true,revocationStopsOtherTab:true,privacySettingsStopActiveOtherTab:true,storageClearStopsOtherTab:true};
  }finally{await test.context.close();}
 });

 for(const[name,malicious]of [['other-provider','https://attacker.example/maps/embed?pb=!123456789012345678901234567890'],['script-scheme','javascript:alert(1)'],['extra-api-key','https://www.google.com/maps/embed?pb=!123456789012345678901234567890&key=unreviewed-key']])await check('reject-embed-'+name,async()=>{
  const test=await setup();try{await goto(test.page,productUrl('ja'));await test.page.locator('[data-inline-map]').evaluateAll((elements,value)=>elements.forEach(e=>e.setAttribute('data-map-embed',value)),malicious);await panels(test.page).first().locator('[data-load-map]').click();await empty(test.page);await assertClean(test);return{maliciousKind:name,frames:0,externalAttempts:0};}finally{await test.context.close();}
 });

 for(const locale of ['ja','en'])await check(locale+'-javascript-disabled-fallback',async()=>{
  const test=await setup({locale,nojs:true,seed:pref()});try{await goto(test.page,productUrl(locale));await empty(test.page);const links=await test.page.locator('[data-map-action]').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),target:e.getAttribute('target'),rel:e.getAttribute('rel')})));assert.ok(links.length>=primary.stores.length*2);for(const link of links){const u=new URL(link.href);assert.equal(u.origin,'https://www.google.com');assert.ok(['/maps/search/','/maps/dir/'].includes(u.pathname));assert.equal(link.target,'_blank');assert.match(link.rel,/noopener/);}assert.ok(await test.page.locator('noscript').count());await assertClean(test);return{locale,externalMapLinks:links.length,storedAllowDoesNotBypassNoJs:true,initialExternalAttempts:0};}finally{await test.context.close();}
 });

 await check('active-choice-expires-without-navigation',async()=>{
  const start=Date.now(),test=await setup({seed:pref('allowed',start)}),{page}=test;
  try{await page.clock.install({time:start});await goto(page,productUrl('ja'));await loaded(page);await page.clock.fastForward(ttl+1000);await empty(page);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null,'Expired value removed during the open page.');await assertClean(test,{externalAllowed:true});return{simulatedElapsedMilliseconds:ttl+1000,expiredFrames:0,expiredRecordRemoved:true};}finally{await test.context.close();}
 });

 if(live)await check('optional-live-google-two-stores',async()=>{
  const test=await setup({width:1440,liveProvider:true}),{page}=test;const evidence=[];
  try{await goto(page,productUrl('ja'));await empty(page);assert.deepEqual(test.attempts,[]);await panels(page).first().locator('[data-load-map]').click();await loaded(page);
   for(const id of primary.stores.slice(0,2)){const panel=page.locator('[data-store-id="'+id+'"] [data-inline-map]');await panel.scrollIntoViewIfNeeded();const iframe=panel.locator('iframe');const frame=await(await iframe.elementHandle()).contentFrame();await frame.waitForLoadState('domcontentloaded',{timeout:45000});await expect.poll(async()=>{const body=await frame.locator('body').innerText();return /Google/.test(body);},{timeout:45000}).toBe(true);const detail=await frame.locator('body').evaluate(e=>({text:e.innerText.slice(-1800),images:[...e.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth>0).length}));assert.ok(detail.images>0,'Live provider images actually rendered.');const screenshot=await shot(page,'live-'+id,'[data-store-id="'+id+'"] [data-inline-map]');evidence.push({storeId:id,googleAttributionTextPresent:/Google/.test(detail.text),loadedProviderImages:detail.images,screenshot});}
   assert.deepEqual(test.errors,[]);await panels(page).first().locator('[data-close-map]').click();await empty(page);return{liveGoogle:true,stores:evidence,providerRequests:test.attempts.length,consoleMessages:test.consoleErrors,providerPageErrors:test.providerPageErrors,limits:'Loaded Google text and provider images plus screenshots; exact pin/address and attribution visibility still require image review. May have used Google cookies after the explicit opt-in. Provider-origin errors are separately recorded, not counted as application exceptions.'};
  }finally{await test.context.close();}
 });
}finally{
 await browser.close();report.sourceInputs.finished=await hashes();report.sourceInputs.unchanged=JSON.stringify(report.sourceInputs.started)===JSON.stringify(report.sourceInputs.finished);
 if(!report.sourceInputs.unchanged)report.failures.push({name:'stable-inputs',message:'Application inputs changed during the browser run.'});
 if(report.checks.length!==report.expectedChecks)report.failures.push({name:'complete-coverage',message:'Not every planned browser case completed.'});
 report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,responsiveFlows:report.checks.filter(c=>c.name.includes('responsive-consent')).length,invalidPreferenceCases:invalidsCount(report),blockedStorageFlows:report.checks.filter(c=>c.name.endsWith('blocked-storage')).length,axeScreens:report.axe.length,axeViolations:report.axe.reduce((n,a)=>n+a.violations.length,0),screenshots:report.screenshots.length,liveGoogleChecks:report.checks.filter(c=>c.liveGoogle).length,sourceInputsUnchanged:report.sourceInputs.unchanged};await flush();console.log(report.summary);
}
function invalidsCount(r){return r.checks.filter(c=>/^reject-(?:expired|old-version|malformed-json|extra-tracking-field|extended-lifetime|future-timestamp)$/.test(c.name)).length;}
if(report.failures.length)process.exitCode=1;
