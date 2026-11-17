import {chromium} from '@playwright/test';
import {assertVisitGuide} from './visit-assertions.mjs';
import {assertRegionSelection} from './region-selection-assertions.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const origin=new URL(process.env.CHECK_BASE_URL||'https://rozawa619.github.io').origin;
const baseParts=(process.env.PUBLIC_BASE_PATH||'/japanese-craft-jewelry/').split('/').filter(Boolean);
const base='/'+baseParts.join('/')+(baseParts.length?'/':'');
const report={checkedAt:new Date().toISOString(),origin,base,method:'Read-only verification of the deployed site with fresh Chrome and HTTP requests. Canonical sitemap routes, inline executable CSP hashes, current local-vs-published image hashes, deferred Contact, operator, material links and final factual details. No retailer navigation, form entry, application or registration.',checks:[],failures:[],pages:[],assets:[],consoleErrors:[],pageErrors:[]};
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const translations=JSON.parse(await readFile(resolve(root,'src/data/translations/ja.json'),'utf8'));
const visits=JSON.parse(await readFile(resolve(root,'src/data/visits.json'),'utf8'));
const registry=JSON.parse(await readFile(resolve(root,'src/data/editorial-images.json'),'utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
page.on('pageerror',e=>report.pageErrors.push({url:page.url(),message:e.message}));
page.on('console',e=>{if(e.type()==='error')report.consoleErrors.push({url:page.url(),message:e.text()})});
const url=(locale,path='')=>origin+base+locale+'/'+path;
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}};
const attrs=text=>Object.fromEntries([...text.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]??'']));
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
try{
 await check('All canonical sitemap URLs return current indexed content with executable CSP hashes',async()=>{
  const response=await page.request.get(origin+base+'sitemap.xml');assert.equal(response.status(),200);
  const xml=await response.text(),locations=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.ok(locations.length>0);assert.equal(new Set(locations).size,locations.length);
  const expectedSitemap=await readFile(resolve(root,'dist/sitemap.xml'),'utf8');
  const expectedLocations=[...expectedSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.deepEqual([...locations].sort(),expectedLocations.sort(),'Deployed sitemap must match the final local public build.');
  assert.equal(locations.some(location=>/\/(?:en|ja)\/(?:contact|journal)\//.test(location)),false);
  for(let offset=0;offset<locations.length;offset+=6){
   const settled=await Promise.allSettled(locations.slice(offset,offset+6).map(async location=>{
    assert.ok(location.startsWith(origin+base));
    const response=await page.request.get(location);assert.equal(response.status(),200,location);
    const html=await response.text();
    const metas=[...html.matchAll(/<meta\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(m=>attrs(m[1]));
    const robots=metas.find(m=>m.name==='robots')?.content;assert.equal(robots,'index, follow');
    assert.ok(html.includes('rel="canonical" href="'+location+'"'));
    assert.equal(/"@type"\s*:\s*"Article"/.test(html),false);
    assert.equal(/data-sponsored="true"/.test(html),false);
    assert.equal(/href="[^"#]*\/(?:en|ja)\/contact\//.test(html),false);
    const links=[...html.matchAll(/<link\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(m=>attrs(m[1]));
    const english=location.replace('/ja/','/en/');assert.ok(links.some(link=>link.hreflang==='x-default'&&link.href===english),'Missing matching English x-default');
    const locale=location.includes('/ja/')?'ja':'en';
    for(const caption of [...html.matchAll(/<figure\b[^>]*data-editorial-asset[^>]*>([\s\S]*?)<\/figure>/gi)].map(match=>match[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1].replace(/<[^>]+>/g,'').trim()))assert.equal(caption,locale==='ja'?'AIイメージ':'AI image');
    const csp=metas.find(m=>m['http-equiv']?.toLowerCase()==='content-security-policy')?.content||'';
    for(const directive of ["default-src 'self'","object-src 'none'","base-uri 'none'","form-action 'none'","frame-src 'none'","connect-src 'none'"])assert.ok(csp.includes(directive),location+' '+directive);
    assert.equal(/script-src[^;]*(?:unsafe-inline|unsafe-eval)/.test(csp),false);
    let scriptHashes=0,jsonBlocks=0;
    for(const script of html.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi)){
     const attributes=attrs(script[1]);
     if(['application/ld+json','application/json'].includes(attributes.type)){JSON.parse(script[2]);jsonBlocks++;continue}
     if(attributes.src)assert.equal(new URL(attributes.src,location).origin,origin);
     else if(script[2].trim()){assert.ok(csp.includes("'sha256-"+createHash('sha256').update(script[2]).digest('base64')+"'"),location+' inline JS hash');scriptHashes++;}
    }
    return {url:location,status:response.status(),robots,scriptHashes,jsonBlocks};
   }));
   for(const result of settled){assert.equal(result.status,'fulfilled',result.reason?.stack||String(result.reason));report.pages.push(result.value)}
  }
  return {canonicalUrls:locations.length,executableScriptHashes:report.pages.reduce((sum,p)=>sum+p.scriptHashes,0),validJsonBlocks:report.pages.reduce((sum,p)=>sum+p.jsonBlocks,0)};
 });
 await check('All registered AI image files return 200 and match the final local assets',async()=>{
  for(const path of new Set(Object.values(registry).map(asset=>asset.path))){
   const response=await page.request.get(origin+base+path);assert.equal(response.status(),200);
   assert.match(response.headers()['content-type'],/image\/webp/);
   const deployed=digest(await response.body()),local=digest(await readFile(resolve(root,'public',path)));assert.equal(deployed,local,path);
   report.assets.push({path,status:response.status(),sha256:deployed,localMatch:true});
  }
  return {uniqueImageFiles:report.assets.length,styledProducts:Object.keys(registry).length};
 });
 for(const locale of ['en','ja']){
  await check(locale+' deferred Contact returns 404 and remains outside sitemap/navigation',async()=>{
   const response=await page.request.get(url(locale,'contact/'));assert.equal(response.status(),404);
   await page.goto(url(locale));assert.equal(await page.locator('a[href$="/en/contact/"],a[href$="/ja/contact/"]').count(),0);
  });
  await check(locale+' SORA, material routes and plain selection policy are published',async()=>{
   await page.goto(url(locale,'about/'));const about=await page.locator('main').innerText();assert.match(about,/SORA/);assert.doesNotMatch(about,/rozawa619/);
   await page.goto(url(locale));
   for(const material of ['wood','glass','porcelain'])assert.ok(await page.locator('a[href*="material='+material+'"]').count()>0,material);
   await assertRegionSelection(page,locale,catalog,registry);
   await page.goto(url(locale,'editorial-policy/'));const text=await page.locator('main').innerText();
   assert.doesNotMatch(text,/SDD|programId|approved|affiliateUrl|GitHub Issues|販売・決済・発送|The retailer handles/i);
   return {operator:'SORA',materialLinks:['wood','glass','porcelain'],policyCharacters:text.length,policyText:text};
  });
  for(const id of ['rinzen-seika-amber-pierced-earrings','six-kiln-half-moon-earrings','hamamatsuya-pendant',...catalog.products.filter(product=>product.publishStatus==='published'&&product.productType.includes('bracelet')&&product.weightPerPieceGrams===null).map(product=>product.id)])await check(locale+' final facts '+id,async()=>{
   const product=catalog.products.find(product=>product.id===id),localized=locale==='ja'?translations.products[id]:product;
   const response=await page.goto(url(locale,'objects/'+product.slug+'/'));assert.equal(response.status(),200);
   const visitFlow=await assertVisitGuide(page,product,locale,catalog,visits);
   const details=page.locator('[data-product-details]');assert.equal(await details.evaluate(n=>n.open),false);
   await details.locator('summary').click();
   const text=(await details.innerText()).replace(/\s+/g,' ');
   for(const note of localized.whatToCheck)assert.ok(text.includes(note.replace(/\s+/g,' ')),note);
   assert.doesNotMatch(text,/送料|発送|返品|配送|shipping|returns|refunds/i);
   const weightRow=details.locator('dt').filter({hasText:locale==='ja'?/^重さ$/:/^Weight$/}).locator('..');
   const ear=product.productType.some(type=>['pierced-earrings','clip-on-earrings'].includes(type));
   let weight=null;
   if(!ear&&product.weightPerPieceGrams===null)assert.equal(await weightRow.count(),0,'Non-earring unnormalized weight should stay in the source notes.');
   else{weight=await weightRow.locator('dd').innerText();assert.equal(weight,locale==='ja'?'片耳の重さは未確認':'Per-ear weight not confirmed')}
   assert.equal(await page.locator('summary').filter({hasText:/shipping|returns|配送|返品|送料/i}).count(),0);
   return {weight,materialNotes:localized.whatToCheck,visitFlow};
  });
 }
 for(const browserLocale of ['ja-JP','fr-FR'])await check('Hosted language entry '+browserLocale+' keeps both choices visible',async()=>{
  const context=await browser.newContext({locale:browserLocale,viewport:{width:320,height:740}});const entryPage=await context.newPage();
  entryPage.on('pageerror',error=>report.pageErrors.push({url:entryPage.url(),message:error.message}));entryPage.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:entryPage.url(),message:message.text()})});
  try{const response=await entryPage.goto(origin+base+'?entry=hosted#selection',{waitUntil:'load'});assert.equal(response.status(),200);assert.equal(new URL(entryPage.url()).pathname,base);assert.equal(await entryPage.locator('meta[http-equiv="refresh"]').count(),0);assert.equal(await entryPage.locator('[data-entry-language]').count(),2);const preferred=browserLocale.startsWith('ja')?'ja':'en';assert.equal(await entryPage.locator('[data-entry-language]').first().getAttribute('data-entry-language'),preferred);for(const locale of ['en','ja']){const link=entryPage.locator('[data-entry-language="'+locale+'"]');assert.equal(await link.isVisible(),true);const destination=new URL(await link.getAttribute('href'),entryPage.url());assert.equal(destination.pathname,base+locale+'/');assert.equal(destination.search,'?entry=hosted');assert.equal(destination.hash,'#selection')}const dimensions=await entryPage.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth}));assert.ok(dimensions.document<=321);return {preferred,bothLinks:true,noForcedRedirect:true,dimensions}}finally{await context.close()}
 });
 await check('Hosted language entry keeps Japanese accessible without JavaScript',async()=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const entryPage=await context.newPage();try{await entryPage.goto(origin+base);for(const locale of ['en','ja'])assert.equal(await entryPage.locator('[data-entry-language="'+locale+'"]').isVisible(),true);await entryPage.locator('[data-entry-language="ja"]').click();assert.equal(await entryPage.locator('html').getAttribute('lang'),'ja');return {bothLinks:true,japaneseAccessible:true}}finally{await context.close()}
 });
 await check('No hosted CSP/client/console errors during supplemental navigation',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[])});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,canonicalUrls:report.pages.length,uniqueImages:report.assets.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length};
 await writeFile(resolve(root,process.env.CHECK_HOSTED_REPORT_PATH||'docs/editorial-stage-hosted-supplement-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
