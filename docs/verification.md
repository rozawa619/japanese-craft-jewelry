# 検証結果 — 0.16.0・全国追加018

2026-11-17。10県10商品を追加し、公開60商品・24県へ拡張しました。公開アプリは`86d6c6e6cb1567839c80d43bcf26f4a509e4a8bb`。[Actions44042180272](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44042180272)のsuccessをGitHub APIで確認し、実際の公開ページも検証しました。確定値の正本は[deployment-results.json](deployment-results.json)です。

## 今回の内容

秋田・福井・岐阜・広島・鹿児島・徳島・鳥取・沖縄・熊本・島根から、注文を受け付けていた対象色・金具の10品を選びました。各商品に日英の紹介、比較、3問の選び方、公式購入先、実店舗の案内、人物と単体のAI図を追加しています。[追加商品一覧](national-expansion-v16.md)と[仕様018](../specs/018-national-jewelry-expansion/spec.md)を参照してください。

全66登録のうち公開60・下書き6。公開関連技法34（登録36）、一次出典293、店舗33、店舗案内に関連する商品53、購入根拠は公式通販受付51品と店舗＋現行カタログ9品です。在庫は確認時点の情報で、将来の通販在庫や個別の店頭在庫を認定しません。

## ローカルの検証

| 対象 | 結果 |
| --- | --- |
| 型・データ・単体・生成 | 初回`pnpm verify`は型130ファイル・unit135件・生成344HTMLが成功。その後追加した画像manifestの負例等9件を含め、最終`pnpm check`は型131ファイルでエラー/警告/ヒント0、`pnpm test`は144/144成功 |
| 商品/分類/絞込/比較/JSなし | [617/617](national-stage-quality-results.json)。全60商品、詳細360検査、地域/種類282往復。axe30画面で違反0、page/console error0 |
| 国内価格と別市場 | [374/374](national-stage-prices-results.json)。60商品/24県、既存9商品の別市場を保持。axe18画面で違反0 |
| 出典の一覧 | [328/328](national-stage-sources-results.json)。120商品ページ、出典一覧448、出典レコード1580。確認日は閉じた一覧の中に保持 |
| スマホ等 | [92/92](national-stage-mobile-results.json)。7viewport・日英、出典操作120、種類画像112、axe10画面で違反0、既存代表店舗の実Maps2件 |
| 種類画像/タップ | [種類52/52](national-stage-type-images-results.json)、24地域・104画像。[touch4/4](national-stage-touch-results.json)、実tap2flow |
| 新店舗の地図 | [20/20](national-stage-new-maps-results.json)。10商品×日英。初期/再読込の外部通信0、明示表示時のみGoogle要求20、閉じるとiframe削除、cookie/storageなし |
| 画像 | [人物59/59](national-stage-editorial-images-results.json)・[単体61/61](national-stage-detail-images-results.json)。合計118WebP、全60商品に対応 |
| SEO | [328正規URL](national-stage-seo-results.json)。相互hreflang/canonical/sitemap/JSON-LD、商品120ページ、noindex16ページ |
| 広告Privacy | [4/4](national-stage-privacy-results.json)。AdSenseはoff、未承認リンクは通常リンク |
| 既存の保持 | [旧Gitとの比較](national-stage-preservation-results.json)。旧56商品を含む267catalog record、199訳、258出典、98画像、旧生成記録3ファイルを保持 |

9件の追加テストはアプリ生成物を変えません。ブラウザー検証中の再buildは行わず、[安定した469ファイルのmanifest](national-stage-build-manifest.json)を基準にしました。初回verifyと最終check/unitの段階は[静的検証記録](national-stage-static-results.json)で区別しています。

新店舗のMaps20flowはGoogle要求を遮断したアプリ操作の検査です。タイル・ピン・帰属表示を20店舗すべてで実描画した検査ではありません。別段階で公式埋込4件とGoogle Share UI6件の店舗名・住所・埋込URLを確認し、[地図の調査記録](research/national-map-embeds-v16.json)へ残しました。第三者のAPI keyは転用していません。

## 実際の公開サイト

ローカル成功を公開成功に読み替えず、Actions成功後に公開URLへアクセスしました。[集約記録](national-stage-hosted-results.json)と各JSONが実測の範囲です。

| 公開検証 | 結果 |
| --- | --- |
| 出典/配信内容 | [328/328](national-stage-hosted-sources-results.json)。同じHTTP応答の生HTML SHA256が最終distと全件一致 |
| メタ/画像/補足 | [24/24](national-stage-hosted-release-results.json)。328正規URLの200・metadata・CSP等、118画像の200・SHA一致 |
| スマホ等 | [92/92](national-stage-hosted-mobile-results.json)。7viewport・日英、axe10画面で違反0、実Maps2件 |
| 種類画像 | [52/52](national-stage-hosted-types-results.json)。24県・日英・104画像instance、page/console error0 |
| タップ | [4/4](national-stage-hosted-touch-results.json)。実tap2flow |

広範囲617・価格374はローカルの検査です。公開で同じ全件UI検査を再実行したとは記載しません。Chrome emulationの結果を実機Safari/iOSの認定にはしません。検索への掲載・順位・訪問数は未測定です。

種類検査の[初回50/52](national-stage-hosted-types-first-attempt-results.json)は広島ENの一時503と付随consoleエラーでした。[fresh200と公開/dist/manifestの全SHA一致](national-stage-hosted-types-recheck-results.json)を確認し、アプリを変えず全52を再走査して成功しました。初回も保存しています。最後に[469生成物の集合/全SHA一致](national-stage-final-output-integrity.json)を確認しました。

## 画像と納品

新規採用は人物10・単体10。候補3枚を棄却して生成toolで修正し、元PNGは採用20・棄却3を分離保管しました。[人物の実prompt/採否](image-generation-v16.json)と[単体の実prompt/採否](image-generation-solo-v16.json)を同梱しています。公式写真を転載せず、AI図から正確な仕様・試着・数量を認定しません。

元PNG23枚＋生成記録2件＋READMEの別ZIPは26ファイル全SHA照合済み。全ソースの最新版ZIPと全件整合性proofは[引継ぎ](handoff.md)・deployment-resultsのsourceDeliveryから辿れます。ZIP自体のSHAはZIP外のproofに置き、完了記録を追加した後にも再export/全SHA照合します。

## 引き継ぐ範囲

依存とCI設定は変更していません。現行CIのruntime/依存監査/build gateは成功しています。以前の[セキュリティレビュー](security-review-v15.md)と、アカウント管理・レスポンスヘッダー・商用ホスト判断などの未完了事項は維持しています。今回の追加を全脆弱性・全法令・AdSense合格の認定にはしません。

旧0.15の段階別検証は[保存版](verification-v15.md)と[旧deployment](deployment-v15-before-national.json)へ分離しました。追試のコマンドと選び方は[検証ガイド](verification-guide.md)、途中修正も含む記録は[018 validation](../specs/018-national-jewelry-expansion/validation.md)を参照してください。

最終ソースは971ファイル・118公開画像です。repository/export/ZIPの集合と全件SHAを照合し、完了記録を含めて再梱包します。版付きZIP・latest・外部proofはdeployment-resultsのsourceDeliveryを参照してください。
