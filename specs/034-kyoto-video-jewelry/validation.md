# 034 検証記録

2026-11-24（JST）。公開投稿はTikTokのプロフィールから照合し、購入案内は販売元の該当商品ページ・公式カタログを読み取りました。

## 京都の公開投稿

| 商品 | 公開投稿 |
| --- | --- |
| 染工房正茂 × Sextile 孔雀 友禅イヤリング | [TikTok](https://www.tiktok.com/@soracraftdiary/video/7711364046796246293) |
| 錺之 はなびし 銅のピアス | [TikTok](https://www.tiktok.com/@soracraftdiary/video/7711291846185536820) |
| 中嶋象嵌 ナシ型 桜・ラインドット ペンダント | [TikTok](https://www.tiktok.com/@soracraftdiary/video/7711182232009854229) |
| Morphosphere tint 群青パンジーピアス | [TikTok](https://www.tiktok.com/@soracraftdiary/video/7711148913276849429) |

公開プロフィールの15投稿のうち、商品との対応が取れた14投稿から11商品へ案内します。マイルストーン投稿は商品を特定できる情報がありませんでした。照合の範囲は公開一覧のキャプションとサムネイルです。Instagramの個別投稿との照合は確認待ちです。 [公開プロフィール](https://www.tiktok.com/@soracraftdiary) · [照合台帳](../../docs/video/tiktok-publication-registry.json)

## 神奈川の購入案内

| 商品 | 公式の国内価格 | 確認した購入経路と選択項目 |
| --- | --- | --- |
| 浜松屋 キャッチ付ピアス | 3,500円 | カタログのサージカルステンレス表記と、本店の案内。 [公式カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory_2.html) |
| 浜松屋 イヤリング | 2,500円 | カタログの「イヤリング」欄と、本店の案内。 [公式カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory_2.html) |
| 浜松屋 無垢寄木ペンダント | 3,500円 | カタログの「ペンダント」欄と、本店の案内。 [公式カタログ](https://www.hamamatsuya.co.jp/item/muku/accessory.html) |
| 陽雅堂 ブローチ 椿 | 7,500円（税込） | 商品コード `wb0003` と通販の数量欄。 [公式通販](https://shop.yogado.jp/item/detail/wb0003.html) |
| 陽雅堂 ブローチ もみじ | 7,500円（税込） | 商品コード `wb0030` と通販の数量欄。 [公式通販](https://shop.yogado.jp/item/detail/wb0030.html) |
| 陽雅堂 ペンダント 椿 | 8,500円（税込） | 商品コード `wp0006` と通販の数量欄。 [公式通販](https://shop.yogado.jp/item/detail/wp0006.html) |
| Dahliacyan 透かし彫りのブレスレット（インカローズ） | 47,300円 | 商品番号 `164454644`、シルバー950・天然インカローズ、丸いリングで調整する金具、国内向けの購入欄。ラッピングが選べます。 [公式通販](https://dahliacyan.thebase.in/items/164454644) |

7商品の価格と公式リンクを照合し、確認日を更新しました。浜松屋はカタログ掲載価格で、本店は箱根町畑宿138、最寄りは本陣跡です。個別商品の在庫・税込区分・販売単位は取扱店で確認が必要です。陽雅堂は通販と実店舗で在庫を共有します。Dahliacyanは一点物の取り扱いです。 [浜松屋の店舗案内](https://www.hamamatsuya.co.jp/info/index.html)

## 本番設定での検証

- `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が成功。単体テスト152件、生成HTML400ページ、正規URL384件を確認しました。
- 日英の動画カードと対応する詳細ページ22件、神奈川の購入案内14ページを検証しました。商品情報、販売元リンク、公開画像136点、サイトマップをv0.23.0と照合し、購入と出典・店舗の確認日を更新しました。
- Linux上のWebKit 26.5で、iPhone 15相当の縦393×659・横734×343を使いました。日英×縦横の4ケースで、媒体指定とハッシュを保つ言語切替、京都の商品詳細、戻る操作、陽雅堂の購入先、浜松屋の取扱店、固定購入欄を確認しました。各外部リンクを開くテストでは、新しいタブの行き先を照合しました。
- 神奈川7商品の価格・確認日・購入経路・公式リンクを日英14ケースで検証。JavaScript無効の日英2ケースでは静的リンクと遷移先の表示を照合しました。最初の画像寸法検査は、遅延読み込みの画像をスクロール後にデコードしてから測るよう修正しました。JavaScript無効での自動スクロールは安定待ちで止まったため、リンク先を直接開いて表示を確認しました。
- 実機iPhoneのSafariとSNSのアプリ内ブラウザーでの操作は確認待ちです。

## 公開後の検証

- v0.23.1（アプリ `803c42ad59b6e73969c669ffb60814e73cfbc7e8`）のビルドとGitHub Pagesへの配信は、2026-11-24 01:22（JST）に成功しました。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45215657620)
- 日英プロフィール6応答（媒体クエリ付き4応答を含む）、日英の商品詳細22ページ、京都の着用画像4点、サイトマップとrobots.txtの計34応答はHTTP 200で、ローカルの本番生成物とSHA-256が一致しました。 [生成ファイル一覧](../../docs/kyoto-video-jewelry-v34-build-manifest.json) · [公開記録](../../docs/deployment-results.json)
