# 034 京都の動画商品と神奈川の購入案内

日英のSORAプロフィールから、公開動画で見た京都の4商品を探せるようにします。商品カードは掲載済みの商品詳細に案内し、公開中の着用AIイメージを使います。 [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/sora/#video-jewelry) · [英語](https://rozawa619.github.io/japanese-craft-jewelry/en/sora/#video-jewelry)

- [TikTok公開照合台帳](../../docs/video/tiktok-publication-registry.json)に、投稿URL、公開商品ID、登録済みの画像ID、照合に使った表示を記録します。公開一覧のキャプションが商品を特定し、サムネイルの衣装や装身具がサイトの着用イメージと対応することを確認します。
- 染工房正茂 × Sextileの孔雀、錺之の銅の花菱、中嶋象嵌の桜・ラインドット、Morphosphere tintの群青パンジーを、照合した投稿の順に表示します。引き続き同じ商品は1カードで、京都4商品・神奈川7商品の計11商品を表示します。 [仕様033](../033-sora-video-jewelry/spec.md)
- 神奈川の動画掲載7商品は、販売元の公式通販または公式カタログで価格と該当商品を照合します。通販の購入欄、掲載名、金具、販売単位、浜松屋本店の案内は、各ページで確かめた情報を記録します。価格は[商品台帳](../../src/data/catalog.json)、購入経路は[購入根拠](../../src/data/purchase-evidence.json)、一次情報は[出典台帳](../../docs/research/sources.json)から表示します。
- スマートフォンの縦横表示で、媒体指定付きプロフィールからカード、商品詳細、公式購入先へ進めることを確認します。日英切替、戻る操作、固定購入欄、浜松屋の取扱店へのリンクも検証します。使用した端末・OS・ブラウザーと画面寸法を記録します。

[検証記録](validation.md)
