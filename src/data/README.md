# データを編集する前に

実例と手順は[編集ガイド](../../docs/editing-guide.md)、設計は[architecture](../../docs/architecture.md)へ。ここは表示部品と分離した正本です。JSONはコメント/末尾カンマを入れず、UTF-8で保存します。

| ファイル | 中身 |
| --- | --- |
| [catalog.json](catalog.json) | products、makers、merchants、prefectures、crafts、materials、productTypes、programs、linksをIDで関連付ける |
| [translations/ja.json](translations/ja.json) | 日本語の表示。共有数値/広告状態とは分ける |
| [product-stories.json](product-stories.json) | 日英の大見出し/導入/選ぶ理由/装い |
| [selection-notes.json](selection-notes.json) | 選ぶポイントと実在する比較候補 |
| [product-buying-guides.json](product-buying-guides.json) | 日英各3問。仕様は正本token、出典は対象商品のID |
| [purchase-evidence.json](purchase-evidence.json) | 対象variantの現行購入根拠 |
| [visits.json](visits.json) | 確認した実店舗/所在地/日付/商品対応とfallback |
| [region-choice-notes.json](region-choice-notes.json) | 産地内の選び方の説明。価格や件数を重複入力しない |
| [editorial-images.json](editorial-images.json) | 人物AI画像の対応/alt/比率 |
| [product-detail-images.json](product-detail-images.json) | 単体AI図の対応/alt/比率 |
| [advertising-privacy.json](advertising-privacy.json) | 現状off固定の広告Privacy状態 |

source/権利はdocs側にも正本があります：[出典](../../docs/research/sources.json)・[画像台帳](../../docs/assets.json)。商品本文はcontent/products、掲載順はconfig/selection.ts。画像/広告/不明値のgateを弱めてエラーを消さず、対応するデータを確認します。
