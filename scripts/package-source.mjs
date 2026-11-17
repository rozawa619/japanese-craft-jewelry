import {cpSync,existsSync,mkdirSync,readdirSync,renameSync,readFileSync} from 'node:fs';
import {dirname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const workspace=resolve(root,'..');
const delivery=resolve(workspace,'japanese-craft-jewelry-delivery');
const source=resolve(delivery,'source');
if(!source.startsWith(delivery+sep)||!delivery.startsWith(workspace+sep)||dirname(source)!==delivery)throw new Error('Unsafe export destination');
mkdirSync(delivery,{recursive:true});
if(existsSync(source)){
 const backup=resolve(delivery,'source-backup-'+Date.now());
 if(!backup.startsWith(delivery+sep))throw new Error('Unsafe export backup');
 renameSync(source,backup);
}
mkdirSync(source,{recursive:true});
const retiredLocalPaths=new Set(JSON.parse(readFileSync(resolve(root,'docs/assets.json'),'utf8')).assets.flatMap(asset=>asset.status==='retired'&&typeof asset.localRetiredPath==='string'&&/^public\/images\/[a-z0-9-]+\.webp$/.test(asset.localRetiredPath)?[resolve(root,asset.localRetiredPath)]:[]));
const skip=new Set(['node_modules','dist','.git','.astro','artifacts','test-results','playwright-report']);
for(const entry of readdirSync(root)){
 if(skip.has(entry)||entry.endsWith('.log')||(entry.startsWith('.env')&&entry!=='.env.example'))continue;
 cpSync(resolve(root,entry),resolve(source,entry),{recursive:true,filter:sourcePath=>!retiredLocalPaths.has(sourcePath)});
}
const evidence=resolve(delivery,'screenshots',JSON.parse(readFileSync(resolve(root,'package.json'),'utf8')).version);
mkdirSync(evidence,{recursive:true});
const artifacts=resolve(root,'artifacts');
for(const entry of (existsSync(artifacts)?readdirSync(artifacts):[]).filter(entry=>entry.startsWith('privacy-depth-stage-')&&!entry.includes('-pre-polish-')&&/\.(?:png|json)$/.test(entry))){
 const image=resolve(artifacts,entry);if(existsSync(image))cpSync(image,resolve(evidence,entry));
}
console.log('Current source exported; any previous export was preserved as a backup:',source);
