import type {Locale} from './i18n.ts';
import type {Product} from './schema.ts';
import {safeHttps} from './affiliate.ts';

/** Search summaries use the same product copy and craft labels as the page.
 * They do not add origin, shipping, wear or performance claims. */
export function productSearchMetadata(product:Pick<Product,'title'|'editorialSummary'>,locale:Locale,craftName:string){
 const summary=product.editorialSummary.trim();
 const firstSentence=summary.match(/^.*?[.!?。](?:\s|$)/u)?.[0].trim()||summary;
 const context=locale==='ja'
  ? `${craftName}のセレクト。素材や国内参考価格を比べ、公式の商品情報・店舗案内へ進めます。`
  : `Explore ${craftName} in our Japanese jewellery selection, with materials, Japan reference prices and official shop information.`;
 return {title:product.title,description:firstSentence+(locale==='ja'?'':' ')+context};
}

/** A query/filter or hash is a reading state of a page, not a new canonical. */
export function canonicalPageUrl(origin:string,pathname:string){
 const siteOrigin=new URL(origin);
 if(!safeHttps(origin)||siteOrigin.protocol!=='https:'||siteOrigin.username||siteOrigin.password)throw new Error('Canonical origin must be public HTTPS without credentials.');
 const url=new URL(pathname,siteOrigin);
 if(url.origin!==siteOrigin.origin)throw new Error('Canonical page must stay on the configured origin.');
 url.search='';url.hash='';return url.href;
}

export type SearchBreadcrumb={name:string;url:string};
export type SearchImage={url:string;width:number;height:number;description:string};
export type PageSearchData={canonical:string;title:string;description:string;locale:Locale;updatedAt?:string;article?:boolean;image?:SearchImage;breadcrumbs?:SearchBreadcrumb[];subjectName?:string};

/** Describes this editorial page and its AI styling image, never a product
 * offer, hands-on review or aggregate rating. */
export function pageSearchData(input:PageSearchData){
 const origin=new URL(input.canonical).origin;
 const page:Record<string,unknown>={'@type':input.article?'Article':'WebPage','@id':input.canonical+'#webpage',name:input.title,headline:input.title,description:input.description,url:input.canonical,inLanguage:input.locale};
 if(input.updatedAt)page.dateModified=input.updatedAt;
 if(input.subjectName)page.about={'@type':'Thing',name:input.subjectName};
 if(input.image){
  if(!safeHttps(input.image.url)||new URL(input.image.url).origin!==origin||input.image.width<=0||input.image.height<=0)throw new Error('A page image needs a same-site HTTPS URL and actual positive dimensions.');
  page.primaryImageOfPage={
  '@type':'ImageObject','@id':input.canonical+'#styling-image',contentUrl:input.image.url,url:input.image.url,width:input.image.width,height:input.image.height,
  caption:input.locale==='ja'?'AIイメージ':'AI image',description:input.image.description,
  digitalSourceType:'https://schema.org/TrainedAlgorithmicMediaDigitalSource',
  };
 }
 const graph:Record<string,unknown>[]=[page];
 if(input.breadcrumbs?.length){
  const id=input.canonical+'#breadcrumb';
  for(const crumb of input.breadcrumbs){if(!crumb.name.trim()||new URL(crumb.url).origin!==origin)throw new Error('Breadcrumb names and same-site canonical destinations are required.');}
  page.breadcrumb={'@id':id};
  graph.push({'@type':'BreadcrumbList','@id':id,itemListElement:input.breadcrumbs.map((crumb,index)=>({'@type':'ListItem',position:index+1,name:crumb.name,item:crumb.url}))});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
