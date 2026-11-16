# Japanese Craft Jewelry — Curated jewelry from Japan

[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

日本各地の工芸ジュエリーから、選んだ商品を英語・日本語で紹介するサイトです。セレクトショップのように商品を探し、詳しく見て、外部の販売店へ進める構成です。当サイトにカート・決済・注文受付・発送機能はありません。

0.4では商品を主役にし、読みもの一覧とブログ形式の紹介を外します。ピアス・イヤリング・ネックレス8件を扱い、浜松屋のピアスとイヤリングの紹介・着用イメージを、それぞれの商品ページへまとめます。全国へ広げられる共通データを保ち、現在の調査済み産地は神奈川・箱根です。空の都道府県ページは作りません。

運営者表示は **SORA**、訂正窓口は実在GitHub Issuesです。提携は未申請・未承認で、販売店リンクは通常リンクです。商品写真は未許諾につき使用せず、抽象装飾と、非実物と明示した成人女性のAI着用イメージ2点を使います。AI画像は商品の柄・寸法・金具・着用感を再現する証拠ではありません。

**0.4の実装・検証・公開状態は `docs/deployment-results.json` と `docs/handoff.md` を優先してください。過去版の検証結果を0.4の公開成功として扱いません。**

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
| `pnpm test` | 広告切替・URL・公開条件など重要な挙動を確認 |
| `pnpm build` | `dist/` へ静的生成 |
| `pnpm verify` | 型・データ・単体・ビルド・生成リンクをまとめて確認 |
| `pnpm readiness` | 公開URL・公開モード・運営者・Contactの不足を検出 |
| `pnpm check:links` | 外部の商品・募集先リンクを確認 |
| `pnpm check:browser` | 日英・スマホ・絞り込み・商品画像・言語切替を確認 |
| `pnpm check:ads` | 実データを変えず、広告の承認・停止・欠落等を隔離確認 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| `src/config/selection.ts` | トップの代表商品とおすすめ順序。安定商品IDを指定 |
| `src/data/catalog.json` | 商品・価格・仕様・作り手・産地・販売店・広告設定の共有事実 |
| `src/data/translations/ja.json` | 安定IDに結ぶ日本語表示。価格・数値・URLは重複しない |
| `src/content/products/` と `products/ja/` | 同じproductIdに結ぶ日英の商品紹介。選ぶ理由・装い・購入前確認 |
| `src/data/editorial-images.json` | 商品IDとAI着用イメージの対応。実物写真とは別管理 |
| `public/images/` | サイト内で配信する画像 |
| `src/content/places/` / `crafts/` | 商品選びを補う産地・技法情報。公開商品がある対象のみ |
| `src/content/policies/` | 運営・選定方針・広告開示・Privacy・Contact |
| `src/content/guides/` | 旧読みものの下書き保管。現在の公開商品導線に使わない |
| `src/components/` | 商品カード・販売店リンク・広告開示・画像表示・言語切替 |
| `src/lib/affiliate.ts` | 安全なURL・許可ホスト・広告切替の共通関数 |
| `src/config/site.ts` / `tokens.css` | 名称・説明・公開設定と見た目 |
| `docs/research/sources.json` | 一次資料・確認日・支える事実 |
| `docs/assets.json` / `image-generation.json` | 画像の権利状態・制作記録・非実物の用途 |
| `specs/` | 版ごとの仕様・設計・タスク。最新はspecs/004-product-selection/ |
| `scripts/` / `tests/` | データ・リンク・広告・表示・公開設定の検証 |

## 商品を増やす

商品・作り手・販売店を追加し、一次情報と確認日、日英の商品本文を揃えます。ブログ記事は必要ありません。公開商品には選ぶ理由と未確認点を示し、実物未使用の商品に試着レビューを作りません。価格・数値・広告URLはcatalogを1回だけ更新し、本文へ再入力しません。手順は `docs/operations.md`。

英語は `/en/`、日本語は `/ja/`。同じ商品slugを保ち、右上のボタン1つで現在の商品・一覧・絞り込みquery/hashを維持して切り替えます。産地・技法は商品を探す分類ページで、背景説明を折りたたみに収めます。地域は独立マスタと共通ルートから増やせます。神奈川の画面を複製して全国ページを作りません。

旧 `/journal/` と旧読みものURLは、適切な商品・一覧・技法へ案内する移行口にします。ブログとして公開せず、noindexにし、サイトマップと通常のナビ・商品導線には載せません。旧ファイルと過去の実行レポートは履歴として保持します。

## 広告・公開・引継ぎ

承認後は商品別リンクとprogramの両承認、対象販売店、確認日、有効HTTPS URL、完全一致の許可ホストを設定した場合だけ広告化します。停止・欠落・不正は通常URLへ戻り、通常URLも不正ならボタンを出しません。最初の広告ボタンより前の開示と `sponsored` は共通部品で管理します。現在の商品がBECOS等の対象とは確認していません。

- 更新手順：`docs/operations.md`
- 承認後の設定・停止：`docs/affiliate-operations.md`
- 安全設計と配信環境の制約：`docs/security.md`
- 候補・未確認条件：`docs/research/affiliate-programs.md`、`docs/affiliate-readiness.md`
- 現在の範囲と最終結果：`docs/handoff.md`、`docs/deployment-results.json`

`.env.example` は設定名の見本です。実際の値はローカル環境または公開workflowへ設定します。`PUBLIC_` は公開情報なので秘密値を入れません。公開はreadiness・verify・Actions成功・実URL確認まで行い、申請送信や提携承認と分けて記録します。
