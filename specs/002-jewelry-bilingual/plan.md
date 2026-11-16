# 設計
- 既存Astro7.4.12の共通ルートをsrc/pages/[lang]/へ。getStaticPathsでen/jaだけ生成。
- 商品事実catalog.jsonを維持し、src/data/translations/ja.jsonに表示用の訳文。catalogFor(locale)/productsFor(locale)で表示モデルを構成。
- 各Markdown Collectionの既存英語ファイルは維持、日本語を同じディレクトリのja/<同slug>.mdへ。localeで選択し、URLはja/接頭辞を除いた共通slug。
- src/lib/i18n.tsのLocale/t、config/site.tsのpagePath(route,locale)とlocalizedPathで共通URL。
- LanguageSwitchは通常リンクをボタンの外観にし、右端に固定配置。JSなしでも同じページを往復、JSありで現在のquery/hashを追加。フィルタ値のIDは共通。
- 商品/記事/共通部品の表示を両言語化。かんざしはデータとノートをdraftへ。空カテゴリはフィルタから除く。
- 言語切替のアクセシブル名、キーボード、長い日本語見出し、ヘッダーの収まりを検証。外部フォント不要。
- 公開設定はpreviewを継続。public切替時は両言語のcanonical/hreflang/sitemapを生成。
- 検証後、既存origin/mainへpushしGitHub Pagesの成功と両言語の実URLを確認。

全国入口：/en/places/と/ja/places/。ナビ/ホーム/メタ/フッターのサイト全体の位置付けは日本全国。個別kanagawa記事は調査済みの地域として残し、地域一覧は公開本文と公開商品のある地域だけを列挙する。
