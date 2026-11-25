# 041 商品画像の見直しを検証

対象はv0.29.1の着用5枚と単体1枚。2026年11月25日（JST）に確認。 [仕様041](spec.md)

| 検証項目 | ローカル結果 |
| --- | --- |
| 目視 | 手首・指とバングルの接点、耳たぶとイヤリングの接点、頭頂と手の余白を拡大して確認。単体図の上下端は布地でつながり、中央のブレスレットは見比べて保持を確認した。 [着用の記録](../../docs/image-generation-styling-v41.json) · [単体の記録](../../docs/image-generation-solo-v41.json) |
| 画像と保全 | 表示用350枚（着用174・単体176）のうち344枚が前版とSHA-256一致。入れ替えた6枚は元比率・日英alt・AIメタデータ・配信ビルドのハッシュを照合。退役42枚はビルドから除外。京都の動画原本1枚は同一バイトで保護し、全922 HTMLに旧6枚への参照がないことを確認 |
| 商品と公開設定 | 176点・47都道府県（東京10点）。商品、価格、出典、購入リンク、動画資料、公開・広告設定に差分なし |
| 通常ビルドと静的検査 | `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が通過。ユニット157件、HTML922件、canonical 906件 |
| 表示 | WebKitの320・390・1440pxで日英の商品詳細36件・産地一覧30件。新画像、AI表示、日英alt、縦横比と横はみ出しの有無を確認 |

ローカルWebKitの開始時に検査とHTTPサーバーを別セッションで起動したため接続できなかった。同一セッションでサーバーの応答を確認してから再実行した。 [ローカル表示検査](../../docs/image-quality-v41-local-webkit-results.json)

## 配信後の確認

| 項目 | 結果 |
| --- | --- |
| GitHub Pages | 2026-11-25 20:16 JST。アプリのコミット `9beec4463e7447b86861bc4cd575569549606f3b`。 [Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45602653433) |
| 実URL | 修正画像6枚、京都の動画原本、更新ページを含む59件がHTTP 200でローカル出力とSHA-256一致。旧5画像URLの404、動画原本のGitHub URLのSHA-256一致も確認。 [出力台帳](../../docs/image-quality-v41-build-manifest.json) |
| 公開WebKit | 390pxで日英の商品詳細12件・産地一覧10件を確認。実機iPhone／Safariは未検証。 [公開表示検査](../../docs/image-quality-v41-hosted-webkit-results.json) |

[公開記録](../../docs/deployment-results.json) · [サイトの引継ぎ](../../docs/SITE_NEW_CHAT_HANDOFF.md)
