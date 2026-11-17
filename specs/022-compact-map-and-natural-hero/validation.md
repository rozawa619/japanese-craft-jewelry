# 022 最終検証と納品

2026-11-17。app `ef8ae160e7fc7d2b41cdce1063094313b719df6e`、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success。[検証一覧](../../docs/verification.md)・[機械可読正本](../../docs/deployment-results.json)を参照。

## 確定結果

| 対象 | ローカル | 実公開 | 証跡 |
| --- | --- | --- | --- |
| 一覧地図/沖縄 | 241/241 | 241/241 | [local](../../docs/compact-layout-stage-map-results.json)・[public](../../docs/compact-layout-stage-hosted-map-results.json) |
| 自然比率Hero | 77/77 | 77/77 | [local](../../docs/compact-layout-stage-hero-results.json)・[public](../../docs/compact-layout-stage-hosted-hero-results.json) |
| スマホ全体 | 92/92 | 92/92 | [local](../../docs/compact-layout-stage-mobile-results.json)・[public](../../docs/compact-layout-stage-hosted-mobile-results.json) |
| Sources/生HTML | 328/328 | 328/328 | [local](../../docs/compact-layout-stage-sources-results.json)・[public](../../docs/compact-layout-stage-hosted-sources-results.json) |
| 公開補足 | — | 24/24・118画像SHA | [release](../../docs/compact-layout-stage-hosted-release-results.json) |
| 保全/生成物 | 6/6 | 最終471 SHA不変 | [source](../../docs/compact-layout-stage-preservation-results.json)・[integrity](../../docs/compact-layout-stage-final-output-integrity.json) |
| 型/単体/build/SEO | 146files0 error/warning/hint・149/149・344HTML・328canonical | CI成功 | [static](../../docs/compact-layout-stage-static-results.json)・[SEO](../../docs/compact-layout-stage-seo-results.json) |

## 何を測定したか

Map241：日英home/objects/places×320/390/1440、元47path/一意24県・未掲載非リンク、native遷移54・select192・zoom6・実touchpan2・geometry18・沖縄追加6・axe6違反0。島/label/枠/Enter/noJSで直接産地へ進む。force/DOMclickを使わず、fill内かつelementFromPointが実際に該当a内へhitする座標へnative入力。

Hero77：全24県の画像/asset/alt/寸法・商品/価格metadata/単位・CTA、query/他query/hash/言語/popstate、hover/focus不変・click/Enter/Space/touch/noJS、axe4違反0。174paint測定で上下letterbox/figure/caption前後余白0px、自然比率誤差最大0.0104px。EN320の初期地図可視量151.52pxで150px基準を維持。

Mobile92：日英7viewport/6route・Source操作120・種類画像112・axe10違反0・実Google Maps2・16SS。Chrome emulationで、実機iOS/Safariではない。公開328生HTMLと118画像SHAは最終localに一致、検査中の再buildはしていない。

## 枠と写真の比較

[比較8件](../../docs/compact-layout-stage-size-comparison-results.json)は[旧0.17.2の採寸](../../docs/compact-layout-stage-before-metrics.json)と同じ条件を対応付ける。PC外枠1280×約1324→1040×約913〜930、高さ29.76〜31.08%減。390幅は350×約1274〜1313→350×約1205〜1243、約5.36〜5.44%減。主図は480×539.31/316×355.05。沖縄はPC144px・スマホ最低80px（390実測94.8px）で本体遮蔽0。全端末が同率で縮むとは説明しない。

Heroは固定470/420/330/200/180pxを廃止しheight:auto。PC写真内の約91.18pxの帯を除去、顔/耳/ジュエリーのcropや歪みは加えていない。AIcaptionを保持。Top10/DISCOVERの共通300×200/222×148は変更しない。

## 失敗・修正・保持

型error1はHTML/SVG unionのEvent property guardへ修正し全verify再実行。Hero初回76/77はEN320可視147.52pxだったため、写真を縮めず<=360 row-gap14→10pxにして全77成功。Map初回239/241は最初の数学fill点が隣県strokeに隠れたdriver問題。複数の可視Tokyo点を[診断](../../docs/compact-layout-stage-pointer-diagnostic-results.json)し、実hit検査へ改善して全241成功。初回rawと4px調整前mobile92を保持し、最終buildで全92も再実行。

保全6は494入力中のMap/Hero/版番号だけ変更、他491不変。Heroはstyle外のHTML/JS byte同一、商品/価格/出典/画像/店舗Google設定/広告Privacy/依存設定を維持、118画像SHA不変。旧021の37/92や020の217/77を今回再実行と呼ばない。

## 再現と引継ぎ

安定originをCHECK_BASE_URL、baseをPUBLIC_BASE_PATHへ設定しnode scripts/check-japan-map.mjs、node scripts/check-region-hero.mjs、node scripts/check-compact-layout-preservation.mjsを実行する。CHECK_REPORT_PATH/CHECK_SCREENSHOT_PREFIXは022専用へ。CHECK_TOP10_BASELINE_REPORT_PATHは未設定にし、0.17.0の旧画像縮小比を今回のMap検査に持ち込まない。[setup](../../docs/setup.md)・[編集説明](../../docs/compact-layout-v20.md)を参照。

全source ZIPはjapanese-craft-jewelry-source-0.17.3-compact-022.zip、外部proofはpackage-verification-0.17.3-compact-022.json。fileCount/status・集合/全SHAはdeployment-resultsのsourceDeliveryと外部proofが正本。自己ZIP hashを内部へ書かない。今回新bitmapなし、0.16元PNG ZIPも保持。

検索順位/離脱率/売上/AdSense・全法域適合を認定する検査ではない。[運営の残条件](../../docs/remaining-task-audit-v17.md)は継承。
