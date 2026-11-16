# Japanese Craft Jewelry — Selected jewelry from Japan

[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [言語を選ぶ](https://rozawa619.github.io/japanese-craft-jewelry/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

日本各地の工芸ジュエリーを、デザインや装いから選んで紹介する日英のセレクトサイトです。運営者表示は **SORA**。ピアス・イヤリング・ネックレス・リング・ブレスレットを扱い、ブログや販売機能は設けません。

0.9は30商品・12都道府県・13技法。トップ、商品セレクト、産地一覧は「左に産地／右に代表アクセサリー1点」で地域の商品群へ案内します。訪日客の訪問率TOP10は、観光庁2025年暦年確報・表6-1の全目的／全国籍地域／複数回答で並べます。東京・大阪・千葉・京都・福岡・神奈川・奈良・山梨・北海道・愛知の各地域に2点以上を掲載。佐賀・石川も別枠で選べます。

着用イメージは架空の成人日本人女性（概ね27〜33歳）。かわいい系と美人系を混ぜ、既存13画像の肌を調整し、18Kピアスを含む15画像を新規追加しました。現行28画像で30商品すべてをカバーし、短い **AIイメージ / AI image** 表示を保ちます。実物データと生成イメージは内部台帳で分離し、未許諾写真は公開しません。

全30商品に通常リンクの公式商品ページ／公式カタログURLを明示。13の確認済み店舗を25商品へ案内し、店舗紹介・アクセス・Googleマップの場所／経路リンクを用意します。実店舗未確認の5商品（CHECOS、泉州2点、CO.COON2点）は公式通販・販売案内へ進めます。個別SKUの店頭在庫は保証しません。

共通URLには日英を選べる入口があり、右上の1ボタンで同じページを切り替えられます。BECOS商品は確認できた同一SKUの日本語ストア／英語ストアへ各言語から案内し、日本語は実際のJPY表示、英語はUSD表示を使います。独自の為替換算はしません。提携は未申請で、日本語リンクに英語プログラムの承認を流用しません。

**最新仕様は specs/009-destination-selection/。検証は同validation.mdとdocs/destination-stage-*.json、配信はdocs/deployment-results.jsonのversion0.9.0・commit・時刻で確認してください。旧versionや未実行の記録を今回の成功へ読み替えません。検索流入・売上・申請合格は未確認です。**

## 動かす

Node.js **24.22.1以上**、pnpm **11.25.0**。Astro **7.4.12**、TypeScript、Markdownによる静的サイトです。

    pnpm install --frozen-lockfile
    pnpm dev

本番生成はpnpm build、生成後の表示はpnpm preview。実URL等を未設定にしたpreviewはnoindexです。

| コマンド | 用途 |
| --- | --- |
| pnpm check | 型・スキーマ・参照・日英本文 |
| pnpm test | 広告・URL・locale別リンク等の重要ケース |
| pnpm build | dist/へ静的生成 |
| pnpm verify | 型・データ・単体・ビルド・生成リンク |
| pnpm readiness | 公開URL・public設定・SORA・データ。Contactは技術要件にしない |
| pnpm check:links | 商品・公式情報・募集先の外部リンク |
| pnpm check:browser | 言語入口・日英・PC/スマホ・画像・価格・導線 |
| pnpm check:ads | 実データを変えず広告状態を隔離確認 |
| pnpm package | 隣接する納品フォルダへ全ソースを書出し。ZIPは別途作成 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| specs/009-destination-selection/ | 最新の仕様・設計・タスク・検証 |
| src/config/region-selection.ts、src/components/RegionSelection.astro | 訪問率順と地域代表・地域への入口 |
| src/data/visits.json | 店舗・商品との関係・確認済公式ホームURL・未確認時の代替案内 |
| src/lib/visits.ts、src/components/VisitGuide.astro | 訪問情報の検証、GoogleマップURL生成、公式URL・店舗案内の表示 |
| src/data/catalog.json | 商品事実、localizedPrices、販売店、locale別リンク、広告状態の正本 |
| src/data/translations/ja.json | 安定IDに結ぶ日本語表示。価格やURLを複製しない |
| src/data/product-stories.json | 日英の見出し・導入・訴求3項目・装い |
| src/content/products/ と products/ja/ | 商品ごとの独自本文 |
| src/content/places/ と crafts/ | 実商品がある地域・技法の分類と背景 |
| src/content/policies/ | About・選定方針・広告・Privacy。Contactは日英draft |
| src/config/selection.ts | 代表商品と、素材の偏りを抑えたおすすめ順 |
| src/data/editorial-images.json | 現行画像のproductId・assetId・path・寸法・日英alt |
| public/images/、docs/assets.json | 画像ファイルと用途・権利・世代の台帳 |
| docs/image-generation*.json | 新旧の生成prompt・人物・対応商品・元ファイル |
| docs/research/sources.json | 一次資料・実確認日・支える事実 |
| docs/research/nonwood-*-v7.json | 非木商品の調査／取込記録。表示の正本には使わない |
| src/lib/affiliate.ts、src/components/ | locale選択、承認resolver、CTA・開示・画像・言語切替 |
| scripts/、tests/ | 構造・価格・リンク・広告・画面・公開の検証 |

## 更新と引継ぎ

一次情報を確かめてからcatalog・出典・日本語表示・日英本文・storyを揃えます。日本向けの価格事実はcatalogのlocalizedPrices.ja、リンクの言語はlinks.localeに記録します。USD50.40のような端数は残し、価格の整数化や為替による自動補完はしません。

商品ページは魅力・画像・価格・公式リンクを先にし、素材や寸法、出典は下部のdetailsへ。画像の注記はユーザー指定の短いAI表示を保ち、実物の仕様や実際の試着の根拠にしません。Contact非公開、SORA、ブログなしを維持してください。

広告化はprogramと商品リンクの両承認、対象merchant、有効HTTPS、許可host、確認日が揃ったときだけです。locale別CTAとDisclosureは同じリンク集合を使います。日本語のBECOS通常リンクはprogramId:nullのままで、英語側の承認や追跡URLを横流ししません。

- 最新状態と履歴：docs/handoff.md
- 商品・画像・価格・広告・公開の更新：docs/operations.md
- 申請前の確認：docs/pre-application-checklist.md、docs/affiliate-readiness.md
- 承認後の詳細：docs/affiliate-operations.md
- 安全設計：docs/security.md
- 日英導線と検索設定の調査：docs/discovery-review-v7.md
- 店舗情報の掲載方法と確認根拠：docs/visit-publication-review.md、docs/research/visit-publication-legal-v8.json

技術検査の成功は提携資格・承認・検索掲載の証拠ではありません。申請先の現行規約と実際のフォームで確認し、未提供の連絡先・本人情報は作りません。

店舗情報は公式の基本情報を独自の短文で案内し、店舗写真・ロゴ・地図・口コミの転載や埋込はしません。Googleマップは固定の正規外部リンクで、開く前にGoogleへ店舗データを送信する仕組みは追加しません。確認した掲載方法と限界を資料へ残し、全面的な適法性の保証とは扱いません。
