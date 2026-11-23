# 商品・文章・画像の編集ガイド

プログラムを書かない運営者と、引継ぎ先のAIのための手引きです。まず[README](../README.md)で起動し、詳しい判断は[引継ぎ](handoff.md)・[共通原則](constitution.md)・[運用](operations.md)へ戻ってください。
2026-11-17の公開版0.18.0が継承する台帳は全66商品、公開60商品、下書き6商品、24県、33店舗（53商品に店舗案内）です。公開関連技法は34（全36）、一次出典293件、人物58＋単体60のAI画像118ファイル。今後の件数は台帳を数えて確かめます。

<!-- PUBLIC_V23 -->
0.18.0（仕様023）公開済み。人物は架空の日本人成人女性25〜33歳という生成設定へ統一。新22枚（25〜30歳、かわいい11/綺麗11）を採用、既存36枚と単体60枚を保持。app `f2bb423f4c4cf476e449d8ec37837243f764cfee`、[Actions44089370227](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44089370227) completed/success。実URLでHero・TOP10/DISCOVER・日英/スマホ・全商品画像・旧22URL非配信を検証済み。詳細はdeployment-results.json。

0.18.0の全sourceは1198ファイル・公開画像118枚。repository/export/ZIPの集合と全SHAを照合済み。全source ZIPはjapanese-craft-jewelry-source-0.18.0-models-023.zip、外部proofはpackage-verification-0.18.0-models-023.json、原本ZIPはjapanese-craft-jewelry-originals-0.18.0.zip（47ファイル）。完了記録を含め最終再梱包し、ZIP hashは自己参照を避け外部proofへ保存する。正本はdeployment-results.jsonのsourceDelivery。

023で人物着用画像を、架空の日本人成人女性という生成設定へ統一しました。58人物画像/60商品参照のうち22枚を新生成・採用・公開し、日本人設定の36枚を保持しました。新規は25〜30歳（25歳6枚）、全体は25〜33歳、かわいい系11/綺麗な系統11です。実在人物の国籍・年齢を見た目から認定しません。生成logはdocs/image-generation-japanese-v23.json、readerはscripts/lib/styling-generation-manifests.mjs、専用QAはscripts/check-japanese-model-styling.mjs。旧22画像はbytesを上書きせずretired/Git追跡解除/ignoreとし、dist/ZIPから除外。v12baseline・保持36人物・単体60・商品facts/レイアウト/広告off/Google Maps同意を維持しました。新元PNG22枚と旧自作AI参照22枚・全prompt/目視記録を別原本ZIPへ保存しました。

旧版の公開記録：0.17.3（仕様022）公開済み。app `ef8ae160e7fc7d2b41cdce1063094313b719df6e`、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success。実URLで一覧地図241・Hero77・mobile92・Sources328・補足24を確認。地図枠縮小/一覧沖縄別枠とトップ写真の自然比率を反映。確定値はdeployment-results/verificationを参照。 0.17.3の全sourceは1155ファイルを照合済み。これは023の生成/検証/公開/納品結果ではありません。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。
以下の実例は既存記録の**一部の抜粋**です。新しい価格・在庫を調べ直した例でも、レコード全体の貼り替え用テンプレートでもありません。

## 最初に覚えること

- 編集するのはこのリポジトリのファイルです。`dist/`は自動生成物なので直接直しません。
- Gitがあれば編集前に差分を確認します。ZIPだけなら元ZIP/proofを保管し、展開元とは別の作業用コピーを編集します。変更後はエディター等のフォルダー比較で差分を確認できます。文字コードはUTF-8を使います。
- JSONは半角の二重引用符・コロン・カンマを使います。金額は`3500`のような数値で、`"3,500円"`にはしません。
- `null`は「未確認・値なし」です。`"null"`という文字列や、仮の`0`に変えません。
- `id`はファイル間を結ぶ内部の目印、`slug`は公開URLの末尾です。商品名を直すだけなら、どちらも変えません。
- 確認日を今日にするのは、実際にその情報を確認した場合だけです。文章を編集した日とは区別します。

## 何を直すかで、開くファイルを選ぶ

