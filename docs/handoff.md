# 引継ぎ — 0.2

2026-11-16。AGENTS→constitution→specs/002-jewelry-bilingual→本書を読む。001は初期版の履歴として維持する。

## 最新の範囲

ITO — Jewelry with a story. 日本全国の工芸ジュエリーを日本語と英語で紹介する。神奈川は調査済み産地の一つで、サイト全体を神奈川専用にしない。現在はピアス・イヤリング・ネックレス8点、ガイド4本、運営方針5本、地域記事1本・技法記事1本・作り手情報2件を日英で表示。かんざしは調査履歴を残しdraftへ。空の都道府県ページはない。

## 機能

/en/と/ja/に各25ページ、ルート入口と404を含め52HTML。ヘッダー右上の単一の日本語/Englishボタンで、商品/記事/絞込query/hashを維持して往復する。自動翻訳サービス・Cookie・言語保存は使わない。

数値・出典・広告URL・承認状態はsrc/data/catalog.jsonが正本。日本語表示はsrc/data/translations/ja.json、本文は各Collectionのja/<同slug>.md。src/lib/content.tsでlocale選択、src/pages/[lang]/の共通ルートから生成。旧英語URLは維持（掲載対象外となったかんざしのURLは404）。全国の入口は/en/places/と/ja/places/。

## 検証

pnpm verify: 型0errors/0warnings/0hints、33テストPASS、52HTML・2102内部参照・51アンカー、158通常販売店リンク。両言語の資料参照/翻訳の対/未知値/下書きを検証。広告隔離4ケースは承認・停止・URL欠落・publicサブパスでPASS。ブラウザ最終結果はdocs/bilingual-results.json。公開先の最新確定結果はdocs/deployment-results.jsonを優先し、公開前のソース状態だけで公開済みと断定しない。

## 公開と提携

GitHub https://github.com/rozawa619/ito-craft 。英語 https://rozawa619.github.io/ito-craft/en/ 、日本語 https://rozawa619.github.io/ito-craft/ja/ 。公開modeはpreview/noindexを維持。既存のGitHub Actionsで検証後にPagesへ配信。個人の運営者名・公開用メールは未提供。訂正窓口は実在するGitHub Issues（アカウント必要・公開投稿）。全リンク通常、提携は未申請・未承認。写真は許諾未取得につき未使用で、自作の非実物図柄。

## 次のAIの更新手順

1. specs/002とoperationsを読み、関連BI要件の変更範囲を記録。
2. 事実の一次情報を確認してcatalog/sourcesを更新し、日本語表示とEN/JA本文を対で更新。
3. pnpm verify。表示変更はpnpm check:browserで日英・スマホ・切替を確認。広告変更はpnpm check:adsも実施。
4. GitHubへpushしActions成功と公開URLを実確認、deployment/handoffを更新。

運営者の残判断はdocs/user-checklist.md。BECOSの条件照会と申請は未送信。広告承認・売上・商品実測・写真許諾を作り上げない。

## 0.2の公開確定

Actions run43825536502はsuccess（配信ソース9e0b590b11718882bf4d572de578b7fd34b7fdc2）。2026-11-16 07:44 UTCに公開URLで73/73、日英48画面（1440/390/320）、axe/JS例外/console error各0。両言語HTTP200、同一ページの切替・絞込query/hash・全国入口・8ジュエリー・hairpin404・noindexを確認。docs/bilingual-hosted-results.jsonが実測記録。後続の資料だけのコミットは配信画面を変更しない。
