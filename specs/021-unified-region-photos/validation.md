# 021 最終検証と納品

2026-11-17。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。[正本](../../docs/deployment-results.json)と[検証一覧](../../docs/verification.md)を参照。

## 最終結果

| 検査 | ローカル | 実公開 | 証跡 |
| --- | --- | --- | --- |
| 写真統一 | 37/37 | 37/37 | [local](../../docs/region-photos-stage-results.json)・[public](../../docs/region-photos-stage-hosted-results.json) |
| スマホ全体 | 92/92 | 92/92 | [local](../../docs/region-photos-stage-mobile-results.json)・[public](../../docs/region-photos-stage-hosted-mobile-results.json) |
| Sources/生HTML | 328/328 | 328/328 | [local](../../docs/region-photos-stage-sources-results.json)・[public](../../docs/region-photos-stage-hosted-sources-results.json) |
| 公開補足 | — | 24/24、全118画像SHA | [release](../../docs/region-photos-stage-hosted-release-results.json) |
| 変更保全 | 8/8 | 全471生成物SHA不変 | [preservation](../../docs/region-photos-stage-preservation-results.json)・[final](../../docs/region-photos-stage-final-output-integrity.json) |
| 型/単体/build/SEO | 145files0 error/warning/hint・149/149・344HTML・SEO328canonical | CIも成功 | [static](../../docs/region-photos-stage-static-results.json)・[SEO](../../docs/region-photos-stage-seo-results.json) |

写真37は日英home/objects/places×320/390/768/1024/1440の30条件・390画像、Top10/DISCOVER同寸と行padding、自然比率/縦横letterbox<=1.5px、120組のnativeTab、axe6違反0、8画面目視。PC上限300×200px（実paint約298×199）、390px幅で約207×138。行padding18pxを維持し、写真拡大に合わせPC min-height264px。新しいサイズの成功を旧map217/Hero77へ加算しない。

保全8では494入力のうちRegionSelection scoped styleとpackage版番号の2つのみ変更、他492不変。全344HTMLの1453script（実行1117・JSON等336）の属性/順序/contentSHA一致、118配信画像不変。出力471の変更は6HTMLとCSS1本差替え、他464不変。よって0.17.1のmap217/localとHero77/local/publicを機能回帰の根拠として再利用し、写真は新37/92で確認した。browser中に再buildしない。

## 再現

安定buildのoriginをCHECK_BASE_URL、baseをPUBLIC_BASE_PATHへ指定し、node scripts/check-region-photos.mjs、node scripts/check-region-style-preservation.mjsを実行。reportはCHECK_REPORT_PATH/SCREENSHOT_PREFIXを作業専用に分離する。photoの既定local reportはdocs/region-photos-stage-results.json、公開はdocs/region-photos-stage-hosted-results.json。詳しい環境は[setup](../../docs/setup.md)・[ガイド](../../docs/region-photos-v19.md)。

## 旧段階・失敗・中断

0.17.1/app8b53114/Actions44069624893は[段階記録](../../docs/deployment-v18-before-unified-photos.json)。local217/77/92とpublicHero77/Source328/補足24が成功後、今回の写真統一依頼でpublic map146PASS/mobile61PASS時点で中止。アプリ失敗でも全217/92完了でもない。さらに前のebacc3eはbefore-refineへ分離。写真QAの最初の起動はquoted YAMLだけを扱うreaderでブラウザー前に停止、QAだけを両形式対応へ直して全37成功。その後type/schemaも再検査した。

## 引継ぎと納品

README/AGENTS・AI prompt・人向け編集/検証/構造文書と仕様/設計/タスクを更新。全source ZIPはjapanese-craft-jewelry-source-0.17.2-unified-021.zip、外部proofはpackage-verification-0.17.2-unified-021.json。集合/全SHA・fileCount/statusはdeployment-resultsのsourceDeliveryと外部proofが正本。自身の最終ZIP hashはZIP内部へ書かない。0.16元PNG ZIPも保持し、今回新bitmapなし。

Chrome emulationであり実機iOS/Safari・検索順位/離脱率・売上・AdSense審査の保証ではない。広告off/実提携未申請を維持。[法務/本人/契約/商用ホスト等の残条件](../../docs/remaining-task-audit-v17.md)をUI合格で完了扱いにしない。