| 直したい内容 | 主な編集先 |
| --- | --- |
| 英語の商品名・仕様・所属・価格 | [catalog.json](../src/data/catalog.json)の`products`配列 |
| 日本語の商品名・仕様文・カード紹介 | [translations/ja.json](../src/data/translations/ja.json)の`products.商品ID` |
| 大見出し・導入文・装い・選ぶ人 | [product-stories.json](../src/data/product-stories.json)の`商品ID.en / ja` |
| 「惹かれる、その理由。」の本文 | [products/](../src/content/products/)と、その中の`ja/` |
| 比較候補と違い | [selection-notes.json](../src/data/selection-notes.json) |
| 選び方の3問答 | [product-buying-guides.json](../src/data/product-buying-guides.json) |
| 公式URL・広告候補・提携状態 | `catalog.json`の`links / merchants / programs` |
| 出典URL・確認日・確認できたこと | [research/sources.json](research/sources.json) |
| 買えることを確認した根拠 | [purchase-evidence.json](../src/data/purchase-evidence.json) |
| 公式ページで選ぶ色・金具やカタログの掲載名 | [purchase-evidence.json](../src/data/purchase-evidence.json)の`listingSelection`。国内購入リンクに対応する一次出典と表示名を日英で記録する。 [仕様032](../specs/032-purchase-selections/spec.md) |
| 店舗・訪問案内・工房公式サイト | [visits.json](../src/data/visits.json) |
| 人物の着用AI画像／単体AI画像 | [editorial-images.json](../src/data/editorial-images.json)／[product-detail-images.json](../src/data/product-detail-images.json) |
| 画像の権利・退役・生成記録 | [assets.json](assets.json)・[旧単体v14](image-generation-solo-v14.json)・[人物v16](image-generation-v16.json)・[単体v16](image-generation-solo-v16.json) |
| 商品の編集順／産地代表 | [selection.ts](../src/config/selection.ts)／[region-selection.ts](../src/config/region-selection.ts) |
| ガラスと木の素材ページの説明 | [material-collections.ts](../src/lib/material-collections.ts)。紹介例の掲載状態は商品台帳で確認する |
| AI画像から実物の確認へ進む案内 | [ProductImageNote.astro](../src/components/ProductImageNote.astro)。日英の文面を共有し、商品詳細の主購入リンク、単体画像、固定購入欄、AI着用画像付きのカードで表示する。 [仕様031](../specs/031-product-image-disclosure/spec.md) |
| 地域紹介・種類を選ぶ前の一言 | [places/](../src/content/places/)の日英・[region-choice-notes.json](../src/data/region-choice-notes.json) |
| 色・共通レイアウト | [global.css](../src/styles/global.css)。部品内の`<style>`にも個別設定あり |

`catalog.json`の商品は配列ですが、文章・画像の対応表は商品IDをキーにしたオブジェクトです。入れ場所を取り違えないでください。
トップのコピーは[index.astro](../src/pages/[lang]/index.astro)、共通ナビは[Base.astro](../src/layouts/Base.astro)の` t(locale, '英語', '日本語') `も確認します。タグや括弧を残し、表示文は日英を組で直します。

## 1. 商品名と紹介文を変える

浜松屋の実例では、内部IDとURL末尾が違います。
```json
{
  "id": "hamamatsuya-catch-pierced",
  "slug": "hamamatsuya-surgical-stainless-pierced-earrings",
  "title": "Hamamatsuya yosegi catch-back earrings",
  "originalTitle": "キャッチ付ピアス（サージカルステンレス）"
}
```

英語の表示名は`title`、公式の元表記は`originalTitle`。日本語の表示名は`translations/ja.json → products → hamamatsuya-catch-pierced → title`です。
商品詳細の大きな見出しは商品名ではなく、`product-stories.json → 商品ID → en / ja → headline`から出ます。
同じ場所の`standfirst`が導入文、`highlights`は3項目、`outfit`は`title / body`、`decision`は`bestFor / consider`です。
カードの短い紹介は`catalog.json → editorialSummary`と、その日本語訳も確認します。全部を同じ一文に揃える必要はありません。
検索用の商品タイトルと説明は[seo.ts](../src/lib/seo.ts)が商品名・`editorialSummary`の最初の文・技法名から生成します。画面の大見出しとは編集先が違います。
実物を使っていない状態で「軽くて疲れない」「アレルギーが出ない」「愛用した」などの体験・性能を書き足しません。

