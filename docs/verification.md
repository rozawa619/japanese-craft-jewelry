# 検証結果 — 0.17.0・地図で選ぶ019

2026-11-17。ローカルの実装・検証を完了。公開Actionsと実URLの確認はこれから行います。実数と段階の正本は[deployment-results.json](deployment-results.json)です。

## 実装したこと

- TOP10→日本地図→DISCOVER3県へ整理。日英のhome・商品一覧・産地一覧に共通適用。
- CC0由来の47県形状と、実商品がある24県を対応。hover/focus/tapで代表単体AI画像・価格・商品数が変わり、その県の商品へ進める。地図ジャンプ、行き先select、地方別一覧、JSなしの通常リンクも用意。
- 店舗Googleマップを最大560px幅・330px高、スマホ280px高へ拡大。初回の明示許可後は全店舗・日英で30日間自動表示。拒否・撤回・期限・旧版・不正値・Storage拒否を処理し、Privacyからも設定を変更可能。
- [残タスク](remaining-task-audit-v17.md)と[法務](legal-review-v17.md)を再点検。商用ホスト用ヘッダーと[移行手順](commercial-host-migration-v17.md)を準備。本人・契約・権利・アカウントに依存する事項を制作の完了と区別。

商品60/登録66・24県・出典293・33店舗/53商品の訪問案内・AI画像118は継承。商品事実・価格・購入根拠・画像を増減していません。[保持検査](discovery-map-stage-preservation-results.json)で正本15ファイルと118画像のbytesを旧Gitへ照合しています。

## ローカル検証

| 対象 | 実測 |
| --- | --- |
| 最終静的検証 | [pnpm verify](discovery-map-stage-static-results.json)：型141ファイルでerror/warning/hint0、unit149/149、344HTML・470生成物 |
| 商品・分類・絞込・比較・JSなし | [617/617](discovery-map-stage-quality-results.json)、60商品/360詳細、地域種類282往復、axe30画面違反0 |
| 日本地図 | [193/193](discovery-map-stage-japan-map-results.json)、47形状/24県、日英×3面×3幅、選択188、実touch/noJS、axe6画面違反0 |
| 地図の表示設定 | [22/22](discovery-map-stage-map-preferences-results.json)、6responsive flow、無効6、Storage全面拒否2＋書込拒否1、タブ同期・Privacy全撤回、悪意URL3、noJS2、開いたまま期限切れ。axe8画面違反0 |
| スマホ/横向き/keyboard | [92/92](discovery-map-stage-mobile-results.json)、7viewport・日英、出典120・種類画像112、axe10画面違反0、実Maps2 |
| 実際のGoogleマップ | [9/9](discovery-map-stage-inline-maps-results.json)、8表示で日英/320/1440のGoogle帰属を確認、悪意provider1拒否。地図を閉じて再読込するとoff |
| 出典/HTML | [328/328](discovery-map-stage-sources-results.json)、最終distと全生HTML SHA一致、出典448一覧/1580records |
| SEO | [328正規URL](discovery-map-stage-seo-results.json)、相互canonical/hreflang/JSON-LD/sitemap、120商品画像、16noindex |
| 広告切替 | [隔離6/6](discovery-map-stage-ad-build-results.json)、承認/停止/不許可host/言語/市場・通常fallback、本番catalog/dist不変。現在は未申請通常URL/AdSense off |
| 画像と広告Privacy | [人物59/59](discovery-map-stage-editorial-images-results.json)・[単体61/61](discovery-map-stage-detail-images-results.json)・[Privacy4/4](discovery-map-stage-privacy-results.json) |
| 既知依存脆弱性 | [最新audit](discovery-map-stage-dependency-audit-results.json)、348依存・全severity0 |
| 移行用HTTPヘッダー | [7/7](discovery-map-stage-migration-headers-results.json)。対応ホストを模したloopback配信で実応答/親frame拒否/商品自身のGoogle許可を確認。GitHubへ適用済みという結果ではない |

### 最後の法務追補との対応

広範囲617・地図193・表示設定22・mobile92・Maps9・広告6・移行7の後に、日英PrivacyへGoogleの処理主体名を各1段落だけ追加しました。[厳密差分](discovery-map-stage-provider-clarification-delta.json)は470生成物中468ファイルのSHA不変を確認し、変更した2HTMLもその段落を取り除くと旧bytesと完全一致。JS/CSP/style/metadata/URLは不変です。その後の最終verify141/149、Source328と[Privacy4画面](discovery-map-stage-provider-privacy-results.json)（JAEN/320/1440・axe2画面違反0）が追補を確認しました。広範囲617を追補後にも再走査したとは扱いません。

## 途中で確認したこと

- 初回地図193/193後、狭幅で選択結果が画面外に隠れる点を改善し、明示tap/Enter後のカード可視を追加して再193/193。
- 読み取りだけできるStorageに旧許可が残る境界を補強。一時値で書込可否を確認して即削除し、他タブの新しい拒否を古い値で上書きしない。書込不可は自動復帰させず、明示選択をそのページ内だけに適用。
- 表示設定検査の初回/再走査20/21は、EN1440でdriverのヘッダー自動スクロール後にpointerが主documentへ届かなかったケース。原記録を保持し、固定sleep/force/DOMclickではなく、scroll位置とhit-testの条件を確認してnative mouse入力を記録。主documentへのpointerdown/up/click・正常言語遷移を確認し、全22成功。
- 移行ヘッダー検査の初回5/7はmeta属性名を大文字固定で検索したQA側の誤り。HTMLの大小文字を区別しない照合へ修正して全7成功。初回raw/logはprivate artifactsへ保持。

## 法務と残る運営条件

[法務の一次資料23件・判断13項目](legal-review-v17.json)と[e-Gov現行XML追補](legal-egov-followup-v17.json)を記録。外部送信・ステマ/広告・Google Maps/同意・著作権/AI・特商法・ホスト契約を分けて確認しました。初回の本文取得失敗と、公式APIで取得できた3法令・対象5条文も区別しています。

GitHub Pagesの商用用途適合、適用される場合の実主体/権利対応情報、実広告アカウント/CMP・本人契約・MFA等は未完了です。全法域・全画像権利、実機iOS/Safari、将来在庫、検索掲載/順位、AdSense審査を認定する検査ではありません。具体的な次の作業は[棚卸し](remaining-task-audit-v17.md)と[移行準備](commercial-host-migration-v17.md)から確認できます。

## 公開・納品

現在は公開後の検証と最終ZIPの作成前です。Actions成功・実URL/全HTML画像の照合、ソースexport/ZIPの全件SHAを確認して追記します。旧0.16の実測は[保存版](verification-v16.md)・[旧deployment](deployment-v16-before-map.json)を保持しています。
