# 032 検証記録

## 販売元の照合

2026-11-23（JST）に、販売元の本文・選択欄・カタログを読み、SORAの紹介仕様に対応する表示名を確認しました。

| SORAの商品 | 販売元の選択名・掲載名 | 確認元 |
| --- | --- | --- |
| 浜松屋のキャッチ付きピアスとイヤリング | キャッチ付ピアス（サージカルステンレス）、イヤリング | [浜松屋カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory_2.html) |
| 浜松屋の無垢寄木ペンダント | ペンダント | [浜松屋カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory.html) |
| Sur Basic1 | clear（ピアス） | [SAVA!STORE](https://savastore.jp/?pid=144282648) |
| 七窯社 ぷぬ 金彩 | バニラ ピアス | [七窯社](https://nanayosha.theshop.jp/items/77119082) |
| YOBOTY 藍染ロング | ノンホール | [YOBOTY](https://yob283848.owndshop.com/items/35168470) |
| ponzu. 琉球ガラスのハートピアス | ②花笠 | [tete by okinawa](https://teteby.base.shop/items/129228420) |
| 光助 肥後象嵌のしずく型 | ピアス | [光助](https://mitsusuke.com/product/ype-02/) |
| Oriori 紅花染めの絹ピアス | 紅赤ピアス | [JUYOUKAN](https://shop.juyoukan.jp/items/115161363) |
| cotake 別府竹細工 たおやめ | 白 イヤリング（シリコンパーツ） | [cotake](https://cotake.thebase.in/items/9101341) |
| 凛然 星華 琥珀 | 国内・海外で同品番 `s0138-028`、2点1組 | [国内](https://www.thebecos.com/products/s0138-028) · [海外](https://en.thebecos.com/products/s0138-028?currency=USD) |

浜松屋の現時点での店頭在庫と、販売元が明記していない販売単位は未確認です。通販と取扱店の確認日は、購入根拠の台帳の記録を参照します。

## 公開前の検証

- 本番設定で `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が成功しました。単体テスト150件、生成HTML400ページ、正規URL384件を確認しました。
- 10商品の日英詳細20ページと、商品カードの延べ224箇所に、該当する公式リンクに対応した選択名を確認しました。凛然の2点1組は国内・海外の価格表示に反映され、表示金額は国内26,400円、海外288 USDでした。
- v0.22.1と照合し、公式・購入リンクの延べ2,002箇所、価格の金額と通貨、AI画像の注記、WebP136点のSHA-256およびサイトマップが一致しました。
- ヘッドレスChromiumで日英56ケースを確認しました。幅320・1440pxで対象11商品のカードから詳細へ進み、スマートフォンの固定欄と出典操作も確認しました。幅667pxの横向きとJavaScript無効時にも代表商品を確認しました。幅320pxの英語カタログ例でaxeの違反は0件でした。実機Safariは未検証です。
