import registry from '../../docs/video/tiktok-publication-registry.json' with {type:'json'};
import {productImageFor,type EditorialImage} from './editorial-images.ts';
import type {Product} from './schema.ts';

type VideoMatch={
 url:string|null;
 availability:string;
 productId:string|null;
 imageAssetId?:string|null;
 siteImagePath?:string|null;
};
const videoPrefix=registry.account.profileUrl.replace(/\/$/,'')+'/video/';

export function videoJewelryFor<T extends Pick<Product,'id'|'publishStatus'>>(
 products:readonly T[], posts:readonly VideoMatch[]=registry.knownPostLinks,
):{product:T;image?:EditorialImage}[]{
 const published=new Map(products.filter(product=>product.publishStatus==='published').map(product=>[product.id,product]));
 const matches=new Map<string,{product:T;image?:EditorialImage}>();
 for(const post of posts){
  if(post.availability!=='listed_on_public_profile'||!post.url?.startsWith(videoPrefix)||!/^\d+$/.test(post.url.slice(videoPrefix.length)))continue;
  const product=published.get(post.productId??'');
  if(!product)continue;

  const previous=matches.get(product.id);
  if(previous?.image)continue;
  const current=productImageFor(product.id);
  const image=current&&current.assetId===post.imageAssetId&&current.path===post.siteImagePath?current:undefined;
  if(!previous||image)matches.set(product.id,{product,image});
 }
 return [...matches.values()];
}
