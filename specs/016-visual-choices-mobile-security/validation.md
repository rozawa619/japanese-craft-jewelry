# 検証記録

開始2026-11-17。0.14アプリf7805ed・doc6287f01を基準に、0.15の結果はvisual-mobile-stageへ分ける。検査を実行後に件数・日時・範囲・失敗/修正を追記する。既知脆弱性の監査と未知の脅威/host側設定を区別し、全て安全との断言をしない。

## 初回ローカル（追加調整前の広範囲）

R1: helper3unit、全14地域＋homeのJAEN320を生catalog/編集順/registryから独立照合32/32・84画像instances。実所属/代表順/src/alt/AIcaption/decode/contain/44px/query/hashを確認、新画像生成/bytes変更なし。

R2: quality497/497（300詳細・地域222往復・axe30違反0）、価格314/314（300詳細・地域価格84・axe18違反0）。focused92/92（JAEN6routes×7viewport84画面＋hash2/noJS4/Maps2、source操作120、axe10違反0）、実tap4/4。Chrome mobile/touch/DPR2で、実機Safariではない。

R3: 全248正規HTML保持検査248/248、100商品/348閉じた非入れ子一覧/1246source行。商品/市場/購入/店舗の元dateとURL/titleを保持。HTML検査とkeyboard/hash/noJS動作を分ける。1246はページ表示行数で独立資料数ではない。

R4: 関連23unit（新規10）、private/DNS混在/転送/再bind/timeout/floorをmock検査、公開3固定URLsmokeだけでprivate実接続なし。patched Node24.22.3/pnpm11.25.0の全本体/子processでaudit全severity0/348依存。host/header実測とaccount残範囲はsecurity-review-v15/host-observation-v15。

R5: この段階のverify123型ファイル0/0/0、124unit、264HTML/369生成物、15275href/src、2298anchor、1016通常0広告、949実行CSP hash/248JSON。再生成369全SHAが当時のUI検証buildと一致。隔離広告6/6・実catalog/dist不変、SEO248canonical/100商品meta/16noindex、Maps9/9、共有meta1/1、画像49/49＋51/51。

初回QA script構文/unused hintは修正後の成功と区別。Google初期paintや長尺撮影へのskiplink写り込みはmobile-refinement-v15とtype-images結果へ記録し、通常viewport/幾何/描画待ちを優先した。公開/納品は実測後に追記する。

## 追加調整と最終ローカル

JA390の見出し末尾2字を目視で発見しmobile h2をbalanceへ。12重点画面が成功し『この産地なら、』/『何から選ぶ？』の末行6字を確認。CSP style registryは全264HTMLへ波及するため、hash変更が28ファイルだけという当初の予想は採用しない。heading-build-deltaで236HTML=CSPだけ、28=限定CSS/CSPだけ、本文/script/画像/URL不変を独立証明した。

再検査88/92の4失敗は、単なる検査待ち時間でなく実競合だった。guide同期open→即close後に遅れたhashchangeで再openするtraceを再現し、Sourcesへ処理を一本化。通常同ページanchorはpushStateでfragmentを更新してopen/scroll/focusを1回だけ行い、商品側の重複処理を削除。直接hash/historyは別のnativeイベントを保つ。source-nav-build-deltaで264HTMLは許可したSources/product2scriptとCSP置換だけ、JSON-LD/CSS/URL/その他markup・98画像不変を確認。

最終verify124型ファイル0/0/0、124unit、264HTML/369生成物。修正後mobile92/92・touch4/4・新しい競合回帰12/12（rapid24、focus/次Tab、通常/子anchor/Enter、直接hash/back/forward/noJS）が成功。最終Source入力hash不変。初回広範囲497/314/広告6と、修正後の重点回帰を混同せず、公開後も最終版で重点検証する。

## 公開後の最終検証

補足の初回2つの503は別rawへ保存し対象URLをfresh200/SHA一致で再確認後、全補足24/24を再実行した。Source248は初回で248rawHTML SHA一致。下記は最終の完走結果で、初回部分走査を248/98成功に数えない。

最終アプリ1f0021306e87ce9e7dc43bdf446cffedc59e4134、Actions44024678465 completed/success（2026-11-17T05:32:16Z、GitHub API実測）。最終公開source248/248、mobile92/92、実tap4/4、出典操作競合12/12、見出し12/12、全種類画像32/32（84instances）、共有meta1/1、補足24/24が成功。248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像200/SHAを最終distと照合。公開mobile Maps2とローカルMaps9を区別。広範囲のquality497/価格314/広告6等と初回公開quality497は見出し・出典操作の追加調整前の実測で、最終版で497を再実行したとしない。追加調整の厳密差分と重点回帰結果を併記し、事実/価格/画像/行き先は不変。最終出力は最終mobile/race/heading検証時から不変。公開後の追加は証跡・文書・納品だけ。結果はvisual-mobile-stage-hosted-*。

## 最終ソース納品

全ソース822ファイル・98公開画像。repository→export→ZIPの集合と全件SHA256を照合し、完了記録を含む再書出しにも同じ検証を行う。ZIP自身のbytes/SHAは隣接delivery/package-verification-0.15.0.jsonへ置き、自己参照を避ける。.git/.env/秘密/node_modules/dist/artifacts/退役10画像を除外。QA PNG/JSONはscreenshots/0.15.0に分離し、文中artifacts参照は私的ローカル証跡でアプリの実行依存ではない。新画像生成なし、0.14原本50PNGと制作記録は既存の別ZIPを保持。
