# 033 検証記録

2026-11-22（JST）の[TikTok公開照合台帳](../../docs/video/tiktok-publication-registry.json)にある公開10投稿が対象です。台帳と現行カタログの照合で、神奈川の7商品と、各商品にひも付く現行の着用AI画像7点を確認しました。京都・Instagramの投稿と商品の対応は今回の資料では未確認です。

## 公開前の検証

- 本番設定で `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が成功しました。単体テスト152件、生成HTML400ページ、正規URL384件を確認しました。
- 日英とも同じ7商品を台帳順に表示し、各商品ページに遷移できることを確認しました。京都の特集・旅先のリンク、canonical、hreflang、画像136点のSHA-256をv0.22.2の生成物に照合しました。
- プロフィールのCSSは同一オリジンのファイル1点として生成されました。他の398ページはCSPのインラインスタイル用ハッシュ1件が減った点を除いて一致し、既存のCSSファイルとサイトマップも一致しました。
- ヘッドレスChromiumで26ケースを確認しました。日英の幅320・390・768・1440pxで、冒頭のリンク、画像の元比率、AI表記、TikTok・Instagramのクエリとハッシュを含む日英切替を検査しました。JavaScript無効時の幅320・390pxからも商品ページへ進めました。幅390pxの日英でaxeの違反は0件でした。
- TikTokやInstagramの埋め込みは使わず、表示検証で外部通信は発生しませんでした。実機Safari、各SNSのプロフィール欄の掲載状態、流入実績は未確認です。

## 公開後の検証

- v0.23.0（アプリ `ebdc17aa37c72669a8dc1466af50ae50a8f8f7f6`）のビルドとGitHub Pagesへの配信が、2026-11-23 20:49（JST）に成功しました。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45168502208)
- 日英のプロフィールページ、TikTok・Instagramのクエリ付きURL、掲載した7商品の日英詳細、CSS5点・画像2点・サイトマップとrobots.txtの計29応答がHTTP 200で本番生成物と一致しました。
- Actionsの配信アーカイブのSHA-256と、その中の546ファイルのSHA-256を照合しました。 [生成ファイル一覧](../../docs/sora-video-jewelry-v33-build-manifest.json) · [公開記録](../../docs/deployment-results.json)
