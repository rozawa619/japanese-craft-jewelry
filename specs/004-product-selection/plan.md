# 設計

src/config/selection.tsでheroとおすすめの安定productIdを選ぶ。共通ProductCardと商品詳細へ2画像を接続し、画像registryもproductIdに結ぶ。src/content/productsの日英本文を選ぶ理由/装い/確認点に整理。商品価格/出典/広告は共有catalogのまま。

BaseのJournal項目とhome記事セクションを削除。地域/技法は商品分類としてカード一覧を先にし、補足説明はdetailsへ。About/選定方針/メタ情報も商品紹介の役割へ揃える。

旧journalは共通LegacyRedirectに静的な同一サイトtargetだけを渡す。meta refresh0＋fallback link、noindex/nofollow、canonical/hreflang/Articleなし。JS/open redirectなし。sourceのguideはdraftへ。公開sitemapは商品/分類/運営情報のみ（40URL想定）、過去14移行HTMLは除外。

検証は既存scriptの重要機能を維持し商品中心の画面へ対象を置換。広告fixture5件、公開/preview、CSP、日英peerと移行URLの両方を確認する。SEO/審査/売上の成果を保証しない。
