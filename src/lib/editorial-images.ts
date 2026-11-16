import registry from '../data/editorial-images.json';
import type {Locale} from './i18n';

export interface EditorialImage {
  assetId: string;
  path: string;
  width: number;
  height: number;
  alt: Record<Locale,string>;
}

/** Styling imagery is editorial content, deliberately separate from product images and facts. */
export function editorialImageFor(slug: string): EditorialImage | undefined {
  const image=Object.hasOwn(registry,slug)?(registry as Record<string,EditorialImage>)[slug]:undefined;
  if (!image) return undefined;
  if (!/^images\/[a-z0-9-]+\.(?:webp|avif|png|jpe?g)$/.test(image.path)) {
    throw new Error(`Editorial image must use a local, reviewed asset: ${slug}`);
  }
  return image;
}
