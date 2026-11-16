# 名称・検索公開・URL移行

2026-11-16。ユーザー依頼によりITOからJapanese Craft Jewelryへ。説明的な英語名で対象を伝え、各ページは商品/技法/選択目的に応じたtitle/descriptionを持つ。全国の工芸ジュエリーを扱い、神奈川だけの名前にしない。GitHubのユーザー名rozawa619は変更せず、既存repoの名前をjapanese-craft-jewelryに変更する。履歴とIssuesを維持し、originとPagesサブパスを揃える。

Google公式[検索の基本](https://developers.google.com/search/docs/essentials)と[title指針](https://developers.google.com/search/docs/appearance/title-link)を確認。検索に使われる自然な語を固有title/見出し/本文へ用いる。名称・URLのキーワードだけで流入や順位が上がるとは扱わない。[サイト名機能](https://developers.google.com/search/docs/appearance/site-names)はドメイン/サブドメイン対象で、GitHub Pagesのプロジェクトsubdirectoryの名前表示は保証できない。

正規URLはhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。publicでindex/follow、両言語canonical/hreflang、sitemap/robotsを生成。404はnoindex。ユーザー指定の公開名SORAを公開責任者としてAboutへ表示し、Issues訂正窓口を維持。Search Console登録・所有確認・クロール/検索掲載の確認は未実施。

[GitHubのrename仕様](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)ではrepo閲覧/clone等は転送される一方、プロジェクトサイトURLの自動転送は対象外。旧/ito-craft/サイトURLが将来使えるとは保証しない。新URLを共有し、旧repo名を別repoへ再利用しない。安定した商品/記事のslugは維持し、現在の資料URLは新baseへ。過去specと実行reportは当時の記録として旧URLのまま保存。

更新：.github/workflows/deploy.ymlのpublic設定を正本としてreadiness→verify→Actions→公開URLを確認。previewへ戻す場合はPUBLIC_PUBLISH_MODE=previewにして公開を更新し、noindexへ変わることを検証。独自ドメインへ移す場合はbase・canonical・hreflang・robots・CSP・問い合わせURL・HTTPSを再確認する。
