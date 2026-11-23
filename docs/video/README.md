# SORA｜旅先で待ち合わせ — 動画制作と投稿文の引継ぎ

最終更新 2026-11-22。このページは**動画制作と投稿文の引継ぎ入口**です。サイト制作そのものの引継ぎは [START_HERE](../../START_HERE.md) を参照。別チャット・別AIでも、最初にここを開いて制作ルールと現在位置を確認する。

## 新チャット移行（2026-11-22）

**まず [新チャット専用の完全引継ぎ書](NEW_CHAT_HANDOFF.md) を読む。** その中の「6. 新しいChatGPTチャットに貼る引継ぎ文」がコピペ用の正式な開始文。

京都編を開始。商品・画像の組み合わせと制作順は[京都7商品の台帳](kyoto-series-plan.json)を参照する。神奈川の[制作カバレッジ](kanagawa-coverage-audit-2026-11-22.md)と[TikTok公開照合台帳](tiktok-publication-registry.json)を確認し、**新作の前に商品IDと女性画像IDを照合**する。

2026-11-22からの方針は、**サイト掲載の女性の元画像をそのまま表示する**。元画像の変更・新規生成・Canvaでの開始画像作りはユーザーが明示的に依頼した場合に限る。進行中の回は `production-status.json.currentEpisodeId` を参照する。TikTokの確認済み投稿は公開照合台帳を参照する。

## 30秒で再開する

1. **[新チャット引継ぎ書](NEW_CHAT_HANDOFF.md) → [制作仕様](spec.md)**を読み、最新の固定ルールと次の地域を確認する。
2. **新作選定前**に [TikTok公開・重複防止台帳](tiktok-publication-registry.json) と [京都7商品候補](kyoto-series-plan.json) を読む。次に [制作状況（機械可読）](production-status.json)の `currentEpisodeId`、`nextAction` と各話 `status` を読み、商品IDと女性画像の両方で照合する。
3. [調査メモ（Google公式）](research/flow-veo-prompting-2026-11-21.md)の **開始画像と短い動作の原則** を確認。**進行中のエピソードは `production-status.json.currentEpisodeId` から必ず取得する**。固定の古いエピソードURLを最新と決めつけない。
4. **公開・重複防止台帳で未使用と確認できたときだけ、次話はサイト掲載の着用女性画像の原本を提示する。** 加工・Canvaでの開始画像作成はユーザーから明示依頼があった場合だけ。[共通テンプレート](flow-template.md)でFlow指示文が必要な場合も元画像を基本とする。新規画像を勝手に生成しない。
5. 作業後に **同じターン内で** `production-status.json` と対象episodeを更新。実施したこと・未実施・証拠URL・次アクションを残す。動画ファイル自体がチャット内にしかない場合は別チャットで参照できると偽らず、その旨を記録する。

## TikTok公開実績と重複防止

- 公開アカウント：[TikTok @soracraftdiary](https://www.tiktok.com/@soracraftdiary)
- 公開プロフィールの動画10本と7商品の照合結果、神奈川8商品の重複回避リスト、丸山の同一女性画像グループを記録。 [TikTok投稿照合台帳](tiktok-publication-registry.json)
- 2026-11-22の確認は公開欄のキャプションとサムネイルが対象。公開動画の全編・音声や、確認できた一覧にない投稿は未確認。
- 新作を選ぶ前に、サイトの `catalog.json` / `editorial-images.json` と照合。動画が生成済み/過去に登場した可能性がある商品、同じ女性原本画像の流用は、ユーザー明示指定なしに再提案しない。
- 実投稿URLが得られたら、**TikTok上の投稿→サイトの商品ID→女性画像ID**を一致させて照合台帳とepisodeを更新する。
- 台帳の `knownPostLinks` にある確認済みの投稿は、サイトを次に公開するとき `/sora/#video-jewelry` に反映されます。日英と媒体別のプロフィール向けURLは[サイト仕様033](../../specs/033-sora-video-jewelry/spec.md)にあります。

## Instagramリールの紹介文

対象の動画とepisodeを確認し、[Instagramリール紹介文テンプレート](instagram-caption-template.md)で日英のキャプションを作ります。「インスタ用の紹介文」に動画が添付されている場合は、その動画に対応するepisodeを使います。

コピペ用の本文はepisodeの `Instagramリール紹介文` に保存し、台帳の `instagramCaption` で下書きとInstagramの公開URLを管理します。

## 判断の優先順位

1. 現在のユーザーの明示的な変更依頼
2. 商品の公開状態・商品ID・画像の最新事実: [catalog](../../src/data/catalog.json)、[editorial-images](../../src/data/editorial-images.json)、[神奈川ページ](../../src/content/places/ja/kanagawa.md)
3. 動画の固定ルール: [spec.md](spec.md)
4. 話ごとの固定文面・進捗: [episodes/](episodes/) と [production-status.json](production-status.json)
5. 過去のチャットや推測。矛盾時は上位を優先し、変更理由を更新履歴へ記録

公開商品・画像参照が変更/退役したら、古い画像でそのまま続行せず現行サイトと再照合する。変更が必要なら理由を記録する。

## 使用する状態

- `idea`: 候補のみ
- `prompt_ready`: 開始画像とプロンプトの準備まで
- `generated_unreviewed`: 動画は生成されたとの報告があるが、完成チェック未確認
- `revision_needed`: 修正が必要と確認済み
- `approved`: 動画を確認して採用
- `published` はTikTokの公開投稿URLとエピソードの対応を確認した状態。動画全編の品質とInstagramの公開は別途記録する。
- `unknown`: 以前の会話に言及はあるが成果物・公開を検証できない

**投稿文を作っただけで `approved` / `published` にしない。** 外部リンクや成果物がないときは `unknown` のまま。1本10秒のFlowクリップと、複数クリップをまとめた60秒作品を別成果物として管理する。

## 更新時チェック

- 公開中の **商品ID** と **女性画像のパス** は現行のサイト台帳から確認したか
- 最新のepisode内の指示文を参照したか（古いv1/v2を使わない）。変更があれば差分と理由を書いたか
- 日本語の発話は短い1行か。生成プロンプトに不要な英訳やローマ字解説を重複させていないか
- 画面上の文字・日英字幕・BGMはFlowに指示していないか（後編集）
- 開始画像の9:16適合、腕/手首、アクセサリー数、静止画の元画像との同一性を確認したか
- 画像・動画・実投稿の所在と検証状況を正確に区別したか
- 進捗 `nextAction` は次の人が即実行できる1ステップか

## 別チャットで使う短い開始文

> SORAの動画制作の新チャットへの引継ぎです。GitHubの `rozawa619/japanese-craft-jewelry/docs/video/NEW_CHAT_HANDOFF.md` を最初に読み、そこに記載のSDD・制作台帳・TikTok重複台帳・京都候補の最新を確認してください。サイト掲載の元女性画像だけを使用し、商品IDと女性画像IDの重複を調べてください。制作後はepisodeと台帳を更新し、未確認のSNS公開を捏造しないでください。

これをChatGPTプロジェクトの指示にも置くと、新チャットでGitHubの確認を促しやすい。**GitHubの資料を読めないチャットに自動同期される仕組みではない**ので、アクセスできない場合はそれを正直に伝える。新しい動画生成の完了・Flow実行・投稿を、文章作成だけで実施済みにしない。
