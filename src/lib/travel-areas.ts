import {travelAreas} from '../config/travel-areas.ts';
import type {Product} from './schema.ts';
import {visits,type Visits} from './visits.ts';

export const travelAreaAnchor = (areaId:string) => 'area-'+areaId;

/** Keep retailer-only pieces separate from products with a regional connection. */
export function productsForTravelPlace(products:readonly Product[], prefectureId:string, retailerIds:readonly string[]){
 const local:Product[] = [], retailer:Product[] = [];
 for(const product of products){
  if(product.publishStatus!=='published')continue;
  if(product.prefectureIds.includes(prefectureId))local.push(product);
  else if(product.merchantIds.some(id=>retailerIds.includes(id)))retailer.push(product);
 }
 return {local,retailer};
}

export function travelAreasFor(
 prefectureId:string,
 {local,retailer}:ReturnType<typeof productsForTravelPlace>,
 data:Visits=visits
){
 const knownStores=new Set(data.stores.map(store=>store.id));
 const productStores=new Map(data.products.map(product=>[product.productId,product.storeIds]));
 return (travelAreas[prefectureId]??[]).flatMap(area=>{
  const matches=(product:Product)=>productStores.get(product.id)?.some(id=>knownStores.has(id)&&area.storeIds.includes(id));
  const pieces=local.filter(matches), retailerPieces=retailer.filter(matches);
  return pieces.length||retailerPieces.length?[{...area,local:pieces,retailer:retailerPieces}]:[];
 });
}
