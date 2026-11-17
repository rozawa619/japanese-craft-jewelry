/** Read-only responsive photo checks for the shared TOP10 and DISCOVER shelf.
 * Run against a stable build. Uses raw source records as independent expectations;
 * never visits retailers, submits forms or activates an external map. */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

assert.ok(process.env.CHECK_BASE_URL,'Set CHECK_BASE_URL to a stable origin');
assert.notEqual(process.env.PUBLIC_BASE_PATH,undefined,'Set PUBLIC_BASE_PATH');
const input=new URL(process.env.CHECK_BASE_URL);
assert.ok(['http:','https:'].includes(input.protocol)&&input.pathname==='/'&&!input.search&&!input.hash&&!input.username&&!input.password);
const origin=input.origin;
const segments=process.env.PUBLIC_BASE_PATH.split('/').filter(Boolean);
const base='/'+segments.join('/')+(segments.length?'/':'');
const reportPath=process.env.CHECK_REPORT_PATH||'docs/region-photos-stage-results.json';
const prefix=(process.env.CHECK_SCREENSHOT_PREFIX||'region-photos-stage').replace(/[^a-zA-Z0-9_-]/g,'-');
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const digest=value=>createHash('sha256').update(value).digest('hex');
const normalize=value=>value.replace(/\s+/g,' ').trim();
const sourcePaths=[
 'src/components/RegionSelection.astro','src/components/RegionHero.astro',
 'src/config/selection.ts','src/config/region-selection.ts','src/config/japan-map.ts',
 'src/data/catalog.json','src/data/translations/ja.json','src/data/editorial-images.json',
 'src/pages/[lang]/index.astro','src/pages/[lang]/objects/index.astro','src/pages/[lang]/places/index.astro',
];
const sourceHashes=async()=>Object.fromEntries(await Promise.all(sourcePaths.map(async path=>[path,digest(await readFile(path))])));
const [catalog,japanese,images,selectionConfig,regionalConfig,discoveryConfig]=await Promise.all([
 json('src/data/catalog.json'),json('src/data/translations/ja.json'),json('src/data/editorial-images.json'),
 readFile('src/config/selection.ts','utf8'),readFile('src/config/region-selection.ts','utf8'),readFile('src/config/japan-map.ts','utf8'),
]);
const orderedIds=[...(selectionConfig.match(/catalogProductIds\s*:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/['"]([a-z0-9-]+)['"]/g)].map(match=>match[1]);
const editorialOrder=new Map(orderedIds.map((id,index)=>[id,index]));
const products=catalog.products.filter(product=>product.publishStatus==='published').sort((a,b)=>(editorialOrder.get(a.id)??9999)-(editorialOrder.get(b.id)??9999));
const representatives=Object.fromEntries([...(regionalConfig.split('export const regionalRepresentatives')[1]||'').matchAll(/\b([a-z0-9-]+):\s*'([a-z0-9-]+)'/g)].map(match=>[match[1],match[2]]));
const ranked=[...(regionalConfig.match(/destinations:\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/prefectureId:'([a-z0-9-]+)'/g)].map(match=>match[1]);
const additional=[...(discoveryConfig.match(/discoveryPrefectureIds\s*=\s*\[([\s\S]*?)\]/)?.[1]||'').matchAll(/'([a-z0-9-]+)'/g)].map(match=>match[1]);
assert.equal(ranked.length,10);assert.equal(additional.length,3);
assert.equal(new Set([...ranked,...additional]).size,13);
const groups={ranked,additional};
const expected=Object.fromEntries([...ranked,...additional].map(id=>{
 const local=products.filter(product=>product.prefectureIds.includes(id));
 assert.ok(local.length,'An expected shelf destination must contain published jewelry: '+id);
 const preferred=representatives[id]&&products.find(product=>product.id===representatives[id]);
 assert.ok(!preferred||preferred.prefectureIds.includes(id),'A configured representative must belong to its destination');
 const product=preferred||local.find(item=>item.availability!=='out_of_stock'&&images[item.id])||local.find(item=>item.availability!=='out_of_stock')||local[0];
 assert.ok(images[product.id],'A shelf representative needs a recorded editorial image');
 return[id,{product,image:images[product.id]}];
}));
// Confirm the expected public destinations have real bilingual content, without
// importing the component or reusing its rendered data to decide expectations.
for(const lang of ['ja','en'])for(const id of [...ranked,...additional]){
 const file=`src/content/places/${lang==='ja'?'ja/':''}${id}.md`;
 const body=await readFile(file,'utf8');
 const frontmatter=body.split(/^---\s*$/m)[1];
 assert.ok(frontmatter,'Expected destination frontmatter: '+file);
 const field=key=>{
  const match=frontmatter.match(new RegExp('^'+key+':[^\\S\\r\\n]*(?:"([^"\\r\\n]*)"|\'([^\'\\r\\n]*)\'|([^\\r\\n#]*))','m'));
  return match&&(match[1]??match[2]??match[3]).trim();
 };
 assert.equal(field('publishStatus'),'published');
 assert.equal(field('prefectureId'),id);
 assert.ok(body.split(/^---\s*$/m).slice(2).join('').trim().length>0);
 sourcePaths.push(file);
}

const surfaces=[{id:'home',route:''},{id:'objects',route:'objects/'},{id:'places',route:'places/'}];
const widths=[320,390,768,1024,1440];
const route=(lang,suffix='')=>base+lang+'/'+suffix;
await mkdir(dirname(reportPath),{recursive:true});
await mkdir('artifacts',{recursive:true});
const report={
 checkedAt:new Date().toISOString(),origin,base,
 method:'Raw catalog, localization, image registry, destination display configuration and bilingual destination Markdown independently supply the 13 expected representatives. Fresh native Chrome checks all 13 photos on JA/EN home, objects and places at five widths. Every image is scrolled into view and decoded before measuring its intrinsic dimensions, contain paint, frame, caption, links, padding and group consistency. Keyboard Tab focus and six full-page axe screens are included. Saved home screenshots show the start of TOP10 and DISCOVER at 390/1440, rather than an entire long page.',
 limits:'Desktop Chrome with viewport emulation, not physical Safari/iOS. AI-caption presence and full-frame rendering do not establish physical product appearance. No claim of traffic, sales or bounce-rate improvement.',
 expectedChecks:37,sourceInputs:{started:await sourceHashes()},expectedRepresentatives:Object.fromEntries(Object.entries(expected).map(([id,item])=>[id,{product:item.product.id,image:item.image.path}])),
 checks:[],failures:[],scenes:[],axe:[],screenshots:[],imageChecks:0,focusChecks:0,pageErrors:[],consoleErrors:[],externalRequests:[],
};
const flush=()=>writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
async function check(name,action){
 try{const detail=await action();report.checks.push({name,status:'passed',...detail});console.log('PASS '+name);}
 catch(error){const detail={name,message:error.stack||String(error)};report.failures.push(detail);report.checks.push({...detail,status:'failed'});console.error('FAIL '+name+' '+String(error));}
 await flush();
}
const browser=await chromium.launch({channel:'chrome',headless:true});
async function setup(lang,width){
 const context=await browser.newContext({viewport:{width,height:1000},locale:lang==='ja'?'ja-JP':'en-US',reducedMotion:'reduce',serviceWorkers:'block'});
 await context.route('**/*',async request=>{
  const url=new URL(request.request().url());
  if(url.origin!==origin&&!['data:','about:'].includes(url.protocol)){report.externalRequests.push(request.request().url());await request.abort();}
  else await request.continue();
 });
 const page=await context.newPage();
 page.on('pageerror',error=>report.pageErrors.push(String(error)));
 page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
 return{context,page};
}
function sameNumbers(items,key,tolerance=1.5){
 const values=items.map(item=>item[key]);
 assert.ok(Math.max(...values)-Math.min(...values)<=tolerance,`TOP10 and DISCOVER must share ${key}: ${values.join(', ')}`);
}
async function measurePhotos(page,lang,width,surface){
 const selection=page.locator('[data-region-selection]');
 await expect(selection).toHaveCount(1);
 const measurements=[];
 for(const [kind,ids]of Object.entries(groups)){
  const group=selection.locator('[data-region-group="'+kind+'"]');
  const actualIds=await group.locator('[data-region-row]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-region-row')));
  assert.deepEqual(actualIds,ids,'The ranked order and three curated DISCOVER destinations stay unchanged');
  for(const id of ids){
   const {product,image}=expected[id];
   const row=group.locator('[data-region-row="'+id+'"]');
   assert.equal(await row.getAttribute('data-tourism-rank'),kind==='ranked'?String(ranked.indexOf(id)+1):null);
   assert.equal(await row.locator('[data-representative-product]').getAttribute('data-representative-product'),product.id);
   const photoLink=row.locator('.region-selection-image-link');
   const img=photoLink.locator('img');
   await img.scrollIntoViewIfNeeded();
   await img.evaluate(element=>element.decode());
   assert.equal(await photoLink.getAttribute('href'),route(lang,'objects/'+product.slug+'/'));
   assert.equal(await img.getAttribute('src'),base+image.path);
   assert.equal(await img.getAttribute('alt'),image.alt[lang]);
   assert.equal(Number(await img.getAttribute('width')),image.width);
   assert.equal(Number(await img.getAttribute('height')),image.height);
   assert.equal(await photoLink.locator('figure').getAttribute('data-editorial-asset'),image.assetId);
   const caption=photoLink.locator('figcaption');
   assert.equal(normalize(await caption.innerText()),lang==='ja'?'AIイメージ':'AI image');
   assert.equal(await caption.isVisible(),true,'AI caption remains visible');
   const title=row.locator('h4 a');
   assert.equal(await title.getAttribute('href'),route(lang,'objects/'+product.slug+'/'));
   assert.equal(normalize(await title.innerText()),normalize(lang==='ja'?japanese.products[product.id].title:product.title));
   for(const link of await row.locator('[data-region-link],.region-selection-explore').all())assert.equal(await link.getAttribute('href'),route(lang,'places/'+id+'/'));
   const metrics=await img.evaluate(element=>{
    const box=element.getBoundingClientRect(),style=getComputedStyle(element),row=element.closest('[data-region-row]'),rowStyle=getComputedStyle(row),figure=element.closest('figure').getBoundingClientRect(),link=element.closest('a').getBoundingClientRect(),scale=Math.min(box.width/element.naturalWidth,box.height/element.naturalHeight),paintWidth=element.naturalWidth*scale,paintHeight=element.naturalHeight*scale;
    const region=row.querySelector('.region-selection-copy').getBoundingClientRect(),piece=row.querySelector('.region-selection-piece').getBoundingClientRect();
    return{naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight,imageWidth:box.width,imageHeight:box.height,paintWidth,paintHeight,verticalBlank:box.height-paintHeight,horizontalBlank:box.width-paintWidth,figureWidth:figure.width,figureHeight:figure.height,linkWidth:link.width,linkHeight:link.height,fit:style.objectFit,transform:style.transform,rowHeight:row.getBoundingClientRect().height,paddingTop:parseFloat(rowStyle.paddingTop),paddingBottom:parseFloat(rowStyle.paddingBottom),copyRight:region.right,pieceLeft:piece.left,rowOverflow:row.scrollWidth>row.clientWidth+1};
   });
   assert.equal(metrics.naturalWidth,image.width);assert.equal(metrics.naturalHeight,image.height);
   assert.equal(metrics.fit,'contain');
   assert.ok(metrics.imageWidth>0&&metrics.imageHeight>0);
   assert.ok(metrics.verticalBlank<=1.5,'The image must not have tall internal letterboxing');
   assert.ok(metrics.horizontalBlank<=1.5,'The frame must fit the contained photo horizontally');
   assert.ok(metrics.imageHeight<=(width<=720?148:200)+1.5,'The photo must respect the compact responsive height cap');
   assert.ok(metrics.linkWidth>=44&&metrics.linkHeight>=44);
   assert.ok(metrics.copyRight<=metrics.pieceLeft+1,'Destination text and representative photo must not overlap');
   assert.equal(metrics.rowOverflow,false);
   measurements.push({group:kind,id,product:product.id,image:image.path,...metrics});
   report.imageChecks++;
  }
 }
 // Current source assets all share 3:2. Each group therefore has the same real
 // photograph dimensions, not merely an equal oversized outer container.
 for(const key of ['imageWidth','imageHeight','paintWidth','paintHeight','figureWidth','figureHeight','paddingTop','paddingBottom'])sameNumbers(measurements,key);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'No horizontal page overflow');
 for(const kind of Object.keys(groups))for(const id of [groups[kind][0],groups[kind].at(-1)]){
  const row=selection.locator('[data-region-group="'+kind+'"] [data-region-row="'+id+'"]');
  const explore=row.locator('.region-selection-explore');
  const bounds=await explore.boundingBox();assert.ok(bounds.width>=44&&bounds.height>=44);
  await explore.focus();
  await page.keyboard.press('Tab');
  await expect(row.locator('.region-selection-image-link')).toBeFocused();
  await page.keyboard.press('Tab');
  const title=row.locator('h4 a');await expect(title).toBeFocused();
  const focused=await title.evaluate(element=>{const style=getComputedStyle(element),rect=element.getBoundingClientRect();return{outline:style.outlineStyle,outlineWidth:parseFloat(style.outlineWidth),top:rect.top,bottom:rect.bottom,height:innerHeight};});
  assert.ok(focused.outline!=='none'&&focused.outlineWidth>=2,'Keyboard focus remains visibly outlined');
  assert.ok(focused.top>=-1&&focused.bottom<=focused.height+1,'Focused product link is not outside the viewport');
  report.focusChecks++;
 }
 const detail={lang,surface,width,images:measurements.length,measurements,groupDimensionsEqual:true,paddingEqual:true,overflow:false};
 report.scenes.push(detail);
 return detail;
}
try{
 for(const lang of ['ja','en'])for(const surface of surfaces)for(const width of widths){
  const{context,page}=await setup(lang,width);
  const name=lang+' '+surface.id+' '+width;
  try{
   await check(name+' shared regional photos',async()=>{
    const response=await page.goto(origin+route(lang,surface.route),{waitUntil:'networkidle'});
    assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
    const body=await response.body(),local=await readFile('dist/'+lang+'/'+surface.route+'index.html');
    assert.equal(digest(body),digest(local),'The served HTML must match the frozen dist');
    const detail=await measurePhotos(page,lang,width,surface.id);
    if(surface.id==='home'&&[390,1440].includes(width))for(const kind of Object.keys(groups)){
     const group=page.locator('[data-region-selection] [data-region-group="'+kind+'"]');
     await group.evaluate(element=>window.scrollTo({top:element.getBoundingClientRect().top+scrollY,left:0,behavior:'instant'}));
     const path=`artifacts/${prefix}-${lang}-${width}-${kind}.png`;
     await page.screenshot({path,fullPage:false});report.screenshots.push(path);
    }
    return{...detail,htmlSha256:digest(body),distMatch:true};
   });
   if(width===390)await check(name+' accessibility',async()=>{
    const violations=(await new AxeBuilder({page}).analyze()).violations.map(item=>({id:item.id,impact:item.impact,targets:item.nodes.map(node=>node.target)}));
    report.axe.push({lang,surface:surface.id,width,violations});assert.deepEqual(violations,[]);return{violations:0};
   });
  }finally{await context.close();}
 }
 await check('No client errors or unrequested external traffic',async()=>{
  assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.externalRequests,[]);
  return{pageErrors:0,consoleErrors:0,externalRequests:0};
 });
}finally{
 await browser.close();report.sourceInputs.finished=await sourceHashes();
 report.sourceInputs.unchanged=JSON.stringify(report.sourceInputs.started)===JSON.stringify(report.sourceInputs.finished);
 if(!report.sourceInputs.unchanged)report.failures.push({name:'stable-inputs',message:'Source inputs changed during the read-only run'});
 if(report.checks.length!==report.expectedChecks)report.failures.push({name:'complete-coverage',message:'Not all 37 planned scene/accessibility checks completed'});
 report.completedAt=new Date().toISOString();
 report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,locales:2,surfaces:3,viewportWidths:widths,scenes:report.scenes.length,imageChecks:report.imageChecks,imagesPerScene:13,focusChecks:report.focusChecks,axeScreens:report.axe.length,axeViolations:report.axe.reduce((count,screen)=>count+screen.violations.length,0),screenshots:report.screenshots.length,pageErrors:report.pageErrors.length,consoleErrors:report.consoleErrors.length,externalRequests:report.externalRequests.length,sourceInputsUnchanged:report.sourceInputs.unchanged};
 await flush();console.log(JSON.stringify(report.summary,null,2));
}
if(report.failures.length)process.exitCode=1;
