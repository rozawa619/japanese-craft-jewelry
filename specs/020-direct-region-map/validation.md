# 020 地図・Hero・沖縄枠の検証記録

2026-11-17。020の最終appは0.17.1/8b53114d622312392c7e6ebd97928481b4dd02ae、[Actions44069624893](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44069624893) completed/success。写真をさらに大きく統一する追加依頼は[021](../021-unified-region-photos/validation.md)へ移り、全source納品も最新版0.17.2に含める。

## 020の最終実測

| 項目 | 結果 | 証跡 |
| --- | --- | --- |
| 型/単体/build | 143files・0 error/warning/hint、149/149、344HTML | [static](../../docs/click-map-stage-static-results.json) |
| 一覧地図/Top10 | local217/217、32native遷移・zoom6・touchpan2、180写真の縦letterbox0 | [map](../../docs/click-map-stage-results.json) |
| Hero/沖縄独立枠 | local/public77/77、172状態・124切替・47原形/24選択・axe4違反0 | [local](../../docs/click-map-stage-hero-results.json)・[public](../../docs/click-map-stage-hosted-hero-results.json) |
| スマホ全体 | local92/92、日英7viewport/6route、axe10違反0・実Maps2 | [mobile](../../docs/click-map-stage-mobile-results.json) |
| 出典/HTML/公開補足 | local/public328/328、公開24/24・118画像SHA | [Source](../../docs/click-map-stage-hosted-sources-results.json)・[補足](../../docs/click-map-stage-hosted-release-results.json) |

主地図は初期Hero比1.53〜1.72倍、沖縄枠80px/200pxで本体遮蔽0。元CC0の47pathを本体46＋沖縄1へ移動/拡大し、24controlsは一意。島path・枠・label・Enter/Space/touch/noJS、query/hash/言語/popstateと画像/商品/価格の同期を確認。大きい一覧地図のclickはnative直接遷移、Heroのclickは画像選択として区別する。

## 中止と前段階

公開mapは146件PASS、mobileは61件PASSまで進んだ時点で、写真サイズ統一のユーザー追加依頼により停止。失敗による中止でも全217/92公開完了でもない。[段階記録](../../docs/deployment-v18-before-unified-photos.json)と[map中止記録](../../docs/click-map-stage-hosted-map-superseded-size-results.json)を参照。mobile中止logはartifacts/click-map-stage/hosted-mobile-superseded-size.logへ保持。

初回R1〜R10のebacc3e/Actions44065533062では公開217/69/92/328/24が成功し、[before-refine集約](../../docs/click-map-stage-before-refine-hosted-summary.json)へ分離。R11/R12で生じた英語label不一致は[Hero75/77](../../docs/click-map-stage-hero-failed-label-results.json)・[mobile91/92](../../docs/click-map-stage-mobile-failed-label-results.json)を保全。visiblelabelとariaを一元化して全77/92再走査成功。[重点4画面](../../docs/click-map-stage-label-fix-focus-results.json)も成功し、QA helperのnewContext未使用errorとアプリ不備を区別した。

## 021への引継ぎ

021はRegionSelectionのscoped styleと版番号だけを変更。[保全8検査](../../docs/region-photos-stage-preservation-results.json)がHero/一覧地図を含む他492入力・全1453script・118画像の不変を確認した。写真300×200/222×148の新サイズは新規37検査/390画像とmobile92・公開HTML照合で確認し、旧217/77の件数を再実行と呼ばない。

最終public/全source ZIP・外部proofは[021 validation](../021-unified-region-photos/validation.md)と[deployment-results](../../docs/deployment-results.json)のsourceDeliveryを正本にする。020専用ZIPを完成させたという意味ではない。Chrome emulationは実機iOS/Safariの認定ではなく、検索順位/離脱率/AdSenseや法的適合の保証をしない。
