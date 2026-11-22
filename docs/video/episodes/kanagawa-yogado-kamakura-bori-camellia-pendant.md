# 神奈川・鎌倉 陽雅堂 鎌倉彫 椿ペンダント

- 選定日: 2026-11-22
- 状態は **TikTok公開確認済み**。添付の10秒動画は抜粋フレームを確認済み。
- 想定順序: 現在進行中の「陽雅堂 もみじブローチ」編の**次**
- シリーズ: 当面は神奈川県内を優先（箱根に限定しない。全国展開は後日ユーザーの指示で再開）。
- 商品ID: `yogado-kamakura-bori-camellia-pendant`
- 状態（サイト）: `published`（2026-11-22 GitHubの`src/data/catalog.json`と商品日語本文を確認）
- 商品名: 「陽雅堂 鎌倉彫ペンダント 椿」
- 商品ページ: https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/yogado-kamakura-bori-camellia-pendant/
- サイト人物画像（正本）: `public/images/styling-jp-yogado-kamakura-bori-camellia-pendant-v26.webp`（768×512）
- 元画像: https://github.com/rozawa619/japanese-craft-jewelry/blob/main/public/images/styling-jp-yogado-kamakura-bori-camellia-pendant-v26.webp
- 画像をGitHubコネクタで開いて目視確認: サイト設定上の成人女性、前髪・長めのウェーブの暗い髪、**セージグリーンのトップス**、胸元の**赤茶色の椿形木彫りペンダント1点**。女性は少し下を見て微笑んでいる。前回のもみじブローチ（紺ジャケット、後ろで髪を束ねた女性）とは別の掲載画像。
- 選定理由: 現在のもみじブローチから「アクセサリー種類（ペンダント）」「女性画像・衣装」が変わり、10秒の一人称デートとして胸元の装身具が見せやすい。前に扱った椿ブローチと同じ椿モチーフのため、動画内容はペンダントの着け方・胸元の見せ方を変えて差別化する。
- 大事な制約: **サイトに載っているこの女性の顔を参照して開始画像を作る。** 別人化、服の勝手な色変更、大幅な顔のシャープ化や服飾の改変をしない（指示された場合は変更点だけ調整）。
- 動画向け開始画像: **Canvaで編集可能な縦9:16の切り出しレイアウト作成済み**。デザインID `DAHbnzBQEow`。元サイト画像 `768×512` を画角 `720×1280` に `object-fit: cover` 相当で配置し、画素そのものをAI再生成していない。Canva画像要素 `MAHbn0xohhM` が元ファイルと同じ768×512であることを確認。女性の顔とペンダントは元画像そのまま。CanvaからのPNG書き出しはまだ未確認。
- Canva編集URL: https://www.canva.com/d/X4ipupo40I8fKqB
- 動画の予定: 落ち着いた鎌倉デートの恋人視点。元画像は無地の淡い背景なので無理に街並みを生成し直さず、**同一人物と商品を最優先**。視線をペンダントからカメラへ上げて微笑むだけ。**ペンダントを手で触らない**（形崩れ・複製防止）。日本語のセリフは `ねえ、みて。このつばき、にあうかな？` に確定。
- 動画の全編と音声の検品、Instagramの公開URLは未確認です。

## 次々回以降の神奈川候補

- 選定時は `hamamatsuya-pendant` を鎌倉の後に箱根へ移る候補として比較。その後、同商品の公開を[制作台帳](../production-status.json)に記録。

## Google Flow指示文 v1（2026-11-22）

```text
Image-to-video from the uploaded starting frame. Vertical 9:16, 10 seconds if available.

One continuous photorealistic Japanese boyfriend-POV date moment in Kamakura.
Preserve exactly the same woman's face, long dark wavy hair, sage-green top, thin necklace, and ONE carved red-brown camellia pendant from the starting frame. Keep the original soft background. Do not replace the woman or the pendant.

0–2 seconds: She looks softly down at the pendant and smiles.
2–7 seconds: She gently raises her gaze to the viewer and speaks in natural, friendly native Japanese. Her hands stay out of frame and the pendant remains still.
7–10 seconds: She holds eye contact, gives a slightly warmer smile, and a tiny natural head tilt.

The woman says in Japanese:
ねえ、みて。このつばき、にあうかな？

Camera: steady, natural boyfriend-eye-level POV; small facial movements only.
Audio: natural conversational Japanese voice and subtle ambience. No background music.
Avoid: face changes, duplicate pendants, additional jewelry, distorted necklace, hands touching the pendant, extra people, subtitles, text, logos, sudden zoom, scene cuts.
```

