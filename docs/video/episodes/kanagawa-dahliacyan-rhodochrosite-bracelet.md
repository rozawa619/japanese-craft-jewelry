# 進行中：鎌倉 Dahliacyan 銀の透かし彫りブレスレット

- ID: `kanagawa-dahliacyan-rhodochrosite-bracelet`
- 状況: **revision_needed**（10秒の初回生成動画を2026-11-21に確認。約5秒で両手首にブレスレットが出現。ユーザーから日本語が「ブレスレ」に聞こえる、非ネイティブ風との指摘。修正版v2を用意。公開未確認）
- 商品ID: `dahliacyan-openwork-rhodochrosite-bracelet`
- [日本語商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/dahliacyan-openwork-rhodochrosite-bracelet/)
- 着用女性の開始画像: `public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp`
- [GitHubで開始画像を開く](https://github.com/rozawa619/japanese-craft-jewelry/blob/main/public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp)
- 商品紹介: 鎌倉、銀の透かし彫りブレスレット、桃色の石。商品の実物写真・細部の完全再現と混同しない。
- 基本設定: 縦9:16、10秒、360p、Google Flow「フレームから動画」、POV、日本語音声のみ、文字・BGMなし
- 次にやること: 上の開始画像と **下記の修正版v2指示文** をFlowに指定して再生成。ブレスレットは参照画像にある片腕だけ、反対の腕は無装飾、日本語は「ブレスレット」を音声で使わず、生成後に左右の手首と発音を検査する。
- 成果物: 初回生成MP4は2026-11-21にチャット添付で確認したがGitHub上の永続リンクは未記録。別チャットから過去添付動画を開けるとは限らない。

## 修正版v2：Google Flow確定指示文（2026-11-21）

※前回のプロンプトから、女性と商品・デート視点の基本設定は維持。変更は**ブレスレットの個数・手首の動き・日本語セリフ/声質の明示**だけ。過去v1はGit履歴に残る。次回以降はv2を使う。

```text
Create a 10-second ultra-realistic cinematic Japanese POV dating video using the uploaded reference image as the starting frame.

VIDEO FORMAT
- Vertical 9:16, TikTok
- Duration: 10 seconds
- Photorealistic, natural Japanese romantic dating atmosphere
- First-person boyfriend POV
- One continuous shot, no scene cuts

CHARACTER CONSISTENCY — VERY IMPORTANT

Use EXACTLY the same adult Japanese woman shown in the uploaded reference image.
Preserve her facial features and identity, hairstyle, hair color, clothing, and overall appearance.
Do NOT generate a different woman.

JEWELRY CONSISTENCY — CRITICAL FIX FOR PREVIOUS FAILURE

There is EXACTLY ONE silver openwork bracelet with a pink rhodochrosite gemstone in the entire video.
It is worn ONLY on the same wrist that has the bracelet in the reference image. Keep the bracelet on that exact same wrist for the full 10 seconds.
The other wrist must remain COMPLETELY BARE at every frame: absolutely no bracelet, watch, jewelry, chain, strap, or duplicate accessory.
Do NOT mirror or copy the jewelry onto the opposite wrist. Do NOT transfer it between wrists.
Do NOT produce any second bracelet, even briefly.
Preserve the original bracelet's design, shape, pink gemstone, and position.
The bracelet must stay physically attached to its original wrist.

SCENE

A romantic afternoon date in Kamakura, Kanagawa, Japan.
The viewer is standing close to his girlfriend, looking at her from a natural first-person perspective.
Soft natural sunlight, gentle breeze, warm and intimate atmosphere.

ACTION AND TIMING

0–2 seconds:
The woman looks directly into the camera and smiles naturally. The original bracelet is already visible on one wrist.

2–7 seconds:
She speaks directly to the viewer in natural Japanese. She may gently rotate ONLY the wrist already wearing the bracelet to show the jewelry.
Keep the other hand relaxed, low, and preferably out of the frame. Do NOT lift both wrists into view and do NOT cross or swap hands.

7–10 seconds:
She keeps the bracelet on the SAME single wrist, tilts her head slightly, smiles affectionately, and looks into the camera as if waiting for her boyfriend's answer.
The other wrist stays bare.

EXACT JAPANESE DIALOGUE — NATIVE JAPANESE VOICE ONLY

「ねえ、みて。このもよう、ぎんのすかしぼりなんだって。にあう？」

Meaning (do NOT read aloud):
「ねえ、見て。この模様、銀の透かし彫りなんだって。似合う？」

Pronunciation:
- もよう = moyou (pattern)
- ぎん = gin (silver)
- すかしぼり = sukashibori (openwork carving)
- にあう = niau (suits me?)

Use a genuinely natural-sounding young adult native Japanese voice, with standard Japanese intonation and conversational rhythm. No English accent or foreign-language rhythm.
Speak the complete sentence clearly at a natural pace; do not clip, slur, shorten, or mispronounce words.
Do NOT speak the word "ブレスレット" (buresuretto), as it was mispronounced in the previous generation.
Do NOT say "ブレスレ" or add any improvised words.
The quoted Japanese dialogue is the ONLY spoken dialogue.
Accurate natural Japanese lip synchronization. Finish the spoken line comfortably before the end.

CAMERA

Natural boyfriend-eye-level POV.
Very subtle handheld movement.
Keep the woman's face and the ONE bracelet clearly visible.
Do not use dramatic zooms, sudden camera transitions, or angle changes that might duplicate the bracelet.

AUDIO
- Japanese dialogue only
- Soft natural ambient sounds
- No background music
- No additional speech

STRICT NEGATIVE INSTRUCTIONS
- No subtitles, captions, text, or logos
- No extra people
- No English dialogue or foreign accent
- No extra bracelets or any accessory on the other wrist
- No mirrored jewelry, duplicate wrists, extra arms, extra fingers, or malformed hands
- No changing the woman's face or outfit
- No distorted or redesigned jewelry
- No lifting both wrists, swapping arms, or crossing hands
- No exaggerated gestures, sudden moves, or cuts

The final result should feel like a genuine, sweet, intimate moment on a romantic date in Japan. There must be exactly ONE bracelet visible on only ONE wrist throughout the entire 10-second video.
```

## 生成結果・修正履歴

- 2026-11-21 初回10秒MP4を確認。映像の約5秒で**両手首に同型ブレスレットが同時に見える**。他のフレームでは片側が中心。10秒・縦512×910を確認。
- 2026-11-21 ユーザー報告：音声で「ブレスレット」が「ブレスレ」のように聞こえる／日本人らしい日本語になっていない。機械文字起こしではなく、**ユーザーの聴取報告**として記録。
- 2026-11-21 v2へ更新。装身具を1本・参照画像側の手首に固定、他方の手首は無装飾、両手を上げない。「ブレスレット」の発話を省略して自然な短文へ変更。ネイティブ日本語の声・口パク・言い切りを強化。
- 状態は **revision_needed**。v2再生成・新動画の検査・公開はいずれも未完了。
