# SORA｜旅先で待ち合わせ — TikTok / Google Flow 引継ぎの入口

最終整理: 2026-11-21。これは **動画制作専用の引継ぎ正本**。サイト制作そのものの引継ぎは [START_HERE](../../START_HERE.md) を参照。別チャット・別AIでも、最初にここを開いて制作ルールと現在位置を確認する。

## 30秒で再開する

1. [制作仕様](spec.md)を読み、固定ルールを守る。
2. [制作状況（機械可読）](production-status.json)の `currentEpisodeId`、`nextAction` と各話 `status` を読む。
3. 進行中の[ブレスレット編](episodes/kanagawa-dahliacyan-rhodochrosite-bracelet.md)の**確定したGoogle Flow指示文**を読む。新しい雰囲気のプロンプトに勝手に書き換えない。
4. 次話を作るときだけ[共通テンプレート](flow-template.md)を複製し、現行サイトの **公開商品ID / 人物画像 / 地域** と対応させる。
5. 作業後に **同じターン内で** `production-status.json` と対象episodeを更新。実施したこと・未実施・証拠URL・次アクションを残す。動画ファイル自体がチャット内にしかない場合は別チャットで参照できると偽らず、その旨を記録する。

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
- `published`: 投稿URLまで確認
- `unknown`: 以前の会話に言及はあるが成果物・公開を検証できない

**投稿文を作っただけで `approved` / `published` にしない。** 外部リンクや成果物がないときは `unknown` のまま。1本10秒のFlowクリップと、複数クリップをまとめた60秒作品を別成果物として管理する。

## 更新時チェック

- 公開中の **商品ID** と **女性画像のパス** は現行のサイト台帳から確認したか
- 前回作った指示文を再利用したか。変更があれば差分と理由を書いたか
- 動画に出す日本語は音声用にひらがな主体・読みを添えたか
- 画面上の文字・日英字幕・BGMはFlowに指示していないか（後編集）
- 画像・動画・実投稿の所在と検証状況を正確に区別したか
- 進捗 `nextAction` は次の人が即実行できる1ステップか

## 別チャットで使う短い開始文

> SORAのTikTok動画制作の続きです。GitHubの `rozawa619/japanese-craft-jewelry/docs/video/README.md`、`spec.md`、`production-status.json`、進行中のepisodeを最初に読み、固定ルールを守って続きから進めてください。作業したら台帳も更新してください。すでに決まったことを聞き直さないでください。

これをChatGPTプロジェクトの指示にも置くと、新チャットでGitHubの確認を促しやすい。**GitHubの資料を読めないチャットに自動同期される仕組みではない**ので、アクセスできない場合はそれを正直に伝える。新しい動画生成の完了・Flow実行・投稿を、文章作成だけで実施済みにしない。
