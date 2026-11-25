# SORA 東京編 第3話｜漆芸中島 江戸漆器「つややか」てんとう虫ピアス 赤

2026-11-25（JST）。サイト掲載の着用画像とFlow指示文 v1を準備。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-nakajima-tsuyayaka-red-urushi-ladybug-studs`。商品IDは `nakajima-tsuyayaka-red-urushi-ladybug-studs`。
- 女性画像IDは `ai-styling-jp-nakajima-tsuyayaka-red-urushi-ladybug-studs-v40`。元画像は `public/images/styling-jp-nakajima-tsuyayaka-red-urushi-ladybug-studs-v40.webp`（1536×1024）。
- 公開商品ページで女性画像の表示を確認。配信WebPは確認時のmain `ce487fa72f9b5b1b882dd7815b4a5685fb947443` の原本とバイト一致。Git blobは `c66039216e30eb2be1a16bb26145e19b29b82579`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、これまでのエピソードと京都第3〜6話の制作メモで商品ID・画像ID・画像パスの重複なし。記録にある元画像も目視で照合した。
- 女性は髪をまとめ、淡いグレーのブラウスを着用。画面右の耳に黒い点模様のある小さな赤いピアスが一つ見える。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/nakajima-tsuyayaka-red-urushi-ladybug-studs/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-nakajima-tsuyayaka-red-urushi-ladybug-studs-v40.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/ce487fa72f9b5b1b882dd7815b4a5685fb947443/public/images/styling-jp-nakajima-tsuyayaka-red-urushi-ladybug-studs-v40.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）の範囲で、両目・口元全体・画面右の赤いピアスの外周に余白がある。原本の頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらない。ピアスの黒い模様を保ち、両手は構図の外に置く。Flowの実際の開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 今回の指示文は **Ingredients** に元画像を1枚指定する設定。Flowの実際の縦の開始プレビューで両目・口元と赤いピアス全体に余白があれば **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

From 0.0 seconds, show both eyes, her full mouth and the entire red ladybug stud at screen right, with clear space around her face and the stud. Hold this head-and-shoulders framing and her slight three-quarter angle throughout. Her hands stay out of frame.

Preserve her face, tied-up hair, light gray blouse and the single visible stud as shown. Keep the ladybug's black markings on the stud. Soft, even light preserves her natural skin texture. Her cheeks, the skin around her mouth and her chin stay free of visible moles and isolated dark dots.

She gently meets the viewer's gaze, speaks once and gives a small, warm smile. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、てんとうむしにみえる？

Avoid: camera moves, duplicated jewelry, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元と画面右のピアスが余白付きで収まっているか確認する。
- 後半の顔を原本と見比べ、頬・口元まわり・あごのほくろや濃い点、ピアスの柄・位置・個数、発音と口の動きを確認する。見切れや肌の黒点があれば `revision_needed` と記録する。

## 添付動画の確認（2026-11-25 JST）

- 512×910、30fps、10秒。冒頭の0秒・0.5秒・1秒では両目・口元・赤いピアスが画面内に収まっている。
- 冒頭のピアスは画面左に見え、正面を向く途中で両耳のピアスが見えるフレームがある。原本とv1では画面右の片耳のピアスが見える構図。
- 0秒・5秒の確認フレームで頬に小さな濃い点が見えるため、制作状態は `revision_needed`。音声、実際のFlowのモード・モデル、SNS公開は未確認。

## Instagramリール紹介文

2026-11-25（JST）作成。下書き。

```text
Meet me in Tokyo 🐞
A glossy red ladybug catches the light as she turns. Inspired by Shitsugei Nakajima’s Tsuyayaka lacquer earrings.

東京で待ち合わせ。
振り向くと、耳元で小さな赤いてんとう虫がきらり。
江戸漆器の技法で仕上げた、漆芸中島のピアス「つややか」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #江戸漆器 #Tokyo #JapaneseJewelry
```
