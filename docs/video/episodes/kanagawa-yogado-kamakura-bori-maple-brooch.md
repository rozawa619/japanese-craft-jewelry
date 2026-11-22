# 鎌倉・陽雅堂 鎌倉彫「もみじのブローチ」動画

- エピソードID: `kanagawa-yogado-kamakura-bori-maple-brooch`
- 作成日: 2026-11-21
- 制作段階: **Google Flow指示文準備済み／開始画像のCanva生成を依頼済み、完成画像の目視採用未確認／動画未生成／投稿未確認**
- 商品ID: `yogado-kamakura-bori-maple-brooch`（`src/data/catalog.json` のpublished）
- サイト商品ページ: https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/yogado-kamakura-bori-maple-brooch/
- 正本女性画像: `public/images/styling-jp-yogado-kamakura-bori-maple-brooch-v26.webp`
- 元画像: 768×512、斜めを見て微笑むポニーテールの成人女性、藍色・濃紺系のジャケット、襟に赤茶系のもみじ形ブローチ。GitHubから取得した元画像を視覚確認。
- サイト原本閲覧URL: https://github.com/rozawa619/japanese-craft-jewelry/blob/main/public/images/styling-jp-yogado-kamakura-bori-maple-brooch-v26.webp
- Canva参照画像: `MAHbjdHRNko`（本人のCanvaメディアへ公式GitHub RAW画像をインポート成功）
- Canvaの開始画像依頼: `PORTRAIT_9_16`、元女性の顔・髪・紺のジャケット・胸元のもみじを維持、秋の鎌倉路地、カメラ目線、人物を増やさない、別人にならない。**Canva生成ジョブは開始したが、結果の目視採用は未確認。**
- 演出: 秋の鎌倉、視聴者＝恋人目線、自然な微笑み、目線変化と小さな首傾げのみ。手とアクセサリーを動かさない。
- 音声（生成時はひらがな）: `ねえ、みて。このもみじ、かわいくない？にあうかな？`（漢字表記：ねえ、見て。このもみじ、かわいくない？似合うかな？）
- Flow: Framesモード、縦9:16、10秒が選べるとき10秒、1ショット、字幕/BGMなし
- 品質ゲート: 元サイトの女性と顔・髪・服が同じか。もみじブローチの形・位置・個数が一定か。人物が別人になっていないか。標準日本語の発音が自然か。
- 次にすること: Canva生成された縦9:16開始画像を確認・採用（サイト元画像と横並び照合）。合格ならその画像をFlowへアップロードし下記プロンプトで生成。動画検品と投稿は未実施。

## Instagramリール紹介文

2026-11-22作成。下書き。

```text
Meet me in Kamakura 🍁
A touch of autumn on a navy lapel, inspired by Yogado’s maple-leaf brooch and the art of Kamakura-bori woodcarving.

神奈川・鎌倉で待ち合わせ。🍁
紺のジャケットの襟元に、赤と橙のもみじ。
陽雅堂の鎌倉彫「ブローチ もみじ」をモチーフに、秋の装いを描きました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #鎌倉 #鎌倉彫 #Kamakura #JapaneseCrafts
```

商品名の参照先は[陽雅堂の公式商品ページ](https://shop.yogado.jp/item/detail/wb0030.html)。

## Google Flow貼り付け用 v1

```text
Image-to-video using the supplied starting frame. Vertical 9:16, 10 seconds if supported.

A single continuous photorealistic romantic boyfriend-POV shot on an autumn afternoon in Kamakura, Japan.

Keep exactly the same woman, face, hairstyle, dark navy outfit, and the original carved maple-leaf brooch shown in the starting frame. The brooch stays fixed to the same lapel, with its original shape, color, and number of maple leaves. Her hands remain relaxed outside the frame.

Motion: she slowly turns her eyes toward the camera, gives a warm, playful smile, and makes one very small natural head tilt. The brooch and her upper body remain nearly still.

Camera: steady, eye-level first-person perspective. Warm autumn daylight, subtle natural ambience.

The woman says in a natural, conversational native Japanese voice:
ねえ、みて。このもみじ、かわいくない？にあうかな？

Avoid: face changes, duplicated jewelry, floating accessories, extra hands, subtitles, logos, scene cuts, background music.
```

## 注意

- 胸元に見える「もみじの葉」の個数と、**ブローチという商品数1点**を混同しない。元画像に見える模様を維持する。
- 公式商品の実写写真の権利利用許諾を取得したと誤認させず、サイトの自作AI着用イメージを使用。
- カメラへ顔を向ける動作が同一性を壊す場合、目線の変化だけに減らす。
- Canvaが別人/別商品に変えた場合は開始画像を不採用としてやり直す。未採用の画像を「完成」と記録しない。
