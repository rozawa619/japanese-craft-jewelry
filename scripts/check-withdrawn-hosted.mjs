import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const ledger=JSON.parse(await readFile(resolve(root,'docs/assets.json'),'utf8'));
const origin=new URL(process.env.CHECK_BASE_URL||'https://rozawa619.github.io').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/japanese-craft-jewelry/').split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const targets=[];
for(const product of catalog.products.filter(product=>product.publishStatus!=='published')){
 if(!/^[a-z0-9-]+$/.test(product.slug))throw new Error('Unsafe withdrawn slug');
 for(const locale of ['en','ja'])targets.push({kind:'withdrawn-product',productId:product.id,path:base+locale+'/objects/'+product.slug+'/'});
}
for(const asset of ledger.assets.filter(asset=>asset.status==='retired'&&asset.localRetiredPath)){
 if(!/^public\/images\/[a-z0-9-]+\.webp$/.test(asset.localRetiredPath))throw new Error('Unsafe retired public asset');
 targets.push({kind:'retired-image',assetId:asset.id,path:base+asset.localRetiredPath.slice('public/'.length)});
}
const report={checkedAt:new Date().toISOString(),origin,base,method:'Read-only ordinary HTTPS GET after deployment; no query cache bypass. Withdrawn product URLs and retired public image paths must return404. Source history stays in GitHub; this checks the published host.',results:[],summary:{}};
for(let offset=0;offset<targets.length;offset+=4){
 const results=await Promise.all(targets.slice(offset,offset+4).map(async target=>{
  const url=origin+target.path;
  try{const response=await fetch(url,{signal:AbortSignal.timeout(15000),redirect:'follow'});await response.body?.cancel();return {...target,url,httpStatus:response.status,finalUrl:response.url,status:response.status===404?'passed':'failed'}}catch(error){return {...target,url,httpStatus:null,status:'failed',message:String(error)}}
 }));report.results.push(...results);
}
report.completedAt=new Date().toISOString();
report.summary={checks:report.results.length,passed:report.results.filter(item=>item.status==='passed').length,failed:report.results.filter(item=>item.status!=='passed').length,withdrawnRoutes:report.results.filter(item=>item.kind==='withdrawn-product').length,retiredImages:report.results.filter(item=>item.kind==='retired-image').length};
await writeFile(resolve(root,process.env.CHECK_WITHDRAWN_REPORT_PATH||'docs/editorial-stage-hosted-withdrawal-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary));if(report.summary.failed){for(const result of report.results.filter(item=>item.status==='failed'))console.log(JSON.stringify(result));process.exitCode=1}
