# SORA / Japanese Craft Jewelry サイト構築の引継ぎ

**最終更新 2026-11-27（JST）**

日本全国の地域工芸アクセサリーを日英で紹介し、将来のアフィリエイト収益につなげるサイトです。サイト構築にはこの文書を使います。TikTok・Instagramの投稿文やGoogle Flowの制作は、[動画専用引継ぎ](video/NEW_CHAT_HANDOFF.md)を使います。

## 最初に開く

| 内容 | 入口 |
| --- | --- |
| 正本 | [GitHub リポジトリ](https://github.com/rozawa619/japanese-craft-jewelry)・[最新 main](https://github.com/rozawa619/japanese-craft-jewelry/tree/main) |
| 公開サイト | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/)・[英語](https://rozawa619.github.io/japanese-craft-jewelry/en/) |
| SNSプロフィールからの商品案内 | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/#video-jewelry)・[英語](https://rozawa619.github.io/japanese-craft-jewelry/en/sora/#video-jewelry)・[媒体別URL](../specs/033-sora-video-jewelry/spec.md) |
| 検索向けファイル | [サイトマップ](https://rozawa619.github.io/japanese-craft-jewelry/sitemap.xml)・[robots.txt](https://rozawa619.github.io/japanese-craft-jewelry/robots.txt) |
| 別チャットへの依頼文 | [コピー用の引継ぎ文](#新チャット貼付用のプロンプト) |

1. 最新の `main` を取得し、[START_HERE.md](../START_HERE.md)、[AGENTS.md](../AGENTS.md)、[引継ぎ状態](handoff-status.json)、[公開記録](deployment-results.json)を読みます。作業用のチェックアウトでは `git status --short` と `git rev-parse HEAD` を先に確認します。
2. `main` のHEAD、公開記録の `applicationCommit`、Actionsの結果、実URLの応答をそれぞれ確認します。引継ぎ資料の更新も `main` の履歴に含まれます。
3. 商品数や承認状況は正本を参照します。初回は現在地と未確認事項、次の候補を報告し、実装範囲はそのチャットでのユーザー依頼に合わせます。

## 現在の公開版

| 項目 | 2026-11-28（JST）確認時点 |
| --- | --- |
| アプリ | **v0.31.0**、アプリSHA `933685df021fb142d4f2b77c4dd60caf738155e2` |
| 配信 | GitHub Pages。2026-11-28 16:25 JSTに配信完了。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/46121103414) |
| 照合 | [044の検証](../specs/044-top10-seven-craft-jewelry/validation.md)・[公開記録](deployment-results.json) |
| 商品・地域 | 登録196点、公開189点、下書き7点。47都道府県を掲載。Top10の全県7点以上、島根2点 |
| 工芸・購入先 | 公開に紐づく技法114件（全116件）、出典828件。82店舗、店舗案内付き127商品。購入根拠は通販179点、予約問い合わせ1点、店舗とカタログ9点 |
| 画像 | サイト表示用AI画像376枚（着用187・単体189）。新11商品に計22枚を追加。京都の動画原本3枚は既存URLで参照可能 |
| 広告 | 実アフィリエイトは未申請で通常の公式リンクを使用。AdSenseはオフ。 [提携準備](affiliate-readiness.md)・[運営上の残条件](remaining-task-audit-v17.md) |

Astro 7・TypeScript・Zodを使う日英の静的サイトです。日本地図から産地を選び、商品一覧の絞り込み、工芸・素材のページ、商品詳細へ進めます。商品詳細には価格、公式通販または取扱店の案内、出典を掲載します。店舗のGoogle Mapsは利用者の許可に応じて表示します。サイトの運営範囲は紹介と外部の販売先への案内です。 [技術構成](architecture.md)

### 直近の機能と仕様

| 仕様 | 公開した変更 |
| --- | --- |
| [027](../specs/027-regional-craft-picks/spec.md) | 青森・岩手・山形・大分の4県4商品を追加 |
| [028](../specs/028-purchase-routes/spec.md) | 公式通販とカタログ・取扱店の購入案内を明示 |
| [029](../specs/029-sora-profile-links/spec.md) | SORAの日英プロフィール用ページと京都・神奈川への案内 |
| [030](../specs/030-material-guides/spec.md) | ガラス14点・木13点を比較できる日英の素材ページ |
| [031](../specs/031-product-image-disclosure/spec.md) | 商品カード・詳細・固定購入欄で、AI画像と実物の確認先を案内 |
| [032](../specs/032-purchase-selections/spec.md) | 照合済み10商品の色・金具などの選択名やカタログ掲載名。凛然「星華 琥珀」の国内・海外価格に1組の販売単位 |
| [033](../specs/033-sora-video-jewelry/spec.md) | 日英 `/sora/#video-jewelry` で、照合済みのTikTok公開10投稿に対応する神奈川7商品から詳細へ移動 |
| [034](../specs/034-kyoto-video-jewelry/spec.md) | 京都4商品を動画導線に追加し、神奈川7商品と合わせて11商品。神奈川7商品の購入案内とスマートフォン相当の操作を検証 |
| [035](../specs/035-national-travel-discovery/spec.md) | 注文受付を再確認した19県の19商品を加え、47都道府県・88商品を公開。地方→都道府県→訪問エリア→商品を選ぶ日英の旅先検索。v0.24.1でスマートフォンの初期画面に検索への通常リンクを追加し、選択後の商品プレビューのリンクの高さを44px以上に修正 |
| [036](../specs/036-regional-craft-jewelry-picks/spec.md) | 青森・秋田・石川・静岡・沖縄に各1商品を追加し、公開93商品へ拡充。角館・金沢・那覇の訪問エリアを追加 |
| [037](../specs/037-top10-craft-jewelry-depth/spec.md) | 16商品を追加し、公開109点。Top10全県に5点以上。掲載1点だった岩手・福島・熊本・大分を各2点に拡充 |
| [038](../specs/038-two-per-prefecture/spec.md) | 掲載が1点だった26県に各1点を追加し、47都道府県で各2点以上、全135商品を公開しています。 |
| [039](../specs/039-three-per-prefecture/spec.md) | 掲載が2点だった36県に各1点を追加し、47都道府県すべてで各3点以上、全国171点に拡充 |
| [040](../specs/040-tokyo-craft-jewelry/spec.md) | 東京の工芸5点を追加して東京10点・全国176点。旅先検索に江戸川・松江を追加 |
| [041](../specs/041-image-quality-corrections/spec.md) | 手指、イヤリングの留め位置、顔の見切れ、単体画像の余分なチェーンを計6枚で修正 |
| [042](../specs/042-site-visual-review/spec.md) | 着用6枚とスマホの見出しを修正。「光衣 L」を予約案内へ変更し、旧販売ページが404のN-15を下書きに戻した |
| [043](../specs/043-osaka-chiba-craft-jewelry/spec.md) | 大阪の蜻蛉玉ブローチ、千葉のつまみ細工と銀のペンダントトップを追加 |
| [044](../specs/044-top10-seven-craft-jewelry/spec.md) | 6地域に11商品を追加し、Top10の各都道府県が7点以上、全国189点 |

### 編集・検証の正本

| 内容 | 読むファイル |
| --- | --- |
| 技術構成、編集、起動、検証 | [README.md](../README.md)・[技術構成](architecture.md)・[編集ガイド](editing-guide.md)・[セットアップ](setup.md)・[検証ガイド](verification-guide.md) |
| 商品、日英の表示、公開状態 | [catalog.json](../src/data/catalog.json)・[日本語データ](../src/data/translations/ja.json)・[`src/content/products/`](../src/content/products/) |
| 出典、購入根拠、訪問案内 | [sources.json](research/sources.json)・[purchase-evidence.json](../src/data/purchase-evidence.json)・[visits.json](../src/data/visits.json) |
| 着用画像、商品単体画像、権利 | [editorial-images.json](../src/data/editorial-images.json)・[product-detail-images.json](../src/data/product-detail-images.json)・[画像台帳](assets.json)・[原本資料](handoff-assets.md) |
| 041の画像6枚の編集元 | [編集元のたどり方](handoff-assets.md#041の修正画像の編集元をたどる)・[着用](image-generation-styling-v41.json)・[単体](image-generation-solo-v41.json) |
| 代表商品とSNSページ | [selection.ts](../src/config/selection.ts)・[tiktok-publication-registry.json](video/tiktok-publication-registry.json) |
| 公開履歴と保守 | [公開記録](deployment-results.json)・[引継ぎ状態](handoff-status.json)・[保守の引継ぎ](handoff.md)・[CHANGELOG.md](../CHANGELOG.md) |

## 次の候補と残条件

### 全国掲載と旅先検索（035〜040）

全国拡充と日英の旅先検索の基盤は[仕様035](../specs/035-national-travel-discovery/spec.md)です。47都道府県から探せるようにし、神奈川は箱根・鎌倉、東京は訪問先を確認した各エリアから商品に進めます。[仕様036](../specs/036-regional-craft-jewelry-picks/spec.md)で5県に各1商品と、角館・金沢・那覇の訪問エリアを追加しました。都道府県とエリアの表示用データは [travel-areas.ts](../src/config/travel-areas.ts) にあります。追加5商品の確認は[一次情報の記録](research/regional-craft-picks-2026-11-24.md)、画像の作成条件は[着用イメージの記録](image-generation-styling-v36.json)と[単体イメージの記録](image-generation-solo-v36.json)を参照してください。035当時の19商品は[当時の一次情報](research/national-listings-2026-11-24.md)に残しています。

[仕様037](../specs/037-top10-craft-jewelry-depth/spec.md)で16商品を追加し、Top10の全都道府県に5点以上掲載しています。旅先検索には会津若松の取扱店、ならまち、奈良市水門町、北九州市戸畑、糸島の案内を追加しました。一次情報と注文可否は[照合記録](research/top10-craft-jewelry-depth-2026-11-24.md)、画像は[着用イメージ](image-generation-styling-v37.json)と[単体イメージ](image-generation-solo-v37.json)を参照してください。

[仕様038](../specs/038-two-per-prefecture/spec.md)で掲載が1点だった26県に各1点を追加し、47都道府県で各2点以上、全135商品を公開しています。旅先検索では、桐生、小野、美浜町・三尾、松江、長船、北島、高知市、霧島市・隼人から新しい取扱先を探せます。購入条件と店舗案内は[一次情報の照合](research/two-per-prefecture-2026-11-24.md)、画像は[着用イメージ](image-generation-styling-v38.json)と[単体イメージ](image-generation-solo-v38.json)を参照してください。

[仕様039](../specs/039-three-per-prefecture/spec.md)で掲載が2点だった36県に各1点を追加し、47都道府県すべてで各3点以上、全国171商品に拡充しました。旅先検索では、青森市、南相馬・小高、宇都宮、長崎市、都城、屋久島、読谷などを選べます。商品ごとの公式通販と現地の取扱いは[一次情報](research/three-per-prefecture-2026-11-24.md)、画像は[着用](image-generation-styling-v39.json)と[単体](image-generation-solo-v39.json)を参照してください。

[仕様040](../specs/040-tokyo-craft-jewelry/spec.md)で東京を10点に拡充し、全国は176点。江戸川・松江の堀口切子は完全予約制です。選定した型・色や注文の条件は[一次資料](research/tokyo-craft-jewelry-2026-11-24.md)、追加画像は[着用](image-generation-styling-v40.json)と[単体](image-generation-solo-v40.json)を参照してください。

| 優先候補 | 進め方・依存条件 |
| --- | --- |
| 検索流入の準備 | 公開側のcanonical・hreflang・サイトマップを確認。Search Consoleの対象プロパティは確認時のGoogleアカウントで閲覧権限なし。Googleの登録状況と実績の確認には、権限のあるアカウントが必要。 [検証ガイド](verification-guide.md) |
| 動画から商品への案内 | TikTok公開14投稿から京都4・神奈川7商品へ案内。今後の公開投稿と商品IDを照合できた分を台帳へ追加。Instagramの個別投稿との対応と、プロフィール欄の掲載・実流入は確認待ち。 [仕様034](../specs/034-kyoto-video-jewelry/spec.md) |
| 購入時の情報差を減らす | 神奈川の動画掲載7商品を再照合済み。他の商品は同じ商品・色・金具・市場・販売単位で、販売元の情報と照合する。 [仕様028](../specs/028-purchase-routes/spec.md)・[仕様032](../specs/032-purchase-selections/spec.md) |
| 全国版の継続更新 | 47都道府県版は配信済み。商品の追加・差し替えを依頼された場合は、商品・選択名・販売単位・確認日を一次情報と照合し、該当仕様の検証と公開記録を更新する。直近は[040の検証](../specs/040-tokyo-craft-jewelry/validation.md)。 |
| 収益化の準備 | 商用ホストの適合、BECOS等の提携条件、実アカウントの承認、広告の同意管理や画像使用条件を確認。 [申請前の確認](pre-application-checklist.md) |
| 運用と端末の検証 | 現行版の実URLとエミュレーションは[041の検証](../specs/041-image-quality-corrections/validation.md)を参照。v0.24.1のWebKitエミュレーションとChromiumの結果は[035当時の記録](../specs/035-national-travel-discovery/validation.md)。実機iPhone／Safariにはアクセスできず未検証。SNSのアプリ内ブラウザーも未検証。 |

## 実装を再開するとき

- Nodeは `24.22.3` 以上、pnpmは `11.25.0` が現行の基準です。クリーンな作業用チェックアウトで `pnpm install --frozen-lockfile` を実行し、`pnpm dev` でプレビューします。本番相当の環境変数は[セットアップ](setup.md#本番同等のローカル検査)を参照します。
- 既存コード・商品・画像・出典を保ち、変更する正本と仕様を特定します。実物、価格、販売単位、在庫、許諾は裏付けのある範囲で扱い、公式写真や動画素材の利用条件を確認します。完了済みの画像移行023は再実行しません。 [AGENTS.md](../AGENTS.md)
- 文書の確認は `pnpm check:docs`、アプリ・データの変更は `pnpm verify` を使い、影響範囲に応じてSEO・日英・スマートフォンなどを追加検証します。
- 公開する変更は、[既存のActions](../.github/workflows/deploy.yml)の成功と実URLまで確認します。実施済みと未確認を記録し、関連する仕様・検証・引継ぎ資料を更新します。

## 新チャット貼付用のプロンプト

~~~text
SORA / Japanese Craft Jewelry のサイト構築を引き継いでください。日本全国の地域工芸アクセサリーを日本語・英語で紹介し、将来のアフィリエイト収益につなげるプロジェクトです。

GitHubの正本
https://github.com/rozawa619/japanese-craft-jewelry

サイト専用の引継ぎ書
https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/SITE_NEW_CHAT_HANDOFF.md

公開サイト
日本語 https://rozawa619.github.io/japanese-craft-jewelry/ja/
英語 https://rozawa619.github.io/japanese-craft-jewelry/en/

まず最新のmainを確認し、引継ぎ書、START_HERE.md、AGENTS.md、docs/handoff-status.json、docs/deployment-results.jsonを実際に読んでください。mainのHEAD、実公開アプリのバージョンとSHA、GitHub Actions、公開URLの状態を照合してください。引継ぎ時点はv0.31.0。Top10の各都道府県に産地関連商品が7点以上あり、全国47都道府県189点を紹介しています。直近は大阪・福岡・奈良・山梨・北海道・愛知の11点です。日英の旅先検索、都道府県ごとの絞り込み、商品詳細の購入条件・出典を確認してください。現行版の確認範囲は仕様044の検証記録にあります。実機iPhoneとSNS内ブラウザーは未検証です。以降の変更がある場合はGitHubの最新記録と公開URLを確認してください。

最初はコードと公開設定を変更せず、現在地、確認できたことと未確認事項、次の優先候補とおすすめの1件を報告してください。各候補に効果、変更対象、依存条件、検証方法を添えてください。次の作業はこちらで指定します。

既存の商品・画像・出典・購入リンクを保護し、未確認の商品情報を追加したり画像を再生成したりしないでください。アフィリエイト・広告の有効化、申請・契約・課金、ホストや公開範囲の変更は私が指示した場合に限ります。TikTok・Instagram・Google Flowの動画制作は別管理です。サイトを変更したら、GitHubの仕様・検証記録・引継ぎ資料も更新してください。
~~~

## 更新方法

変更後の版・配信・検証は [deployment-results.json](deployment-results.json)、再開時の状態と正本の所在は [handoff-status.json](handoff-status.json) に反映します。この文書はそれらへの入口として、公開版の概要とコピー用の引継ぎ文を更新します。
