# 神奈川シリーズ 動画制作カバレッジ監査（2026-11-22）

GitHubの `src/data/catalog.json`（`publishStatus=published` かつ `prefectureIds` に `kanagawa`）、`src/data/translations/ja.json`、`src/data/editorial-images.json` と `docs/video/production-status.json` を照合。**生成確認とTikTok公開を区別**する。未記録を未制作と断定しない。

## 神奈川県IDを持つ公開商品：全8点

| 商品ID | 商品名 | 動画制作の証拠と状態 |
| --- | --- | --- |
| `hamamatsuya-catch-pierced` | 浜松屋 寄木キャッチ付ピアス | `hakone-yosegi-60s-compilation` に含まれる記述はあるが、個別動画完成・掲載URLを未確認。status unknown |
| `hamamatsuya-clip` | 浜松屋 寄木イヤリング | 同上、個別動画完成・掲載URLを未確認。status unknown |
| `hamamatsuya-pendant` | 浜松屋 無垢寄木ペンダント | 2026-11-22 ユーザー本人が「これ作った」と申告。元の動画・投稿URLは直接確認していない。重複提案しない |
| `yogado-kamakura-bori-camellia-brooch` | 陽雅堂 鎌倉彫ブローチ 椿 | 動画のサンプルフレーム確認済み。音声/全尺・投稿未確認 |
| `yogado-kamakura-bori-maple-brooch` | 陽雅堂 鎌倉彫ブローチ もみじ | 動画のサンプルフレーム確認済み。音声/全尺・投稿未確認 |
| `yogado-kamakura-bori-camellia-pendant` | 陽雅堂 鎌倉彫ペンダント 椿 | 動画のサンプルフレーム確認済み。音声/全尺・投稿未確認 |
| `dahliacyan-openwork-moonstone-earrings` | Dahliacyan 透かし彫りピアス オレンジムーンストーン | 動画のサンプルフレーム確認済み。音声/全尺・投稿未確認 |
| `dahliacyan-openwork-rhodochrosite-bracelet` | Dahliacyan 透かし彫りブレスレット インカローズ | 動画のサンプルフレーム確認済み。音声/全尺・投稿未確認 |

集計：**6点＝制作確認/ユーザー申告あり、2点＝制作の個別確証がない**。TikTokの投稿URLが台帳にないため**公開済みの点数は算出できない**。未確認の2点を勝手に未制作と確定しない。

## 関連する箱根の販売店商品（県IDなし）：公開4点

以下はサイト公開商品だが**`prefectureIds: []`**。神奈川ページで関連販売店として扱われる。個別製造地・作り手未確認につき、「神奈川県産」とは断定しない。

- `maruyama-clip-c`：寄木イヤリング C
- `maruyama-clip-d`：寄木イヤリング D
- `maruyama-pierced-c`：寄木ピアス C
- `maruyama-pierced-d`：寄木ピアス D

`maruyama-clip-d` は **Flowプロンプト準備済み**だが、動画生成・投稿未確認。他3点は今回確認した動画制作台帳にはエピソード未登録。

## 今後の重複回避

1. **まず8点の個別動画制作状況を確認**：箱根の浜松屋のピアス・イヤリングの2点。既存の素材とまとめ動画に含まれていたら「済み」に記録し、二重制作しない。
2. **公開状況は別管理**：ユーザーがTikTok URLを共有した場合に `published` とする。台帳の`generated_unreviewed`を公開済みと読み替えない。
3. 神奈川の地域シリーズを継続する場合、**関連販売店の4点は別枠**。神奈川県で製造した商品と混同しない。
4. 8点が一巡しているなら、サイトへ**新しい神奈川商品と対応する女性画像**を追加してから動画化する。サイト未掲載品の勝手な提案はしない。