本文の編集先は、例なら[英語本文](../src/content/products/hamamatsuya-catch-pierced.md)と[日本語本文](../src/content/products/ja/hamamatsuya-catch-pierced.md)です。
ファイル冒頭の`---`に囲まれた設定を残し、その下の段落を編集します。日本語側の形は次のとおりです。
```yaml
---
productId: hamamatsuya-catch-pierced
locale: ja
publishStatus: published
---
```

英語の本文は`locale`省略時に`en`として扱われます。新規作成では日英を明示すると取り違えを防げます。

## 2. 日本向け参考価格と海外価格を更新する

価格の正本は`catalog.json`です。文章・Q&A・画像説明へ同じ金額を再入力しません。
日英どちらのページでも主価格は「日本向け通販の参考価格」。店頭価格、為替換算額とは別です。
凛然・星華の既存記録は次の構造で、USD 288とJPY 26,400は別ストアの実表示価格です。
```json
{
  "id": "rinzen-seika-amber-pierced-earrings",
  "priceAmount": 288,
  "priceCurrency": "USD",
  "priceCheckedAt": "2026-11-16",
  "localizedPrices": {
    "ja": {
      "amount": 26400,
      "currency": "JPY",
      "checkedAt": "2026-11-16",
      "taxNote": "日本語ストアの税込表示。",
      "sourceIds": ["becos-rinzen-seika-amber-ja"]
    }
  }
}
```

- 国内JPYだけの商品：`priceAmount / priceCurrency / priceCheckedAt / taxNote`を根拠に沿って更新。
- 海外通貨の元価格がある商品：その4項目は海外側を維持し、国内値は`localizedPrices.ja`で更新。
- `localizedPrices.ja`がない場合、元価格がJPYなら国内価格に使われます。海外通貨から自動換算はしません。
- 片耳／一組が一次情報で確認できた場合だけ、`priceUnit`を`single-ear / pair / one-item`で記録。
- 価格の出典と日付、商品全体を再確認した場合の`lastVerifiedAt`、必要な日英説明も整合させます。

表示を担う[market-prices.ts](../src/lib/market-prices.ts)は通常編集しません。店頭のほうが安い、差額は送料、とは推測しないでください。

## 3. 公式URLと出典を更新する

商品URLは`catalog.json → links`の該当商品です。表示名を変えても`link.id / productId / merchantId`の対応は維持します。
`officialProductUrl`が通常の公式URL、`affiliateUrl`が承認後の広告URLです。工房ホームと商品ページを混ぜません。
`locale: "ja"`と`locale: "en"`は行き先の言語を分ける値です。UIが英語だから国内リンクを海外URLへ差し替える必要はありません。
対応する販売店は`merchants`、広告プログラムは`programs`に置きます。許可した公式ホストとの一致も検査されます。

出典台帳の既存例です。確認した内容を`supports`に記録します。
```json
{
  "id": "hamamatsuya-earrings",
  "url": "https://www.hamamatsuya.co.jp/item/muku/accessory_2.html",
  "title": "Hamamatsuya muku small accessories, page 2",
  "checkedAt": "2026-11-16",
  "access": "body_read",
  "supports": ["Names, catalog prices, 18K and surgical stainless wording, sold-out notices for hairpin and 18K earrings"]
}
```

`body_read`は本文を実際に読めた記録です。検索結果の抜粋だけで設定しません。403や一時障害だけで閉店・欠品とも判断しません。
新しい出典IDを作ったら、商品の`sourceIds`と、その事実を使う比較・Q&A・購入根拠などへ必要な参照を足します。

## 4. 比較とQ&Aを直す

