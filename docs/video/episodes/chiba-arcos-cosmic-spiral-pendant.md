# SORA 千葉編 第4話｜アルコス 宇宙神秘のスパイラル ガラスペンダント

2026-11-27（JST）。鴨川のガラス工房アルコスの作品。着用原本は、生成りのカーディガンと濃い色のトップスに、渦模様の青いガラスを合わせたイメージ。添付動画あり。制作状況は `generated_unreviewed`。

- 商品IDは `arcos-cosmic-spiral-pendant`。女性画像IDは `ai-arcos-cosmic-spiral-pendant-styling-v9`。元画像は `public/images/arcos-cosmic-spiral-pendant-styling-v9.webp`（1536×1024）。
- 公開版 v0.30.0 の配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` と確認時のmain `c21f32dad4a972acf0d5bfb8db53a24ba771a651` で同一WebP。Git blobは `e68881b1b9ac97027e48bc313ed15a7c98bfb4fc`。 [公開記録](../../deployment-results.json)
- 制作台帳・TikTok公開台帳・京都編の候補表で商品ID・女性画像ID・画像パスを照合し、既出の東京「葉の雫」と京都の桜ペンダントの原本も目視で比較した。重複は見つからなかった。現行TikTokプロフィールの投稿一覧は未照合。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/arcos-cosmic-spiral-pendant/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/arcos-cosmic-spiral-pendant-styling-v9.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/c21f32dad4a972acf0d5bfb8db53a24ba771a651/public/images/arcos-cosmic-spiral-pendant-styling-v9.webp)

## 開始構図の事前確認

中央の576×1024（左端x=480）では、画面右の顔の余白がなく、首紐の右側が途中で切れる。人物側に寄せた576×1024（左端x=724）では両目・口元と首紐の左右、青いトップ全体に横の余白が取れる。原本の頭頂付近はタイトなので、生成では0秒から頭上とトップの下に余白がある引いた構図を指定する。Flowの実際の縦開始プレビューは未確認。

## Flow指示文 v1

**Ingredients** に原本1枚を指定。縦9:16、選べる場合は10秒。Flowの縦開始プレビューで、頭上と両目・口元・首紐・トップ全体に余白が確認できた場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Kamogawa, Chiba.

From 0.0 seconds, use a slightly wider portrait with room above her hair and below the pendant. Frame her face and the pendant together. Keep both eyes, her whole mouth, both visible sides of the dark cord and the entire pendant, from its clear loop to its lowest edge, inside the frame with comfortable margins throughout.

Preserve her exact adult face, long dark hair, ivory cardigan and charcoal top. Keep one blue glass pendant in its original position and size. Preserve its rounded silhouette, deep-blue to aqua colors and the spiral inside. Soft, diffused daylight and a gentle, playful smile keep her expression natural. Preserve fine skin texture, with the cheeks, mouth area and chin clear of visible moles and isolated dark spots.

She meets the viewer’s eyes, softly says the line below in natural Japanese, then holds a small, warm smile. Her head and shoulders stay steady. Her hands stay outside the frame. Quiet room tone.

ほら、がらすのなかに、うずがあるよ。

No additional dialogue, camera movement, mirrored framing, added jewelry, captions, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で、頭上と両目・口元、首紐の見える左右、透明な金具から青いトップの下端までの余白を確認する。
- 発話中と後半も、トップが同じ位置に一つ見えること、渦・青の色・元の顔立ち・衣装、頬・口元・あごのほくろや濃い点の有無を原本と照合する。
- 発音・追加のセリフ・口の動きを確認し、検品結果と公開照合の状態を台帳に記録する。

## TikTok紹介文

2026-11-27（JST）下書き。TikTok投稿URLは未確認。

- 添付の文字起こしは「ほら、ガラスの中に、綺麗かな?」。指示文v1の冒頭「ほら、ガラスの中に」が一致したため、第4話として照合。紹介文では冒頭と商品情報を使った。
- 今回の添付は0秒・0.5秒・1秒の画角、後半の装身具と肌、実際の発音・追加発話・口の動きとの同期が未確認。

```text
ほら、ガラスの中に青い渦。🌀

千葉・鴨川で待ち合わせ。
深い青と淡い水色が重なる、丸いガラスのペンダント。

ガラス工房アルコス｜宇宙神秘のスパイラル
青の色合いと渦模様、どっちに先に目がいった？

Meet me in Kamogawa, Chiba. A spiral of deep blue and aqua inside a glass pendant, inspired by Atelier ARCOS’s Cosmic Spiral.
Did the color or the swirl catch your eye first?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #鴨川 #ガラスアクセサリー #JapaneseJewelry
```
