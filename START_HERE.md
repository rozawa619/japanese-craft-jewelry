# 別のAIへ引き継ぐ入口

## サイト構築を新しいチャットに引き継ぐ場合

**[サイト専用の引継ぎ書](docs/SITE_NEW_CHAT_HANDOFF.md)** から開始してください。最新の公開版、読む順番、編集する正本と検証方法をまとめています。新チャットには[コピー用の引継ぎ文](docs/SITE_NEW_CHAT_HANDOFF.md#新チャット貼付用のプロンプト)を貼れます。

### 最近のサイト変更

公開版は **v0.29.0** です。東京に江戸切子、東京銀器、東京七宝、江戸刺繍、江戸漆器の5点を追加し、東京は10点、全国47都道府県は176点になりました。旅先検索では堀口切子の予約制工房がある江戸川・松江を選べます。2026-11-24 23:07 JSTに[GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45410363699)の配信が完了しました。 [仕様040](specs/040-tokyo-craft-jewelry/spec.md) · [一次情報](docs/research/tokyo-craft-jewelry-2026-11-24.md) · [公開検証](specs/040-tokyo-craft-jewelry/validation.md)

全国掲載と旅先検索の基盤は[仕様035](specs/035-national-travel-discovery/spec.md)です。v0.24.1でスマートフォンの初期画面に検索への通常リンクを追加し、選択後の商品プレビューのリンクの高さを44px以上に修正しました。当時のWebKitエミュレーションの結果は[035の検証記録](specs/035-national-travel-discovery/validation.md)に残しています。

このリポジトリとGitHub上の資料から、Japanese Craft Jewelryの保守を再開できます。公開版と配信元は[公開記録](docs/deployment-results.json)で確認できます。[仕様028](specs/028-purchase-routes/spec.md)で、公式通販と取扱店への案内を商品ごとの購入根拠に合わせました。

[仕様034](specs/034-kyoto-video-jewelry/spec.md)で、京都の公開動画と照合した4商品を日英のSORAプロフィールに追加し、神奈川7商品の購入案内を公式情報と再照合しました。034当時のスマートフォン相当の操作結果は[034の検証記録](specs/034-kyoto-video-jewelry/validation.md)を参照してください。

[仕様033](specs/033-sora-video-jewelry/spec.md)で、SORAの日英プロフィールページに動画で紹介した商品の一覧を追加しました。TikTokとInstagramのプロフィール向けURLも仕様033で確認できます。

[仕様032](specs/032-purchase-selections/spec.md)で、販売ページの選択名とカタログの掲載名を商品詳細・商品カードに表示しました。対象と照合結果は[032の検証記録](specs/032-purchase-selections/validation.md)で確認できます。

[仕様031](specs/031-product-image-disclosure/spec.md)で、商品画像から実物の確認へ進む日英の案内を整えました。商品詳細の主購入リンクとスマートフォンの固定欄、商品カードに表示します。 [検証記録](specs/031-product-image-disclosure/validation.md)

ガラスと木の素材ページは[仕様030](specs/030-material-guides/spec.md)を参照してください。SORAのTikTok・Instagramプロフィールから案内する日英URLと、特集商品の変更箇所は[仕様029](specs/029-sora-profile-links/spec.md)にまとまっています。


## TikTok・Instagram・Google Flowの制作を引き継ぐ場合

動画制作は最新mainの **[新チャット完全引継ぎ書](docs/video/NEW_CHAT_HANDOFF.md)** から始めてください。コピペ用の引継ぎ文も掲載しています。[動画SDD](docs/video/spec.md)、[Flow共通テンプレート](docs/video/flow-template.md)、[制作台帳](docs/video/production-status.json)、[TikTok公開台帳](docs/video/tiktok-publication-registry.json)を確認し、制作台帳から現在回とその指示文を開きます。

別チャットや別のAIでも、新作を選ぶ前にサイト原本の9:16の収まりを確かめます。出力で冒頭の見切れや、ほくろ・単独の濃い点が見えたテイクは要修正と記録します。 [構図と肌の基準](docs/video/NEW_CHAT_HANDOFF.md#今後の全動画に共通する基準)

Instagramリールの紹介文は、[キャプションテンプレート](docs/video/instagram-caption-template.md)と対象episodeを参照してください。本文と公開確認も同じ動画制作の台帳からたどれます。

## 読む順番

1. [AGENTS.md](AGENTS.md)：現在有効な制作・調査・画像・広告・検証の規則。
2. [handoff-status.json](docs/handoff-status.json)：現在の状態、公開app、完了済み作業、正本、外部情報が必要な残条件。
3. [現在状態](docs/handoff.md)と[編集ガイド](docs/editing-guide.md)：今回触るファイルを特定。
4. [セットアップ](docs/setup.md)と[検証ガイド](docs/verification-guide.md)：起動と変更に応じた検査。
5. 該当機能の仕様を読む。直近の東京5商品追加は[040](specs/040-tokyo-craft-jewelry/spec.md)、全国掲載と旅先検索の基盤は[035](specs/035-national-travel-discovery/spec.md)、購入導線は[028](specs/028-purchase-routes/spec.md)、Git引継ぎの基盤は[024](specs/024-git-ai-handoff/spec.md)。

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

[画像原本と配布資料](docs/handoff-assets.md)からGitHub上のZIPを取得できます。[配布一覧](docs/handoff-assets.json)にURL・容量・SHA256を記録し、`node scripts/fetch-handoff-asset.mjs --list`で一覧を表示できます。原本が必要な画像編集時だけダウンロードしてください。公開中のAI画像350枚（着用174＋商品単体176）は既に`public/images/`にあります。

023の`apply-japanese-model-styling.mjs`は完了済み22枚の移行専用、`check-japanese-model-preservation.mjs`は旧画像を残した当時のcheckout専用です。fresh cloneの起動や通常編集の必須手順にはしません。新しい画像変更は新しい仕様/manifestで記録し、023の固定集合・過去の証拠を書き換えて通しません。

## 続きの作業

新しい依頼を確認し、`git status --short`で既存の変更を保護します。変更する正本と検証範囲を決め、仕様・実装・検証・引継ぎを揃えます。着用画像は架空の日本人成人女性の設定です。現在の方針は[AGENTS.md](AGENTS.md#画像とui)を参照し、新規画像にはユーザーの最新の希望を反映します。

AdSenseはoff、実アフィリエイトは未申請/通常リンクです。実ID、認定CMP、本人情報、契約や商用ホストの確認などは[残条件](docs/remaining-task-audit-v17.md)に分けています。これらを勝手に申請・契約したり、未提供情報を作ったりしません。

最後に必要な検査、変更ファイル、未実施範囲と残条件を記録します。公開が依頼範囲なら対象SHAのActionsと実URLを確認します。資料だけの変更で公開済みサイトを変更したことにはしません。

別AIへ貼る短い依頼文は[こちら](docs/ai-handoff.md#コピーして使う)です。
