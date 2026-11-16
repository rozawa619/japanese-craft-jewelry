/** Display order only; verified facts and link state remain in catalog.json. */
export const selection={
 heroProductId:'morphosphere-ultramarine-pansy-pierced-earrings',
 featuredProductIds:['morphosphere-ultramarine-pansy-pierced-earrings','checos-japanese-apricot-pierced-earrings','kato-suke-drop-pierced-earrings','six-kiln-half-moon-earrings','rinzen-seika-amber-pierced-earrings','hamamatsuya-catch-pierced'],
 catalogProductIds:['morphosphere-ultramarine-pansy-pierced-earrings','hamamatsuya-catch-pierced','rinzen-seika-amber-pierced-earrings','checos-japanese-apricot-pierced-earrings','hamamatsuya-clip','six-kiln-half-moon-earrings','kato-suke-drop-pierced-earrings','hamamatsuya-pendant','rinzen-leaf-glass-pendant','maruyama-clip-c','six-kiln-blue-bouquet-pierced-earrings','maruyama-clip-d','saskia-diez-drake-porcelain-cuff','maruyama-pierced-c','maruyama-pierced-d'],
} as const;
export function orderSelection<T extends {id:string}>(items:T[]):T[]{const rank=new Map<string,number>(selection.catalogProductIds.map((id,i)=>[id,i]));return [...items].sort((a,b)=>(rank.get(a.id)??9999)-(rank.get(b.id)??9999))}
