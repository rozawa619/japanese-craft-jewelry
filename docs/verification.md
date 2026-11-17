# 検証結果 — 0.17.2・産地写真の共通サイズ021

2026-11-17。[仕様021](../specs/021-unified-region-photos/spec.md)、公開app/Actions/納品の正本は[deployment-results.json](deployment-results.json)。地図/Hero/沖縄を実装した0.17.1は[段階記録](deployment-v18-before-unified-photos.json)へ保存しています。

## 変更と確認範囲

Top10と「こちらの産地も、見てみませんか。」の3県を、同じ写真・文字・行paddingのstyleに統一。PCは写真列最大300px/自然高最大200px、スマホは最大222×148px。顔やジュエリーを切らず、画像内の人工的な上下帯を除き、Top10の270px列から一回り拡大しました。ホーム・商品セレクト・産地から選ぶの日英すべてに適用します。画像を大きくした分PC行の最低高は244→264px、上下padding18pxは維持。スマホは写真と文字の幅配分を整えています。

## 最終ローカル

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| type/schema/unit/build/link/CSP | 145 files・0 error/warning/hint、149/149、344HTML/471生成物 | [static](region-photos-stage-static-results.json) |
| 写真の統一/実描画 | 37/37、日英3ページ5幅/30条件・390画像、120組のTab、axe6違反0、8画面を目視 | [photos](region-photos-stage-results.json) |
| 変更範囲の保全 | 8/8、494入力のうちstyle/版番号だけ変更、他492不変。344HTMLの全1453script/118画像不変 | [preservation](region-photos-stage-preservation-results.json) |
| スマホ/横向き/既存UI | 92/92、日英7viewport/6route、出典操作120・種類画像112、axe10違反0・実Maps2 | [mobile](region-photos-stage-mobile-results.json) |
| 出典/生HTML | 328/328、全正規URLのraw HTML SHA一致 | [sources](region-photos-stage-sources-results.json) |
| SEO | 328canonical・相互hreflang・sitemap・120商品画像・16noindex、error0 | [seo](region-photos-stage-seo-results.json) |
| 画像と広告off | 人物59/59・単体61/61・Privacy4/4 | [人物](region-photos-stage-editorial-images-results.json)・[単体](region-photos-stage-detail-images-results.json)・[Privacy](region-photos-stage-privacy-results.json) |
| 引継ぎ文書 | 44ファイルのlocal link/heading/command | [docs](region-photos-stage-docs-results.json) |

写真は全13枚/各条件で同じ寸法とpadding、自然比率、縦横letterboxが許容1.5px以内であることを測定。実測の例はPC298×198.66px、390幅で約207×138px（枠borderを除く）。原画像内部の背景を画素解析したという意味ではありません。

[保全baseline](region-photos-stage-preservation-baseline.json)と[最終manifest](region-photos-stage-build-manifest.json)の比較では、出力471のうち変更は6HTMLと共通CSS1本の差替え、他464不変。全scriptの属性/順序/内容SHAも一致。商品/価格/出典/公式URL/店舗情報・118公開画像、Hero・本体地図・Google表示設定・広告/Privacy・依存関係を変更していません。

前段階8b53114の地図217（local）とHero77（local/public）は、それぞれの機能検証として保持。021で再217/77したとは扱わず、実装/実行scriptの不変証明と、新写真37・mobile92・全HTML照合を組み合わせています。新しい写真サイズを旧217/77の成果に加算しません。

写真QAの最初の起動はunquoted YAMLを扱わないreaderでブラウザー開始前に停止しました。QAだけをquoted/unquoted両対応へ直し、37件を実行。アプリ不備と混同せず初回logを保持しています。その後type/schemaも再実行しています。

## 公開・納品

<!-- TODO_PUBLIC_021 -->

全sourceの版付きZIPはjapanese-craft-jewelry-source-0.17.2-unified-021.zip、外部proofはpackage-verification-0.17.2-unified-021.json。確定fileCountとstatusはdeployment-resultsのsourceDeliveryを参照します。

## 限界

Chrome emulationで、実機iOS/Safari、検索順位/離脱率/売上・将来在庫・AdSense審査を保証する検査ではありません。新たな解析/追跡・商品/画像生成を追加していません。[法務/運営残条件](remaining-task-audit-v17.md)と[商用ホスト移行準備](commercial-host-migration-v17.md)は継承します。