`selection-notes.json → 商品ID`には`sourceIds`、`compareWith`、`en / ja`を置きます。
`compareWith`は自分以外の公開商品IDを2〜3件。`en / ja`の中は`difference / chooseFor`です。比較相手の仕様は相手の商品台帳から表示されます。
`product-buying-guides.json → 商品ID`は`sourceIds`と、日英それぞれ`questions`の3件です。1件の中は`question / answer`です。
寸法・金具を繰り返し数値で書くかわりに、確認済みの値だけ`{size}`・`{findings}`・`{fastening}`で差し込みます。
例：浜松屋の日本語回答は`金具の案内は「{findings}」。`で始まります。値は日英の商品台帳から展開されます。
元の値が`null`なら、そのトークンは使えません。「実際の一組の縦横を手持ちと比べる」など、未知のまま判断に役立つ案内にします。
Q&Aへ価格・URLを埋め込んだり、別商品の回答全文をコピーしたりすると検査で止まります。

## 5. 新商品を準備して公開する

最初から`published`へ変えず、まず`catalog.json → products`に`draft`で準備します。既存IDの重複を避け、未知の仕様は`null`にします。
下記を一組として揃えてから、日英の本文と台帳の公開状態を切り替えます。

1. 実際の公式本文を読み、商品・金具・価格・確認日・出典を記録する。
2. 工房・販売店・素材・技法・種別・都道府県のIDを正しく関連づける。小売店住所を製造地にしない。
3. 正しい商品／価格付きカタログURLと購入経路を確認する。写真ギャラリーだけでは公開根拠にしない。
4. 日英の商品名・短い紹介・大見出し等の紹介データ・本文2本を用意する。
5. 比較候補と日英3問答を用意し、それぞれ商品の出典へ結びつける。
6. `purchase-evidence.json`と`visits.json`の公開商品用対応を揃える。
7. 人物と単体のAI画像を実見し、対応表・台帳・生成記録・実ファイルを揃える。
8. 新地域なら日英の地域本文と`region-choice-notes.json`も用意する。空地域ページを作らない。
9. 検査と日英PC/スマホ確認を終え、変更一覧と確認結果を残してから公開する。

下書き中の準備メモは公開商品専用の対応表に混ぜず、公開切替時にまとめて登録します。作業途中の未完状態を公開しません。

購入根拠の`kind`は`online-order`または`retail-and-catalog`。`productId / checkedAt / linkId / storeIds / sourceIds`も必要です。
後者は現行小売店と商品を結ぶ根拠が必要。前者も対象商品・選択肢の注文受付を確認します。`listed`を常時在庫ありの意味にしません。
浜松屋の該当品は`retail-and-catalog`、リンクIDは`hamamatsuya-catch-pierced-retailer`、店舗IDは`hamamatsuya-hatajuku-main`という既存の対応です。

## 6. 公開を取り下げる・欠品に対応する

確認できる購入経路がなくなった場合は`draft`へ戻し、日英本文の公開状態も揃えます。明示欠品の商品を、そのまま公開し続けません。
同時に公開集合専用の比較・Q&A・購入根拠・訪問対応・画像対応表を整理し、他商品の`compareWith`、選定順、代表商品からも外します。
最後の1商品を外す地域は、地域の紹介・選択文・導線にも影響します。本文や出典・画像原本を無計画に消さず、履歴を残します。
画像は[assets.json](assets.json)の退役管理と[prune処理](../scripts/prune-retired-images.mjs)を確認。公開URL・一覧・サイトマップから消えたことまで検査します。

## 7. 画像を差し替える

023の人物更新では[日本人女性の画像ガイド](japanese-model-styling-v21.md)を先に読みます。新logはdocs/image-generation-japanese-v23.json、readerはscripts/lib/styling-generation-manifests.mjs。対象22だけを例外にし、保持36人物/単体60/v12baselineを変更しません。旧22は同名上書きせずledgerのretired/localRetiredPathとGitignore/追跡解除・dist/ZIP除外を揃え、旧原本を保ちます。Git操作は今回rootが担当します。

新WebPはstyling-jp-<productId>-v23.webp、元PNGは納品先generated-originals/0.18.0/へ。人物は架空の日本人成人25〜33歳の設定で、25歳を含めます。altはAIと見える装い/装身具を説明し、画像から国籍/年齢を認定しません。過去logのUS/UK等を削除せず、現在のactive assetIdに対応する採用設定を新QAで確認します。

