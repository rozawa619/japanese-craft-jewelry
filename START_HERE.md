# 別のAIへ引き継ぐ入口

このリポジトリとGitHub上の資料から、Japanese Craft Jewelryの保守を再開できます。前の会話や作成者のPCは不要です。2026-11-17現在、サイト0.18.0と日本人AIモデル画像の差し替え023は公開・検証済みです。**023を再実装せず、今回ユーザーから渡された依頼に着手してください。**

## 読む順番

1. [AGENTS.md](AGENTS.md)：現在有効な制作・調査・画像・広告・検証の規則。
2. [handoff-status.json](docs/handoff-status.json)：現在の状態、公開app、完了済み作業、正本、外部情報が必要な残条件。
3. [現在状態](docs/handoff.md)と[編集ガイド](docs/editing-guide.md)：今回触るファイルを特定。
4. [セットアップ](docs/setup.md)と[検証ガイド](docs/verification-guide.md)：起動と変更に応じた検査。
5. 該当機能の仕様だけ読む。最新の完了実装は[023](specs/023-japanese-model-styling/spec.md)、このGit引継ぎ整備は[024](specs/024-git-ai-handoff/spec.md)。

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

[画像原本と配布資料](docs/handoff-assets.md)からGitHub上のZIPを取得できます。[配布一覧](docs/handoff-assets.json)にURL・容量・SHA256を記録し、`node scripts/fetch-handoff-asset.mjs --list`で一覧を表示できます。原本が必要な画像編集時だけダウンロードしてください。公開中の118画像は既に`public/images/`にあります。

023の`apply-japanese-model-styling.mjs`は完了済み22枚の移行専用、`check-japanese-model-preservation.mjs`は旧画像を残した当時のcheckout専用です。fresh cloneの起動や通常編集の必須手順にはしません。新しい画像変更は新しい仕様/manifestで記録し、023の固定集合・過去の証拠を書き換えて通しません。

## 続きの作業

新しい依頼を確認し、`git status --short`で既存の変更を保護します。変更する正本と検証範囲を決め、仕様・実装・検証・引継ぎを揃えます。画像は架空の日本人成人女性25〜33歳の設定、かわいい/綺麗な方向性、AIイメージ表記と元比率を維持します。最新ユーザー指示が優先です。

AdSenseはoff、実アフィリエイトは未申請/通常リンクです。実ID、認定CMP、本人情報、契約や商用ホストの確認などは[残条件](docs/remaining-task-audit-v17.md)に分けています。これらを勝手に申請・契約したり、未提供情報を作ったりしません。

最後に必要な検査、変更ファイル、未実施範囲と残条件を記録します。公開が依頼範囲なら対象SHAのActionsと実URLを確認します。資料だけの変更で公開済みサイトを変更したことにはしません。

別AIへ貼る短い依頼文は[こちら](docs/ai-handoff.md#コピーして使う)です。
