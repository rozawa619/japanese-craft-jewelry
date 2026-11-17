import {z} from 'zod';
import rawVisits from '../data/visits.json' with {type:'json'};
import {catalog as projectCatalog} from './catalog.ts';
import type {Catalog} from './schema.ts';
import type {Locale} from './i18n.ts';
import {safeHttps,isAllowedDestination,linksInLocale,policyForLink} from './affiliate.ts';

const id=z.string().regex(/^[a-z0-9-]+$/);
const text=z.string().trim().min(1);
const localized=z.object({en:text,ja:text}).strict();
const officialUrl=z.string().refine(value=>!!safeHttps(value),'A public credential-free HTTPS URL is required');
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{const stamp=Date.parse(value+'T00:00:00Z');return Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)===value},'A real calendar date is required');
export const visitStoreSchema=z.object({
 id,name:localized,address:localized,kind:text,officialUrl,officialStoreUrl:officialUrl,
 hours:localized.nullable(),closedDays:localized.nullable(),access:localized.nullable(),
 visitSummary:localized,stockNote:localized,mapQuery:text.max(512).refine(value=>!/[\u0000-\u001f\u007f]/.test(value)),
 sourceIds:z.array(id).min(1),checkedAt:date,
}).strict();
export const productVisitSchema=z.object({
 productId:id,storeIds:z.array(id),officialHomeUrl:officialUrl.nullable(),officialHomeRole:z.enum(['maker','retailer']).nullable(),
 sourceIds:z.array(id).min(1),fallback:localized.nullable(),checkedAt:date,
}).strict().refine(value=>(value.officialHomeUrl===null)===(value.officialHomeRole===null),'An official home URL and its role must be supplied together');
export const visitsSchema=z.object({stores:z.array(visitStoreSchema),products:z.array(productVisitSchema)}).strict();
export type VisitStore=z.infer<typeof visitStoreSchema>;
export type ProductVisit=z.infer<typeof productVisitSchema>;
export type Visits=z.infer<typeof visitsSchema>;
export const visits=visitsSchema.parse(rawVisits);

/** Fixed external Maps actions. Optional reviewed embeds live in store-map-embeds.ts. */
export function storeMapLinks(store:Pick<VisitStore,'mapQuery'>){
 const query=store.mapQuery.trim();
 if(!query||/[\u0000-\u001f\u007f]/.test(query))return null;
 const search=new URL('https://www.google.com/maps/search/');
 search.searchParams.set('api','1');search.searchParams.set('query',query);
 const directions=new URL('https://www.google.com/maps/dir/');
 directions.searchParams.set('api','1');directions.searchParams.set('destination',query);
 if(search.href.length>2048||directions.href.length>2048)return null;
 return {search:search.href,directions:directions.href};
}

/** A plain official URL is useful even after a separate purchase CTA becomes an ad. */
export function officialProductLinks(productId:string,locale:Locale,source:Catalog=projectCatalog){
 const seen=new Set<string>();
 return linksInLocale(source.links,locale).filter(link=>link.productId===productId).flatMap(link=>{
  const policy=policyForLink(link,source);
  if(policy.merchantId!==link.merchantId)return [];
  const url=isAllowedDestination(link.officialProductUrl,policy.officialHosts);
  if(!url||seen.has(url))return [];
  seen.add(url);
  return [{id:link.id,url,merchantId:link.merchantId,merchantName:source.merchants.find(merchant=>merchant.id===link.merchantId)?.name||''}];
 });
}

export function visitGuideForProduct(productId:string,locale:Locale,source:Catalog=projectCatalog,data:Visits=visits){
 const entry=data.products.find(product=>product.productId===productId);
 const stores=(entry?.storeIds||[]).flatMap(id=>{const store=data.stores.find(store=>store.id===id);return store?[store]:[]});
 return {entry,stores,officialLinks:officialProductLinks(productId,locale,source),officialHomeUrl:safeHttps(entry?.officialHomeUrl),officialHomeRole:entry?.officialHomeRole||null,
  fallback:entry?.fallback?.[locale]||null,sourceIds:[...new Set([...(entry?.sourceIds||[]),...stores.flatMap(store=>store.sourceIds)])]};
}

export function collectVisitValidationErrors(input:unknown,catalog:Pick<Catalog,'products'>,sources:readonly {id:string;access?:unknown}[]){
 const parsed=visitsSchema.safeParse(input);
 if(!parsed.success)return parsed.error.issues.map(issue=>'visits.'+issue.path.join('.')+': '+issue.message);
 const data=parsed.data,errors:string[]=[],sourceIds=new Set(sources.map(source=>source.id));
 const storeIds=new Set<string>(),productIds=new Set<string>();
 const published=new Set(catalog.products.filter(product=>product.publishStatus==='published').map(product=>product.id));
 const checkSources=(ids:string[],owner:string)=>{for(const id of ids){if(!sourceIds.has(id))errors.push(owner+': unknown source '+id);else if(sources.find(source=>source.id===id)?.access!=='body_read')errors.push(owner+': visit claims require a body-read official source '+id)}};
 for(const store of data.stores){
  if(storeIds.has(store.id))errors.push('Duplicate store '+store.id);storeIds.add(store.id);
  checkSources(store.sourceIds,store.id);
  if(!storeMapLinks(store))errors.push(store.id+': map query cannot produce a valid fixed-origin Google Maps URL');
 }
 for(const product of data.products){
  if(productIds.has(product.productId))errors.push('Duplicate product visit '+product.productId);productIds.add(product.productId);
  if(!published.has(product.productId))errors.push('Visit mapping must reference a published product '+product.productId);
  if(new Set(product.storeIds).size!==product.storeIds.length)errors.push(product.productId+': duplicate store references');
  for(const id of product.storeIds)if(!storeIds.has(id))errors.push(product.productId+': unknown store '+id);
  if(!product.storeIds.length&&!product.fallback)errors.push(product.productId+': an unconfirmed store needs an honest online/store-guide fallback');
  checkSources(product.sourceIds,product.productId);
 }
 for(const id of published)if(!productIds.has(id))errors.push('Missing official/visit information for '+id);
 return errors;
}