人物用とジュエリー単体用は別の対応表です。同じ商品IDで結び、`public/images/`に実ファイルを置きます。
単体画像の既存例では、`path`に`public/`を付けません。
```json
{
  "hamamatsuya-catch-pierced": {
    "assetId": "ai-solo-hamamatsuya-catch-pierced-v14",
    "path": "images/solo-hamamatsuya-catch-pierced-v14.webp",
    "width": 1254,
    "height": 1254,
    "preserveRatio": true,
    "alt": {
      "en": "AI image of one diamond-shaped wooden earring front with cream and brown geometric inlay.",
      "ja": "菱形の木の飾りに白茶の幾何学模様を配したピアス正面のAIイメージ。"
    }
  }
}
```

`width / height`は実ファイルの寸法、`alt`は画像に実際に見える内容の日英の読み上げ用説明です。画像下の注記（caption）は部品が「AIイメージ / AI image」と表示します。
`docs/assets.json`側の`source`は`public/images/...`。権利の根拠・生成記録・状態を揃え、AI図の`productImage: false`を写真扱いに変えません。
単体図は旧`image-generation-solo-v14.json`と新`image-generation-solo-v16.json`の`images`を併読し、`productId / publicPath / sha256`などと実bytesも照合されます。共通readerは[scripts/lib/image-generation-manifests.mjs](../scripts/lib/image-generation-manifests.mjs)で、ログを跨ぐ商品ID重複を拒否します。対応表だけ直しても通りません。
生成記録には実prompt・参照・原本PNG・変換・確認を残します。記録ファイルを新設する場合は検査側の参照先も合わせ、旧履歴を別画像の記録に書き換えません。

0.16では人物用`image-generation-v16.json`と単体用`image-generation-solo-v16.json`を新設し、それぞれ採用10点を記録しました。新規原本は合計23PNGで、採用20・棄却3。棄却は`rejectedCandidates`に残し、activeな画像対応表へ混ぜません。人物ログと単体ログを取り違えず、旧v14の画像例・履歴はそのまま保持します。PNG原本は別資料で、通常buildは同梱WebPとdocsの記録を使います。
WebPへ変換しても原本PNGを保管し、AI由来のIPTC XMPを維持します。旧生成の経緯は[当時の画像方針](image-plan-v13.md)・[単体図記録](image-generation-solo-v14.json)、現在の人物設定は023ガイドへ。
公式写真は、URLがあるだけでは転載できません。許諾なしの保存・掲載・ホットリンクを避け、AI図を実物写真・寸法・金具・販売数量の証拠にしません。

## 8. 商品順・地域・種類別の代表を変える

商品の編集順は`selection.ts → catalogProductIds`の並びです。未記載の商品は後方に回り、同順位は元台帳の順です。
`heroProductId`はトップの大きな紹介、`featuredProductIds`も公開商品だけを参照します。価格や商品本文をここへ複製しません。
地域一覧の代表は`region-selection.ts → regionalRepresentatives`が優先され、指定がない場合はその地域の公開商品から選ばれます。
一方、地域内の種類行とホームの種類画像は[type-choices.ts](../src/lib/type-choices.ts)で選びます。
公開済み・該当種別・地域行なら該当都道府県、という条件を満たす商品の**編集順の先頭**が代表です。独立した手動画像リストはありません。
したがって商品順や所属を変えると、種類の代表画像も変わります。画像は単体用対応表から読み、件数・国内価格帯は同じ候補集合から計算します。
ホームの5種類の表示名・順は[index.astro](../src/pages/[lang]/index.astro)の`kinds`、地域行は[RegionalChoiceGuide](../src/components/RegionalChoiceGuide.astro)です。
新しい種別や所属は`catalog.json`と日本語名称に登録してから使います。商品を増やしただけではホームの種類項目は自動追加されません。
観光TOP10は販売人気順ではありません。順位の年・訪問率・一次資料は[地域設定](../src/config/region-selection.ts)と[調査記録](research/tourism-top10-v9.json)を組で更新します。

### 継承する022のホームHero・一覧地図を更新する

