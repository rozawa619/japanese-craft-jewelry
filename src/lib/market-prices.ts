import {catalog} from './catalog.ts';
import {safeHttps,isAllowedDestination} from './affiliate.ts';
import type {Catalog} from './schema.ts';
import type {Locale} from './i18n.ts';

export type PriceMarket='japan'|'international';
export interface MarketPrice {
 market:PriceMarket;
 amount:number;
 currency:string;
 checkedAt:string|null;
 taxNote:string;
 sourceIds:string[];
}
export interface OfficialMarketLink {id:string;url:string;merchantId:string;merchantName:string;}
export interface MarketPrices {japan:MarketPrice|null;international:MarketPrice|null;japanLinks:OfficialMarketLink[];internationalLinks:OfficialMarketLink[];}
export type MarketCatalog=Pick<Catalog,'products'|'links'|'merchants'>;
const known=(amount:unknown,currency:unknown):amount is number=>typeof amount==='number'&&Number.isFinite(amount)&&amount>=0&&typeof currency==='string'&&/^[A-Z]{3}$/.test(currency);

/** Language changes the wording, never the verified market price or destination. */
export function marketPricesFor(productId:string,source:MarketCatalog=catalog):MarketPrices {
 const product=source.products.find(product=>product.id===productId);
 if(!product)return {japan:null,international:null,japanLinks:[],internationalLinks:[]};
 const localized=product.localizedPrices?.ja;
 const japan:MarketPrice|null=localized?.currency==='JPY'&&known(localized.amount,localized.currency)
  ?{market:'japan',amount:localized.amount,currency:localized.currency,checkedAt:localized.checkedAt,taxNote:localized.taxNote,sourceIds:[...localized.sourceIds]}
  :product.priceCurrency==='JPY'&&known(product.priceAmount,product.priceCurrency)
  ?{market:'japan',amount:product.priceAmount,currency:product.priceCurrency,checkedAt:product.priceCheckedAt,taxNote:product.taxNote,sourceIds:[...product.sourceIds]}
  :null;
 const international:MarketPrice|null=product.priceCurrency!=='JPY'&&known(product.priceAmount,product.priceCurrency)
  ?{market:'international',amount:product.priceAmount,currency:product.priceCurrency!,checkedAt:product.priceCheckedAt,taxNote:product.taxNote,sourceIds:[...product.sourceIds]}
  :null;
 const links=(market:PriceMarket):OfficialMarketLink[]=>{
  const seen=new Set<string>();
  return source.links.filter(link=>{
   if(link.productId!==productId)return false;
   // An explicit Japanese destination is independent of the UI language.
   // Shared JPY/unpriced maker catalogs stay shared. A shared foreign-currency
   // storefront is never relabeled as a Japanese domestic destination.
   if(market==='japan')return link.locale==='ja'||(!link.locale&&(!product.priceCurrency||product.priceCurrency==='JPY'));
   return !!product.priceCurrency&&product.priceCurrency!=='JPY'&&(!link.locale||link.locale==='en');
  }).flatMap(link=>{
   const merchant=source.merchants.find(merchant=>merchant.id===link.merchantId);
   const home=safeHttps(merchant?.url);
   const url=home?isAllowedDestination(link.officialProductUrl,[new URL(home).hostname]):null;
   if(!url||seen.has(url))return [];
   seen.add(url);
   return [{id:link.id,url,merchantId:link.merchantId,merchantName:merchant?.name||''}];
  });
 };
 return {japan,international,japanLinks:links('japan'),internationalLinks:links('international')};
}

export function formatMarketPrice(value:MarketPrice|null,locale:Locale='en'):string {
 if(!value)return locale==='ja'?'価格は未確認':'Price not confirmed';
 return new Intl.NumberFormat(locale==='ja'?'ja-JP':'en',{
  style:'currency',currency:value.currency,currencyDisplay:'code',
  minimumFractionDigits:Number.isInteger(value.amount)?0:2,
  maximumFractionDigits:value.currency==='JPY'?0:2,
 }).format(value.amount);
}
