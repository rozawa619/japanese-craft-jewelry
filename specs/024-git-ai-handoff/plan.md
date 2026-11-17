# 設計

- 入口は`START_HERE.md`、現行規則は`AGENTS.md`、機械可読状態は`docs/handoff-status.json`に分離する。
- `docs/ai-handoff.md`にはリポジトリURL・読む順序・今回の依頼欄を含む短いコピー用promptを置く。
- 通常作業に必要なruntimeソース/公開WebP/出典/生成記録はGit tree。大きい原本ZIPはGitHub Release assetsに置き、`docs/handoff-assets.json`でURL/bytes/SHAを対応させる。
- ダウンロード用CLIは登録IDだけを受け付け、HTTPS/許可host/redirect/容量/SHA・安全な保存先を検査する。ZIP展開やアプリ反映を自動実行しない。
- 過去の固定SHA/移行scriptは履歴として保持し、現在の通常buildの依存には追加しない。
- freshソースで元PNG/delivery/.env/artifactsなしの起動条件を再現する。単独build後に本番出力471件とSHAを比較し、資料とQA以外を変更していないことを記録する。
- `.gitattributes`でGitの暗黙EOL変換を止め、固定SHAを持つ過去のJSON/proofを含むcheckout bytesを維持する。既存ファイルを一括renormalizeしない。
- GitHub Releaseは補助資料の配布で、アプリ0.18.0の公開app/Actions記録を上書きしない。今回の文書・QA検証は別reportに残す。
