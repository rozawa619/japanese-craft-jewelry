# 029 SORAのプロフィールから商品へ

TikTokとInstagramのプロフィールで共通して使えるSORAの入口を、日英の `/sora/` に設ける。公開サイトの群青パンジーピアスを最初に案内し、京都と神奈川の既存産地ページ、全国の商品一覧へ続ける。

| 利用先 | 公開URL |
| --- | --- |
| TikTokプロフィール | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/?utm_source=tiktok&utm_medium=social) |
| Instagramプロフィール | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/?utm_source=instagram&utm_medium=social) |
| 英語での案内 | [英語](https://rozawa619.github.io/japanese-craft-jewelry/en/sora/) |
| 群青パンジーピアスを直接案内 | [日本語の商品詳細](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/morphosphere-ultramarine-pansy-pierced-earrings/) · [英語の商品詳細](https://rozawa619.github.io/japanese-craft-jewelry/en/objects/morphosphere-ultramarine-pansy-pierced-earrings/) |

- 特集商品と産地の順番は [selection.ts](../../src/config/selection.ts) の `profileSelection` に記録する。商品名・産地・リンクと件数は公開カタログと既存ページから取り出す。商品が下書きになった場合には産地と一覧を案内する。
- 商品に登録された着用イメージに元の比率と日英のAI表記を使う。動画制作と投稿の状態は [制作進捗](../../docs/video/production-status.json) に記録する。
- 主リンクは幅320pxでも画面の上部に置く。商品・産地リンクは通常のHTMLリンク。共通ヘッダーの日英切替を使い、ページごとのcanonical・hreflang・Open Graphとサイトマップの経路を確認する。
- URLの媒体指定はリンクの識別に使う。クリック数の計測と、各SNSのプロフィールへの掲載はそれぞれアカウント側で確認する。

[検証結果](validation.md)
