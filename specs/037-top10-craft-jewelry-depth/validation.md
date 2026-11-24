# 037 旅行先Top10の工芸ジュエリー追加の検証

対象はv0.26.0。検証日2026-11-24（JST）。

| 要件 | 実測結果 |
| --- | --- |
| R1 公開集合 | 公開109点、追加16点、47都道府県。掲載数は東京5、大阪5、千葉5、京都7、福岡5、神奈川8、奈良5、山梨5、北海道5、愛知5。岩手・福島・熊本・大分は各2点。掲載1点の県は31から26に減少 |
| R2 購入・店舗 | 追加16商品の公式販売元で確認日時点の注文受付を照合。税込価格、販売単位、仕様と確認日を台帳・画面で確認。11商品に現地店舗案内、5商品に販売元への案内と個別の訪問条件。各商品の店頭在庫は未確認。公開ビルドでは広告リンク0件。 [一次情報](../../docs/research/top10-craft-jewelry-depth-2026-11-24.md) |
| R3 画像 | 着用16枚・商品単体16枚を目視し、公開画像と登録SHA-256・表示寸法・AI表記・日英altを照合。既存公開WebP184枚のSHA-256が前版と一致。 [着用画像](../../docs/image-generation-styling-v37.json) · [単体画像](../../docs/image-generation-solo-v37.json) |
| R4 日英本文 | 追加商品の各言語で価格、選択肢、出典の開閉と日付、公式購入・実物確認リンク、画像、店への地図リンクまたは訪問案内を確認。Chromeの320px・390pxで64件合格 |
| R5 ビルド・導線 | `pnpm verify`（ユニット155件、HTML638ページ、画像・広告プライバシー検査）、`pnpm check:seo`（canonical 622件）、`pnpm readiness`、`pnpm check:docs`が成功。`pnpm check:travel` 53項目。Top10・DISCOVERの当該画面を日英×3画面×3幅で確認し、コンソールの確認を含めて19項目。新規5訪問ルートは各言語で操作 |

## 公開後の確認

| 記録項目 | 実測結果 |
| --- | --- |
| GitHub Pages | 2026-11-24 15:18 JST に配信完了。配信元 `015ad3c91956745b1bdcdf454f751ee01fde7fc3`。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45339284497) |
| 公開レスポンス | 日英の新規商品、関連産地・技法、画像、トップ、sitemap・robotsの118レスポンスがHTTP 200でビルド出力のSHA-256と一致。 [レスポンス照合](../../docs/top10-craft-depth-v37-build-manifest.json) |
| 公開スマホ幅 | Playwright WebKit 390pxで新規16商品を日英で確認し、32件合格。会津若松、ならまち、水門町、戸畑、糸島から商品詳細まで日英10経路を操作。実機iPhoneは未検証。 [公開モバイルの詳細](../../docs/top10-craft-depth-v37-hosted-mobile-results.json) |
| 継続確認 | 個別の実店舗在庫、納期、販売価格は変動する。連絡や注文送信は行っていない。実店舗リンクと許可制地図は動作を確認した。埋め込みの許可・停止は隔離した応答で検証 |

初回の本文検証で、同一の公式URLに過去の確認記録がある場合、ブラウザー検査が先に表示された旧日付を拾った。対象の出典名・URL・確認日を組にして照合するよう修正し、再検証で全件合格した。

[公開サイト・日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/places/) · [公開サイト・英語](https://rozawa619.github.io/japanese-craft-jewelry/en/places/) · [保守引継ぎ](../../START_HERE.md)
