import registry from '../data/product-stories.json' with {type:'json'};
import type {Locale} from './i18n';
export interface ProductStory {headline:string;standfirst:string;highlights:string[];outfit:{title:string;body:string};decision:{bestFor:string;consider:string}}
type StoredProductStory=Omit<ProductStory,'decision'>&{decision?:ProductStory['decision']};
export function storyFor(productId:string,locale:Locale):ProductStory{
 const entry=(registry as Record<string,Record<Locale,StoredProductStory>>)[productId]?.[locale];
 if(!entry)throw new Error('A published product needs a localized product story: '+productId+'/'+locale);
 if(!entry.decision)throw new Error('A published product needs localized decision copy: '+productId+'/'+locale);
 return {...entry,decision:entry.decision};
}
