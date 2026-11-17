# 設計と実装の対応

研究を東4品・西4品・熊本/島根2品に分担。作業用payloadをrootで照合し、catalog、翻訳、出典、紹介、比較、質問、購入根拠、訪問、地域/工芸本文へ統合する。公式注文を確認しても画像や日英の公開条件が未完ならdraftのままにする。

| 要件 | 実装/資料 | 検証 |
| --- | --- | --- |
| R1/R2 | research/national-expansion、catalog/ja、sources | SKU/variant/税込・税別/地域の実確認、cross-reference |
| R3 | product-stories/selection-notes/buying-guides、日英products | 独自の選択軸、token、比較先、重複補助、UI |
| R4 | 2画像registry、assets、generation-v16/solo-v16、WebP | 人物/単体目視、元比率、XMP、全SHA、旧bytes保持 |
| R5 | visits、store-map-embeds、取得記録 | 公式住所と地図の対応、初期通信なし、fallback |
| R6 | 既存validatorsとQA、manifest集合reader、件数の動的導出 | verify、quality/prices/sources/types/mobile/SEO、公開全件比較 |
| R7 | validation、handoff、deployment、package:delivery | source/ZIP全SHAと集合、公開app/文書HEADの区別 |

新しい画像記録を旧v14へ追記せず、新manifestを読込む共通helperでregistryの完全な対応を検査する。旧manifest/画像の凍結は維持。広告承認を仮設定せず、新商品は通常公式URLを使う。外部写真は読むためだけに表示し、repo/生成入力へ転用しない。
