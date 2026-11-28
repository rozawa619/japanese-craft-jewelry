# SORA 千葉編 第5話｜Sghr コルミオ 三角形のガラスイヤーカフ

2026-11-28（JST）。九十九里のSghrの三角形のガラスイヤーカフ。サイトの着用原本では、ベージュのジャケットとまとめ髪に、画面左の耳の外側の青みがかった透明なイヤーカフが一つ見える。制作状況は `prompt_ready`。

- 商品IDは `sghr-kolmio-glass-ear-cuff`。女性画像IDは `ai-styling-jp-sghr-kolmio-glass-ear-cuff-v23`。元画像は `public/images/styling-jp-sghr-kolmio-glass-ear-cuff-v23.webp`（1536×1024）。
- 配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` と確認時のmain `5cd781ea1d6a706f0cd038412d0e486c0f2c988b` のWebPは同一。Git blobは `b73ab5ed142cefef033a4ed3cad5ea8b83afb14b`。 [公開記録](../../deployment-results.json)
- 商品ID・女性画像ID・画像パスを制作台帳・TikTok公開台帳・京都編候補表と照合。千葉「タイタイ」と京都「孔雀」の当時の原本、東京「つややか」と「スターリングシャイン・ミニ」も目視比較し、重複は見つからなかった。現行TikTokプロフィールの投稿一覧は未照合。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/sghr-kolmio-glass-ear-cuff/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-sghr-kolmio-glass-ear-cuff-v23.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/5cd781ea1d6a706f0cd038412d0e486c0f2c988b/public/images/styling-jp-sghr-kolmio-glass-ear-cuff-v23.webp)

## 開始構図の事前確認

中央の576×1024（左端x=480）は、画面右側の目と口元が見切れる。人物側に寄せた範囲（左端x=704）は両目と口元が入るが、画面左のイヤーカフが枠の外に出る。原本の頭頂付近もタイトなため、0秒から髪全体と顔、耳元が同時に収まる引きの画角を指定する。顔とイヤーカフを合わせて新しい縦画面の横幅中央80%以内に置く。Flowの実際の縦開始プレビューは未確認。

## Flow指示文 v1

**Ingredients** にサイト原本1枚を指定。縦9:16、選べる場合は10秒。 [Flow共通テンプレート](../flow-template.md)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Kujukuri, Chiba.

From 0.0 seconds, use a pulled-back portrait from above her full hairstyle to her upper chest. Center her face and the visible cuff together within the middle 80 percent of the frame width. Keep both eyes, her whole mouth and the complete glass cuff at screen left visible, with clear space above her hair, beside the cuff and beyond the far eye at screen right. Hold these margins throughout.

Preserve her exact adult face, loose dark updo with face-framing strands and beige jacket. Keep one translucent blue-gray glass cuff at the same point on the outer ear at screen left. Preserve its rounded triangular outline, small opening and size relative to her ear.

Soft, even window light and a gentle, slightly playful smile bring out her natural expression. Keep fine skin texture and keep her cheeks, mouth area and chin clear of visible moles and isolated dark spots. She briefly meets the viewer’s gaze with her eyes while keeping the original three-quarter head angle. Her hands stay out of frame.

She says this exact line softly once in natural Japanese, then relaxes into a closed-mouth smile. Quiet room tone.

ねえ、ちいさなさんかく、みえる？

No extra dialogue, head turns, camera movement, mirroring, added jewelry, captions, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で頭上・両目・口元と、画面左のイヤーカフ全体の外側に余白があるか確認する。
- 発話中と後半も、丸みのある三角形、開口、青灰色の透明感と、同じ位置に一つという条件を原本と照合する。頬・口元・あごのほくろや単独の濃い点も確認する。
- 発音・追加のセリフ・口の動きを確認し、検品と公開照合の結果を制作台帳に記録する。
