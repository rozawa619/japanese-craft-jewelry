import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4323').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'japanese-craft-jewelry').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/visual-mobile-stage-touch-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-mobile-stage-touch').replace(/[^a-zA-Z0-9_-]/g,'-');
const report={checkedAt:new Date().toISOString(),origin,base,method:'Fresh Chrome mobile emulation at390x844, touch enabled and DPR2. Real tap events exercise menu, filter, language and source controls. This is not physical-device, Safari or iOS testing. Additional section screenshots support visual review only.',checks:[],failures:[],screenshots:[]};
const catalog=JSON.parse(await readFile('src/data/catalog.json','utf8'));
const publishedProductCount=catalog.products.filter(product=>product.publishStatus==='published').length;
await mkdir(dirname(reportPath),{recursive:true});await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true}),url=(locale,path='')=>origin+base+locale+'/'+path;
try{
 for(const locale of ['ja','en']){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage(),errors=[],external=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(new URL(r.url()).origin!==origin)external.push(r.url());});
  try{
   await page.goto(url(locale),{waitUntil:'networkidle'});
   await page.locator('.mobile-nav>summary').tap();assert.notEqual(await page.locator('.mobile-nav').getAttribute('open'),null);
   await Promise.all([page.waitForURL('**/'+locale+'/objects/'),page.locator('.mobile-nav nav a[href$="/objects/"]').tap()]);
   await page.locator('.page-heading>.text-link').tap();assert.equal(new URL(page.url()).hash,'#all-jewelry');
   const type=page.locator('select[name=type]');await type.tap();await page.keyboard.press('Escape');await type.selectOption('pierced-earrings');await page.locator('select[name=prefecture]').selectOption('kanagawa');
   const expected=catalog.products.filter(p=>p.publishStatus==='published'&&p.prefectureIds.includes('kanagawa')&&p.productType.includes('pierced-earrings')).length;
   assert.equal(await page.locator('[data-product-card]:visible').count(),expected);
   const target=locale==='ja'?'en':'ja';await Promise.all([page.waitForURL('**/'+target+'/objects/**'),page.locator('.language-switch').tap()]);
   const switched=new URL(page.url());assert.equal(switched.searchParams.get('type'),'pierced-earrings');assert.equal(switched.searchParams.get('prefecture'),'kanagawa');assert.equal(switched.hash,'#all-jewelry');
   assert.equal(await page.locator('select[name=type]').inputValue(),'pierced-earrings');
   await Promise.all([page.waitForURL('**/'+locale+'/objects/**'),page.locator('.language-switch').tap()]);
   await page.locator('.reset-button').first().tap();assert.equal(await page.locator('[data-product-card]:visible').count(),publishedProductCount);
   const productLink=page.locator('[data-product-card]:visible .card-art-link').first();
   await Promise.all([page.waitForURL('**/'+locale+'/objects/*/'),productLink.tap()]);
   assert.equal(await page.locator('#product-sources').getAttribute('open'),null);
   await page.locator('.buying-guide-sources').tap();assert.notEqual(await page.locator('#product-sources').getAttribute('open'),null);
   assert.equal(await page.locator('[data-information-checks]').isVisible(),true);
   const screenshot='artifacts/'+prefix+'-'+locale+'-390-sources.png';await page.screenshot({path:screenshot});report.screenshots.push(screenshot);
   await page.locator('#product-sources>summary').tap();assert.equal(await page.locator('#product-sources').getAttribute('open'),null);
   assert.equal(await page.locator('iframe').count(),0);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   report.checks.push({key:locale+'-touch-navigation-filter-language-source',status:'passed',width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2,externalRequests:0,pageErrors:0,filteredProductCount:expected});
  }catch(error){report.failures.push({key:locale+'-touch',message:String(error)});console.error(error);}finally{await context.close();}
 }
 for(const locale of ['ja','en']){
  const context=await browser.newContext({viewport:{width:320,height:740},locale:locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage();
  try{
   for(const[name,path,selector]of [['home-kinds','','.kind-choices'],['region-choices','places/kanagawa/','[data-regional-choice=kanagawa]'],['listing-heading','objects/','.page-heading']]){
    await page.goto(url(locale,path),{waitUntil:'networkidle'});const section=page.locator(selector);await section.scrollIntoViewIfNeeded();
    for(const img of await section.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(async e=>{await e.decode();});}
    const screenshot='artifacts/'+prefix+'-'+locale+'-'+name+'-320.png';await section.screenshot({path:screenshot});report.screenshots.push(screenshot);
   }
   report.checks.push({key:locale+'-supplemental-section-captures',status:'passed'});
  }catch(error){report.failures.push({key:locale+'-screenshots',message:String(error)});}finally{await context.close();}
 }
}finally{await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,mobileTouchFlows:report.checks.filter(c=>c.isMobile).length,screenshots:report.screenshots.length};await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.summary);}
if(report.failures.length)process.exitCode=1;