**人間向けセリフ**：『ねえ、見て。この椿、似合うかな？』

## 制作メモ

- 2026-11-22: GitHub登録済みサイト画像を出発点に、画像生成で縦型の新規シーンを1枚試したが、顔・衣装・ペンダントの形に変化が出たため**不採用**。その案をFlow開始画像として使用しない。
- 2026-11-22: 実物のサイトAI画像を**再生成せずクロップする**Canvaデザインに切替。元画像と商品意匠の再現性を優先。720×1280/1ページ、Canvaでメディア画像配置の記録を確認。
- 開始画像の準備時点で、CanvaのPNG書き出しとFlowへの投入は未確認でした。

## ユーザーの最新指示（2026-11-22）

> 今後はいちいち作らなくて良いよ。単純にサイトで使ってる女性の画像出して

- **この回を含め、今後は元のサイト女性画像を加工せずそのまま提示。** 商品ページと元画像URLを案内するだけでよい。
- Canvaの縦型フレームは過去に作成したが今後の必須ステップではない。**新しい開始画像を新規生成・編集しない。**
- Google Flowへ画像を投入する場合はサイトに掲載している元ファイル `public/images/styling-jp-yogado-kamakura-bori-camellia-pendant-v26.webp` を直接使用。

## 2026-11-22: 動画確認とTikTok紹介文

- ユーザーが10秒・512×910の動画 `711086200_1795341906208502.mp4` をチャットにアップロード。
- 1秒・4秒・8秒のフレームを確認：セージグリーンの服、胸元の赤茶色の椿ペンダント、目線を下から正面へ上げて微笑む女性。サンプルフレームではペンダント1点。音声の日本語・全フレームの装飾の一致は未確認。
- 添付を確認した時点では `generated_unreviewed`。その後の公開確認は下記に記録。
- 完成動画のGitHub等の永続保存先：未登録。別チャットでファイルが閲覧できると断言しない。

### TikTokキャプション案（投稿前・確定版ではない）

```text
「ねえ、この椿、似合うかな？🌺」

今日は神奈川・鎌倉で待ち合わせ💕

彼女の胸元に咲く、小さな椿の花。

実はこれ、伝統工芸「鎌倉彫」のペンダントなんです✨

木彫りと漆が生み出す、優しく上品な美しさ。

こんな彼女と鎌倉を歩いてみたい？💗

🌺 陽雅堂｜鎌倉彫ペンダント 椿

🇯🇵 Discover Japanese traditional crafts through a romantic POV date.

※映像はAI生成によるイメージです。

#SORA旅先で待ち合わせ #鎌倉 #鎌倉彫 #伝統工芸 #和アクセサリー #AIデート #JapaneseCrafts
```

タイトル案：`鎌倉で待ち合わせ。胸元に咲く椿🌺`

## TikTok公開確認

2026-11-22に公開プロフィールを確認しました。公開投稿の説明文と、セージ色の服・長い髪・椿のペンダントが映るサムネイルを、既存の動画記録と照合しました。

動画の全編と音声は未確認です。 [TikTok投稿](https://www.tiktok.com/@soracraftdiary/video/7710935851307420949)

## Instagramリール紹介文

2026-11-22作成。下書き。

```text
Meet me in Kamakura 🌺
A red camellia pendant inspired by Yogado’s Kamakura-bori woodcarving, paired with a soft sage-green knit.

神奈川・鎌倉で待ち合わせ。
セージグリーンのニットの胸元に、赤い椿がひとつ。
陽雅堂の「鎌倉彫ペンダント 椿」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #鎌倉 #鎌倉彫 #Kamakura #JapaneseCrafts
```
