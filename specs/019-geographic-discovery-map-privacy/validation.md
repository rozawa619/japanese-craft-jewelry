# 検証記録

旧0.16の結果はdocs/verification-v16.mdとdeployment-v16-before-map.jsonへ保存し、今回の成功へ転記しない。今回のログ/報告はdiscovery-map-stageを使用する。

## 調査段階

残タスクは[棚卸し](../../docs/remaining-task-audit-v17.md)、法務は[一次資料と判断](../../docs/legal-review-v17.md)へ記録。最新pnpm audit --jsonは全severity0、348依存。機密/アカウント/全法域・全デザインの権利を一括認定した検査ではない。

地図を全員へ無条件に読み込む代わりに、初回明示選択後の継続自動表示を採用した。ユーザーへ理由と挙動を説明済み。Maps設定を広告CMPとして扱わず、AdSenseはoffを維持する。

## 実装・検証

実測を追記する。ローカルの成功だけで公開完了やZIP照合済みとはしない。

## ローカル実測

最終pnpm verifyは型141ファイルでerror/warning/hint0・unit149/149、344HTML・470生成物。商品正本/価格/出典/訪問先/画像の15ファイルと全118画像を旧Gitへ照合し保持。[全検証と段階](../../docs/verification.md)、[静的記録](../../docs/discovery-map-stage-static-results.json)を正本とする。

- [日本地図193/193](../../docs/discovery-map-stage-japan-map-results.json)：47形状/24県・日英3面3幅・選択188・実tap/keyboard/noJS・axe6画面0。
- [表示設定22/22](../../docs/discovery-map-stage-map-preferences-results.json)：許可/拒否、30日/旧版/不正、書込不可を含むStorage、複数タブ全撤回、Privacy、悪意URL、JSなしを確認。Google外部通信はabortで観測し、実地図表示とは区別。
- [quality617/617](../../docs/discovery-map-stage-quality-results.json)、[mobile92/92](../../docs/discovery-map-stage-mobile-results.json)、[実Maps9/9](../../docs/discovery-map-stage-inline-maps-results.json)、隔離広告6/6、移行header7/7成功。
- 最後に日英Privacyの処理主体名を各1段落追加し、[468ファイル不変と2段落だけの厳密差分](../../docs/discovery-map-stage-provider-clarification-delta.json)を証明。最終verify・Source328・Privacy4画面で追補確認。617等を追補後に再実行したとはしない。

途中のEN1440のdriver入力、meta属性照合のQA失敗、初回地図の後のscroll改善をverificationへ記録した。初回の失敗を削除/合算して成功扱いにしない。最新依存auditは348依存・全severity0。互換hostの_headersは実HTTPで検証したが、GitHub本番への適用とは区別する。
