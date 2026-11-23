import {products} from './catalog.ts';
import type {Locale} from './i18n.ts';

type CollectionCopy = {
  label: string;
  title: string;
  description: string;
  guide: string;
};

const materialCopy = {
  glass: {
    ja: {
      label: 'ガラスのジュエリー',
      title: '日本のガラスジュエリー',
      description: '薩摩切子や琉球ガラスなど、ガラスを使ったピアスやイヤリング、ペンダントを国内参考価格とともに紹介します。',
      guide: 'ガラスの模様や形を見比べてみてください。薩摩切子にはカット模様のペンダント、琉球ガラスにはハート型のピアスがあります。耳飾りはピアス、イヤリング、イヤーカフで着け方が異なるので、サイズと留め具を商品詳細で確認できます。',
    },
    en: {
      label: 'Glass jewelry',
      title: 'Japanese Glass Jewelry',
      description: 'Compare Japanese glass earrings, clip-ons and pendants, including Satsuma kiriko and Ryukyu glass, with reference prices in Japan.',
      guide: 'Compare the cut pattern of a Satsuma kiriko pendant with the heart shape of a pair of Ryukyu glass earrings. If you are choosing earrings or an ear cuff, check the dimensions and fastening on the item page.',
    },
  },
  wood: {
    ja: {
      label: '木のジュエリー',
      title: '木を使った日本の工芸ジュエリー',
      description: '箱根寄木細工や鎌倉彫など、木を使ったピアス、ペンダント、ブローチを紹介します。デザインと国内参考価格を比べられます。',
      guide: '寄木細工の幾何学模様と、鎌倉彫の椿やもみじの彫り模様を見比べられます。耳飾りのほか、胸元や襟に着けるペンダントやブローチもあります。模様や色の個体差は、販売先の商品案内をご確認ください。',
    },
    en: {
      label: 'Wood jewelry',
      title: 'Japanese Wood Jewelry',
      description: 'Explore earrings, pendants and brooches made with wood, including Hakone yosegi and Kamakura-bori, with reference prices in Japan.',
      guide: 'Compare the geometric patterns of yosegi with the carved camellia and maple motifs of Kamakura-bori. Explore earrings, pendants or brooches, and check the official listing for details on variation in pattern or color.',
    },
  },
} satisfies Record<string, Record<Locale, CollectionCopy>>;

export const materialCollections = Object.entries(materialCopy)
  .filter(([id]) => products.some(product => product.materialIds.includes(id)))
  .map(([id, copy]) => ({id, copy, route: `materials/${id}/`}));
