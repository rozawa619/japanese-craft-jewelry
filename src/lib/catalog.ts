import {orderSelection} from '../config/selection.ts';
import raw from '../data/catalog.json' with {type:'json'};
import japanese from '../data/translations/ja.json' with {type:'json'};
import sources from '../../docs/research/sources.json' with {type:'json'};
import {catalogSchema,type Product,type Catalog} from './schema.ts';
import {resolveRetailerLink,policyForLink,linksInLocale} from './affiliate.ts';
import type {Locale} from './i18n.ts';
type DisplayText={name?:string;description?:string;location?:string;productionNote?:string;language?:string;shippingSummary?:string;returns?:string};
type ProductText=Partial<Pick<Product,'title'|'editorialSummary'|'whoItMaySuit'|'whatToCheck'|'size'|'findings'|'fastening'|'taxNote'>>&{craftClassificationLabel?:string};
type Translations={products:Record<string,ProductText>;prefectures:Record<string,DisplayText>;crafts:Record<string,DisplayText>;materials:Record<string,DisplayText>;productTypes:Record<string,DisplayText>;makers:Record<string,DisplayText>;merchants:Record<string,DisplayText>};
const ja=japanese as Translations;
export const catalog=catalogSchema.parse(raw);
export {sources};
const mapNamed=<T extends {id:string;name:string;description?:string}>(items:T[],translations:Record<string,DisplayText>)=>items.map(item=>({...item,...translations[item.id]}));
const japaneseCatalog:Catalog={
 ...catalog,
 prefectures:mapNamed(catalog.prefectures,ja.prefectures),
 crafts:mapNamed(catalog.crafts,ja.crafts),
 materials:mapNamed(catalog.materials,ja.materials),
 productTypes:mapNamed(catalog.productTypes,ja.productTypes),
 makers:mapNamed(catalog.makers,ja.makers),
 merchants:catalog.merchants.map(m=>{const text=ja.merchants[m.id]||{};return {...m,...text,shipping:{...m.shipping,summary:text.shippingSummary||m.shipping.summary}}}),
 products:catalog.products.map(p=>{const text=ja.products[p.id]||{};const {craftClassificationLabel,...fields}=text;const localPrice=p.localizedPrices?.ja;return {...p,...fields,...(localPrice?{priceAmount:localPrice.amount,priceCurrency:localPrice.currency,priceCheckedAt:localPrice.checkedAt,taxNote:localPrice.taxNote}:{}),locale:'ja',craftClassification:{...p.craftClassification,label:craftClassificationLabel||p.craftClassification.label}}}),
};
export const catalogFor=(locale:Locale='en')=>locale==='ja'?japaneseCatalog:catalog;
export const products=catalog.products.filter(p=>p.publishStatus==='published');
export const productsFor=(locale:Locale='en')=>orderSelection(catalogFor(locale).products.filter(p=>p.publishStatus==='published'));
export const byId=<T extends {id:string}>(items:T[],id:string)=>items.find(x=>x.id===id)!;
export const makerFor=(p:Product,locale:Locale='en')=>byId(catalogFor(locale).makers,p.makerId);
export const linksFor=(ids:string[],locale:Locale='en')=>linksInLocale(catalog.links,locale).filter(l=>ids.includes(l.productId));
export const resolve=(link:typeof catalog.links[number])=>resolveRetailerLink(link,catalog.programs.find(p=>p.id===link.programId)?.applicationStatus,policyForLink(link,catalog));
export const sponsoredFor=(ids=products.map(p=>p.id),locale:Locale='en')=>linksFor(ids,locale).some(l=>resolve(l)?.sponsored);
export const price=(p:Product,locale:Locale='en')=>p.priceAmount!==null&&p.priceCurrency?new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{style:'currency',currency:p.priceCurrency,currencyDisplay:'code',minimumFractionDigits:Number.isInteger(p.priceAmount)?0:2,maximumFractionDigits:p.priceCurrency==='JPY'?0:2}).format(p.priceAmount):locale==='ja'?'販売店で価格を確認':'Price at retailer';
export const labels=(group:'materials'|'crafts'|'productTypes'|'prefectures',ids:string[],locale:Locale='en')=>ids.map(id=>byId(catalogFor(locale)[group],id)?.name).filter(Boolean).join(locale==='ja'?'、':', ');
