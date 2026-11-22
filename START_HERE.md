# 別のAIへ引き継ぐ入口

このリポジトリとGitHub上の資料から、Japanese Craft Jewelryの保守を再開できます。前の会話や作成者のPCは不要です。2026-11-19現在、[仕様027](specs/027-regional-craft-picks/spec.md)で青森・岩手・山形・大分の4品を追加した0.20.0を公開・検証済みです。


## TikTok・Instagram・Google Flowの制作を引き継ぐ場合

サイト制作とは別に、**SORA｜旅先で待ち合わせ**の動画制作ルールと最新進捗を [動画専用の引継ぎ入口](docs/video/README.md) に集約しています。TikTok動画、Flow指示文、サイトの女性を使ったPOVデート動画の依頼は、最初に同入口 → [仕様](docs/video/spec.md) → [進捗](docs/video/production-status.json) → 進行中のepisodeを確認してください。未確認の生成・投稿を完了扱いにせず、作業後は進捗台帳を更新します。

Instagramリールの紹介文は、[キャプションテンプレート](docs/video/instagram-caption-template.md)と対象episodeを参照してください。本文と公開確認も同じ動画制作の台帳からたどれます。

## 読む順番

1. [AGENTS.md](AGENTS.md)：現在有効な制作・調査・画像・広告・検証の規則。
2. [handoff-status.json](docs/handoff-status.json)：現在の状態、公開app、完了済み作業、正本、外部情報が必要な残条件。
3. [現在状態](docs/handoff.md)と[編集ガイド](docs/editing-guide.md)：今回触るファイルを特定。
4. [セットアップ](docs/setup.md)と[検証ガイド](docs/verification-guide.md)：起動と変更に応じた検査。
5. 該当機能の仕様だけ読む。最新の完了実装は[027](specs/027-regional-craft-picks/spec.md)、Git引継ぎの基盤は[024](specs/024-git-ai-handoff/spec.md)。

全世代の検証JSONを最初から読む必要はありません。GitのHEADは文書更新を含み、実際に公開されたappのSHAとは異なる場合があります。[deployment-results.json](docs/deployment-results.json)が公開の正本です。

## 起動

サポート中のNode（最低24.22.3）とpnpm11.25.0を用意し、次を実行します。Node、Chrome、Gitの認証情報は各作業環境で用意します。

~~~sh
git clone https://github.com/rozawa619/japanese-craft-jewelry.git
cd japanese-craft-jewelry
node scripts/check-runtime.mjs
pnpm install --frozen-lockfile
pnpm dev
~~~

表示されたLocal URLの`/ja/`または`/en/`を開きます。`.env`なしの初期状態はプレビュー/noindexです。本番同等のbuild、JA/EN・スマホ検査、公開と復旧のコマンドは[setup](docs/setup.md#本番同等のローカル検査)にあります。ブラウザー検査にはChrome本体が必要です。

通常の編集・buildに必要なソース、商品本文、画像WebP、調査出典、生成指示、台帳、仕様、検証JSONはGitにあります。`artifacts/`、作成者PCのNode、隣接delivery、元PNGの存在を通常作業の前提にしません。

## 画像原本・過去の納品物

[画像原本と配布資料](docs/handoff-assets.md)からGitHub上のZIPを取得できます。[配布一覧](docs/handoff-assets.json)にURL・容量・SHA256を記録し、`node scripts/fetch-handoff-asset.mjs --list`で一覧を表示できます。原本が必要な画像編集時だけダウンロードしてください。公開中の136画像は既に`public/images/`にあります。

023の`apply-japanese-model-styling.mjs`は完了済み22枚の移行専用、`check-japanese-model-preservation.mjs`は旧画像を残した当時のcheckout専用です。fresh cloneの起動や通常編集の必須手順にはしません。新しい画像変更は新しい仕様/manifestで記録し、023の固定集合・過去の証拠を書き換えて通しません。

## 続きの作業

新しい依頼を確認し、`git status --short`で既存の変更を保護します。変更する正本と検証範囲を決め、仕様・実装・検証・引継ぎを揃えます。着用画像は架空の日本人成人女性の設定です。現在の方針は[AGENTS.md](AGENTS.md#画像とui)を参照し、新規画像にはユーザーの最新の希望を反映します。

AdSenseはoff、実アフィリエイトは未申請/通常リンクです。実ID、認定CMP、本人情報、契約や商用ホストの確認などは[残条件](docs/remaining-task-audit-v17.md)に分けています。これらを勝手に申請・契約したり、未提供情報を作ったりしません。

最後に必要な検査、変更ファイル、未実施範囲と残条件を記録します。公開が依頼範囲なら対象SHAのActionsと実URLを確認します。資料だけの変更で公開済みサイトを変更したことにはしません。

別AIへ貼る短い依頼文は[こちら](docs/ai-handoff.md#コピーして使う)です。
