import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {existsSync} from 'node:fs';

// Astro pins Sharp in the lockfile; this conversion uses its installed copy.
const require=createRequire(import.meta.url);
const sharp=createRequire(require.resolve('astro/package.json'))('sharp');
export const digitalSourceType='http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia';
const xmp=`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:dc="http://purl.org/dc/elements/1.1/"><Iptc4xmpExt:DigitalSourceType>${digitalSourceType}</Iptc4xmpExt:DigitalSourceType><dc:description><rdf:Alt><rdf:li xml:lang="x-default">AI-generated editorial styling image; not an actual product photograph.</rdf:li></rdf:Alt></dc:description></rdf:Description></rdf:RDF></x:xmpmeta>`;

/** Format conversion only. Keep the untouched generator PNG separately.
 * This XMP declaration is not a signed C2PA credential or a licence claim. */
export async function prepareStylingImage(input,output){
 if(resolve(input)===resolve(output)||!output.endsWith('.webp'))throw new Error('Use a separate .webp output');
 if(existsSync(output))throw new Error('Refusing to overwrite an existing image');
 const source=await sharp(input).metadata();
 if(source.width!==1536||source.height!==1024)throw new Error('Review unexpected generator dimensions before converting');
 await sharp(input).withXmp(xmp).webp({quality:84,effort:6}).toFile(output);
 const actual=await sharp(output).metadata();
 if(actual.width!==source.width||actual.height!==source.height||!actual.xmp?.toString().includes(digitalSourceType))throw new Error('Dimensions or AI XMP lost');
 return {width:actual.width,height:actual.height,format:actual.format,digitalSourceType};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 const [input,output]=process.argv.slice(2);
 if(!input||!output)throw new Error('Usage: node scripts/prepare-styling-image.mjs input.png output.webp');
 console.log(await prepareStylingImage(input,output));
}
