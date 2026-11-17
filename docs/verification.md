# 検証結果 — 0.18.0・日本人モデル画像023

2026-11-17。[仕様023](../specs/023-japanese-model-styling/spec.md)。公開app・Actions・納品の正本は[deployment-results.json](deployment-results.json)。前版は[旧検証](verification-v20-before-japanese-models.md)・[旧deployment](deployment-v20-before-japanese-models.json)。

## 変更

全58人物画像・60商品の生成記録を監査。日本人設定の36枚を保持し、米国/英国設定だった22枚を架空の日本人成人女性へ差し替えた。新22枚は25〜30歳、かわいい11/綺麗11、全体の設定範囲は25〜33歳。実在人物の国籍・正確な年齢を画像から認定していない。

[監査](japanese-models-stage-audit.json)・[全prompt/原本/新旧SHA](image-generation-japanese-v23.json)・[全22枚の目視](japanese-models-stage-visual-review.json)を保存。built-in image_genを使用、参照は旧プロジェクトAI画像のみ。公式写真の入力/転載なし。顔・耳・装身具・手と、目立つほくろ/シミ・文字/帯を目視し22採用/棄却0。実物SKU/素材/寸法/装着実績の証拠ではなく、AIイメージ表示を保つ。

## ローカル

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| 型/単体/build/link/CSP | 150files・0 error/warning/hint、149unit、344HTML/471生成物 | [static](japanese-models-stage-static-results.json) |
| 生成設定/原本・旧画像除外 | 63/63、全58人物Japanese設定、22PNG照合、retired32非配信 | [models](japanese-models-stage-results.json) |
| Hero/地図切替 | 77/77、日英24県・124切替、人工上下帯0、axe違反0 | [hero](japanese-models-stage-hero-results.json) |
| TOP10/DISCOVER共通写真 | 37/37、390画像照合、Tab120、axe6違反0 | [photos](japanese-models-stage-photos-results.json) |
| 全商品実表示 | 124/124、日英120ページnavigation・58画像decode、新22×日英44、390幅横溢れ0 | [browser](japanese-models-stage-browser-results.json) |
| スマホ全体 | 92/92、日英7viewport/6route、Source120/種類画像112・axe10違反0 | [mobile](japanese-models-stage-mobile-results.json) |
| 出典/生HTML | 328/328、120商品ページ、local SHA328一致 | [sources](japanese-models-stage-sources-results.json) |
| SEO | 328canonical・相互hreflang・sitemap・120商品画像・16noindex、error0 | [SEO](japanese-models-stage-seo-results.json) |
| 保全 | 9/9、旧495入力の493不変・版番号/22画像mappingだけ変更、_astro全SHA不変 | [preservation](japanese-models-stage-preservation-results.json) |
| 画像/広告off | 人物59/単体61/Privacy4すべて成功 | [人物](japanese-models-stage-editorial-images-results.json)・[単体](japanese-models-stage-detail-images-results.json)・[Privacy](japanese-models-stage-privacy-results.json) |
| 引継ぎ文書 | 54ファイルのlink/heading/command | [docs](japanese-models-stage-docs-results.json) |

保持36人物・単体60画像、旧22のローカル原本はbyte不変。旧22はactive参照/build/Git新tree/source ZIPから除外。商品/価格/出典/公式URL/店舗・UI/CSS・地図/広告/Privacy/依存設定を保持。[最終manifest](japanese-models-stage-build-manifest.json)で差分と全出力SHAを記録。一覧地図241の機能検証は前版022の実績で、今回の件数へ加算しない。

## 公開・納品

<!-- PUBLIC_STATUS_V23 -->
公開前の最終検証中。新app・Actions・実URL・source ZIPの確定結果を追記する。

元PNG22・旧AI参照WebP22・manifest/目視記録/READMEを別ZIPに保存、47ファイルの集合/全SHAを照合。全source/原本ZIPの最終状態はdeployment-resultsのsourceDeliveryと外部proofを正本とする。CLI/API keyへ切り替えていない。

Chromeのresponsive emulationであり、実機iOS/Safari、実物の完全再現、検索順位/離脱率/AdSense承認や全法域適合を認定しない。[法務/運営残条件](remaining-task-audit-v17.md)は継承する。