ホーム先頭のHeroとは別に、産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県の順です。47県のCC0原形を主図46＋沖縄別枠1へ分け、実商品/産地本文がある掲載24県だけを通常リンクにします。沖縄は島path・枠・labelを押せる拡大表示とし、県のclick/tap/Enterで産地の商品一覧へ直接進みます。pointerenter/focus/selectの代表単体画像/商品/国内参考価格preview、100/150/200/300%のzoom・内部scroll・全体表示、地方別の初期closed details・地図ジャンプ・JSなしのhrefを継承します。外枠/主図/沖縄枠の設計値と実測は最新022の説明で区別します。

日本地図はsrc/data/japan-map-geometry.json（CC0出典/47県形状）、src/config/japan-map.ts（地方とDISCOVER3県）、JapanJewelryMap.astro（native直接リンク・代表preview・ローカルzoom）。店舗の地図はmap-preferences.ts（30日/版/最小値検証）、map-preferences-client.ts（全表示/全停止）、MapPreferences.astro（Privacyの設定UI）へ分離します。商品価格や画像URLを地理JSONへ複製せず、未掲載県へ空URLを作りません。小さな県形状そのものを44pxとは呼ばず、select/地方別リンクを代替にします。[旧版の出典と加工](japan-map-v17.md)を保持し、[現在の直接選択](japan-map-direct-v18.md)を確認してください。県のclickをpreventDefaultで横取りしてpreviewだけに戻さず、href/Enter/修飾clickの通常動作を維持します。小さな県は拡大後に実際の形状内を選べるか確認し、地図内のoverflowとページ全体の横はみ出しを区別します。022の地図更新では新bitmapを生成していません。023の人物画像更新は別に記録します。

ホーム先頭は[RegionHero.astro](../src/components/RegionHero.astro)、一覧地図は[JapanJewelryMap.astro](../src/components/JapanJewelryMap.astro)、TOP10＋DISCOVER共通の行/画像寸法（PC300×200px・スマホ222×148px）は[RegionSelection.astro](../src/components/RegionSelection.astro)です。Heroでclickを選択として扱う処理を、直接遷移する一覧地図へコピーしません。Heroの24県の小さな商品カードは共通MarketPriceでserver生成し、選択県だけを表示します。画像figureのasset/preserveRatio・imgのsrc/alt/寸法と、表示中カードのURL/title/価格metadata/単位/産地CTAを揃えます。

## 9. 店舗とGoogleマップを更新する

`visits.json → stores`が店舗、`products`が商品との対応です。店名・住所などの文章は`{"ja":"…","en":"…"}`の形です。
店舗は`id / officialUrl / officialStoreUrl / name / address / kind / visitSummary / stockNote / mapQuery / sourceIds / checkedAt`を記録し、`hours / closedDays / access`は未確認なら`null`。
商品側は`productId / storeIds / officialHomeUrl / officialHomeRole / sourceIds / fallback / checkedAt`。`officialHomeRole`は`maker`または`retailer`で、URLがないときは両方`null`です。
店舗未確認は`storeIds: []`と日英の正直な`fallback`を使います。所在地だけから訪問・販売可能とは書きません。
浜松屋の店舗例は上記の`hamamatsuya-hatajuku-main`。店舗の存在と、その商品の現物・柄・在庫は別に確認します。
`mapQuery`は外部Googleマップ検索と経路案内の検索語です。埋込みは[store-map-embeds.ts](../src/lib/store-map-embeds.ts)の店舗ID別`ja / en`へ、Google公式の共有機能で取得・確認したURLを置きます。
埋込みURLや`pb`を推測で組み立てず、[URL制限](../src/lib/map-embed-url.ts)・[地図の確認記録](research/inline-maps-v14.json)も合わせます。
Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。

provider/目的/条件を変える場合はmap-preferences.tsの版と日英説明を更新して再選択させます。30日は法定期限とは説明しません。未選択→許可→別商品/言語/再読込→全撤回、拒否/旧版/不正/期限/保存不可/複数タブを確認。旧「再読込off/Storageなし」の期待を流用しません。

## 10. 広告・運営者・連絡先は事実どおりに

