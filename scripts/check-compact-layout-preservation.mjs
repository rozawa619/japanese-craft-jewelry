/** Verify022 UI scope against the committed021 source chain, without rebuilding. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const json=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const baselinePath='docs/compact-layout-stage-source-baseline.json';
const expectedBaseline='c0d15ad03a424c53ff4c3e2a5a843f7c4865339509d41e2ce175846b4081ac7a';
const baselineBytes=fs.readFileSync(baselinePath);assert.equal(digest(baselineBytes),expectedBaseline);
const baseline=JSON.parse(baselineBytes),before=json('docs/compact-layout-stage-before-build-manifest.json');
const report={checkedAt:new Date().toISOString(),method:'Pinned source baseline chains from021 proof and committed0.17.2. Only the two map/hero UI components and package version may change. Verify original photo bytes and full route set, and record actual generated differences without assuming every script is unchanged.',baseline:{path:baselinePath,sha256:expectedBaseline,commit:baseline.commit},checks:[],failures:[]};
const run=(name,action)=>{try{report.checks.push({name,status:'passed',detail:action()});}catch(error){report.failures.push({name,message:error.stack});report.checks.push({name,status:'failed'});}};
const allowed=new Set(['src/components/JapanJewelryMap.astro','src/components/RegionHero.astro','package.json']);
const started=new Map(baseline.files.map(f=>[f.path,digest(fs.readFileSync(f.path))]));
run('Only two intended UI components and package version change',()=>{const changed=baseline.files.filter(f=>started.get(f.path)!==f.sha256).map(f=>f.path);assert.deepEqual([...changed].sort(),[...allowed].sort());for(const f of baseline.files)if(!allowed.has(f.path))assert.equal(started.get(f.path),f.sha256,f.path);return{inputs:baseline.files.length,changed,unchanged:baseline.files.length-changed.length};});
run('Hero frontmatter, HTML and JavaScript are byte-identical outside style',()=>{const text=fs.readFileSync('src/components/RegionHero.astro','utf8'),hash=digest(text.replace(/<style>[\s\S]*?<\/style>/g,''));assert.equal(hash,baseline.heroWithoutStyleSha256);return{sha256:hash};});
run('Version changes without dependency or script configuration changes',()=>{const{version,...rest}=json('package.json');assert.equal(version,'0.17.3');assert.equal(digest(JSON.stringify(rest)),baseline.packageWithoutVersionSha256);return{version};});
const files=[];function walk(dir,prefix=''){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(item.isDirectory())walk(dir+'/'+item.name,prefix+item.name+'/');else{const bytes=fs.readFileSync(dir+'/'+item.name);files.push({path:prefix+item.name,bytes:bytes.length,sha256:digest(bytes)});}}}walk('dist');files.sort((a,b)=>a.path.localeCompare(b.path));
run('All published images retain their original bytes',()=>{const images=before.files.filter(f=>f.path.endsWith('.webp'));assert.equal(images.length,118);for(const image of images)assert.equal(files.find(f=>f.path===image.path)?.sha256,image.sha256,image.path);return{images:images.length};});
run('HTML routes stay identical and no new empty region is created',()=>{const names=list=>list.filter(f=>f.path.endsWith('.html')).map(f=>f.path).sort();assert.deepEqual(names(files),names(before.files));return{htmlPages:names(files).length};});
run('Inputs remain stable throughout this read-only proof',()=>{for(const[path,hash]of started)assert.equal(digest(fs.readFileSync(path)),hash,path);return{sourceHashes:started.size};});
report.outputChanges={changed:files.filter(f=>before.files.some(b=>b.path===f.path&&b.sha256!==f.sha256)).map(f=>f.path),added:files.filter(f=>!before.files.some(b=>b.path===f.path)).map(f=>f.path),removed:before.files.filter(b=>!files.some(f=>f.path===b.path)).map(f=>f.path)};
report.completedAt=new Date().toISOString();report.status=report.failures.length?'failed':'passed';report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,sourceInputs:started.size,outputFiles:files.length};
fs.writeFileSync('docs/compact-layout-stage-preservation-results.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('docs/compact-layout-stage-build-manifest.json',JSON.stringify({version:'0.17.3',recordedAt:new Date().toISOString(),summary:{files:files.length,html:files.filter(f=>f.path.endsWith('.html')).length,webp:files.filter(f=>f.path.endsWith('.webp')).length},files},null,2)+'\n');console.log(report.summary);if(report.failures.length){console.error(report.failures);process.exitCode=1;}
