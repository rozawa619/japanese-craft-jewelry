# Japanese Craft Jewelry — Curated jewelry from Japan

[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

日本各地の工芸ジュエリーから、選んだ商品を英語・日本語で紹介するサイトです。セレクトショップのように商品を探し、詳しく見て、外部の販売店へ進めます。当サイトにカート・決済・注文受付・発送機能はありません。

0.5では、全8商品の紹介をデザインの魅力と装いから始める構成へ更新しています。商品名、短い見出し、イメージ、価格、販売店へのボタンを入口にし、選ぶ理由と具体的なコーディネート案を続けます。仕様・配送・作り手の詳細・出典は下部の折りたたみで確認できます。読みもの一覧やブログには戻しません。現在の調査済み産地は神奈川・箱根で、全国の商品・産地へ広げられる共通データを保ちます。

運営者表示は **SORA**。提携は未申請・未承認で、販売店リンクは通常リンクです。未許諾の商品写真は使用せず、抽象装飾と、成人女性のAI着用イメージ2点を明示して使います。AI画像は紹介商品の実物写真や正確な再現ではなく、柄・寸法・金具・着用感を保証しません。

**実装、ローカル検証、公開確認、実際の売上改善は別の状態です。最新の配信版は `docs/deployment-results.json` と `docs/handoff.md` を優先してください。0.4以前の成功を0.5の公開成功へ読み替えません。**

## 動かす

Node.js **24.22.1以上**、pnpm **11.25.0**。Astro **7.4.12**、TypeScript、Markdownの静的サイトです。

```text
pnpm install --frozen-lockfile
pnpm dev
```

ビルド済みサイトは `pnpm build` → `pnpm preview`。環境未設定では検索登録を避けるpreviewになります。

| コマンド | 用途 |
| --- | --- |
| `pnpm check` | 型・スキーマ・参照・日英の商品本文を確認 |
| `pnpm test` | 広告切替・商品紹介データ・URL・公開条件を確認 |
| `pnpm build` | `dist/` へ静的生成 |
| `pnpm verify` | 型・データ・単体・ビルド・生成リンクをまとめて確認 |
| `pnpm readiness` | 公開URL・公開モード・運営者・Contactの不足を検出 |
| `pnpm check:links` | 外部の商品・募集先リンクを確認 |
| `pnpm check:browser` | 日英・スマホ・商品導線・画像・絞込・言語切替を確認 |
| `pnpm check:ads` | 実データを変えず、広告の承認・停止・欠落等を隔離確認 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| `src/config/selection.ts` | トップの代表商品とおすすめ順序。安定商品IDを指定 |
| `src/data/catalog.json` | 商品・価格・仕様・作り手・産地・販売店・広告設定の共有事実 |
| `src/data/translations/ja.json` | 安定IDに結ぶ日本語表示。価格・数値・URLは重複しない |
| `src/data/product-stories.json` | 全公開商品の日英見出し・導入・3つの訴求・装いの提案 |
| `src/lib/product-stories.ts` | `storyFor(productId, locale)` で紹介データを読み込む共通入口 |
| `src/content/products/` と `products/ja/` | 商品ごとの独自本文。デザインの魅力・選んだ理由・装いの補足 |
| `src/data/editorial-images.json` / `public/images/` | 商品IDとAI着用イメージの対応・公開画像 |
| `src/content/places/` / `crafts/` | 商品分類を補う産地・技法情報。公開商品がある対象のみ |
| `src/content/policies/` | 運営・選定方針・広告開示・Privacy・Contact |
| `src/content/guides/` | 旧読みものの下書き保管。現在の公開導線に使わない |
| `src/components/` | 商品カード・販売店リンク・広告開示・画像表示・言語切替 |
| `src/lib/affiliate.ts` | 安全なURL・許可ホスト・広告切替の共通関数 |
| `src/config/site.ts` / `tokens.css` | 名称・説明・公開設定と見た目 |
| `docs/research/sources.json` | 一次資料・確認日・支える事実 |
| `docs/research/product-merchandising.md` | 参照サイトの観察、今回の設計判断、公式商品画像の実視記録 |
| `docs/assets.json` / `image-generation.json` | 画像の権利状態・制作記録・非実物の用途 |
| `specs/005-product-appeal/` | 最新の仕様・設計・タスク |
| `scripts/` / `tests/` | データ・リンク・広告・表示・公開設定の検証 |

## 商品を増やす・魅力を伝える

商品・作り手・販売店と一次情報、確認日、日英本文に加え、`product-stories.json` へ安定商品IDを登録します。両言語に `headline`、`standfirst`、`highlights` 3件、`outfit.title` と `outfit.body` が必要です。

「どんなデザインか」「どの服に合わせたいか」「どこに惹かれて選んだか」を具体的に書きます。「ピアス穴がある方」など商品種別の前提を推薦理由にしません。丸山C/Dは公式画像で確認した星状・縦長バーの違いを紹介します。着心地、軽さ、肌への適合、試着経験やレビューは作りません。価格・数値・広告URLはcatalogを更新し、紹介データや本文へ複製しません。詳しい手順は `docs/operations.md`。

英語は `/en/`、日本語は `/ja/`。右上のボタン1つで同じ商品・一覧・絞り込みquery/hashを維持して切り替えます。産地・技法は商品分類で、背景は折りたたみ表示です。旧journalの14URLは、適切な商品・一覧・技法へ固定で案内するnoindexの移行口のみ残します。

## 購入導線と広告

主CTAの前に共通の短い開示を置きます。スマホの追従CTAは有効な販売先がある場合に、主CTAを通過した後だけ表示し、フッターが見えると隠します。主CTA・繰り返しCTA・追従CTAは同じ承認resolverを使います。開示を隠したり、未承認URLを追従CTAだけに設定したりしません。

広告化は商品別リンクとprogramの両承認、対象販売店、確認日、有効HTTPS URL、完全一致の許可ホストが揃う場合だけです。停止・欠落・不正は通常URLへ戻り、通常URLも不正ならボタンを出しません。広告の `sponsored` と日英開示を一致させます。現在の商品がBECOS等の対象とは確認していません。

- 更新手順：`docs/operations.md`
- 承認後の設定・停止：`docs/affiliate-operations.md`
- 安全設計と配信環境の制約：`docs/security.md`
- 候補・未確認条件：`docs/research/affiliate-programs.md`、`docs/affiliate-readiness.md`
- 現在の状態：`docs/handoff.md`、`docs/deployment-results.json`

## 0.5の確認状態

実測済みのローカル結果は、型0エラー・0警告・0ヒント、単体42件、56HTML・1819内部参照・43アンカー・172通常リンク/0広告・14旧URL移動です。ローカル81/81・54画面、最終カード6/6、広告5/5、公開81/81＋補足10/10が完了。最新配信はbe3d316、Actions43839206515 success。最終結果は後続のverification/deployment/handoff記録で確定します。構成変更による流入・クリック・売上の改善は未測定です。
