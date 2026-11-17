# 検証記録

開始基準は公開0.17.0 app b8edee4、repo HEAD83205bb8。商品60/24県/118画像と店舗Google Mapsの30日設定を維持し、日本地図の表示・操作、ホーム先頭の画像/地図Hero、TOP10の表示を更新した。

**最新状態：R11/R12の追加改修版は検証・公開・ZIP未完了。** 初回R1〜R10のebacc3eは公開検査まで完了したが、そのPASSを写真letterbox削減/行高維持、Hero地図拡大/沖縄独立枠の検証として流用しない。以下の初回結果はbefore-refineへ保存した旧段階の証跡。最新の寸法・件数・再公開結果は追加改修後に確定する。

019の日本地図193/設定22/mobile92等は当時の結果。今回の直接click/touch/Enter、拡大/内部scrollを確認済みとは読み替えない。今回のrootによる型/単体/buildと専用QA、公開、納品はclick-map-stageの新reportへ記録する。

## 初回R1〜R10のローカル（追加改修前）

初回の`pnpm verify`は型143ファイルでエラー0、単体149件PASS、344HTMLを生成。追加改修前の専用検査は次のとおり。追加改修版や公開URLの成功を示すものではない。

| 対象 | 最終結果 | 証跡 |
| --- | --- | --- |
| 一覧地図の直接遷移・拡大・内部scroll | 217/217、日英/3 surface/3 viewport、47形状/掲載24県、native遷移32件 | [地図](../../docs/click-map-stage-before-refine-results.json) |
| ホームHero | 69/69、日英/4 viewport/全24県、選択90件、画像切替26件 | [Hero](../../docs/click-map-stage-before-refine-hero-results.json) |
| スマホ/横画面等 | 92/92、日英/7 viewport/代表6 route、axe10画面で違反0 | [mobile](../../docs/click-map-stage-before-refine-mobile-results.json) |
| 出典一覧 | 328/328、HTML SHA照合328件、商品120ページ | [Sources](../../docs/click-map-stage-before-refine-sources-results.json) |
| SEO | PASS | [SEO](../../docs/click-map-stage-before-refine-seo-results.json) |

mobileのviewportは320×740、360×780、390×844、768×1024、768×430、667×375、1440×1000。home/商品一覧/神奈川/商品2種/Privacyを確認した。Heroと一覧地図は別検査で操作契約を確認し、両検査のpage/console errorと意図しない外部通信は0。全域のbrowser error監視をmobile92件単独の成果としては扱わない。

初回TOP10 sectionの高さは[従来版の6測定](../../docs/click-map-stage-top10-baseline-results.json)とbefore-refineの地図/Hero reportを比較し、PC約63%、スマホ約22〜30%減。R11の自然比率写真を反映した最終値は再計算待ち。この比較は表示寸法の比較であり、訪問数・離脱率・購入率・検索順位の改善測定ではない。初回の入力/画像保持は[維持検査](../../docs/click-map-stage-before-refine-preservation-results.json)・[人物画像](../../docs/click-map-stage-before-refine-editorial-images-results.json)・[単体画像](../../docs/click-map-stage-before-refine-detail-images-results.json)を参照。途中/修正前のreportも履歴として保持し、最終結果へ読み替えない。

ブラウザ検査はChrome emulationで、実機Safari/iOSの検証ではない。小さな県は拡大・44px操作のselect/一覧も使える。AI画像のcontain確認は、描写が実商品に完全一致することの証明ではない。

## 公開後

初回R1〜R10のアプリはebacc3e0df9bbd80f3f820499be9cc3fb3436cb9、[Actions44065533062](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44065533062)がcompleted/success。公開地図217/217・Hero69/69・mobile92/92・Source328/328・補足24/24を確認済み。公開328正規URL/118画像の照合は初回公開補足の範囲で、R11/R12の新しい表示/操作の成果ではない。

初回公開の証跡は[集約](../../docs/click-map-stage-before-refine-hosted-summary.json)・[地図](../../docs/click-map-stage-before-refine-hosted-map-results.json)・[Hero](../../docs/click-map-stage-before-refine-hosted-hero-results.json)・[mobile](../../docs/click-map-stage-before-refine-hosted-mobile-results.json)・[Sources](../../docs/click-map-stage-before-refine-hosted-sources-results.json)・[補足](../../docs/click-map-stage-before-refine-hosted-release-results.json)。旧ログはartifacts/click-map-stage/before-refine/へ保存。追加改修版のGit/Actions・実URLの再確認は未実施。

