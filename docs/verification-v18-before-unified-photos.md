# 検証結果 — 0.17.1・地図と着用画像020

2026-11-17。仕様は[020](../specs/020-direct-region-map/spec.md)、実数・公開app・Actions・納品の正本は[deployment-results.json](deployment-results.json)です。旧0.17.0は[検証保存版](verification-v17.md)・[旧deployment](deployment-v17-before-direct-map.json)に残しています。

## 実装と測定

- ホーム先頭はPCで左に女性の着用AI画像、右に日本地図。掲載24県をclick/tap/Enter/Spaceで選ぶと、その県の代表商品の画像・商品名・国内JPY参考価格・商品/産地リンクが切り替わる。hover/focusのみでは変更しない。`?region=`は有効な公開地域だけを受け入れ、言語切替・履歴で保持する。
- Heroの本体地図は本州〜北海道へ表示範囲を詰めて拡大。沖縄は既存CC0原形を別枠へ移して拡大し、注記・44px以上の入口・島path/ラベルの選択を用意する。47原形/掲載24県を保ち、同じ着用画像/価格/queryへ連動する。
- スマホでは顔と耳を切らずに全幅の人物画像を表示し、その下に商品情報と地図を並べる。320/390pxでも初期画面に画像と地図が見えることを実ブラウザーで測定。
- TOP10後の一覧地図は最大約758×895pxの実測表示。100/150/200/300%と内部scrollを備え、県の通常リンクをclick/tap/Enterすると直接その県の商品一覧へ進む。JSなし・修飾click・地方別一覧も保持する。
- TOP10の画像列をPC最大270pxへ広げ、元の3:2比率でPC最大180px・スマホ最大132pxのcontain表示へ変更。PCの行高/行間を維持し、上下の人工的な帯を除去。旧公開0.17.0の全画像decode後の[実測基準](click-map-stage-top10-baseline-results.json)と比較し、10行の合計高がPC約63%、スマホ約17〜27%減少。訪問者の離脱率や売上を測定したという意味ではない。

新商品・新bitmapはありません。公開60/登録66商品・24県・118画像、購入根拠・公式URL・価格・店舗・広告/Google Maps表示設定は継承しました。

## 最終ローカル検証

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| type/schema/unit/build/link/CSP | 143 files・0 error/warning/hint、149/149 unit、344HTML | [static](click-map-stage-static-results.json) |
| 大きい地図・直接遷移・Top10 | 217/217、24県・日英3画面3幅、32実遷移、zoom6・touch pan2、180画像 | [map](click-map-stage-results.json) |
| トップ画像連動 | 77/77、172選択・124画像変更、日英4幅、初期画面8、axe4違反0 | [hero](click-map-stage-hero-results.json) |
| スマホ・横向き・既存UI | 92/92、7viewport・日英、source120・種類画像112、axe10違反0、実Googleマップ2 | [mobile](click-map-stage-mobile-results.json) |
| 出典の折畳み/正規HTML | 328/328、120商品画面、全328 raw HTML SHA一致 | [sources](click-map-stage-sources-results.json) |
| SEO metadata | 328正規URL・相互hreflang・sitemap、120商品画像、16noindex、error0 | [seo](click-map-stage-seo-results.json) |
| 既存画像・広告off | 人物59/59、単体61/61、Privacy4/4 | [人物](click-map-stage-editorial-images-results.json)・[単体](click-map-stage-detail-images-results.json)・[Privacy](click-map-stage-privacy-results.json) |
| 文書 | 39ファイルのlocal link/heading/commandを検査 | [docs](click-map-stage-docs-results.json) |

改修前の途中verifyにあったQA helperの未使用変数hint1は修正済みです。R11/R12後の最終verifyの実数はstatic reportを参照し、追加前の結果はbefore-refineへ分離します。

[保全照合](click-map-stage-preservation-results.json)は商品・価格・画像台帳・店舗/Google表示設定等22正本のSHAと118画像bytesの不変を確認。[最終build manifest](click-map-stage-build-manifest.json)は471生成物/344HTML/118WebPです。共有CSSと全ページ共通CSPの更新により344HTMLが変わっており、全商品HTMLが旧版と同一とは説明しません。

途中の199件地図検査と旧ホームの92件はbefore-heroとして区別。現在のアプリに対する地図217・hero77・mobile92・source328・SEOは上表です。旧0.17.0のquality617・map193・表示設定22等は保存版の証跡であり、今回の実行件数に加算しません。

## 途中の不備と修正

沖縄の英語可視ラベルとaria-labelの不一致を検出し、同じ表示文字列を正本にしてJS/noJSの名前を統一。初回[Hero75/77](click-map-stage-hero-failed-label-results.json)と[mobile91/92](click-map-stage-mobile-failed-label-results.json)を保持し、修正後は全77・92を再走査して成功しました。一覧地図217のaxeは産地一覧が対象なので、このホームの不備を検出したとは扱いません。[修正重点4画面](click-map-stage-label-fix-focus-results.json)も成功。重点検査の[初回driver error](click-map-stage-label-fix-focus-driver-first-attempt-results.json)は明示browser contextを用いなかったQA helperの問題で、helperを直して4画面を再実行しました。

[写真の新旧比較](click-map-stage-top10-fill-comparison-results.json)は同じ18画面/180画像を対応付け、上下letterbox0px、PCの実描画高98.67→178.66px（約1.8倍）、行高244pxの維持を確認。元画像内部の余白を画像編集で検査したという意味ではありません。

## 公開・納品

<!-- TODO_RELEASE_020 -->
最終ローカル検証済み。Actions、実URL検証、全source ZIPの最終照合は完了後に追記します。

## 検証の限界

Chromeのdesktop/mobile emulationです。実機iOS/Safari、検索順位、アクセス/離脱率、将来在庫、AdSense審査の保証ではありません。新しい解析/追跡を追加していません。[法務](legal-review-v17.md)・[運営残条件](remaining-task-audit-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)の未完了事項は継承し、今回のUI検証で完了扱いにしていません。
