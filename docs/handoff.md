# 引継ぎ — 0.3

2026-11-16。AGENTS→constitution→specs/003-search-security-features→本書を読む。001/002は履歴。

## 最新の範囲

Japanese Craft Jewelry。全国の工芸ジュエリーを英語/日本語で紹介する。神奈川は最初の調査済み産地。ピアス・イヤリング・ネックレス8点、ガイド6本、運営方針5本、地域1/技法1/作り手2を日英で表示。新記事はjournal/hakone-yosegi-pierced-earrings/ と journal/hakone-yosegi-non-pierced-earrings/。かんざしdraft、空県ページなし。販売/決済/発送機能なし。

## 公開と責任表示

既存repoをhttps://github.com/rozawa619/japanese-craft-jewelryへrename（同ID/履歴/Issuesを維持）。新URLはhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。Pagesの旧プロジェクトURL自動転送は保証されない。GitHubユーザー名は変更していない。public/index設定と、ユーザー指定の公開名SORAを責任表示に使用。実名/住所/メールを作っていない。ContactはGitHub Issues（要account/公開投稿）、セキュリティは有効化した非公開vulnerability reporting。実際の配信完了/URL確認はdeployment-results.jsonを優先。Search Console/検索掲載/流入計測は未実施。

## 設計と安全性

共有事実はsrc/data/catalog.json、訳文はtranslations/ja.json、本文は各Collectionとja/。右上の単一切替でページ/query/hashを保持。広告はprogram/itemの両承認、merchant対応、確認日、完全一致許可hostの全条件でのみ切替。空hostは不許可。通常fallbackと開示は両言語共通。APIキー/外部adscriptなし。CSPとJSON-LD安全化、Actions SHA固定とbuild/deploy権限分離、週次Dependabot更新通知。秘密はGitへ置かない。Pagesで制御不能なHTTPheaderはsecurity.mdに記録。

## 画像

実物写真は未許諾につき未使用。抽象CSSと、今回明示依頼による独自AI成人女性着用図2点。公式HPを視認し木色/幾何学の一般傾向だけ参考にし、公式写真はgeneratorへ渡していない。柄/寸法/金具/fitの再現を主張しない。画像と常時captionを一体表示。public/images/、src/data/editorial-images.json、docs/assets.json、image-generation.jsonが入口。

## 検証

verify: 型0/0/0、41単体PASS、56HTML・2410内部参照・55アンカー・162通常リンク/0広告。search-security-browser-results.jsonは85/85、日英60画面、1440/390/320、axe/JS/console0。ad-build-resultsは5ケースPASS、承認/下部販売店/停止・欠落/不許可host/publicサブパス、実データとrootdist不変。dependency-audit-resultsは既知脆弱性0。これらは侵入試験や安全保証ではない。実公開確認は後続記録。

## 更新手順

1. specs003とdocs/operations.mdを読み影響範囲を記録。一次資料を再確認し、共有事実/日本語表示/日英本文を対で更新。
2. 広告承認後はdocs/affiliate-operations.md、外部通信等の変更はdocs/security.mdに従う。未承認/未確認データを作らない。
3. pnpm verify。表示変更はcheck:browser、広告変更はcheck:ads。画像captionと日英peerも確認。
4. push後Actions成功、新URL、HTTPS/robots/sitemap/404/canonical/hreflang/Contactを実確認しdeployment/handoff更新。

運営者残操作はuser-checklist.md。提携は未申請・未承認、全リンク通常。BECOS条件照会草稿は未送信。署名実績/売上/商品実測/許諾を作らない。

## 0.3配信の確定

SORA反映head c096c6e4dd1123fbc6b8320dac9349a170968cd4のActions43830341510はsuccess。新URLのHTTP200と日英Aboutの運営者SORAを確認。公開版の最終ブラウザ実測はsearch-security-hosted-results.jsonとdeployment-results.jsonを参照する。

公開最終実測：2026-11-16 08:24 UTC、SORA反映版で85/85（日英60画面）・追加10/10 PASS。sitemap全54URLがHTTPS200・public canonical/hreflang、404/noindex、画像2点200、CSPとscript hash整合、両言語SORA/新Contactを確認。公開URL/全ソース/画像/プロンプト記録/運用文書はjapanese-craft-jewelry-deliveryへ書出し、source ZIPも用意。後続の資料だけのコミットは配信画面を変えない。