## 引継ぎと納品

新[操作説明](../../docs/japan-map-direct-v18.md)とSDDへR11/R12を追記。現在入口8文書と公開app/Actionsの最終状態はrootが更新する。追加改修版のsource ZIP/外部proofは未作成。予定版付きsource ZIP名はjapanese-craft-jewelry-source-0.17.1-direct-020.zip、外部proof名はpackage-verification-0.17.1-direct-020.json。名前だけで検証完了にせず、最終集合/全SHAと確定状態はdeployment-resultsのsourceDeliveryと外部proofを正本にする。

## 追加Hero/TOP10の検証範囲

ホーム先頭のモデル/日本地図は、一覧の日本地図とは別の操作契約。Heroでは明示県選択が画像を切り替え、一覧では直接遷移する。初期Kyoto/selection.heroProductId、全24県のasset/src/alt/寸法・商品URL/タイトル・MarketPrice metadata/単位・地域CTA、hover/focus不変、click/tap/Enter/Space、region query/他query/hash/言語/popstate、不正id、noJS、狭幅/PCと顔耳のcontainを初回のローカル/公開Hero reportで独立確認した。追加改修後は再検証する。

追加responsive条件：480px以下は女性写真を全幅180〜200px高、その下の商品小情報左/地図右で確認した。model-panelはdisplay:contentsのためwrapperのbboxではなくimage-frame/map-panelの可視領域・実際の画像paint/containを測定。320×740では地図下端が初期画面より下になるため、写真と地図の全体が常に1画面へ収まるとは主張しない。通常の縦スクロールで全操作へ到達できる。

## R11/R12の最終ローカル検証

- R11：原本bytes/AIcaption/自然比率を維持し、顔・耳・ジュエリーを切らず、TOP10の行高・行間を保ちながら写真の上下letterboxを減らす。日英PC/スマホで実画像paintと行高/行間を改修前と比較し、確定寸法とsection高の比較率を再記録する。
- R12：Hero地図の表示拡大と沖縄独立枠の可視性、日英の移動・拡大図の注記、既存CC0 geometryとunique47県/掲載24県、未掲載県非リンクを確認する。沖縄枠のclick/tap/Enter/Spaceが女性画像・asset/alt/寸法・商品/価格・産地CTA・region queryを揃え、hover/focusでは変えないこと、query/hash/言語/popstate/noJS、focusと狭幅overflowを確認する。
- 回帰：全地域のHero選択・一覧地図のnative直接遷移/zoom/pan・mobile・Sources・SEO・画像/商品入力保持を必要範囲で再確認。旧結果はbefore-refineに保持し、元のclick-map-stage-*-resultsを追加改修後の最終reportへ更新する。
- 公開/納品：追加改修版のActions成功、実URLの新表示/操作/生成物、現在文書、全source ZIP集合/全SHAが揃ってから完了にする。最新の件数・寸法・成功結果はまだ未確定。

### R11/R12確定結果

最終verifyは143型ファイル0 error/warning/hint・149/149単体・344HTML。[地図217/217](../../docs/click-map-stage-results.json)（180写真の上下letterbox0px）・[Hero77/77](../../docs/click-map-stage-hero-results.json)（172状態/124切替・47原形/24選択・axe4違反0）・[mobile92/92](../../docs/click-map-stage-mobile-results.json)（axe10違反0/実Maps2）・[Source328/328](../../docs/click-map-stage-sources-results.json)・[SEO](../../docs/click-map-stage-seo-results.json)が成功。

[写真比較](../../docs/click-map-stage-top10-fill-comparison-results.json)：PC実描画約1.8倍、244px行高維持、180画像の縦letterbox0。最初の0.17.0の大きいTop10全体からはPC約63%・スマホ約17〜27%短縮。間のコンパクト版から写真を拡大した分、mobileの行は一部わずかに高くなる。Hero主地図は旧比1.53〜1.72倍、沖縄枠80px/200pxで本体被覆0。

英語label不一致の初回Hero75/77・mobile91/92はfailed-labelとして保存。修正後に全77/92を再走査、重点4画面も成功。QA helperのnewContext未使用driver失敗と、アプリのlabel不備は別の原記録として保持。公開/ZIPは次の確定記録を参照し、ローカル結果だけで完了扱いにしない。
