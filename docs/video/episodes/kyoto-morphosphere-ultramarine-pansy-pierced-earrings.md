# SORA 京都編 第1話 Morphosphere tint 群青パンジーピアス

2026-11-22に京都編を開始。状態は `prompt_ready`。動画生成と投稿は未実施です。

- エピソードIDは `kyoto-morphosphere-ultramarine-pansy-pierced-earrings`。
- 商品IDは `morphosphere-ultramarine-pansy-pierced-earrings`。染めた刺繍レースで表現した群青のパンジーが、細いチェーンから下がるピアスです。 [サイトの商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/morphosphere-ultramarine-pansy-pierced-earrings/)
- 女性の開始画像はサイト掲載のWebP原本 `public/images/morphosphere-blue-pansy-styling-v9.webp`（1536×1024、横3:2）。画像IDは `ai-morphosphere-blue-pansy-styling-v9`。 [画像原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/morphosphere-blue-pansy-styling-v9.webp)
- 最新main（`614fe4c55827bbad9c3bd61ad787144e7e209c26`）の商品と画像を公開版のデータと照合。制作・公開台帳で商品IDと女性画像ID・パスの重複がないことを確認しました。
- 白いブラウスとまとめ髪を保ち、画面右側の顔と花全体が縦の構図に収まるようにします。青い花びら、黄色の中心と細いチェーンが、元画像と同じ耳に見える構図です。

## Google Flow用の指示文 v1

Video → Framesでサイト元画像を開始フレームに指定。縦9:16で、10秒を選べる場合は10秒。縦のプレビューで顔とピアス全体を確認します。

```text
Use the supplied site image as the start frame. Vertical 9:16, 10 seconds if supported. One continuous boyfriend-POV shot during a quiet date in Kyoto, Japan.

Center the vertical portrait on her face and the entire blue pansy earring, using the right side of the wide source image. Preserve her face, tied-back hair, white blouse and the earring's blue lace petals, yellow center and fine chain on the same ear.

Keep the camera steady at eye level and retain the soft light and plain background. She meets the viewer's gaze, speaks one short line, then holds a gentle smile. Her head stays nearly still and her hands remain outside the frame.

The woman says in natural, conversational standard Japanese:
ねえ、このあお、すき？

Soft room tone. Avoid extra jewelry, duplicated earrings, subtitles, logos, background music and cuts.
```

## 生成後の確認

- 顔・髪型・白いブラウスの見え方を元画像と照合。
- ピアスの花びら・チェーン・位置と、耳飾りの数を全編で確認。
- ひと言の発音、口の動きと最後のほほ笑みを確認。日英字幕とBGMは後編集。
