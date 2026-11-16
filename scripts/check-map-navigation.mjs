import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4322').origin;
const base='/'+(process.env.PUBLIC_BASE_PATH||'/japanese-craft-jewelry/').split('/').filter(Boolean).join('/')+'/';
const report={checkedAt:new Date().toISOString(),origin,base,method:'Read-only clicks of two external Maps buttons in fresh Chrome. No consent accepted, location permission granted, origin entered, shop contacted or map content copied. External navigation is separate from route/result accuracy.',examples:[]};
const examples=[{product:'hamamatsuya-surgical-stainless-pierced-earrings',locale:'en',store:'hamamatsuya-hatajuku-main',action:'search'},{product:'kato-suke-drop-pierced-earrings',locale:'ja',store:'kato-shippo-store',action:'directions'}];
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const example of examples){
  const context=await browser.newContext({locale:example.locale==='ja'?'ja-JP':'en-US'}),page=await context.newPage();
  try{
   await page.goto(origin+base+example.locale+'/objects/'+example.product+'/',{waitUntil:'load'});
   const anchor=page.locator('[data-store-id="'+example.store+'"] [data-map-action="'+example.action+'"]');
   const href=await anchor.getAttribute('href'),url=new URL(href);assert.equal(url.origin,'https://www.google.com');assert.equal(url.searchParams.get('api'),'1');assert.equal(url.searchParams.has('origin'),false);
   const opened=page.waitForEvent('popup');await anchor.click();const popup=await opened;
   let navigationError=null;try{await popup.waitForLoadState('domcontentloaded',{timeout:20000})}catch(error){navigationError=String(error).split('\n')[0]}
   const popupURL=popup.url(),title=await popup.title().catch(()=>null);
   const googleNavigationObserved=['www.google.com','maps.google.com','consent.google.com','www.google.co.jp'].includes(new URL(popupURL).hostname);
   const consentObserved=/consent\.google\./.test(popupURL)||/before you continue|同意|consent/i.test(title||'');
   report.examples.push({...example,buttonHref:href,newTabOpened:true,popupURL,title,googleNavigationObserved,consentObserved,navigationError,outcome:googleNavigationObserved?(consentObserved?'Google consent page observed; no consent submitted':'External Google navigation observed; map/route correctness not independently established'):'New-tab URL generation works; external Google load unavailable or not confirmed',sourceMapEmbed:false});
  }catch(error){report.examples.push({...example,error:String(error)})}finally{await context.close()}
 }
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;
 await writeFile(resolve(root,process.env.CHECK_MAP_REPORT_PATH||'docs/destination-stage-map-navigation-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({examples:report.examples.length,newTabs:report.examples.filter(example=>example.newTabOpened).length,googleObserved:report.examples.filter(example=>example.googleNavigationObserved).length,errors:report.examples.filter(example=>example.error).length}));
 if(report.examples.some(example=>example.error))process.exitCode=1;
}
