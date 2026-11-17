import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {assertStylingFigure,assertPageStylingFigures} from './image-display-assertions.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-seo-stage-images').replace(/[^a-zA-Z0-9_-]/g,'-');
const reportPath=process.env.CHECK_IMAGE_BROWSER_REPORT_PATH||'docs/visual-seo-stage-image-browser-results.json';
const json=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
const catalog=await json('src/data/catalog.json'),registry=await json('src/data/editorial-images.json'),baseline=await json('docs/research/image-baseline-v12.json');
const published=catalog.products.filter(product=>product.publishStatus==='published');
assert.deepEqual(Object.keys(registry).sort(),published.map(product=>product.id).sort(),'All and only published products need styling images in this release.');
const originalIds=new Set(baseline.files.flatMap(file=>file.productIds));
const added=published.filter(product=>!originalIds.has(product.id));
const inputs=['src/data/catalog.json','src/data/editorial-images.json','src/components/EditorialImage.astro','docs/assets.json','src/config/region-selection.ts','src/config/selection.ts'];
const hashes=async()=>Object.fromEntries(await Promise.all(inputs.map(async path=>[path,createHash('sha256').update(await readFile(resolve(root,path))).digest('hex')])));
const sourceInputs=await hashes();
const route=(locale,path='')=>origin+base+locale+'/'+path;
const report={checkedAt:new Date().toISOString(),origin,base,sourceInputs:{started:sourceInputs},method:'Fresh Chrome without user profile. Every published detail and home/catalog/region-directory imagery in EN/JA at1440/390/320. Raw registry oracles check actual source, intrinsic size, localized alt, exact AI label and retained full-frame aspect ratio. All new-image detail frames are captured at desktop/mobile for visual review; country/style are generation-plan settings, never pixel inferences. Selected templates use every axe rule. No merchant navigation, download of retailer photographs or form submission.',checks:[],failures:[],screenshots:[],pageErrors:[],consoleErrors:[],imageChecks:0,detailChecks:0,axePages:[]};
const browser=await chromium.launch({channel:'chrome',headless:true});
const check=async(name,fn)=>{try{const detail=await fn();report.checks.push({name,status:'passed',detail});console.log('PASS '+name);}catch(error){const message=String(error);report.failures.push({name,message});report.checks.push({name,status:'failed',message});console.error('FAIL '+name+' '+message);}};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const screenshot=async(locator,file)=>{await locator.screenshot({path:resolve(root,file)});report.screenshots.push(file);};
const measure=async(page,width)=>{const dims=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));assert.ok(dims.document<=width+1&&dims.body<=width+1,JSON.stringify(dims));return dims;};
const axe=async(page,label)=>{const result=await new AxeBuilder({page}).analyze();report.axePages.push({label,url:page.url(),violations:result.violations});assert.deepEqual(result.violations,[]);};
try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:width>720?1000:844},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:String(error)}));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()});});
  for(const locale of ['en','ja']){
   for(const [kind,path]of [['home',''],['catalog','objects/'],['region-directory','places/']])await check(locale+' '+width+' '+kind+' styling images',async()=>{
    assert.equal((await page.goto(route(locale,path),{waitUntil:'load'})).status(),200);
    const figures=await assertPageStylingFigures(page,locale,registry);assert.ok(figures.length);report.imageChecks+=figures.length;
    if(kind==='catalog'){
     const cards=page.locator('#object-results [data-product-card]');assert.equal(await cards.count(),published.length);
     for(const product of published){
      const card=page.locator('#object-results [data-product-id="'+product.id+'"]');
      assert.equal(await card.count(),1);assert.equal(await card.locator('[data-official-preview]').count(),0);
      assert.equal(await card.locator('figure[data-editorial-asset]').getAttribute('data-editorial-asset'),registry[product.id].assetId);
     }
    }
    const dimensions=await measure(page,width);await axe(page,locale+' '+width+' '+kind);
    return {figures:figures.length,dimensions};
   });
   for(const product of published)await check(locale+' '+width+' detail '+product.id,async()=>{
    assert.equal((await page.goto(route(locale,'objects/'+product.slug+'/'),{waitUntil:'load'})).status(),200);
    const visual=page.locator('.purchase-visual'),figure=visual.locator('figure[data-editorial-asset]');
    const image=await assertStylingFigure(figure,registry[product.id],locale,page.url());report.imageChecks++;report.detailChecks++;
    assert.equal(await visual.locator('[data-official-preview]').count(),0,'An image-complete product must not fall back to a text placeholder.');
    const official=visual.locator('[data-official-visual-url]');assert.equal(await official.count(),1);assert.equal(await official.getAttribute('target'),'_blank');
    const expected=catalog.links.filter(link=>link.productId===product.id&&link.officialProductUrl).map(link=>new URL(link.officialProductUrl).href);assert.ok(expected.includes(new URL(await official.getAttribute('href'),page.url()).href));
    const dimensions=await measure(page,width);
    if(locale==='en'&&[1440,320].includes(width)&&added.some(item=>item.id===product.id)){
     await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
     await screenshot(visual,'artifacts/'+prefix+'-'+product.id+'-'+width+'.png');
    }
    if(product.id===added[0]?.id||product.id===published.find(item=>item.productType.includes('ring'))?.id)await axe(page,locale+' '+width+' detail '+product.id);
    return {productId:product.id,image,dimensions};
   });
  }
  await context.close();
 }
 await check('Image display verification has no client exceptions or console errors',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);});
 await check('Image and layout inputs remain unchanged throughout browser verification',async()=>{report.sourceInputs.completed=await hashes();assert.deepEqual(report.sourceInputs.completed,sourceInputs);});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,publishedProducts:published.length,newlyIllustratedProducts:added.length,productDetailChecks:report.detailChecks,imageChecks:report.imageChecks,axeScreens:report.axePages.length,axeViolations:report.axePages.reduce((n,page)=>n+page.violations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
