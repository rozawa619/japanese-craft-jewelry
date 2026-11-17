/** Active maintainer-document links and commands only; historical research and
 * release reports are retained as evidence, not silently rewritten or fetched. */
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const active=['README.md','AGENTS.md','src/README.md','src/data/README.md','docs/README.md','docs/setup.md','docs/handoff.md','docs/ai-handoff.md','docs/architecture.md','docs/editing-guide.md','docs/verification-guide.md','docs/verification.md','docs/operations.md','docs/national-expansion-v16.md','docs/research/national-expansion-east-2026-11-17.md','docs/research/national-expansion-west-2026-11-17.md','docs/legal-review-v17.md','docs/remaining-task-audit-v17.md','docs/commercial-host-migration-v17.md','docs/japan-map-v17.md','docs/pre-application-checklist.md','docs/affiliate-readiness.md',...['017-maintainer-handoff','018-national-jewelry-expansion','019-geographic-discovery-map-privacy'].flatMap(spec=>['spec','plan','tasks','validation'].map(name=>'specs/'+spec+'/'+name+'.md'))];
const report={checkedAt:new Date().toISOString(),method:'Read-only local link, Markdown heading/fragment and pnpm/node-script reference checks on active maintainer documents. External URLs are counted, not requested. Legacy operations after its explicit marker and historical research/report prose are not treated as the current runbook.',files:[],errors:[],localLinks:0,anchors:0,externalLinks:0,commands:0,scriptPaths:0};
active.push('docs/japan-map-direct-v18.md',...['spec','plan','tasks','validation'].map(name=>'specs/020-direct-region-map/'+name+'.md'));
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const builtins=new Set(['install','exec','audit','run','help','add','remove','update','list','why']);
const contentCache=new Map();
const read=async path=>{if(!contentCache.has(path))contentCache.set(path,await readFile(path,'utf8'));return contentCache.get(path)};
function prose(markdown){
 let fence=null;const lines=[];
 for(const line of markdown.split(/\r?\n/)){
  const marker=/^\s*(`{3,}|~{3,})/.exec(line)?.[1];
  if(marker){if(!fence)fence=marker;else if(marker[0]===fence[0]&&marker.length>=fence.length)fence=null;continue}
  if(!fence)lines.push(line);
 }
 return lines.join('\n');
}
const slug=text=>text.replace(/<[^>]*>/g,'').replace(/[`*]/g,'').toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s_-]/gu,'').replace(/\s/g,'-');
function commands(markdown){
 let fence=null;const lines=[];
 for(const line of markdown.split(/\r?\n/)){
  const marker=/^\s*(`{3,}|~{3,})/.exec(line)?.[1];
  if(marker){if(!fence)fence=marker;else if(marker[0]===fence[0]&&marker.length>=fence.length)fence=null;continue}
  if(fence)lines.push(line);
  else{
   for(const match of line.matchAll(/`([^`]+)`/g))lines.push(match[1]);
   if(/^\|?\s*pnpm\s/.test(line))lines.push(line);
  }
 }
 return lines.join('\n');
}
function headingIds(markdown){
 const ids=new Set(),seen=new Map();
 for(const line of prose(markdown).split('\n')){
  const heading=/^#{1,6}\s+(.+?)(?:\s+#+)?$/.exec(line);
  if(!heading)continue;
  const base=slug(heading[1]),count=seen.get(base)||0;seen.set(base,count+1);ids.add(base+(count?'-'+count:''));
 }
 for(const match of markdown.matchAll(/\bid=["']([^"']+)["']/g))ids.add(match[1]);
 return ids;
}
for(const file of active){
 try{
  const text=(await read(resolve(root,file))).split('<!-- LEGACY-HISTORY:')[0],body=prose(text);
  report.files.push(file);
  for(const match of body.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|[^)\n]+)\)/g)){
   const raw=match[1].startsWith('<')?match[1].slice(1,-1):match[1].trim().split(/\s+["']/)[0];
   if(/^[a-z][a-z0-9+.-]*:/i.test(raw)||raw.startsWith('//')){report.externalLinks++;continue}
   let decoded;try{decoded=decodeURIComponent(raw)}catch{throw Error('Invalid encoded link '+raw)}
   const [part,fragment]=decoded.split('#'),target=part?resolve(dirname(resolve(root,file)),part):resolve(root,file);
   if(target!==root&&!target.startsWith(root+sep))throw Error('Source-independent docs must not require outside files: '+raw);
   const rel=relative(root,target).split(sep).join('/');
   if(/^(?:artifacts|dist|\.astro|node_modules|\.git)(?:\/|$)/.test(rel))throw Error('Private/derived link is not portable; use a plain evidence path: '+raw);
   const info=await stat(target);report.localLinks++;
   if(fragment&&info.isFile()&&target.endsWith('.md')){
    if(!/^L\d+(?:-L\d+)?$/.test(fragment)&&!headingIds(await read(target)).has(fragment))throw Error('Missing Markdown heading #'+fragment+' in '+rel);
    report.anchors++;
   }
  }
  for(const match of commands(text).matchAll(/\bpnpm\s+([a-z][a-z0-9:-]*)/g)){
   const command=match[1];if(!builtins.has(command)&&!Object.hasOwn(pkg.scripts,command))throw Error('Unknown pnpm command '+command);
   report.commands++;
  }
  for(const match of text.matchAll(/\b(?:node|(?:-File))\s+(scripts\/[a-zA-Z0-9_./-]+\.(?:mjs|ts|ps1))/g)){
   await stat(resolve(root,match[1]));report.scriptPaths++;
  }
 }catch(error){report.errors.push({file,message:String(error)})}
}
const catalog=JSON.parse(await read(resolve(root,'src/data/catalog.json')));
report.snapshot={packageVersion:pkg.version,nodeRequirement:pkg.engines.node,pnpm:pkg.packageManager,publishedProducts:catalog.products.filter(p=>p.publishStatus==='published').length,catalogProducts:catalog.products.length};
report.status=report.errors.length?'failed':'passed';report.summary={files:report.files.length,localLinks:report.localLinks,anchors:report.anchors,externalLinksUnchecked:report.externalLinks,pnpmReferences:report.commands,nodeScriptReferences:report.scriptPaths,errors:report.errors.length};
const reportPath=resolve(root,process.env.CHECK_DOC_REPORT_PATH||'artifacts/checks/documentation.json');
await mkdir(dirname(reportPath),{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(report.summary);for(const error of report.errors)console.error(error.file+': '+error.message);if(report.errors.length)process.exitCode=1;
