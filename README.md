# Japanese Craft Jewelry

SORAが日本各地の工芸ジュエリーを選んで紹介する、日本語・英語のセレクトメディアです。販売・決済・発送、ブログ、お問い合わせは設けません。

**別のAIへ渡す場合は、[START_HERE.md](START_HERE.md)から読ませてください。** Webサイト構築を新チャットに移行する場合は、[サイト専用引継ぎ書](docs/SITE_NEW_CHAT_HANDOFF.md)とその中のコピー用プロンプトから始められます。 現在の状態、起動、変更する正本、検証、画像原本の取得、残条件まで辿れます。前の会話や作成者PCのファイルは不要です。

[日本語サイト](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [コピー用の引継ぎ依頼文](docs/ai-handoff.md#コピーして使う)

## 最初に読むもの

| 目的 | 入口 |
| --- | --- |
| 別AIがそのまま続きを始める | [START_HERE](START_HERE.md) → [AGENTS](AGENTS.md) → [機械可読の状態](docs/handoff-status.json) |
| 現在の公開/完了/残条件 | [引継ぎ状態](docs/handoff.md)・[公開appとActions](docs/deployment-results.json) |
| 起動・本番同等build・公開・復旧 | [セットアップ](docs/setup.md) |
| 商品/価格/本文/店舗/画像を更新 | [編集ガイド](docs/editing-guide.md)・[データ案内](src/data/README.md) |
| 構造と変更の影響を確認 | [architecture](docs/architecture.md)・[検証ガイド](docs/verification-guide.md) |
| 全prompt・画像原本・過去納品ZIP | [GitHub配布資料の案内](docs/handoff-assets.md)・[URL/SHA一覧](docs/handoff-assets.json) |
| ほかの文書・仕様を探す | [docs一覧](docs/README.md) |

## 現在の基準

SORAのSNSプロフィール用ページから、特集商品と旅先ごとのセレクトへ進めます。媒体別のURLと更新の正本は[仕様029](specs/029-sora-profile-links/spec.md)を参照してください。

[仕様028](specs/028-purchase-routes/spec.md)で公式通販とカタログ・取扱店への案内を整理しました。直近の商品追加は、青森・岩手・山形・大分の4品です。 [仕様027](specs/027-regional-craft-picks/spec.md)

公開69/登録75商品、28都道府県、一次出典327件、38店舗、人物67＋単体69のAI画像136枚を掲載。

公開コミットとActionsは[公開記録](docs/deployment-results.json)、購入導線の確認範囲は[検証記録](specs/028-purchase-routes/validation.md)を参照してください。

AdSenseはoff、実アフィリエイトは未申請/通常リンクです。実ID/CMP/本人情報/契約/商用ホスト等は[運営上の残条件](docs/remaining-task-audit-v17.md)。申請や契約を資料だけで済んだことにしません。

## まず起動する

サポート中のNode（最低24.22.3）、pnpm11.25.0を用意します。

~~~sh
git clone https://github.com/rozawa619/japanese-craft-jewelry.git
cd japanese-craft-jewelry
node scripts/check-runtime.mjs
pnpm install --frozen-lockfile
pnpm dev
~~~

表示されたLocal URLの`/ja/`と`/en/`を開きます。`.env`なしではpreview/noindexです。公開と同じbase/metadataでの検査は[setup](docs/setup.md#本番同等のローカル検査)を使います。ブラウザー検証にはChrome本体が必要です。

## どこを直すか

| 内容 | 正本 |
| --- | --- |
| 事実/商品/工房/分類/国内・海外別の価格/広告リンク | `src/data/catalog.json` |
| 日本語/本文/紹介・比較/Q&A | `src/data/translations/ja.json`、`src/content/products/`、`product-stories.json`、`selection-notes.json`、`product-buying-guides.json` |
| 購入根拠/店舗とGoogle Maps | `src/data/purchase-evidence.json`、`src/data/visits.json`、`src/lib/store-map-embeds.ts` |
| 人物画像/単体画像/用途・権利/生成指示 | `src/data/editorial-images.json`、`product-detail-images.json`、`docs/assets.json`、[人物manifest](docs/image-generation-japanese-v23.json) |
| 調査・出典と確認日 | `docs/research/sources.json`・[research](docs/research/) |
| Hero/地図/写真サイズ | `RegionHero.astro`、`JapanJewelryMap.astro`、`RegionSelection.astro`・[編集ガイド](docs/editing-guide.md) |

## 変更の流れ

1. 新しい依頼とAGENTSを確認し、`git status --short`で既存変更を保護する。
2. 正本と影響を特定し、仕様・タスク・実装を対応させる。商品追加は一次情報確認とdraftから始める。
3. [検証マトリクス](docs/verification-guide.md#変更別に検証を選ぶ)で必要な検査を選ぶ。`pnpm verify`や追加検査を本番同等設定で実行し、reportを作業固有名で保存する。
4. 公開が依頼範囲ならGitHub Actionsの対象SHAと実URLを確認する。文書だけの変更とアプリの公開を混同しない。
5. 引継ぎ状態、仕様/検証と関連文書を更新する。GitHub原本は[SHA付き取得CLI](docs/handoff-assets.md#shaを検証して取得する)、source ZIPの再作成は`pnpm package:delivery`を使う。

## 日本人女性の人物画像023

[023の方針と履歴](docs/japanese-model-styling-v21.md)・[仕様/検証](specs/023-japanese-model-styling/)を参照します。22枚を新生成・採用、36枚を保持、旧22URLは非配信です。生成記録を保持し、新しい画像変更には新しい記録を作ります。旧023の移行helperや過去の固定保全検査は、fresh cloneの起動条件にはしません。

GitHubに保存したものの一覧と、新しいcloneからの実測は[024 validation](specs/024-git-ai-handoff/validation.md)に記録します。通常buildに元PNG・隣接delivery・過去の1198ファイルZIPは不要です。現在のソースは`main`、1198はmodels-023納品時の履歴値です。
