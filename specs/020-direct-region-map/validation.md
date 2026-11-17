# 検証記録

開始基準は公開0.17.0 app b8edee4、repo HEAD83205bb8。商品60/24県/118画像と店舗Google Mapsの30日設定を維持し、日本地図の表示・操作、ホーム先頭の画像/地図Hero、TOP10の表示を更新した。

019の日本地図193/設定22/mobile92等は当時の結果。今回の直接click/touch/Enter、拡大/内部scrollを確認済みとは読み替えない。今回のrootによる型/単体/buildと専用QA、公開、納品はclick-map-stageの新reportへ記録する。

## ローカル

最終の`pnpm verify`は型143ファイルでエラー0、単体149件PASS、344HTMLを生成。専用検査の最終結果は次のとおり。公開URLの成功を示すものではない。

| 対象 | 最終結果 | 証跡 |
| --- | --- | --- |
| 一覧地図の直接遷移・拡大・内部scroll | 217/217、日英/3 surface/3 viewport、47形状/掲載24県、native遷移32件 | [地図](../../docs/click-map-stage-results.json) |
| ホームHero | 69/69、日英/4 viewport/全24県、選択90件、画像切替26件 | [Hero](../../docs/click-map-stage-hero-results.json) |
| スマホ/横画面等 | 92/92、日英/7 viewport/代表6 route、axe10画面で違反0 | [mobile](../../docs/click-map-stage-mobile-results.json) |
| 出典一覧 | 328/328、HTML SHA照合328件、商品120ページ | [Sources](../../docs/click-map-stage-sources-results.json) |
| SEO | PASS | [SEO](../../docs/click-map-stage-seo-results.json) |

mobileのviewportは320×740、360×780、390×844、768×1024、768×430、667×375、1440×1000。home/商品一覧/神奈川/商品2種/Privacyを確認した。Heroと一覧地図は別検査で操作契約を確認し、両検査のpage/console errorと意図しない外部通信は0。全域のbrowser error監視をmobile92件単独の成果としては扱わない。

TOP10 sectionの高さは[従来版の6測定](../../docs/click-map-stage-top10-baseline-results.json)と最終地図/Hero reportを比較し、PC約63%、スマホ約22〜30%減。これは表示寸法の比較であり、訪問数・離脱率・購入率・検索順位の改善測定ではない。入力/画像の保持は[維持検査](../../docs/click-map-stage-preservation-results.json)・[人物画像](../../docs/click-map-stage-editorial-images-results.json)・[単体画像](../../docs/click-map-stage-detail-images-results.json)を参照。途中/修正前のreportも履歴として保持し、最終結果へ読み替えない。

ブラウザ検査はChrome emulationで、実機Safari/iOSの検証ではない。小さな県は拡大・44px操作のselect/一覧も使える。AI画像のcontain確認は、描写が実商品に完全一致することの証明ではない。

## 公開後

未実施。Actions成功と実URLのhref/操作/生成物を確認後に追記する。

## 引継ぎと納品

現在入口8文書、新[操作説明](../../docs/japan-map-direct-v18.md)とSDDを更新。公開前の状態をTODO_PUBLIC_V18で示し、公開検証完了後にrootが実app/Actionsへ置換する。予定版付きsource ZIP名はjapanese-craft-jewelry-source-0.17.1-direct-020.zip、外部proof名はpackage-verification-0.17.1-direct-020.json。名前だけで検証完了にせず、最終集合/全SHAと確定状態はdeployment-resultsのsourceDeliveryと外部proofを正本にする。

## 追加Hero/TOP10の検証範囲

ホーム先頭のモデル/日本地図は、一覧の日本地図とは別の操作契約。Heroでは明示県選択が画像を切り替え、一覧では直接遷移する。初期Kyoto/selection.heroProductId、全24県のasset/src/alt/寸法・商品URL/タイトル・MarketPrice metadata/単位・地域CTA、hover/focus不変、click/tap/Enter/Space、region query/他query/hash/言語/popstate、不正id、noJS、狭幅/PCと顔耳のcontainを上記Hero reportで独立確認した。公開後の操作確認は未実施。

追加responsive条件：480px以下は女性写真を全幅180〜200px高、その下の商品小情報左/地図右で確認した。model-panelはdisplay:contentsのためwrapperのbboxではなくimage-frame/map-panelの可視領域・実際の画像paint/containを測定。320×740では地図下端が初期画面より下になるため、写真と地図の全体が常に1画面へ収まるとは主張しない。通常の縦スクロールで全操作へ到達できる。