[日本地図の直接選択](japan-map-direct-v18.md)・[残タスク](remaining-task-audit-v17.md)・[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)を参照。対応ホスト向けpublic/_headersは移行準備です。現GitHub PagesのHTTPヘッダーを設定済みとはせず、実契約/本人情報/広告実ID・CMP/ドメイン・DNS/アカウント管理/検索実績を技術PASSで完了化しません。AdSense off・実提携未申請/通常URLを維持します。

運営者はSORAです。Contact・会員登録・販売決済・ブログを追加する前提にはしません。未提供の氏名・連絡先も作りません。
提携は`programs`と個別`links`の両方が承認済みで、実URL・許可ホスト・確認日が揃うときだけ広告化します。`not_applied`を仮に`approved`へ変えません。
現状の[広告Privacy設定](../src/data/advertising-privacy.json)は`mode: "off"`です。環境変数だけで配信開始できる実装ではありません。
AdSenseの実アカウント・認定CMP・ホスト適合・Privacy/CSP・配信確認は別の作業です。合格や法令適合を断定せず、[申請前の残作業](pre-application-checklist.md)と[広告運用](affiliate-operations.md)を確認します。

## 11. 編集後に確かめる

Node.js 24.22.3以上、pnpm 11.25.0を使います。初回は`pnpm install --frozen-lockfile`、手元で見るときは`pnpm dev`です。
内容・データ・画像を変えたら、基本は`pnpm verify`。エラーを無視して公開せず、どのファイル・参照IDが原因かを直します。
本番生成後はpreviewを起動し、表示URLのoriginだけ（例：http://127.0.0.1:4323）を`CHECK_BASE_URL`へ指定します。repo名のpathは付けず、別ターミナルにもbuildと同じ`PUBLIC_BASE_PATH`を設定します。具体例は[setup](setup.md)を参照してください。
商品追加や価格変更は影響範囲に応じて`pnpm check:quality`・`pnpm check:prices`・`pnpm check:browser`、本文の比較は`pnpm check:copy`も対象です。
出典は`pnpm check:sources`、スマホは`pnpm check:mobile`、Q&A/Privacy/単体図は`pnpm check:depth`。全国地図は`node scripts/check-japan-map.mjs`、地図設定は`node scripts/check-map-preferences.mjs`、実Google表示は`node scripts/check-inline-maps.mjs`を使います。
過去の結果は上書きせず、各scriptのreport/prefix指定を確認して別名に保存します。検査の選択は[検証ガイド](verification-guide.md)、起動・公開設定は[setup](setup.md)を使ってください。

- 日英を切り替えて同じページ・絞込・位置へ戻れるか。
- 320px・390px・PCで、長い見出し・画像全体・価格・件数・AI表示が読めるか。
- 種類/地域リンクの絞込結果、0件、解除、価格順、戻る操作が正しいか。
- 出典を開く／閉じる、キーボードのフォーカス、スマホのメニューとタップが使えるか。
- 新しい広告・外部通信・Cookie等を意図せず追加していないか。

公開はGitHubへのpush後のActions成功と、実際の公開URLの表示まで確認します。`build`成功だけで公開済みとは書きません。
最後に変更ファイル・確認した公式情報・実行した検査結果・残作業を引継ぎへ残し、全ソースの書出しも更新します。


### 022の固定高と地図枠を修正する場所

Hero写真はRegionHero.astroのheight:auto/元比率を保ち、固定高の親やcaption前後の帯も測ります。一覧地図の外枠/主図/沖縄独立枠はJapanJewelryMap.astro、設計値は[022ガイド](compact-layout-v20.md)へ集約。Heroの画像選択と一覧のnative直接遷移を混ぜず、TOP10/DISCOVER300×200/222×148は021の共通styleを継承します。


## 日本人女性の人物画像023

0.18.0の人物生成/編集・監査・退役と検証の方針は[023ガイド](japanese-model-styling-v21.md)・[仕様と検証](../specs/023-japanese-model-styling/)を確認します。新規22枚の生成/採用/公開と全source ZIPの照合は完了し、最終件数・app/Actions・集合/全SHAはdeployment-resultsと外部proofが正本です。旧生成logのUS/UK等は歴史として残し、現在のactive registryに対応する生成設定だけを監査します。023の新画像を、旧022の241/77/92や旧「全画像不変」の成功へ加算しません。
