# SORA 東京編 第7話｜日伸貴金属 東京銀器 銀師宗伯の純銀手打バングル

2026-11-26（JST）。両目・口元と銀のバングルが同じ縦構図に収まる原本を選定。元の顔立ち・髪型・服と自然な手元の姿勢を保ち、柔らかな目線と微笑みを活かす。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-nisshin-souhaku-hammered-silver-bangle`。商品IDは `nisshin-souhaku-hammered-silver-bangle`。
- 女性画像IDは `ai-styling-jp-nisshin-souhaku-hammered-silver-bangle-v41`。元画像は `public/images/styling-jp-nisshin-souhaku-hammered-silver-bangle-v41.webp`（1536×1024）。
- 公開商品ページの着用画像を確認。配信WebPは確認時のmain `77e94c773d355ffc31752429cc31d2056b12560a` とバイト一致。Git blobは `ab422aaa75f3f4f0ce57d688636c2ba9584f016d`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、既存制作記録で商品ID・女性画像ID・画像パスの重複なし。記録にある女性元画像も目視で照合した。
- 原本の女性は肩までの髪と茶色のトップス。木のテーブルに片腕を伸ばし、見えている手首に細身の銀色のバングルが一つある。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/nisshin-souhaku-hammered-silver-bangle/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-nisshin-souhaku-hammered-silver-bangle-v41.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/77e94c773d355ffc31752429cc31d2056b12560a/public/images/styling-jp-nisshin-souhaku-hammered-silver-bangle-v41.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）で両目・口元・バングル全体が収まる。画面左下で指先が見切れる。左端x=360の縦枠では、顔とバングルに加えてテーブルに置いた指先も余白付きで収まる。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。実際のFlow開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。Flowの縦の開始プレビューで枠を左に寄せ、両目・口元・バングル全体・着用側の指先が余白付きで収まれば **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot across a wooden table on a quiet date in Tokyo.

From 0.0 seconds, show both eyes, her whole mouth, the complete silver bangle and her relaxed fingertips on the table, all with clear margins. Keep one bangle on the same wrist as the reference. Her visible forearm rests flat on the table, with her fingers pointing screen left. Her other arm stays out of frame.

Preserve her exact facial features, shoulder-length dark brown hair, brown top and the bangle's original width and hammered silver finish. Soft, even daylight brings out her bright eyes and gentle smile. Keep natural skin texture and her cheeks, mouth area and chin free of visible moles and isolated dark spots.

She keeps her head, forearm and fingers steady, makes gentle eye contact, speaks once and smiles naturally. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、このばんぐる、にあうかな？

Avoid: wrist turns, extra jewelry, distorted hands, camera moves, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元・指先とバングル全体が画面内に収まるか確認する。
- 発話中と後半も、腕がテーブルに自然に乗り、原本と同じ手首にバングルが一つ見えるか確認する。
- 元画像と後半の頬・口元まわり・あごを見比べる。見切れ、ほくろや濃い点、手や腕の崩れ、バングルの複製は `revision_needed`。発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の確認フレームでは、両目、口元、手首のバングル全体が画面内に収まっている。着用側の指先の一部は画面左端で見切れている。
- 2秒・3.5秒・5秒・7秒・9.5秒の確認フレームでは、同じ手首に銀色のバングルが一つ見える。後半に確認した頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 冒頭の指先の見切れにより制作状態は `revision_needed`。全編と音声、実際のFlowのモード・モデル、SNSでの公開状況は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo ✨
Across the wooden table, a little glint of silver. Inspired by Souhaku’s hand-hammered fine silver bangle from Nisshin Kikinzoku.

東京で待ち合わせ。
木のテーブル越しに、手元の銀がやわらかく光る。
日伸貴金属の銀師・宗伯が手打ちで仕上げた、東京銀器の純銀バングルをモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #東京銀器 #Tokyo #JapaneseJewelry
```
