# 検証記録

実施日：2026-11-16（日本時間）。最終の機械可読結果は `browser-results.json`、`ad-build-results.json`、`research/link-check.json`。公開先の状態は `deployment-results.json` が作成された場合は同ファイルを優先。

| 要件 | 実装 | 確認 |
|---|---|---|
| FR-001/002/007 | catalog、商品/ガイド/産地/技法Markdown、出典34件、権利台帳 | Zod、ID・出典・本文参照をvalidateで検証。製造地未確認/欠品/税不明を保持 |
| FR-003/004 | affiliate.ts、RetailerLink、Disclosure | 状態別単体テスト、隔離した実ビルドの広告/関連商品/停止/URL欠落/publicモード。詳細ad-build-results |
| FR-005 | 商品一覧4軸 | ブラウザで複合・解除・0件・未知値除外・URL復元 |
| FR-006/009 | 公開27HTML、404、robots、sitemap | 生成物の全内部href/src・アンカー・下書き・noindex・canonicalをcheck-builtで検証 |
| FR-008 | CSS、detailsメニュー、skip link | PC1440/スマホ390/320、axe、キーボード、長い商品名、画像なし |
| FR-010 | Contact/Privacy、設定 | 実在repoのIssues有効をGitHub公式APIで確認。個人名・メールなし。問い合わせの投稿送信はしていない |
| FR-011/012 | 正規化比較表、独自文、design.md | 選定理由・不明点・価格/出典データの重複入力防止。参照記事のコピー無し |
| FR-013 | pnpm-lock、scripts、CI、README/AGENTS/operations | pnpm install/check/test/build/verify、外部GET、ローカルpreview |

## 実行
- `pnpm install`：成功。Node 24.22.1、pnpm11.25.0、Astro7.4.12、TypeScript5.9.3、Zod4.6.7。lockfile固定。
- `pnpm verify`：型、参照、単体テスト、本番ビルド、内部リンク検査。29/29テスト、27HTML、1100 href/srcと26アンカー、87通常リンクでPASS。
- `node scripts/check-browser.mjs`：新規headless Chrome、ユーザー既存ブラウザやプロファイルは不使用。画面と機能の最終件数はJSON。
- `node scripts/check-ad-build.mjs`：現物カタログ・root distを変更しないfixture限定。架空広告URL/承認はテストコピー内のみ。
- `node scripts/check-external.mjs`：36URL中33件HTTP200、1件503、2件403。全商品・募集・申込先は200。503/403を閉鎖とは判定しない。
- `pnpm readiness`：初期previewで意図どおり非0。実URL・公開モード・運営表示の3不足を検出。repoによるContactは設定済み。

## 画面
`artifacts/desktop-home.png`、`desktop-objects.png`、`mobile-home.png`、`mobile-product.png`を取得し目視。ソース納品とは別のscreenshotsフォルダにも複製する。

## 発見して修正した点
- 関連商品だけ広告化した場合も開示が対象に含まれるようにした。
- 広告開示方針ページではページ内リンクの関係とサイト全体の状態を区別。
- 404のnoindexページにcanonical/OG URL/Article等を生成しない。
- 神奈川固定のカード表示をマスタ参照へ変更。
- 産地/技法の本文を個別コードからMarkdown＋共通テンプレートへ。空/下書き/商品なしを除外。
- 未実見の資料を「本文確認済み」と表示しない。
- コマンドの環境依存テレメトリ書込を起動ラッパーで停止。

## 計測の限界
axeは自動検査の範囲。スクリーンリーダー全製品・実機全端末・本番地域別速度・Lighthouse・Core Web Vitalsは未計測。ローカルnavigation timingを本番スコアへ換算しない。海外国別チェックアウト・注文・決済・メール到達・アフィリエイト計測/報酬は未実施。公開と提携申請/承認/売上は別。

## 最終の確定結果

ブラウザ41/41（21画面）、axe0、JavaScript例外0。地域/技法の本文・実リンク検査4/4。広告隔離ビルド4/4、関連16/地域6/停止0 sponsored、publicサブパス1125 href/srcでPASS。欠品2件は欠品表示、下書き商品とguideは非公開。詳細JSONに時刻と環境を保存。

