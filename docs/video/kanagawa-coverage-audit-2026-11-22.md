# 神奈川シリーズ 動画制作カバレッジ監査（2026-11-22）

GitHubの `src/data/catalog.json`（`publishStatus=published` かつ `prefectureIds` に `kanagawa`）、`src/data/translations/ja.json`、`src/data/editorial-images.json` と `docs/video/production-status.json` を照合。**生成確認とTikTok公開を区別**する。未記録を未制作と断定しない。

## 神奈川県IDを持つ公開商品：全8点

| 商品ID | 商品名 | 制作・公開の確認状況 |
| --- | --- | --- |
| `hamamatsuya-catch-pierced` | 浜松屋 寄木キャッチ付ピアス | TikTokの公開欄で2本を確認 |
| `hamamatsuya-clip` | 浜松屋 寄木イヤリング | TikTokの公開欄で2本を確認 |
| `hamamatsuya-pendant` | 浜松屋 無垢寄木ペンダント | TikTokの公開欄で2本を確認 |
| `yogado-kamakura-bori-camellia-brooch` | 陽雅堂 鎌倉彫ブローチ 椿 | TikTokの公開欄で1本を確認 |
| `yogado-kamakura-bori-maple-brooch` | 陽雅堂 鎌倉彫ブローチ もみじ | TikTokの公開欄で1本を確認 |
| `yogado-kamakura-bori-camellia-pendant` | 陽雅堂 鎌倉彫ペンダント 椿 | TikTokの公開欄で1本を確認 |
| `dahliacyan-openwork-moonstone-earrings` | Dahliacyan 透かし彫りピアス オレンジムーンストーン | 制作済み。添付動画をサンプルで照合。TikTok投稿URLは未確認 |
| `dahliacyan-openwork-rhodochrosite-bracelet` | Dahliacyan 透かし彫りブレスレット インカローズ | TikTokの公開欄で1本を確認 |

**8商品に制作の記録があります。TikTok公開欄では7商品・10本を確認しました。** 確認範囲はキャプションとサムネイルです。動画の全編・音声と箱根の60秒総集編の完成・公開は未確認です。 [投稿URLと照合記録](tiktok-publication-registry.json)

## 関連する箱根の販売店商品（県IDなし）：公開4点

以下はサイト公開商品だが**`prefectureIds: []`**。神奈川ページで関連販売店として扱われる。個別製造地・作り手未確認につき、「神奈川県産」とは断定しない。

- `maruyama-clip-c`：寄木イヤリング C
- `maruyama-clip-d`：寄木イヤリング D
- `maruyama-pierced-c`：寄木ピアス C
- `maruyama-pierced-d`：寄木ピアス D

`maruyama-clip-d` は **Flowプロンプト準備済み**だが、動画生成・投稿未確認。他3点は今回確認した動画制作台帳にはエピソード未登録。

## 今後の重複回避

1. **次作の重複防止**。8商品の商品IDと女性画像ID・パスを照合し、候補から外す。
2. **投稿URLとエピソードを照合**。同一商品の別カットは、キャプションや衣装・場面から確認できた投稿だけを対象エピソードに紐づける。
3. 神奈川の地域シリーズを継続する場合、**関連販売店の4点は別枠**。神奈川県で製造した商品と混同しない。
4. 8点が一巡しているなら、サイトへ**新しい神奈川商品と対応する女性画像**を追加してから動画化する。サイト未掲載品の勝手な提案はしない。
