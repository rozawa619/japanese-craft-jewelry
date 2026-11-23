import {z} from 'zod';
import raw from '../data/purchase-evidence.json' with {type:'json'};
import type {Catalog} from './schema.ts';
import type {Visits} from './visits.ts';
import {safeHttps,isAllowedDestination} from './affiliate.ts';
const id=z.string().regex(/^[a-z0-9-]+$/);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{const stamp=Date.parse(value+'T00:00:00Z');return Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)===value});
const listingLabel=z.string().trim().min(1);
export const purchaseEvidenceSchema=z.object({products:z.array(z.object({
 productId:id,checkedAt:date,kind:z.enum(['online-order','retail-and-catalog']),linkId:id,storeIds:z.array(id),sourceIds:z.array(id).min(1),
 listingSelection:z.object({sourceId:id,label:z.object({ja:listingLabel,en:listingLabel}).strict()}).strict().optional(),
}).strict())}).strict();
export type PurchaseEvidence=z.infer<typeof purchaseEvidenceSchema>;
export const purchaseEvidence=purchaseEvidenceSchema.parse(raw);
export function purchaseEvidenceFor(productId:string){
 const record=purchaseEvidence.products.find(record=>record.productId===productId);
 if(!record)throw new Error('Published jewelry needs a verified purchase route: '+productId);
 return record;
}
type EvidenceCatalog=Pick<Catalog,'products'|'links'|'merchants'>;
type EvidenceSources=readonly {id:string;url:string;access?:unknown}[];
function samePage(first:string,second:string){
 try{
  const normalize=(value:string)=>{const url=new URL(value);for(const key of [...url.searchParams.keys()])if(/^utm_/i.test(key)||['currency','_pos','_sid','_ss'].includes(key))url.searchParams.delete(key);url.searchParams.sort();return {origin:url.origin,path:url.pathname.replace(/\/$/,''),search:url.search,hash:url.hash}};
  const a=normalize(first),b=normalize(second);
  return a.origin===b.origin&&a.path===b.path&&a.search===b.search&&a.hash===b.hash;
 }catch{return false}
}
/** A website or price alone is insufficient. The observed route is recorded
 * by research, then constrained to this product and a verified source/store. */
export function collectPurchaseEvidenceErrors(input:unknown,catalog:EvidenceCatalog,visits:Visits,sources:EvidenceSources){
 const parsed=purchaseEvidenceSchema.safeParse(input);
 if(!parsed.success)return parsed.error.issues.map(issue=>'purchase-evidence.'+issue.path.join('.')+': '+issue.message);
 const errors:string[]=[],seen=new Set<string>();
 const published=catalog.products.filter(product=>product.publishStatus==='published');
 for(const record of parsed.data.products){
  if(seen.has(record.productId))errors.push('Duplicate purchase evidence: '+record.productId);seen.add(record.productId);
  const product=published.find(product=>product.id===record.productId);
  if(!product){errors.push('Purchase evidence must reference a published product: '+record.productId);continue}
  if(product.availability==='out_of_stock')errors.push('Explicitly unavailable jewelry must not pass the purchase gate: '+record.productId);
  const link=catalog.links.find(link=>link.id===record.linkId&&link.productId===product.id);
  const merchant=catalog.merchants.find(merchant=>merchant.id===link?.merchantId);
  const home=safeHttps(merchant?.url);
  const official=home&&link?isAllowedDestination(link.officialProductUrl,[new URL(home).hostname]):null;
  if(!official)errors.push('Purchase evidence needs this product’s valid official merchant link: '+record.productId);
  if(official&&record.kind==='online-order'){
   const page=new URL(official);
   const queryProduct=['pid','id','item_id','itemcode','product_id','productId'].some(key=>!!page.searchParams.get(key));
   const rootLike=/^\/(?:index\.(?:html?|php))?$/i.test(page.pathname);
   const listing=/^\/(?:about|gallery|company|contact|shop-list|catalog|collections|view\/category)(?:\/|\.|$)/i.test(page.pathname);
   const specificShopify=/\/products\/[^/]+\/?$/i.test(page.pathname);
   if((rootLike&&!queryProduct)||(listing&&!specificShopify))errors.push('An online order route needs a specific product page, not a homepage or gallery: '+record.productId);
  }
  const evidence=record.sourceIds.flatMap(id=>{const source=sources.find(source=>source.id===id);if(!source||source.access!=='body_read'){errors.push('Purchase evidence requires a body-read official source: '+record.productId+'/'+id);return []}return [source]});
  const listingSources=official?evidence.filter(source=>product.sourceIds.includes(source.id)&&samePage(source.url,official)):[];
  if(official&&!listingSources.length)errors.push('Purchase evidence must include the actual product or priced catalog source: '+record.productId);
  const selection=record.listingSelection;
  if(selection&&!listingSources.some(source=>source.id===selection.sourceId))errors.push('Listing selection needs its verified product or catalog source: '+record.productId);
  const mapping=visits.products.find(entry=>entry.productId===record.productId);
  if(record.kind==='retail-and-catalog'&&!record.storeIds.length)errors.push('Catalog-only evidence does not establish a retail purchase route: '+record.productId);
  for(const storeId of record.storeIds){
   const store=visits.stores.find(store=>store.id===storeId);
   if(!store||!mapping?.storeIds.includes(storeId))errors.push('Purchase evidence store must be linked to this product: '+record.productId+'/'+storeId);
   else if(!evidence.some(source=>store.sourceIds.includes(source.id)))errors.push('Retail evidence needs the current store guide source: '+record.productId+'/'+storeId);
  }
 }
 for(const product of published)if(!seen.has(product.id))errors.push('Published product has no verified purchase evidence: '+product.id);
 return errors;
}
