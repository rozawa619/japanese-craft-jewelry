# SORA 東京編 第9話｜HARIO Lampwork Factory リトルティアーズ イヤリング

2026-11-26（JST）。元画像のボブと淡いブルーのブラウス、透明なしずくを使う。顔立ち・髪型・服を保ち、柔らかな光と小さな微笑みで可愛らしさを出す。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-hario-little-tears-clip-on-earrings`。商品IDは `hario-little-tears-clip-on-earrings`。
- 女性画像IDは `ai-hario-little-tears-clip-on-earrings-styling-v13`。元画像は `public/images/hario-little-tears-clip-on-earrings-styling-v13.webp`（1536×1024）。
- 公開商品ページの着用画像を確認。配信WebPは確認時のmain `c73ec4334998dc51a235ec24179a15cfdd8209b9` とバイト一致。Git blobは `4072b0014b54afcabae54b7226dd5c4cc1de2ecf`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、過去の制作記録で商品ID・女性画像ID・画像パスの重複なし。記録にある女性元画像も目視で照合した。
- 元画像では、淡いブルーのブラウスにボブを合わせ、画面右の耳に金色に見える留め具と細いチェーン、透明なしずくが三つあるイヤリングが一つ写る。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/hario-little-tears-clip-on-earrings/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/hario-little-tears-clip-on-earrings-styling-v13.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/c73ec4334998dc51a235ec24179a15cfdd8209b9/public/images/hario-little-tears-clip-on-earrings-styling-v13.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）では画面左の目が見切れる。左端x=410とx=425に移した縦枠でも、画面左の目元と画面右の留め具からしずくの先までに同時に余白を取りにくい。少し引いた肩から上の画角で、顔とイヤリングをひとまとまりに収める。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。Flowの実際の開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。Flowの実際の縦開始プレビューで、少し引いた画角に両目・口元・留め具から一番下のしずくまで余白付きで収まる場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

From 0.0 seconds, use a slightly wider head-and-shoulders portrait. Frame her face and the complete clip-on earring at screen right together, with clear space outside both eyes, her whole mouth and the earring from the clasp to the lowest glass drop. Hold the framing and the original head angle throughout. Her hair covers the far ear.

Preserve her exact face shape and features, dark brown bob and pale blue blouse. Keep one visible earring with the original gold-toned clasp, fine chains and three clear glass drops at their original lengths. Soft, even daylight brings out her gentle smile. Keep natural skin texture and her cheeks, mouth area and chin free of visible moles and isolated dark spots.

Her head and shoulders stay steady and her hands stay out of frame. She meets the viewer's eyes, speaks softly once and returns to a small smile. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、このしずく、みえる？

Avoid: head turns, mirrored framing, extra jewelry, camera moves, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元と、画面右のイヤリングの金具・チェーン・しずく全体が余白付きで収まるか確認する。
- 発話中と後半も、イヤリングの位置、チェーンの長さ、しずくの形・数を原本と見比べる。
- 後半の頬・口元まわり・あごも確認する。見切れ、ほくろや単独の濃い点、イヤリングの左右や個数の変化は `revision_needed`。発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の確認フレームで、両目・口元と画面右のイヤリングが、留め具から一番下のしずくまで余白付きで収まる。
- 2秒・3.5秒・5秒・7秒・9.5秒のサンプルでは、同じ側にイヤリングが一つ見える。後半に確認した頬・口元まわり・あごに、目立つほくろや単独の濃い点は見当たらなかった。
- 拡大した0秒・0.5秒・1秒・3.5秒・5秒・9.5秒のサンプルで、画面右のイヤリングに細いチェーンと透明なしずく三つを確認。髪型と淡いブルーのブラウスは元画像に対応し、顔の向きは原本より正面寄り。
- 音声の自動文字起こしでは、しずくが見えるかを尋ねる一言を検出。紹介文の冒頭はFlow指示文の表記を使用。全編の目視、細かな発音と口の動き、実際のFlowのモードとモデル、SNS公開は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo 💧
Tiny glass drops sway on fine chains. Inspired by HARIO Lampwork Factory’s Little Tears clip-on earrings.

東京で待ち合わせ。
淡いブルーのブラウスに、耳元で揺れるガラスのしずくを合わせて。
HARIO Lampwork Factoryのイヤリング「リトルティアーズ」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #ガラスイヤリング #Tokyo #JapaneseJewelry
```

## TikTok紹介文

2026-11-26（JST）作成。下書き。TikTok公開は未確認。

```text
ねえ、このしずく、見える？💧

東京で待ち合わせ。
淡いブルーのブラウスに、透明なガラスのしずく。
細いチェーンの先で、光を拾ってきらり。

HARIO Lampwork Factory｜リトルティアーズ イヤリング

あなたなら、どんな服に合わせたい？

Meet me in Tokyo. Tiny glass drops catch the light on the delicate chains of HARIO Lampwork Factory’s Little Tears clip-on earrings.

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #東京 #HARIOLampworkFactory #ガラスアクセサリー #JapaneseJewelry
```
