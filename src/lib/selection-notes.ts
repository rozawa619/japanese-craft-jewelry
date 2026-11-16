import {z} from 'zod';
import raw from '../data/selection-notes.json' with {type:'json'};
import type {Catalog} from './schema.ts';
import type {Locale} from './i18n.ts';
const id=z.string().regex(/^[a-z0-9-]+$/);
const text=z.string().trim().min(1);
const copy=z.object({difference:text,chooseFor:text}).strict();
export const selectionNotesSchema=z.record(id,z.object({sourceIds:z.array(id).min(1),compareWith:z.array(id).min(2).max(3),en:copy,ja:copy}).strict());
export type SelectionNotes=z.infer<typeof selectionNotesSchema>;
export const selectionNotes=selectionNotesSchema.parse(raw);
export function selectionNoteFor(productId:string,locale:Locale){
 const note=selectionNotes[productId];
 if(!note)throw new Error('Published jewelry needs its own choice notes: '+productId);
 return {...note[locale],compareWith:note.compareWith,sourceIds:note.sourceIds};
}
export function collectSelectionNoteErrors(input:unknown,catalog:Pick<Catalog,'products'>,sources:readonly {id:string}[]){
 const parsed=selectionNotesSchema.safeParse(input);
 if(!parsed.success)return parsed.error.issues.map(issue=>'selection-notes.'+issue.path.join('.')+': '+issue.message);
 const errors:string[]=[],published=new Set(catalog.products.filter(product=>product.publishStatus==='published').map(product=>product.id));
 const sourceIds=new Set(sources.map(source=>source.id));
 for(const [productId,note] of Object.entries(parsed.data)){
  const product=catalog.products.find(product=>product.id===productId);
  if(!published.has(productId))errors.push('Choice notes must refer to published jewelry: '+productId);
  if(new Set(note.compareWith).size!==note.compareWith.length)errors.push('Duplicate choice comparison: '+productId);
  for(const peer of note.compareWith)if(peer===productId||!published.has(peer))errors.push('Choice comparison must be another published product: '+productId+'/'+peer);
  for(const source of note.sourceIds){
   if(!sourceIds.has(source))errors.push('Unknown choice source: '+productId+'/'+source);
   else if(product&&!product.sourceIds.includes(source))errors.push('Choice source must be attached to this product: '+productId+'/'+source);
  }
 }
 for(const productId of published)if(!parsed.data[productId])errors.push('Missing localized choice notes: '+productId);
 return errors;
}
