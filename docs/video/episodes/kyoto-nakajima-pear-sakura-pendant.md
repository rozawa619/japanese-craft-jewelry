# SORA 京都編 第2話 中嶋象嵌 ナシ型 桜・ラインドット ペンダント

2026-11-23に、サイト元画像とFlow指示文を用意しました。状態は `prompt_ready`。

- エピソードIDは `kyoto-nakajima-pear-sakura-pendant`。
- 商品IDは `nakajima-pear-sakura-pendant`。ナシ形の京象嵌ペンダントで、元画像では桜の面がカメラを向いています。 [サイトの商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/nakajima-pear-sakura-pendant/)
- 女性の開始画像は `public/images/nakajima-sakura-damascene-pendant-styling-v9.webp`（1536×1024、横3:2）。画像IDは `ai-nakajima-sakura-damascene-pendant-styling-v9`。 [サイト掲載の画像原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/nakajima-sakura-damascene-pendant-styling-v9.webp)
- 公開版と同じ画像を確認し、制作・公開台帳で商品ID、画像ID・パスを照合しました。

## Google Flow用の指示文 v1

縦9:16で、10秒を選べる場合は10秒。顔が右寄りでペンダントが下端に近いため、縦の開始フレームに両目・口元・ペンダント全体が入るか確認します。Framesで構図を合わせられない場合は、同じ元画像をIngredientsの画像参照に設定します。

```text
Use the supplied site image. Vertical 9:16, 10 seconds if supported. One continuous eye-level boyfriend-POV shot during a quiet date in Kyoto.

From the very first frame, both eyes, her mouth, and the whole pendant are comfortably in view. Hold a steady portrait from her forehead to just below the pendant, leaving room beneath it.

Preserve the same woman's face, straight dark hair and white collared shirt. Keep the single dark pear-shaped pendant and fine chain as shown, with the sakura design facing the viewer. Soft, even light shows clear, naturally textured skin in her original tone.

She meets the viewer's eyes with a small, warm smile. She speaks softly and then smiles a little more. Keep her head and shoulders nearly still and her hands out of frame.

The woman says in natural, conversational standard Japanese:
ねえ、このさくら、みえる？

Soft room tone. Avoid added moles or dark spots, heavy skin smoothing, changes to the pendant design, extra jewelry, pans, zooms, cuts, subtitles, logos and background music.
```

## 生成後の確認

- 最初から両目・口元・桜のペンダント全体が見えているか確認。
- 元画像の顔立ちと肌色、自然なキメを見比べ、頬や口元の濃い点や色ムラを確認。
- ペンダントの桜の面、形、個数、チェーンが保たれ、自然な微笑みと日本語のひと言が出ているか確認。
