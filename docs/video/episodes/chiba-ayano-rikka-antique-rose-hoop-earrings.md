# SORA 千葉編 第1話｜つまみかんざし彩野 rikka -六花-（アンティークローズ）

2026-11-27（JST）。松戸のつまみかんざし彩野が手がける、絹の花を付けたフープの耳飾り。サイト原本では、淡いベージュのブラウスと画面右のくすみローズの花が見える。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `chiba-ayano-rikka-antique-rose-hoop-earrings`。商品IDは `ayano-rikka-antique-rose-hoop-earrings`。
- 女性画像IDは `ai-styling-jp-ayano-rikka-antique-rose-hoop-earrings-v43`。元画像は `public/images/styling-jp-ayano-rikka-antique-rose-hoop-earrings-v43.webp`（1536×1024）。
- 公開版 v0.30.0 の[配信記録](../../deployment-results.json)で商品ページを確認。着用WebPは確認時のmain `6aaddf41108e8f4188ba6985c60578e8c9ecc95e` と配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` で一致。画像のGit blobは `a6425c3fabe35c63e3a16d7d2f149209cbe4c4da`。
- 商品ID・女性画像ID・画像パスを制作台帳、TikTok公開台帳、京都編の候補表と照合。差し替え前後の京都の原本を含む既出30画像を目視で比較し、重複は見つからなかった。@ayanosesora の最新投稿一覧との照合は未確認。
- 現行の東京編は公開10商品すべてに生成記録があるため、千葉編の第1話として選定した。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/ayano-rikka-antique-rose-hoop-earrings/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-ayano-rikka-antique-rose-hoop-earrings-v43.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/6aaddf41108e8f4188ba6985c60578e8c9ecc95e/public/images/styling-jp-ayano-rikka-antique-rose-hoop-earrings-v43.webp)

## 開始構図の事前確認

横長の原本で中央の576×1024（左端x=480）と顔側へ30px寄せた範囲（左端x=450）を目視した。両目・口元・画面右のフープの金具から花の先端まで、いずれも余白付きで収まる。元の斜め向きの角度と頭上の余白を保つ。頬・口元・あごに目立つほくろや単独の濃い点は見当たらない。

## Flow指示文 v1

**Ingredients** にサイト原本1枚を指定。縦9:16、10秒を選べる場合は10秒。実際の縦の開始プレビューに両目・口元・耳飾り全体が余白付きで収まる場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Matsudo, Chiba.

From 0.0 seconds, frame her from the top of her hair to her upper chest. Leave comfortable space above her head and around both eyes, her whole mouth and the complete earring at screen right, including the fastening, thin hoop and lowest petal. Hold the same framing and three-quarter angle, with her hair covering the other ear.

Preserve her exact adult face, softly waved dark hair and light beige linen-textured blouse. Keep the one visible earring in its original position and size, with its thin gold-tone hoop, dusty-rose folded petals and small gold-tone center. Use the source’s soft window light and keep natural skin texture. Her cheeks, mouth area and chin stay clear of visible moles and isolated dark spots.

She meets the viewer’s eyes, says the following single line softly in natural Japanese, then holds a small, warm smile. Her head stays steady and her hands stay out of frame. Quiet room tone.

ねえ、このおはな、にあうかな？

No additional dialogue, mirroring, extra jewelry, on-screen text, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で、両目・口元・画面右のフープ全体に余白があるか確認する。
- 発話中と後半に、フープと花の形、着用位置、見える数、頬・口元・あごのほくろや濃い点を原本と照合する。
- 一言の発音・追加発話・口の動きを確認する。動画の確認とTikTok公開照合の結果を台帳に記録する。

## 添付動画の確認（2026-11-27 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の各フレームで、両目、口元、画面右のフープと花全体が余白付きで収まる。
- 2秒・3.5秒・5秒・7秒・9.5秒の確認フレームでは、画面右に細いフープとくすみローズの花が一つ見える。後半の頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 全編と音声、Flowの実際のモード・モデル、SNS公開は未確認。
- TikTok用の照合では、0秒から約9.97秒まで計14点を目視し、1〜4秒付近で口が動くことを確認。音声トラックはあるが、セリフの文言・発音・追加発話・口の動きとの同期は未確認。紹介文は冒頭に映る耳元の花から始めた。


## Instagramリール紹介文

2026-11-27（JST）作成。下書き。

```text
Meet me in Matsudo, Chiba 🌸
A dusty-rose silk flower on a slender hoop. Inspired by Tsumami Kanzashi Ayano’s rikka earrings, made using Edo tsumami-zaiku fabric folding.

千葉・松戸で待ち合わせ。
淡いベージュのブラウスに、くすみローズの花がそっと映える。
つまみかんざし彩野が江戸つまみ細工で絹の花びらを仕立てた「rikka -六花-（アンティークローズ）」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #千葉 #つまみ細工 #Chiba #JapaneseJewelry
```

## TikTok紹介文

2026-11-27（JST）下書き。TikTok投稿URLは未確認。

```text
耳元に、小さな花をひとつ。🌸

千葉・松戸で待ち合わせ。
淡いベージュのブラウスに、くすみローズの耳飾り。
細いフープの下には、絹をつまんで形づくった花びら。

つまみかんざし彩野｜rikka -六花-（アンティークローズ）
あなたなら、白シャツと黒いワンピース、どっちに合わせる？

Meet me in Matsudo, Chiba. A dusty-rose silk flower on a delicate hoop, inspired by Tsumami Kanzashi Ayano’s rikka earrings.
Would you wear them with a white shirt or a black dress?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #松戸 #つまみ細工 #JapaneseJewelry
```
