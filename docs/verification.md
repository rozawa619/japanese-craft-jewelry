# 検証結果 — 0.17.3・地図枠とトップ写真022

2026-11-17。[仕様022](../specs/022-compact-map-and-natural-hero/spec.md)、公開app/Actions/納品の正本は[deployment-results.json](deployment-results.json)。前の0.17.2は[保存版](verification-v19-before-compact-layout.md)・[旧deployment](deployment-v19-before-compact-layout.json)。

## 変更

「日本の『ここ』へ行くなら。」の枠を最大1040pxへ、主図を本州〜北海道の最大480×540pxへ縮小。沖縄は既存CC0原形を別枠へ移し、島/ラベル/枠全体から直接産地へ進む通常リンクに。元47形状/掲載24県を保ち、zoom/内部scroll・hover/focus/select preview・noJSも維持。

ホーム写真は全幅/自然比率のheight:autoに変更し、写真内とfigure/AIcaption前後の人工的な上下帯を除去。顔やジュエリーを切り取らず、AI表記・24県の画像/価格切替・query/言語/historyを維持。最小幅の行gapを4px調整し、英語320pxでも初期画面に地図150px以上を表示。

## 最終ローカル

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| type/schema/unit/build/link/CSP | 146files・0 error/warning/hint、149/149、344HTML/471生成物 | [static](compact-layout-stage-static-results.json) |
| 一覧地図・沖縄独立枠 | 241/241、47原形/24県・native操作・zoom/touch/noJS、axe違反0 | [map](compact-layout-stage-map-results.json) |
| Hero自然比率 | 77/77、24県の画像/商品/価格、上下letterbox0・AIcaption維持、axe4違反0 | [hero](compact-layout-stage-hero-results.json) |
| スマホ全体 | 92/92、日英7viewport/6route、Source操作120・種類画像112、axe10違反0・実Maps2 | [mobile](compact-layout-stage-mobile-results.json) |
| 出典/生HTML | 328/328・全正規URL raw SHA一致 | [sources](compact-layout-stage-sources-results.json) |
| SEO | 328canonical・相互hreflang・sitemap・120商品画像・16noindex、error0 | [SEO](compact-layout-stage-seo-results.json) |
| 変更保全 | 6/6、494入力のうち2UI/版番号だけ変更、他491不変・118画像不変 | [preservation](compact-layout-stage-preservation-results.json) |
| 画像/広告off | 人物59/59・単体61/61・Privacy4/4 | [人物](compact-layout-stage-editorial-images-results.json)・[単体](compact-layout-stage-detail-images-results.json)・[Privacy](compact-layout-stage-privacy-results.json) |
| 引継ぎ文書 | 49ファイルのlocal link/heading/command | [docs](compact-layout-stage-docs-results.json) |

[枠の新旧比較](compact-layout-stage-size-comparison-results.json)は、旧8HTMLすべてのSHAが0.17.2manifestに一致した[baseline](compact-layout-stage-before-metrics.json)と同じ条件を対応付ける。PCでは外枠高が約30%縮小、390幅では約5%縮小。幅・言語で実寸は異なり、全端末で同率とは説明しない。沖縄枠はPC144px・スマホ最低80px（390幅実測94.8px）。

[source baseline](compact-layout-stage-source-baseline.json)・[最終manifest](compact-layout-stage-build-manifest.json)により、商品・価格・出典・公式URL・店舗/Google表示設定・広告/Privacy・依存設定・Top10/DISCOVERの共通写真styleを維持。Heroはstyle以外のHTML/JSもbyte同一。旧021写真37を022の再実行件数へ加算しない。

## 途中の修正

HTML/SVG共通リンクのpointer eventで型error1を検出し、property guardへ修正後にverify全体を再実行。Hero初回[76/77](compact-layout-stage-hero-first-attempt-results.json)はEN320の地図可視147.52pxが150px基準を2.48px下回ったため、写真を縮めず行gapを4px詰めて全77再実行。Map初回[239/241](compact-layout-stage-map-first-pointer-results.json)は数学的fillの最初の点が隣県strokeに重なるdriver問題。[診断](compact-layout-stage-pointer-diagnostic-results.json)で可視Tokyo点を複数確認し、実hit-testを通る座標へnative入力するQAへ改善して全件再走査。force/DOMclickは使わない。4px調整前の[mobile92](compact-layout-stage-mobile-before-gap-results.json)も保存し、最終buildでも92を再実行。

## 公開・納品

<!-- TODO_PUBLIC_022 -->

全source ZIPはjapanese-craft-jewelry-source-0.17.3-compact-022.zip、外部proofはpackage-verification-0.17.3-compact-022.json。集合/全SHA・fileCount/statusはdeployment-resultsのsourceDeliveryと外部proofが正本。今回新bitmapはなし。

Chrome emulationであり実機iOS/Safari・検索順位/離脱率/売上・将来在庫・AdSense審査の保証ではない。[法務/運営残条件](remaining-task-audit-v17.md)をUI合格で完了扱いにしない。
