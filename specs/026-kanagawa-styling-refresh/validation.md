# 026 検証記録

2026-11-19。公開コミット `66988d480f1b7ab2267fdb9c8dc5700add6731d9` を[GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44531101682)から公開。

- 既存の商品写真を参照して、着用イメージ5枚の室内背景、ほくろが見えない仕上がり、笑顔、視線、装身具の見え方を目視で確認しました。
- 新しい着用画像はすべて3:2。公開版の2言語10商品ページと神奈川特集の2ページで新しい画像参照を確認しました。
- 公開された新画像5枚のSHA-256が生成記録と一致し、差し替え前5枚の公開URLは404でした。公開ビルドのWebPは128枚で、差し替え対象外の123枚のSHA-256が0.19.0と一致しました。
- [画像生成記録](../../docs/image-generation-styling-v26.json) · [公開ビルドのSHA-256一覧](../../docs/kanagawa-styling-v26-build-manifest.json)
