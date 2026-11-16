# 引継ぎ — 0.4 商品セレクト

2026-11-16。AGENTS → constitution → specs/004-product-selection → 本書を読む。001〜003の仕様と過去レポートは履歴として保持する。

## 最新の目的と範囲

Japanese Craft Jewelryは、全国の工芸ジュエリーから選んだ商品を英語・日本語で紹介するサイト。セレクトショップのように商品を見つけ、詳細と販売店を確認できる体験を主役にする。ブログ・読みものの公開は行わない。運営者表示はSORA。当サイトで販売・注文受付・決済・発送は行わない。

掲載対象はピアス・イヤリング・ネックレス8点。神奈川・箱根が現在の調査済み産地で、全国の産地・作り手・商品を共通データと画面から追加できる。かんざしはdraft、空の都道府県ページは作らない。地域・技法は商品一覧を中心にした分類ページとし、背景説明は折りたたみに置く。

浜松屋のピアスとイヤリングの紹介・着用イメージは商品詳細へ統合。正規URLは両言語の次のslug。

- `objects/hamamatsuya-surgical-stainless-pierced-earrings/`
- `objects/hamamatsuya-yosegi-non-pierced-earrings/`

旧guidesの日英12ファイルは削除せずdraftとして保存する。旧journal一覧と旧記事URLは、決めた商品・一覧・分類へ案内する移行ページのみを残す。meta refresh 0、noindex、canonicalなしで、元の記事本文は公開しない。通常のナビ・商品導線・サイトマップへjournalを出さない。

## 公開状態と責任表示

リポジトリはhttps://github.com/rozawa619/japanese-craft-jewelry。正規公開先はhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。public/index設定、公開責任者SORA、訂正窓口GitHub Issues（要account・公開投稿）を維持する。未提供の実名・住所・メールは作らない。セキュリティ報告は有効化済みの非公開vulnerability reportingを使う。

**0.4の実装・ビルド・画面確認・公開成功は別々に記録する。実際の最終配信版と検証結果はdocs/deployment-results.jsonを優先する。0.4公開確認前は、過去0.3の成功を0.4の確認済みとして扱わない。** Search Consoleの設定・検索掲載・流入・成果は未確認。

## 設計と画像

共有事実はsrc/data/catalog.json、日本語表示はtranslations/ja.json、商品本文はsrc/content/products/とproducts/ja/。商品追加にブログ記事は不要。トップの代表商品とおすすめ順序はsrc/config/selection.tsのheroProductId/featuredProductIdsで管理し、公開商品IDを指定する。右上の単一ボタンで同じ商品・一覧とquery/hashを維持して日英を往復する。

着用イメージはsrc/data/editorial-images.jsonを安定した商品IDに結び、public/images/から配信する。公式の実物写真は未許諾につき未使用。抽象CSSと、ユーザー依頼による成人女性の独自AI着用図2点を使う。画像の近くに常時AI/非実物表示を置き、商品の柄・寸法・金具・fitの証拠にしない。権利・制作記録はdocs/assets.jsonとimage-generation.json。

## 広告と安全性

現在は全リンク通常、提携は未申請・未承認。広告化にはprogram/itemの両承認、対象merchant、確認日、有効HTTPS URL、完全一致の許可hostが必要。許可hostの空配列は全不許可。停止・欠落・不正で通常へfallbackし、通常URLも不正ならボタンなし。日英の開示とsponsoredは共通部品で管理する。

外部adscript/APIキーなし。CSP、JSON-LD安全化、Actions SHA固定とbuild/deploy権限分離、Dependabot更新通知を維持する。GitHub Pagesで制御できないHTTPheader等の範囲はdocs/security.md。機能追加のために一括で対策を無効化しない。

## 更新手順

1. 仕様004とdocs/operations.mdを読み、変更する商品/分類/表示の範囲を記録。一次資料を再確認してcatalog・訳文・日英の商品本文を更新する。価格/広告URLを本文へ複製しない。
2. AI画像と商品IDの対応、常時caption、実物写真の許諾状態を確認。新しい読みものページは作らない。
3. pnpm verify。表示変更はcheck:browser、広告変更はcheck:ads。新しいセレクト導線、日英、320/390、絞込、通常/広告、旧journal移行、サイトマップを確認する。
4. push後のActions成功と公開実URLを確認し、deployment/verification/handoffを実測に更新する。全ソースと納品ZIPも更新する。

運営者に残る操作はuser-checklist.md。申請・照会草稿は未送信。審査・売上・商品試着・写真許諾を作り上げない。

## 過去版の確認記録

0.3はhead c096c6e、Actions43830341510 success。SORA反映後の公開でブラウザ85/85（日英60画面）と追加10/10、sitemap54URL全200、CSP/画像/Contactを確認した。当時のsearch-security-hosted-results.json等は履歴として保持する。0.4ではjournalを正規サイトマップから外すため、当時の件数を現在の期待値にしない。
