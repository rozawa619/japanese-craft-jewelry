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
| R6 実公開 | 後続のhosted/deployment記録 | 未反映を成功とせず公開後に確定する |

法律・素材事実・店舗情報・型/URL生成・UI部品・広告・画像を分け、旧版の成功を008へ読み替えない。

ローカル画面確定2026-11-16 20:18:23 JST。全プロセスexit0、local証跡確定後の遅延書込なし。
