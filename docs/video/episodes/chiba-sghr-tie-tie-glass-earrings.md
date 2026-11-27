# SORA 千葉編 第3話｜Sghr タイタイ ガラスのピアス

2026-11-27（JST）。九十九里のSghrによる、縦に細く伸びる透明なガラスのピアス。サイトの着用原本では、紺の襟付きシャツと横分けのボブに、画面右のピアスが一つ見える。指示文準備時点の添付動画あり。制作状況は `generated_unreviewed`。添付動画の確認結果は後述。

- 商品IDは `sghr-tie-tie-glass-earrings`。女性画像IDは `ai-sghr-tie-tie-glass-earrings-styling-v13`。原本は `public/images/sghr-tie-tie-glass-earrings-styling-v13.webp`（1536×1024）。
- 公開版 v0.30.0 の配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` と確認時のmain `bda904ba471295fa30024bbf832891af9d24bf00` で同一のWebP。Git blobは `6d0e99c685160e624c24b9d012bd5ea4afdb358c`。 [公開記録](../../deployment-results.json)
- 制作台帳・TikTok公開台帳・京都編候補表で商品ID・女性画像ID・画像パスを照合。既出の着用原本も目視で比較し、重複は見つからなかった。現行TikTokプロフィールの投稿一覧は未照合。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/sghr-tie-tie-glass-earrings/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/sghr-tie-tie-glass-earrings-styling-v13.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/bda904ba471295fa30024bbf832891af9d24bf00/public/images/sghr-tie-tie-glass-earrings-styling-v13.webp)

## 開始構図の事前確認

原本の中央576×1024（左端x=480）では、画面右のピアスが縦枠の外に出る。右に100px寄せた範囲（左端x=580）では、両目・口元と、金具からガラスの先端までが余白付きで収まる。生成時は少し引き、顔とピアスをひとまとまりで中央に収める。Flowの実際の開始プレビューは未確認。

## Flow指示文 v1

**Ingredients** にサイト原本1枚を指定。縦9:16、選べる場合は10秒。Flowの実際の開始プレビューで両目・口元・ピアス全体に余白が確認できた場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Kujukuri, Chiba.

From 0.0 seconds, start with a slightly wider head-and-shoulders portrait. Center her face and the visible earring together, leaving room above her hair and beside the earring at screen right. Keep both eyes, her whole mouth, and the entire earring from the stud to the lowest glass tip comfortably inside the frame throughout.

Preserve her exact adult face, side-parted dark bob and navy collared shirt. Keep the single visible earring at screen right in its original position and size: the silver-tone stud, fine connector, small clear bead and long, ribbed clear-glass drop. Soft, diffused window light and a small, warm smile flatter her natural expression. Preserve fine skin texture and keep the cheeks, mouth area and chin clear of visible moles and isolated dark spots.

She meets the viewer’s eyes, says one line softly in natural Japanese, then holds a slightly playful smile. Keep her head and shoulders steady, with the far ear covered by hair and her hands out of frame. Quiet room tone.

ねえ、このかたち、すき？

No additional dialogue, camera movement, mirroring, added jewelry, captions, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で、両目・口元と画面右のピアス全体が余白付きで収まるか確認。
- 発話中と後半に、ピアスが同じ位置に一つ見え、透明なリブ、細い輪郭、金具が原本と一致するか確認。頬・口元・あごのほくろや濃い点も確認。
- 発音・追加のセリフ・口の動きを確認し、検品と公開照合の状態を台帳に残す。

## 添付動画の確認（2026-11-27 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の各フレームで、両目、口元、画面右のピアスの金具からガラスの先端までが余白付きで収まる。
- 2秒・3.5秒・5秒・7秒・9.5秒の確認フレームでは、同じ側に縦に細く伸びる透明なピアスが一つ見える。後半の頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 全編と音声、Flowの実際のモード・モデル、SNS公開は未確認。
- TikTok用に0秒から約9.97秒まで計14点を確認。1.5〜5秒付近で口が動く。音声の文言、発音、追加発話と口の動きとの同期は未確認。紹介文は画面の耳元から書き出した。

## Instagramリール紹介文

2026-11-27（JST）作成。下書き。

```text
Meet me in Kujukuri, Chiba ✨
Light catches the fine ridges of a slender glass drop. Inspired by Sghr Sugahara’s Tie-tie earrings.

千葉・九十九里で待ち合わせ。
紺のシャツに、すっと伸びた透明なガラスが映える。
Sghr（スガハラ）のガラスピアス「タイタイ」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #千葉 #ガラスピアス #Chiba #JapaneseJewelry
```

## TikTok紹介文

2026-11-27（JST）下書き。TikTok投稿URLは未確認。

```text
耳元に、透明なガラスがきらり。🫧

千葉・九十九里で待ち合わせ。
紺のシャツに合わせたのは、縦にすっと伸びるガラスのピアス。

Sghr｜タイタイ ガラスのピアス
あなたなら、ネイビーと白、どっちの服に合わせる？

Meet me in Kujukuri, Chiba. A slender clear glass drop catches the light against a navy shirt, inspired by Sghr’s Tie-tie earrings.
Would you wear them with navy or white?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #九十九里 #ガラスアクセサリー #JapaneseJewelry
```
