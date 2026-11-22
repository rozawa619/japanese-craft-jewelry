# 神奈川シリーズ：箱根・浜松屋 無垢寄木ペンダント

- 作成日：2026-11-22
- エピソードID：`kanagawa-hamamatsuya-muku-yosegi-pendant`
- 状況：**prompt_ready**（サイト掲載の女性・商品の元画像を確認、Flow指示文作成済み。動画・投稿は未実施）
- 地域：神奈川県 箱根
- 商品ID：`hamamatsuya-pendant`、`src/data/catalog.json`で`published`を確認
- 日本語名：浜松屋 無垢寄木ペンダント
- サイト：https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/hamamatsuya-muku-yosegi-pendant/
- **同一人物・商品の唯一の参照画像**：`public/images/yosegi-pendant-styling-v9.webp`（1536×1024、横3:2）
- 画像原本：https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/yosegi-pendant-styling-v9.webp
- GitHubコネクタで元画像を目視確認：髪をゆるく後ろにまとめた成人女性、生成りのブラウス、黒い紐に幾何学模様の木製ペンダントが胸元に1点。
- 商品台帳上の説明：浜松屋の無垢寄木ペンダント。正方形の要素を使った木の模様を胸元で見せる。木部34×34×8mm、紐/チェーン65cmという登録（実物認証や紐の素材は未確認）。
- 使用する画像：**このサイト掲載の元画像をそのままGoogle Flowへ**。AI画像の追加生成、クロップ、服の変更はユーザーが明示依頼するまで禁止。
- 生成目標：縦9:16、10秒が使える場合は10秒、1ショット、POVデート、日本語短文。
- 読みの注意：寄木＝よせぎ。読み間違い防止のため音声セリフはひらがな主体。
- 次にやること：原画像をGoogle FlowのFramesの開始フレームへ指定し、下記をコピー。生成した動画の顔、ペンダントの1点維持、幾何学模様の形、音声を確認する。動画・公開URLが得られたら台帳を更新する。

## Google Flowに貼り付ける指示文 v1

```text
Create a photorealistic Japanese romantic POV dating video using the uploaded starting image.

FORMAT
- Vertical 9:16 for TikTok
- Duration: 10 seconds, if supported
- One continuous shot
- First-person boyfriend POV
- Natural, realistic Japanese atmosphere

CHARACTER AND JEWELRY

Preserve exactly the same adult Japanese woman from the starting image, including her facial features, tied-back dark hair, and original ivory blouse.

Keep the single original wooden yosegi pendant, its geometric pattern, dark necklace cord, size, and position on her chest unchanged.

Maintain the same face and accessory identity throughout the video.

SCENE AND ACTION

A quiet, intimate moment during a date in Hakone, Kanagawa, Japan.

0–2 seconds:
She makes gentle eye contact with the viewer and smiles naturally.

2–7 seconds:
She speaks softly in natural Japanese, with a playful, affectionate expression. Her hands remain outside the frame, and the pendant stays still.

7–10 seconds:
She finishes speaking, gives a slightly brighter smile, and tilts her head very subtly, waiting for the viewer's response.

JAPANESE DIALOGUE

The woman says in natural, conversational native Japanese:

ねえ、みて。これ、はこねのよせぎなんだって。かわいいでしょ？

Use authentic standard Japanese pronunciation, natural rhythm, and accurate lip synchronization. Speak the complete sentence clearly.

CAMERA

Steady boyfriend-eye-level POV.
Preserve the original soft background and natural lighting.
Frame her face and the single pendant together, without cutting off the necklace or wooden ornament.
Very subtle camera movement.

AUDIO
- Japanese dialogue only
- Quiet natural ambience
- No background music

AVOID
- Changing the woman's face
- Duplicating or redesigning the pendant
- Distorting the wooden geometric pattern
- Hands touching the pendant
- Extra people
- Unnatural gestures
- Subtitles, logos, or text
- Sudden camera movements or scene cuts

The finished video should feel like a genuine, warm moment between two people enjoying a quiet date in Japan.
```

漢字表記：『ねえ、見て。これ、箱根の寄木なんだって。かわいいでしょ？』

## 検品と未確認項目

- Flowの縦9:16指定では、横長開始画像の一部が切れる可能性がある。**勝手に元画像を加工せず**、画角の中に顔とペンダント両方が入るか生成後に確認。
- 以前の箱根約60秒総集編（`hakone-yosegi-60s-compilation`）の制作・公開状況は未確認。そこに記録されたのは耳飾り2点であり、このペンダントの動画作成は未確認。
- 本エピソードの動画生成・採用・投稿・Instagram紹介文は未実施/未確認。
