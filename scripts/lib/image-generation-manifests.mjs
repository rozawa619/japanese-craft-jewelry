import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';

// Keep past generation logs immutable. A later release adds a separate log,
// while the combined records must still describe each active detail image once.
const soloManifests=[
 {path:'docs/image-generation-solo-v14.json',required:true},
 {path:'docs/image-generation-solo-v16.json',required:false},
 {path:'docs/image-generation-solo-v25.json',required:false},
 {path:'docs/image-generation-solo-v27.json',required:false},
 {path:'docs/image-generation-solo-v35.json',required:false},
 {path:'docs/image-generation-solo-v36.json',required:false},
 {path:'docs/image-generation-solo-v37.json',required:false},
 {path:'docs/image-generation-solo-v38.json',required:false},
 {path:'docs/image-generation-solo-v39.json',required:false},
 {path:'docs/image-generation-solo-v40.json',required:false},
 {path:'docs/image-generation-solo-v41.json',required:false},
];
export const trainedAlgorithmicMedia='http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia';

/** Load reviewed solo records; missing optional releases cannot supply images. */
export function loadSoloGenerationManifests(root){
 const manifests=[],records=[],byProductId=new Map();
 for(const entry of soloManifests){
  const file=resolve(root,entry.path);
  if(!existsSync(file)){
   if(entry.required)throw Error('Required generation manifest missing: '+entry.path);
   continue;
  }
  const manifest=JSON.parse(readFileSync(file,'utf8'));
  if(!manifest||typeof manifest!=='object'||!Array.isArray(manifest.images))throw Error('Generation manifest needs an images array: '+entry.path);
  manifests.push({path:entry.path,images:manifest.images.length});
  const productsInManifest=new Set();
  for(const record of manifest.images){
   if(!record||typeof record!=='object'||typeof record.productId!=='string'||!/^[a-z0-9-]+$/.test(record.productId))throw Error('Invalid generation product ID: '+entry.path);
   if(typeof record.assetId!=='string'||!record.assetId.trim()||typeof record.publicPath!=='string'||!/^public\/images\/solo-[a-z0-9-]+-v\d+\.webp$/.test(record.publicPath)||typeof record.sha256!=='string'||!/^[a-f0-9]{64}$/.test(record.sha256))throw Error('Incomplete reviewed generation record: '+entry.path+'/'+record.productId);
   const previous=byProductId.get(record.productId);
   const hasReplacement=Object.hasOwn(record,'supersedes');
   if(productsInManifest.has(record.productId)||previous&&!hasReplacement)throw Error('Duplicate generation product ID: '+record.productId);
   if(hasReplacement){
    const replaced=record.supersedes;
    if(!previous||!replaced||replaced.assetId!==previous.assetId||replaced.publicPath!==previous.publicPath||replaced.sha256!==previous.sha256||record.assetId===previous.assetId||record.publicPath===previous.publicPath||record.sha256===previous.sha256){
     throw Error('Invalid generation replacement for '+record.productId);
    }
   }
   productsInManifest.add(record.productId);
   byProductId.set(record.productId,record);records.push(record);
  }
 }
 return {manifests,records,byProductId};
}
