# 設計

| 要件 | 主な成果物 | 確認 |
| --- | --- | --- |
| R1 | README・docs/README.md | 開始手順/目的別入口/現在と履歴 |
| R2 | AGENTS・handoff・ai-handoff | 会話なしで状態と制約/次作業を復元 |
| R3 | editing-guide・setup | 実JSONと役割/日英/公開gateの照合 |
| R4 | architecture・src/README・sourceコメント | 実装へのpath/flow一致、挙動不変 |
| R5 | setup・verification-guide・再利用scripts | missing.env/Chrome/subpath/port/ZIP exportを検証 |
| R6 | validation・handoff-validation JSON・delivery proof | linkscan/verify/生成物SHA/全source・ZIP SHA |

分担: A編集ガイド、B構造・コメント・納品toolのレビューと補強、C AI引継ぎ・検証ガイドと文書監査、root README/状態/AGENTS/setup/index/検査・納品tools/統合。コード変更はコメントと保守toolに限定。新しい外部仕様の『最新版』を前提にせず、現在のpackage/CLI/実行ログを正本にする。
