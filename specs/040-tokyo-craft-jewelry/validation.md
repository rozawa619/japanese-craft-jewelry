# 040 東京の工芸アクセサリー拡充を検証

対象はv0.29.0。商品の確認は2026年11月24日（JST）。 [一次情報と選定結果](../../docs/research/tokyo-craft-jewelry-2026-11-24.md)

| 検証項目 | ローカル結果 |
| --- | --- |
| 商品と地域 | 東京の公開商品は既存5点と追加5点で10点。全国47都道府県の公開176点、登録182点。既存の商品、出典、購入リンク、画像への参照を比較し、既存公開画像340枚のバイトを照合 |
| 通常ビルドと静的検査 | `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が通過。ユニット155件、HTML922件、canonical 906件 |
| 表示と操作 | WebKitの320・390・1440pxで追加商品の日英詳細30件、東京一覧と松江の旅先検索12件を確認。対象仕様、税込価格、通常リンク、開閉できる出典、AI表示と画像比率を検査。 [結果](../../docs/tokyo-v40-local-webkit-results.json) |
| 画像 | 追加10枚の生成出力を目視し、公式写真を使わずに制作した画像の縦横比、日英alt、AIメタデータ、公開ファイルのハッシュを照合。 [着用](../../docs/image-generation-styling-v40.json)・[単体](../../docs/image-generation-solo-v40.json) |

初回ビルドでは、日本語市場の追加リンクが英語詳細の出典欄に出ないことを検出。日本向けの通常商品URLを日英共通のレコードに修正し、両言語で照合しました。WebKitの初回検査では、遅延読み込み中の画像に対する `decode()` が一部で中断されました。検査を画像の読み込み完了待ちに修正し、画像の実寸と表示比率を含む42件を再実行しました。

## 配信後の確認

| 項目 | 結果 |
| --- | --- |
| GitHub Pages | 2026-11-24 23:07 JST。アプリのコミット `f4153f3bf6b78e8412bb3a47cc7bd8a6cb8d9340`。 [Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45410363699) |
| 実URL | 東京一覧、追加商品の詳細・工芸・作り手、画像、サイトマップ等の52応答がHTTP 200。ローカルビルド1,283ファイルのSHA-256台帳と照合。 [出力記録](../../docs/tokyo-v40-build-manifest.json) |
| 公開WebKit | 390px相当で日英の商品詳細10件、東京一覧・松江からの商品詳細4件を確認。実機iPhone／Safariは未検証。 [結果](../../docs/tokyo-v40-hosted-webkit-results.json) |

公開WebKitの初回検査では、東京一覧のスタイルシート読み込み前に横幅を測っていました。診断ではスタイルシートの適用後に表示幅390pxと文書幅390pxが一致しました。スタイルの適用を待つ条件を追加し、公開14件を再実行しました。

[東京ページ 日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/places/tokyo/) · [Tokyo page English](https://rozawa619.github.io/japanese-craft-jewelry/en/places/tokyo/) · [公開記録](../../docs/deployment-results.json)
