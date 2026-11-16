# Japanese Craft Jewelry — Jewelry & maker stories from Japan.

[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

公開バージョンと最終確認の状態は `docs/deployment-results.json` と `docs/handoff.md` に記録します。公開modeはpublic。運営表示はユーザー指定の公開名SORA、訂正窓口は実在GitHub Issuesです。提携は未申請・未承認です。

日本各地の工芸ジュエリーを紹介する英語・日本語のメディアです。全国の産地・作り手へ広げられる共通データと画面を持ち、現時点の調査済み特集は箱根寄木細工です。当サイトに商品販売・カート・決済・発送機能はありません。

公開対象はピアス・イヤリング・ネックレスのジュエリー8件です。ガイド6本、運営方針5ページ、地域・技法・商品本文を日英で用意しています。かんざし1件は非公開データとして保持し、ジュエリー一覧・フィルター・サイトマップへ出しません。提携は未申請で、販売店リンクは通常リンクです。商品写真の転載許諾は取得しておらず、実物写真は掲載せず、自作の抽象装飾と、明示したAI生成の成人女性着用イメージ2点を使っています。実商品の柄・寸法・金具を再現する画像ではありません。技術実装、実際の公開、申請準備、提携承認は別の状態です。最終の実行結果と公開先は `docs/handoff.md` を確認してください。

## 動かす

Node.js **24.22.1以上**、pnpm **11.25.0**。Astro **7.4.12**、TypeScript、Markdownによる静的サイトです。依存関係の確定版は `pnpm-lock.yaml` に記録されています。

```text
pnpm install --frozen-lockfile
pnpm dev
```

開発サーバーの表示URLを開きます。環境値を設定しない状態は検索登録を避けるpreviewです。ビルド済みサイトを見るには次を実行します。

```text
pnpm build
pnpm preview
```

| コマンド | 用途 |
| --- | --- |
| `pnpm check` | Astro型・コンテンツスキーマ・データ参照確認 |
| `pnpm test` | 広告切替・fallback・データ整合性・公開設定テスト |
| `pnpm build` | `dist/` へ本番静的生成 |
| `pnpm verify` | 型・参照・テスト・ビルド・生成物の内部リンク確認 |
| `pnpm readiness` | 公開URL・公開モード・運営者・Contact等の不足検出 |
| `pnpm check:links` | 外部商品・募集先等のリンク確認 |
| `node scripts/check-bilingual.mjs` | 両言語の画面・1ボタン切替・URL状態・ジュエリー範囲・スマホ検証 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| `src/data/catalog.json` | 価格・仕様・参照ID・広告状態を含む共有事実の正本 |
| `src/data/translations/ja.json` | 同じ安定IDに結ぶ日本語の表示文。価格・数値・確認日・URLを複製しない |
| `src/content/products/` | 商品ごとの独自紹介本文。安定productIdでデータと接続 |
| `src/content/guides/` | 選び方・金具・技法・海外購入ガイド |
| `src/content/places/` | 都道府県IDと結ぶ地域本文。公開商品がある地域だけ生成 |
| `src/content/crafts/` | 技法IDと結ぶ技法本文。公開商品がある技法だけ生成 |
| `src/content/policies/` | About・編集方針・広告開示・Privacy・Contact |
| `src/content.config.ts` | 日英Markdownコレクションのスキーマ |
| `src/lib/i18n.ts` / `src/lib/content.ts` | UI文言とlocale別の本文読込 |
| `src/components/LanguageSwitch.astro` | 右上の1ボタンで現在ページの日英を切り替える |
| `src/config/site.ts` / `tokens.css` | 表示名・言語・公開設定とデザイントークン |
| `src/lib/schema.ts` | カタログの実行時スキーマと型 |
| `src/lib/affiliate.ts` | 安全なURLと広告切替の共通関数 |
| `src/lib/catalog.ts` | 正規化データの読込・参照・表示値 |
| `src/components/` | 商品カード、販売店リンク、開示、比較等の共通表示 |
| `src/layouts/` / `src/pages/` / `src/styles/` | 共通画面、ルート、スタイル |
| `docs/research/sources.json` | 一次資料、確認日、何の根拠か |
| `docs/assets.json` | 装飾の権利根拠と商品写真の許諾状態 |
| `specs/001-media-launch/` / `specs/002-jewelry-bilingual/`、`specs/003-search-security-features/` | 版ごとの仕様/設計/タスク |
| `scripts/` / `tests/` | データ・公開・リンク・広告等の検証 |
| `public/` | 利用権が確認された公開アセット |

英語は `/en/`、日本語は `/ja/`。同じページは同じslugを持ち、右上の「日本語 / English」ボタン1つで対応ページへ移動します。商品フィルターのクエリとURLのhashも切替時に保持します。都道府県と制作地の確証、工房と販売店は別の情報です。未知属性は有利なフィルター条件を満たす値にしません。下書きや空の47都道府県ページは公開しません。

地域一覧は全国の産地を扱う入口ですが、調査済みで本文と公開商品が揃う地域だけを掲載します。空の47都道府県ページは生成しません。地域を増やすときはマスタと商品を追加し、`src/content/places/<prefectureId>.md` に `prefectureId` と `relatedMerchantIds`、技法は `src/content/crafts/<craftId>.md` に `craftId` を設定します。ファイル名と対応IDを一致させます。地域・技法は汎用ルートから生成されるため、新しい都道府県ごとの画面ファイルは不要です。publishedで空でない本文、出典、対応する公開商品が揃った場合だけページ・サイトマップの対象になります。詳しい手順は `docs/operations.md` を参照してください。

## 広告の切り替え

プログラムの公開募集状態と当運営者の承認状態を別管理します。商品別リンクとプログラムの両方が `approved`、有効なHTTPS広告URL、programId、実際のリンク確認日がある場合だけ広告リンクを採用します。それ以外は公式通常リンクへ戻り、通常URLもなければCTAを出しません。広告リンクには `sponsored` を付け、最初の広告リンクより前に共通開示を表示します。

操作手順と条件確認は `docs/operations.md`、候補比較は `docs/research/affiliate-programs.md`、未解決条件は `docs/affiliate-readiness.md` を参照してください。BECOS英語版の候補があることは、現在の神奈川商品が提携対象であることを意味しません。

## 公開設定

`.env.example` を起点に、実URL・公開責任の表示・使える問い合わせ方法を設定します。`PUBLIC_SITE_URL`、`PUBLIC_BASE_PATH`、`PUBLIC_PUBLISH_MODE`、`PUBLIC_OPERATOR_NAME`、`PUBLIC_CONTACT_EMAIL`、`PUBLIC_REPOSITORY_URL` が入口です。`PUBLIC_` に秘密値を入れないでください。

初期の未設定状態では `pnpm readiness` は公開ブロッカーを表示して非0終了します。これはローカルプレビューの動作不良を意味しません。正式公開時は実URLのcanonical、OGP、sitemap、robots、サブパス、Contact、404を実際に確認します。GitHubリポジトリ・公開URL・申請送信の成功は、確認された結果だけを `docs/handoff.md` に記録します。

## 次のAI・運営者へ

変更前に `AGENTS.md` と `docs/constitution.md` を読み、仕様から作業を始めてください。商品・工房・産地・記事の追加、価格更新、承認後の切替、配色・言語の変更、公開更新の具体的な手順は `docs/operations.md` にまとめています。出典、権利、申請、実測値や連絡先の不足を架空の値で埋めないことが、このサイトの最優先ルールです。

## 翻訳を更新する

英語本文は従来の各Collection直下、日本語は同じCollectionの `ja/<同じslug>.md` に置きます。例：`src/content/guides/pierced-or-clip-on.md` と `src/content/guides/ja/pierced-or-clip-on.md`。日本語のfrontmatterは `locale: ja`。本文の出典ID・商品ID・地域/技法IDは日英で一致させ、記事内容を更新したら両方を確認します。商品本文も `products/ja/<商品ID>.md` を用意します。

商品・工房・販売店の日本語ラベルは `src/data/translations/ja.json` に置き、共有事実を上書きしません。不明な金具や寸法は日本語でもnullのままです。`pnpm check` と `pnpm test` は翻訳欠落、言語間の参照ずれ、非ジュエリーの公開を検出します。変更後はビルドし、両言語のページと右上ボタンを確認します。

## 0.3の公開と安全な運用

現在の名称はJapanese Craft Jewelry。新しい紹介特集は`/en/journal/hakone-yosegi-pierced-earrings/`と`/en/journal/hakone-yosegi-non-pierced-earrings/`、同slugの日本語版もあります。

- 安全設計とGitHub Pagesの制約：`docs/security.md`
- 承認後の広告host/URL設定・停止：`docs/affiliate-operations.md`
- SEOとURL移行：`docs/seo-and-migration.md`
- 生成画像の原promptと確認方法：`docs/image-generation.json`、画像台帳`docs/assets.json`

名称やURLの変更だけで検索順位・流入は保証されません。検索公開後もGoogleのクロール・登録を待つ必要があり、Search Consoleの所有確認/登録送信は行っていません。