## GitHub実公開の確認

https://rozawa619.github.io/ito-craft/en/ — HTTP200、noindex。Actions run 43821352419がsuccess（commit6973e2e）。GitHub側でもpnpm verifyが通過。hosted18/18、8画面、内部30URL、404/CSS/JS/Contact/フィルター/robots/sitemapを確認。最終JPYと税区分は390/320幅でHTTP200、はみ出しなし。

## 0.2 ジュエリー特化・日英・全国の入口（2026-11-16）

仕様: specs/002-jewelry-bilingual。公開8ジュエリー、両言語52HTML。型0/0/0、33テスト、2102href/src・51アンカー・158通常リンクPASS。日本語19本文と表示データ、全国の産地一覧、同ページquery/hashを保つ単一切替。記事内Markdown表をスマホ内の横スクロールにし、キーボードfocus/aria-labelも付与。広告4fixtureで両言語の開示/停止/publicを確認。画面最終結果はbilingual-results.json、公開結果はdeployment-results.json。初期版の記録は履歴として上に保持。

0.2公開後実測：Actions43825536502 success、9e0b590を配信。2026-11-16 07:44 UTC、公開先/ito-craft/で73/73、48画面、axe0/JS例外0/console error0。右上の日英切替、商品/記事往復、query/hash保持、全国入口、ジュエリー8件、hairpin404、CSS/JSとpreview noindexを確認。詳細はbilingual-hosted-results.json。

## 0.3 名称/安全性/耳飾り特集

仕様003。public新baseで型0/0/0、41単体、56HTML・2410 href/src・55アンカー・162通常/0広告PASS。新日英2紹介・AI着用2画像を含む60画面85/85、axe/JS/console0。最終CSSで単一商品カードをスマホ全幅に修正し再確認。広告5fixturePASS、既知脆弱性audit0。実測はsearch-security-browser-results/ad-build-results/dependency-audit-results。GitHubrename同ID維持、Issues/脆弱性通知/非公開報告enabled。配信先の実検証は公開後のdeployment-resultsへ記録。

0.3公開最終：Actions43830341510 success（c096c6e）。SORA反映後85/85・60画面、追加10/10、axe/JS/console0。sitemap54URL全200、両言語SORA、新Issues、HTTPS301→HTTPS200、AI画像2点200、CSP executable script hash一致。hostedreport内に時刻/詳細を保存。root robots404はプロジェクトhostingの制約として観察記録し、プロジェクトrobotsと各HTML indexを別に確認。Search Console/検索掲載・順位/流入/成果は未確認。

## 0.4 商品セレクト

仕様004。商品主役のトップ/分類と2商品への紹介統合。verify型0/0/0・41単体・56HTML・1803href/src・43アンカー・140通常/0広告・14noindex固定移動PASS。localbrowser81/81（54画面、axe/JS/console0）、広告5/5の実測はselection-browser-results/selection-ad-build-results。検索対象のsitemapは40URL、旧journal14URLは移動用で本文なし。公開先の確定結果は配信後deployment-resultsへ記録。

0.4公開：Actions43834269993 success（e287010）。公開81/81・54画面、補足11/11。正規40URL全200、商品主体/ブログ導線なし/Articleなし、固定移動14、CSP/画像/SORA/Contact/404を実測確認。証跡は最終selection-hosted-results.jsonにSHA付きで保存。公開先での実購入・広告成果・検索流入は未検証。

## 0.5 魅力から購入先へ進む商品紹介

仕様005。3公式ページの情報順序を参照し独自の見出し/装い/選定理由を追加。主CTA→下部closed details、mobile追従は主CTA通過後のみ/フッター隠し。共有事実・価格・未知値・広告は不変（product-copy-integrity-results）。型0/0/0・42単体・56HTML・1819内部参照・43アンカー・172通常/0広告・14旧移動PASS。localbrowser81/81（日英54画面、axe/JS/console0）、最終カード6/6、広告5/5。最新ローカル結果はappeal-browser-results/appeal-ad-build-results。公開確認は配信後にdeploymentへ記録。
