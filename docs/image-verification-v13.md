# 0.13 画像検証と保守

この文書は画像の管理・表示を検査する手順と実測記録である。生成画像から国籍・年齢・品質や商品実物との一致を自動認定しない。米国・英国・日本という設定とかわいい系/美人系の方向性は生成プロンプトの計画として記録し、公開UIの人物分類には使わない。

## 画像を追加・変更する場所

- `src/data/editorial-images.json` は安定した商品IDから表示画像への対応。`assetId`、`path`、実寸の `width` / `height`、日英の `alt` を持つ。顔・耳・首・手首・指まで含む構図を保つため、今回の全50商品は `preserveRatio: true` を付ける。
- `docs/assets.json` は権利・生成根拠の台帳。表示中の画像は `status: active`、`productImage: false` とし、`source` を `public/` 以下のファイルと一致させる。生成記録は `docs/image-generation.json` と個別のプロンプト記録を参照する。
- `public/images/` は配信用のローカル画像。`catalog.products[].imageAssetIds` は実物写真のための欄で、AI着用イメージを入れない。
- `EditorialImage.astro` が画像と常時見える `AIイメージ` / `AI image` を表示する。実物デザインを確認する公式ページへのリンクと画像方針への導線は保持する。

altは `AI styling illustration:`、`AI styling image:` / `AIイメージ：` など、AIであると分かる言葉から始め、画像に見える装いとジュエリーの形・色を簡潔に書く。商品名を並べるだけ、同じ汎用説明、見た目からの国籍推定、実物の仕様・試着済みという断定は避ける。共用ファイルの見た目が同じ場合は同じ説明を共有できる。

## 既存画像を保つ検査

`docs/research/image-baseline-v12.json` は追加前の25画像・27商品について、実寸、バイト数、SHA-256、商品とファイルの対応を凍結した記録。旧画像を再圧縮・上書きせずに追加できたことを検査する。退役10画像は台帳に履歴を残し、生成サイトや公開サイトには配信しない。

`docs/research/existing-image-alt-v13.json` は既存25画像を5枚のQAコンタクトシートで目視した27商品分のalt案。元画像の編集や外部公式写真の取得は行っていない。実際の表示正本は採用後の `src/data/editorial-images.json`。

## 自動検査

1. `node --experimental-strip-types --test tests/editorial-images.test.ts` — 公開範囲・パス・画像台帳・実寸メタデータ・日英alt・意図的な共用ファイルの整合性を、独立した不正データ例で検査する。
2. `node --experimental-strip-types scripts/check-editorial-images.mjs --dist` — 全公開商品と画像登録の完全一致、実ファイルの形式・寸法・バイト数、台帳、旧25画像のSHA保持、生成サイトとの同一バイト、退役画像非配信を検査する。500KB超はサイズ確認の警告で、誤って形式エラーと扱わない。既定レポートは `docs/visual-seo-stage-image-files-results.json`。
3. `node scripts/check-image-display.mjs` — 固定した入力に対し、全50商品詳細を日英・幅1440/390/320で開き、ローカル画像のデコード・実寸・alt・短いAI表示・公式画像確認リンク・横スクロールを確認する。ホーム・商品一覧・産地一覧の画像枠も同じ6組で検査する。`preserveRatio` はCSS設定の文字列だけでなく実際の画像枠の比率から確認する。新画像の英語商品詳細をPC/320pxで撮影し、選択テンプレートのaxeも実行する。既定レポートは `docs/visual-seo-stage-image-browser-results.json`、証跡は `artifacts/visual-seo-stage-images-*.png`。
4. 既存の `check-bilingual.mjs` / `check-quality-expansion.mjs` にも表示画像検査を組み込み、既存の操作・内容検査を維持する。`check-hosted-release.mjs` は公開URLの画像HTTP応答・MIME・SHAをローカルと照合する。
5. `node scripts/capture-image-layout.mjs` — 日英・3幅のホーム、旧画像/新画像が並ぶ一覧、産地代表（ENは新画像の福岡、JAは旧画像の東京）の18配置を撮影する。可視画像のロード・decodeとfontを待ってから撮影し、画像確認前の空枠を視覚証跡にしない。撮影は審美的な合格を自動判定しない。`CHECK_IMAGE_LAYOUT_REPORT_PATH` でレポート先を変えられる。

