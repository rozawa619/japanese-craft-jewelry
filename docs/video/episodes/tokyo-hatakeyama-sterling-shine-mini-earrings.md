# SORA 東京編 第8話｜畠山七宝製作所 東京七宝 スターリングシャイン・ミニ ピアス

2026-11-26（JST）。窓辺の柔らかな光と、七宝の色とコットンパールが見える元画像を選定。元の顔立ち・髪型・服を保ち、目線と微笑みで上品な可愛らしさを出す。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-hatakeyama-sterling-shine-mini-earrings`。商品IDは `hatakeyama-sterling-shine-mini-earrings`。
- 女性画像IDは `ai-styling-jp-hatakeyama-sterling-shine-mini-earrings-v40`。元画像は `public/images/styling-jp-hatakeyama-sterling-shine-mini-earrings-v40.webp`（1536×1024）。
- 公開商品ページの着用画像を確認。配信WebPは確認時のmain `fb5dc7425879ddf5a72d2f1504e7deadae3ca5fc` とバイト一致。Git blobは `113ae8f54213abb5ca2b5a5a6632fcb2cdf32cae`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、過去の制作記録で商品ID・女性画像ID・画像パスの重複なし。記録にある女性元画像も目視で照合した。
- 原本では窓辺で髪をまとめ、生成りのブラウスを着用。画面右の耳にピンクと淡い緑の七宝、下に白い丸い飾りを合わせたピアスが一つ見える。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/hatakeyama-sterling-shine-mini-earrings/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-hatakeyama-sterling-shine-mini-earrings-v40.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/fb5dc7425879ddf5a72d2f1504e7deadae3ca5fc/public/images/styling-jp-hatakeyama-sterling-shine-mini-earrings-v40.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）では画面左の目が見切れ、口元も左端に寄る。左端x=350の縦枠では両目・口元と、七宝からパールの下までが余白付きで収まる。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。実際のFlow開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。実際の縦の開始プレビューで枠を原本の左側へ寄せ、両目・口元・ピアス全体が余白付きで収まれば **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date by a window in Tokyo.

At 0.0 seconds, both eyes, her whole mouth and the complete earring at screen right are in frame with clear margins. Show the full pastel pink and pale green enamel shapes and the small white pearl drop underneath. Keep her original three-quarter head angle and one earring visible on the same ear, with the far ear covered by hair.

Preserve her exact facial features, dark updo, ivory blouse and the earring's original shape, scale and colors. Soft window light makes her original smile feel warm and natural. Preserve skin texture and keep the cheeks, mouth area and chin free of visible moles and isolated dark spots.

Her head and shoulders stay still and her hands stay out of frame. Her eyes gently meet the viewer's gaze. She speaks once and settles into a small smile. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、このいろ、すき？

Avoid: head turns, mirrored framing, extra jewelry, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元と画面右の七宝からパールの下までが余白付きで収まるか確認する。
- 発話中と後半も頭の角度、ピアスの色・形・位置と画面右に一つの状態を原本と照合する。
- 後半も頬・口元まわり・あごを確認。見切れ、ほくろや単独の濃い点、ピアスの配置や個数の変化は `revision_needed`。発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。0秒で画面左側の目と口元の左側が見切れ、0.5秒でも左側の目が一部見切れる。1秒では両目と口元が見え、左側の目は画面左端に近い。画面右のピアスは七宝からコットンパールまで収まっている。
- 2秒のサンプルでは、顔が正面を向いたときに画面左にもピアスが見える。3.5秒・5秒・7秒・9.5秒に確認した頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 冒頭の顔の見切れと見えるピアスの数の変化により制作状態は `revision_needed`。全編・音声・実際のFlowのモードとモデル・SNS公開は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo 🌷
A little cotton pearl sways beneath pastel pink and green enamel. Inspired by Hatakeyama Shippo’s Sterling Shine Mini earrings.

東京で待ち合わせ。
淡いピンクと緑の七宝の下で、コットンパールが小さく揺れる。
畠山七宝製作所の東京七宝ピアス「スターリングシャイン・ミニ」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #東京七宝 #Tokyo #JapaneseJewelry
```
