import {getCollection,type CollectionKey} from 'astro:content';
import type {Locale} from './i18n';
export {contentSlug} from './i18n';
export async function contentFor<C extends CollectionKey>(collection:C,locale:Locale){
 return getCollection(collection,({data})=>data.publishStatus==='published'&&('locale' in data?data.locale: 'en')===locale);
}
