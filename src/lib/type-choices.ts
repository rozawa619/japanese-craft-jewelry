type ChoiceProduct={id:string;publishStatus:string;prefectureIds:readonly string[];productType:readonly string[]};

/** Keep the caller's editorial order, and only illustrate a type with a piece
 * that actually belongs to the published collection being linked. */
export function typeChoicesFor<T extends ChoiceProduct>(products:readonly T[],prefectureId?:string){
 const eligible=products.filter(product=>product.publishStatus==='published'&&(prefectureId===undefined||product.prefectureIds.includes(prefectureId)));
 return [...new Set(eligible.flatMap(product=>product.productType))].map(type=>{
  const items=eligible.filter(product=>product.productType.includes(type));
  return {type,items,representative:items[0]!};
 });
}
