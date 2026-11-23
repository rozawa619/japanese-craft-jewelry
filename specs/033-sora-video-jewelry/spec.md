# 033 SORAの動画で紹介した商品を探す

TikTokとInstagramで共通利用するSORAの日英 `/sora/` に、動画で見た商品を探す入口を追加します。ページ上部のリンクから `#video-jewelry` に移動し、カードから対応する言語の商品詳細へ進めます。

| プロフィールから案内する先 | 公開URL |
| --- | --- |
| TikTok | [日本語の動画商品一覧](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/?utm_source=tiktok&utm_medium=social#video-jewelry) |
| Instagram | [日本語の動画商品一覧](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/?utm_source=instagram&utm_medium=social#video-jewelry) |
| 英語 | [英語の動画商品一覧](https://rozawa619.github.io/japanese-craft-jewelry/en/sora/#video-jewelry) |

- [TikTok公開照合台帳](../../docs/video/tiktok-publication-registry.json)の `knownPostLinks` から、対象アカウントの公開投稿URLと商品IDが照合済みの行を使います。公開カタログにある商品を台帳順に表示し、同じ商品への複数投稿は1カードにまとめます。
- 台帳と現行の着用AI画像で画像IDとパスが一致する場合に、既存の画像を元の比率と日英のAI表記で使います。画像が一致しない場合は商品名と商品へのリンクを表示します。
- 動画の導線と商品一覧へのリンクは静的HTMLで表示します。JavaScriptが有効な場合、共通ヘッダーの日英切替では媒体指定のクエリと `#video-jewelry` を引き継ぎます。従来の京都の特集と旅先別の導線も利用できます。
- 新しい投稿を載せるときは、公開状態・投稿URL・公開商品ID・画像を動画の台帳で照合します。プロフィールへのリンク掲載と流入実績はSNSのアカウント側で確認します。

[検証結果](validation.md)