ブラウザのURLは `.env` の `PUBLIC_BASE_PATH` と `CHECK_BASE_URL` で指定する。レポート先を変える場合、画像ファイル検査は `CHECK_IMAGE_REPORT_PATH`、画像ブラウザ検査は `CHECK_IMAGE_BROWSER_REPORT_PATH`、スクリーンショットは `CHECK_SCREENSHOT_PREFIX` を使う。旧版の証跡を上書きせず `visual-seo-stage` 接頭辞を保つ。公開確認もローカルとは別名へ保存する。

## 実測記録

| 検査 | 状態 | 根拠 |
| --- | --- | --- |
| 画像メタデータの独立ケース | PASS・6/6 | `tests/editorial-images.test.ts` を実行 |
| 既存画像の目視 | 25/25確認 | `artifacts/visual-seo-stage-original-sheet-1.png` 〜 `-5.png`、27商品分の個別alt案 |
| 追加前ファイル検査 | 既存25ファイルPASS・未登録23件は想定どおり未完了 | `artifacts/visual-seo-stage-initial-image-files.json`。旧25のSHA保持を確認。これは完成版の検証結果ではない |
| 完成版ファイル検査 | PASS・49/49 | `docs/visual-seo-stage-image-files-results.json`。50商品・48 WebP、旧25のSHA保持、退役10画像の生成サイトからの除外、警告0。合計4,160,080 bytes |
| 最終版ローカルのPC/スマホ表示 | PASS・320/320 | `docs/visual-seo-stage-image-browser-results.json`。`http://127.0.0.1:4322/japanese-craft-jewelry/`、日英×1440/390/320、全300商品詳細＋18テンプレート、858画像枠。axe30画面0違反、console/page error0、入力hash不変 |
| 新23画像の視覚確認 | 23/23確認 | `artifacts/visual-seo-stage-new-original-sheet-1.png` 〜 `-5.png`。顔・耳・首・手首・指とジュエリーに大きな見切れや目立つ破綻を認めなかった |
| 新画像のPC/320px実表示 | 46/46確認 | `artifacts/visual-seo-stage-detail-pairs-sheet-1.png` 〜 `-5.png`。最終版で再撮影した46枚は、視覚確認済み46枚と全てSHA一致。`docs/visual-seo-stage-image-screenshot-comparison.json` |
| 新旧画像のホーム/一覧/産地配置 | 18/18確認 | `docs/visual-seo-stage-image-layout-results.json` と `artifacts/visual-seo-stage-layout-*.png`。旧画像の顔端crop解消、画像比率・caption・配置を確認 |
| 公開サイトの画像 | 公開後に実行 | 公開URLのHTTP・MIME・SHAと表示を確認 |

視覚確認では画像を開き、顔やアクセサリーが大きく切れていないか、手指などに目立つ破綻がないか、元の生成意図と大きく違わないかを確認する。今回の視覚確認はCodexによる画像観察で、人物の属性を推定する評価は行っていない。検査の合格は画像の正確な商品再現、人物の実在、着用経験、公式写真の許諾を意味しない。

## 最終表示の調整

初回の画像表示検査は320/320 PASSだったが、追加の配置確認で旧画像の一部が従来の縦長カードに切り取られ、顔の端が大きく欠けることを確認した。旧25ファイルのバイト列を保ち、全50商品の表示設定を元比率保持に統一した。初回のレポートと46撮影は `visual-seo-stage-pre-polish-*` に分離し、最終版を再ビルド・再検証した。新23画像の生成品質の観察結果はそのまま保持し、最終PC/320pxの46撮影を作り直した。46枚とも視覚確認済みの撮影とSHAが一致した。

追加配置18枚は `artifacts/visual-seo-stage-layout-*.png` と `docs/visual-seo-stage-image-layout-results.json`。全画像を元比率にした最終版で、ホーム、一覧、旧東京/新福岡代表を日英・幅1440/390/320で開き、顔・ジュエリーの大きな見切れ、横方向のはみ出し、AI captionの欠けがないことを確認した。一覧で旧画像と新画像の表示比率も揃った。
