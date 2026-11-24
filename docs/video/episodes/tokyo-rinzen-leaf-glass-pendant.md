# SORA 東京編 第2話｜凛然 葉の雫 グリーンガラスのペンダント

2026-11-24（JST）。未使用の東京掲載商品から、顔と胸元の装身具が上下に並ぶ「葉の雫」を選んだ。サイト掲載の着用イメージ原本とFlow指示文 v1を準備した。11月25日の添付動画確認で、冒頭の見切れと頬の濃い点を記録した。制作状態は `revision_needed`。再生成用の指示文 v2は下記。

- エピソードIDは `tokyo-rinzen-leaf-glass-pendant`。商品IDは `rinzen-leaf-glass-pendant`。
- 元画像は `public/images/rinzen-green-leaf-styling-v9.webp`（1536×1024）。女性画像IDは `ai-rinzen-green-leaf-styling-v9`。
- 公開商品ページで表示を確認。配信されたWebP原本は確認時のGitHub main `240d65bb75e96c602d8787a9455f2780b4e16a5a` と一致した。Git blobは `74ba99708c6eab263ded295967b79b6ac58e395e`。
- 制作台帳、11月24日のTikTok公開台帳、京都編・東京編の既存制作記録に商品ID・女性画像ID・画像パスの重複なし。
- 元画像は黒いロングヘアとチャコールのニット。胸元の細い銀色のチェーンに、緑から透明に変わる切子ガラスの葉が1点下がる。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/rinzen-leaf-glass-pendant/) · [公開サイトの画像原本](https://rozawa619.github.io/japanese-craft-jewelry/images/rinzen-green-leaf-styling-v9.webp) · [GitHubの画像原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/240d65bb75e96c602d8787a9455f2780b4e16a5a/public/images/rinzen-green-leaf-styling-v9.webp)

## Flow指示文 v1

**Video → Ingredients** にサイトの元画像を1枚指定。縦9:16、10秒を選べる場合は10秒。原本は人物が右寄りのため、顔とペンダントを縦の中央に並べ、葉先の下にも余白を取った固定構図で始める。 [冒頭の見切れを防ぐ手順](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied website image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

The opening is already a centered portrait from her head to below the pendant. Align her face and the pendant along the vertical center. From frame one, show both eyes, her whole mouth, the visible chain and the entire leaf pendant. Keep clear space below the pointed tip and hold this framing throughout.

Preserve her face, long dark hair, charcoal knit top and soft pale background. Keep the same fine silver-toned chain and single leaf-shaped glass pendant, with its original cut pattern and green-to-clear coloring.

She looks at the viewer, speaks once and smiles gently. Her head and shoulders stay nearly still and her hands stay out of frame. Soft, even light preserves her natural skin texture.

The woman says in natural, conversational Japanese:
ねえ、はっぱのかたち、みえる？

Quiet room tone. Avoid duplicate jewelry, altered jewelry, added dark spots, heavy skin smoothing, camera moves, cuts, subtitles, logos and music.
```

## 生成後の確認

0秒・0.5秒・1秒で両目、口元、チェーンと葉の先端まで収まるか確認する。顔、髪、服とペンダント1点が保たれ、緑と透明のガラスの切子模様が見えること、日本語のひと言を確認する。

## 添付動画の確認（2026-11-25 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒では、画面右側の目とチェーンの一部が右端で見切れる。葉のトップは画面内にあり、後半も顔は右寄り。
- 0秒の画角は、元画像1536×1024の中央の576×1024（左端x=480）の範囲とほぼ一致する。確認用に縦枠を人物側へ寄せた範囲（左端x=708、幅576×高さ1024）では、両目・口元・元画像に見えるチェーン全体と葉先まで余白付きで収まる。
- 1.5秒以降の確認フレームでは、画面右側の頬に元画像の同じ位置では見当たらないほくろ状の点が見える。
- v1では横長の原本からの再構図を生成指示に委ね、肌の指示では末尾で濃い点にだけ触れていた。v2は開始画角を先に確認し、ほくろと濃い点を肌の要件と採用判定に明記する。生成時のFlowモード、モデル、音声、公開URLは未確認。

## Flow指示文 v2（再生成用）

原本は上のWebPを使用。**縦9:16、選べる場合は10秒。** Flowの縦の開始プレビューで枠を人物側へ寄せ、両目・口元・チェーンと葉先全体に余白があればFramesを使う。プレビューが確認できない場合や見切れが残る場合は、同じ原本1枚をIngredientsに指定する。 [SDD v1.13](../spec.md#冒頭の見切れを防ぐ手順)

```text
Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot in Tokyo. Match the woman, outfit and jewelry in the supplied site image.

At 0.0 seconds she is already centered in a head-to-mid-torso portrait. Both eyes, her full mouth, both visible sides of the chain and the whole glass leaf are comfortably inside the frame. Leave room beside her face and below the leaf tip. Hold this composition from the opening to the end.

Preserve her facial features, long dark hair, charcoal knit top and single green-to-clear cut-glass pendant. Soft, even light preserves her natural skin tone and fine texture. Her cheeks, the skin around her mouth and her chin stay free of visible moles and isolated dark spots.

She looks at the viewer, speaks softly once and gives a small smile. Her head stays nearly still and her hands stay out of frame.

The woman says in natural, conversational Japanese:
ねえ、はっぱのかたち、みえる？

Quiet room tone. Avoid generated captions, logos and music.
```

再生成後は0秒・0.5秒・1秒の画角と、後半も含めた頬・口元まわり・あごを確認する。
