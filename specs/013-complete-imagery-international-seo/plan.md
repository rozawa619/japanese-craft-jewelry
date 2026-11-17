# 設計

1. 画像の不足23品を正本/registryから抽出。公式本文・写真を内部参照し、商品ごとのaccessory briefとモデル/構図をJSONへ記録する。
2. 内蔵image_genで各画像を独立生成。元PNGをworkspaceへ保存し、確認後WebPへ変換・AI性metadataを保持してpublic/imagesへ版付きの新名で登録する。旧画像を上書きしない。
3. AIはeditorial-imagesと生成/権利台帳へ追加し、実物写真用catalog.imageAssetIdsへ混ぜない。元比率を優先してカード/地域/詳細での切れを防ぐ。
4. 別担当で海外SEOの一次資料/公開検索/コードを点検。既存英語ページの意図をタイトルと説明で明確にし、構造化データと画像のAI性、canonical/hreflang等を正確に保つ。
5. 全50登録/実寸/台帳/旧25画像SHA/retired非配信/日英altとcaption、PC1440/スマホ390・320、metadata/リンク/広告/ビルドを検証する。
6. 既存公開先へ反映後に画像/HTML/SEOを再確認し、全ソースZIP・生成履歴・検索掲載の未確認範囲を引き継ぐ。

分担は画像参照計画、SEO実装、画像表示/QA、rootの生成・データ統合・仕様・公開/納品。共有registryと台帳はrootのみ書込み、runtime統合完了後にQAを開始する。
