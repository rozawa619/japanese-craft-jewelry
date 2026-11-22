# SORA 京都編 第1話 Morphosphere tint 群青パンジーピアス

2026-11-22に京都編を開始。添付された初回動画の確認後、状態を `revision_needed` に更新しました。再生成用の指示文v2を下記に記録します。

- エピソードIDは `kyoto-morphosphere-ultramarine-pansy-pierced-earrings`。
- 商品IDは `morphosphere-ultramarine-pansy-pierced-earrings`。染めた刺繍レースで表現した群青のパンジーが、細いチェーンから下がるピアスです。 [サイトの商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/morphosphere-ultramarine-pansy-pierced-earrings/)
- 女性の開始画像はサイト掲載のWebP原本 `public/images/morphosphere-blue-pansy-styling-v9.webp`（1536×1024、横3:2）。画像IDは `ai-morphosphere-blue-pansy-styling-v9`。 [画像原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/morphosphere-blue-pansy-styling-v9.webp)
- 最新main（`614fe4c55827bbad9c3bd61ad787144e7e209c26`）の商品と画像を公開版のデータと照合。制作・公開台帳で商品IDと女性画像ID・パスの重複がないことを確認しました。
- 白いブラウスとまとめ髪を保ち、画面右側の顔と花全体が縦の構図に収まるようにします。青い花びら、黄色の中心と細いチェーンが、元画像と同じ耳に見える構図です。

## 添付動画の確認

- 10秒、縦512×910。冒頭から0.8秒のサンプルまで、ピアスは見えるものの両目と口が画面右外にあります。1.5秒のサンプルで顔全体が入ります。
- 顔が見えたサンプルでは前髪と顔の角度が変わり、元画像では目立たない濃い点が頬に出ています。元画像では手前側のピアスだけが見え、後半のサンプルでは両耳のピアスが見えます。
- ユーザーから冒頭の顔の見切れとホクロのような点について修正希望。音声の内容と投稿は未確認です。

## Google Flow用の指示文 v2

サイトの元画像を使い、縦9:16で10秒を選べる場合は10秒に設定します。Framesの開始フレームで、両目と口、青い花全体が入っているか確認します。縦の開始位置を調整できない場合は、同じサイト元画像をIngredientsの参照に設定してこの指示文を使います。 [Google Flow ヘルプ](https://support.google.com/flow/answer/16353334)

```text
Vertical 9:16, 10 seconds if supported. One steady, eye-level, chest-up boyfriend-POV shot in Kyoto.

From the very first frame, her full face and the entire visible blue pansy earring are already in view, with room around her eyes, mouth and the flower. Hold the same framing and three-quarter angle throughout. Keep the far ear out of view.

Preserve her reference face, wispy bangs, white blouse, and the same blue lace petals and fine chain. Keep the reference skin tone and natural cheek texture under soft, even light.

She looks at the viewer with a small, warm smile from the start. She speaks softly, then settles into a slightly brighter smile. Her head stays nearly still and her hands stay out of frame.

The woman says in natural, conversational Japanese:
ねえ、このあお、すき？

Avoid added moles or dark specks on the cheeks or around the mouth, heavy skin smoothing, extra jewelry, pans, zooms, cuts, subtitles and background music.
```

## 再生成後の確認

- 冒頭のフレームから目元・口元・群青のピアス全体を確認。
- 顔立ち、前髪、自然な肌の質感と頬に出た濃い点を元画像と比較。
- 元画像の側に見えるピアスの形と位置、他の耳飾りの出現、ひと言の発音と口の動きを確認。日英字幕とBGMは後編集。

## 旧版の指示文 v1

Video → Framesでサイト元画像を開始フレームに指定。縦9:16で、10秒を選べる場合は10秒。縦のプレビューで顔とピアス全体を確認します。

```text
Use the supplied site image as the start frame. Vertical 9:16, 10 seconds if supported. One continuous boyfriend-POV shot during a quiet date in Kyoto, Japan.

Center the vertical portrait on her face and the entire blue pansy earring, using the right side of the wide source image. Preserve her face, tied-back hair, white blouse and the earring's blue lace petals, yellow center and fine chain on the same ear.

Keep the camera steady at eye level and retain the soft light and plain background. She meets the viewer's gaze, speaks one short line, then holds a gentle smile. Her head stays nearly still and her hands remain outside the frame.

The woman says in natural, conversational standard Japanese:
ねえ、このあお、すき？

Soft room tone. Avoid extra jewelry, duplicated earrings, subtitles, logos, background music and cuts.
```

## 共通仕様への反映

2026-11-22に、元画像の女性の顔立ちを保ち、自然にきれいな肌と可愛らしい表情を引き出す方針を今後の全動画の基準に追加しました。 [制作SDD v1.11](../spec.md#動画の肌と表情)
