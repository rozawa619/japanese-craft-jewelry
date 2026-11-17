/** Release023 image-only preservation proof. Run AFTER the generation manifest
 * and a stable public build are finalized; this never builds or calls a network.
 *
 * node scripts/check-japanese-model-preservation.mjs
 * CHECK_REPORT_PATH and CHECK_BUILD_MANIFEST_PATH may select JSON outputs under
 * docs/ or artifacts/. Defaults are japanese-models-stage-* files in docs/.
 *
 * The full old495-input proof needs the reviewed working checkout: retired old
 * WebP bytes remain locally although Git/source ZIP intentionally omit them.
 * This is a one-release preservation audit, not a fresh-clone build dependency.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {dirname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=path=>fs.readFileSync(resolve(root,path));
const json=path=>JSON.parse(read(path).toString('utf8'));
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])])):value;
const objectDigest=value=>digest(JSON.stringify(stable(value)));
const sorted=values=>[...values].sort();
const equalSet=(actual,expected,message)=>assert.deepEqual(sorted(actual),sorted(expected),message);
const baselinePath='docs/japanese-models-stage-app-baseline.json';
const beforeManifestPath='docs/japanese-models-stage-before-build-manifest.json';
const auditPath='docs/japanese-models-stage-audit.json';
const generationPath='docs/image-generation-japanese-v23.json';
const registryPath='src/data/editorial-images.json';
const pinned={
 baseline:'99b4017b0b139387f558bc6ae72c1ce79fc62db7a086ce72bc615332688f8151',
 beforeManifest:'af7e33fdedff7f83e47c6e740324068f3c23495234acc06ad75b58bb489c6f7b',
 audit:'7371c6a4cf034ae11b868b3176af6c6da1f60f7d9566b7af29d50af18c217dfd',
 packageWithoutVersion:'54acd34fa6bfde3ca07e03c3c83f31c84586dfef426d94d2f026603d62274089',
};
// Canonical per-product hashes came from baseline.commit, after verifying that
// original registry blob against the pinned495-input snapshot. Order is ignored.
/** @type {Readonly<Record<string,string>>} */
const oldRegistryEntryHashes=Object.freeze({
  "hamamatsuya-catch-pierced": "da27847cbd061f263aeb32f7c727cade7bb6540a9c69e07fbd0dc0bd5224a3a4",
  "hamamatsuya-clip": "364eb3d84eb590ebdbfad5a859ea3d9426745d8c4578ba5f0788421cc04bcba3",
  "rinzen-seika-amber-pierced-earrings": "a59e0aa026c8d40fcff21c1a2d6b931d25d59564839120f5a8b1e3ce4eb5008b",
  "six-kiln-half-moon-earrings": "d38d7e82239601cd3d9267ae999e2d86fa7fb54e866e06318c2c30b12b94e3e6",
  "maruyama-clip-c": "a702f7ef36a30accee517fe2622fab37e687fe1787b4df2366211ace3aac19a3",
  "maruyama-pierced-c": "a702f7ef36a30accee517fe2622fab37e687fe1787b4df2366211ace3aac19a3",
  "maruyama-clip-d": "af62e17c9c6b127271ee281d987d6d3172c9088862df70b67ba0f4ccee4a72f6",
  "maruyama-pierced-d": "af62e17c9c6b127271ee281d987d6d3172c9088862df70b67ba0f4ccee4a72f6",
  "hamamatsuya-pendant": "67cfe697abdbda0408cb30336d96495e7567b0c98624f709173b676f4e708d43",
  "checos-japanese-apricot-pierced-earrings": "5c0d3de703740eed58c4a52c12867e44e96bcc40d6ef02fad061fef48f688113",
  "morphosphere-ultramarine-pansy-pierced-earrings": "200dc1e381fa4c3ab324407e3b67fafc7ad5f8b40d4dece740bed18605afd254",
  "kato-suke-drop-pierced-earrings": "5c3840dbe012680ccdb647282620f94017c759538ee88485f10ee2d9c73284f9",
  "six-kiln-blue-bouquet-pierced-earrings": "93dc8f508b36cad11feff22277e704d89ee3414d6a261923f757b3b8b7564045",
  "rinzen-leaf-glass-pendant": "654b7f01860382475a25f7270b408f651f52a2c329577dbf10756f261246a217",
  "saskia-diez-drake-porcelain-cuff": "7fe815f33b9bf7d99fec878a169753b4efbe466b5f3bf57ef12f0064a7bb7f8a",
  "senshu-pearl-stud-earrings": "4790f8078653d050fe681ca752e4c1e1c0a36d3d2dc88f710831b1b5cb78adac",
  "simprich-crystal-bubble-pierced-earrings": "69d8e66f7a53bcca30069fed9ff18990813677e461694d8b4915a37ddc217105",
  "yukieglass-mint-veil-earrings": "71743031adae3d7dc7f7ec65b3f054f39e1a089d6a0b3641f09390565367d0e2",
  "sugimura-hosoge-raden-pendant": "95ca12fb64b24ae3622b5a2bc62db1c7bce22bef28a326951a8d40169ac358bb",
  "arcos-cosmic-spiral-pendant": "f22b71115dde91dda5b005044dcefa2bb1d35323e23f7c255ed26a2e54b5200a",
  "arcos-cosmic-glass-bracelet": "b3e91c565ffb4f0c0b363c192186d778228fe83c14252966537958c4b9303979",
  "senshu-pearl-swing-earrings": "af4fa23b11948fdb3126babba192d5e64184e4b4b6987a12529ca6357d2516fe",
  "sugimura-lotus-makie-ring": "0753f61152480caaaf96dd2be0775306bb18f3956a3474d915390a80c92dbe3e",
  "simprich-rose-quartz-necklace": "81aef1da2375b7134c54e9b073bb48b505ecb27aec51d9213dbf172ac104d33d",
  "yukieglass-rouge-veil-earrings": "3b5dd2d689fd9d406a9472240678d0a1716d4c9c43f7bf0e9567f080000bd9d8",
  "nakajima-pear-sakura-pendant": "26bc6748052705afcf61d5b92139ef7c4aa16e315162e9be0b38f9aff290f209",
  "kato-suke-round-ring": "1d2aae1bc9df494c2f949a203972c519fea0639bca7ef596086705421f1d8386",
  "hario-little-tears-clip-on-earrings": "437ad0a90b31193217aca58eb0e27fec17136f068b0d26eaa2f094af9d3175f4",
  "sirisiri-page-blue-enamel-pierced-earrings": "127841567ae3f3c467c1f3f99f755b1213641bf489d1ec98e9c72ffa4d552f32",
  "mie-akoya-oh002-stud-earrings": "dca3e8d7a7ad2406dcec7c10f030a6a547e73003194112e2088f31b76dc2ffe8",
  "sangetsu-irodori-tombodama-necklace": "9d93f254199ddaf16654c6b10ddeb0b62568d26ecab19cb91fb5b97cc0b3f228",
  "sangetsu-irodori-tombodama-earrings": "f1d236173cfff22ce7026e8bd707a31bc18e0fa5728ae8cc4b74214228bdff9a",
  "simprich-reversible-topaz-ruby-chain-ring": "23e516cec348557b15db508e9467f9c0ed17f779e326e3d3514965118b94bf34",
  "simprich-reversible-silver-piaring-single": "cd910b2d6fc0030019034c5b46b5ec3e878aabae373e0fa0a382437532cb9fb0",
  "sirisiri-silver-thread-hoop-mini": "8ca69ea2085216805a873f6043c11a3794c73b0394716482501ea8417784fccd",
  "nousaku-aya-tin-pendant": "613ca5b6a9adfa4e1f6874ea9145f6f7c2f59162d9d30e5d8404b0e97034138e",
  "sghr-tie-tie-glass-earrings": "36c61c2cc184db1bbe286b6525669c92118f02025d4bb015936510299c07db70",
  "nousaku-dahlia-gerbera-clip-on-earrings": "dc2e2c410f2a5694e16df92b5904cfac801b97b446b92aaf7b3e689a0a15e31f",
  "sghr-kolmio-glass-ear-cuff": "e127cd708c37b4ea9e42acaa4d79828dd6f42e9ecf98346d0ef5842da7a9e89a",
  "toytoy-ninkari-nikuri-earrings": "4a0abe365fbde6293c9f3f0112d9324811301e7e472686054d8ac0cc93059768",
  "somemasa-peacock-clip-on-earrings": "3e1653850521269e4f770396e1059af593d2f29170c9b7eb5fb9ad7858e5457b",
  "toytoy-sirokani-pe-silver-necklace": "23098be166eed0750b93970763f477e1076fbb7b5917d210ef38ce03522269ac",
  "tamura-kaisai-enamel-ear-jewelry": "1cac325f4481cd5b3814228e7b935a2f120a53314b2738a9eb716e320b4d5730",
  "coyorimi-tamamusubi-clip-on-earrings": "f587f92f825dbcce2e870b21e2002a764073a7c79402b9f15939bbd219a7783a",
  "iwaya-urushi-9mm-hook-earrings": "77b1c0103cc62d255c178d63697ab9b72b52349c4745f089fe95050b26662b55",
  "egaho-gathered-kurume-kasuri-ear-jewelry": "477e9a1139015831ab5ae4f2a9007d0ee9fbba2369156f49b5a059341f599d61",
  "showen-edo-uchi-silk-bracelet": "626e66d9eed2a6220323b7fd03abf97a067fd67f2613c726c77b9c2b3ed9f15e",
  "kazarino-hanabishi-copper-earrings": "855676f3aa495e19f24de69182177be015c8c90b5598f02e24b4fde1f9ea9445",
  "kazarino-shippo-pattern-brass-bangle": "6f544f5fef45416234f8768974b7c9324cb9190962bba7b975fcfd3b7056c5ce",
  "nanao-shuka-nebula-16g-earrings": "ebd4bc025173546b99f18dc9f69cf4ddfa57ad612630d0f762273195f0ad85b2",
  "applause-awa-indigo-pearl-clip-on-earrings": "e6c430538b8b82b8ac3615a8b3fd38e0fbf63296f90e80dfd0e4cb47d631a045",
  "earth-hiroshima-origami-crane-chain-earrings": "eca0fd74346cc489a10e77f1c8338953a0d27ec595f04f9f496da5e9a021da60",
  "menoya-izumo-magatama-n15-necklace": "5bace4759b96971b9421f36e09ef481fcdb857c0e5348053f095fe3f5fbf8b03",
  "mitsusuke-higo-zogan-shizuku-pierced-earrings": "18633235bb4cc483757e13dc768a4297c96da730521e05bd780107049f9e97dd",
  "nanayosha-punu-gold-vanilla-pierced-earrings": "bbbb991186079a83deb03cd7a47eff50db55ab554c45bc1bf73b16f30df61df3",
  "shimadzu-satsuma-kiriko-hikari-l-pendant": "0d1df5f16a7046531b52bfc03f5418452df09205179f262dc9b1290527d459f7",
  "sur-basic1-clear-pearl-pierced-earrings": "c1bfc07b0858859eeb8197f59bf55c39c2d700219fd12a471878b04074eb0171",
  "tete-ryukyu-glass-hanagasa-heart-pierced-earrings": "dfe803db74f355ddd601c4b8a65485b62ad7845e256242709c78179ad1278864",
  "yadome-akita-rice-silver-pierced-earrings": "95509d20507fa7d51d443c9d97f589a86ad43b09a26386dcc8c2830d59616ea0",
  "yoboty-inshu-washi-indigo-long-nonhole-earrings": "31bff2ce9196ae948d7598659cbeda800eda281b2fc758e8fb0b399c9068f5c2"
});

