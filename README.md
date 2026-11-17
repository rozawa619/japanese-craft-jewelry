# Japanese Craft Jewelry

[日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

SORAが日本各地の工芸ジュエリーを選ぶ日英の紹介サイト。ブログ・販売決済・Contactは設けません。公開状態はdocs/deployment-results.jsonのversion/commit/Actions/実測を確認してください。

0.14は広告導入前のPrivacy、全50商品の選び方、単体の図、小型Mapsを更新。日英各150件の固有Q&Aを追加し、仕様tokenはcatalogの正本から表示します。既存AIスタイリング48枚を保持し、ジュエリー単体のAI図50枚を『惹かれる、その理由。』へ追加。生URLは意味の分かるリンク名に変えました。23店舗のGoogle公式Share埋込みを、説明と表示操作の後だけ読み込みます。閉じる/再読込で停止し、地図の選択を自前Cookie/Storageへ保存しません。

日英PrivacyはGoogle広告Cookie・情報利用・拒否/設定・同意管理と、地図表示後の情報送信を説明します。現状はAdSense offで、認定CMPや実アカウント接続を済んだものとして扱いません。全画像はAIイメージで、実物写真/試着/正確なSKU再現の証拠ではありません。新規50点のPNG原本・実prompt・hashと、Google地図の出典/取得方法を記録しました。内容・画像の増加をAdSense合格保証にしません。

最新仕様は014/015、結果はprivacy-depth-stage。以下の0.13以前はその版の履歴です。通常verifyにPrivacy停止状態・全50単体図のmetadata/hashを含め、pnpm check:depthで日英PCスマホのQ&A/単体図/Privacy導線、check-inline-mapsで選択前後の地図を確認できます。

0.13では公開50商品のAIイメージと英語圏向け検索設定を改善しました。[013](specs/013-complete-imagery-international-seo/spec.md)を継承し、最新の[014](specs/014-advertising-privacy-product-depth/spec.md)・[015](specs/015-product-details-inline-maps/spec.md)で今回の変更を定義します。最終の検証・配信状況は[検証](docs/verification.md)と[公開記録](docs/deployment-results.json)を参照してください。

0.12はThe Good Trade / Who What Wear / マイベスト等の実ページを参照し、既存42点の日英紹介と本文を商品固有の内容へ改稿。全商品で「この一品を選ぶなら」と比較候補の違いを説明し、能作の錫、水引、友禅、銀糸、七宝、久留米絣、伊勢志摩アコヤ真珠の8点を追加しました。50公開商品・14都道府県・24技法・258出典記録。41点は対象商品の有効な公式注文受付、9点は営業中の小売と価格付き現行カタログを確認。これは将来の在庫や注文成立の保証ではありません。

CO.COON2点、欠品中の浜松屋18K、現行の注文/小売根拠を確認できなかった畠山2点はdraftへ。古い掲載URL・比較・地域・サイトマップ・現行画像参照から外します。畠山の403を廃業/売切れとは認定しません。HARIOは現行8,250円を確認し、旧キャッシュ7,480円を使っていません。各県同数や最低2商品より、確認できた販売経路を優先します。

013の画像構成は旧25ファイルと新23ファイルの計48ファイルで50商品に対応する仕様です。旧25ファイルのbytesは保持し、新23ファイルにはIPTC XMPのAI由来を記録します。新23人は27〜33歳の架空成人で、日本7・米国8・英国8、cute11・elegant12という制作設定。国籍を見た目から判断した記録ではありません。未許諾写真・ロゴ・地図・口コミを転載せず、AIは実物再現/試着実績と区別します。短いAIイメージ/AI image表示は維持。画像の参照・生成方針は[画像計画](docs/image-plan-v13.md)、採用・変換・表示の検証は[画像検証](docs/image-verification-v13.md)を参照。0.12時点の「25画像で27商品、23商品はテキストpreview、新規生成なし」は[前版引継ぎ](docs/archive/handoff-v12.md)の履歴です。

海外検索には日英の独立URL・相互hreflang・canonicalを維持し、英語見出しと全商品の検索説明文、パンくず、AI画像の構造化データを改善します。実際のGoogle掲載・順位・米英流入はSearch Consoleで未確認です。[海外SEO調査・更新手順](docs/international-seo-v13.md)に一次資料と必要な確認を記録し、HTMLの検査を検索流入の実績と混同しません。

日英とも国内通販の参考価格を主表示。海外ストア価格は別枠で、その購入先と対応させます。独自換算なし。片耳/一組の確認できた単位はpriceUnitで表示し、勝手に倍額へ換算しません。23店舗を43商品へ関連づけ、店舗存在と個別商品の在庫は区別します。Mapsは外部リンクを残し、0.14から表示操作後の小型埋込みを追加しました。

**収益化の前提は未解決です。GitHub Pagesの商用利用条件の適合確認または適した公開先の選択、AdSenseの実ホスト登録/所有確認、広告導入時のPrivacy/同意/CSP対応が残ります。技術テストや商品数は、適法性・契約適合・AdSense合格を証明しません。**

## 動かす

Node.js24.22.1以上、pnpm11.25.0。Astro7.4.12、TypeScript、Markdown、静的生成。

    pnpm install --frozen-lockfile
    pnpm dev

未設定のlocal/previewはnoindex。公開に必要な実値は環境へ置き、認証・.envを保存しません。

| コマンド | 確認 |
| --- | --- |
| pnpm verify | 型/データ/単体/本番生成/内部リンク/CSP/メタ |
| node scripts/check-international-seo.mjs | 最終本番生成物のcanonical/hreflang/検索文/パンくず/全商品AI画像/robots/sitemap。実掲載や流入は別確認 |
| pnpm readiness | 技術公開条件。商用契約と申請は別判定 |
| pnpm check:quality | 販売証跡/公開除外/予算/価格順/比較/地域/日英3幅 |
| pnpm check:browser | 全公開商品の表示・言語・画像・公式への基本導線 |
| pnpm check:prices | 日英の国内/海外価格と購入先 |
| pnpm check:copy | 旧版からの実改稿、固有コピーの完全一致重複。意味や真偽の自動評価ではない |
| pnpm check:ads | 実データを変えない隔離広告6ケース |
| pnpm check:depth | 全50商品の固有Q&A/単体図/Privacy導線を日英3幅で確認 |
| node --experimental-strip-types scripts/check-inline-maps.mjs | 地図の表示前後・閉じる・再読込・未許可provider拒否 |
| pnpm check:links | 外部URLの到達性。403/503を即閉鎖としない |
| pnpm package | 全ソースを隣接納品先へ書出し。ZIPは別途作成 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| specs/014-advertising-privacy-product-depth/・015-product-details-inline-maps/ | 最新Privacy/選ぶ内容/単体図/地図の仕様・設計・タスク・検証 |
| specs/013-complete-imagery-international-seo/ | 継承する全件画像・海外SEO仕様 |
| product-buying-guides.json・ProductBuyingGuide.astro | 商品固有の日英3問、正本tokenと出典 |
| product-detail-images.json・ProductDetailImage.astro | 全50単体AI図、alt、実物確認へのリンク |
| advertising-privacy.json・lib/advertising-privacy.ts | 広告off状態・policy versionの整合、環境flag開始拒否 |
| lib/store-map-embeds.ts・map-embed-url.ts・VisitGuide.astro | 固定Google Share URL・許可条件・表示後だけiframe生成 |
| specs/012-distinctive-product-selection/ | 継承する商品固有の紹介・比較・追加商品の仕様 |
| src/data/catalog.json / translations/ja.json | 商品事実/市場価格/priceUnit/広告、日英の表示文 |
| src/data/purchase-evidence.json / lib/purchase-evidence.ts | 公開商品の現行注文/小売根拠、出典/日付/商品URLと店舗の整合 |
| src/data/selection-notes.json / ChoiceDetails.astro | 商品固有の違い/選ぶ理由/比較する公開商品ID。価格を再入力しない |
| src/data/region-choice-notes.json / RegionalChoiceGuide.astro | 実在する地域の商品から選ぶ説明、種類別件数と国内価格帯 |
| src/lib/shopping-filters.ts | 国内予算区分/未知を末尾にする価格順 |
| src/data/product-stories.json / content/products | 独自の見出し・装い・商品本文とdecision.bestFor/consider、日英対 |
| src/data/visits.json / lib/visits.ts | 確認済店舗、公式URL、固定Maps、未確認時の代替 |
| editorial-images.json / docs/assets.json | AI表示の正本、画像・写真権利と退役台帳 |
| src/lib/seo.ts / layouts/Base.astro | 正本から作る検索文、canonical、WebPage/パンくず/AI画像の構造化データ |
| config/region-selection.ts / selection.ts | 観光庁訪問率TOP10と編集上の代表1品。売上順位ではない |
| docs/research/sources.json | 一次資料・実確認日・支える事実。258件は記録数であり、独立した258サイトの意味ではない |
| lib/affiliate.ts / market-prices.ts / components | 承認二重ゲート/host/locale、市場と価格の対応 |

## 監査・引継ぎ

- [法務の詳細点検](docs/legal-audit-v11.md)
- [競合との差と改善](docs/competitive-review-v11.md)
- [AdSenseの残条件](docs/adsense-review-v11.md)
- [公開先の適合と移行準備](docs/hosting-commercial-readiness-v11.md)
- [追加品と掲載保留](docs/regional-expansion-v11.md)
- [アフィリエイト媒体の参照と独自設計](docs/affiliate-editorial-reference-v12.md)
- [既存42商品の改稿](docs/editorial-copy-review-v12.md)
- [今回の追加8品と採否](docs/essential-products-v12.md)
- [全件画像の計画と一次参照](docs/image-plan-v13.md) / [画像検証](docs/image-verification-v13.md)
- [海外SEOの一次資料・変更・残確認](docs/international-seo-v13.md)
- [更新手順](docs/operations.md) / [引継ぎ](docs/handoff.md) / [検証](docs/verification.md)

Contactや本人情報を作らず、申請送信・広告配信・新契約・課金・ドメイン購入を実行していません。プログラム/リンクはすべて未申請。更新時は014/015とAGENTSを読み、013の画像/SEO、012の固有紹介と011の購入先の再確認・公開除外を継承してください。前版はdocs/archiveのv13、013実測はvisual-seo-stage、012はeditorial-stage、011はquality-stageとして履歴を分けます。
