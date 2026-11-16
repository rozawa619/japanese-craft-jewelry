# 商品紹介を魅力から始めるための参照調査

確認日：2026-11-16（日本時間）。公式サイトの取得本文で情報の並びと購入導線を確認した。スクリーンショットによる画面の忠実な再現、購買率の測定は行っていない。文章・写真・レビュー・デザインの複製はしない。

| 公式ページ | 実際に確認した構造 | 今回の設計判断 |
|---|---|---|
| [The Good Trade: handmade jewelry brands](https://www.thegoodtrade.com/features/handmade-jewelry-brands/) | ブランドごとにデザインや選ぶ目的を説明し、価格帯と購入リンクを近くに配置。報酬開示もある。 | 読者が自分の好みと結び付けられる理由を先に置く。同社の着用経験・認証・レビューは当サイトへ移さない。 |
| [Who What Wear: affordable jewelry brands](https://www.whowhatwear.com/affordable-jewelry-brands) | 服やスタイルのイメージからブランドを紹介し、商品名・価格・購入リンクを続けている。 | 具体的な服の組み合わせから商品へ進む短い導線を作る。セレブ着用、品質・性能評価、著者の経験は流用しない。 |
| [BECOS: 6.KILN Half-moon earrings](https://en.thebecos.com/products/s0164-018) | 商品画像・価格・購入操作があり、下に感性を伝える説明と仕様表を分けている。 | 興味を持つ入口と、比較・確認に使う情報を分ける。当サイトは外部販売店へ送るので、カートや自社販売表示は模倣しない。 |

これらは観察から導いた編集・構成上の仮説であり、この順序が売上や流入を増やすと証明したものではない。BECOS参照商品は当サイトの掲載商品でも、現在の神奈川商品の提携対象でもない。

## 今回の商品への落とし込み

新しい表示テキストは `src/data/product-stories.json` に商品IDで関連付ける。各言語に `headline`、`standfirst`、`highlights[3]`、`outfit {title, body}` を持つ。価格、寸法、素材の詳しい仕様、広告URL・承認状態、在庫は複製しない。

浜松屋のピアスは「白シャツの日に、木の彩りを。」、イヤリングは「いつもの装いに、寄木のひとくせ。」と、服との関係を入口にする。「ピアス穴がある人」は商品を選ぶ理由に使わない。丸山C/Dの着こなし案の違いも編集上の提案であり、形状・品質・使い心地の差を実測したものではない。

一般的な寄木の色と幾何学は[浜松屋の工芸説明](https://www.hamamatsuya.co.jp/craft/index.html)、各耳飾りの存在と表記は[公式カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory_2.html)を再確認した。キャッチ付ピアスの正確な形状は、同じ欄の18K写真から確定しない。現在の遷移先はカタログなので、CTAは実物の柄や掲載情報を見に行くことが伝わる文言にする。

## 情報の優先順位

1. デザインと装いの魅力が伝わる短い見出し。
2. 商品名、価格、購入先で実物を見られる導線。
3. 選んだ理由と具体的なコーディネート案。
4. 仕様・配送・返品・未確認点・出典は、検討時に開ける補助情報。

仕様や重要な不明点を削除・捏造せず、画面全体を同じ注意文で埋めない。AI着用イメージは実物写真ではないと、その画像の近くに残す。着用試験や顧客レビューは作らない。

## 丸山4商品の形状を一次画像で確認

2026-11-16。別担当が新規headless Chromeで公式商品画像を表示し、調査用スクリーンショットを保存。本文担当と本担当の双方で実視した。画像ファイルはpublicへコピー・ホットリンクせず、模様と形状を自分たちの言葉で紹介する根拠に限る。商品ページリンク自体は従来の公式商品URLを維持。

| 商品ID | 公式画像の表示元 | 視認したこと | 内部証跡（公開用画像ではない） |
|---|---|---|---|
| maruyama-clip-c | https://makeshop-multi-images.akamaized.net/yosegi/shopimages/67/04/7_000000000467.jpg?1779160536= | 星/花のような輪郭と、中心から放射状に組まれた木色 | artifacts/research-clip-c.png |
| maruyama-clip-d | https://makeshop-multi-images.akamaized.net/yosegi/shopimages/68/04/1_000000000468.jpg?1720329024= | 縦長のバー状の輪郭と、矢羽根のような木の模様 | artifacts/research-clip-d.png |
| maruyama-pierced-c | https://makeshop-multi-images.akamaized.net/yosegi/shopimages/73/04/7_000000000473.jpg?1773887669= | 星/花のような輪郭と、放射状の木色 | artifacts/research-pierced-c.png |
| maruyama-pierced-d | https://makeshop-multi-images.akamaized.net/yosegi/shopimages/74/04/7_000000000474.jpg?1773889301= | 縦長の輪郭と、矢羽根のように連なる木の模様 | artifacts/research-pierced-d.png |

上の観察は画像の形・模様に限る。金具の組成、正確な寸法、重量、快適性、脱落しにくさは写真から認定しない。届く実物の柄や木色の完全一致も保証しない。C/Dは単なる商品記号として説明するのではなく、実視できた形の魅力を伝え、着こなし案を添える。
