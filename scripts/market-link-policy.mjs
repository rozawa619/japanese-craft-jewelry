import {isAllowedDestination,policyForLink,resolveRetailerLink} from '../src/lib/affiliate.ts';

/** Validate an explicit purchase-market anchor against a real catalog link.
 * Cross-language references can only be ordinary official URLs. The market
 * label does not confer approval, change a merchant, or permit a tracking host.
 */
export function validateMarketRetailerAnchor(attrs,pageLocale,catalog){
 const market=attrs['data-purchase-market'];
 if(!['japan','international'].includes(market))return {valid:false,reason:'unknown purchase market'};
 const link=catalog.links.find(link=>link.id===attrs['data-market-link-id']);
 if(!link)return {valid:false,reason:'purchase market needs a real catalog link ID'};
 const product=catalog.products.find(product=>product.id===link.productId&&product.publishStatus==='published');
 if(!product)return {valid:false,reason:'purchase market link has no published product'};
 const marketMatches=market==='japan'
  ?link.locale==='ja'||(!link.locale&&(!product.priceCurrency||product.priceCurrency==='JPY'))
  :!!product.priceCurrency&&product.priceCurrency!=='JPY'&&(!link.locale||link.locale==='en');
 if(!marketMatches)return {valid:false,reason:'catalog link does not belong to the stated purchase market'};
 const policy=policyForLink(link,catalog);
 const official=isAllowedDestination(link.officialProductUrl,policy.officialHosts);
 if(!official)return {valid:false,reason:'purchase market needs a valid official URL on its exact merchant host'};
 let href;try{href=new URL(attrs.href).href}catch{return {valid:false,reason:'market destination is not an absolute URL'}};
 const rel=(attrs.rel||'').split(/\s+/),sponsored=rel.includes('sponsored');
 if(!['true','false'].includes(attrs['data-sponsored'])||(attrs['data-sponsored']==='true')!==sponsored)return {valid:false,reason:'market sponsored flag and rel disagree'};
 if(!link.locale||link.locale===pageLocale){
  const status=catalog.programs.find(program=>program.id===link.programId)?.applicationStatus;
  const expected=resolveRetailerLink(link,status,policy);
  return expected&&expected.href===href&&expected.sponsored===sponsored
   ?{valid:true,crossLocale:false}
   :{valid:false,reason:'market link disagrees with the page-locale resolver and approval state'};
 }
 if(attrs['data-sponsored']!=='false'||sponsored||href!==official)return {valid:false,reason:'cross-language market reference must be the ordinary official URL'};
 if(!['noopener','noreferrer'].every(value=>rel.includes(value)))return {valid:false,reason:'cross-language official reference needs noopener and noreferrer'};
 return {valid:true,crossLocale:true};
}
