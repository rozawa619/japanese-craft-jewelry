import {readFile,writeFile} from 'node:fs/promises';
import {existsSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {collectEditorialImageErrors} from '../src/lib/editorial-images.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const json=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
const catalog=await json('src/data/catalog.json'),registry=await json('src/data/editorial-images.json'),ledger=await json('docs/assets.json');
const published=catalog.products.filter(product=>product.publishStatus==='published');
const withDist=process.argv.includes('--dist');
const safeImagePath=/^images\/[a-z0-9-]+\.(?:webp|avif|png|jpe?g)$/;
const report={checkedAt:new Date().toISOString(),method:'Local source-file format and intrinsic-dimension inspection, published coverage and asset-ledger consistency. Frozen v0.12 file SHA256 proves the existing reviewed files were retained. Optional --dist also checks active output bytes and retired-file exclusion. No pixel-based ethnicity, nationality, age or attractiveness inference; prompt settings are not observations about real people.',scope:withDist?'source-and-generated-site':'source-only',checks:[],failures:[],warnings:[],files:[],baseline:[],retired:[]};
const check=(name,fn)=>{try{const detail=fn();report.checks.push({name,status:'passed',detail});}catch(error){report.failures.push({name,message:String(error)});report.checks.push({name,status:'failed',message:String(error)});}};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
function dimensions(bytes){
 if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'){
  let offset=12;
  while(offset+8<=bytes.length){
   const type=bytes.subarray(offset,offset+4).toString(),size=bytes.readUInt32LE(offset+4),start=offset+8;
   if(type==='VP8X'&&size>=10)return {format:'webp',width:bytes.readUIntLE(start+4,3)+1,height:bytes.readUIntLE(start+7,3)+1};
   if(type==='VP8 '&&size>=10&&bytes.subarray(start+3,start+6).equals(Buffer.from([0x9d,0x01,0x2a])))return {format:'webp',width:bytes.readUInt16LE(start+6)&0x3fff,height:bytes.readUInt16LE(start+8)&0x3fff};
   if(type==='VP8L'&&size>=5&&bytes[start]===0x2f){const data=bytes.readUInt32LE(start+1);return {format:'webp',width:(data&0x3fff)+1,height:((data>>>14)&0x3fff)+1};}
   offset=start+size+(size%2);
  }
 }
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return {format:'png',width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
 if(bytes[0]===0xff&&bytes[1]===0xd8){
  for(let offset=2;offset+4<bytes.length;){
   if(bytes[offset++]!==0xff)continue;while(bytes[offset]===0xff)offset++;const type=bytes[offset++];
   if(type===0xd9||type===0xda)break;if(type===0x01||type>=0xd0&&type<=0xd7)continue;
   const size=bytes.readUInt16BE(offset);if(size<2||offset+size>bytes.length)break;
   if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(type))return {format:'jpeg',width:bytes.readUInt16BE(offset+5),height:bytes.readUInt16BE(offset+3)};
   offset+=size;
  }
 }
 if(bytes.subarray(4,8).toString()==='ftyp'&&/avif|avis/.test(bytes.subarray(8,40).toString())){const at=bytes.indexOf(Buffer.from('ispe'));if(at>=0&&at+16<=bytes.length)return {format:'avif',width:bytes.readUInt32BE(at+8),height:bytes.readUInt32BE(at+12)};}
 throw new Error('Unsupported or damaged raster image header');
}
check('Every published product has a local styling image and active generation ledger',()=>{
 const errors=collectEditorialImageErrors(registry,catalog.products,ledger.assets);if(errors.length)throw new Error(errors.join('\n'));return {published:published.length,registered:Object.keys(registry).length};
});
for(const path of new Set(Object.values(registry).map(image=>image.path))){
 if(typeof path!=='string'||!safeImagePath.test(path)){report.failures.push({name:'Unsafe local image path',message:String(path)});continue;}
 try{
  const bytes=await readFile(resolve(root,'public',path)),actual=dimensions(bytes),entries=Object.entries(registry).filter(([,image])=>image.path===path),first=entries[0][1];
  check('Intrinsic dimensions and format '+path,()=>{
   if(first.width!==actual.width||first.height!==actual.height)throw new Error('Registry '+first.width+'x'+first.height+' differs from file '+actual.width+'x'+actual.height);
   const ext=path.split('.').at(-1);if(!(actual.format===ext||actual.format==='jpeg'&&['jpg','jpeg'].includes(ext)))throw new Error('Filename does not match encoded format');
   if(entries.some(([,image])=>image.assetId.endsWith('-v13'))){
    const xml=bytes.toString('utf8');
    if(!xml.includes('<Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType>'))throw new Error('New AI image lost IPTC DigitalSourceType XMP');
   }
   if(withDist){const output=resolve(root,'dist',path);if(!existsSync(output)||digest(requireBytes(output))!==digest(bytes))throw new Error('Generated image missing or byte mismatch');}
   return actual;
  });
  if(bytes.length>500000)report.warnings.push({path,bytes:bytes.length,message:'Large styling asset; review transfer size and compress without losing useful detail.'});
  report.files.push({path,productIds:entries.map(([id])=>id),...actual,bytes:bytes.length,sha256:digest(bytes),preserveRatio:first.preserveRatio===true});
 }catch(error){report.failures.push({name:path,message:String(error)});}
}
// Synchronous byte reads are limited to generated files after source inspection.
function requireBytes(path){return readFileSync(path);}
const baselinePath='docs/research/image-baseline-v12.json';
if(existsSync(resolve(root,baselinePath))){
 const baseline=await json(baselinePath);
 for(const old of baseline.files){
  try{
   if(!safeImagePath.test(old.path))throw new Error('Unsafe baseline file path');
   const bytes=await readFile(resolve(root,'public',old.path));const same=digest(bytes)===old.sha256;if(!same)throw new Error('Existing asset was replaced');
   for(const id of old.productIds)if(registry[id]?.path!==old.path)throw new Error('An existing product styling binding was replaced: '+id);
   report.baseline.push({path:old.path,status:'passed',sha256:old.sha256,productBindingsRetained:old.productIds});
  }catch(error){report.failures.push({name:'Preserve existing '+old.path,message:String(error)});report.baseline.push({path:old.path,status:'failed'});}
 }
}else report.failures.push({name:'Preserve existing image files',message:'Frozen v0.12 image baseline missing; preservation is not verified.'});
if(withDist)for(const asset of ledger.assets.filter(asset=>asset.status==='retired'&&asset.localRetiredPath)){
 if(!/^public\/images\/[a-z0-9-]+\.(?:webp|avif|png|jpe?g)$/.test(asset.localRetiredPath)){report.failures.push({name:'Unsafe retired image path',message:String(asset.localRetiredPath)});continue;}
 const path=asset.localRetiredPath.replace(/^public\//,'');const absent=!existsSync(resolve(root,'dist',path));report.retired.push({assetId:asset.id,path,status:absent?'passed':'failed'});if(!absent)report.failures.push({name:'Retired asset exposed '+path});
}
report.completedAt=new Date().toISOString();
report.summary={checks:report.checks.length,passed:report.checks.filter(check=>check.status==='passed').length,failed:report.failures.length,publishedProducts:published.length,registeredProducts:Object.keys(registry).length,uniqueImages:report.files.length,baselineFilesPreserved:report.baseline.filter(file=>file.status==='passed').length,retiredFilesExcluded:report.retired.filter(file=>file.status==='passed').length,totalImageBytes:report.files.reduce((n,file)=>n+file.bytes,0),warnings:report.warnings.length};
await writeFile(resolve(root,process.env.CHECK_IMAGE_REPORT_PATH||'docs/privacy-depth-stage-image-files-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary));for(const failure of report.failures)console.error(failure.name+': '+failure.message);if(report.failures.length)process.exitCode=1;
