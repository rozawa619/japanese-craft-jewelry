# SORA神奈川編：箱根丸山物産 寄木イヤリング D

- 作成日：2026-11-22
- Episode ID：`kanagawa-maruyama-yosegi-earring-d`
- 状況：**prompt_ready**（サイト掲載の商品と女性の元画像を照合し、Flow用指示文を作成。動画生成・公開は未確認）
- 商品ID：`maruyama-clip-d` (`published`)
- 日本語商品名：寄木イヤリング D（販売店：箱根丸山物産）
- 商品ページ：https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/maruyama-yosegi-non-pierced-d/
- 使用する女性の**サイト掲載原本**：`public/images/yosegi-bar-styling-v9.webp`（1536×1024、未編集）
- 直接表示：https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/yosegi-bar-styling-v9.webp
- 女性原本をGitHubから目視確認：ショートの濃い茶色の髪、紺色のジャケットと白いインナー、片耳に縦長の寄木の模様を示す耳飾り。背後は淡色無地。女性は視聴者に軽く微笑む。
- 制作順序：以前の「浜松屋 無垢寄木ペンダント」はユーザーから**すでに制作済み**との報告あり、次の商品を重複なく選び直した。
- **サイトとの関係・注意**：`src/content/places/ja/kanagawa.md`に「神奈川の販売店・箱根丸山物産が扱う寄木の耳飾り」として掲載。カタログの `prefectureIds` は空、個別製造地・作り手は未確認。「神奈川県で製造」「個別商品が伝統工芸認定」は断定しない。
- 画像の作成方針：ユーザー指定のとおり、サイト掲載原本を**そのまま**使う。勝手にAI生成・加工・9:16クロップしない。
- 動画設定：Google Flow Frames、縦9:16、10秒が使える場合10秒、POVデート、日常的な日本語、字幕/BGMなし
- 構図：顔、サイト画像で見えている耳飾りを画面内に保持。耳飾りの長方形と幾何学模様を同じ見た目で固定。手を顔や耳に上げない。元画像の背景は維持。
- セリフ（読み用）：`ねえ、みて。このもよう、かわいいでしょ？にあうかな？`
- 次の行動：サイトの元画像を直接Flow Framesの開始画像に入れ、下記固定プロンプトを貼り付けて生成。顔・耳飾り・声を確認後に成果物と公開リンクを更新する。

## Flow用コピー文 v1

```text
Create a 10-second photorealistic Japanese POV dating video using the supplied starting image.

Format: vertical 9:16 for TikTok, if supported. One continuous shot from a natural boyfriend-eye-level perspective.

Preserve exactly the same adult Japanese woman, her short brown hairstyle, navy jacket, white inner top, and the long rectangular wood-patterned earring visible in the starting frame. Keep its original geometric pattern, shape, color, size, and position by her ear. Preserve the original soft background.

0–2 seconds: She looks toward the viewer with a gentle, natural smile.
2–7 seconds: She maintains warm eye contact and speaks in conversational native Japanese. Her head moves only very slightly; she keeps her hands away from her ears.
7–10 seconds: She smiles a little more brightly and tilts her head subtly as if waiting for her boyfriend's answer.

The woman says in natural Japanese:
ねえ、みて。このもよう、かわいいでしょ？にあうかな？

Camera: stable close-up with her face and the original visible earring clearly in the frame. Minimal camera movement and realistic facial expressions.

Audio: native Japanese voice with soft ambient room sound, no background music.

Avoid: face or outfit changes, altered earring geometry, disappearing or floating jewelry, distorted ears or hands, extra people, captions, text, logos, dramatic zoom, scene cuts.
```

人間向け漢字表記：『ねえ、見て。この模様、かわいいでしょ？似合うかな？』

## 実施・検証

- 2026-11-22：サイトの商品 `maruyama-clip-d` が公開済みで、`src/data/editorial-images.json` の対応画像 `images/yosegi-bar-styling-v9.webp` を直接目視確認。
- シリーズは神奈川優先。ただしこの商品の**県内製造は未確認**。店は箱根の販売店として確認。
- 動画生成・再生・発音確認・TikTok掲載は**まだ行っていない**。
