import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {assertStylingFigure} from './image-display-assertions.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/visual-seo-stage-browser-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'visual-seo-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const readJson=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
const sourcePaths=['src/data/catalog.json','src/data/translations/ja.json','src/data/product-stories.json','src/data/selection-notes.json','src/data/region-choice-notes.json','src/data/editorial-images.json','src/data/purchase-evidence.json','src/config/selection.ts'];
const hashInputs=async()=>Object.fromEntries(await Promise.all(sourcePaths.map(async path=>[path,createHash('sha256').update(await readFile(resolve(root,path))).digest('hex')])));
const sourceInputs=await hashInputs();
const catalog=await readJson('src/data/catalog.json');
const ja=await readJson('src/data/translations/ja.json');
const notes=await readJson('src/data/selection-notes.json');
const stories=await readJson('src/data/product-stories.json');
const regionNotes=await readJson('src/data/region-choice-notes.json');
const registry=await readJson('src/data/editorial-images.json');
const purchaseEvidence=await readJson('src/data/purchase-evidence.json');
const probe=process.env.CHECK_QUALITY_PROBE==='1';
const selectionConfig=await readFile(resolve(root,'src/config/selection.ts'),'utf8');
const configuredIds=[...(selectionConfig.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/['"]([a-z0-9-]+)['"]/g)].map(match=>match[1]);
assert.ok(configuredIds.length,'The independent oracle requires the actual editorial ID configuration.');
const published=catalog.products.filter(product=>product.publishStatus==='published');
const withdrawn=catalog.products.filter(product=>product.publishStatus!=='published');
const unknownSample=published.find(product=>!japanPrice(product));
const probeSamples=[published.find(p=>p.id==='rinzen-seika-amber-pierced-earrings')||published[0],unknownSample||published.find(p=>!registry[p.id]),published.find(p=>p.id==='hamamatsuya-18k-pierced')].filter(Boolean);
const detailProducts=probe?[...new Map(probeSamples.map(product=>[product.id,product])).values()]:published;
const byId=new Map(published.map(product=>[product.id,product]));
const norm=text=>text.replace(/\s+/g,' ').trim();
const route=(locale,path='')=>origin+base+locale+'/'+path;
const localeValue=(product,field,locale)=>locale==='ja'&&Object.hasOwn(ja.products[product.id]||{},field)?ja.products[product.id][field]:product[field];
const labels=(group,ids,locale)=>ids.map(id=>(locale==='ja'?ja[group]?.[id]?.name:null)||catalog[group].find(item=>item.id===id)?.name).filter(Boolean).join(locale==='ja'?'、':', ');

// Expectations come directly from research data and editorial IDs, not the UI helpers.
function japanPrice(product){
 const local=product.localizedPrices?.ja;
 if(local?.currency==='JPY'&&Number.isFinite(local.amount)&&local.amount>=0)return {amount:local.amount,date:local.checkedAt};
 return product.priceCurrency==='JPY'&&Number.isFinite(product.priceAmount)&&product.priceAmount>=0?{amount:product.priceAmount,date:product.priceCheckedAt}:null;
}
function budgetId(product){
 const price=japanPrice(product);if(!price)return 'unconfirmed';
 for(const [ceiling,id]of [[5000,'up-to-5000'],[10000,'5000-10000'],[20000,'10000-20000'],[40000,'20000-40000']])if(price.amount<=ceiling)return id;
 return 'over-40000';
}
const budgets=['up-to-5000','5000-10000','10000-20000','20000-40000','over-40000','unconfirmed'];
const rawOrder=new Map(published.map((product,index)=>[product.id,index]));
const ranks=new Map(configuredIds.map((id,index)=>[id,index]));
const editorial=[...published].sort((a,b)=>Number(a.availability==='out_of_stock')-Number(b.availability==='out_of_stock')||(ranks.get(a.id)??9999)-(ranks.get(b.id)??9999)||rawOrder.get(a.id)-rawOrder.get(b.id));
const editorialIndex=new Map(editorial.map((product,index)=>[product.id,index]));
function expected(filters={},sort=''){
 const values=editorial.filter(product=>(!filters.type||product.productType.includes(filters.type))&&(!filters.prefecture||product.prefectureIds.includes(filters.prefecture))&&(!filters.material||product.materialIds.includes(filters.material))&&(!filters.craft||product.craftIds.includes(filters.craft))&&(!filters.budget||budgetId(product)===filters.budget));
 if(sort)values.sort((a,b)=>{
  const x=japanPrice(a),y=japanPrice(b);if(!x||!y)return x?-1:y?1:editorialIndex.get(a.id)-editorialIndex.get(b.id);
  return (sort==='price-desc'?y.amount-x.amount:x.amount-y.amount)||editorialIndex.get(a.id)-editorialIndex.get(b.id);
 });
 return values.map(product=>product.id);
}
const fields=['type','prefecture','material','craft','budget'];
const report={checkedAt:new Date().toISOString(),origin,base,scope:probe?'initial390px probe;source-selected current product samples and Tokyo/Chiba where published':'complete catalog and regions at all3 widths',method:'Read-only fresh Chrome verification of the actual published catalog. Raw source-data oracles verify all6 Japan-budget partitions, ascending/descending order with unknowns last where published and editorial ties, combined/empty/reset/back/invalid-query/language states, source-based product choice comparisons and actual-official visual links, neutral previews for unillustrated products, regional choices and current legal/privacy notices. Full mode uses EN/JA1440/390/320px and every published product and region; probe mode is explicitly a limited390px initial check. No unknown-price public product is invented: a zero-size unknown partition must show the true empty state, while unknown ordering remains covered separately by isolated unit fixtures. All enabled axe rules on selected templates; no retailer checkout, application, external link navigation, personal data or approval assumption.',checks:[],failures:[],axePages:[],screenshots:[],pageErrors:[],consoleErrors:[],externalRequests:[],detailChecks:0};
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',...(detail===undefined?{}:{detail})});console.log('PASS '+name)}catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+': '+message)}};
report.sourceInputs=sourceInputs;
async function noOverflow(page,width){const value=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));assert.ok(value.document<=width+1&&value.body<=width+1,JSON.stringify(value));return value}
async function axe(page,name){const result=await new AxeBuilder({page}).analyze();const violations=result.violations.map(v=>({id:v.id,impact:v.impact,tags:v.tags,nodes:v.nodes.map(node=>({target:node.target,html:node.html,reason:node.failureSummary}))}));report.axePages.push({name,url:page.url(),violations});assert.deepEqual(violations.map(v=>v.id),[])}
async function shot(page,name){
 for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode())}
 await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();scrollTo(0,0)});
 const path='artifacts/'+prefix+'-'+name+'.png';await page.screenshot({path:resolve(root,path),fullPage:true});report.screenshots.push(path);
 for(const [selector,suffix]of [['[data-choice-details]','comparison'],['[data-regional-choice]','regional-guide']])if(await page.locator(selector).count()===1){const focused='artifacts/'+prefix+'-'+name+'-'+suffix+'.png';await page.locator(selector).screenshot({path:resolve(root,focused)});report.screenshots.push(focused)}
}
async function money(scope,product,locale){
 const price=scope.locator('[data-price-market="japan"]');assert.equal(await price.count(),1);
 const value=japanPrice(product),text=norm(await price.innerText());
 if(value){assert.equal(text,norm(new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(value.amount)));assert.equal(await price.getAttribute('data-price-checked-at'),value.date);assert.equal(Number(await price.getAttribute('data-price-amount')),value.amount)}
 else assert.doesNotMatch(text,/[0-9]|JPY|USD/,'An unknown Japan price must not become zero or a converted foreign price.');
 const unit=scope.locator('[data-price-unit]');
 if(value&&product.priceUnit){const text={en:{'single-ear':'Single earring · one ear',pair:'Pair price','one-item':'One-item price'},ja:{'single-ear':'片耳用・1点の価格',pair:'1組の価格','one-item':'1点の価格'}}[locale][product.priceUnit];assert.equal(await unit.count(),1);assert.equal(await unit.getAttribute('data-price-unit'),product.priceUnit);assert.equal(norm(await unit.innerText()),text)}
 else assert.equal(await unit.count(),0,'A missing sale unit must not be invented, including for unknown prices.');
}
async function state(page,filters,sort,locale){
 const ids=expected(filters,sort);
 await page.waitForFunction(wanted=>{const actual=Array.from(document.querySelectorAll('#object-results [data-product-card]:not([hidden])')).map(node=>node.dataset.productId);return JSON.stringify(actual)===JSON.stringify(wanted)},ids,{timeout:7000});
 assert.deepEqual(await page.locator('#object-results [data-product-card]:not([hidden])').evaluateAll(nodes=>nodes.map(node=>node.dataset.productId)),ids);
 assert.equal(await page.locator('#empty-state').isVisible(),ids.length===0);
 assert.equal(norm(await page.locator('#result-count').innerText()),locale==='ja'?ids.length+'点':ids.length+' piece'+(ids.length===1?'':'s'));
 return ids;
}
async function set(page,filters={},sort=''){
 for(const field of fields)await page.locator('select[name="'+field+'"]').selectOption(filters[field]||'');
 await page.locator('#price-sort').selectOption(sort);
}
async function choice(page,product,locale){
 const story=stories[product.id]?.[locale];assert.ok(story?.decision,'Every published product needs its own localized decision.');
 assert.equal(norm(await page.locator('[data-product-intro] h1').innerText()),norm(story.headline));
 assert.equal(norm(await page.locator('.purchase-standfirst').innerText()),norm(story.standfirst));
 const decision=page.locator('[data-product-decision]');assert.equal(await decision.count(),1);assert.equal(await decision.isVisible(),true);
 assert.equal(norm(await decision.locator('[data-decision-best-for]').innerText()),norm(story.decision.bestFor));
 assert.equal(norm(await decision.locator('[data-decision-consider]').innerText()),norm(story.decision.consider));
 assert.ok(await decision.evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('[data-choice-details]'))&Node.DOCUMENT_POSITION_FOLLOWING)),'Product-specific decision must precede the longer comparison.');
 assert.equal(new URL(await decision.locator('a[href*="/editorial-policy/"]').getAttribute('href'),page.url()).href,route(locale,'editorial-policy/'));
 await money(page.locator('[data-market-section="japan"]'),product,locale);
 const evidence=purchaseEvidence.products.find(record=>record.productId===product.id);assert.ok(evidence,'A published item requires the real current purchase-evidence record.');
 const purchase=page.locator('[data-purchase-evidence]');assert.equal(await purchase.count(),1);assert.equal(await purchase.getAttribute('data-purchase-evidence'),evidence.kind);assert.equal(await purchase.getAttribute('data-purchase-checked-at'),evidence.checkedAt);
 assert.equal(await purchase.locator('time').getAttribute('datetime'),evidence.checkedAt);assert.equal(norm(await purchase.locator('time').innerText()),evidence.checkedAt);
 const purchaseLabel={en:{'online-order':'Official online ordering checked','retail-and-catalog':'Retail shop and current catalog checked'},ja:{'online-order':'公式通販の注文受付を確認','retail-and-catalog':'実店舗と現行カタログを確認'}}[locale][evidence.kind];assert.equal(norm(await purchase.locator('span').innerText()),purchaseLabel);
 const note=notes[product.id];assert.ok(note,'A real published choice note is needed for '+product.id);
 const section=page.locator('[data-choice-details]');assert.equal(await section.count(),1);assert.equal(await section.isVisible(),true);
 assert.equal(norm(await section.locator('[data-choice-difference]').innerText()),norm(note[locale].difference));
 assert.ok(norm(await section.innerText()).includes(norm(note[locale].chooseFor)));
 const ids=[product.id,...note.compareWith];assert.equal(new Set(ids).size,ids.length);assert.ok(ids.length>=3&&ids.length<=4);
 assert.deepEqual(await section.locator('[data-choice-product]').evaluateAll(nodes=>nodes.map(node=>node.dataset.choiceProduct)),ids);
 assert.deepEqual(await section.locator('[data-choice-current]').evaluateAll(nodes=>nodes.map(node=>node.dataset.choiceProduct)),[product.id]);
 for(const id of ids){
  const p=byId.get(id);assert.ok(p,'Choice comparisons must not expose draft/missing products.');
  const card=section.locator('[data-choice-product="'+id+'"]');
  assert.equal(norm(await card.locator('[data-choice-hook]').innerText()),norm(stories[id][locale].headline));
  assert.equal(norm(await card.locator('[data-choice-reason]').innerText()),norm(notes[id][locale].chooseFor));
  assert.ok(norm(await card.locator('h4').innerText()).includes(norm(localeValue(p,'title',locale))));
  if(id!==product.id)assert.equal(new URL(await card.locator('h4 a').getAttribute('href'),page.url()).href,route(locale,'objects/'+p.slug+'/'));
  const info=await card.locator('dl>div').evaluateAll(nodes=>Object.fromEntries(nodes.map(node=>[node.querySelector('dt').textContent,node.querySelector('dd').textContent])));
  assert.equal(norm(info[locale==='ja'?'種類':'Type']),labels('productTypes',p.productType,locale));
  assert.equal(norm(info[locale==='ja'?'素材':'Materials']),labels('materials',p.materialIds,locale)||(locale==='ja'?'未確認':'Not confirmed'));
  assert.equal(norm(info[locale==='ja'?'サイズ':'Size']),norm(localeValue(p,'size',locale)||(locale==='ja'?'公式情報に記載なし':'Not listed in the official information')));
  await money(card,p,locale);
 }
 const visual=page.locator('.purchase-visual'),actual=visual.locator('a[data-official-visual-url]');assert.equal(await actual.count(),1);
 const urls=catalog.links.filter(link=>link.productId===product.id&&(link.locale==='ja'||(!link.locale&&(!product.priceCurrency||product.priceCurrency==='JPY')))&&link.officialProductUrl).map(link=>new URL(link.officialProductUrl).href);
 assert.ok(urls.includes(new URL(await actual.getAttribute('href'),page.url()).href),'The actual-design reference must be the raw Japan official URL, with no approval borrowed from another market.');
 const rel=(await actual.getAttribute('rel')||'').split(/\s+/);assert.ok(rel.includes('noopener')&&rel.includes('noreferrer')&&!rel.includes('sponsored'));
 assert.equal(await actual.getAttribute('target'),'_blank');
 if(registry[product.id]){
  await assertStylingFigure(visual.locator('figure[data-editorial-asset]'),registry[product.id],locale,page.url());
  const image=visual.locator('figure[data-editorial-asset] img');assert.equal(await image.count(),1);
  assert.equal(new URL(await image.getAttribute('src'),page.url()).pathname,base+registry[product.id].path);
  assert.equal(norm(await visual.locator('figcaption').innerText()),locale==='ja'?'AIイメージ':'AI image');
  await image.evaluate(node=>node.decode());
 }else{
  assert.equal(await visual.locator('[data-official-preview]').count(),1,'No unlicensed or invented product photograph should replace a missing registered image.');
  assert.equal(await visual.locator('img').count(),0);assert.match(await visual.innerText(),locale==='ja'?/公式/:/official/i);
 }
 report.detailChecks++;return {productId:product.id,comparisonIds:ids,visual:registry[product.id]?'registered-ai':'official-text-preview',purchaseEvidence:{kind:evidence.kind,checkedAt:evidence.checkedAt,linkId:evidence.linkId,storeIds:evidence.storeIds}};
}
async function htmlFiles(directory){const paths=[];for(const entry of await readdir(directory,{withFileTypes:true})){const path=resolve(directory,entry.name);if(entry.isDirectory())paths.push(...await htmlFiles(path));else if(entry.isFile()&&entry.name.endsWith('.html'))paths.push(path)}return paths}
await mkdir(resolve(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 await check('Withdrawn jewelry has no route, public card, comparison, regional link or sitemap entry',async()=>{
  assert.equal(purchaseEvidence.products.length,published.length,'Purchase evidence must cover the exact published set, without padding it with withdrawn items.');
  assert.deepEqual([...new Set(purchaseEvidence.products.map(record=>record.productId))].sort(),published.map(product=>product.id).sort());
  const files=await htmlFiles(resolve(root,'dist'));const html=await Promise.all(files.map(path=>readFile(path,'utf8')));const request=await browser.newContext();const routeStatuses=[];
  try{
   const sitemapResponse=await request.request.get(new URL(base+'sitemap.xml',origin).href);assert.equal(sitemapResponse.status(),200);const sitemap=await sitemapResponse.text();
   for(const product of withdrawn){
    for(const locale of ['en','ja']){
     const url=route(locale,'objects/'+product.slug+'/'),pathname=new URL(url).pathname;const response=await request.request.get(url);assert.equal(response.status(),404,'A withdrawn detail must not retain a live public page: '+pathname);assert.ok(!sitemap.includes(pathname),'Withdrawn route remains in sitemap: '+pathname);routeStatuses.push({productId:product.id,locale,status:response.status()});
     for(let index=0;index<html.length;index++)assert.ok(!html[index].includes(pathname),'Withdrawn product route is still linked in '+files[index]+': '+pathname);
    }
    for(let index=0;index<html.length;index++)for(const attribute of ['data-product-id','data-choice-product'])assert.ok(!html[index].includes(attribute+'="'+product.id+'"'),'Withdrawn product is still exposed by '+attribute+' in '+files[index]);
   }
  }finally{await request.close()}
  report.withdrawnVerification={products:withdrawn.map(product=>product.id),htmlFiles:files.length,routeStatuses};return report.withdrawnVerification;
 });
 for(const viewport of (probe?[{name:'mobile',width:390,height:844}]:[{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'narrow',width:320,height:740}])){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});const page=await context.newPage();
  page.on('pageerror',error=>report.pageErrors.push({url:page.url(),message:error.message}));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push({url:page.url(),message:message.text()})});
  page.on('request',request=>{if(new URL(request.url()).origin!==origin&&!request.url().startsWith('data:'))report.externalRequests.push({page:page.url(),url:request.url(),type:request.resourceType()})});
  for(const locale of ['en','ja']){
   const label=viewport.name+' '+locale;
   await check(label+' complete catalog and source-based Japan budget metadata',async()=>{
    assert.equal((await page.goto(route(locale,'objects/#all-jewelry'),{waitUntil:'load'})).status(),200);
    assert.equal(await page.locator('#object-results [data-product-card]').count(),published.length);
    assert.deepEqual(await page.locator('select[name="budget"] option').evaluateAll(nodes=>nodes.map(node=>node.value)),['',...budgets]);
    await state(page,{},'',locale);
    for(const product of published){const card=page.locator('#object-results [data-product-id="'+product.id+'"]');assert.equal(await card.getAttribute('data-budget'),budgetId(product));assert.equal(await card.getAttribute('data-japan-price'),japanPrice(product)?String(japanPrice(product).amount):null);assert.equal(norm(await card.locator('.card-summary').innerText()),norm(localeValue(product,'editorialSummary',locale)));await money(card,product,locale)}
    await noOverflow(page,viewport.width);await axe(page,label+' list controls');const controls='artifacts/'+prefix+'-'+locale+'-'+viewport.name+'-budget-controls.png';await page.locator('#object-filters').screenshot({path:resolve(root,controls)});report.screenshots.push(controls);return {products:published.length,budgetPartition:Object.fromEntries(budgets.map(id=>[id,expected({budget:id}).length]))};
   });
   for(const budget of budgets)await check(label+' budget '+budget,async()=>{await set(page,{budget});const ids=await state(page,{budget},'',locale);assert.equal(new URL(page.url()).searchParams.get('budget'),budget);assert.equal(new URL(page.url()).hash,'#all-jewelry');return {budget,ids}});
   for(const sort of ['price-asc','price-desc',''])await check(label+' order '+(sort||'editorial'),async()=>{await set(page,{},sort);const ids=await state(page,{},sort,locale);const unknown=ids.filter(id=>!japanPrice(byId.get(id)));if(sort&&unknown.length)assert.deepEqual(ids.slice(-unknown.length),unknown);return {sort,ids,unknownLast:sort?unknown:[],equalPriceGroups:[...new Set(published.map(p=>japanPrice(p)?.amount).filter(n=>n!==undefined))].filter(amount=>published.filter(p=>japanPrice(p)?.amount===amount).length>1).length}});
   await check(label+' combined filters, no-match and clear restore editorial selection',async()=>{
    const seed=published.find(p=>p.productType.length&&p.prefectureIds.length&&p.materialIds.length&&p.craftIds.length&&japanPrice(p));assert.ok(seed);
    const filter={type:seed.productType[0],prefecture:seed.prefectureIds[0],material:seed.materialIds[0],craft:seed.craftIds[0],budget:budgetId(seed)};
    await set(page,filter,'price-desc');const combined=await state(page,filter,'price-desc',locale);assert.ok(combined.includes(seed.id));
    let empty;for(const type of [...new Set(published.flatMap(p=>p.productType))]){for(const prefecture of [...new Set(published.flatMap(p=>p.prefectureIds))]){for(const budget of budgets){if(expected({type,prefecture,budget}).length===0){empty={type,prefecture,budget};break}}if(empty)break}if(empty)break}assert.ok(empty);
    await set(page,empty,'price-asc');await state(page,empty,'price-asc',locale);await page.locator('#empty-reset').click();await state(page,{},'',locale);assert.equal(new URL(page.url()).search,'');return {combined,empty,clearRestores:published.length};
   });
   await check(label+' filtered detail back and same-query language roundtrip',async()=>{
    const budget=budgets.find(id=>expected({budget:id}).length>0);const filters={budget};await set(page,filters,'price-asc');const ids=await state(page,filters,'price-asc',locale);
    await page.locator('#object-results [data-product-id="'+ids[0]+'"] h3 a').click();await page.waitForURL(route(locale,'objects/'+byId.get(ids[0]).slug+'/'));await page.goBack({waitUntil:'load'});await state(page,filters,'price-asc',locale);
    assert.equal(await page.locator('select[name="budget"]').inputValue(),budget);assert.equal(await page.locator('#price-sort').inputValue(),'price-asc');
    const peer=locale==='ja'?'en':'ja';await page.locator('a.language-switch').click();await page.waitForURL(url=>url.pathname===new URL(route(peer,'objects/')).pathname);await state(page,filters,'price-asc',peer);assert.equal(new URL(page.url()).hash,'#all-jewelry');assert.equal(new URL(page.url()).searchParams.get('budget'),budget);assert.equal(new URL(page.url()).searchParams.get('sort'),'price-asc');
    await page.locator('a.language-switch').click();await page.waitForURL(url=>url.pathname===new URL(route(locale,'objects/')).pathname);await state(page,filters,'price-asc',locale);return {budget,ids,backRestores:true,bothLanguageRoundtrip:true};
   });
   await check(label+' invalid query values do not create hidden, external or invented states',async()=>{
    await page.goto(route(locale,'objects/?type=%3Cscript%3E&prefecture=not-real&material=not-real&craft=not-real&budget=not-real&sort=not-real#all-jewelry'),{waitUntil:'load'});
    for(const field of [...fields,'sort'])assert.equal(await page.locator('select[name="'+field+'"]').inputValue(),'');await state(page,{},'',locale);await noOverflow(page,viewport.width);
    await page.locator('#object-filters button[type="reset"]').click();assert.equal(new URL(page.url()).search,'');return {ignored:true,allProductsShown:published.length};
   });
   await check(label+' native budget/order controls and reset work from the keyboard',async()=>{
    const budget=page.locator('select[name="budget"]');await budget.focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await budget.inputValue(),budgets[0]);await state(page,{budget:budgets[0]},'',locale);
    await page.locator('#price-sort').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await page.locator('#price-sort').inputValue(),'price-asc');await state(page,{budget:budgets[0]},'price-asc',locale);
    await page.locator('#object-filters button[type="reset"]').focus();await page.keyboard.press('Enter');await state(page,{},'',locale);return {budget:budgets[0],order:'price-asc',keyboardResetRestored:true};
   });
   for(const product of detailProducts)await check(label+' product choice '+product.id,async()=>{
    assert.equal((await page.goto(route(locale,'objects/'+product.slug+'/'),{waitUntil:'load'})).status(),200);const result=await choice(page,product,locale);await noOverflow(page,viewport.width);
    if(product.id==='rinzen-seika-amber-pierced-earrings'){await axe(page,label+' sourced choice details');await shot(page,locale+'-'+viewport.name+'-choice-details')}
    if(product.id===published.find(p=>!registry[p.id])?.id){await axe(page,label+' official-only preview');if(viewport.width===320)await shot(page,locale+'-narrow-official-preview')}
    return result;
   });
   for(const region of catalog.prefectures.filter(region=>(!probe||['tokyo','chiba'].includes(region.id))&&published.some(p=>p.prefectureIds.includes(region.id))))await check(label+' regional type choices '+region.id,async()=>{
    const regionalUrl=route(locale,'places/'+region.id+'/');assert.equal((await page.goto(regionalUrl,{waitUntil:'load'})).status(),200);
    const local=published.filter(p=>p.prefectureIds.includes(region.id)),section=page.locator('[data-regional-choice="'+region.id+'"]');assert.equal(await section.count(),1);
    assert.equal(norm(await section.locator('.regional-choice-intro').innerText()),norm(regionNotes[region.id][locale]));
    const types=[...new Set(local.flatMap(p=>p.productType))];assert.deepEqual((await section.locator('[data-regional-type-choice]').evaluateAll(nodes=>nodes.map(node=>node.dataset.regionalTypeChoice))).sort(),[...types].sort());
    const results=[];
    for(const type of types){
     const link=page.locator('[data-regional-choice="'+region.id+'"] [data-regional-type-choice="'+type+'"]');const products=local.filter(p=>p.productType.includes(type));
     assert.equal(norm(await link.locator('strong span').innerText()),locale==='ja'?products.length+'点':products.length+' piece'+(products.length===1?'':'s'));
     const prices=products.map(japanPrice).filter(Boolean).map(p=>p.amount).sort((a,b)=>a-b),unknown=products.length-prices.length;
     const format=value=>norm(new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(value));
     const priceText=norm(await link.locator('.regional-type-price').innerText());
     const range=prices.length?format(prices[0])+(prices.at(-1)!==prices[0]?' – '+format(prices.at(-1)):''):locale==='ja'?'価格未確認':'Price not confirmed';assert.ok(priceText.includes(range),priceText+' expected '+range);
     assert.equal(await link.locator('small').count(),unknown>0&&prices.length>0?1:0);
     const href=new URL(await link.getAttribute('href'),page.url());assert.equal(href.pathname,new URL(route(locale,'objects/')).pathname);assert.equal(href.searchParams.get('type'),type);assert.equal(href.searchParams.get('prefecture'),region.id);assert.equal(href.hash,'#all-jewelry');
     await link.click();await page.waitForURL(url=>url.pathname===href.pathname&&url.searchParams.get('type')===type&&url.searchParams.get('prefecture')===region.id);const ids=await state(page,{type,prefecture:region.id},'',locale);assert.deepEqual([...ids].sort(),products.map(p=>p.id).sort());await page.goBack({waitUntil:'load'});assert.equal(new URL(page.url()).pathname,new URL(regionalUrl).pathname);
     results.push({type,ids,knownPriceRange:prices.length?[prices[0],prices.at(-1)]:null,unknownPrices:unknown});
    }
    await noOverflow(page,viewport.width);if(region.id==='tokyo'){await axe(page,label+' regional choices');if(viewport.width===390)await shot(page,locale+'-mobile-tokyo-choices')}
    return {region:region.id,localProducts:local.length,typeChoices:results};
   });
   for(const policy of ['editorial-policy/','privacy/','about/','affiliate-disclosure/'])await check(label+' current policy '+policy,async()=>{
    assert.equal((await page.goto(route(locale,policy),{waitUntil:'load'})).status(),200);const text=await page.locator('main').innerText();
    if(policy==='editorial-policy/'){assert.match(text,/AI/);assert.match(text,locale==='ja'?/実物|再現/:/accurate reproductions|actual color|actual.*design/);assert.match(text,locale==='ja'?/着用|試着|体験/:/first.hand|fitting|product use/);await axe(page,label+' selection policy')}
    if(policy==='privacy/'){assert.match(text,/GitHub/);assert.match(text,/IP/);assert.match(text,/Google/);assert.match(text,locale==='ja'?/現在地/:/current location/);await axe(page,label+' privacy')}
    if(policy==='about/')assert.match(text,/SORA/);
    if(policy==='affiliate-disclosure/')assert.equal(await page.locator('[data-site-disclosure="ordinary"]').count(),1);
    assert.equal(await page.locator('a[rel~="sponsored"]').count(),0);assert.equal(await page.locator('script[src*="googlesyndication"],script[src*="google-analytics"],meta[name="google-adsense-account"]').count(),0);await noOverflow(page,viewport.width);return {policy};
   });
  }
  await context.close();
 }
 for(const locale of ['en','ja'])await check(locale+' without JavaScript still exposes the entire edit and explains filter limits',async()=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const page=await context.newPage();try{assert.equal((await page.goto(route(locale,'objects/?budget=unconfirmed#all-jewelry'))).status(),200);assert.equal(await page.locator('#object-results [data-product-card]:not([hidden])').count(),published.length);assert.match(await page.locator('main').innerText(),locale==='ja'?/JavaScript/:/JavaScript/);await noOverflow(page,320);return {allProducts:published.length}}finally{await context.close()}
 });
 await check('No client errors, unexpected third-party requests or current ad tags',()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.externalRequests,[])});
 await check('Research records and editorial inputs stay unchanged throughout this browser run',async()=>{assert.deepEqual(await hashInputs(),sourceInputs);return {sha256:sourceInputs}});
}finally{
 await browser.close();report.completedAt=new Date().toISOString();report.finalizedAt=report.completedAt;
 report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,publishedProducts:published.length,withdrawnProducts:withdrawn.length,withdrawnRoutesVerified:report.withdrawnVerification?.routeStatuses.length||0,withdrawnHtmlFilesScanned:report.withdrawnVerification?.htmlFiles||0,unknownPricePublishedProducts:published.filter(p=>!japanPrice(p)).length,unknownPriceDetailSample:unknownSample?.id||null,productDetailChecks:report.detailChecks,uniqueProductsChecked:new Set(report.checks.filter(c=>c.status==='passed'&&c.detail?.productId).map(c=>c.detail.productId)).size,regionalTypeRoundtrips:report.checks.filter(c=>c.status==='passed'&&c.detail?.typeChoices).reduce((n,c)=>n+c.detail.typeChoices.length,0),axeScreens:report.axePages.length,axeViolations:report.axePages.reduce((n,p)=>n+p.violations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length};
 await writeFile(resolve(root,reportPath),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.failures.length)process.exitCode=1;
}
