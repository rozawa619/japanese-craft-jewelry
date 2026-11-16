import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {catalogSchema} from '../src/lib/schema.ts';
import {collectVisitValidationErrors} from '../src/lib/visits.ts';

export function validateVisits(root=fileURLToPath(new URL('../',import.meta.url))){
 const read=(path:string)=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
 const catalog=catalogSchema.parse(read('src/data/catalog.json'));
 const data=read('src/data/visits.json');
 const errors=collectVisitValidationErrors(data,catalog,read('docs/research/sources.json'));
 if(errors.length)throw new Error(errors.join('\n'));
 return {products:data.products.length,stores:data.stores.length};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{const result=validateVisits();console.log('PASS official/visit information: '+result.products+' products, '+result.stores+' source-checked stores; fixed Google Maps URLs, no embeds.')}catch(error){console.error(error instanceof Error?error.message:String(error));process.exitCode=1}
}
