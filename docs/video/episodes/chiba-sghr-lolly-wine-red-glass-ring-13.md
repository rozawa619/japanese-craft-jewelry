# SORA 千葉編 第7話｜Sghr 九十九里のガラスリング ロリー ワインレッド 13号

2026-11-28（JST）。千葉・九十九里のSghrのガラスリング。着用原本では、淡い水色のジャケットと白いトップスの女性が画面右に手を上げ、つやのあるワインレッドの指輪を見せている。添付の冒頭は顔・指輪・指先が収まる。中盤で手の親指側が右端にかかり、制作状況は `revision_needed`。

- 商品IDは `sghr-lolly-wine-red-glass-ring-13`。女性画像IDは `ai-styling-jp-sghr-lolly-wine-red-glass-ring-13-v37`。元画像は `public/images/styling-jp-sghr-lolly-wine-red-glass-ring-13-v37.webp`（1536×1024）。
- 確認時のmain `828df0273905d98db3c04cc1b2e7f5ccaa7fe6a2` と配信コミット `b6402048d28bfc0d07fc88a47b65fca291e4044c` で同一のWebP。Git blobは `d338dbc7e24364eea207bbb74969e0a9e319903f`。 [公開記録](../../deployment-results.json)
- 商品ID・女性画像ID・画像パスを制作台帳・TikTok公開台帳・京都編候補表と照合。千葉のアルコス「宇宙のキラキラ」、Sghr「コルミオ」「タイタイ」と東京の堀口切子「菊花」の着用原本とも比較し、重複は見つからなかった。現行TikTokプロフィールの投稿一覧は未照合。

[商品ページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/sghr-lolly-wine-red-glass-ring-13/) · [公開サイトの元画像](https://rozawa619.github.io/japanese-craft-jewelry/images/styling-jp-sghr-lolly-wine-red-glass-ring-13-v37.webp) · [GitHubの元画像](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/828df0273905d98db3c04cc1b2e7f5ccaa7fe6a2/public/images/styling-jp-sghr-lolly-wine-red-glass-ring-13-v37.webp)

## 開始構図の事前確認

原本の中央576×1024（左端x=480）と顔側に寄せた範囲（x=400）には両目と口元が入るが、指輪と手の大部分は枠外。手元側に寄せた範囲（x=720）は指輪が入るが、画面左の目と口元の一部、右の指先が切れる。原本は頭頂も画面上端に近いため、0秒から顔と指輪を着けた手をひとまとまりに置き、頭上・顔の左・指先の右に余白を取る。Flowの実際の縦開始プレビューは未確認。

## Flow指示文 v1

**Ingredients** にサイト原本1枚を指定。縦9:16、選べる場合は10秒。 [Flow共通テンプレート](../flow-template.md)

```text
Use the supplied site image as the sole visual reference. Vertical 9:16, 10 seconds if supported. One continuous, locked-off, eye-level boyfriend-POV shot on a quiet daytime date in Kujukuri, Chiba.

From 0.0 seconds, start with a pulled-back portrait from above her hair to below her raised wrist. Center her face and ring-wearing hand together within the middle 80 percent of the frame width. Keep both eyes, her whole mouth, the entire ring and the wearing hand through all its fingertips visible. Leave clear space above her hair, beside her face and beyond her fingertips at screen right. Hold this framing throughout.

Preserve her exact adult face, short dark bob with wispy bangs, pale blue blazer and white top. Keep her raised hand steady beside her face in its original relaxed pose, with her wrist naturally connected to the sleeve. Keep one ring on the same finger at its original size and orientation, with its rounded bean-shaped top, glossy wine-red glass and closed band. Her other hand stays out of frame.

Use soft, even daylight and a sweet, natural smile. Keep her skin tone and fine texture natural. Her cheeks, the skin around her mouth and her chin stay clear of visible moles and isolated dark spots. She meets the viewer’s gaze with her head and raised hand steady.

She says this exact line softly once in natural Japanese, then settles into a gentle closed-mouth smile. Quiet room tone.

このあか、きょうのふくにあってる？

No extra dialogue, hand gestures, added jewelry, camera movement, mirrored framing, captions, logos or music.
```

## 生成後の確認

- 0秒・0.5秒・1秒で両目・口元・指輪全体・着用側の指先と、それぞれの外側の余白を確認する。
- 発話中と後半も元画像と比べ、着用側の手首と指のつながり、指輪の形・ワインレッドの色・同じ指に1個という条件、頬・口元・あごのほくろや濃い点の有無を確認する。
- 発音・追加のセリフ・口の動きを確認し、検品と公開照合の結果を制作台帳に記録する。

## 添付動画の画角確認

2026-11-28（JST）。10秒の添付（512×910、30fps）を、着用原本 `styling-jp-sghr-lolly-wine-red-glass-ring-13-v37.webp` と照合した。水色のジャケットと白いトップス、顔の横に上げた手、丸みのあるワインレッドのガラスリングが一致する。

- 0・0.5・1秒では、両目・口元・指輪・着用側の指先が収まる。手の右側の余白は狭い。2.73秒で親指の一部が画面右端で見切れ、3.5秒付近でも手の親指側の輪郭が右端にかかる。
- 確認した0〜9.5秒の12フレームで、指輪は同じ指に1個見える。確認範囲の頬・口周り・あごに目立つほくろや濃い点は見当たらなかった。
- 右側の画角は要修正。通し再生、発話・発音・追加の台詞・リップシンク、実際のFlow設定と投稿照合は未確認。

## Instagramリール紹介文

2026-11-28（JST）。投稿用下書き。

```text
Meet me in Kujukuri, Chiba 💍
Does this glossy wine-red ring go with my pale blue jacket?
Inspired by Sghr’s Lolly glass ring.

千葉・九十九里で待ち合わせ。
ねえ、この赤、今日の服に合ってる？
水色のジャケットに合わせた、つやのあるワインレッド。Sghrのガラスリング「ロリー」をモチーフにしました。

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ #千葉 #ガラスリング #Chiba #JapaneseJewelry
```

## TikTok紹介文

2026-11-28（JST）下書き。顔の横にかざした指輪と水色のジャケットをもとに作成。実際のセリフと投稿URLは未確認。

```text
今日の差し色、この赤はどう？ 🍷

千葉・九十九里で待ち合わせ。
頬の横で、ワインレッドのガラスがきらり。水色のジャケットの差し色に。

Sghr｜ガラスリング ロリー ワインレッド（13号）
あなたなら、水色のジャケットと黒のワンピース、どっちに合わせる？

Meet me in Kujukuri, Chiba. Glossy wine-red glass adds a pop of color to a pale blue jacket in this look inspired by Sghr’s Lolly ring.
Would you pair it with a pale blue jacket or a black dress?

※映像はAIで制作した着用イメージです。
AI-generated styling video.

#SORA旅先で待ち合わせ #千葉 #九十九里 #ガラスリング #JapaneseJewelry
```
