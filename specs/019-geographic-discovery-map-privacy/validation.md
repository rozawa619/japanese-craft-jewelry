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

## 公開後の実測

公開app `b8edee4e26c92a9a62c9133bf432aecc4666199a`、[Actions44051153186](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44051153186) completed/success（2026-11-17T08:58:25Z、API観測08:58:40.558Z）。[公開集約](../../docs/discovery-map-stage-hosted-results.json)のとおり、Source328/328生HTML SHA・補足24/24（328canonical/118画像SHA）・日本地図193/193・表示設定22/22・mobile92/92はすべて初回で成功、一時503/再試行なし。公開で617を再走査したとはしない。実Maps2/axe10画面0はmobileの範囲、Google通信をabortした設定22とは区別する。

公開後にも[最終470生成物の集合/全SHA不変](../../docs/discovery-map-stage-final-output-integrity.json)を確認。[実HTTP保護ヘッダー](../../docs/discovery-map-stage-hosted-security-headers-results.json)はHSTS/meta CSPあり、HTTPの追加保護は未設定と観測。互換ホスト用_headers・loopback試験を現ホストへ適用済みとは扱わない。

## ソース納品

初回export/ZIPは1031ファイル・118公開画像でrepository→export→ZIPの集合/全SHA一致。公開/完了記録を含む最終再梱包にも同じ検査を適用する。版付きjapanese-craft-jewelry-source-0.17.0-geo-019.zip、latest japanese-craft-jewelry-source.zip、ZIP外のpackage-verification-0.17.0-geo-019.jsonを正本とする。ZIP自身のbytes/SHAをZIP内へ自己参照させない。新しいbitmap生成はなく、0.16原本ZIPのSHA383cf02e99cdf06d936118e9d071f35df68a1b99191de31442b7f450de386254も再照合し不変。通常buildは原本やartifactsへ依存しない。本人・契約・権利・ホスト/アカウント依存の残項目は棚卸しへ分離し、今回の制作完了と混同しない。
