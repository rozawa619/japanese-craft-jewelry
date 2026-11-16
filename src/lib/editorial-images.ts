import registry from '../data/editorial-images.json';
import type {Locale} from './i18n';

export interface EditorialImage {
  assetId: string;
  path: string;
  width: number;
  height: number;
  preserveRatio?: boolean;
  alt: Record<Locale,string>;
}

/** Styling imagery is tied to a stable product ID, separately from verified product facts. */
export function productImageFor(productId: string): EditorialImage | undefined {
  const image=Object.hasOwn(registry,productId)?(registry as Record<string,EditorialImage>)[productId]:undefined;
  if (!image) return undefined;
  if (!/^images\/[a-z0-9-]+\.(?:webp|avif|png|jpe?g)$/.test(image.path)) {
    throw new Error(`Product styling image must use a local, reviewed asset: ${productId}`);
  }
  return image;
}
