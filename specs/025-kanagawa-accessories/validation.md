# 025 検証記録

2026-11-19。公開コミット `98d25ce1aa16dc82d4578626e9d06d451e172ed8` は[GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44525574136)でビルド・公開ともに成功。

| 検証 | 結果 |
| --- | --- |
| 公式ページ | 追加5点の販売ページ、注文ボタン、仕様・価格、店舗の公式案内を確認 |
| 型・単体 | Astro型チェック153ファイルでエラー0、単体テスト149件成功 |
| 公開ビルド | 362 HTML、リンク・アンカー、346 canonicalページと日英SEOを検証 |
| 公開画面 | 神奈川の日英ページで追加5点を確認。ブローチの絞り込みは椿・もみじの2点 |
| 公開ビルドの画像 | 生成物内の追加10枚と従来118枚のSHA-256を照合 |

初回CIで購入ガイドの出典不足を検出して補完しました。続くCIで、売場リストと埋め込み地図を同一に扱っていた検査を確認。陽雅堂は公式埋め込み、Dahliacyanは移転後の公式案内と外部地図を使用します。登録された埋め込みは、引き続き出典のある店舗にだけ紐づきます。

- [日英の神奈川特集](https://rozawa619.github.io/japanese-craft-jewelry/ja/places/kanagawa/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/places/kanagawa/)
- [公開記録](../../docs/deployment-results.json)
- [公開ビルドのファイル一覧・SHA-256](../../docs/kanagawa-v25-build-manifest.json)
