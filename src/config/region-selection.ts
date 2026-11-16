/**
 * Display configuration only. Product facts, images and prices stay in their
 * existing catalog/registry. The ranking describes travel, not jewelry sales.
 */
export interface RankedDestination {
  rank: number;
  prefectureId: string;
  visitRatePercent: number;
}

export const tourismRanking: {
  year: number | null;
  sourceTitle: {en:string;ja:string};
  sourceUrl: string | null;
  checkedAt: string | null;
  destinations: RankedDestination[];
} = {
  year: 2025,
  sourceTitle: {en:'Japan Tourism Agency, 2025 final results, Table 6-1',ja:'観光庁 2025年確報・表6-1'},
  sourceUrl: 'https://www.mlit.go.jp/kankocho/content/002025515.xls',
  checkedAt: '2026-11-16',
  destinations: [
    {rank:1,prefectureId:'tokyo',visitRatePercent:50.8},
    {rank:2,prefectureId:'osaka',visitRatePercent:41.3},
    {rank:3,prefectureId:'chiba',visitRatePercent:35.1},
    {rank:4,prefectureId:'kyoto',visitRatePercent:29.7},
    {rank:5,prefectureId:'fukuoka',visitRatePercent:11.0},
    {rank:6,prefectureId:'kanagawa',visitRatePercent:9.3},
    {rank:7,prefectureId:'nara',visitRatePercent:9.0},
    {rank:8,prefectureId:'yamanashi',visitRatePercent:8.1},
    {rank:9,prefectureId:'hokkaido',visitRatePercent:7.3},
    {rank:10,prefectureId:'aichi',visitRatePercent:6.9},
  ],
};

/** One editorial choice per prefecture, never a claim of sales popularity. */
export const regionalRepresentatives: Record<string,string> = {
  osaka:'senshu-pearl-stud-earrings',
  chiba:'arcos-cosmic-spiral-pendant',
  nara:'sugimura-hosoge-raden-pendant',
  fukuoka:'iwaya-urushi-9mm-hook-earrings',
  yamanashi:'simprich-crystal-bubble-pierced-earrings',
  hokkaido:'yukieglass-mint-veil-earrings',
  tokyo:'rinzen-seika-amber-pierced-earrings',
  kyoto:'morphosphere-ultramarine-pansy-pierced-earrings',
  aichi:'kato-suke-drop-pierced-earrings',
  kanagawa:'hamamatsuya-catch-pierced',
  saga:'six-kiln-half-moon-earrings',
  ishikawa:'checos-japanese-apricot-pierced-earrings',
};
