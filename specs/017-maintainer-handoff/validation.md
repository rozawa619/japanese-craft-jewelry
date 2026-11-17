# 検証記録

基準は公開app1f0021306e87ce9e7dc43bdf446cffedc59e4134・Actions44024678465、文書を含む開始HEAD a5e1ee9、package0.15.0。0.15の実測はそのまま保持し、本改訂の結果はhandoff-stageへ分ける。文書/toolの検査と既存公開の実測を区別し、freshcloneで未実行の管理画面・署名/原本の確認を完了にしない。

## 要件との対応と実測

| 要件 | 確認したこと | 結果 |
| --- | --- | --- |
| R1/R2 | README/index/AGENTS/AIコピー用prompt。別担当による相互link・env・SHA・Gitなし経路の読取監査 | 抜けを修正。公開appと文書HEADを区別し、ZIPでは作業コピー比較へ分岐 |
| R3/R4 | 実商品JSONの部分例、日英/市場/画像/出典/店舗/新商品gate、実装pathとflow | 人向けediting-guide、architecture、src/data案内を同梱。アプリはコメント補足のみ |
| R5 | 同梱sourceだけを独立directoryへコピーし、.env/.git/dist/.astro/artifactsなしから開始 | no-env `pnpm verify`成功、型129ファイル0error/warning/hint、unit135/135、264HTML、全画像/Privacy検査成功 |
| R5 | `pnpm dev`を実起動し日英へHTTPアクセス | 両方200、base=/、noindex。元PNGやこのPCのローカルruntimeファイルはfixture内に不要 |
| R5 | 昇格した種類画像/見出しcheckをproject subpathとno-env root devで実行 | それぞれ32/32・12/12、代表画像84、page/console error0 |
| R5 | public metadataのroot buildを別途localhostでpreview。Sourceとrapid操作のroot経路 | 全248URL/HTML SHA・100商品Source保持、race12/12・rapid24成功 |
| R5/R6 | 共通export policyの負例/通常処理と実PS連携 | 回帰11件をunitに追加し135件に含む。欠落・余分・内容SHA・junction/外側target/不正version・backupを検証 |
| R6 | 公開profileで通常verifyを実行し、最終0.15のmanifestへ全出力SHA照合 | 最初の通常verify127型ファイル・124unit成功。その後のpackager回帰11件は上のfresh verifyで確認。369ファイル集合/bytes/SHAすべて一致 |

依存は変更していない既存lockfileのnode_modulesを、明示的なjunctionで独立コピーへ再利用した。**新規ネットワークinstallや別OSの実機試験ではない。** 同梱docsを含む全sourceをコピーして使い、元repoの.envや同梱外docs/元PNG/外部sourceへの参照を追加していない。Node実行本体はfixture外の対応版をPATHから使用し、task-local runtimeファイルをfixtureへ同梱していない。

文書checkerは有効な16文書の相対file/fragment・実pnpm alias・node scriptを対象とする。外部URLは要求せず、旧operationsの履歴区画と歴代researchの文章は現行runbookに数えない。[文書結果](../../docs/handoff-stage-docs-results.json)、[生成物一致](../../docs/handoff-stage-output-results.json)、[今回の集計と各raw JSON](../../docs/handoff-stage-validation-results.json)を参照。

## 納品toolと失敗の扱い

`pnpm package:delivery`の既定aliasを実行し、export/ZIP作成・全SHAが成功した。実repoを変更した後の`-SkipExport`も実行し、stale exportで終了1・latest ZIPのSHA不変を確認した。最終の固定revisionはdocs-017、proofは外部package-verification-0.15.0-docs-017.jsonとし、最終件数/ZIP bytes/SHAはそのproofとdeployment-results.sourceDeliveryを参照する。

整備中は文書checkerが説明文のpnpm wrapperをコマンドと誤検出したため、コード/命令部分だけを検査するよう修正した。またpnpm経由の`-- -Revision`はPowerShellへ余計な`--`を渡したため、既定aliasまたは直接pwshの正しい手順へ変更した。初版PSのsummary出力も修正し、上記alias成功時に実値を確認した。raw logはartifacts/handoff-stage等へ別名保存し、旧0.15の結果を上書きしていない。

ZIP対象の除外・保存先/入力のリンク検査・集合/SHA整合は、任意file内容やGit全履歴の機密監査ではない。PS7.0互換APIへの置換は構文/APIの範囲で、実行はPowerShell7.6.9。公開アプリが全369ファイルで不変なので、文書/toolをGitへ保存し、[skip ci]で不要な再配信を避ける。新たなActionsや実公開の検査を実施済みと記録しない。
