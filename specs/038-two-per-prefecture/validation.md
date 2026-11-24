# 038 全国の掲載拡充の検証

対象はv0.27.0。検証日は2026-11-24（JST）。

| 要件 | 結果 |
| --- | --- |
| R1 公開集合 | 26県に各1点を追加し、47都道府県すべて各2点以上、公開135商品。県の公開条件と日英の一覧を照合。追加はネックレス・ペンダント15点、リング4点、耳飾り5点、ブローチ2点 |
| R2 購入と訪問 | 26商品の個別販売ページで、色・号数などの仕様、表示価格、在庫や注文受付を照合。公開直前の再取得は全件HTTP 200・価格一致。15点に県内の取扱店・訪問先、残りは公式注文と事前の取扱確認を案内。 [一次情報](../../docs/research/two-per-prefecture-2026-11-24.md) |
| R3 画像 | 着用26枚・単体26枚を目視し、色・形・日英のAI表示を確認。寸法、alt、画像台帳のハッシュも照合。前版で公開した216枚のWebPはSHA-256が一致。 [着用](../../docs/image-generation-styling-v38.json) · [単体](../../docs/image-generation-solo-v38.json) |
| R4 日英詳細 | 320・390pxのChromeで新規の商品ページを日英104件検査。価格、選択名、公式リンク、折りたたんだ出典と日付、画像、訪問案内を確認 |
| R5 公開と導線 | `pnpm verify`、`pnpm check:seo`、`pnpm readiness`、`pnpm check:docs` が成功。ユニット155件、HTML740ページ、canonical 724件。内部リンクと広告状態を確認。`pnpm check:travel` 87件。新規訪問エリアの操作は日英16件 |

## 配信後の実測

| 項目 | 結果 |
| --- | --- |
| 配信 | 2026-11-24 15:44 JST。アプリのコミット `f9347ebecba8c883b744d0fe806479200948b90c`。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45342607862) |
| 公開応答 | 日英の商品、産地、技法、画像、トップ、robots.txt、サイトマップの212レスポンスでHTTP 200とビルド出力のSHA-256一致。 [照合記録](../../docs/two-per-prefecture-v38-build-manifest.json) |
| スマホ幅 | Playwright WebKit 390pxで日英52の商品詳細検査と、新しい訪問エリアからの16経路を確認。実機iPhoneの確認は未実施。 [操作記録](../../docs/two-per-prefecture-v38-hosted-mobile-results.json) |
| 地図 | 霧島の作り手が公開する地図を既存の許可画面に追加。許可前は第三者への通信を止め、許可・停止の動作は隔離した地図応答で検査 |

個別仕様の店頭在庫・取り寄せ納期・販売価格は変動する。販売元確認は公開ページと注文欄まで実施し、注文、決済や店舗への連絡は行っていない。

中間検査で国内のみの配送を表す新規データが既存の許可値と一致しなかったため、既存の配送ステータスと国内案内に合わせて修正し、本検査を再実行した。

[日英の公開サイト・日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [英語](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [引継ぎ](../../START_HERE.md)
