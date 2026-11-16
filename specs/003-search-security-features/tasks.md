# タスク

- [x] 仕様と実装責務、今回の画像許可を記録
- [x] 名称/個別title/メタ情報・日英表示（SS-001/002）
- [x] security/広告host/CSP/依存/workflow対策と検証（SS-003）
- [x] 一次再確認と日英耳飾り特集2本（SS-004）
- [x] 成人女性AI着用画像・表示/権利台帳・圧縮（SS-005）
- [x] verify/ブラウザ/広告/public-preview設定検証（SS-006）
- [ ] repository rename・検索公開・公開先検証（SS-001/002/006）
- [ ] 更新/引継ぎ・全ソースZIP（SS-006）

実測：verifyは型0/警告0/ヒント0・単体41/41・56HTML・2410 href/src・55アンカー・162通常/0広告。ブラウザ85/85（日英60画面、1440/390/320、axe/JS/console0）。広告5隔離ケースPASS、依存audit0件。repo renameで同ID/Issues維持、脆弱性通知と非公開報告enabled。公開確認は配信後に記録。
