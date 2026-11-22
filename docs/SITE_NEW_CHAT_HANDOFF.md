# SORA / Japanese Craft Jewelry — サイト構築用・新チャット引継ぎ

**作成：2026-11-22（JST）**  
**適用範囲：Webサイト構築・商品追加・UX/SEO・運用・収益化準備の引継ぎ**  
**動画制作は [動画専用引継ぎ](video/NEW_CHAT_HANDOFF.md) で別管理する。**

## 入口

- GitHub main: https://github.com/rozawa619/japanese-craft-jewelry
- 日本語サイト: https://rozawa619.github.io/japanese-craft-jewelry/ja/
- English: https://rozawa619.github.io/japanese-craft-jewelry/en/
- 動画用の引継ぎ: [docs/video/NEW_CHAT_HANDOFF.md](video/NEW_CHAT_HANDOFF.md)

## 現在のサイトと公開履歴

SNSのプロフィールからは[日英のSORAページと媒体別URL](../specs/029-sora-profile-links/spec.md)を使えます。特集の掲載順は `src/config/selection.ts`、動画の制作・投稿状況は動画台帳で管理します。

[仕様028](../specs/028-purchase-routes/spec.md)で公式通販とカタログ・取扱店への案内を整理しました。最新の配信版・SHA・Actionsは[公開記録](deployment-results.json)、購入ボタンと確認日の実測は[028の検証記録](../specs/028-purchase-routes/validation.md)を参照してください。

> **以下は2026-11-19のデプロイ成功記録 v0.20.0 のスナップショット。** 最新mainのHEADは、その後の文書更新を含むため、実公開アプリのバージョン・SHAと一致しないことがある。新チャットでは必ず再取得し、実URLの確認と区別する。

- アプリ v0.20.0 / 11月19日の機能リリースSHA `41773dbbf0a8c9c565d6e956751de82307190c44`
- 公開のGitHub Actions成功: https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44536903083
- 公開69商品、登録75商品（うちdraft 6）、28都道府県、公開関連技法40/全42、出典327、取扱店舗38
- AI画像136点（着用の女性67、商品単体69）。既存のサイト画像は原則維持し、実在人物の試着・レビューと混同しない
- 使用技術：Astro 7、TypeScript、Zod。日英対応の静的サイトをGitHub Pagesで配信。商品JSON/日英Markdownを主に編集する。サイトに決済・発送・会員データベース・ブログ・Contactはない
- 実装の例：日本地図、地域ごとの着用女性Hero、都道府県/商品/工芸/素材からの導線、商品一覧と絞り込み、商品詳細、国内・海外リンクの市場別管理、店舗訪問案内と同意付きGoogle Maps、SEO（canonical/hreflang/sitemap）、AI画像/広告の開示、スマホ表示
- **収益化の実装と外部承認は別物**：実アフィリエイトは未申請で通常リンク運用。AdSenseはoff。実アカウント/契約・認定CMP・Commercial hostingの適合判断・Search Consoleの実プロパティ/結果等は別の未完条件
- 商品追加の実装仕様は `specs/027-regional-craft-picks/`。青森・岩手・山形・大分の4県4品の公開検証記録がある
- 完了した人物画像移行 023 のapply専用スクリプトは再実行しない

### 最優先の根拠ファイル

| 内容 | ファイル |
| --- | --- |
| 開始順序と制約 | [START_HERE](../START_HERE.md)、[AGENTS](../AGENTS.md)、[README](../README.md) |
| 状態（機械可読） | [docs/handoff-status.json](handoff-status.json) |
| 公開appのSHA/URL/検証 | [docs/deployment-results.json](deployment-results.json)、[028 validation](../specs/028-purchase-routes/validation.md) |
| 完了点/未完了 | [docs/handoff.md](handoff.md)、[docs/remaining-task-audit-v17.md](remaining-task-audit-v17.md) |
| 技術構成と更新箇所 | [docs/architecture.md](architecture.md)、[docs/editing-guide.md](editing-guide.md) |
| 構築・検証 | [docs/setup.md](setup.md)、[docs/verification-guide.md](verification-guide.md)、[package.json](../package.json) |
| 商品と日本語 | [src/data/catalog.json](../src/data/catalog.json)、[src/data/translations/ja.json](../src/data/translations/ja.json) |
| 人物/商品画像 | [src/data/editorial-images.json](../src/data/editorial-images.json)、[src/data/product-detail-images.json](../src/data/product-detail-images.json) |
| 出典・価格・購入根拠 | [docs/research/sources.json](research/sources.json)、[src/data/purchase-evidence.json](../src/data/purchase-evidence.json) |
| アフィリエイト準備 | [docs/affiliate-readiness.md](affiliate-readiness.md)、[docs/pre-application-checklist.md](pre-application-checklist.md) |
| SNS連動 | [動画引継ぎ](video/NEW_CHAT_HANDOFF.md)、[TikTok重複防止](video/tiktok-publication-registry.json) |

### 環境・検証について

`AGENTS.md` と `docs/setup.md` の最新版に従う。2026-11-22の文書では最低Node 24.22.3と pnpm 11.25.0。リポジトリを作業用にcloneできる環境なら `pnpm install --frozen-lockfile`、`pnpm dev`、影響する変更には `pnpm verify` を原則として使う。ただしChatGPTのGitHub閲覧権限と、git clone/ローカルbuild/commit/push権限は異なる。実際に使える操作だけを報告し、実行していない検証を成功扱いしない。

## 新チャットの初回に必ず報告すること

