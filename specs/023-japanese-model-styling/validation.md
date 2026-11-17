# 検証記録

2026-11-17。アプリ0.18.0/仕様023。**新22画像の生成・個別目視採用・ローカル参照切替と下記の検証を完了。公開app/Actions・実URL・全source ZIPの確認は後続段階。** 予定と確定結果を区別する。

## 開始基準

公開0.17.3/app ef8ae160e7fc7d2b41cdce1063094313b719df6e、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success、文書HEAD240e1fed21a3ffe50b3f1ea2cfa84b285d497f2c。前版の全sourceは1155ファイル/118公開画像、集合/全SHA照合済み。これは023の公開/納品件数ではない。

0.17.3の実績は[022 validation](../022-compact-map-and-natural-hero/validation.md)。Map241/Hero77/mobile92/Source328等の旧件数を新画像の成功へ加算しない。023の各reportは今回の安定buildから取得する。

## 監査・生成・採用

| 対象 | 今回の確定結果 | 根拠 |
| --- | --- | --- |
| 旧生成設定の監査 | 60公開商品/58unique人物画像。Japanese明記36保持、American11/British11の22置換、記録不明0 | [audit](../../docs/japanese-models-stage-audit.json) |
| 新規生成 | built-in image_genで22枚。新設定Japanese22、25〜30歳（25歳6/26歳4/27歳3/28歳2/29歳3/30歳4）、かわいい系11/綺麗な系統11 | [新manifest](../../docs/image-generation-japanese-v23.json) |
| 個別目視 | 新PNG22と旧自作AI参照22を個別表示して22採用、棄却0/再生成0、blocking issue0。顔/装身具/構図・大きなほくろ等/文字/余白と概形整合を確認 | [visual review](../../docs/japanese-models-stage-visual-review.json) |
| 原本/権利/説明 | 元PNG22と旧自作AI参照を別納品領域へ保存。prompt/日時/PNG・WebPのSHA/AI metadata/日英alt・採否を記録。公式写真を入力/転載していない | 新manifest、[asset台帳](../../docs/assets.json) |

Japanese/年齢は架空の生成設定の監査であり、実在人物の国籍/民族/正確な年齢のピクセル推定ではない。かわいい/綺麗は制作の方向性と人による採用判断で、客観的な魅力度の保証ではない。目視は実物SKU・素材・寸法・着用実績の認定でもない。

## ローカルの確定結果

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| 日本人設定/新旧集合/原本/配信 | 63/63、60商品/58人物画像、元PNG22とdistを確認 | [専用QA](../../docs/japanese-models-stage-results.json) |
| 人物画像gate | 59/59、warnings0、58画像、旧baseline25保持、retired合計32を配信除外 | [人物画像](../../docs/japanese-models-stage-editorial-images-results.json) |
| 商品単体gate | 61/61、60商品/60単体画像 | [単体画像](../../docs/japanese-models-stage-detail-images-results.json) |
| 画像だけの独立保全 | 9/9。旧495 inputsのうちpackage版/画像registryだけ変更、他493と旧22bytes不変。変更商品22/保持参照38、dist旧22out/新22in、保持96画像の全SHA不変 | [preservation](../../docs/japanese-models-stage-preservation-results.json) |
| UIの生成物保全 | `_astro`4件の名前/全SHA一致、HTML344 route・他static9件不変。HTML本文の全byte同一は主張しない | 同preservation、[現在build manifest](../../docs/japanese-models-stage-build-manifest.json) |
| 型/単体/build/リンク/CSP | `pnpm verify`成功。型150ファイル/エラー・警告・hint0、149単体、344HTML。href/src20026、anchor3439、通常外部購入リンク1216、sponsored0、retired32除外 | [static](../../docs/japanese-models-stage-static-results.json) |
| 広告Privacy | 4/4、344HTML、広告mode off | [privacy](../../docs/japanese-models-stage-privacy-results.json) |
| Sources | 328/328、120商品ページ、448disclosures/1580records、HTML SHA比較328 | [Sources](../../docs/japanese-models-stage-sources-results.json) |
| SEO | 7checks、errors0、passed | [SEO](../../docs/japanese-models-stage-seo-results.json) |
| Hero日英/4viewport/24県 | 77/77、172選択/124画像切替、自然比率paint174、上下人工余白0、container blank0。axe4画面/違反0、page/console error0・外部通信0 | [Hero](../../docs/japanese-models-stage-hero-results.json) |
| 全商品詳細の日英描画 | 124/124、全60商品×2言語。新22商品×2言語の参照切替を含め、58unique人物画像をdecode | [browser](../../docs/japanese-models-stage-browser-results.json) |
| TOP10/DISCOVER共通写真 | 37/37、日英3surface/5幅、30scene/390画像、focus120、axe6画面/違反0。page/console error0・外部通信0 | [photos](../../docs/japanese-models-stage-photos-results.json) |
| スマホ/操作/店舗Maps | 92/92、7viewport/日英/代表6route、Source操作120/種類画像112、axe10画面/違反0、実Maps2 | [mobile](../../docs/japanese-models-stage-mobile-results.json) |

browser検査はChrome emulationで、実機Safariの確認とは区別する。一覧地図を含むUI source/JSとCSS bundleは保全9で不変を確認し、関連する画像表示と日英/スマホ回帰を今回のbrowserで検査した。022の一覧地図241を今回再実行したという主張はしない。

## 保全の再現方法と制約

`node scripts/check-japanese-model-preservation.mjs`を、確定manifestと安定buildで実行する。既定のreportとbuild manifestは上表の2ファイル。`CHECK_REPORT_PATH`/`CHECK_BUILD_MANIFEST_PATH`はrepo内docs/artifacts配下のJSONへ変更できる。監査中にbuild/元データを変更しない。

旧495 inputsには退役した旧WebPが含まれる。9項目の完全な保全証明はそれらの旧bytesが残るreviewed checkoutで再現し、通常build/新source ZIPの依存へ加えない。旧画像は同名上書きせず、Git追跡解除/ignore・retired/pruneで配信と納品から外す。source ZIPの除外と全SHA照合は納品段階で別に確認する。v12 baselineは変更しない。

## 公開・文書・納品

公開app/Actions・実URLの新22配信/旧22非配信と日英/スマホ・画像切替の確認は後続。現在入口8文書の公開状態はrootが確定後に更新する。

予定ZIPは`japanese-craft-jewelry-source-0.18.0-models-023.zip`、外部proofは`package-verification-0.18.0-models-023.json`。元PNGは納品先の`generated-originals/0.18.0/`へ保存済み。別の原本ZIP `japanese-craft-jewelry-originals-0.18.0.zip`は47ファイル（新PNG22/旧自作AI参照22/記録3）を照合済み、44,104,939 bytes、SHA256 `20422809c6f97d93c50176e84abd5bc81161a7d344a8620c9d40050d4225e942`。全sourceの集合/全SHA・fileCount/statusはdeployment-resultsのsourceDeliveryと外部proofへ記録する。原本ZIPの成功を、未作成source ZIP・未実行の公開検証の成功へ読み替えない。

技術PASSは全権利/全法域適合・検索順位/離脱率・AdSense承認を認定しない。本人/契約/商用ホスト/認定CMP等の[運営残条件](../../docs/remaining-task-audit-v17.md)は継承する。
