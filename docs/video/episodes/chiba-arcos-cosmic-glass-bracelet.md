# SORA 千葉編 第6話｜アルコス 宇宙のキラキラ ガラスブレスレット

2026-11-28（JST）。鴨川のガラス工房アルコスのブレスレット。着用原本では、水色のブラウスを着た女性が片腕をテーブルに置き、青から水色に変わる楕円のガラスを細い濃色の紐で着けている。添付動画の冒頭は顔・ブレスレット・指先が収まり、制作状況は `generated_unreviewed`。

- 商品IDは `arcos-cosmic-glass-bracelet`。女性画像IDは `ai-arcos-cosmic-glass-bracelet-styling-v9`。元画像は `public/images/arcos-cosmic-glass-bracelet-styling-v9.webp`（1536×1024）。
- 確認時のmain `25049456ea2c8fa2278dfbd6d91bd4c1ee905932` と配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` で同一のWebP。Git blobは `046e9c49e2403cd350c8e5b92bf8410d845a0b2b`。 [公開記録](../../deployment-results.json)
- 商品ID・女性画像ID・画像パスを制作台帳・TikTok公開台帳・京都編候補表と照合。千葉「宇宙神秘のスパイラル」、京都「青い組紐」、東京「リトルティアーズ」の着用原本と比較し、重複は見つからなかった。現行TikTokプロフィールの投稿一覧は未照合。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/arcos-cosmic-glass-bracelet/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/arcos-cosmic-glass-bracelet-styling-v9.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/25049456ea2c8fa2278dfbd6d91bd4c1ee905932/public/images/arcos-cosmic-glass-bracelet-styling-v9.webp)

## 開始構図の事前確認

原本の中央576×1024（左端x=480）は画面右の顔と画面左の指先を切る。顔側に寄せた範囲（左端x=620）では両目・口元・ブレスレット全体が入るが、手の指先は枠外。頭頂と指先の下にも余白が必要なため、0秒から髪の上とテーブルに余白を取り、顔・着用側の手首と指先をひとまとまりに入れる。Flowの実際の縦開始プレビューは未確認。

## Flow指示文 v1

**Ingredients** にサイト原本1枚を指定。縦9:16、選べる場合は10秒。 [Flow共通テンプレート](../flow-template.md)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, seated eye-level boyfriend-POV shot across a table during a quiet date in Kamogawa, Chiba.

From 0.0 seconds, start with a pulled-back portrait from above her hair to the tabletop below her fingertips. Center her face and bracelet-wearing hand together within the middle 80 percent of the frame width. Keep both eyes, her whole mouth, the complete bracelet and the wearing hand through its fingertips visible. Leave clear space to the right of her face, to the left of her fingertips and below her hand throughout.

Preserve her exact adult face, dark bob with bangs and pale blue blouse. Keep the bracelet-wearing forearm relaxed on the table, naturally connected from the elbow at screen right to the hand at screen left. Keep the same hand pose and wrist orientation. One bracelet stays on that wrist at its original scale, with its thin dark cord, oval blue-to-aqua glass and tiny bright flecks. The other hand stays out of frame.

Use soft, even window light and a warm, subtly playful smile. Preserve fine natural skin texture. Keep her cheeks, the skin around her mouth and her chin clear of visible moles and isolated dark spots. She meets the viewer’s gaze while her head and bracelet-wearing hand stay steady.

She says this exact line softly once in natural Japanese, then rests into a closed-mouth smile. Quiet room tone.

これ、ちいさなうちゅうみたいでしょ？

No extra dialogue, hand gestures, added jewelry, camera movement, mirrored framing, captions, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で、両目・口元・ブレスレット全体・着用側の指先と、その外側の余白を確認する。
- 発話中と後半も、片腕のつながり、テーブル上の手首と指先、楕円の青いガラスと紐、同じ手首に1本という条件、頬・口元・あごのほくろや濃い点の有無を原本と照合する。
- 発音・追加のセリフ・口の動きを確認し、検品と公開照合の結果を制作台帳に記録する。

## 添付動画の画角確認

2026-11-28（JST）。10秒の動画（512×910、30fps）をサイトの着用原本 `arcos-cosmic-glass-bracelet-styling-v9.webp` と照合した。前髪のあるボブ、水色のブラウス、テーブルに置いた手に見える楕円の青いガラスと濃色の紐が一致する。

- 0・0.5・1秒で、両目・口元・ブレスレットと着用側の指先が画面内に収まる。髪の上と手の下に背景・テーブルの余白があり、指先の左側の余白は小さめながら確保されている。
- 2・3.5・5・7・9.5秒でも、同じ手首にブレスレットが一つ見え、青から水色のガラスと紐が判別できる。確認した範囲の頬・口周り・あごに目立つほくろや濃い点は見当たらなかった。
- 通し再生、発話・発音・追加の台詞・リップシンク、実際のFlow設定と投稿照合は未確認。

## Instagramリール紹介文

2026-11-28（JST）。投稿用下書き。

```text
Meet me in Kamogawa, Chiba ✨
See the little oval on my wrist? Deep blue fades into aqua inside the glass.
Inspired by Atelier ARCOS’s Cosmic Sparkle glass bracelet.

千葉・鴨川で待ち合わせ。
ねえ、手元を見て。深い青と水色が溶け合う、ひと粒のガラス。
ガラス工房アルコスのブレスレット「宇宙のキラキラ」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #千葉 #ガラスブレスレット #Chiba #JapaneseJewelry
```

## TikTok紹介文

2026-11-28（JST）下書き。テーブル越しに見える手元とガラスの色をもとに作成。投稿URLは未照合。

```text
手首に、小さな宇宙。見える？ 💫

千葉・鴨川で待ち合わせ。
テーブル越しに、深い青と水色が重なるガラスがきらり。

ガラス工房アルコス｜宇宙のキラキラ ガラスブレスレット
この青を見て思い浮かぶのは、星空？ それとも海？

Meet me in Kamogawa, Chiba. Across the table, a glass bracelet catches the light in shades of deep blue and aqua, inspired by Atelier ARCOS’s Cosmic Sparkle.
Does this blue remind you of the night sky or the sea?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #鴨川 #ガラスブレスレット #JapaneseJewelry
```
