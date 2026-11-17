import raw from '../data/product-detail-images.json' with {type:'json'};
import type {EditorialImage} from './editorial-images.ts';
const images=raw as Record<string,EditorialImage>;
export function productDetailImageFor(productId:string):EditorialImage{
 const image=images[productId];
 if(!image||!/^images\/solo-[a-z0-9-]+-v\d+\.webp$/.test(image.path))throw new Error('Published product needs its registered AI detail image: '+productId);
 return image;
}
