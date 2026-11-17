# 検証記録

2026-11-17。アプリ0.17.2/仕様021。**実装・最終ローカル検証・公開・ZIPは未完了。** 以下の旧段階の実績と、今回の予定/未実施を区別する。

## 開始基準：0.17.1/020

公開app8b53114d622312392c7e6ebd97928481b4dd02ae、[Actions44069624893](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44069624893)はcompleted/success。020最終ローカルは型143ファイル・エラー0/単体149/344HTML、一覧地図217/217・Hero77/77・mobile92/92・Sources328/328・SEO PASS。

8b53114の公開検査はHero77/77・Sources328/328・補足24/24が完了。一覧地図は146件PASS時点、mobileは61件PASS時点で、写真をさらに大きく統一する最新依頼により停止した。停止まで失敗はなく、全217/92完了ともアプリ失敗とも扱わない。mobileの最終完了caseはen-home-768x1024。実ログはartifacts/click-map-stage/hosted-mobile-superseded-size.log、地図の途中証跡は[map superseded-size](../../docs/click-map-stage-hosted-map-superseded-size-results.json)。旧0.17.1の途中/完了reportはrootが保全し、今回の写真QAで上書きして混同しない。

初回ebacc3eの公開map217/Hero69/mobile92等はさらに前のbefore-refine段階。020の[検証記録](../020-direct-region-map/validation.md)と元reportへ戻り、各段階を区別する。

## 021のローカル（未実施）

| 対象 | 確認内容 | 状態 |
| --- | --- | --- |
| 写真専用QA | 日英home/objects/places、TOP10/DISCOVER、自然比率・実paint・統一/巨大画像解消、行高/行間/狭幅overflow、focus/axe | 37checks＝30条件＋axe6＋通信/error1、390画像・Tab focus120sets・8スクリーンショットを予定。実測値は未確定 |
| preservationQA | RegionSelectionのstyle外、HTML/JS・Hero/日本地図・商品正本・118画像のSHA保持 | 未実施 |
| 型/単体/build | 0.17.2の最終入力と出力 | 未実施 |
| mobile | 日英7viewport/代表6routeと出典/種類画像/Maps等 | 92件予定、未実施 |
| Sources/SEO | 出典展開/HTML照合、canonical等の回帰 | Sources328件予定、未実施 |

写真サイズの設計値はdesktop最大300×200px、行padding18px/min-height264px、mobile最大222×148px。実際のpaint/行寸法や比較率は安定buildのreportで確定する。上限値を全端末の実寸とみなさない。旧020のsection高減少率は今回の写真拡大後の値として再利用しない。

写真専用helperはscripts/check-region-photos.mjs。条件は日英×home/objects/places×320/390/768/1024/1440px幅（高さ1000px）、axeは各pageの日英390px、Tabは各条件4row、スクリーンショットは日英homeの390/1440px×TOP10/DISCOVER。13代表をconfig/catalog/画像台帳/両言語の産地本文から独立導出して全390画像を照合する予定。実行前なので成功件数ではない。

rootの安定build後、対応runtimeを用意して次を実行する。公開時はoriginをhttps://rozawa619.github.io、reportをdocs/region-photos-stage-hosted-results.json、prefixをregion-photos-stage-hostedへ変える。

```powershell
$env:CHECK_BASE_URL='http://127.0.0.1:4323'
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:CHECK_REPORT_PATH='docs/region-photos-stage-results.json'
$env:CHECK_SCREENSHOT_PREFIX='region-photos-stage'
node scripts/check-region-photos.mjs
```

旧map217/Hero77はそれぞれの操作検査であり、新写真寸法の成功根拠ではない。今回、該当ソースとgeometryのSHA不変を記録して動作回帰の根拠を示し、写真サイズ/表示は新専用QAとmobileで確認する。Chrome emulationと実機Safari/iOSを区別し、axeの対象画面以外も全て検証済みと主張しない。閲覧数/離脱率/購入率/検索順位は未測定。

## 021の公開（未実施）

最終app/Actionsの成功と実URLの写真統一・スマホ表示・Sources/生成物を確認後、実行reportと確定件数を追記する。0.17.1公開成功を0.17.2公開成功と呼ばない。

## 文書・納品（未完了）

仕様/設計/タスクと[写真表示の引継ぎ](../../docs/region-photos-v19.md)を作成。既存の現在入口8文書、deployment-results/verificationの最終更新はroot担当。

予定ZIPはjapanese-craft-jewelry-source-0.17.2-unified-021.zip、外部proofはpackage-verification-0.17.2-unified-021.json。まだ作成/全SHA照合済みではない。最終の集合・全SHA・公開状態はdeployment-resultsのsourceDeliveryと外部proofを正本にする。
