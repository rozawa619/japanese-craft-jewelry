/** Download one manifest-pinned public handoff asset. Never extracts or executes it. */
import {createHash,randomUUID} from 'node:crypto';
import {lookup} from 'node:dns/promises';
import {closeSync,createWriteStream,existsSync,linkSync,lstatSync,mkdirSync,openSync,readFileSync,unlinkSync} from 'node:fs';
import {Agent,request} from 'node:https';
import {dirname,resolve} from 'node:path';
import {Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {checkPublicHttps,createPinnedLookup} from './lib/safe-outbound.ts';
import {assertPlainPath} from './lib/source-export.mjs';
import {assertProjectRuntime} from './check-runtime.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const repository='https://github.com/rozawa619/japanese-craft-jewelry';
const downloadHosts=new Set(['github.com','release-assets.githubusercontent.com']);
const maximumBytes=128*1024*1024;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');

export function validateHandoffManifest(manifest){
 if(manifest?.version!==1||!Array.isArray(manifest.assets)||!manifest.assets.length)throw Error('Invalid handoff asset manifest');
 const tag=manifest.release?.tag;
 if(typeof tag!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(tag)||manifest.release?.url!==repository+'/releases/tag/'+tag)throw Error('Expected a release of this repository');
 const ids=new Set(),names=new Set();
 for(const asset of manifest.assets){
  if(typeof asset.id!=='string'||!/^[a-z0-9][a-z0-9.-]*$/.test(asset.id)||ids.has(asset.id))throw Error('Invalid or duplicate asset id');
  if(typeof asset.name!=='string'||!/^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/.test(asset.name)||/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/.test(asset.name)||names.has(asset.name))throw Error('Invalid or duplicate portable asset filename');
  if(asset.url!==repository+'/releases/download/'+tag+'/'+asset.name)throw Error('Asset URL must match this repository, release and filename');
  if(!Number.isSafeInteger(asset.bytes)||asset.bytes<1||asset.bytes>maximumBytes||typeof asset.sha256!=='string'||!/^[a-f0-9]{64}$/.test(asset.sha256))throw Error('Invalid asset length or SHA256');
  ids.add(asset.id);names.add(asset.name);
 }
 return manifest;
}

function verifyExisting(path,asset){
 assertPlainPath(path);
 const stats=lstatSync(path);
 if(!stats.isFile()||stats.size!==asset.bytes||digest(readFileSync(path))!==asset.sha256)throw Error('Existing destination differs; it was preserved. Rename it before retrying: artifacts/handoff-assets/'+asset.name);
}

async function downloadHandoffAsset(asset){
 const directory=resolve(root,'artifacts/handoff-assets'),destination=resolve(directory,asset.name);
 if(dirname(destination)!==directory)throw Error('Destination must remain in artifacts/handoff-assets');
 assertPlainPath(directory);assertPlainPath(destination);
 if(existsSync(destination)){verifyExisting(destination,asset);return{status:'already-verified',id:asset.id,path:'artifacts/handoff-assets/'+asset.name,bytes:asset.bytes,sha256:asset.sha256};}
 mkdirSync(directory,{recursive:true});assertPlainPath(directory);
 const candidate=resolve(directory,'.'+asset.name+'.candidate-'+randomUUID());
 assertPlainPath(candidate);
 let downloaded=false,bodyCompletion;
 const transferController=new AbortController(),transferTimer=setTimeout(()=>transferController.abort(new DOMException('Handoff asset transfer timed out','TimeoutError')),120000);
 try{
  const result=await checkPublicHttps(asset.url,{
   maxRedirects:5,timeoutMs:60000,
   resolve:async hostname=>{
    if(!downloadHosts.has(hostname))throw Error('Redirect host is outside the handoff download allowlist');
    return lookup(hostname,{all:true,order:'ipv4first'});
   },
   transport:(url,addresses,headerSignal)=>{
    if(!downloadHosts.has(url.hostname))throw Error('Unexpected download host');
    const agent=new Agent({keepAlive:false,maxCachedSessions:0,proxyEnv:{}});
    return new Promise((resolveResponse,reject)=>{
     let bodyActive=false;
     const signal=AbortSignal.any([headerSignal,transferController.signal]);
     const req=request(url,{
      method:'GET',agent,signal,rejectUnauthorized:true,
      lookup:createPinnedLookup(url.hostname,addresses),maxHeaderSize:32*1024,
      headers:{'User-Agent':'JapaneseCraftJewelry-Handoff-Asset/1',Accept:'application/octet-stream','Accept-Encoding':'identity'},
     },response=>{
      try{
      const status=response.statusCode||0,headers={status,location:response.headers.location,contentType:typeof response.headers['content-type']==='string'?response.headers['content-type']:null};
      if(status!==200){response.destroy();agent.destroy();resolveResponse(headers);return;}
      const length=response.headers['content-length'],encoding=response.headers['content-encoding'];
      if(length!==undefined&&Number(length)!==asset.bytes)throw Error('Content length differs from the handoff manifest');
      if(encoding&&encoding!=='identity')throw Error('Unexpected encoded archive response');
      let bytes=0;const hash=createHash('sha256');
      const bounded=new Transform({transform(chunk,_encoding,callback){
       bytes+=chunk.length;
       if(bytes>asset.bytes){callback(Error('Download exceeds manifest byte limit'));return;}
       hash.update(chunk);callback(null,chunk);
      }});
      assertPlainPath(candidate);
      const fd=openSync(candidate,'wx',0o600);let output;
      try{output=createWriteStream(candidate,{fd,autoClose:true});}catch(error){closeSync(fd);throw error;}
      bodyActive=true;
      bodyCompletion=pipeline(response,bounded,output,{signal}).then(()=>{
       if(bytes!==asset.bytes||hash.digest('hex')!==asset.sha256)throw Error('Downloaded asset length or SHA256 differs from the manifest');
       downloaded=true;
      }).finally(()=>agent.destroy());
      // Attach a rejection handler before handing the header result back. The
      // caller awaits this same promise after redirect/DNS validation returns.
      bodyCompletion.catch(()=>{});
      resolveResponse(headers);
      }catch(error){response.destroy();agent.destroy();reject(error);}
     });
     req.once('error',error=>{if(!bodyActive){agent.destroy();reject(error);}});req.end();
    });
   },
  });
  if(result.status!==200||!bodyCompletion)throw Error('GitHub asset download returned HTTP '+result.status);
  await bodyCompletion;if(!downloaded)throw Error('Asset transfer did not finish');
  verifyExisting(candidate,asset);assertPlainPath(destination);assertPlainPath(directory);
  // Hard-link creation is atomic and refuses to replace an existing name. The
  // candidate is on the same filesystem; unlinking it leaves one regular file.
  linkSync(candidate,destination);
  return{status:'downloaded-and-verified',id:asset.id,path:'artifacts/handoff-assets/'+asset.name,bytes:asset.bytes,sha256:asset.sha256};
 }finally{
  clearTimeout(transferTimer);transferController.abort();
  if(existsSync(candidate)){assertPlainPath(candidate);unlinkSync(candidate);}
 }
}

async function main(){
 assertProjectRuntime();
 const args=process.argv.slice(2);
 if(args.length!==1)throw Error('Usage: node scripts/fetch-handoff-asset.mjs --list | <asset-id>');
 const manifestPath=resolve(root,'docs/handoff-assets.json');assertPlainPath(manifestPath);
 const manifest=validateHandoffManifest(JSON.parse(readFileSync(manifestPath,'utf8')));
 if(args[0]==='--list'){
  console.log(JSON.stringify({release:manifest.release.url,assets:manifest.assets.map(asset=>({id:asset.id,bytes:asset.bytes,path:'artifacts/handoff-assets/'+asset.name}))},null,2));return;
 }
 const asset=manifest.assets.find(entry=>entry.id===args[0]);
 if(!asset)throw Error('Unknown asset id; use --list. No URL or filesystem path arguments are accepted.');
 console.log(JSON.stringify(await downloadHandoffAsset(asset),null,2));
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 main().catch(error=>{console.error('Handoff asset: '+error.message);process.exitCode=1;});
}
