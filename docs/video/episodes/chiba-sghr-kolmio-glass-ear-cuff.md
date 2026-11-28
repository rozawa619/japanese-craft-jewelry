# SORA 千葉編 第5話｜Sghr コルミオ 三角形のガラスイヤーカフ

2026-11-28（JST）。九十九里のSghrの三角形のガラスイヤーカフ。サイトの着用原本では、ベージュのジャケットとまとめ髪に、画面左の耳の外側の青みがかった透明なイヤーカフが一つ見える。再生成版は画角を確認済み。制作状況は `generated_unreviewed`。現行の指示文はv2。

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

## 初回添付の確認

2026-11-28（JST）。添付の10秒動画（512×910、30fps）を着用原本と照合。ベージュのジャケットとまとめ髪、画面左の耳に見える青灰色の三角形のカフが一致する。

- 0秒と0.5秒は原本の中央を縦に切り出した画角に近く、画面右側の目と口元が枠外。1秒でも右側の目は入らず、口元は一部だけ映る。
- 発話中と後半の確認フレームでも、頭頂と画面右側の顔が切れる。見える側の耳の外側に三角形のカフが一つ映り、開口と色は原本に近い。見えている頬・口元・あごに目立つ単独の濃い点は見当たらなかった。枠外の顔と肌は確認できない。
- 1.5〜4秒ごろに発話らしい口の動きがあり、9.85秒でも口が開く。末尾の9.3秒以降にも音声信号がある。発音・追加のセリフかどうか・口の動きとの同期、生成時のモードと公開状況は未確認。画角で `revision_needed`。

## Flow指示文 v2（現行）

**Ingredients** に同じサイト原本1枚を指定。縦9:16、選べる場合は10秒。初めから胸の中ほどまで引き、頭と両肩を収める。浅い斜め向きで、画面左のカフと画面右の目を同時に出し、左右に余白を取る。セリフはv1と同じ一言。再生成版の画角は下記の確認結果を参照。

```text
Vertical 9:16, 10 seconds if supported. One continuous, fixed eye-level boyfriend-POV shot in Kujukuri, Chiba. Use the supplied site image as the sole reference for her identity, outfit and one glass ear cuff. Compose a new, wider portrait against the same muted background.

At 0.0 seconds, the camera is already back far enough for a centered, mid-chest-up shot. Her full hairstyle, both shoulders, both eyes, whole mouth and the complete cuff all fit at once. Leave visible background above her hair, to the left of the cuff and to the right of her cheek. She is already at a shallow three-quarter angle with the cuff-wearing ear exposed at screen left. Keep her head and the camera steady in this composition to the end.

Keep her original adult face, loose dark updo, face-framing strands and beige jacket. Keep a single translucent blue-gray glass cuff on the same outer ear, with its rounded triangular shape, opening and original size. Her hands stay out of frame.

Soft, even daylight and a sweet, natural smile. Preserve fine skin texture. Keep the cheeks, mouth area and chin free of visible moles and isolated dark spots. She looks at the viewer and says this exact line softly once in natural Japanese:

ねえ、ちいさなさんかく、みえる？

After the line, she holds a small closed-mouth smile until the last frame. Quiet room tone. No captions, music or added jewelry.
```

## 再生成後の確認

- 0秒・0.5秒・1秒でまとめ髪と両肩、両目・口元と画面左のイヤーカフ全体が入ること、頭上・カフ側と反対側の頬の外にも余白があることを確認する。
- 発話中と後半も、丸みのある三角形、開口、青灰色の透明感と、同じ位置に一つという条件を原本と照合する。頬・口元・あごのほくろや単独の濃い点も確認する。
- 発音・追加のセリフ・口の動きを確認する。とくに発話後から末尾まで口が落ち着いているかを確認し、検品と公開照合の結果を制作台帳に記録する。

## 再生成版の確認

2026-11-28（JST）。新しい10秒の添付（512×910、30fps）を着用原本と照合。まとめ髪、ベージュのジャケット、画面左の耳の外側に一つ見える青灰色の三角形のカフが一致する。

- 0秒・0.5秒・1秒で頭上、両目、口元、カフ全体に余白があり、初回の画面右側の見切れを解消。発話らしい口の動きがある場面と9.88秒までの確認フレームでも、顔とカフが入る。
- カフは見える側の同じ耳に一つ。丸みのある三角形、開口と淡い青灰色を目視で照合した。確認フレームの頬・口元・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 後半の確認フレームでは口を閉じた微笑みが続く。発話内容・発音・追加のセリフ・リップシンクと生成時のモデル・モードは未確認。

## TikTok紹介文

2026-11-28（JST）の下書き。映像のまとめ髪、ベージュのジャケットと耳元のガラスをもとに作成。公開URLの照合は未実施。

```text
耳元の小さな三角、見つけた？ 🫧

千葉・九十九里で待ち合わせ。
ベージュのジャケットに、青みがかった透明なガラスをひとつ。

Sghr｜コルミオ 三角形のガラスイヤーカフ
あなたなら、まとめ髪で見せる？ 下ろした髪からちらっとのぞかせる？

Meet me in Kujukuri, Chiba. A translucent blue-gray triangle pairs with a beige jacket in this look inspired by Sghr’s Kolmio glass ear cuff.
Would you wear your hair up to show it off, or leave it down and let the cuff peek through?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #九十九里 #イヤーカフ #JapaneseJewelry
```