for(const[path,expected]of [[baselinePath,pinned.baseline],[beforeManifestPath,pinned.beforeManifest],[auditPath,pinned.audit]])assert.equal(digest(read(path)),expected,'Immutable baseline changed: '+path);
const baseline=json(baselinePath),before=json(beforeManifestPath),audit=json(auditPath),generation=json(generationPath);
assert.ok(Array.isArray(baseline.files)&&Array.isArray(before.files)&&Array.isArray(audit.replacementPriority),'Incomplete baseline structures');
assert.ok(Array.isArray(generation.images),'Finalize generation.images before running this proof');
const expectedOld=audit.replacementPriority;
const oldPaths=new Set(expectedOld.map(item=>'public/'+item.path));
const authorizedProducts=new Set(expectedOld.flatMap(item=>item.productIds));
assert.equal(oldPaths.size,expectedOld.length,'Replacement audit must identify unique old image paths');
assert.equal(expectedOld.length,audit.summary.mustReplace,'Audit replacement count disagrees with its own set');
const newRecords=generation.images.map(item=>({
 raw:item,assetId:item.assetId,publicPath:item.publicPath||item.file,sha256:item.sha256,
 productIds:Array.isArray(item.productIds)?item.productIds:item.productId?[item.productId]:[],
}));
for(const item of newRecords)assert.match(item.publicPath||'',/^public\/images\/styling-jp-[a-z0-9-]+-v23\.webp$/,'Finalize valid new image paths before running preservation');
const sourcePaths=baseline.files.map(item=>item.path),baselinePaths=new Set(sourcePaths);
const allowedChanges=new Set(['package.json',registryPath]);
const newPaths=new Set(newRecords.map(item=>item.publicPath));
const protectedDocuments=[baselinePath,beforeManifestPath,auditPath,generationPath];
function outputPath(variable,fallback){
 const file=resolve(root,process.env[variable]||fallback),name=relative(root,file).split(sep).join('/');
 assert.ok(!name.startsWith('../')&&/^(?:docs|artifacts)\/.+\.json$/.test(name),'Output must be a JSON file under docs/ or artifacts/: '+variable);
 assert.ok(!protectedDocuments.includes(name),'Refusing to overwrite evidence: '+name);
 return file;
}
const reportPath=outputPath('CHECK_REPORT_PATH','docs/japanese-models-stage-preservation-results.json');
const manifestPath=outputPath('CHECK_BUILD_MANIFEST_PATH','docs/japanese-models-stage-build-manifest.json');
assert.notEqual(reportPath,manifestPath,'Report and build manifest need different output paths');
const snapshot=paths=>new Map(paths.map(path=>[path,fs.existsSync(resolve(root,path))?digest(read(path)):null]));
const started=snapshot([...sourcePaths,...newPaths,generationPath]);
const report={
 version:'0.18.0',checkedAt:new Date().toISOString(),
 method:'Compare the pinned0.17.3 app-input snapshot and audit with finalized023 generation records. Permit only package version and styling registry changes, preserve every old byte including retired images, admit exactly the new reviewed images, and prove exact build-image substitution plus identical _astro assets. No build, network, or pixel-based nationality inference.',
 limits:'A targeted release proof for enumerated app inputs and generated assets. Retired old local WebP files are required for full495-input reproduction and are intentionally absent from a new source ZIP. Metadata/visual suitability, image rights, runtime behavior and legal/ad eligibility require their separate checks. HTML is allowed to change its image/alt/metadata content; no all-HTML-byte preservation claim.',
 baseline:{path:baselinePath,sha256:pinned.baseline,commit:baseline.commit,beforeBuildManifest:{path:beforeManifestPath,sha256:pinned.beforeManifest},audit:{path:auditPath,sha256:pinned.audit}},
 generation:{path:generationPath,sha256:started.get(generationPath)},checks:[],failures:[],
};
const check=(name,action)=>{try{report.checks.push({name,status:'passed',detail:action()});}catch(error){report.checks.push({name,status:'failed'});report.failures.push({name,message:error.stack||String(error)});}};

