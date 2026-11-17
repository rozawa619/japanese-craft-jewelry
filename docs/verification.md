# 検証結果 — 0.17.1・地図と着用画像020

2026-11-17。仕様は[020](../specs/020-direct-region-map/spec.md)、実数・公開app・Actions・納品の正本は[deployment-results.json](deployment-results.json)です。旧0.17.0は[検証保存版](verification-v17.md)・[旧deployment](deployment-v17-before-direct-map.json)に残しています。

## 実装と測定

- ホーム先頭はPCで左に女性の着用AI画像、右に日本地図。掲載24県をclick/tap/Enter/Spaceで選ぶと、その県の代表商品の画像・商品名・国内JPY参考価格・商品/産地リンクが切り替わる。hover/focusのみでは変更しない。`?region=`は有効な公開地域だけを受け入れ、言語切替・履歴で保持する。
- スマホでは顔と耳を切らずに全幅の人物画像を表示し、その下に商品情報と地図を並べる。320/390pxでも初期画面に画像と地図が見えることを実ブラウザーで測定。
- TOP10後の一覧地図は最大約758×895pxの実測表示。100/150/200/300%と内部scrollを備え、県の通常リンクをclick/tap/Enterすると直接その県の商品一覧へ進む。JSなし・修飾click・地方別一覧も保持する。
- TOP10の画像をPC180px・スマホ110px/狭幅98px以内のcontain表示へ変更。旧公開0.17.0の全画像decode後の[実測基準](click-map-stage-top10-baseline-results.json)と比較し、10行の合計高がPC約63%、スマホ約22〜30%減少。訪問者の離脱率や売上を測定したという意味ではない。

新商品・新bitmapはありません。公開60/登録66商品・24県・118画像、購入根拠・公式URL・価格・店舗・広告/Google Maps表示設定は継承しました。

## 最終ローカル検証

| 検査 | 結果 | 証跡 |
| --- | --- | --- |
| type/schema/unit/build/link/CSP | 143 files・0 error/warning/hint、149/149 unit、344HTML | [static](click-map-stage-static-results.json) |
| 大きい地図・直接遷移・Top10 | 217/217、24県・日英3画面3幅、32実遷移、zoom6・touch pan2、180画像 | [map](click-map-stage-results.json) |
| トップ画像連動 | 69/69、90選択・26画像変更、日英4幅、初期画面8、axe4違反0 | [hero](click-map-stage-hero-results.json) |
| スマホ・横向き・既存UI | 92/92、7viewport・日英、source120・種類画像112、axe10違反0、実Googleマップ2 | [mobile](click-map-stage-mobile-results.json) |
| 出典の折畳み/正規HTML | 328/328、120商品画面、全328 raw HTML SHA一致 | [sources](click-map-stage-sources-results.json) |
| SEO metadata | 328正規URL・相互hreflang・sitemap、120商品画像、16noindex、error0 | [seo](click-map-stage-seo-results.json) |
| 既存画像・広告off | 人物59/59、単体61/61、Privacy4/4 | [人物](click-map-stage-editorial-images-results.json)・[単体](click-map-stage-detail-images-results.json)・[Privacy](click-map-stage-privacy-results.json) |
| 文書 | 39ファイルのlocal link/heading/commandを検査 | [docs](click-map-stage-docs-results.json) |

最初のverifyにQA helperの未使用変数hint1がありました。該当2変数とimportを削除後、アプリ/build入力を変えずにtype/schema全体を再実行して0 error/warning/hintを確認しました。後からverify全体を再実行したとは記録しません。

[保全照合](click-map-stage-preservation-results.json)は商品・価格・画像台帳・店舗/Google表示設定等22正本のSHAと118画像bytesの不変を確認。[最終build manifest](click-map-stage-build-manifest.json)は471生成物/344HTML/118WebPです。共有CSSと全ページ共通CSPの更新により344HTMLが変わっており、全商品HTMLが旧版と同一とは説明しません。

途中の199件地図検査と旧ホームの92件はbefore-heroとして区別。現在のアプリに対する地図217・hero69・mobile92・source328・SEOは上表です。旧0.17.0のquality617・map193・表示設定22等は保存版の証跡であり、今回の実行件数に加算しません。

## 公開・納品

<!-- TODO_RELEASE_020 -->
最終ローカル検証済み。Actions、実URL検証、全source ZIPの最終照合は完了後に追記します。

## 検証の限界

Chromeのdesktop/mobile emulationです。実機iOS/Safari、検索順位、アクセス/離脱率、将来在庫、AdSense審査の保証ではありません。新しい解析/追跡を追加していません。[法務](legal-review-v17.md)・[運営残条件](remaining-task-audit-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)の未完了事項は継承し、今回のUI検証で完了扱いにしていません。
