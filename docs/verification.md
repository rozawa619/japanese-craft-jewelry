# 0.15 検証（2026-11-17）

最新016/visual-mobile-stage。0.14実測はarchive/verification-v14.mdとprivacy-depth-stageを保持。公開/Actions/納品の確定値はdeployment-results。

| ローカル | 実測 |
| --- | --- |
| 最終verify | 123型ファイル0error/0warning/0hint、124単体成功、369生成物はbrowser検証済み出力と全SHA一致 |
| 生成物 | 264HTML、15275href/src、2298anchor、通常リンク1016/広告0、949実行CSP hash、248JSON、14旧読物redirect、退役10画像除外 |
| 人物/単体画像 | 49/49と51/51、98ファイル6,669,896bytes、旧25SHA/全50単体metadata/hash保持 |
| 価格 | 314/314、300詳細/84地域価格context、axe18画面違反0 |
| 出典保持 | 248/248、100商品ページ、348閉じた一覧/1246出典、商品/市場/購入/店舗の元date保持 |
| スマホfocused | 92/92、84代表画面/7viewport＋hash2/noJS4/Maps2、axe10違反0 |
| 実tap補足 | 4/4、JAEN390 mobile/touch/DPR2の2flow＋撮影補足2 |
| 全種類画像 | 32/32、全14地域＋home日英320、84画像instances |
| 品質/導線 | 497/497、300詳細/地域222往復、axe30違反0 |
| 隔離広告 | 6/6、実catalog/root dist不変 |
| SEO | 248canonical/sitemap一致、100商品meta、16noindex |
| Maps | 9/9、2店舗JAEN/PC320の8表示と不正provider拒否 |
| dependency | patched Node24.22.3/pnpm11.25.0、既知全severity0/348依存 |

最終再生成369ファイル全SHAがbrowser検証済みbuildと一致。共有buildは1系列、browser検査中にdistを上書きしていない。初回MJS generic構文error/未使用引数hintはQA scriptだけの問題で修正し、2回目統合verifyが成功。新QA追加後にも最終verifyを実施した。preview4322は旧NodeだったためAstro preview stopで停止し、patched Nodeで4323へ起動。既存pnpm.cmdが別の旧Nodeを使っていたため、task-local wrapperから同梱JS CLIをpatched Nodeで動かしnested pnpmも統一。公開の実測は完了後に追記する。

出典保持検査はChrome DOMParserで全HTMLを読取り、元のproduct/source registry/dateと比較。スクリプト/画像/Googleは実行せず、UIの開閉・keyboard/hash/noJSはfocused browserで別検査。新種類画像は既存の単体AI図を再利用し、実物写真/仕様証拠とはしない。

security負例はDNS/transport mock。privateへ実接続せず、公開3固定URLだけのsmoke。全Git履歴の秘密監査/侵入試験/未知脆弱性の解消/全安全は称しない。ヘッダーやアカウント側で残る範囲はsecurity-review-v15とhost-observation-v15。実機Safari/Google検索掲載/AdSense合格/在庫保証/法令・契約適合も検証済みとはしない。
