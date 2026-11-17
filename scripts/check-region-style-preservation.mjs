/** Read-only proof for the 0.17.1 -> 0.17.2 region-photo style refinement.
 * Run after a stable build: node scripts/check-region-style-preservation.mjs
 * The committed JSON baseline contains hashes, not private dependencies. The
 * optional old CSS files in artifacts only add diagnostic snippets.
 * This verifies preservation, not browser layout or runtime behavior. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

const baselinePath='docs/region-photos-stage-preservation-baseline.json';
const expectedBaselineSha256='a1c180d27244502781544bd9c68b2b0d82efec78e5ef9610f7e518b7032f9ee1';
const expectedComponentSha256='396daaf23c00803ba7985f0e47e257e3cc04aabcdbb0b95fe12adedacc5c586b';
const reportPath=process.env.CHECK_REPORT_PATH||'docs/region-photos-stage-preservation-results.json';
const manifestPath=process.env.CHECK_MANIFEST_PATH||'docs/region-photos-stage-build-manifest.json';
const sha=data=>createHash('sha256').update(data).digest('hex');
const baselineRaw=await readFile(baselinePath,'utf8');
assert.equal(sha(baselineRaw),expectedBaselineSha256,'The captured baseline is immutable.');
const baseline=JSON.parse(baselineRaw);
assert.equal(baseline.workingCopyComponentSha256,expectedComponentSha256);
const beforeRaw=await readFile(baseline.beforeBuildManifest.path,'utf8');
assert.equal(sha(beforeRaw),baseline.beforeBuildManifest.sha256);
const before=JSON.parse(beforeRaw);

async function walk(root){
 const paths=[];
 for(const entry of await readdir(root,{withFileTypes:true})){
  const path=root+'/'+entry.name;
  if(entry.isDirectory())paths.push(...await walk(path));
  else if(entry.isFile())paths.push(path);
 }
 return paths.sort();
}
async function inputFiles(){
 const paths=[...await walk('src'),...await walk('public'),...await walk('.github'),'astro.config.mjs','package.json','pnpm-lock.yaml','tsconfig.json'].sort();
 return Promise.all(paths.map(async path=>{const data=await readFile(path);return{path,bytes:data.length,sha256:sha(data)}}));
}
const sourceStarted=await inputFiles();
const files=await Promise.all((await walk('dist')).map(async path=>{const data=await readFile(path);return{path:path.slice(5),bytes:data.length,sha256:sha(data)}}));
const packageData=JSON.parse(await readFile('package.json','utf8'));
const manifest={version:packageData.version,recordedAt:new Date().toISOString(),summary:{files:files.length,html:files.filter(f=>f.path.endsWith('.html')).length,webp:files.filter(f=>f.path.endsWith('.webp')).length},files};
const report={checkedAt:new Date().toISOString(),status:'running',method:'A SHA-pinned snapshot captured from immutable app 8b53114 supplies original source/public hashes, style-stripped component bytes, per-route script content/attributes and the complete old build manifest. Compare all protected inputs and build files without rebuilding or network access. Script blocks are lexed from Astro-generated HTML, including JSON blocks; executable JavaScript assets are compared separately. Only the scoped RegionSelection style and package version may change.',limits:'This proves source/build preservation within the enumerated inputs. It does not replace responsive layout, link interaction, accessibility or public deployment checks. It does not assert that every HTML byte is unchanged: hashed stylesheet references and Astro style scope tokens can change with CSS compilation.',baseline:{path:baselinePath,sha256:expectedBaselineSha256,appCommit:baseline.appCommit,beforeBuildManifest:baseline.beforeBuildManifest},checks:[],failures:[],sourceChanges:[],cssChanges:[],buildChanges:null};
async function check(name,action){try{const detail=await action();report.checks.push({name,status:'passed',detail});console.log('PASS '+name)}catch(error){const message=error.stack||String(error);report.checks.push({name,status:'failed',message});report.failures.push({name,message});console.error('FAIL '+name+' '+String(error))}}
function stripStyle(source){
 const styles=[...source.matchAll(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi)];
 assert.equal(styles.length,1,'Exactly one scoped style block is permitted.');
 assert.ok(!/^<style\b[^>]*\bis:global\b/i.test(styles[0][0]),'The component stylesheet stays scoped.');
 return source.replace(styles[0][0],'');
}
const attrs=source=>Object.fromEntries([...source.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]??'']));
function scripts(html){
 return [...html.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi)].map(m=>{
  const attributes=attrs(m[1]),type=(attributes.type||'').toLowerCase();
  return{attributes,executable:!type||type==='module'||/^(?:text|application)\/(?:java|ecma)script$/.test(type),bytes:Buffer.byteLength(m[2]),sha256:sha(m[2])};
 });
}
const oldFiles=new Map(before.files.map(file=>[file.path,file])),newFiles=new Map(files.map(file=>[file.path,file]));
await check('The component frontmatter and HTML bytes outside its scoped style are unchanged',async()=>{
 const data=await readFile(baseline.component),text=data.toString('utf8');
 assert.equal(Buffer.from(text).length,data.length,'The UTF-8 source must round-trip without byte loss.');
 const strippedSha256=sha(stripStyle(text));
 assert.equal(strippedSha256,baseline.componentWithoutStyleSha256);
 assert.notEqual(sha(data),baseline.workingCopyComponentSha256,'The intended style refinement must actually exist.');
 return{path:baseline.component,beforeSha256:baseline.workingCopyComponentSha256,afterSha256:sha(data),unchangedOutsideStyleSha256:strippedSha256};
});
await check('Only the intended package version changed in package.json',async()=>{
 assert.equal(packageData.version,'0.17.2');
 const withoutVersion={...packageData};delete withoutVersion.version;
 assert.equal(sha(JSON.stringify(withoutVersion)),baseline.packageWithoutVersionSha256);
 return{beforeVersion:baseline.packageBeforeVersion,afterVersion:packageData.version,otherKeysUnchanged:true};
});
await check('All other application, catalog, public assets and deployment inputs retain their hashes',async()=>{
 assert.deepEqual(sourceStarted.map(file=>file.path),baseline.files.map(file=>file.path));
 const allowed=new Set([baseline.component,'package.json']);
 for(let index=0;index<sourceStarted.length;index++){
  const old=baseline.files[index],current=sourceStarted[index];
  if(old.sha256!==current.sha256)report.sourceChanges.push({path:current.path,beforeSha256:old.sha256,afterSha256:current.sha256});
 }
 assert.deepEqual(report.sourceChanges.filter(file=>!allowed.has(file.path)),[],'No other app inputs may change.');
 const protectedPaths=['src/components/RegionHero.astro','src/components/JapanJewelryMap.astro','src/styles/global.css','src/data/catalog.json'];
 for(const path of protectedPaths)assert.equal(sourceStarted.find(f=>f.path===path)?.sha256,baseline.files.find(f=>f.path===path)?.sha256);
 return{inputs:sourceStarted.length,unchanged:sourceStarted.length-report.sourceChanges.length,allowedChanges:report.sourceChanges.map(file=>file.path),protectedPaths,unchangedPublicWebp:sourceStarted.filter(file=>file.path.startsWith('public/')&&file.path.endsWith('.webp')).length};
});
await check('Every built HTML script block has identical content, attributes and order',async()=>{
 const htmlFiles=files.filter(file=>file.path.endsWith('.html'));
 assert.deepEqual(htmlFiles.map(file=>file.path),baseline.builtScripts.map(page=>page.path).sort());
 let executable=0,jsonOrOther=0,total=0;
 for(const page of baseline.builtScripts){
  const current=scripts(await readFile('dist/'+page.path,'utf8'));
  assert.deepEqual(current,page.scripts,page.path+' script content/attributes changed.');
  total+=current.length;executable+=current.filter(script=>script.executable).length;jsonOrOther+=current.filter(script=>!script.executable).length;
 }
 return{html:htmlFiles.length,allScriptBlocks:total,executableScriptBlocks:executable,jsonOrOtherBlocks:jsonOrOther};
});
await check('External executable assets and all118 delivered image bytes are unchanged',async()=>{
 const protectedFiles=before.files.filter(file=>/\.(?:[cm]?js|webp)$/.test(file.path));
 assert.deepEqual(files.filter(file=>/\.(?:[cm]?js|webp)$/.test(file.path)).map(file=>file.path),protectedFiles.map(file=>file.path).sort());
 for(const file of protectedFiles)assert.deepEqual(newFiles.get(file.path),file,file.path+' bytes changed.');
 const webp=protectedFiles.filter(file=>file.path.endsWith('.webp')).length;
 assert.equal(webp,118);
 return{webp,externalJavascriptAssets:protectedFiles.length-webp};
});
await check('The only changed stylesheet bundle is RegionSelection',async()=>{
 const key=path=>path.split('/').at(-1).replace(/\.[A-Za-z0-9_-]+\.css$/,'.css');
 const oldCss=new Map(before.files.filter(file=>file.path.endsWith('.css')).map(file=>[key(file.path),file]));
 const newCss=new Map(files.filter(file=>file.path.endsWith('.css')).map(file=>[key(file.path),file]));
 assert.equal(oldCss.size,before.files.filter(file=>file.path.endsWith('.css')).length);
 assert.equal(newCss.size,files.filter(file=>file.path.endsWith('.css')).length);
 assert.deepEqual([...newCss.keys()].sort(),[...oldCss.keys()].sort());
 for(const [name,old] of oldCss){
  const current=newCss.get(name),changed=old.sha256!==current.sha256;
  const detail={bundle:name,changed,before:old,after:current};
  if(changed){
   const saved=baseline.css.find(file=>file.path===old.path);
   try{
    const oldText=await readFile(saved.baselinePath,'utf8'),newText=await readFile('dist/'+current.path,'utf8');
    assert.equal(sha(oldText),old.sha256);
    let firstDifference=0;while(firstDifference<Math.min(oldText.length,newText.length)&&oldText[firstDifference]===newText[firstDifference])firstDifference++;
    detail.firstDifference=firstDifference;detail.beforeExcerpt=oldText.slice(Math.max(0,firstDifference-40),firstDifference+140);detail.afterExcerpt=newText.slice(Math.max(0,firstDifference-40),firstDifference+140);
   }catch(error){if(error.code!=='ENOENT')throw error;detail.excerpts='Optional private old CSS bytes are unavailable; recorded SHA comparison remains complete.'}
  }
  report.cssChanges.push(detail);
 }
 assert.deepEqual(report.cssChanges.filter(file=>file.changed).map(file=>file.bundle),['RegionSelection.css']);
 return{stylesheets:oldCss.size,changed:1,unchanged:oldCss.size-1};
});
await check('Build changes are limited to HTML and the stylesheet filename/content',async()=>{
 const added=files.filter(file=>!oldFiles.has(file.path)),removed=before.files.filter(file=>!newFiles.has(file.path)),changed=files.filter(file=>oldFiles.has(file.path)&&oldFiles.get(file.path).sha256!==file.sha256);
 report.buildChanges={added,removed,changed,unchanged:files.length-added.length-changed.length};
 assert.ok(added.every(file=>file.path.endsWith('.css'))&&removed.every(file=>file.path.endsWith('.css')));
 assert.ok(changed.every(file=>file.path.endsWith('.html')||file.path.endsWith('.css')),'A non-style/non-HTML build artifact changed.');
 assert.equal(manifest.summary.html,before.summary.html);assert.equal(manifest.summary.webp,before.summary.webp);
 return{before:before.summary,after:manifest.summary,added:added.length,removed:removed.length,changedHtml:changed.filter(file=>file.path.endsWith('.html')).length,changedOther:changed.filter(file=>!file.path.endsWith('.html')).length,unchanged:report.buildChanges.unchanged};
});
await check('Inputs and build remained stable throughout the proof',async()=>{
 assert.deepEqual(await inputFiles(),sourceStarted);
 for(const file of files)assert.equal(sha(await readFile('dist/'+file.path)),file.sha256,file.path+' changed during verification.');
 return{sourceInputs:sourceStarted.length,buildFiles:files.length};
});
report.completedAt=new Date().toISOString();report.status=report.failures.length?'failed':'passed';
report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,sourceInputs:sourceStarted.length,buildFiles:files.length};
report.afterBuildManifest={path:manifestPath,sha256:sha(JSON.stringify(manifest,null,2)+'\n')};
for(const path of [reportPath,manifestPath])await mkdir(dirname(path),{recursive:true});
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary,null,2));if(report.failures.length)process.exitCode=1;