check('All original app inputs except package and registry are byte-identical',()=>{
 const changed=[];for(const item of baseline.files){const actual=started.get(item.path);assert.ok(actual,'Missing baseline input '+item.path+'; run full preservation in the reviewed checkout retaining old retired WebP files.');if(actual!==item.sha256)changed.push(item.path);if(!allowedChanges.has(item.path))assert.equal(actual,item.sha256,item.path);}
 equalSet(changed,allowedChanges,'Only the two intended old input files may change');
 for(const path of oldPaths){assert.ok(baselinePaths.has(path),'Old replacement not in source baseline: '+path);assert.equal(started.get(path),baseline.files.find(item=>item.path===path).sha256,path);}
 return{sourceInputs:baseline.files.length,changed,unchanged:baseline.files.length-changed.length,retiredOldStylingBytesPreserved:oldPaths.size};
});
check('Package change is version only',()=>{
 const{version,...other}=json('package.json');assert.equal(version,'0.18.0');assert.equal(objectDigest(other),pinned.packageWithoutVersion);
 return{version,dependencyScriptsAndOtherKeysUnchanged:true};
});
check('Final generation set exactly covers the authorized old-image products',()=>{
 assert.equal(newRecords.length,expectedOld.length);assert.equal(newPaths.size,newRecords.length,'New image paths must be unique');
 const products=[];const assetIds=new Set();
 for(const item of newRecords){assert.match(item.publicPath||'',/^public\/images\/styling-jp-[a-z0-9-]+-v23\.webp$/);assert.match(item.sha256||'',/^[a-f0-9]{64}$/);assert.equal(typeof item.assetId,'string');assert.ok(item.assetId&&!assetIds.has(item.assetId));assetIds.add(item.assetId);assert.ok(item.productIds.length);for(const id of item.productIds){assert.match(id,/^[a-z0-9-]+$/);products.push(id);}assert.ok(!baselinePaths.has(item.publicPath),'New image overwrites an old source path');assert.equal(started.get(item.publicPath),item.sha256,item.publicPath);}
 assert.equal(products.length,new Set(products).size,'A product must not be assigned multiple new generation records');equalSet(new Set(products),authorizedProducts,'Generation products must exactly match the audited replacement set');
 return{oldImages:oldPaths.size,newImages:newPaths.size,replacedProducts:authorizedProducts.size,newSourceHashes:newPaths.size};
});
check('Only authorized styling mappings change and retained mappings stay identical',()=>{
 const registry=json(registryPath);equalSet(Object.keys(registry),Object.keys(oldRegistryEntryHashes),'Registry product keys must not change');
 const changed=Object.entries(registry).filter(([id,value])=>objectDigest(value)!==oldRegistryEntryHashes[id]).map(([id])=>id);equalSet(changed,authorizedProducts,'Only audited products may change styling metadata');
 for(const item of newRecords)for(const id of item.productIds){const entry=registry[id];assert.ok(entry,'Missing registry mapping '+id);assert.equal(entry.path,item.publicPath.slice('public/'.length));assert.equal(entry.assetId,item.assetId);if(Number.isInteger(item.raw.width))assert.equal(entry.width,item.raw.width);if(Number.isInteger(item.raw.height))assert.equal(entry.height,item.raw.height);}
 const activeNew=new Set(Object.values(registry).map(entry=>'public/'+entry.path).filter(path=>newPaths.has(path)));equalSet(activeNew,newPaths,'Every new generated image must be actively referenced');for(const entry of Object.values(registry))assert.ok(!oldPaths.has('public/'+entry.path),'Old replaced image remains active');
 return{products:Object.keys(registry).length,changedProducts:changed.length,retainedProductMappings:Object.keys(registry).length-changed.length,activeNewImages:activeNew.size};
});

