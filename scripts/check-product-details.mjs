import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4322').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'/japanese-craft-jewelry/').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const screenshotPrefix=(process.env.CHECK_SCREENSHOT_PREFIX||'discovery-stage-final').replace(/[^a-zA-Z0-9_-]/g,'-');
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const ja=JSON.parse(await readFile(resolve(root,'src/data/translations/ja.json'),'utf8'));
const ids=['rinzen-seika-amber-pierced-earrings','six-kiln-half-moon-earrings','hamamatsuya-pendant',...catalog.products.filter(product=>product.publishStatus==='published'&&product.productType.includes('bracelet')&&product.weightPerPieceGrams===null).map(product=>product.id)];
const report={checkedAt:new Date().toISOString(),method:'Focused final-build follow-up after restoring factual material/finish notes and distinguishing unknown per-ear weight from an unknown necklace weight. Fresh headless Chrome, no retailer navigation, no application or form submission. Complements the full browser pass and isolated advertisement builds; does not relabel their earlier build as this build.',origin,base,checks:[],screenshots:[],pageErrors:[],consoleErrors:[],failures:[]};
await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const viewport of [{width:390,height:844},{width:320,height:740}]){
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.pageErrors.push({url:page.url(),message:e.message}));
  page.on('console',e=>{if(e.type()==='error')report.consoleErrors.push({url:page.url(),message:e.text()})});
  for(const locale of ['en','ja'])for(const id of ids){
   const name=viewport.width+' '+locale+' '+id;
   try{
    const product=catalog.products.find(p=>p.id===id),localized=locale==='ja'?ja.products[id]:product;
    const path=locale+'/objects/'+product.slug+'/';
    const url=report.origin+report.base+path;
    const response=await page.goto(url,{waitUntil:'load'});
    assert.equal(response.status(),200);
    assert.equal(await page.locator('html').getAttribute('lang'),locale);
    const details=page.locator('details[data-product-details]');
    const primary=page.locator('[data-product-primary-cta] a[data-sponsored],a[data-product-primary-cta][data-sponsored]').first();
    const price=page.locator('[data-product-price]').first();
    assert.equal(await details.evaluate(n=>n.open),false);
    assert.equal(await primary.isVisible(),true);
    assert.equal(await price.isVisible(),true);
    for(const locator of [primary,price])assert.equal(await locator.evaluate(n=>!!(n.compareDocumentPosition(document.querySelector('details[data-product-details]'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
    const destination=catalog.links.find(l=>l.productId===id&&(!l.locale||l.locale===locale)).officialProductUrl;
    assert.equal(await primary.getAttribute('href'),destination);
    for(const link of await page.locator('a[data-sponsored]').all()){
     assert.equal(await link.getAttribute('data-sponsored'),'false');
     assert.equal((await link.getAttribute('rel')).split(/\s+/).includes('sponsored'),false);
    }
    const dimensions=()=>page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    const closed=await dimensions();assert.ok(closed.document<=viewport.width+1&&closed.body<=viewport.width+1);
    const sticky=page.locator('[data-product-sticky-cta]');
    await page.evaluate(()=>window.scrollTo(0,0));
    if(await sticky.count())await sticky.waitFor({state:'hidden'});
    await details.locator('summary').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('details[data-product-details]').open);
    const weightRow=details.locator('dt').filter({hasText:locale==='ja'?/^重さ$/:/^Weight$/}).locator('..');
    const ear=product.productType.some(type=>['pierced-earrings','clip-on-earrings'].includes(type));
    let weight=null;
    if(!ear&&product.weightPerPieceGrams===null)assert.equal(await weightRow.count(),0,'Unnormalized total weight belongs in the source notes, not an unknown per-ear row.');
    else{weight=await weightRow.locator('dd').innerText();assert.equal(weight,locale==='ja'?'片耳の重さは未確認':'Per-ear weight not confirmed')}
    const text=(await details.innerText()).replace(/\s+/g,' ');
    for(const note of localized.whatToCheck)assert.ok(text.includes(note.replace(/\s+/g,' ')),note);
    assert.doesNotMatch(text,/送料|発送|返品|配送|shipping|returns|refunds/i);
    const opened=await dimensions();assert.ok(opened.document<=viewport.width+1&&opened.body<=viewport.width+1);
    if(await sticky.count()){
     await sticky.waitFor({state:'visible'});
     assert.equal(await sticky.locator('a').getAttribute('href'),destination);
     await page.locator('.site-footer').scrollIntoViewIfNeeded();await sticky.waitFor({state:'hidden'});
    }
    if(locale==='ja'&&viewport.width===390){
     for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(n=>n.decode());}
     await details.scrollIntoViewIfNeeded();
     await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();scrollTo(0,0)});
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     const file='artifacts/'+screenshotPrefix+'-'+id+'-ja-mobile-details.png';
     await page.screenshot({path:resolve(root,file),fullPage:true});report.screenshots.push(file);
    }
    await details.locator('summary').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>!document.querySelector('details[data-product-details]').open);
    report.checks.push({name,status:'passed',url,weight,retainedNotes:localized.whatToCheck,priceAndPrimaryBeforeDetails:true,normalDestination:destination,keyboardDetails:true,stickyFallback:true,closed,opened});
    console.log('PASS '+name);
   }catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}
  }
  await context.close();
 }
 assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);
}catch(error){report.failures.push({name:'runtime',message:error.stack||String(error)})}
finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;
 report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(resolve(root,process.env.CHECK_DETAIL_REPORT_PATH||'docs/discovery-stage-final-detail-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
