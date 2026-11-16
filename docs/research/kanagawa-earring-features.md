# 箱根の耳飾り紹介2本の再確認（0.3）

確認日：2026-11-16（日本時間）。既存のsource IDを使い、共有の価格・仕様・広告状態はcatalog.jsonのまま維持する。この記事追加による新規商品や新しい提携先はない。

## 対象

- `hamamatsuya-catch-pierced` → `hakone-yosegi-pierced-earrings`（EN/JA）
- `hamamatsuya-clip` → `hakone-yosegi-non-pierced-earrings`（EN/JA）

どちらも工房との神奈川・箱根の関連を説明し、個々の商品の製造地を別途監査したと主張しない。実物の使用、計量、皮膚適合試験は未実施。本文の価格の再入力は行わず、既存商品カードが共有データを表示する。

## 一次情報の実見

| 既存source ID | 公式資料 | 今回確認した内容・限界 |
|---|---|---|
| hamamatsuya-earrings | [無垢小物カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory_2.html) | 本文とHTMLを取得。キャッチ付ピアス（サージカルステンレス）3500円、イヤリング2500円を再確認。18K4500円は欠品表記。税込・全寸法・重量・全パーツの組成は掲載情報から確定しない。 |
| hamamatsuya-workshop | [店舗案内](https://www.hamamatsuya.co.jp/info/index.html) | 神奈川県箱根町畑宿138の本店・見える工場。工房の場所を個々の品の製造監査へ転用しない。 |
| hamamatsuya-technique | [匠の技](https://www.hamamatsuya.co.jp/work/index.html) | 木色を組み合わせる技法と独自商品に関する説明。個別の耳飾りの認証・製造工程の証明とはしない。 |
| hamamatsuya-craft-overview | [工芸解説](https://www.hamamatsuya.co.jp/craft/index.html) | 天然木の色を活かす模様作り、ズク貼りと無垢の区別。個別商品の樹種・仕上げ・仕様は未確認。 |
| hamamatsuya-en-shop | [英語通販](https://www.hamamatsuya.co.jp/shop-english/) | 英語通販の存在と国別配送可否の確認案内。このアクセサリーの海外向け購入完了は未検証。 |
| hamamatsuya-shipping | [Shipping & Returns](https://www.hamamatsuya.co.jp/shop-english/help/tradelaw) | 送料と返品条件の記載を再確認。対象国・対象商品の現行条件は販売店確認とし、サイト内に送料表の数値を転載しない。 |

## 写真の確認と生成イメージの区別

カタログ本文をブラウザで通常表示する試みはnetworkidleの待機でtimeoutになった。NodeのHTTPSで得た公式HTMLの画像参照を確認し、画像をメモリ上で読み込んだ調査用表示を新規headless Chromeでスクリーンショット化して目視した。公式写真を公開フォルダに保存・転載していない。調査用スクリーンショットは除外対象のartifacts/内だけにある。

- ピアス画像の見出し/altは「ピアス(18K)」。説明欄にキャッチ付の種類が併記されるため、写るフックをキャッチ付の構造と断定しない。画像は複数の木色の幾何学模様で、棒・丸・菱形・花/星に見える装飾を含む。
- イヤリング写真は、金色に見える金具と、棒状の山形模様・菱形の明暗格子・花/星形の装飾を複数掲載。金色という見え方は組成を示さず、見た目から正確な金具の種類・寸法は確定しない。
- スタイリング用の新規生成画像は実在の着用写真、商品画像の代替証拠、届く商品の再現として扱わない。柄・金具・寸法・顔に対する大きさは保証せず、画像の近くでAI生成イメージと明示する。公式写真の構図や背景を複製しない。

## 未実施

注文・問い合わせ送信・海外国別の購入手続き・実物試着・商品撮影・広告承認・商品写真の転載許諾取得は行っていない。
