# Japanese Craft Jewelry

[日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

SORAが日本各地の工芸ジュエリーを選ぶ日英サイト。公開50品/14地域/24技法、商品出典258記録、23店舗を43品に関連付けています。41品は公式注文受付、9品は営業小売/現行価格付きカタログの既存確認を保持し、将来の在庫・注文成立を保証しません。ブログ/Contact/サイト内販売決済は設けません。

0.15は種類別の入口に小さな代表ジュエリー画像を入れ、スマホの絞込・言語・操作域・長い見出し・固定CTAを調整。出典と確認日はnativeの閉じた一覧にまとめ、必要な時に開けます。全98画像は既存AIイメージのままで、新規生成や写真転載なし。代表は実地域/種類/公開商品から選び、価格/件数/絞込先を保ちます。

セキュリティ点検で外部リンク検査のredirect/DNS経由の内部接続リスクを修正し、Node最低版24.22.3/起動前検査/CI依存監査を追加しました。既知audit0と完全安全は別です。詳細[security review](docs/security-review-v15.md)、host/accountで残る条件も記録しています。

最新仕様は[016](specs/016-visual-choices-mobile-security/spec.md)。実公開/Actions/検証の確定値は[deployment-results](docs/deployment-results.json)、[verification](docs/verification.md)。前版はdocs/archiveのv14、旧実測はprivacy-depth-stageです。

## 起動・検証

サポート中の修正版Node.js24.22.3以上、pnpm11.25.0。古いNodeは起動前検査で停止します。CIは24系列の最新patchとlockfileを使います。

    pnpm install --frozen-lockfile
    pnpm dev

未設定local/previewはnoindex。本番の実URL/base/operatorは.env.exampleと[operations](docs/operations.md)。秘密や実IDを保存しません。

| コマンド | 対象 |
| --- | --- |
| pnpm verify | 型/データ/124単体/生成リンク/CSP/人物・単体画像/Privacy |
| pnpm check:seo | canonical/hreflang/sitemap/商品meta。検索順位/流入は別確認 |
| pnpm check:quality | 全50商品日英3幅/絞込/比較/地域/購入根拠 |
| pnpm check:prices | 日英の実市場価格/価格単位と正しい公式購入先 |
| pnpm check:mobile | 狭幅/横向き/touch/開閉/地図の代表画面 |
| pnpm check:sources | 全248正規URLの閉じた出典/日付の保持 |
| pnpm check:ads | 実データを変えない隔離広告6ケース |
| pnpm audit --audit-level=low | npm依存の既知情報の時点監査 |
| pnpm check:links | 公開HTTPS/DNS/各redirectを検証した到達性確認 |
| pnpm package | 隣接deliveryへソース書出し。ZIP全件SHA検証は納品proof |

Chrome検査は最終distのpreviewにCHECK_BASE_URLを設定。共有build中には実行しません。公開後は別report/prefixで実測し、node scripts/check-hosted-release.mjsでHTML/画像をlocalと照合。結果名はvisual-mobile-stage、書出しから.git/.env/秘密/node_modules/dist/artifacts/退役10画像を除きます。

## 編集入口

| 場所 | 役割 |
| --- | --- |
| catalog.json・translations/ja.json | 商品事実/日英表示/国内JPYと海外実価格。FX換算なし |
| product-stories・content/products・selection-notes・product-buying-guides | 固有の紹介/比較/日英3問。仕様tokenと出典を保持 |
| purchase-evidence・visits・docs/research/sources.json | 現行購入/店舗の根拠、一次資料、実確認日 |
| type-choices.ts・TypeChoiceImage・RegionalChoiceGuide・home | 実際に属する商品から選ぶ画像付き入口 |
| Sources・MarketPrice・product template・VisitGuide | 出典/確認日の閉じた一覧、価格と公式導線 |
| editorial-images・product-detail-images・docs/assets.json | 人物48/単体50のAI画像、alt/権利/退役履歴 |
| advertising-privacy・Base・store-map-embeds | AdSense off固定/Privacy/CSP、Google Maps表示選択 |
| affiliate.ts・market-prices.ts | program/個別リンク両承認/host/date/locale、市場の対応 |
| scripts/lib/safe-outbound.ts・check-runtime.mjs | 外部検査の公開IP固定と実行環境の最低版 |

[引継ぎ](docs/handoff.md) · [更新手順](docs/operations.md) · [申請前](docs/pre-application-checklist.md) · [セキュリティ](docs/security.md)

提携/広告は未申請・通常リンク、AdSense off。実アカウント/所有確認/認定CMP/地域別同意・配信統合、GitHub Pages商用用途適合または適した公開先の選択は残ります。申請/契約/課金/DNS変更なし。技術検査や内容量でAdSense合格/法令・契約適合を保証しません。COCOON2/欠品18K/販売未確認の畠山2/hairpinはdraftを維持します。
