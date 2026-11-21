# Google Flow プロンプト標準テンプレート

更新: 2026-11-21。**先に商品ページに掲載の女性画像をFlowの開始画像へ指定する。** これは次話用テンプレート。進行中の話に確定プロンプトがある場合は、[そのepisode](episodes/kanagawa-dahliacyan-rhodochrosite-bracelet.md)にある全文をそのまま使用する。

次の [角括弧] の中だけ、対象商品・開始画像に合わせて入れ替える。動画生成プロンプトを毎回新規発明しない。

```text
Create a 10-second ultra-realistic cinematic Japanese POV dating video using the uploaded reference image as the starting frame.

VIDEO FORMAT:
- Vertical 9:16, TikTok
- Duration: 10 seconds
- Photorealistic, natural Japanese romantic dating atmosphere
- First-person boyfriend POV
- One continuous shot, no scene cuts

CHARACTER CONSISTENCY — VERY IMPORTANT:
Use EXACTLY the same adult Japanese woman shown in the uploaded image.
Preserve her facial features and identity, hairstyle, hair color, clothing, and overall appearance.
Do NOT generate a different woman.

JEWELRY — VERY IMPORTANT:
The woman is wearing the same [JEWELRY DESCRIPTION] shown in the reference image.
Preserve the original accessory's design, shape, color, and position.
Do not replace, redesign, or exaggerate the jewelry.

SCENE:
A romantic afternoon date in [LOCATION], Japan.
The viewer is standing close to his girlfriend, looking at her from a natural first-person perspective.
Soft natural sunlight, gentle breeze, warm and intimate atmosphere.

ACTION AND TIMING:
0–2 seconds: The woman looks toward the camera, makes eye contact, and smiles naturally.
2–7 seconds: She speaks directly to the viewer in natural Japanese while subtly showing her accessory.
7–10 seconds: She smiles affectionately and looks at the viewer as if waiting for an answer.

EXACT JAPANESE DIALOGUE:
「[HIRAGANA-CENTERED JAPANESE SCRIPT]」

Pronunciation:
- [IMPORTANT TERM] = [HIRAGANA AND OPTIONAL ROMANIZATION]

Speak exactly the Japanese dialogue above.
Use a soft, sweet, natural voice of a Japanese woman in her twenties.
Native Japanese pronunciation, clear and natural intonation, accurate lip synchronization.
The speech must finish naturally within the video.

CAMERA:
Natural boyfriend-eye-level POV.
Very subtle handheld camera movement.
Keep her facial expressions and the accessory clearly visible.
Do not use dramatic zooms or sudden camera transitions.

AUDIO:
- Japanese dialogue only
- Subtle natural ambient sounds
- No background music
- No additional dialogue

STRICT NEGATIVE INSTRUCTIONS:
- No subtitles
- No text or logos
- No additional people
- No English dialogue
- No face changes
- No distorted hands or fingers
- No jewelry deformation
- No unnatural smiling or exaggerated gestures
- No sudden camera movements
- No cuts or transitions

The final result should feel like a genuine, sweet, intimate moment on a romantic date in Japan.
```

## 投稿文（Flowとは別に作成）

TikTokのキャプションは「女性のひとこと → 地域・商品・工芸の特徴 → コメントを誘う質問 → 必要なAI注記 → 関連する少数のハッシュタグ」。仕様・原産地・素材・販売状況は現行の公式資料やサイトの台帳にあることだけ述べる。サイトから購入可能と書く前にリンクの状態を確認する。英語/日本語の方針を守り、全作品で同じ長文を使い回さない。
