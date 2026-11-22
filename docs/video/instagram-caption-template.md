# Instagramリール紹介文テンプレート

「SORA｜旅先で待ち合わせ」のリール用。日本の旅先と、映像に登場する工芸アクセサリーを英語・日本語で紹介する。

## 作り方

1. 添付動画やユーザーの指定に対応するepisodeを選ぶ。指定がないときは[制作状況](production-status.json)の `currentEpisodeId` を確認する。
2. 動画から見える特徴を一つ選ぶ。地名はepisode、商品名・工房・技法は `productIds` が指すサイト掲載情報を使う。商品が着想元の場合は「〜をモチーフに」「inspired by」と書く。未確認の名称や素材は、映像から確認できた色・形・装いの描写に置き換える。
3. 英語の短い誘いと映像・アクセサリーの紹介に続けて、日本語の「［地名］で待ち合わせ。」と見どころを書く。場所や品名が判明しているときは文中で自然に伝える。
4. AI注記とハッシュタグを最後に置く。タグは共通の `#SORA旅先で待ち合わせ`、日本語の地名と工芸名または品目、英語の地名とテーマの5つを基本とする。
5. TikTokや商品ページへ案内する場合は、プロフィールに設定済みのリンクと案内先の対応を確認し、AI注記の前に一文を添える。

## コピー用の書式

下の［　］を置き換える。投稿用には完成した本文を1つのコードブロックで渡す。

```text
Meet me in [place in English]
[One line about the scene and the accessory in English.]

［地名］で待ち合わせ。
［色、服、背景など、映像に映る見どころを一文。］
［工芸やアクセサリーの紹介を一文。］

AIで描いた旅のワンシーン｜AI-generated video

#SORA旅先で待ち合わせ ［地名タグ］ ［工芸・品目タグ］ ［英語の地名タグ］ ［英語のテーマタグ］
```

## 保存と確認

- 対象の `episodePath` に `## Instagramリール紹介文` を設け、作成日とコピペ用の本文を置く。更新は同じ節に反映する。
- [制作状況](production-status.json)の対象episodeに `instagramCaption` を記録する。作成済みは `status` を `draft`、`postUrl` を `null` とする。投稿先のInstagramリールを確認できたら `status` を `published` にし、そのURLを `postUrl` に入れる。
- 動画の制作状態・TikTokの投稿情報は台帳の既存欄で管理する。
- 出力前に、対象動画の地名・アクセサリーと一致すること、日英の順序とAI注記、タグ、置換欄が埋まっていることを確認する。

## 保存済みの投稿例

- [鎌倉・銀の透かし彫りをイメージしたブレスレット](episodes/kanagawa-dahliacyan-rhodochrosite-bracelet.md#instagramリール紹介文)
- [鎌倉・陽雅堂のもみじブローチ](episodes/kanagawa-yogado-kamakura-bori-maple-brooch.md#instagramリール紹介文)
