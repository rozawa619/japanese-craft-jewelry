import {chromium} from '@playwright/test';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-seo-stage-layout').replace(/[^a-zA-Z0-9_-]/g,'-');
const reportPath=process.env.CHECK_IMAGE_LAYOUT_REPORT_PATH||'docs/visual-seo-stage-image-layout-results.json';
const report={checkedAt:new Date().toISOString(),origin,base,method:'18 layout captures for a subsequent human review: EN/JA at1440/390/320, with the existing home hero, mixed original/new product cards, a new Fukuoka representative in EN and an original Tokyo representative in JA. Visible images are loaded and decoded, and fonts settled, before capture. A completed capture is not an automated aesthetic judgement.',captures:[]};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const [locale,width]of [['en',1440],['en',390],['en',320],['ja',1440],['ja',390],['ja',320]]){
  const page=await browser.newPage({viewport:{width,height:width>720?1000:844},reducedMotion:'reduce'});
  for(const path of ['','objects/','places/']){
   const response=await page.goto(origin+base+locale+'/'+path,{waitUntil:'load'});
   if(response?.status()!==200)throw new Error('Unexpected response for '+page.url());
   const region=locale==='en'?'fukuoka':'tokyo';
   const view=path==='objects/'?'catalog':path==='places/'?region+'-row':'home';
   if(view==='catalog')await page.locator('#object-results').evaluate(node=>node.scrollIntoView({block:'start'}));
   const frame=path==='places/'?page.locator('[data-region-row="'+region+'"]'):null;
   if(frame)await frame.scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>Array.from(document.images).filter(image=>{const box=image.getBoundingClientRect();return box.bottom>0&&box.top<innerHeight&&box.right>0&&box.left<innerWidth;}).every(image=>image.complete&&image.naturalWidth>0));
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).filter(image=>{const box=image.getBoundingClientRect();return box.bottom>0&&box.top<innerHeight;}).map(image=>image.decode()));});
   const file='artifacts/'+prefix+'-'+locale+'-'+width+'-'+view+'.png';
   if(frame)await frame.screenshot({path:resolve(root,file)});else await page.screenshot({path:resolve(root,file)});
   report.captures.push({locale,width,view,url:page.url(),file});
  }
  await page.close();
 }
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.summary={captures:report.captures.length,manualReviewRequired:true};
 await writeFile(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));
}
