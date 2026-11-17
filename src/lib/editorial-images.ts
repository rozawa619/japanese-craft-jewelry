import registry from '../data/editorial-images.json' with {type:'json'};
import type {Locale} from './i18n';

export interface EditorialImage {
  assetId: string;
  path: string;
  width: number;
  height: number;
  preserveRatio?: boolean;
  alt: Record<Locale,string>;
}

type ProductIdentity={id:string;publishStatus:string};
type AssetIdentity={id:string;source?:unknown;productImage?:unknown;status?:unknown;rightsHolder?:unknown;permissionBasis?:unknown};
const localImagePath=/^images\/[a-z0-9-]+\.(?:webp|avif|png|jpe?g)$/;
const nonempty=(value:unknown):value is string=>typeof value==='string'&&!!value.trim();

/** Image coverage and rights bookkeeping do not establish what an image depicts. */
export function collectEditorialImageErrors(input:unknown,products:readonly ProductIdentity[],assets:readonly AssetIdentity[],requireAllPublished=true):string[]{
 if(!input||typeof input!=='object'||Array.isArray(input))return ['editorial-images: a product-keyed registry is required'];
 const errors:string[]=[],published=new Set(products.filter(product=>product.publishStatus==='published').map(product=>product.id));
 const records=input as Record<string,unknown>,paths=new Map<string,{assetId:unknown;width:unknown;height:unknown}>();
 for(const [productId,value]of Object.entries(records)){
  if(!published.has(productId))errors.push('editorial-images: only published products can use active styling images: '+productId);
  if(!value||typeof value!=='object'||Array.isArray(value)){errors.push('editorial-images: invalid image entry: '+productId);continue;}
  const image=value as Record<string,unknown>;
  if(!nonempty(image.assetId))errors.push('editorial-images: assetId required: '+productId);
  if(typeof image.path!=='string'||!localImagePath.test(image.path))errors.push('editorial-images: reviewed local image path required: '+productId);
  for(const key of ['width','height']){const value=image[key];if(typeof value!=='number'||!Number.isSafeInteger(value)||value<=0)errors.push('editorial-images: positive integer '+key+' required: '+productId);}
  if(image.preserveRatio!==undefined&&typeof image.preserveRatio!=='boolean')errors.push('editorial-images: preserveRatio must be boolean: '+productId);
  const alt=image.alt;
  if(!alt||typeof alt!=='object'||Array.isArray(alt))errors.push('editorial-images: localized alt text required: '+productId);
  else for(const locale of ['en','ja'])if(!nonempty((alt as Record<string,unknown>)[locale]))errors.push('editorial-images: nonempty '+locale+' alt text required: '+productId);
  const asset=assets.find(asset=>asset.id===image.assetId);
  if(!asset)errors.push('editorial-images: missing asset ledger entry: '+productId);
  else{
   if(asset.status!=='active'||asset.productImage!==false)errors.push('editorial-images: an active styling-only ledger entry is required: '+productId);
   if(asset.source!=='public/'+image.path)errors.push('editorial-images: registry and ledger paths differ: '+productId);
   if(!nonempty(asset.rightsHolder)||!nonempty(asset.permissionBasis))errors.push('editorial-images: rights holder and generation basis required: '+productId);
  }
  if(typeof image.path==='string'){
   const previous=paths.get(image.path);
   if(previous&&(previous.assetId!==image.assetId||previous.width!==image.width||previous.height!==image.height))errors.push('editorial-images: shared file has conflicting metadata: '+productId);
   paths.set(image.path,{assetId:image.assetId,width:image.width,height:image.height});
  }
 }
 if(requireAllPublished)for(const productId of published)if(!Object.hasOwn(records,productId))errors.push('editorial-images: published product needs a styling image: '+productId);
 return errors;
}

/** Styling imagery is tied to a stable product ID, separately from verified product facts. */
export function productImageFor(productId: string): EditorialImage | undefined {
  const image=Object.hasOwn(registry,productId)?(registry as Record<string,EditorialImage>)[productId]:undefined;
  if (!image) return undefined;
  if (!localImagePath.test(image.path)) {
    throw new Error(`Product styling image must use a local, reviewed asset: ${productId}`);
  }
  return image;
}
