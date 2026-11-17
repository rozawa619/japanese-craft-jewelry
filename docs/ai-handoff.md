# 別のAIへ渡す依頼文

このリポジトリの入口は[START_HERE.md](../START_HERE.md)です。過去のチャット、前任PCのファイル、ローカルのZIPを渡さなくても、Git上のソース・仕様・出典・生成記録から作業を始められます。AIにはリポジトリを読み書きし、必要なコマンドを実行できる環境を使ってください。GitのURLを読むことと、push権限を持つことは別です。

## コピーして使う

次の文の【今回の依頼】だけを置き換えます。完了した023の画像差し替えをもう一度実行する文章ではありません。秘密・トークン・.env内容・未提供の個人情報は貼らないでください。

~~~text
https://github.com/rozawa619/japanese-craft-jewelry の現在のmainを取得し、
START_HERE.mdを入口として、このサイトの保守を引き継いでください。

【今回の依頼】
ここに変更してほしい内容を記入します。

最初にAGENTS.md、docs/handoff-status.json、docs/deployment-results.json、
docs/handoff.mdを読み、現在のGit HEAD・未保存変更・公開appのSHAを区別してください。
今回の依頼に必要な仕様、構造、編集ガイド、検証手順へ進んでください。
023の22画像差し替えは完了済みです。未完の旧作業として再生成/再適用しないでください。

運営者はSORA、日本全国の工芸ジュエリーを紹介する日英サイトです。
販売/決済/発送・ブログ・Contactを追加せず、既存の商品/出典/画像/広告/地図の分離を保ちます。
最新の人物画像方針は架空の日本人成人女性25〜33歳、かわいい系と綺麗な系統です。
未確認の仕様・在庫・価格・レビュー・許諾や、未提供の連絡先を作らないでください。
AdSense off・実提携未申請/通常リンクを維持し、申請/契約/アカウント設定を勝手に始めないでください。

Node>=24.22.3とpnpm11.25.0を確認し、docs/setup.mdの手順で準備してください。
通常の起動/buildには、前任PCのartifacts・元PNG・外部proofは不要です。
元画像の編集・歴史的照合だけが必要ならdocs/handoff-assets.mdから資料を取得してください。
過去の023専用apply/preservation helperを起動準備として再実行しないでください。

計画だけで終えず、今回の依頼の正本と仕様を対応させて実装し、影響に合う検証を行ってください。
browser検査中は同じdistをbuildし直さず、作業固有のreport/prefixで過去の証跡を保護してください。
新規の課金・契約・申請など、依頼に含まれない外部運営作業へ範囲を広げないでください。
最後に変更箇所、実行した検証と対象、未検証/未解決、公開した場合のSHA/Actions/実URL、
次に更新する方法を報告し、仕様・引継ぎ状態・関連文書も合わせて更新してください。
~~~

## 読む資料

| 目的 | 正本 |
| --- | --- |
| 最短の開始手順 | [START_HERE](../START_HERE.md)・[AGENTS](../AGENTS.md) |
| 現在の引継ぎ/公開状態 | [handoff-status.json](handoff-status.json)・[deployment-results.json](deployment-results.json)・[handoff](handoff.md) |
| 環境・env・preview・公開/復旧 | [setup](setup.md) |
| 変更するファイルを探す | [architecture](architecture.md)・[editing-guide](editing-guide.md)・[src/data](../src/data/README.md) |
| 必要な検査を選ぶ | [verification-guide](verification-guide.md) |
| 元PNG・過去の納品と証跡を取得 | [handoff-assets](handoff-assets.md) |
| 最新の引継ぎ整備 | [仕様024](../specs/024-git-ai-handoff/spec.md) |
| 完了した人物画像の方針/履歴 | [画像ガイド023](japanese-model-styling-v21.md)・[全prompt/生成記録](image-generation-japanese-v23.json) |
| 本人/契約/審査が必要な運営条件 | [残作業](remaining-task-audit-v17.md)・[申請前](pre-application-checklist.md)・[提携設定](affiliate-operations.md) |

過去の検証値は、そのappと条件に対する証拠です。新しい作業の成功へ転用せず、今回実行した検証と区別してください。全履歴の再読や、すべての原本ZIPの取得を通常作業の前提にはしません。
