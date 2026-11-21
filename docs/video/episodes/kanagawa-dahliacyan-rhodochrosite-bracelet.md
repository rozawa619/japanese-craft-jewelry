# 進行中：鎌倉 Dahliacyan 銀の透かし彫りブレスレット

- ID: `kanagawa-dahliacyan-rhodochrosite-bracelet`
- 状況: **revision_needed**（初回生成では約5秒で両手首へ装身具が重複。v3再生成でも重複が残るとのユーザー報告。音声に不自然さ。公式調査を踏まえたv4の短い指示文を用意。ただし**縦9:16派生開始画像は未作成・未検証**。公開未確認）
- 商品ID: `dahliacyan-openwork-rhodochrosite-bracelet`
- [日本語商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/dahliacyan-openwork-rhodochrosite-bracelet/)
- 着用女性の開始画像: `public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp`
- [GitHubで開始画像を開く](https://github.com/rozawa619/japanese-craft-jewelry/blob/main/public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp)
- 商品紹介: 鎌倉、銀の透かし彫りブレスレット、桃色の石。商品の実物写真・細部の完全再現と混同しない。
- 基本設定: 縦9:16、10秒、360p、Google Flow「フレームから動画」、POV、日本語音声のみ、文字・BGMなし
- 次にやること: **先に既存サイト女性画像（横1536×1024）から、顔＋ブレスレット1本の片手首だけが自然に見える縦9:16の動画用派生開始画像を作り目視検証する。** 元ファイルは残す。そのあと次のv4の短いFlow指示文で検証。生成・公開は未実施。
- 成果物: 初回生成MP4は2026-11-21にチャット添付で確認したがGitHub上の永続リンクは未記録。別チャットから過去添付動画を開けるとは限らない。


## 画像デザインに関する最新の修正依頼（2026-11-21）

- ユーザーがFlow出力の女性について「服がおばさんっぽい、可愛くない」と指摘。
- 服・髪・顔をまとめて別モデルのように描き直した画像は、ユーザーから **「ここまでいくと別人」** と指摘され、**不採用**。現行サイトの女性と同一人物の開始画像として使用してはいけない。
- 次に画像を作る際は、サイト女性 `styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp` の**実ファイルを編集参照として使用**する。顔の輪郭/目鼻口/前髪などを変えず、服だけを現代的で清潔感ある鎌倉デート向けへ変更。髪型や年齢まで変えない。
- 編集前後で顔を横並び目視照合。ブレスレットは片手首に1個だけ。他方の手首は画角外。縦9:16の開始画像が完成するまで動画再生成を進めない。
- **注意**：以前作った「かわいらしい女性」画像は編集候補としても顔の再現性が不十分で、受入済み・Git保存済み・動画化済みとは扱わない。現時点で合格した縦9:16開始画像は未登録。

## 最新：v4（調査反映・短い指示文、2026-11-21）

[根拠と調査](../research/flow-veo-prompting-2026-11-21.md) / [SDD v1.2](../spec.md) / [共通テンプレートv2.0](../flow-template.md)

**今回の失敗**：v2/v3で「両手首にブレスレット」の問題が改善しなかった。v3で片手だけ画面に出すよう指示しても重複したとのユーザー報告（このチャットでv3映像全編の検証は未記録）。**否定命令を長文化する方法から、静止画で構図を確定→1つの微小動作という方法へ移行する。**

### 動画専用開始画像ゲート（v4前提）

- **元の女性画像**：`public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp`（1536×1024・横長）
- **派生画像の仕様**：元と同じ成人女性の顔/髪/服/ブレスレットの印象。縦9:16、胸〜顔の寄り構図、ブレスレットは片腕に1本、反対側の手首は構図外。自然な一枚の静止画。
- 公式商品写真を無許可で生成参照に使わない。サイトで使用する元画像は一切上書きしない。
- **派生画像ファイル：未作成**。検証済みになってからファイル名、保存先、採用理由をここへ追記。元画像を単純に縦切りする際はブレスレットが切れないか確認。
- **注意：** 9:16画像への調整が重複を防ぐ効果は未実証。改善確認は生成結果で行う。

### v4 Google Flow実行用（画像準備後に使用）

```text
Image-to-video using the supplied start frame.
Vertical 9:16, 10 seconds if available in the selected model.
One continuous photorealistic boyfriend-POV shot in Kamakura, Japan.

Preserve the same woman, outfit, face and silver bracelet with the pink stone shown in the start frame.
Composition: a close portrait showing her face and the single bracelet-wearing wrist relaxed near her torso. Her other arm remains naturally outside the frame.

Motion: she looks into the camera, gives a small warm smile and remains mostly still. Her bracelet-wearing arm stays relaxed and steady.
Camera: locked-off at natural eye level, soft afternoon daylight.

The woman says in natural, casual standard Japanese: ねえ、みて。このもよう、きれいでしょ？

Audio: her Japanese voice and gentle outdoor ambience.
Avoid: duplicate jewelry, extra arms, distorted fingers, subtitles, logos, scene cuts.
```

**人間向けのセリフ表記（生成プロンプトには入れない）**：「ねえ、見て。この模様、きれいでしょ？」。工芸名「銀の透かし彫り」は後編集字幕/キャプションで紹介。音声テキストと説明用漢字表記を生成プロンプト内で重複させない。

**無音切替**：v4でも日本語が不自然なら[標準テンプレートのB](../flow-template.md)を使用し、FlowプロジェクトSettingsの`Return silent videos`を有効にしたうえで別録り。リップシンクは別評価。音声参照を使う場合はOmni Flash + Ingredients対応の有無をUIで確認する。

**検査**：最初・中盤・最後だけでなく全フレームで手首とブレスレット数を確認。1本以外なら不合格。テスト結果・生成尺・モデル・開始画像名を台帳に記録。

---

## 旧版v2（履歴保管：v4では使用しない）

### 修正版v2：Google Flow指示文（旧版・再利用しない）

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

- 2026-11-21: v3（片手の画角を強く指定）でも両手にブレスレットが出てしまったとのユーザー報告。公式の画像→動画のコツに基づき、v4で画像プリフライトと最小動作へ変更。画像派生・v4再生成は未実施。
