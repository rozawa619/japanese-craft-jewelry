# タスク
- [x] 変更要件と責務分離を文書化（BI-001〜007）
- [x] ジュエリー範囲・翻訳データ・日本語本文（BI-001,002,004）
- [x] URL/共通レイアウト/右上切替/各ページ（BI-002,003,006）
- [x] 共通部品・広告・表示（BI-004,005）
- [x] 型/スキーマ/両言語・広告・リンク・スマホ検証（BI-005,006,007）
- [x] GitHub/Pages公開・引継ぎ更新（BI-007）

- [x] 全国の産地入口と共通の地域一覧（BI-008）

実測：pnpm verify 型0/0/0・単体33/33・52HTML内部参照2102/アンカー51/通常販売店158。日英48画面73/73、axe0、切替query/hash・表のスマホscroll/keyboard・かんざし非公開。広告4隔離ケースPASS。公開後はdeployment-resultsへ。

公開実測：Actions 43825536502 success（9e0b590）。英語/日本語HTTP200、公開版73/73・48画面・axe/JS/console 0。docs/bilingual-hosted-results.json、deployment-results.jsonへ記録。
