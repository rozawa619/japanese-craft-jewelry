# 全国セレクト追加 0.16.0

確認日2026-11-17。50品/14地域から60品/24地域へ。既存の観光TOP10順位を保ち、実商品を確認した10県を追加した。公開SHA/Actionsと最終納品は[deployment-results.json](deployment-results.json)、要件と検証は[018](../specs/018-national-jewelry-expansion/spec.md)・[validation](../specs/018-national-jewelry-expansion/validation.md)を正本とする。

## 選んだ10品

| 地域 | 作品と公式購入情報 | 選ぶ理由・掲載するvariant |
| --- | --- | --- |
| 秋田 | [矢留彫金工房 あきた米](https://www.beams.co.jp/item/beams_japan/accessory/56420298390/) | 米粒を銀線の細工で表す、左右異なる耳飾り。BEAMS公式で両耳用の現行受付を確認 |
| 福井 | [Sur Basic1](https://savastore.jp/?pid=144282648) | 鯖江の眼鏡素材を白い丸と透明な四角へ。クリアのピアスを選定 |
| 岐阜 | [七窯社 ぷぬ 金彩](https://nanayosha.theshop.jp/items/77119082) | 美濃焼のふくらみと焼き付けた金彩の縁。バニラのピアス |
| 広島 | [EARTH Hiroshima 折り鶴ジュエリー](https://oneearth.official.ec/items/72364676) | 長いチェーンの先に小さな折り鶴。銀色のピアス。広島の企画と、個別製造県を分けて記載 |
| 鹿児島 | [島津薩摩切子 光衣L 金赤ルリ](https://satsumakiriko.co.jp/products/%E4%BA%8C%E8%89%B2%E8%A1%A325%E5%91%A8%E5%B9%B4-%E5%85%89%E8%A1%A3%E3%81%B2%E3%81%8B%E3%82%8A%E3%81%88-l-%E9%87%91%E8%B5%A4%E3%83%AB%E3%83%AA) | 色被せのガラスとカットによる光の切替を、胸元に置くペンダント |
| 徳島 | [アプローズ 阿波藍染めイヤリング ja1x001](https://kokoro-iki.jp/store/products/detail/2361) | 藍の青とパールの光沢。税込価格と現行注文受付が明確なイヤリングを採用 |
| 鳥取 | [YOBOTY 因州和紙 Long Type](https://yob283848.owndshop.com/items/35168470) | 和紙の繊維感を細い縦の形へ。受付を確認したノンホールだけを紹介 |
| 沖縄 | [ponzu. ハートピアス T-A27-88](https://teteby.base.shop/items/129228420) | 琉球ガラス片の色を小さなハートへ。②花笠を選び、欠品の青いvariantと分離 |
| 熊本 | [光助 肥後象嵌 しずく型](https://mitsusuke.com/product/ype-02/) | 黒い面と金の曲線を楽しむ耳飾り。公式ページでピアスを選択して受付確認 |
| 島根 | [めのや 出雲型勾玉 N-15](https://www.anahitastyle.com/view/item/000000027267) | 曲線の石とひもの組合せ。限定品の通販受付を確認し、効能や採掘地は推定しない |

円表示は各国内販売ページの実参考価格。海外価格への換算・店頭の値引き推定はしていない。採用外には欠品、終了した販売期間、対象金具の在庫未確認、税区分が分かりづらい別商品などがある。根拠と除外理由は[東側調査](research/national-expansion-east-2026-11-17.md)・[西側調査](research/national-expansion-west-2026-11-17.md)およびsources.jsonへ。

## 紹介と画像

各品に日英本文、選ぶ理由、装い、既存商品との比較2候補、日英各3問を追加。各新地域にも、その一品から選べる種類の入口と、出典を持つ産地/技法の説明を用意した。資料だけを作った空ページはない。新しい地域すべてを国指定の伝統的工芸品と呼ぶこともしていない。

AI画像は人物10枚＋単体10枚。元PNGは採用20枚と棄却3枚を別保管。折り鶴のネックレス状の図、米粒が4つに見える図、未確認のクリップを露出した図は採用しなかった。AI由来XMP・元PNG/public WebPのSHAと実promptは[人物記録](image-generation-v16.json)・[単体記録](image-generation-solo-v16.json)。公式写真の転載や生成入力はしていない。AI図は実物、使用経験、正確な形/寸法/金具/販売数の証明ではない。

旧98画像と旧生成記録は保持。今回の人物設定は架空の成人27〜32歳、日本4/米国3/英国3、かわいい/上品な雰囲気を混在させた。国籍や年齢はprompt設定であり、画像から人の属性を認定した値ではない。

## 訪問・地図と維持する境界

新10店舗の公式住所と案内を登録し、店頭の対象SKU在庫は保証しない。小地図は公式公開iframe4件とGoogle Share機能から実取得した6件。[取得記録](research/national-map-embeds-v16.json)に残し、第三者APIキーや推測のpbは使わない。表示前のGoogle通信なし、表示後だけiframe、閉じる/再読込で停止という既存動作を維持する。

商品リンクは通常URL。新たな提携承認・AdSense接続・申請・契約・課金・ホスト移転は行っていない。公開後の事実変更や将来在庫、Google掲載・広告審査は、この追加制作で保証するものではない。
