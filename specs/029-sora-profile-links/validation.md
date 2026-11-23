# 029 検証記録

対象は日英のSORAプロフィールページ、特集商品と既存産地への導線、着用画像、SEOメタデータです。公開版の情報は[公開記録](../../docs/deployment-results.json)を参照します。

## 公開前

- 本番設定で `pnpm readiness`、`pnpm verify`、`pnpm check:seo`、`pnpm check:docs` が成功。単体テスト149件、HTML396ページ、正規URL380件を確認。新しい日英のSORAページを正規URLとサイトマップに追加。
- Chromiumで日英・幅320／390／768／1440pxの8ケースと、JavaScriptをオフにした幅390pxの日英2ケースが成功。主リンクの表示位置、商品詳細・京都への遷移、神奈川のURL、日英切替、横スクロール、外部通信の有無を確認した。JavaScriptが有効な場合は日英切替で媒体のクエリを保持する。
- 群青パンジーピアスの登録画像・日英alt・AI表記を確認。画像の表示比率が元の比率と一致した。商品カタログ、画像、出典に差分がないことを確認した。実機Safariでの検査は未実施。

## 公開後

- アプリ `c9537cf6b40135001c6fdb9bb05700f33a156399` のビルドとPagesへのデプロイが成功しました。公開日は2026-11-23（日本時間）です。 [GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45036494669)
- 公開時に日英のSORAページ、TikTok用・Instagram用のURL、日英の商品・産地ページ、登録画像、サイトマップの計12件がHTTP 200を返し、生成物とバイト単位で一致しました。
- 作業環境から[0.21.0の生成ファイル一覧](../../docs/sora-profile-v29-build-manifest.json)を復旧し、本番設定の生成物541件（HTML396ページ・WebP136点を含む）のファイル名、サイズ、SHA-256を全件照合しました。公開URL12件の応答も同じ記録に照合しました。
