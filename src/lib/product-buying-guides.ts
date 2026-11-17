import {z} from 'zod';
import raw from '../data/product-buying-guides.json' with {type:'json'};
import type {Product} from './schema.ts';
import type {Locale} from './i18n.ts';

const id=z.string().regex(/^[a-z0-9-]+$/),text=z.string().trim().min(1);
const copy=z.object({questions:z.array(z.object({question:text,answer:text}).strict()).length(3)}).strict();
export const buyingGuidesSchema=z.record(id,z.object({sourceIds:z.array(id).min(1),en:copy,ja:copy}).strict());
export type ProductBuyingGuide=z.infer<typeof buyingGuidesSchema>[string];
const guides=buyingGuidesSchema.parse(raw);
const tokens=['size','findings','fastening'] as const;
type Facts=Pick<Product,'id'|'size'|'findings'|'fastening'>;

/** Numbers and hardware descriptions are rendered from the localized catalog.
 * Editorial questions never become another price, URL or product-fact master. */
export function renderBuyingGuide(guide:ProductBuyingGuide,product:Facts,locale:Locale){
 const expand=(value:string)=>value.replace(/\{([^{}]+)\}/g,(_match,token:string)=>{
  if(!tokens.includes(token as typeof tokens[number]))throw new Error('Unsupported buying-guide token: '+product.id+'/'+token);
  const fact=product[token as typeof tokens[number]];
  if(!fact?.trim())throw new Error('Unknown product fact cannot fill a buying-guide token: '+product.id+'/'+token);
  return fact;
 });
 return {questions:guide[locale].questions.map(item=>({question:expand(item.question),answer:expand(item.answer)})),sourceIds:guide.sourceIds};
}
export function buyingGuideFor(product:Facts,locale:Locale){
 const guide=guides[product.id];
 if(!guide)throw new Error('Published product needs a buying guide: '+product.id);
 return renderBuyingGuide(guide,product,locale);
}
export function collectBuyingGuideErrors(input:unknown,products:readonly (Facts&{publishStatus:string;sourceIds:string[]})[],sources:readonly {id:string}[]){
 const parsed=buyingGuidesSchema.safeParse(input);
 if(!parsed.success)return parsed.error.issues.map(issue=>'buying-guides.'+issue.path.join('.')+': '+issue.message);
 const errors:string[]=[],published=products.filter(p=>p.publishStatus==='published'),ids=new Set(published.map(p=>p.id)),known=new Set(sources.map(s=>s.id));
 const answers={en:new Map<string,string>(),ja:new Map<string,string>()};
 for(const [productId,guide]of Object.entries(parsed.data)){
  const product=published.find(p=>p.id===productId);
  if(!product){errors.push('Only published products can have active buying guides: '+productId);continue;}
  if(new Set(guide.sourceIds).size!==guide.sourceIds.length)errors.push('Duplicate buying-guide source: '+productId);
  for(const source of guide.sourceIds)if(!known.has(source)||!product.sourceIds.includes(source))errors.push('Buying-guide source must be known and attached to the product: '+productId+'/'+source);
  for(const locale of ['en','ja'] as const){
   const entries=guide[locale].questions;
   if(new Set(entries.map(item=>item.question.trim().toLowerCase())).size!==entries.length)errors.push('Repeated buying-guide question: '+productId+'/'+locale);
   for(const entry of entries){
    if(/https?:\/\/|(?:JPY|USD|GBP)\s*\d|[¥￥$]\s*\d/i.test(entry.answer+' '+entry.question))errors.push('Keep prices and URLs in the catalog: '+productId+'/'+locale);
    const normalized=entry.answer.replace(/\s+/g,' ').trim().toLowerCase(),previous=answers[locale].get(normalized);
    if(previous)errors.push('Repeated complete buying-guide answer: '+productId+'/'+locale+' matches '+previous);else answers[locale].set(normalized,productId);
   }
   try{renderBuyingGuide(guide,product,locale);}catch(error){errors.push(String(error));}
  }
 }
 for(const id of ids)if(!parsed.data[id])errors.push('Missing localized product buying guide: '+id);
 return errors;
}