1. 現行サイトをどういうビジネスとして、どの技術で運営するか（日本語と英語）
2. 公開中アプリの version/SHA/Actions と最新 main HEAD の違い
3. 商品/地域/工芸/店舗/人物画像/出典の件数と地域別の分布（正本データで再集計）
4. 実装済み機能・現在のデザイン・導線（現行公開URLも可能な範囲で確認）
5. 外部条件を含む「未完了」の事実（アフィリエイト未申請・AdSense off・ホスティング/規約等）
6. 既知の品質/権利/SEO/セキュリティのガードレール
7. 収益化・アクセス・UX・商品追加の観点で、重要度順の改善案5〜10件。各案に実装元と検証の見通しを付す
8. まずユーザーに選んでもらう提案を1〜3件まで絞り、未依頼の実装・申請・公開は実行しない

## 新チャット貼付用のプロンプト

```text
「SORA / Japanese Craft Jewelry」のWebサイト構築・改善を、新しいチャットで引き継いでください。今回は最初に現状の把握と改善計画を作り、その結果を確認してから開発内容を決めます。過去のチャット内容を想像で補わず、GitHub mainブランチの実際のファイルと公開記録を正本にしてください。

GitHub: https://github.com/rozawa619/japanese-craft-jewelry
公開サイト（日本語）: https://rozawa619.github.io/japanese-craft-jewelry/ja/
公開サイト（英語）: https://rozawa619.github.io/japanese-craft-jewelry/en/

最初に以下のファイルを、mainの最新内容で実際に読み込んでください。
1. docs/SITE_NEW_CHAT_HANDOFF.md（今回のサイト専用引継ぎ）
2. START_HERE.md
3. AGENTS.md
4. README.md
5. docs/handoff-status.json
6. docs/deployment-results.json
7. docs/handoff.md
8. docs/architecture.md
9. docs/editing-guide.md
10. docs/setup.md
11. docs/verification-guide.md
12. docs/remaining-task-audit-v17.md
13. docs/affiliate-readiness.md、docs/pre-application-checklist.md
14. src/data/catalog.json、src/data/translations/ja.json、src/data/editorial-images.json、src/data/product-detail-images.json
15. 購入導線の specs/028-purchase-routes/spec.md と validation.md、商品追加の specs/027-regional-craft-picks/spec.md

次の観点で調査して、表と文章で結果を報告してください。

A. 現在のプロジェクト：目的、事業モデル、使用技術・フォルダ構造、サイトのURL、日本語/英語対応、制作済みデザイン・機能
B. 公開・開発の状態：GitHub mainの最新HEAD、公開アプリのコミットSHAとバージョン、GitHub Actions、実URLの表示確認。文書だけの変更を本番デプロイと混同しない
C. コンテンツ：公開商品・下書き商品・都道府県・工芸・店舗・出典・画像の件数。最新のcatalogや画像正本から再計算して記録値との相違を区別。地域別の掲載商品数上位も集計
D. 画面とUX：トップページの日本地図・地域ヒーロー、商品一覧・絞り込み、商品詳細、素材/工芸/産地ページ、価格、公式購入先、店舗案内、スマホ、日英切替、SEO、広告・AI画像の開示
E. 収益化：ASP/アフィリエイトは実際に提携承認済みか、AdSenseは稼働中か、商用ホストの規約適合・ドメイン・CMP・Privacyはどういう状態か。「実装済みの仕組み」と「未実施の外部申請」を分ける
F. 保守・品質：ビルド・unit/型/画像/SEO/Privacy/リンク検証の実行方法、既知の課題、公開の成功/未検証範囲、重要なガードレール
G. 優先度：サイトの収益化・コンテンツ拡充・UX改善・SEO・運用安全性の観点から、次に取り組む候補を重要度順に5〜10件。各候補について効果、必要な作業、依存条件、実現可能性、変更する正本ファイル、必要な検証を示す
H. 新チャットから開発するときの安全な進め方：既存の商品や画像を勝手に削除・生成・上書きせず、GitHubの現在の編集差分を保護し、変更後は検証・コミット・必要なら公開を確認する

事業上の目的は、全国の伝統工芸・地域工芸のアクセサリーを日本語と英語で紹介し、将来的にアフィリエイト収益を得ること。サイト内で自社販売、決済、発送、ブログ、Contactは行わない。商品・価格・工房・製法・産地・素材・金具・在庫・出典・許諾・提携状況・レビュー等は裏付けのある情報だけを使ってください。

TikTok/Instagram/Google Flowの動画制作は別ワークフローです。必要な場合だけ docs/video/NEW_CHAT_HANDOFF.md、docs/video/tiktok-publication-registry.json、docs/video/production-status.json を参照し、サイト掲載の女性画像と商品IDの一致・重複防止を保ってください。サイト用の調査で勝手に新しい女性画像を作らないでください。

まずは「現状の整理」と「次に着手すべき改善候補」の報告だけをしてください。アプリの実装修正・商品の新規公開・外部アカウントの申請/契約・課金・ホスト移行・広告有効化は、私が具体的に依頼するまで行わないでください。

確認できた事実と推定を区別し、できなかった検証を未確認と明示してください。過去に完了した画像023の移行処理は再実行しないでください。新しいチャットでサイトの開発に続けて取り組めるよう、以後もGitHubの正本・仕様・検証記録を更新してください。
```

## 更新ルール

このファイルは**引継ぎ入口**であり、継続的に変わる商品数・公開SHA・外部承認の実績は各正本へ先に反映する。実装を変える場合は必要な仕様/テスト/検証とあわせて更新し、文書更新だけでアプリが公開されたと記録しない。TikTok/Flowの動画制作台帳はサイトのdeployと独立して管理する。
