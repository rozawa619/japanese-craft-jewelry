# 039 掲載が2点だった県の拡充を検証

対象はv0.28.0。検証日は2026年11月24日（JST）。

| 要件 | 結果 |
| --- | --- |
| 全国の掲載数 | 36県に各1点。47都道府県すべてで3点以上、全171商品。追加はブレスレット3点、ブローチ1点、イヤリング1点、ネックレス・ペンダント21点、ピアス1点、リング9点。訪日旅行先Top10の県は各5点以上。 |
| 公式通販と現地 | 36商品の注文ページを照合し、公開前の再取得で全商品ページがHTTP 200、国内表示価格が一致。28商品に県内の取扱店・訪問先を掲載。店頭の個別在庫や納期は商品の注意書きを参照。 [商品ごとの確認結果](../../docs/research/three-per-prefecture-2026-11-24.md) |
| 画像 | 着用と単体の72枚を目視し、日英のAI表示、alt、寸法、アセットのハッシュを照合。既存の268枚はSHA-256が一致。 [着用イメージ](../../docs/image-generation-styling-v39.json) · [単体イメージ](../../docs/image-generation-solo-v39.json) |
| 本番ビルド | `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` を実行。ユニット155件、HTML892ページ、canonical 876件。内部リンク、構造化データ、通常購入リンク、広告プライバシーを検査。 |
| スマートフォン幅 | 320・390pxのChromeで追加商品を日英計144件確認。価格、仕様、公式リンク、開閉できる出典一覧、両画像、店舗と経路を検査。 |
| 旅先検索 | 全国の都道府県表示と既存導線を `pnpm check:travel` で125件検査。新規商品に紐づく訪問エリアから商品詳細までの操作を日英計56件確認。 |

## 配信後の確認

| 項目 | 結果 |
| --- | --- |
| GitHub Pages | 2026-11-24 16:44 JST。アプリのコミット `630b81601c7efa63c1505d19a557c7b47fa43da8`。 [Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45350117793) |
| 公開応答 | トップ、追加商品、産地、技法、画像、robots.txt、サイトマップの292レスポンスがHTTP 200。公開データのSHA-256とローカル本番ビルドを照合。 [結果](../../docs/three-per-prefecture-v39-build-manifest.json) |
| 公開スマホ表示 | WebKitの390pxエミュレーションで商品詳細を日英計72件、訪問エリアからの操作を56件検査。実機のiPhoneは未検証。 [結果](../../docs/three-per-prefecture-v39-hosted-mobile-results.json) |

通販の確認は、公開の価格、注文フォーム、在庫表示、選択肢まで行った。注文・決済・店舗への連絡は実施していない。一部の販売サイトにブラウザー経路による403があったため、同じ公式URLを再取得し、商品情報、在庫表示、注文リンクを照合した。

公開WebKit検査の初回に、埼玉の英語ページでGitHub Pagesのエラー画面が1回表示された。同じURLを再取得し、HTTP 200とビルド出力の一致を確認した。新しいWebKitのセッションで埼玉の商品詳細を日英とも再検査し、両方で通過した。

[公開サイト日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [引継ぎ](../../START_HERE.md)
