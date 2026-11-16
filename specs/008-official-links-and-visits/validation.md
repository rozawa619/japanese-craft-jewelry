# 008 検証対応

| 要件 | 実装と確認 | 結果 |
| --- | --- | --- |
| R1 | 2画像を28–30方向へ編集、現行registryと台帳/生成記録 | 13画像/15商品、短いAI表示維持 |
| R2 | 全16商品、locale適合の公式商品URLと役割明記の公式home | visits/安全host/全商品対応をvalidate |
| R3/R4 | 8公式店舗/15商品、CHECOS1通販fallback | 出典本文・住所/アクセス/事前連絡の読み取りQA一致、SKU在庫未確認 |
| R5 | 文化庁/GoogleMaps/Geo Guidelines/消費者庁一次資料 | 独自事実要約+外部正規URL、画像等転載/iframeなし、個別全面適法保証なし |
| R6 source | 最終pnpm verify | 型59files0/0/0、51/51、88sources/16mapping/8stores |
| R6 build | check-built | 102HTML/4607refs/89anchors/332普通0広告/209実行JS CSP/86JSON/14旧移動/正規86URL |
| R6 UI | visit-stage-browser-results.json | 172/172、138画面、axe対象114画面0、JS/console0、16画像 |
| R6 広告 | visit-stage-ad-build-results.json | 5/5、23/14/0/0/0 sponsored、root dist/catalog検査中SHA不変 |
| R6 重点仕様 | visit-stage-final-detail-results.json | 16/16、JS/console0、4画像 |
| R6 Maps遷移 | visit-stage-map-navigation-results.json | 2実クリックでGoogleMaps新規タブ/期待URL/タイトル確認、Mapの内容の正確性は未認定 |
| R6 実公開 | visit-stage-hosted-*とdeployment-results.json | 172/172・138画面、axe114画面0/JS0/console0、補足18/18、86URL全200、13画像SHA一致、Maps2/2 |

法律・素材事実・店舗情報・型/URL生成・UI部品・広告・画像を分け、旧版の成功を008へ読み替えない。

ローカル画面確定2026-11-16 20:18:23 JST。全プロセスexit0、local証跡確定後の遅延書込なし。

## 公開確定

2026-11-16 20:28:06 JST、アプリcommit ec31b7910483970947bef3806b1099272c5545dd、Actions43856899272 success。公開の全16公式URL/8店舗/15訪問先/1正直な通販fallbackを日英で確認。86正規URLすべて200/index,follow、206実行JS CSP hash/86JSON、現行13画像SHA一致。GoogleMap2例を実クリックし、新規タブ/期待URL/タイトルまで確認。地図経路結果・個別店頭在庫・法的最終判断・検索掲載の保証とは分ける。全worker終了、確定後の遅延書込なし。

納品: workspace/japanese-craft-jewelry-delivery/source と japanese-craft-jewelry-source.zip、画面証跡screenshots/0.8.0。ソース/画像/プロンプト/一次資料記録/店舗データ/法務メモ/再検証scriptを同梱。実提携・申請送信・報酬発生なし。
