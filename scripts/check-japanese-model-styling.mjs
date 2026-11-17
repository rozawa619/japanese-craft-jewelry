/** Release023: validate recorded fictional-model intent and image provenance, not identity from appearance. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {collectEditorialImageErrors} from '../src/lib/editorial-images.ts';
import {loadStylingGenerationManifests,japaneseStylingManifestPath} from './lib/styling-generation-manifests.mjs';
import {trainedAlgorithmicMedia} from './lib/image-generation-manifests.mjs';
import {assertPlainPath} from './lib/source-export.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const json=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const catalog=json('src/data/catalog.json'),registry=json('src/data/editorial-images.json'),ledger=json('docs/assets.json');
const auditPath='docs/japanese-models-stage-audit.json',expectedAudit='7371c6a4cf034ae11b868b3176af6c6da1f60f7d9566b7af29d50af18c217dfd';
const previousBuildPath='docs/compact-layout-stage-build-manifest.json',expectedPreviousBuild='af7e33fdedff7f83e47c6e740324068f3c23495234acc06ad75b58bb489c6f7b';
const withDist=process.argv.includes('--dist'),withOriginals=process.argv.includes('--originals');
const require=createRequire(import.meta.url),sharp=createRequire(require.resolve('astro/package.json'))('sharp');
const report={checkedAt:new Date().toISOString(),method:'Exact registry/asset/generation-record linkage, recorded fictional Japanese-adult settings, source bytes/XMP and declared replacement scope. No ethnicity, nationality, age or attractiveness inference from appearance. Human visual review remains necessary.',scope:{dist:withDist,originals:withOriginals},checks:[],failures:[],files:[],originals:[]};
const check=async(name,action)=>{try{const detail=await action();report.checks.push({name,status:'passed',detail});}catch(error){report.failures.push({name,message:error.stack||String(error)});report.checks.push({name,status:'failed'});}};
let generation,audit,newManifest;
await check('Pinned pre-replacement audit and unchanged solo-image build remain available',()=>{
 assert.equal(sha(readFileSync(resolve(root,auditPath))),expectedAudit);
 assert.equal(sha(readFileSync(resolve(root,previousBuildPath))),expectedPreviousBuild);
 audit=json(auditPath);assert.equal(audit.summary.mustReplace,22);assert.equal(audit.summary.recordedJapanese,36);assert.equal(audit.summary.unknown,0);
 return{audit:auditPath,previousBuild:previousBuildPath,oldJapanese:36,explicitlyReplaced:22};
});
await check('Every published product maps to an active image with exact generation evidence',()=>{
 assert.deepEqual(collectEditorialImageErrors(registry,catalog.products,ledger.assets),[]);
 generation=loadStylingGenerationManifests(root,{requireJapaneseManifest:true});newManifest=json(japaneseStylingManifestPath);
 assert.equal(newManifest.version,'0.18.0');assert.equal(newManifest.modelSettingsAreFictionalNotNationalityInference,true);assert.equal(newManifest.signedC2paClaim,false);
 const published=catalog.products.filter(product=>product.publishStatus==='published');assert.equal(published.length,60);assert.equal(Object.keys(registry).length,60);
 for(const[id,image]of Object.entries(registry)){const entry=generation.byAssetId.get(image.assetId);assert.ok(entry,'Missing generation evidence '+id);assert.equal(entry.publicPath,'public/'+image.path);assert.ok(entry.productIds.includes(id),'Generation product differs '+id);}
 return{products:published.length,uniqueImages:new Set(Object.values(registry).map(image=>image.path)).size,manifests:generation.manifests};
});
if(generation)for(const path of new Set(Object.values(registry).map(image=>image.path)))await check('Recorded Japanese adult and reviewed bytes '+path,async()=>{
 const ids=Object.keys(registry).filter(id=>registry[id].path===path),image=registry[ids[0]],entry=generation.byAssetId.get(image.assetId);assert.ok(entry);
 assert.equal(entry.model.fictionalNationality,'Japanese','Recorded setting must be Japanese, not inferred from the output');assert.ok(entry.model.ages.length,'No recorded adult age');assert.ok(entry.model.ages.every(age=>age>=25&&age<=33),'Recorded ages must be25–33');
 const bytes=readFileSync(resolve(root,'public',path)),metadata=await sharp(bytes).metadata();assert.equal(metadata.format,'webp');assert.equal(metadata.width,image.width);assert.equal(metadata.height,image.height);assert.equal(image.width*2,image.height*3,'Preserve the original landscape3:2 composition');assert.equal(image.preserveRatio,true);assert.equal(sha(bytes),entry.record.sha256);
 const asset=ledger.assets.find(asset=>asset.id===image.assetId);assert.equal(asset.promptRecord,entry.manifestPath);for(const locale of ['en','ja'])assert.match(image.alt[locale],/AI/);
 if(entry.manifestPath===japaneseStylingManifestPath){
  const r=entry.record;assert.equal(r.model?.fictionalNationality,'Japanese');assert.ok(Number.isInteger(r.model?.age)&&r.model.age>=25&&r.model.age<=33);assert.match(r.prompt,/\bfictional\b/i);assert.match(r.prompt,/\badult\b/i);assert.match(r.prompt,/\bJapanese\s+(?:(?:adult|female)\s+)?woman\b/i);assert.match(r.tool,/built[- ]in.*image[_ ]gen/i);
  assert.equal(r.visualReview?.outputViewed,true);assert.match(r.visualReview?.status||r.visualReview?.result||'',/^accepted/);assert.equal(r.reference?.thirdPartyPhotographsUsed,false);assert.equal(r.digitalSourceType,trainedAlgorithmicMedia);assert.ok(metadata.xmp?.toString().includes(trainedAlgorithmicMedia),'AI source declaration missing from public WebP');assert.deepEqual(image.alt,r.alt);
  assert.match(r.originalDeliveryPath||'',/^generated-originals\/0\.18\.0\/[a-z0-9-]+\.png$/);assert.match(r.pngSha256||r.originalSha256||'',/^[a-f0-9]{64}$/);assert.ok(Number.isFinite(Date.parse(r.generatedAt)),'Actual generation time required');
  if(withOriginals){const original=resolve(root,'../japanese-craft-jewelry-delivery',r.originalDeliveryPath);assertPlainPath(original);const png=readFileSync(original),meta=await sharp(png).metadata();assert.equal(meta.format,'png');assert.equal(meta.width,r.width);assert.equal(meta.height,r.height);assert.equal(sha(png),r.pngSha256||r.originalSha256);if(r.pngBytes!==undefined)assert.equal(png.length,r.pngBytes);report.originals.push({path:r.originalDeliveryPath,sha256:sha(png),bytes:png.length});}
 }
 if(withDist)assert.equal(sha(readFileSync(resolve(root,'dist',path))),sha(bytes));
 const detail={productIds:ids,assetId:image.assetId,path,manifest:entry.manifestPath,pointer:entry.jsonPointer,recordedModel:entry.model,width:image.width,height:image.height,bytes:bytes.length,sha256:sha(bytes)};report.files.push(detail);return detail;
});
if(audit&&newManifest)await check('Only the22 explicitly authorised models change and all36 Japanese images retain bytes',()=>{
 assert.equal(newManifest.images.length,22);const plans=audit.images.filter(image=>image.classification!=='retain_recorded_japanese'),kept=audit.images.filter(image=>image.classification==='retain_recorded_japanese');assert.equal(plans.length,22);assert.equal(kept.length,36);
 for(const old of kept){assert.equal(sha(readFileSync(resolve(root,'public',old.path))),old.currentPublicSha256);for(const id of old.productIds){assert.equal(registry[id].path,old.path);assert.equal(registry[id].assetId,old.assetId);}}
 for(const old of plans){const replacements=newManifest.images.filter(record=>record.replaces?.assetId===old.assetId);assert.equal(replacements.length,1,'Exactly one replacement '+old.assetId);const r=replacements[0];assert.equal(r.replaces.publicPath,'public/'+old.path);assert.equal(r.replaces.sha256,old.currentPublicSha256);assert.deepEqual([...r.replaces.productIds].sort(),[...old.productIds].sort());assert.notEqual(r.publicPath,'public/'+old.path);for(const id of old.productIds){assert.equal(registry[id].assetId,r.assetId);assert.equal('public/'+registry[id].path,r.publicPath);}const retired=ledger.assets.find(asset=>asset.id===old.assetId);assert.equal(retired?.status,'retired');assert.equal(retired?.localRetiredPath,'public/'+old.path);assert.equal(retired?.replacedBy,r.assetId);if(existsSync(resolve(root,'public',old.path)))assert.equal(sha(readFileSync(resolve(root,'public',old.path))),old.currentPublicSha256);if(withDist)assert.equal(existsSync(resolve(root,'dist',old.path)),false);}
 const ages=newManifest.images.map(r=>r.model.age),styles=newManifest.images.map(r=>r.model.style);assert.ok(ages.some(age=>age<=26),'Include the authorised mid-twenties direction');assert.ok(styles.some(style=>/cute/i.test(style||'')));assert.ok(styles.some(style=>/elegant|beautiful|glamorous/i.test(style||'')));return{retainedJapanese:kept.length,authorisedReplacements:plans.length,newAgeRange:[Math.min(...ages),Math.max(...ages)],styleSettings:[...new Set(styles)]};
});
await check('All60 standalone product-concept images stay byte-identical',()=>{
 const details=json('src/data/product-detail-images.json'),before=json(previousBuildPath);assert.equal(Object.keys(details).length,60);for(const image of Object.values(details)){const old=before.files.find(file=>file.path===image.path);assert.ok(old);assert.equal(sha(readFileSync(resolve(root,'public',image.path))),old.sha256);if(withDist)assert.equal(sha(readFileSync(resolve(root,'dist',image.path))),old.sha256);}return{standaloneImages:60};
});
if(withDist&&audit)await check('Retired model images are absent from every generated page and asset',()=>{
 const retired=ledger.assets.filter(asset=>asset.status==='retired'&&asset.localRetiredPath);for(const asset of retired)assert.equal(existsSync(resolve(root,'dist',asset.localRetiredPath.replace(/^public\//,''))),false);
 const html=[];function walk(directory){for(const item of readdirSync(directory,{withFileTypes:true})){const path=resolve(directory,item.name);if(item.isDirectory())walk(path);else if(path.endsWith('.html'))html.push(path);}}walk(resolve(root,'dist'));
 const replaced=audit.images.filter(image=>image.classification!=='retain_recorded_japanese');for(const path of html){const text=readFileSync(path,'utf8');for(const old of replaced)assert.equal(text.includes(old.path),false,'Retired model URL in '+path);}return{htmlPages:html.length,retiredLocalImages:retired.length};
});
report.completedAt=new Date().toISOString();report.status=report.failures.length?'failed':'passed';report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,publishedProducts:Object.keys(registry).length,uniqueImages:report.files.length,originalPngsChecked:report.originals.length,distChecked:withDist};
writeFileSync(resolve(root,process.env.CHECK_JAPANESE_MODEL_REPORT_PATH||'docs/japanese-models-stage-results.json'),JSON.stringify(report,null,2)+'\n');console.log(report.summary);if(report.failures.length){console.error(report.failures);process.exitCode=1;}
