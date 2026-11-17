# 海外検索への対応 — 0.13

確認日：2026-11-17。対象は日英の工芸ジュエリー紹介サイト。検索結果での掲載や流入の有無と、検索エンジンが読み取れる技術設定を分けて記録する。機械可読の調査記録は [international-seo-v13.json](research/international-seo-v13.json)。

## 判断と確認範囲

英語ページの独立URL、英語本文、相互の `hreflang`、自己canonical、公開サイトマップは既に存在した。一方、英語トップと商品一覧の主見出しは抽象的で、何のセレクトか伝わる語を強める余地があった。商品紹介の固有性を保った検索説明文と、掲載画像の性質が分かる構造化データを追加した。

公開検索ツールで `site:rozawa619.github.io/japanese-craft-jewelry/` とサイトURLの完全一致等を検索したが、今回の応答に当サイトの該当ページは得られなかった。これは検索エンジン・国・個人設定を指定した測定ではなく、Googleの全インデックス調査でもない。`site:` は網羅的でないため、未掲載とは断定できない。[Googleの検索演算子の説明](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)

Search Consoleの所有権、URL検査、インデックス登録、表示回数、クリック数、米国・英国からの流入、順位は管理画面で未確認。検索ボリュームや競合との順位比較も計測していない。HTMLを整えてもクロール・インデックス・順位は保証されない。[Google検索の仕組み](https://developers.google.com/search/docs/fundamentals/how-search-works)

## 維持・改善した設定

| 対象 | 対応 | 根拠・制限 |
| --- | --- | --- |
| 日英URL | `/en/` と `/ja/` を維持。自己と相手を含む相互 `hreflang`、`x-default=en`、同じページへ戻れる切替を保持 | 英語は汎用 `en` とし、米英用の同内容ページを増やさない。表示言語は本文でも伝える。[多言語版](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| 英語トップ | titleを `Japanese Craft Jewelry \| Earrings, Rings & Necklaces`、H1を `Japanese craft jewelry.` に変更 | 商品紹介の内容がすぐ分かる見出し。順位や需要量に基づく主張ではない。[タイトル](https://developers.google.com/search/docs/appearance/title-link) |
| 英語商品一覧 | title/H1と導入文へ earrings、clip-ons、ear cuffs、rings、necklaces と素材を自然に記載 | 米国式の `jewelry` はブランド・見出し、英国式の `jewellery` は説明文に用いる。キーワードの羅列や隠し文言は追加しない |
| 各商品 | 正本のタイトルは保持。正本の固有紹介文と技法名から日英descriptionを生成 | 商品名・価格・URLの別正本を作らない。50品×2言語が非空で、各言語50件すべて異なるdescription。Googleは本文から別の抜粋を選ぶ場合があり、表示文字数は固定でない。[スニペット](https://developers.google.com/search/docs/appearance/snippet) |
| 産地・技法 | 既存の実商品を含む地域・技法ページとその内容を利用 | 店舗所在地を製造地へ変換しない。空の都道府県や米英向け重複ページを増やさない |
| 正規化 | 本番origin/baseを保持し、query/hashをcanonicalに入れない共通関数を追加 | フィルター・計測queryは一覧の状態として扱う。canonicalはGoogleへのシグナルであり、選択の保証ではない。[正規URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) |
| 構造化データ | 紹介ページを `WebPage`、対象名を `Thing`、画面にある商品パンくずを `BreadcrumbList` として表現 | 商品販売や試着評価と誤認させる `Offer`、`Review`、`aggregateRating` は追加しない。[パンくず](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)、[一般ポリシー](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) |
| 画像 | 表示する画像のみ `primaryImageOfPage` の `ImageObject` にする。AI caption、寸法、画像説明、`digitalSourceType` を付与。OG altは画像台帳の該当言語を参照 | 装飾画像を実物写真や商品仕様の証拠にしない。本文にない共通OG画像をそのページの主画像と宣言しない。[画像SEO](https://developers.google.com/search/docs/appearance/google-images) |
| 画像プレビュー | 公開ページは `max-image-preview:large` を許可。preview/noindexは維持 | 大きな画像プレビューを許可する設定であり、画像検索への掲載・表示形式を保証しない |

## 商品リッチリザルトとAI画像

Product snippetの必須項目には商品名と、review・aggregateRating・offersの少なくとも一つが含まれる。当サイトには実物試用レビューや評価集計はなく、参考価格・購入根拠をリアルタイムのSKU在庫や確実な売買条件とは扱わない。この版では紹介ページとして正確な `WebPage` を用い、星や価格付き商品リッチリザルトの対象になったとは報告しない。[Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)

AI画像のJSON-LDではSchema.orgの `TrainedAlgorithmicMediaDigitalSource` を使用する。これはページ上の画像の由来を記述するもので、ライセンス許諾の宣言ではない。`license`、`acquireLicensePage`、権利者名や撮影者名は作らない。[Schema.orgの列挙値](https://schema.org/TrainedAlgorithmicMediaDigitalSource)

Googleが説明するIPTC `DigitalSourceType` の画像ファイル内メタデータと、JSON-LDの `digitalSourceType` は別である。前者のAI値は概念ID `http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`。説明ページはhttpsで閲覧できるが、概念IDのhttpを埋込み値に使う。[IPTCの概念ID](https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia) 短いAI表示やJSON-LDだけでIPTC埋込みが済んだとは数えない。実ファイル内の埋込み・保持状況は画像生成・変換・配信の検証記録を参照する。Merchant Center向けAI画像の要件と、当サイトの通常の紹介ページを混同しない。Googleの「この画像について」等の表示も保証しない。[画像メタデータ](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata)、[生成AIコンテンツ](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

## 実装と局所検証

主な実装は `src/lib/seo.ts`、`src/layouts/Base.astro`、日英トップ・商品一覧、商品詳細のfrontmatter/Base props。商品の仕様・本文・価格・広告resolverはSEO側で変更していない。

- `node --experimental-strip-types --test tests/seo.test.ts`：4件成功。origin/baseを維持する正規化、外部・不正画像やパンくずの拒否、AI属性、架空Offer/評価の不在、script終端の無害化、翻訳・固有名の保持を確認。
- `node scripts/astro.mjs check`：92ファイル、error/warning/hint各0。ログは `artifacts/seo-v13-astro-check.log`。
- 公開正本50品から生成されるdescriptionを全件照合。英語50件・日本語50件がすべて非空かつ言語内で重複なし。英語176–238文字、日本語86–120文字。これは長さの観測で、検索画面の文字数保証ではない。
- `git -c core.autocrlf=false diff --check`：成功。

生成物専用の `node scripts/check-international-seo.mjs` も追加した。`CHECK_DIST_DIR` と本番設定を既存検証と共通に使い、全canonical集合とサイトマップの一致、日英相互hreflang、全公開商品100ページのmetadata・パンくず・AI画像・alt・caption、robots、架空Offer/評価の不在を検査する。結果は `artifacts/international-seo-v13-built.json`（`SEO_REPORT_PATH` で変更可能）に保存する。スクリプトの構文検査は成功。画像統合前の中間ビルドには実行せず、最終画像が揃った本番生成物を対象にする。

この節はSEO作業時点の局所検証。生成物専用検査の実行結果、画像を統合した全体ビルド、スマホ、リンク、広告切替、公開結果は013の最終検証を参照する。Google Rich Results TestやSearch Consoleの実管理画面による検証を実行済みとはしない。

## 運営者のアカウントで確認すること

1. 本番の配信先を確定する。既存の商用ホスト適合性・AdSense接続の残条件は別課題として継承し、SEO変更で解消したとは扱わない。
2. Search Consoleで実際の本番URLの所有権を確認し、URLプレフィックスを使う場合は `https://rozawa619.github.io/japanese-craft-jewelry/` を対象にする。確認用IDやファイルはアカウントで発行された実値のみ設定する。
3. `https://rozawa619.github.io/japanese-craft-jewelry/sitemap.xml` を送信し、トップと代表的な英語商品・地域ページをURL検査で確認する。Googleが選んだcanonical、取得HTML、画像の取得可否、noindex/robotsと実際の登録状態を見る。サイトマップ送信は掲載を保証しない。[サイトマップ](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
4. 公開後、検索パフォーマンスでページ・クエリ・国（米国、英国、日本）とWeb/画像検索を分けて表示回数・クリック数を確認する。実際に表示された検索語と読者の選択に役立つ情報をもとに、既存商品紹介を改善する。個々の順位を約束しない。[Search Consoleの開始手順](https://developers.google.com/search/docs/monitor-debug/search-console-start)

今回、アカウント登録、所有確認、インデックス登録リクエスト、広告申請、DNSやドメイン変更、計測タグ追加は行っていない。SEO用の新規記事やブログも作成していない。

## 更新時の手順

商品名・紹介文はcatalogと日本語翻訳、技法名は既存の技法データを直す。検索文のために同じ事実を別ファイルへコピーしない。画像は既存の編集画像台帳で日英alt・実寸・対応商品・生成/権利記録を揃える。altは実際の絵とAI性を簡潔に伝え、人物の見た目から国籍を断定しない。captionはユーザー指定の `AIイメージ / AI image` を維持する。

追加・更新後は通常の `pnpm verify`、最終の本番生成物に対する `node scripts/check-international-seo.mjs`、日英の画面確認を行う。本番URL/baseを変更する場合はcanonical、相互hreflang、サイトマップ、画像URL、旧URLからの移行をまとめて検証する。商品確認日をページの更新日へ機械的に転用しない。実際の本文・構造化データ等の更新を記録し、Search Consoleで取得・登録と流入を確認する。
