/** Prepare the explicit023 metadata replacement. Default: inspect only. --apply writes metadata only.
 * Never generates, edits, moves, deletes or untracks an image. Root must review outputs first. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {collectEditorialImageErrors} from '../src/lib/editorial-images.ts';
import {japaneseStylingManifestPath} from './lib/styling-generation-manifests.mjs';
import {trainedAlgorithmicMedia} from './lib/image-generation-manifests.mjs';
import {assertPlainPath} from './lib/source-export.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const require=createRequire(import.meta.url),sharp=createRequire(require.resolve('astro/package.json'))('sharp');
const audit=read('docs/japanese-models-stage-audit.json'),registry=read('src/data/editorial-images.json'),ledger=read('docs/assets.json'),manifest=read(japaneseStylingManifestPath);
const apply=process.argv.includes('--apply'),plan=audit.images.filter(image=>image.classification!=='retain_recorded_japanese');
assert.equal(manifest.version,'0.18.0');assert.equal(plan.length,22);assert.equal(manifest.images.length,22);
const date=manifest.checkedAt||new Date().toISOString().slice(0,10),untrack=[];
for(const old of plan){
 const candidates=manifest.images.filter(record=>old.productIds.some(id=>record.productId===id||record.productIds?.includes(id)));assert.equal(candidates.length,1,'One reviewed replacement required: '+old.assetId);
 const record=candidates[0],publicPath=record.publicPath;
 assert.match(publicPath||'',/^public\/images\/styling-jp-[a-z0-9-]+-v23\.webp$/);assert.notEqual(publicPath,'public/'+old.path);assert.match(record.assetId||'',/^[a-z0-9-]+-v23$/);
 assert.equal(record.model?.fictionalNationality,'Japanese');assert.ok(Number.isInteger(record.model?.age)&&record.model.age>=25&&record.model.age<=33);assert.equal(record.visualReview?.outputViewed,true);assert.match(record.visualReview?.status||record.visualReview?.result||'',/^accepted/);assert.equal(record.reference?.thirdPartyPhotographsUsed,false);assert.equal(record.digitalSourceType,trainedAlgorithmicMedia);
 assert.ok(record.alt?.en?.trim()&&record.alt?.ja?.trim(),'Reviewed bilingual alt required');
 const bytes=readFileSync(resolve(root,publicPath)),metadata=await sharp(bytes).metadata();assert.equal(metadata.format,'webp');assert.equal(metadata.width,record.width);assert.equal(metadata.height,record.height);assert.equal(record.width*2,record.height*3);assert.equal(sha(bytes),record.sha256);assert.ok(metadata.xmp?.toString().includes(trainedAlgorithmicMedia));
 assert.match(record.originalDeliveryPath||'',/^generated-originals\/0\.18\.0\/[a-z0-9-]+\.png$/);const original=resolve(root,'../japanese-craft-jewelry-delivery',record.originalDeliveryPath);assertPlainPath(original);assert.equal(sha(readFileSync(original)),record.pngSha256||record.originalSha256,'Original PNG missing or differs: '+old.assetId);
 const replaces={assetId:old.assetId,publicPath:'public/'+old.path,sha256:old.currentPublicSha256,productIds:old.productIds};
 if(record.replaces)assert.deepEqual(record.replaces,replaces,'Replacement scope differs from pinned audit');else record.replaces=replaces;
 const retired=ledger.assets.find(asset=>asset.id===old.assetId);assert.ok(retired);assert.equal(retired.productImage,false);assert.ok(retired.status==='active'||retired.status==='retired'&&retired.replacedBy===record.assetId);
 if(existsSync(resolve(root,'public',old.path)))assert.equal(sha(readFileSync(resolve(root,'public',old.path))),old.currentPublicSha256,'The old image must never be overwritten');
 Object.assign(retired,{status:'retired',localRetiredPath:'public/'+old.path,localRetiredNote:'Historical local AI output. Exclude from public build, source ZIP and new Git tree; original bytes remain in historical release/Git evidence.',retiredAt:date,retiredReason:'Explicit Japanese-only fictional-model request for023.',replacedBy:record.assetId,retiredSha256:old.currentPublicSha256});
 const active=ledger.assets.find(asset=>asset.id===record.assetId);
 if(active){assert.equal(active.source,publicPath);assert.equal(active.status,'active');assert.equal(active.promptRecord,japaneseStylingManifestPath);}
 else ledger.assets.push({id:record.assetId,kind:'AI-generated editorial styling illustration',source:publicPath,rightsHolder:'Project AI output; no claim of third-party photograph rights or exclusive copyright',permissionBasis:'User explicitly requested Japanese-only fictional adult styling models, including mid-twenties and cute/elegant directions, on2026-11-17. Reviewed built-in image_gen output; no retailer photograph supplied or copied.',creditRequired:false,scope:'Original fictional-adult AI styling concept, captioned AIイメージ/AI image. Not actual product photography or evidence of wear, fit, exact SKU, scale or materials.',checkedAt:date,productImage:false,status:'active',promptRecord:japaneseStylingManifestPath});
 for(const id of old.productIds){assert.ok(registry[id]);assert.ok(registry[id].assetId===old.assetId||registry[id].assetId===record.assetId,'Unexpected intermediate binding '+id);registry[id]={assetId:record.assetId,path:publicPath.slice('public/'.length),width:record.width,height:record.height,alt:record.alt,preserveRatio:true};}
 untrack.push('public/'+old.path);
}
for(const old of audit.images.filter(image=>image.classification==='retain_recorded_japanese')){
 assert.equal(sha(readFileSync(resolve(root,'public',old.path))),old.currentPublicSha256);for(const id of old.productIds){assert.equal(registry[id].path,old.path);assert.equal(registry[id].assetId,old.assetId);}
}
assert.deepEqual(collectEditorialImageErrors(registry,read('src/data/catalog.json').products,ledger.assets),[]);
const ignorePath=resolve(root,'.gitignore'),originalIgnore=readFileSync(ignorePath,'utf8');let ignore=originalIgnore;
const ignored=new Set(ignore.split(/\r?\n/).map(line=>line.replace(/^\//,'')));
const added=untrack.filter(path=>!ignored.has(path));if(added.length)ignore=ignore.replace(/\s*$/,'')+'\n\n#023 Japanese-only model replacement: keep retired outputs local, never republish.\n'+added.map(path=>'/'+path).join('\n')+'\n';
ledger.checkedAt=date;ledger.japaneseModelReviewV23={checkedAt:date,request:'Japanese-only fictional adult models25–33; include mid-twenties, cute and elegant directions',newGenerationManifest:japaneseStylingManifestPath,replacementAudit:'docs/japanese-models-stage-audit.json',retainedJapaneseImages:36,replacedNonJapaneseImages:22,nationalityInferenceFromAppearance:false,thirdPartyPhotographsUsed:false};
manifest.replacementAudit='docs/japanese-models-stage-audit.json';
if(apply){
 const backup=resolve(root,'artifacts/japanese-models-stage/integration-backup-'+Date.now());mkdirSync(backup,{recursive:true});
 for(const path of ['src/data/editorial-images.json','docs/assets.json',japaneseStylingManifestPath,'.gitignore'])copyFileSync(resolve(root,path),resolve(backup,path.replaceAll('/','__')));
 writeFileSync(resolve(root,'src/data/editorial-images.json'),JSON.stringify(registry,null,2)+'\n');writeFileSync(resolve(root,'docs/assets.json'),JSON.stringify(ledger,null,2)+'\n');writeFileSync(resolve(root,japaneseStylingManifestPath),JSON.stringify(manifest,null,2)+'\n');writeFileSync(ignorePath,ignore);
}
console.log(JSON.stringify({mode:apply?'metadata-applied':'dry-run-no-writes',replacements:plan.length,retainedJapanese:36,registryProducts:Object.keys(registry).length,ignoredRetiredPathsAdded:added.length,oldImageFilesMovedOrDeleted:false,gitMutationPerformed:false,rootGitUntrackArguments:['rm','--cached','--',...untrack]},null,2));
