import assert from 'node:assert/strict';
import{chromium}from'@playwright/test';
import{readFile,writeFile,mkdir}from'node:fs/promises';
import{createHash}from'node:crypto';
import{dirname}from'node:path';
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4323').origin;
const base='/'+(process.env.PUBLIC_BASE_PATH||'japanese-craft-jewelry').split('/').filter(Boolean).join('/')+'/';
const reportPath=process.env.CHECK_REPORT_PATH||'docs/visual-mobile-stage-source-anchor-race-results.json';
const inputs=['src/components/Sources.astro','src/pages/[lang]/objects/[slug].astro'];
const hashes=async()=>Object.fromEntries(await Promise.all(inputs.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const report={checkedAt:new Date().toISOString(),origin,base,method:'Deterministic same-task source-anchor click then native close, real Enter/close, ordinary settled navigation, direct fragment and history navigation. One temporary generic fragment link tests delegation to a child inside the existing source panel; it is removed after each case. No source files, catalog facts or external links are changed.',sourceInputs:await hashes(),checks:[],failures:[],rapidSequences:0};
await mkdir(dirname(reportPath),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const sourcePath=slug=>'objects/'+slug+'/';
const snapshot=page=>page.evaluate(()=>({at:performance.now(),hash:location.hash,active:document.activeElement?.tagName,open:document.querySelector('#product-sources')?.open,hashEvents:window.__sourceRaceHashes||0}));
const pause=async page=>{await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,120)));};
try{
 for(const locale of ['ja','en'])for(const width of [390,768])for(const slug of ['hamamatsuya-surgical-stainless-pierced-earrings','saskia-diez-drake-porcelain-cuff']){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1024},isMobile:width===390,hasTouch:true,deviceScaleFactor:width===390?2:1,locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage(),key=locale+'-'+width+'-'+slug,steps=[];
  try{
   await page.addInitScript(()=>{window.__sourceRaceHashes=0;addEventListener('hashchange',()=>window.__sourceRaceHashes++);});
   const url=origin+base+locale+'/'+sourcePath(slug);await page.goto(url,{waitUntil:'networkidle'});
   assert.equal(await page.locator('#product-sources').getAttribute('open'),null);
   const rapid=await page.evaluate(()=>{
    const link=document.querySelector('.buying-guide-sources'),panel=document.querySelector('#product-sources'),summary=panel.querySelector('summary');
    link.click();const opened=panel.open;summary.click();return{opened,closedImmediately:!panel.open,hash:location.hash,hashEvents:window.__sourceRaceHashes};
   });steps.push({action:'guide-click-native-close-same-task',...rapid});assert.equal(rapid.opened,true);assert.equal(rapid.closedImmediately,true);
   await pause(page);const afterRapid=await snapshot(page);steps.push({action:'guide-close-after-event-queue',...afterRapid});assert.equal(afterRapid.open,false,'Queued hashchange must not reopen a rapidly closed panel');assert.equal(afterRapid.hashEvents,0,'In-page source click is centralized without a second hashchange');report.rapidSequences++;
   const fixture=await page.evaluate(()=>{
    history.replaceState(null,'',location.pathname);const panel=document.querySelector('#product-sources'),child=panel.querySelector('[data-information-checks]');child.id='source-race-child';
    const link=document.createElement('a');link.href='#source-race-child';link.dataset.sourceRaceFixture='';link.textContent='Test source child anchor';document.body.append(link);
    link.click();const opened=panel.open;panel.querySelector('summary').click();const value={opened,closedImmediately:!panel.open,hash:location.hash};link.remove();return value;
   });steps.push({action:'generic-child-source-click-close-same-task',...fixture});assert.equal(fixture.opened,true);assert.equal(fixture.closedImmediately,true);
   await pause(page);assert.equal((await snapshot(page)).open,false);report.rapidSequences++;
   await page.evaluate(()=>history.replaceState(null,'',location.pathname));
   const guide=page.locator('.buying-guide-sources'),summary=page.locator('#product-sources>summary');
   await guide.focus();await page.keyboard.press('Enter');assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);
   await summary.focus();await page.keyboard.press('Enter');const keyboard=await snapshot(page);steps.push({action:'real-enter-guide-then-close',...keyboard});assert.equal(keyboard.open,false);
   await pause(page);assert.equal((await snapshot(page)).open,false,'Keyboard close remains closed');report.rapidSequences++;
   await page.evaluate(()=>history.replaceState(null,'',location.pathname));
   await guide.click();assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);await pause(page);
   assert.equal(await summary.evaluate(e=>e===document.activeElement),true,'Explicit source navigation focuses its destination summary');
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.closest('#product-sources'))),true,'Next Tab stays inside the revealed source panel');
   await summary.click();assert.equal(await page.locator('#product-sources').getAttribute('open'),null);await pause(page);assert.equal((await snapshot(page)).open,false);
   await page.goBack();await page.waitForFunction(()=>location.hash==='');
   await page.goForward();await page.waitForFunction(()=>location.hash==='#product-sources'&&document.querySelector('#product-sources')?.open===true);
   steps.push({action:'history-forward-fragment',...await snapshot(page)});
   await page.goto(url+'#product-sources',{waitUntil:'networkidle'});assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);
   await summary.focus();await page.keyboard.press('Enter');await pause(page);assert.equal(await page.locator('#product-sources').getAttribute('open'),null);
   report.checks.push({key,status:'passed',rapidSequences:3,steps});console.log('PASS '+key);
  }catch(error){report.failures.push({key,message:String(error),steps,state:await snapshot(page).catch(()=>null)});report.checks.push({key,status:'failed',message:String(error),steps});console.error('FAIL '+key+' '+String(error));}finally{await context.close();}
 }
 for(const locale of ['ja','en'])for(const width of [390,768]){
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false}),page=await context.newPage(),key=locale+'-nojs-'+width;
  try{await page.goto(origin+base+locale+'/'+sourcePath('hamamatsuya-surgical-stainless-pierced-earrings'),{waitUntil:'networkidle'});const panel=page.locator('#product-sources'),summary=panel.locator(':scope>summary');assert.equal(await panel.getAttribute('open'),null);await summary.focus();await page.keyboard.press('Enter');assert.notEqual(await panel.getAttribute('open'),null);assert.equal(await page.locator('[data-information-checks]').isVisible(),true);await summary.focus();await page.keyboard.press('Enter');assert.equal(await panel.getAttribute('open'),null);report.checks.push({key,status:'passed'});}catch(error){report.failures.push({key,message:String(error)});report.checks.push({key,status:'failed',message:String(error)});}finally{await context.close();}
 }
 assert.deepEqual(await hashes(),report.sourceInputs);report.sourceInputsUnchanged=true;
}finally{await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,rapidSequences:report.rapidSequences,sourceInputsUnchanged:report.sourceInputsUnchanged||false};await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.summary);}
if(report.failures.length)process.exitCode=1;

