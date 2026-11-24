# 035 検証記録

2026年11月24日（JST）。GitHub版v0.23.1を起点に、v0.24.0のソースを公開設定で検証しました。

| 要件 | 結果 |
| --- | --- |
| R1 全国掲載 | 47都道府県、登録94商品、掲載88商品。日英で94県ページへアクセスできることを確認 |
| R2 購入根拠 | 未掲載だった19県で品番・選択肢・国内価格・注文受付を確認。兵庫は「ピアス」選択後の24,200円を記録。 [一次情報](../../docs/research/national-listings-2026-11-24.md) |
| R3 画像 | 新規19商品の着用と単体画像、日英のAI表示を検証。既存の登録画像136点は元のパス・バイト列と一致。 [着用画像の生成記録](../../docs/image-generation-styling-v35.json) · [単体画像の記録](../../docs/image-generation-solo-v35.json) |
| R4 旅先検索 | 日英のトップ・産地一覧・商品一覧で県の通常リンクとトップの日本地図を検証。首都圏→神奈川→箱根・鎌倉→商品で実際に遷移 |
| R5 ブラウザー | Chromeの49件が成功。幅320・390・1440pxの日英6条件、JS無効の日英2条件、追加19商品の日英38ページの画像と公式購入リンクを確認 |
| R6 ビルドと引継ぎ | 155テスト、552 HTML、32,256参照、536 canonical。SEO、画像、公開設定、日英の参照整合性の検査に成功 |

実行コマンドは `pnpm verify`、`pnpm check:seo`、`pnpm readiness`、`pnpm check:travel` です。ブラウザーはChromeで画面幅を設定し、店の注文画面では注文の送信を行わず、表示ページとリンク先を確認しました。

## 公開後の確認

2026年11月24日14:04 JSTに、GitHub Pagesでv0.24.0の配信が完了しました。配信元は `a9495260a82bda1a886945dbcfa2286ce26330c9` です。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45330626349) · [公開記録](../../docs/deployment-results.json)

公開サイトの日本語トップから、iPhone 13相当の390×844 CSSピクセル・タッチ有効のChromiumで確認しました。

| 操作 | 結果 |
| --- | --- |
| 首都圏 → 神奈川 → 箱根 | 神奈川ページの箱根欄から[浜松屋の寄木ピアス](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/hamamatsuya-surgical-stainless-pierced-earrings/)の商品詳細へ到達 |
| 首都圏 → 神奈川 → 鎌倉 | 神奈川ページの鎌倉欄から[陽雅堂の椿のブローチ](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/yogado-kamakura-bori-camellia-brooch/)の商品詳細へ到達 |

両方で画像の読み込み、公式商品リンクのURL、横方向にはみ出さないことを確認しました。日英のトップに47都道府県のリンクがあり、言語切替後も選択が保持されます。日本語の通常リンクはJavaScript無効でもキーボードでたどれました。実機のiPhone・Safariでは未検証です。 [公開モバイル検証結果](../../docs/national-travel-v35-hosted-mobile-results.json)

公開URLの47都道府県×2言語の全94ページがHTTP 200を返し、すべてに商品カードが表示されることを確認しました。公開サイトマップには日英各88件の商品詳細が掲載されています。日英のトップ、一覧、神奈川ページ、検証対象の商品詳細、サイトマップ、robots.txtの計14レスポンスをローカルの公開用ビルドとSHA-256で照合しました。 [ビルドと配信内容の照合](../../docs/national-travel-v35-build-manifest.json)

## v0.24.1 スマートフォンの操作改善

v0.24.0の公開サイトでは、トップから旅先検索に直接進むリンクがなく、幅320pxのWebKitで検索欄はページ上端から約1,302pxの位置にありました。また、検索後にJavaScriptで追加される商品リンクにはAstroのスタイルが適用されず、リンクの高さは21 CSS pxでした。

R7の対応として、日英トップの最初の画面に「旅先から探す」リンクを追加しました。検索結果の商品リンクにもスタイルを適用し、44 CSS px以上のタップ範囲を確保しました。2026年11月24日14:18 JSTにv0.24.1を配信しました。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45332290970) · [公開記録](../../docs/deployment-results.json)

| 公開後の確認 | 結果 |
| --- | --- |
| 画面サイズ | iPhone SE相当320×568、iPhone 15相当393×659、横向き852×340 CSS px |
| タップと移動 | 各画面でトップのリンクから旅先検索へ移動し、首都圏 → 神奈川 → 箱根・鎌倉の各エリアの見出しと商品詳細に到達。計6ルートで成功 |
| 表示 | 横はみ出しなし。検索入口と商品リンクの高さは各44 CSS px。商品画像と公式リンクの表示を確認 |
| 検証範囲 | Windows上のPlaywright WebKitで、iPhone相当の画面とタップを検証。iOS標準の選択メニューやSafari本体の操作は実機で未確認 |

公開前に `pnpm verify` の155テスト、`pnpm check:seo` の536正規URL、`pnpm check:travel` の日英49チェックを確認しました。公開後は日英トップとCSS、商品詳細など17レスポンスが公開用ビルドと一致しました。 [公開後のWebKit検証結果](../../docs/national-travel-v35-hosted-webkit-results.json) · [配信ファイルの照合](../../docs/national-travel-v35-mobile-fixes-build-manifest.json)
