# 文書の入口

新しいAIは[START_HERE](../START_HERE.md)から開始してください。ユーザーの今回の依頼と[AGENTS](../AGENTS.md)が優先で、023の画像差し替えは完了済みです。

## 現在の保守

| 目的 | 資料 |
| --- | --- |
| 読む順序・起動・次の作業 | [START_HERE](../START_HERE.md)・[コピー用prompt](ai-handoff.md#コピーして使う) |
| 現在の状態・完了/残条件 | [handoff-status.json](handoff-status.json)・[handoff](handoff.md) |
| 実公開app/Actions・過去の納品 | [deployment-results](deployment-results.json) |
| 起動/build/env/公開/復旧/ZIP | [setup](setup.md) |
| 編集箇所と更新単位 | [editing-guide](editing-guide.md)・[src/data](../src/data/README.md) |
| 構造・データの流れ | [architecture](architecture.md)・[src](../src/README.md) |
| 変更別の検査 | [verification-guide](verification-guide.md) |
| 原本/過去ZIP/proof | [handoff-assets](handoff-assets.md)・[配布manifest](handoff-assets.json) |
| 今回のGit引継ぎ024 | [仕様](../specs/024-git-ai-handoff/spec.md)・[検証](../specs/024-git-ai-handoff/validation.md) |

## 現在の人物画像023

[日本人モデル画像ガイド](japanese-model-styling-v21.md)・[仕様023](../specs/023-japanese-model-styling/spec.md)・[全prompt/生成記録](image-generation-japanese-v23.json)。日本人の架空成人女性25〜33歳の生成設定です。22枚の差し替えと公開は完了し、次の依頼なしに再生成しません。

## 継承する地図枠とトップ写真022

[022](../specs/022-compact-map-and-natural-hero/spec.md)・[コンパクト地図/Hero自然高](compact-layout-v20.md)。一覧の沖縄別枠・直接選択、トップの自然比率/上下余白対策は完了済みです。

## 継承する写真サイズ021

[021](../specs/021-unified-region-photos/spec.md)・[共通写真](region-photos-v19.md)。TOP10/DISCOVERの日英3画面は同じサイズを使います。後の023でも再検証済みです。

## 検証と未完了条件

- 現在の公開サイト：[verification](verification.md)・[公開検証集約](japanese-models-stage-hosted-summary.json)。対象SHA/条件を確認します。
- サイト保守と運営の残条件：[残タスク](remaining-task-audit-v17.md)・[申請前](pre-application-checklist.md)・[提携準備](affiliate-readiness.md)・[提携設定](affiliate-operations.md)。
- 法務/hosting：[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)。実契約/本人情報/アカウント設定は未確認のまま完了にしません。

## 説明書でもありbuild入力でもある資料

`docs/research/sources.json`、`docs/assets.json`、画像生成manifestなどはアプリのvalidator/buildに参照されます。`docs/`を全部削除して「ソースだけ」にしません。`docs/archive/`の古い記述を現在の指示として実行しません。

## 履歴の読み方

機能に対応する仕様・JSONの実測を必要な分だけ辿ります。[018全国追加](../specs/018-national-jewelry-expansion/spec.md)・[019地図設定](../specs/019-geographic-discovery-map-privacy/spec.md)・[020直接地図](../specs/020-direct-region-map/spec.md)・021/022/023は完了した履歴です。全履歴の再読を開始条件にせず、過去の成功件数を今回実行した検査と混ぜません。

## 日本人女性の人物画像023

画像原本の旧US/UK設定や棄却候補は履歴として保管しています。現在のactive registry/生成記録と画像方針を正本にし、過去の原本をそのまま公開へ戻しません。
