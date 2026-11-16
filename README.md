# Japanese Craft Jewelry

[日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

SORAが日本各地の工芸ジュエリーを選ぶ日英の紹介サイト。ブログ・販売決済・Contactは設けません。公開状態はdocs/deployment-results.jsonのversion/commit/Actions/実測を確認してください。

0.11は法務・競合・AdSenseの公式資料を点検し、商品固有の選択メモ、実データの比較、国内予算/価格順、地域内の選び方を追加。最新指示により、全商品で現行の購入先を確認しています。42公開商品・12都道府県・18技法・240出典記録。33点は対象商品の有効な公式注文受付、9点は営業中の小売と価格付き現行カタログを確認。これは将来の在庫や注文成立の保証ではありません。

CO.COON2点、欠品中の浜松屋18K、現行の注文/小売根拠を確認できなかった畠山2点はdraftへ。古い掲載URL・比較・地域・サイトマップ・現行画像参照から外します。畠山の403を廃業/売切れとは認定しません。HARIOは現行8,250円を確認し、旧キャッシュ7,480円を使っていません。各県同数や最低2商品より、確認できた販売経路を優先します。

画像は25点のAIイメージが27商品に対応。残る15商品は独自のテキストプレビューと公式写真/商品への通常リンクです。未許諾写真・ロゴ・地図・口コミを転載せず、AIは実物再現/試着実績と区別します。短いAIイメージ/AI image表示は維持。

日英とも国内通販の参考価格を主表示。海外ストア価格は別枠で、その購入先と対応させます。独自換算なし。片耳/一組の確認できた単位はpriceUnitで表示し、勝手に倍額へ換算しません。20店舗を37商品へ関連づけ、店舗存在と個別SKU在庫は区別します。Mapsは外部リンクのみ。

**収益化の前提は未解決です。GitHub Pagesの商用利用条件の適合確認または適した公開先の選択、AdSenseの実ホスト登録/所有確認、広告導入時のPrivacy/同意/CSP対応が残ります。技術テストや商品数は、適法性・契約適合・AdSense合格を証明しません。**

## 動かす

Node.js24.22.1以上、pnpm11.25.0。Astro7.4.12、TypeScript、Markdown、静的生成。

    pnpm install --frozen-lockfile
    pnpm dev

未設定のlocal/previewはnoindex。公開に必要な実値は環境へ置き、認証・.envを保存しません。

| コマンド | 確認 |
| --- | --- |
| pnpm verify | 型/データ/単体/本番生成/内部リンク/CSP/メタ |
| pnpm readiness | 技術公開条件。商用契約と申請は別判定 |
| pnpm check:quality | 販売証跡/公開除外/予算/価格順/比較/地域/日英3幅 |
| pnpm check:browser | 全公開商品の表示・言語・画像/公式preview・基本導線 |
| pnpm check:prices | 日英の国内/海外価格と購入先 |
| pnpm check:ads | 実データを変えない隔離広告6ケース |
| pnpm check:links | 外部URLの到達性。403/503を即閉鎖としない |
| pnpm package | 全ソースを隣接納品先へ書出し。ZIPは別途作成 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| specs/011-legal-quality-expansion/ | 最新仕様・設計・タスク・検証 |
| src/data/catalog.json / translations/ja.json | 商品事実/市場価格/priceUnit/広告、日英の表示文 |
| src/data/purchase-evidence.json / lib/purchase-evidence.ts | 公開商品の現行注文/小売根拠、出典/日付/商品URLと店舗の整合 |
| src/data/selection-notes.json / ChoiceDetails.astro | 商品固有の違い/選ぶ理由/比較する公開商品ID。価格を再入力しない |
| src/data/region-choice-notes.json / RegionalChoiceGuide.astro | 実在する地域の商品から選ぶ説明、種類別件数と国内価格帯 |
| src/lib/shopping-filters.ts | 国内予算区分/未知を末尾にする価格順 |
| src/data/product-stories.json / content/products | 独自の見出し・装い・商品本文、日英対 |
| src/data/visits.json / lib/visits.ts | 確認済店舗、公式URL、固定Maps、未確認時の代替 |
| editorial-images.json / docs/assets.json | AI表示の正本、画像・写真権利と退役台帳 |
| config/region-selection.ts / selection.ts | 観光庁訪問率TOP10と編集上の代表1品。売上順位ではない |
| docs/research/sources.json | 一次資料・実確認日・支える事実。240件は記録数であり、独立した240サイトの意味ではない |
| lib/affiliate.ts / market-prices.ts / components | 承認二重ゲート/host/locale、市場と価格の対応 |

## 監査・引継ぎ

- [法務の詳細点検](docs/legal-audit-v11.md)
- [競合との差と改善](docs/competitive-review-v11.md)
- [AdSenseの残条件](docs/adsense-review-v11.md)
- [公開先の適合と移行準備](docs/hosting-commercial-readiness-v11.md)
- [追加品と掲載保留](docs/regional-expansion-v11.md)
- [更新手順](docs/operations.md) / [引継ぎ](docs/handoff.md) / [検証](docs/verification.md)

Contactや本人情報を作らず、申請送信・広告配信・新契約・課金・ドメイン購入を実行していません。プログラム/リンクはすべて未申請。更新時は011とAGENTSを読み、購入先の再確認と公開除外の派生更新まで行ってください。
