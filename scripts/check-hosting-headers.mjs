/** Read-only migration rehearsal. Emulates a compatible static host's _headers
 * on127.0.0.1 only; never builds, deploys or contacts Google. This is NOT an
 * observation that GitHub Pages applies _headers or has these response headers. */
import assert from 'node:assert/strict';
import {createServer,request as httpRequest} from 'node:http';
import {readFile,writeFile,mkdir,readdir,realpath,stat} from 'node:fs/promises';
import {resolve,dirname,relative,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium,expect} from '@playwright/test';
import {reviewedStoreMapEmbeds} from '../src/lib/store-map-embeds.ts';

const root=await realpath(resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const dist=await realpath(resolve(root,'dist'));
assert.ok(dist.startsWith(root+sep),'Resolved build directory must remain inside this repository');
const base='/japanese-craft-jewelry/';
const reportPath=resolve(root,process.env.CHECK_REPORT_PATH||'docs/discovery-map-stage-migration-headers-results.json');
const json=async p=>JSON.parse((await readFile(resolve(root,p),'utf8')).replace(/^\uFEFF/,''));
const sha=b=>createHash('sha256').update(b).digest('hex');
const inputPaths=['public/_headers','astro.config.mjs','src/components/VisitGuide.astro','src/components/MapPreferences.astro','src/lib/map-preferences.ts','src/lib/map-preferences-client.ts','src/lib/map-embed-url.ts','src/lib/store-map-embeds.ts','src/data/catalog.json','src/data/visits.json'];
const inputHashes=async()=>Object.fromEntries(await Promise.all(inputPaths.map(async p=>[p,sha(await readFile(resolve(root,p)))])));
async function outputHashes(){
 const entries=[];
 async function scan(folder){for(const item of await readdir(folder,{withFileTypes:true})){const p=resolve(folder,item.name);if(item.isDirectory())await scan(p);else{assert.ok(item.isFile(),'Only ordinary build files');entries.push([relative(dist,p).split(sep).join('/'),sha(await readFile(p))]);}}}
 await scan(dist);return Object.fromEntries(entries.sort(([a],[b])=>a.localeCompare(b)));
}
const [catalog,visits]=await Promise.all(['src/data/catalog.json','src/data/visits.json'].map(json));
const candidate=visits.products.map(v=>({product:catalog.products.find(p=>p.id===v.productId&&p.publishStatus==='published'),stores:v.storeIds.filter(id=>reviewedStoreMapEmbeds[id])})).find(v=>v.product&&v.stores.length===1);
assert.ok(candidate,'One current product with a reviewed store is needed');
const report={version:'0.17.0',checkedAt:new Date().toISOString(),base,method:'Local compatible-host migration rehearsal: serve unchanged dist through GET-only loopback HTTP with public/_headers applied. Observe real HTTP headers separately from DOM meta CSP. Fresh Chrome checks ancestor-frame denial and JA/EN own-page Google iframe request after explicit permission; all external requests are aborted.',limits:'No production or GitHub response-header configuration changed or certified. No Google tiles/pins/attribution rendering or third-party cookie behavior tested. Not physical-device or universal security/legal certification.',sourceInputs:{started:await inputHashes()},output:{started:await outputHashes()},representative:{productId:candidate.product.id,slug:candidate.product.slug,storeIds:candidate.stores},checks:[],failures:[],expectedPolicyConsole:[],expectedAbortedConsole:[],pageErrors:[],unexpectedConsole:[],externalAttempts:[],httpObservations:[],metaObservations:[]};
await mkdir(dirname(reportPath),{recursive:true});
const flush=()=>writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
async function check(name,fn){try{const detail=await fn();report.checks.push({name,status:'passed',...detail});console.log('PASS '+name);}catch(error){const f={name,status:'failed',message:String(error)};report.checks.push(f);report.failures.push(f);console.error('FAIL '+name+' '+String(error));}await flush();}
const sourceHeaders=await readFile(resolve(root,'public/_headers'),'utf8');
const headers={};let pattern=false;
for(const line of sourceHeaders.split(/\r?\n/)){
 if(!line.trim()||line.trim().startsWith('#'))continue;
 if(line==='/*'){assert.equal(pattern,false,'Only one wildcard rule in this emulator');pattern=true;continue;}
 const entry=/^\s+([A-Za-z0-9-]+):\s*(\S.*)$/.exec(line);
 assert.ok(pattern&&entry,'Unsupported _headers syntax; do not silently emulate it');
 const name=entry[1].toLowerCase();assert.equal(headers[name],undefined,'No duplicate header');headers[name]=entry[2];
}
assert.equal(pattern,true);assert.equal(headers['content-security-policy'],"frame-ancestors 'none'");
assert.equal(headers['x-frame-options'],'DENY');assert.equal(headers['x-content-type-options'],'nosniff');
assert.equal(headers['referrer-policy'],'strict-origin-when-cross-origin');
for(const feature of ['geolocation','camera','microphone','payment','usb'])assert.match(headers['permissions-policy'],new RegExp('(?:^|,\\s*)'+feature+'=\\(\\)'));
assert.doesNotMatch(headers['permissions-policy'],/fullscreen\s*=\s*\(\s*\)/);
assert.equal(headers['cross-origin-embedder-policy'],undefined,'No COEP is added');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
let origin,browser,serverListening=false;
const server=createServer(async(req,res)=>{
 const send=(status,type,body)=>{res.writeHead(status,{...headers,'content-type':type,'content-length':Buffer.byteLength(body)});res.end(body);};
 try{
  if(req.method!=='GET'){res.setHeader('Allow','GET');send(405,'text/plain','Method not allowed');return;}
  const raw=(req.url||'').split('?')[0];let pathname;
  try{pathname=decodeURIComponent(raw);}catch{send(400,'text/plain','Invalid path');return;}
  if(!pathname.startsWith('/')||pathname.includes('\\')||pathname.includes('\0')||pathname.split('/').some(p=>p==='.'||p==='..')){send(400,'text/plain','Invalid path');return;}
  if(pathname==='/__embedding-test'){
   const child=base+'ja/objects/'+candidate.product.slug+'/';
   send(200,mime['.html'],'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Local ancestor-policy test</title><link rel="icon" href="data:,"></head><body><h1>Local embedding test</h1><iframe id="denied-frame" title="Expected denied child" src="'+child+'"></iframe></body></html>');return;
  }
  if(!pathname.startsWith(base)){send(404,'text/plain','Not found');return;}
  const route=pathname.slice(base.length);let target=resolve(dist,route||'index.html');
  if(target!==dist&&!target.startsWith(dist+sep)){send(400,'text/plain','Invalid path');return;}
  if((await stat(target)).isDirectory())target=resolve(target,'index.html');
  const actual=await realpath(target);
  if(!actual.startsWith(dist+sep)||relative(dist,actual)==='_headers'){send(404,'text/plain','Not found');return;}
  const body=await readFile(actual);send(200,mime[extname(actual)]||'application/octet-stream',body);
 }catch(error){if(error?.code==='ENOENT'||error?.code==='ENOTDIR')send(404,'text/plain','Not found');else{console.error('Server failure '+String(error));send(500,'text/plain','Local test server failure');}}
});
const google=value=>{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='www.google.com'&&u.pathname==='/maps/embed';};
async function contextPage(name){
 const context=await browser.newContext({viewport:{width:1280,height:960},serviceWorkers:'block'});
 await context.route('**/*',async route=>{const request=route.request(),u=new URL(request.url());if(u.origin===origin){await route.continue();return;}report.externalAttempts.push({case:name,url:request.url(),resourceType:request.resourceType(),reviewedGoogleEmbed:google(request.url()),action:'aborted'});await route.abort('blockedbyclient');});
 const page=await context.newPage();
 page.on('pageerror',e=>report.pageErrors.push({case:name,message:String(e.stack||e)}));
 page.on('console',m=>{if(m.type()!=='error')return;const entry={case:name,text:m.text(),location:m.location()};if(/frame-ancestors|Refused to frame|Framing .* violates/.test(entry.text)&&name==='ancestor-denial')report.expectedPolicyConsole.push(entry);else if(/net::ERR_(BLOCKED_BY_CLIENT|FAILED|ABORTED)/.test(entry.text))report.expectedAbortedConsole.push(entry);else report.unexpectedConsole.push(entry);});
 return{context,page};
}
try{
 await new Promise((accept,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',accept);});serverListening=true;
 const address=server.address();assert.ok(address&&typeof address==='object');origin='http://127.0.0.1:'+address.port;report.origin=origin;
 await check('local-http-boundary',async()=>{
  const rawGet=path=>new Promise((accept,reject)=>{httpRequest({hostname:'127.0.0.1',port:address.port,path,method:'GET'},r=>{let body='';r.setEncoding('utf8');r.on('data',x=>body+=x);r.on('end',()=>accept({status:r.statusCode,body}));}).on('error',reject).end();});
  const traversal=await rawGet(base+'%2e%2e/%2e%2e/package.json');assert.equal(traversal.status,400);assert.ok(!traversal.body.includes('packageManager'));
  const outside=await fetch(origin+'/package.json');assert.equal(outside.status,404);
  const post=await fetch(origin+base,{method:'POST'});assert.equal(post.status,405);assert.equal(post.headers.get('allow'),'GET');
  assert.equal((await fetch(origin+base+'_headers')).status,404);
  return{listenAddress:address.address,traversal:traversal.status,outside:outside.status,nonGet:post.status,headersFileNotServed:true};
 });
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const locale of ['ja','en'])await check(locale+'-real-http-headers',async()=>{
  const url=origin+base+locale+'/objects/'+candidate.product.slug+'/';const response=await fetch(url);assert.equal(response.status,200);
  const observed=Object.fromEntries(Object.keys(headers).map(name=>[name,response.headers.get(name)]));assert.deepEqual(observed,headers);
  assert.equal(response.headers.get('cross-origin-embedder-policy'),null);assert.match(response.headers.get('content-type'),/^text\/html/);
  const html=await response.text();assert.match(html,/<meta\b[^>]*http-equiv=["']content-security-policy["']/i,'HTML retains independently generated meta CSP');report.httpObservations.push({url,status:response.status,headers:observed,coep:null});return{headerCount:Object.keys(observed).length,bodyBytes:Buffer.byteLength(html)};
 });
 await check('ancestor-denial',async()=>{
  const {context,page}=await contextPage('ancestor-denial');
  try{const response=await page.goto(origin+'/__embedding-test',{waitUntil:'networkidle'});assert.equal(response?.status(),200);await expect.poll(()=>report.expectedPolicyConsole.length,{timeout:10000}).toBeGreaterThan(0);
   const child=await page.locator('#denied-frame').contentFrame();assert.ok(child);assert.equal(await child.locator('[data-inline-map]').count(),0,'Protected app DOM cannot render inside ancestor frame');
   assert.equal(report.externalAttempts.filter(a=>a.case==='ancestor-denial').length,0,'Denied child cannot connect to Google');return{childRendered:false,expectedPolicyErrors:report.expectedPolicyConsole.length};
  }finally{await context.close();}
 });
 for(const locale of ['ja','en'])await check(locale+'-own-page-map-permitted',async()=>{
  const name=locale+'-own-page-map-permitted',{context,page}=await contextPage(name);
  try{const url=origin+base+locale+'/objects/'+candidate.product.slug+'/';const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response?.status(),200);
   assert.equal(await page.locator('iframe[data-inline-map-frame]').count(),0);assert.equal(report.externalAttempts.filter(a=>a.case===name).length,0);
   const meta=await page.locator('meta[http-equiv="Content-Security-Policy" i]').getAttribute('content');assert.ok(meta);assert.match(meta,/frame-src https:\/\/www\.google\.com/);assert.match(meta,/script-src[^;]*sha256-/);assert.match(meta,/connect-src 'none'/);report.metaObservations.push({locale,url,content:meta,httpFrameAncestors:response.headers()['content-security-policy']});
   await page.locator('[data-load-map]').first().click();const frame=page.locator('iframe[data-inline-map-frame]').first();await expect(frame).toBeAttached();await frame.scrollIntoViewIfNeeded();await expect.poll(()=>report.externalAttempts.filter(a=>a.case===name&&a.reviewedGoogleEmbed&&a.resourceType==='document').length,{timeout:15000}).toBeGreaterThan(0);
   assert.equal(await frame.getAttribute('src'),reviewedStoreMapEmbeds[candidate.stores[0]][locale]);assert.notEqual(await frame.getAttribute('allowfullscreen'),null);
   const attempts=report.externalAttempts.filter(a=>a.case===name);assert.ok(attempts.every(a=>a.reviewedGoogleEmbed));
   await page.locator('[data-close-map]').first().click();await expect(page.locator('iframe[data-inline-map-frame]')).toHaveCount(0);
   return{initialGoogleRequests:0,explicitGoogleDocumentAttempts:attempts.length,allExternalRequestsAborted:true,metaAndHttpPoliciesCoexist:true,allFramesRemovedOnRevocation:true};
  }finally{await context.close();}
 });
 await check('application-errors-isolated-from-expected-refusals',async()=>{assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.unexpectedConsole,[]);assert.ok(report.expectedPolicyConsole.length>0);assert.ok(report.externalAttempts.every(a=>a.reviewedGoogleEmbed&&a.action==='aborted'));return{pageErrors:0,unexpectedConsole:0,expectedAncestorPolicyErrors:report.expectedPolicyConsole.length,expectedAbortedGoogleConsole:report.expectedAbortedConsole.length};});
}catch(error){const failure={name:'harness',status:'failed',message:String(error.stack||error)};report.checks.push(failure);report.failures.push(failure);console.error(failure.message);
}finally{
 if(browser)await browser.close();
 if(serverListening){server.closeIdleConnections();await new Promise((accept,reject)=>server.close(error=>error?reject(error):accept()));}
 report.sourceInputs.finished=await inputHashes();report.output.finished=await outputHashes();
 try{assert.deepEqual(report.sourceInputs.finished,report.sourceInputs.started);assert.deepEqual(report.output.finished,report.output.started);report.sourceInputsUnchanged=true;report.outputUnchanged=true;}catch(error){const failure={name:'stable-input-output',status:'failed',message:String(error)};report.failures.push(failure);report.checks.push(failure);}
 report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,httpHeaderResponses:report.httpObservations.length,metaCspPages:report.metaObservations.length,expectedAncestorPolicyErrors:report.expectedPolicyConsole.length,abortedGoogleEmbedAttempts:report.externalAttempts.filter(a=>a.reviewedGoogleEmbed).length,applicationPageErrors:report.pageErrors.length,unexpectedConsoleErrors:report.unexpectedConsole.length,inputFilesChecked:inputPaths.length,distFilesChecked:Object.keys(report.output.started).length,sourceInputsUnchanged:report.sourceInputsUnchanged===true,outputUnchanged:report.outputUnchanged===true,serverClosed:!server.listening,browserClosed:!browser?.isConnected()};await flush();console.log(JSON.stringify(report.summary,null,2));
 if(report.failures.length)process.exitCode=1;
}
