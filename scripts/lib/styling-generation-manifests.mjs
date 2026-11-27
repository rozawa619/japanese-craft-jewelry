import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const japaneseStylingManifestPath='docs/image-generation-japanese-v23.json';
const manifests=[
 {path:'docs/image-generation-v9.json',key:'assets',required:true},
 {path:'docs/image-generation-v13.json',key:'images',required:true},
 {path:'docs/image-generation-v16.json',key:'images',required:true},
 {path:japaneseStylingManifestPath,key:'images',required:false},
 {path:'docs/image-generation-styling-v25.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v26.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v27.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v35.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v36.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v37.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v38.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v39.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v40.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v41.json',key:'images',required:false},
 {path:'docs/image-generation-styling-v42.json',key:'images',required:false},
];
const publicImage=/^public\/images\/[a-z0-9-]+\.webp$/;

/** Recorded fictional settings only. Never infer nationality, age or beauty from pixels. */
export function recordedStylingModel(record){
 const explicit=record.model?.fictionalNationality;
 const nationality=typeof explicit==='string'?explicit:/\bJapanese\s+(?:(?:adult|female)\s+)?woman\b/i.test(record.prompt||'')?'Japanese':null;
 const ages=Number.isInteger(record.model?.age)?[record.model.age]:typeof record.modelAgeDirection==='string'?[...record.modelAgeDirection.matchAll(/\b\d{2}\b/g)].map(match=>Number(match[0])):[];
 return{fictionalNationality:nationality,ages,style:record.model?.style||null,evidence:explicit?'explicit-model-setting':'explicit-person-prompt'};
}

/** Keep historical logs intact; exact asset/path identifies the active generation. */
export function loadStylingGenerationManifests(root,{requireJapaneseManifest=false}={}){
 const loaded=[],records=[],byAssetId=new Map();
 for(const item of manifests){
  const file=resolve(root,item.path);
  if(!existsSync(file)){
   if(item.required||requireJapaneseManifest&&item.path===japaneseStylingManifestPath)throw Error('Required styling generation manifest missing: '+item.path);
   continue;
  }
  const manifest=JSON.parse(readFileSync(file,'utf8')),items=manifest[item.key];
  if(!Array.isArray(items))throw Error('Expected styling generation array '+item.path+'#/'+item.key);
  loaded.push({path:item.path,records:items.length});
  for(const[index,raw]of items.entries()){
   const publicPath=raw.publicPath||raw.file;
   if(typeof raw.assetId!=='string'||!raw.assetId||typeof publicPath!=='string'||!publicImage.test(publicPath)||typeof raw.prompt!=='string'||!raw.prompt.trim()||!/^[a-f0-9]{64}$/.test(raw.sha256||''))throw Error('Incomplete generation record '+item.path+'#/'+item.key+'/'+index);
   if(byAssetId.has(raw.assetId))throw Error('Ambiguous styling asset across generation logs: '+raw.assetId);
   const productIds=Array.isArray(raw.productIds)?raw.productIds:raw.productId?[raw.productId]:[];
   if(!productIds.length||productIds.some(id=>typeof id!=='string'||!/^[a-z0-9-]+$/.test(id)))throw Error('Invalid generation product IDs '+raw.assetId);
   const entry={manifestPath:item.path,jsonPointer:'/'+item.key+'/'+index,publicPath,productIds,record:raw,model:recordedStylingModel(raw)};
   records.push(entry);byAssetId.set(raw.assetId,entry);
  }
 }
 return{manifests:loaded,records,byAssetId};
}
