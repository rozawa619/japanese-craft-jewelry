import {cpSync,existsSync,mkdirSync,readdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const delivery=resolve(root,'..','ito-craft-delivery');
const source=resolve(delivery,'source');
if(!source.startsWith(delivery)) throw new Error('Unsafe destination');
mkdirSync(source,{recursive:true});
const skip=new Set(['node_modules','dist','.git','.astro','artifacts','test-results','playwright-report','.env','.env.local','.env.production','.env.production.local']);
for(const entry of readdirSync(root)) {
 if(skip.has(entry)||entry.endsWith('.log')||(entry.startsWith('.env')&&entry!=='.env.example'))continue;
 cpSync(resolve(root,entry),resolve(source,entry),{recursive:true});
}
const evidence=resolve(delivery,'screenshots');
mkdirSync(evidence,{recursive:true});
for(const entry of ['desktop-home.png','mobile-home.png','desktop-objects.png','mobile-product.png']){
 const image=resolve(root,'artifacts',entry);if(existsSync(image))cpSync(image,resolve(evidence,entry));
}
console.log('Source exported without dependencies, build output, test fixtures or secrets:',source);