# 035 仕様・実装・検証の対応

| 要件 | 実装で見るファイル | 確認すること |
| --- | --- | --- |
| R1 全国追加 | [商品台帳](../../src/data/catalog.json)、日英の産地・工芸・商品本文 | 19件が一意に加わり、公開88商品が47都道府県に対応する |
| R2 購入根拠 | [一次照合](../../docs/research/national-listings-2026-11-24.md)、[購入根拠](../../src/data/purchase-evidence.json)、[出典](../../docs/research/sources.json) | 地域と工芸の関係、購入先・価格・選択肢の正本と日英の表示 |
| R3 画像 | [着用画像登録](../../src/data/editorial-images.json)、[画像台帳](../../docs/assets.json)、制作記録 | 新19商品の着用画像、日英AI表示、SORA参照の整合 |
| R4 エリアの選択 | [旅行エリア設定](../../src/config/travel-areas.ts)、[エリア選択UI](../../src/components/TravelFinder.astro) | 地域ブロック→首都圏→神奈川・東京など→県内エリア→商品 |
| R5 既存導線と操作 | 県ページ、商品カード、日本地図、SORAプロフィール | 日英、スマートフォン、キーボード、通常リンク、既存URL |
| R6 引継ぎ | [計画](plan.md)、[検証](validation.md)、[開始手順](../../START_HERE.md) | 実測・未確認事項・公開元の記録をたどれる |
