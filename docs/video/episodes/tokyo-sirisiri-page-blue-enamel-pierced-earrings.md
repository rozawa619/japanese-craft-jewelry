# SORA 東京編 第10話｜SIRI SIRI SHIPPŌ Page Blue 七宝ピアス

2026-11-26（JST）。元画像の黒髪のボブと白いシャツに、淡い青の七宝が映える組み合わせを選定。元の顔立ちと斜め向きの姿勢を保ち、柔らかな光と小さな微笑みで上品な可愛らしさを出す。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-sirisiri-page-blue-enamel-pierced-earrings`。商品IDは `sirisiri-page-blue-enamel-pierced-earrings`。
- 女性画像IDは `ai-sirisiri-page-blue-enamel-pierced-earrings-styling-v13`。元画像は `public/images/sirisiri-page-blue-enamel-pierced-earrings-styling-v13.webp`（1536×1024）。
- 公開商品ページの着用画像を確認。配信WebPは確認時のmain `74acc4e17220ab731d0955d936e0533a3b68fa8b` とバイト一致。Git blobは `d2a877e42856320ae049a270d911897502234dce`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、過去の制作記録で商品ID・女性画像ID・画像パスの重複なし。記録にある女性元画像も目視で照合した。
- 原本では、画面左の耳に、淡い青でページが折れたような形の七宝ピアスが一つ見える。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/sirisiri-page-blue-enamel-pierced-earrings/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/sirisiri-page-blue-enamel-pierced-earrings-styling-v13.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/74acc4e17220ab731d0955d936e0533a3b68fa8b/public/images/sirisiri-page-blue-enamel-pierced-earrings-styling-v13.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）では、画面右の目と口元が見切れる。縦枠を左端x=670・680・690に移しても、画面左のピアスと画面右の目元の両方に余白を取りにくい。少し引いた肩から上の画角で顔とピアスを一緒に収める。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。実際のFlow開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。Flowの実際の縦開始プレビューで、少し引いた画角に両目・口元・ピアス全体が余白付きで収まる場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

From 0.0 seconds, use a slightly wider head-and-shoulders portrait. Keep both eyes, her whole mouth and the entire blue enamel earring at screen left inside the frame with comfortable space on both sides. Frame her face and earring together. Hold her original three-quarter head angle, with the far ear covered by hair.

Preserve her exact facial features, sleek dark bob and white collared shirt. Keep the one visible earring's pale blue glaze, folded-page shape, size and position. Soft, even daylight and a gentle smile bring out her natural expression. Preserve skin texture and keep the cheeks, mouth area and chin free of visible moles and isolated dark spots.

Her head and shoulders stay steady and her hands stay out of frame. She meets the viewer's eyes, says one line softly and settles into a small smile. Quiet room tone.

The woman says in natural, conversational Japanese:
きょうは、このあおにしてみたよ。

Avoid: head turns, mirrored framing, extra jewelry, camera moves, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元と画面左の七宝ピアス全体が余白付きで収まるか確認する。
- 発話中と後半も、ピアスが同じ側に一つ見え、淡い青の釉薬と折れた形が保たれているか原本と照合する。
- 頬・口元まわり・あごを後半も確認する。見切れ、ほくろや単独の濃い点、ピアスの位置・個数の変化は `revision_needed`。発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の確認フレームで、両目・口元と画面左の青い七宝ピアス全体が余白付きで収まる。
- 2秒・3.5秒・5秒・7秒・9.5秒のサンプルでは、白いシャツとボブを保ち、画面左の同じ側にページ状のピアスが一つ見える。後半に確認した頬・口元まわり・あごに、目立つほくろや単独の濃い点は見当たらなかった。
- 音声の自動文字起こしでは、指示文の「今日は、この青にしてみたよ」と、それに続く「いい色かな？」を検出。TikTok紹介文には最初の一言を使用。全編の目視、細かな発音と口の動き、実際のFlowのモードとモデル、SNS公開は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo 📖
A touch of pale blue against a crisp white shirt. Inspired by SIRI SIRI’s SHIPPŌ Page Blue enamel earrings, shaped like a page mid-turn.

東京で待ち合わせ。
白いシャツに、耳元の淡いブルーをひとつ。
めくりかけのページを思わせる、SIRI SIRIの七宝ピアス「SHIPPŌ Page Blue」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #七宝ピアス #Tokyo #JapaneseJewelry
```

## TikTok紹介文

2026-11-26（JST）作成。下書き。TikTok公開は未確認。

```text
今日は、この青にしてみたよ。🩵

東京で待ち合わせ。
白いシャツに、ページをめくったような形の七宝ピアス。
淡い青の釉薬越しに、銀の模様が透けて見えます。

SIRI SIRI｜SHIPPŌ Page Blue 七宝ピアス

あなたなら、この青を何色の服に合わせる？

Meet me in Tokyo. SIRI SIRI’s SHIPPŌ Page Blue earrings curl like a turned page, with patterned silver showing through pale blue enamel.

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #東京 #SIRISIRI #七宝焼 #JapaneseJewelry
```
