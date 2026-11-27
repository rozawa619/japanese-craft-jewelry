# SORA｜旅先で待ち合わせ — 動画制作と投稿文の引継ぎ

最終更新 2026-11-27。このページは**動画制作と投稿文の引継ぎ入口**です。サイト制作そのものの引継ぎは [START_HERE](../../START_HERE.md) を参照。別チャット・別AIでも、最初にここを開いて制作ルールと現在位置を確認する。

## 新しいチャット・別のAIで再開する

**まず最新mainの[新チャット完全引継ぎ書](NEW_CHAT_HANDOFF.md)を読む。** [コピペ用の引継ぎ文](NEW_CHAT_HANDOFF.md#6-新しいチャットや別のaiに渡す引継ぎ文)は、新しいチャットや別のAIで共通して使う。

進行中の地域・回は[制作台帳](production-status.json)を参照する。過去の神奈川・京都の商品と画像は引き続き重複照合の対象。 [神奈川の制作記録](kanagawa-coverage-audit-2026-11-22.md) · [京都編の台帳](kyoto-series-plan.json) · [TikTok公開照合台帳](tiktok-publication-registry.json)

2026-11-22からの方針は、**サイト掲載の女性の元画像をそのまま表示する**。元画像の変更・新規生成・Canvaでの開始画像作りはユーザーが明示的に依頼した場合に限る。進行中の回は `production-status.json.currentEpisodeId` を参照する。TikTokの確認済み投稿は公開照合台帳を参照する。

## 制作を再開する手順

1. [完全引継ぎ書](NEW_CHAT_HANDOFF.md)と[最新SDD](spec.md)、[Flow共通テンプレート](flow-template.md)を読む。
2. [制作台帳](production-status.json)で `currentEpisodeId`、`nextAction`、対象回の `currentPromptVersion` を確認する。新作の前に[TikTok公開台帳](tiktok-publication-registry.json)と公開商品・女性画像を照合する。
3. 元画像で9:16相当の縦画角を確認する。両目・口元・装身具全体が余白付きで収まる候補を優先し、頬・口元・あごの濃い点も確認する。Flowの開始プレビューに収まればFrames、見切れや未確認の場合は同じ原本をIngredientsに使う。 [構図の確認手順](spec.md#冒頭の見切れを防ぐ手順)
4. 出力の0秒・0.5秒・1秒で見切れを確認し、顔がよく見える後半の肌も元画像と照合する。ほくろ・濃い点が見えるテイクは `revision_needed` と記録する。 [肌の基準](spec.md#動画の肌と表情)
5. 作業後に制作台帳と対象episodeを更新し、確認結果と次の作業を残す。

## TikTok公開実績と重複防止

- 公開アカウント：[TikTok @ayanosesora](https://www.tiktok.com/@ayanosesora)
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
- 新作の提案前に9:16の収まりを確認し、[冒頭の見切れを防ぐ手順](spec.md#冒頭の見切れを防ぐ手順)に沿ってモードを選んだか。生成後の0秒・0.5秒・1秒に両目・口元・装身具全体が収まるか
- 後半の顔も元画像と比較し、[ほくろ・濃い点の採用基準](spec.md#動画の肌と表情)を確認したか
- 腕/手首、アクセサリー数、サイト元画像との同一性を確認したか
- 画像・動画・実投稿の所在と検証状況を正確に区別したか
- 進捗 `nextAction` は次の人が即実行できる1ステップか

## 別チャットで使う短い開始文

> SORAの動画制作を引き継いでください。https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/NEW_CHAT_HANDOFF.md を開き、最新mainのSDD・Flowテンプレート・制作台帳を読んでください。提案前に原本の9:16の収まりを確認し、生成後は冒頭の見切れと後半のほくろ・濃い点を判定してください。

詳しい手順とコピペ用の全文は[新チャット完全引継ぎ書](NEW_CHAT_HANDOFF.md#6-新しいチャットや別のaiに渡す引継ぎ文)を参照する。
