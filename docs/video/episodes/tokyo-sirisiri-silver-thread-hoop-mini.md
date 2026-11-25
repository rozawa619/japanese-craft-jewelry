# SORA 東京編 第6話｜SIRI SIRI ARABESQUE 銀糸のHOOP SV mini ピアス

2026-11-26（JST）。明るい笑顔と、髪に重なる透かしの輪が見やすい原本を選定。元の顔立ち・髪型・服を保ち、やわらかな目線で可愛らしさを出す。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認を後述。

- エピソードIDは `tokyo-sirisiri-silver-thread-hoop-mini`。商品IDは `sirisiri-silver-thread-hoop-mini`。
- 女性画像IDは `ai-styling-jp-sirisiri-silver-thread-hoop-mini-v23`。元画像は `public/images/styling-jp-sirisiri-silver-thread-hoop-mini-v23.webp`（1536×1024）。
- 公開商品ページの着用画像を確認。配信WebPは確認時のmain `3c6cb62ae8131f9ee1ff07294ca853f61efa4e7c` とバイト一致。Git blobは `8ac81754c8ba6cc337832ee0e9007d42e30bd06c`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、過去の制作記録で商品ID・女性画像ID・画像パスの重複なし。記録にある女性元画像も目視で照合した。
- 原本はロングのウェーブヘアにチャコール色のノースリーブ。画面右の耳に、フックから下がる淡い金色に見える透かし模様のフープが一つ写る。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/sirisiri-silver-thread-hoop-mini/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-sirisiri-silver-thread-hoop-mini-v23.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/3c6cb62ae8131f9ee1ff07294ca853f61efa4e7c/public/images/styling-jp-sirisiri-silver-thread-hoop-mini-v23.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）では、両目と口元は入るが画面右のフープの外周が見切れる。左端x=590に右へ寄せた範囲では、両目・口元・フックと輪全体が余白付きで入る。実際のFlowの開始プレビューは未確認。頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらない。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** にサイト原本を1枚指定する設定。実際の縦の開始プレビューで枠を右へ寄せ、両目・口元・フックから輪の下まで余白付きで収まれば **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置く。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot during a quiet date in Tokyo.

At 0.0 seconds, both eyes, her whole mouth and the complete hoop at screen right are already in frame. Give the hook, openwork rim and bottom of the hoop clear margins. Keep her face and hoop together in the portrait composition, with her original head angle and the far ear covered by hair.

Preserve her exact facial features and face shape, long wavy brown hair and charcoal sleeveless top. Keep the original hoop's size, metallic tone, openwork pattern and position. Soft, even daylight brings out her bright eyes and natural smile. Keep natural skin texture and her cheeks, mouth area and chin free of visible moles and isolated dark spots.

Her head and shoulders stay steady and her hands stay out of frame. She holds gentle eye contact, speaks once and returns to her warm smile. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、きょうのぴあす、きづいた？

Avoid: head turns, mirrored framing, extra jewelry, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元と画面右のフープ全体が余白付きで収まるか確認する。
- 後半も片側にフープが一つ見えるか、元の輪と透かし模様を保っているか、頬・口元まわり・あごにほくろや単独の濃い点が見えないか原本と比較する。
- 見切れ、肌の黒点、位置や個数の変化があれば `revision_needed`。日本語の発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。0秒・0.5秒・1秒の確認フレームでは、目元と口元は画面内にある。フープの透かし模様の外周は画面右端で見切れており、2秒・3.5秒・5秒・7秒・9.5秒のサンプルにも見切れがある。
- 後半に確認した頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらない。フープの見切れにより制作状態は `revision_needed`。全編と音声、Flowの実際のモード・モデル、SNS公開は未確認。
- 再生成は同じ原本を使用。右寄せの縦開始プレビューで目元・口元とフックから輪全体まで余白付きで収まる場合はFramesを使う。見切れが残る場合はIngredientsで画角を広げ、冒頭と後半サンプルを再確認する。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo ✨
A lace-like hoop glints against her dark hair. Inspired by SIRI SIRI’s ARABESQUE HOOP SV mini earrings, made with gold-toned silver thread.

東京で待ち合わせ。
耳元で、レースのような透かしの輪がきらり。
金色に仕上げた銀糸を使った、SIRI SIRIのピアス「ARABESQUE HOOP SV mini」がモチーフです。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #フープピアス #Tokyo #JapaneseJewelry
```
