# 007 検証対応

2026-11-16。ユーザーの最新指示を受入条件として検証し、検索流入や提携承認は成功扱いしない。

| 要件 | 実装/検証 | 結果 |
| --- | --- | --- |
| R1 | EditorialImage/方針/商品詳細、caption完全一致 | AIイメージ/AI image、重複する長い免責なし |
| R2 | 3つの年齢編集＋6つの新規画像、registry/台帳/生成記録 | 現行13画像/15商品、30代前後の方向、旧3はpublic外 |
| R3 | 6商品の一次調査、catalog/JA/story/content、selection順序 | 16商品、木8/非木8、6都府県6技法、トップ非木5/6、59出典 |
| R4 | root静的2リンク/ブラウザ言語の順序/無強制転送、same-page toggle、SEO | 日英・未知言語・JSなし・query/hash、canonical/hreflang/x-default/OG/sitemapを確認 |
| R5 | locale別価格/リンク/開示、共通resolver | BECOS8商品のJA実JPY/EN実USD、JPY税表示出典、50.40端数、EN承認のJA流用防止 |
| R6 型/参照/単体 | pnpm verify最終source | Astro54files0/0/0、46/46単体、schema/全参照/ENJA本文PASS |
| R6 生成物 | final build/check-built | 102HTML/4365内部参照/89anchor/332通常0広告/209実行JS CSP/86JSON/14旧移動/正規86URL |
| R6 画面 | discovery-stage-browser-results.json | 166/166、132画面、axe対象108画面0、JS/console0、画像16枚 |
| R6 広告 | discovery-stage-ad-build-results.json | 5/5、承認23/14 sponsored・停止/不許可host等0、検証中root dist/catalog SHA不変 |
| R6 最終仕様 | discovery-stage-final-detail-results.json | 最終build後16/16 PASS、JS/console0。non-ear null重量行なし・cuff掲載130g補足保持。2026-11-16 19:55:33 JST確定 |

全画面/広告検査後の最終変更はnon-ear未知重量rowの省略だけ。リンク/価格/広告/画像に変更なし。掲載130gをper-ear値へ読み替えない。最終verify/補足でこのbuildを確認する。

実公開: 後続deployment-results.jsonのversion0.7.0/Actions成功とdiscovery-stage-hosted-*の確定結果を優先する。ソース完了と公開/検索掲載/申請送信/承認/売上を区別。
