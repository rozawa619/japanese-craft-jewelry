# SORA 東京編 第4話｜廣瀬刺繍店 江戸刺繍の小花ピアス ピンク

2026-11-25（JST）。元画像の明るい笑顔が、小さなピンクの花によく合うこの商品を選定。顔立ち・髪・服を原本どおりに保ち、目線と柔らかな光で表情の魅力を出す。指示文準備時点の制作状態は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-hirose-edo-embroidery-pink-flower-studs`。商品IDは `hirose-edo-embroidery-pink-flower-studs`。
- 女性画像IDは `ai-styling-jp-hirose-edo-embroidery-pink-flower-studs-v40`。元画像は `public/images/styling-jp-hirose-edo-embroidery-pink-flower-studs-v40.webp`（1536×1024）。
- 公開商品ページで女性画像の表示を確認。配信WebPは確認時のmain `8089a3f4a0b6a19ce46c206b4c8733fea4735c8c` の原本とバイト一致。Git blobは `26dc7a99fddf4b664cfc695c2cbe9e77db285799`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補と既存の制作記録に、商品ID・女性画像ID・画像パスの重複は見当たらなかった。既出の女性元画像も目視で照合した。
- 元画像では、肩にかかる黒髪と生成りの襟付きブラウスを合わせ、画面右の耳に淡いピンクの小花ピアスが一つ見える。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/hirose-edo-embroidery-pink-flower-studs/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-hirose-edo-embroidery-pink-flower-studs-v40.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/8089a3f4a0b6a19ce46c206b4c8733fea4735c8c/public/images/styling-jp-hirose-edo-embroidery-pink-flower-studs-v40.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）で両目・口元・画面右の小花全体が余白付きで収まる。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。第3話では顔が回って両耳のピアスが見えたため、今回は元画像の斜め向きで頭を固定し、奥側の耳は髪で隠れた状態を保つ。Flowの実際の開始プレビューは未確認。 [第3話の検品記録](tokyo-nakajima-tsuyayaka-red-urushi-ladybug-studs.md)

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。実際の縦の開始プレビューで両目・口元・小花全体が余白付きで収まる場合は **Frames** を選び、最初の行の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

From 0.0 seconds, show both eyes, her entire mouth and the full pale pink flower stud at screen right, with clear margins. Keep the original head angle and head-and-shoulders framing throughout. The single visible stud stays at screen right and her hair covers the far ear.

Preserve her exact facial features and face shape, shoulder-length dark hair, ivory collared blouse and the stud's shape, size and color. Soft, even daylight and gentle catchlights bring out her bright, natural smile. Keep realistic skin texture and skin around her cheeks, mouth and chin free of visible moles and isolated dark spots.

Her head and shoulders stay still and her hands stay out of frame. She gently meets the viewer's eyes, speaks once and returns to her warm smile. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、このおはな、にあうかな？

Avoid: head turns, mirrored framing, extra jewelry, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元・画面右の小花ピアス全体が余白付きで収まっているか確認する。
- 発話中と終盤でも元画像の顔立ち・服・ピアスの向きと位置を照合。奥側の耳が髪で隠れ、小花は一つだけ見える。
- 後半の頬・口元まわり・あごを元画像と見比べる。見切れ、ほくろや単独の濃い点、ピアスの出現位置や数の変化があれば `revision_needed`。日本語の発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。冒頭の0秒・0.5秒・1秒では、両目、口元、画面右の小花ピアス全体が余白付きで収まっている。
- 2秒・3.5秒・5秒・7秒・9.5秒の確認フレームでは、奥側の耳が髪で隠れ、画面右に小花が一つ見える。顔がよく見える後半のサンプルでも、頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 全編と音声、実際のFlowのモード・モデル、SNSでの公開状況は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo 🌸
A tiny pink flower beside her smile. Inspired by Hirose’s silk flower studs, made with Edo embroidery.

東京で待ち合わせ。
笑顔のそばに、淡いピンクの小花がひとつ。
二色の絹糸で花びらを刺した、廣瀬刺繍店の「江戸刺繍の小花ピアス」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #江戸刺繍 #Tokyo #JapaneseJewelry
```
