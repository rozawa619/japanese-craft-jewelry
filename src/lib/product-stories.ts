import registry from '../data/product-stories.json' with {type:'json'};
import type {Locale} from './i18n';
export interface ProductStory {headline:string;standfirst:string;highlights:string[];outfit:{title:string;body:string}}
export function storyFor(productId:string,locale:Locale):ProductStory{
 const entry=(registry as Record<string,Record<Locale,ProductStory>>)[productId]?.[locale];
 if(!entry)throw new Error('A published product needs a localized product story: '+productId+'/'+locale);
 return entry;
}
