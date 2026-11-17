# 引継ぎ — 0.15 画像で選ぶ・スマホ・閉じた出典・security

更新2026-11-17。AGENTS → constitution → specs/016 → 本書 → operations。0.14の確定結果はdocs/archiveのv14へ保存。公開/納品の確定値はdeployment-results.jsonと各visual-mobile-stage reportを優先。

## 変更内容

産地の種類別行とhome5種類に、実際の公開商品/地域/種類に属する小さな単体AI画像を表示。既存98ファイルのbytesを保持し、新規生成/写真転載なし。type-choices helperは呼出し元の編集順を保ち、draft/別地域を除外。価格/件数/URL query/hashを保持し、人気順位とはしない。

Sourcesを初期closedのnative detailsへ統一。商品#product-sourcesには商品/市場価格/購入根拠の実確認日と公式出典、店舗visit-sourcesには店舗日付を集約。MarketPriceの繰返し日付を除きdata-price-checked-atは保持。工房/技法/産地/方針/観光統計の出典も閉じる。公式CTA・価格市場・在庫注意・AI/広告開示は見えるまま。直接hashで対象を開き、JavaScript無効時もnative開閉可能。

狭幅はfilter1列/16px・48px、言語/Menu・副導線44px、長いJA見出し、footer、safe-area、短い横画面の固定CTA抑制、focusスクロール余白を修正。市場ラベル/地図説明/閉じるも読みやすくした。Chrome touch emulationであり実機Safari検証とはしない。

外部リンク検査ツールの自動redirect/DNS接続を、各hopのHTTPS/全DNS公開IP判定/接続先pin/timeout/body破棄のNode専用transportへ変更。悪意の負例はmockでprivateへ実接続なし。Node最低版24.22.3、起動前/CIのfloor、CI全severity auditを追加。rootはworkspace内portable Nodeと既存pnpm JS CLIのtask-local wrapperで検証し、OSglobal変更なし。詳細security-review-v15、host-observation-v15。

## 正本と不変条件

catalog/jaは事実/価格/URL、product-stories/MD/choice/guideは紹介、purchase-evidence/visits/sourcesは根拠。今回事実・確認日・画像bytes・50公開/56総数・14地域・24技法・258商品出典・23店舗/43品を変更していない。41通販/9小売カタログの既存根拠を将来在庫/注文成立の保証にしない。

SORA、JAEN同一ページ/query/hash切替、全国構造、ブログ/Contact/決済なし。広告program/item両承認/host/date/locale gateを維持、全実データは未申請/通常リンク。AdSense off、地図opt-inの選択は広告認定CMPではない。COCOON2/欠品18K/畠山2/hairpinはdraft、退役10画像は公開/ZIPから除外。復帰は現行購入根拠を再調査。

## 更新入口

| 場所 | 役割 |
| --- | --- |
| type-choices.ts・TypeChoiceImage・RegionalChoiceGuide・home | 実公開集合の画像入口。件数/価格/絞込を維持 |
| Sources・product template・VisitGuide | 閉じた出典と確認日、data-information-checks/data-market-check/data-store-information-checked |
| MarketPrice・PurchaseEvidence | 価格正本/metadata、購入根拠は閉じた一覧内 |
| global.css・scoped style | 入力/操作域/長文/固定CTA/画像比率/横向き |
| safe-outbound.ts・check-external.mjs | DNS/redirect/接続固定。private実アクセスで試さない |
| check-runtime.mjs・astro.mjs・workflow | サポート中のpatched Node最低版/CI監査 |

## 検証と残る範囲

ローカル統合verifyは121型ファイル0/0/0、124単体、264HTML、通常1016/広告0、949実行script CSP hash、248JSONが成功。価格314、source全248（100商品/348閉じた一覧/1246source行）、mobile92が成功。その他の完了値/最終型file数/公開結果はverificationとdeployment-resultsへ追記する。初回QAのMJS構文/unused hintは修正後のverify成功と区別し、失敗logもローカル保持。

既知audit0/348依存は時点監査で、未知問題や全安全を保証しない。現hostではHTTPS/HSTS/meta CSPがある一方、HTTP CSP/frame-ancestors/XFO/nosniff/PermissionsPolicyは未設定。静的でログイン/送信/決済なしの現構成に対する未実証の多層防御gapとし、効かないmeta/JS framebustで解決済みにしない。任意ヘッダー制御は対応hostでの別実装/実測が必要。MFA/branch保護/復旧等のアカウント設定も未操作。

AdSense実アカウント/所有確認/実ID/認定CMP/地域別同意と配信/稼働状態のPrivacy/CSP統合、GitHub Pages商用用途適合または配信先選択は残る。検索掲載/順位/流入はSearch Consoleで別確認。申請/契約/課金/移転/DNS変更は実行していない。

## 納品

最終verify124型ファイル0/0/0・124単体・369生成物。品質497/価格314/種類画像32（84instances）/source248/Maps9/広告6/SEO/meta1は初回広範囲の成功。見出しと出典操作の追加調整は別の厳密差分・mobile/touch/競合の回帰を記録する。詳細static-results/build-manifest・各JSON・016validation。121/123filesは統合途中の型検査値。

隣接japanese-craft-jewelry-delivery/sourceとjapanese-craft-jewelry-source.zipへ全ソース/設定例/lock/CI/仕様/調査/検証/98画像を書出す。.git/.env/秘密/node_modules/dist/artifacts/退役画像を除外し、package-verification-0.15.0.jsonでrepo→export→ZIPの全件SHAを照合。QA PNG/JSONはscreenshots/0.15.0へ分離。今回新画像生成なし、原本50PNGと生成記録は0.14の別ZIPを保持する。

## 公開後の最終検証

最終アプリ1f0021306e87ce9e7dc43bdf446cffedc59e4134、Actions44024678465 completed/success（2026-11-17T05:32:16Z、GitHub API実測）。最終公開source248/248、mobile92/92、実tap4/4、出典操作競合12/12、見出し12/12、全種類画像32/32（84instances）、共有meta1/1、補足24/24が成功。248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像200/SHAを最終distと照合。公開mobile Maps2とローカルMaps9を区別。広範囲のquality497/価格314/広告6等と初回公開quality497は見出し・出典操作の追加調整前の実測で、最終版で497を再実行したとしない。追加調整の厳密差分と重点回帰結果を併記し、事実/価格/画像/行き先は不変。最終出力は最終mobile/race/heading検証時から不変。公開後の追加は証跡・文書・納品だけ。結果はvisual-mobile-stage-hosted-*。

## 最終ソース納品

全ソース822ファイル・98公開画像。repository→export→ZIPの集合と全件SHA256を照合し、完了記録を含む再書出しにも同じ検証を行う。ZIP自身のbytes/SHAは隣接delivery/package-verification-0.15.0.jsonへ置き、自己参照を避ける。.git/.env/秘密/node_modules/dist/artifacts/退役10画像を除外。QA PNG/JSONはscreenshots/0.15.0に分離し、文中artifacts参照は私的ローカル証跡でアプリの実行依存ではない。新画像生成なし、0.14原本50PNGと制作記録は既存の別ZIPを保持。
