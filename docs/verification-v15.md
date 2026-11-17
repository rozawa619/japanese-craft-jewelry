# 0.15 検証（2026-11-17）

最新016/visual-mobile-stage。0.14実測はarchive/verification-v14.mdとprivacy-depth-stageを保持。公開/Actions/納品の確定値はdeployment-results。

| ローカル | 実測 |
| --- | --- |
| 最終verify | 124型ファイル0error/0warning/0hint、124単体成功、369生成物の全SHAを記録 |
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

初回広範囲QA後の見出しとSource操作の追加調整は、下記の厳密差分と重点回帰を区別して記録。共有buildは1系列で、browser検査中にdistを上書きしていない。初回MJS構文/unused hintはQA scriptの問題を修正し、初回統合から最終までの成功と区別。preview4322は旧NodeだったためAstro preview stopで停止しpatched Nodeで4323へ起動。既存pnpm.cmdの旧Nodeを避け、task-local wrapperから同梱JS CLIをpatched Nodeで動かしnested pnpmも統一。公開の最終実測は完了後に追記する。

出典保持検査はChrome DOMParserで全HTMLを読取り、元のproduct/source registry/dateと比較。スクリプト/画像/Googleは実行せず、UIの開閉・keyboard/hash/noJSはfocused browserで別検査。新種類画像は既存の単体AI図を再利用し、実物写真/仕様証拠とはしない。

security負例はDNS/transport mock。privateへ実接続せず、公開3固定URLだけのsmoke。全Git履歴の秘密監査/侵入試験/未知脆弱性の解消/全安全は称しない。ヘッダーやアカウント側で残る範囲はsecurity-review-v15とhost-observation-v15。実機Safari/Google検索掲載/AdSense合格/在庫保証/法令・契約適合も検証済みとはしない。

## 追加調整と検証の段階

見出しの末尾2字の孤立を直すmobile CSSに続き、92再検査の88/92・4失敗をevent traceで実競合と特定した。商品側同期openと後着hashchangeによる再openをSourcesへ一本化し、同ページリンクをpushStateで更新、移動先summaryへfocusする。修正後local92/92・touch4/4・新競合12/12（rapid24、focus/Tab、history、直接hash、noJS）を確認。旧raw/traceとbefore-heading各reportを保持する。

全369出力を2段で独立比較した。heading-build-deltaは旧公開264body SHAと旧manifestの一致、236CSPだけ/28headingCSS+CSPだけを証明。source-nav-build-deltaはそこからのSources248/product100の2script・CSPだけの置換を証明し、CSS/JSON-LD/URL/他markup・98画像不変。広範囲497/314/広告6等を修正後に再実行したとは扱わず、最終mobile/race/heading・公開照合を別記録にする。

公開Source checkerは、同じ取得responseのrawHTML SHAを最終distへ照合する検査を追加した。QA-only helperの変更後にもAstro check124files/0errors/0warnings/0hintsを確認（artifacts/visual-mobile-stage-qa-helper-type-followup.log）。この追補でアプリ369ファイルは変えていない。

## 公開後の最終検証

最終release補足の初回は一時503が2URLで発生し22/24、HTML133/画像33までの部分走査だった。rawをfinal-hosted-first-attemptへ保持し、当該HTML/旧来の人物画像をfresh200＋最終local SHA一致で確認（final-hosted-503-recheck）。アプリを変更せず全補足を再走査し24/24・248HTML/98画像を確認。Source248は初回で全rawHTML SHA一致まで成功した。一時応答をdata不一致や閉鎖と判断せず、初回を全件成功と数えていない。

最終アプリ1f0021306e87ce9e7dc43bdf446cffedc59e4134、Actions44024678465 completed/success（2026-11-17T05:32:16Z、GitHub API実測）。最終公開source248/248、mobile92/92、実tap4/4、出典操作競合12/12、見出し12/12、全種類画像32/32（84instances）、共有meta1/1、補足24/24が成功。248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像200/SHAを最終distと照合。公開mobile Maps2とローカルMaps9を区別。広範囲のquality497/価格314/広告6等と初回公開quality497は見出し・出典操作の追加調整前の実測で、最終版で497を再実行したとしない。追加調整の厳密差分と重点回帰結果を併記し、事実/価格/画像/行き先は不変。最終出力は最終mobile/race/heading検証時から不変。公開後の追加は証跡・文書・納品だけ。結果はvisual-mobile-stage-hosted-*。

## 最終ソース納品

全ソース822ファイル・98公開画像。repository→export→ZIPの集合と全件SHA256を照合し、完了記録を含む再書出しにも同じ検証を行う。ZIP自身のbytes/SHAは隣接delivery/package-verification-0.15.0.jsonへ置き、自己参照を避ける。.git/.env/秘密/node_modules/dist/artifacts/退役10画像を除外。QA PNG/JSONはscreenshots/0.15.0に分離し、文中artifacts参照は私的ローカル証跡でアプリの実行依存ではない。新画像生成なし、0.14原本50PNGと制作記録は既存の別ZIPを保持。
