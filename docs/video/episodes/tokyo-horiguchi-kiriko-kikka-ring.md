# SORA 東京編 第5話｜堀口切子 江戸切子の指輪 Kikka

2026-11-26（JST）。窓辺の柔らかい光、明るい笑顔と透明な指輪が同時に見える原本を選定。顔立ち・髪型・服を保ち、自然な目線と表情で親しみやすさを出す。指示文準備時点の制作状況は `prompt_ready`。添付動画の確認結果は後述。

- エピソードIDは `tokyo-horiguchi-kiriko-kikka-ring`。商品IDは `horiguchi-kiriko-kikka-ring`。
- 女性画像IDは `ai-styling-jp-horiguchi-kiriko-kikka-ring-v40`。元画像は `public/images/styling-jp-horiguchi-kiriko-kikka-ring-v40.webp`（1536×1024）。
- 公開商品ページで女性画像の表示を確認。配信WebPは確認時のmain `4eda79ad0a9fb17bb5ba3351b57f246b59e1c8d0` の原本とバイト一致。Git blobは `fb8643512d994254a08e6652c7a8cdd99a47172a`。
- 制作台帳、11月24日確認のTikTok公開台帳、京都編の候補、既存制作記録を照合し、商品ID・女性画像ID・画像パスの重複なし。記録にある元画像も目視で照合した。
- 元画像では、女性は黒髪をまとめて青いニットを着用。画面左の手を鎖骨の近くに添え、円形の透明な指輪が一つ見える。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/horiguchi-kiriko-kikka-ring/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-horiguchi-kiriko-kikka-ring-v40.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/4eda79ad0a9fb17bb5ba3351b57f246b59e1c8d0/public/images/styling-jp-horiguchi-kiriko-kikka-ring-v40.webp)

## 開始構図の事前確認

原本1536×1024の中央576×1024（左端x=480）で両目・口元・指先・指輪全体が入る。手首は画面左下の枠に近い。左端x=455に寄せた確認範囲では着用側の手首も収まる。縦の開始画角では顔の両側と手首に余白を取り、指先や指輪を切らない。頬・口元まわり・あごに目立つほくろや濃い点は見当たらない。Flowの実際の開始プレビューは未確認。

## Flow指示文 v1

**縦9:16、選べる場合は10秒。** 下記は **Ingredients** に元画像を1枚指定する設定。実際の縦の開始プレビューで両目・口元・指輪全体と着用側の手が余白付きで収まる場合は **Frames** を選び、冒頭の `as the sole visual reference` を `as the first frame` に置き換える。 [動画SDD](../spec.md#冒頭の見切れを防ぐ手順)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot by a window during a quiet date in Tokyo.

From 0.0 seconds, frame her face and upper chest with room around both eyes, her full mouth and the whole ring-wearing hand at screen left. The complete clear round ring and its visible band stay in view. Keep the hand relaxed against her upper chest in its original pose, with one ring on the same finger. The other hand stays out of frame.

Preserve her exact face shape and features, tied-back dark hair, blue knit sweater and the ring's original shape, scale and position. Keep the source's soft window light, natural skin texture and bright, gentle smile. Her cheeks, the skin around her mouth and her chin stay free of visible moles and isolated dark spots.

She keeps her head and hand steady, meets the viewer's eyes, says one line softly and smiles. Quiet room tone.

The woman says in natural, conversational Japanese:
ねえ、このゆびわのもよう、みえる？

Avoid: moving or turning the hand, extra rings, distorted fingers, mirrored framing, captions, logos and music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元・着用側の手・指輪全体が余白付きで収まるか確認する。
- 発話中と終盤も手の位置、指の形、指輪の形と個数が原本どおりかを見る。
- 後半も元画像と頬・口元まわり・あごを照合する。見切れ、ほくろや単独の濃い点、手の崩れや指輪の複製は `revision_needed`。日本語の発音と口の動きも確認する。

## 添付動画の確認（2026-11-26 JST）

- 512×910、30fps、10秒。冒頭の0秒・0.5秒・1秒の確認フレームでは、両目、口元、画面左の着用側の手と指輪全体が画面内に収まっている。
- 2秒・3.5秒・5秒・7秒・9.5秒の確認フレームでは手の位置がわずかに動くが、同じ指に透明な指輪が一つ見える。後半のサンプルで頬・口元まわり・あごに目立つほくろや単独の濃い点は見当たらなかった。
- 全編と音声、実際のFlowのモード・モデル、SNSでの公開状況は未確認。

## Instagramリール紹介文

2026-11-26（JST）作成。下書き。

```text
Meet me in Tokyo ✨
Window light glints off a clear glass ring. Inspired by Horiguchi Kiriko’s Kikka, with a chrysanthemum pattern cut into the back of the glass.

東京で待ち合わせ。
青いニットに添えた手元で、透明な指輪が窓の光を受けてきらり。
菊の文様をガラスの裏に刻んだ、堀口切子の「Kikka」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #東京 #江戸切子 #Tokyo #JapaneseJewelry
```