function tree(directory,prefix=''){
 const files=[];for(const entry of fs.readdirSync(directory,{withFileTypes:true})){assert.ok(!entry.isSymbolicLink(),'Unexpected symlink in app/output: '+resolve(directory,entry.name));const name=prefix+entry.name;if(entry.isDirectory())files.push(...tree(resolve(directory,entry.name),name+'/'));else{const bytes=fs.readFileSync(resolve(directory,entry.name));files.push({path:name,bytes:bytes.length,sha256:digest(bytes)});}}
 return files;
}
check('Only finalized new images are added under app input roots',()=>{
 const actual=['src','public','.github'].flatMap(name=>tree(resolve(root,name),name+'/').map(item=>item.path));const added=actual.filter(path=>!baselinePaths.has(path));equalSet(added,newPaths,'Unexpected app-source/public additions');return{addedAppInputs:added.length,paths:sorted(added)};
});
const output=tree(resolve(root,'dist')).sort((a,b)=>a.path.localeCompare(b.path));
const outputByPath=new Map(output.map(item=>[item.path,item]));
const oldOutputByPath=new Map(before.files.map(item=>[item.path,item]));
check('Published image set is exactly old audited images out and new images in',()=>{
 const oldImages=before.files.filter(item=>item.path.startsWith('images/'));
 const oldRemoved=new Set([...oldPaths].map(path=>path.slice('public/'.length)));
 const newAdded=new Set([...newPaths].map(path=>path.slice('public/'.length)));
 for(const path of oldRemoved)assert.ok(oldOutputByPath.has(path),'Retired source was not in the old published set: '+path);
 const expected=new Set([...oldImages.map(item=>item.path).filter(path=>!oldRemoved.has(path)),...newAdded]);
 equalSet(output.filter(item=>item.path.startsWith('images/')).map(item=>item.path),expected,'Unexpected generated image set');
 for(const item of oldImages)if(!oldRemoved.has(item.path))assert.equal(outputByPath.get(item.path)?.sha256,item.sha256,item.path);
 for(const item of newRecords){const path=item.publicPath.slice('public/'.length);assert.equal(outputByPath.get(path)?.sha256,item.sha256,path);}
 const retained=oldImages.length-oldRemoved.size;return{beforePublishedImages:oldImages.length,retiredPublishedImages:oldRemoved.size,newPublishedImages:newAdded.size,retainedImageHashes:retained,afterPublishedImages:expected.size};
});
check('All _astro asset names and hashes are unchanged',()=>{
 const old=before.files.filter(item=>item.path.startsWith('_astro/')),current=output.filter(item=>item.path.startsWith('_astro/'));equalSet(current.map(item=>item.path),old.map(item=>item.path),'Generated layout/script asset set changed');for(const item of old)assert.equal(outputByPath.get(item.path)?.sha256,item.sha256,item.path);return{assets:old.length,allHashesMatch:true,paths:old.map(item=>item.path)};
});
check('HTML routes and every other non-image generated asset are unchanged',()=>{
 const html=list=>list.filter(item=>item.path.endsWith('.html')).map(item=>item.path);equalSet(html(output),html(before.files),'HTML route set changed');
 const staticFiles=list=>list.filter(item=>!item.path.endsWith('.html')&&!item.path.startsWith('images/'));equalSet(staticFiles(output).map(item=>item.path),staticFiles(before.files).map(item=>item.path),'Non-image generated asset set changed');for(const item of staticFiles(before.files))assert.equal(outputByPath.get(item.path)?.sha256,item.sha256,item.path);
 return{htmlRoutes:html(output).length,unchangedNonHtmlNonImageAssets:staticFiles(before.files).length,htmlByteIdentityClaimed:false};
});
check('Source inputs, new images, metadata and output remain stable during proof',()=>{
 for(const[path,expected]of started){const current=fs.existsSync(resolve(root,path))?digest(read(path)):null;assert.equal(current,expected,path);}
 const after=tree(resolve(root,'dist')).sort((a,b)=>a.path.localeCompare(b.path));assert.deepEqual(after,output,'Build output changed during proof');return{inputHashes:started.size,outputHashes:output.length};
});

report.completedAt=new Date().toISOString();report.status=report.failures.length?'failed':'passed';report.summary={checks:report.checks.length,passed:report.checks.filter(item=>item.status==='passed').length,failed:report.failures.length,sourceInputs:baseline.files.length,authorizedOldImages:oldPaths.size,expectedNewImages:newPaths.size,buildFiles:output.length};
report.buildDifferences={added:output.filter(item=>!oldOutputByPath.has(item.path)).map(item=>item.path),removed:before.files.filter(item=>!outputByPath.has(item.path)).map(item=>item.path),changed:output.filter(item=>oldOutputByPath.has(item.path)&&oldOutputByPath.get(item.path).sha256!==item.sha256).map(item=>item.path)};
fs.mkdirSync(dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
if(!report.failures.length){fs.mkdirSync(dirname(manifestPath),{recursive:true});fs.writeFileSync(manifestPath,JSON.stringify({version:'0.18.0',recordedAt:report.completedAt,summary:{files:output.length,html:output.filter(item=>item.path.endsWith('.html')).length,webp:output.filter(item=>item.path.endsWith('.webp')).length},files:output},null,2)+'\n');}
console.log(report.summary);if(report.failures.length){console.error(report.failures);process.exitCode=1;}
