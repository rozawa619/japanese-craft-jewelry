> 現行の変更は仕様006が優先します。Contactは非公開で技術公開要件ではなく、個別プログラムの申請条件として未確認事項を管理します。初期のITO/英語のみ/神奈川範囲は仕様002以降で更新済みです。

# 設計

Node 24 / Astro 7.4.12 / TypeScript / Markdown / Zod。公式Astro導入・Content Collections・GitHub Pagesドキュメントを2026-11-16確認。registryの安定版と必要Node条件を確認して固定。標準静的HTMLに小さいフィルター処理だけ追加し、ホスティングを移行しやすくする。

ルート：/en/、/en/objects/、/en/objects/:slug/、/en/places/:prefectureId/、/en/crafts/:craftId/、/en/makers/:id/、/en/journal/、/en/journal/:id/、/en/:policy/、404。ルート/から英語入口。初期の地域本文はkanagawa、技法本文はhakone-yosegiのみ。

構造：src/data/catalog.jsonで正規化した実データ、src/content/productsで独自説明、src/content/guidesで英語本文、src/content/policiesで方針、src/content/placesで地域本文、src/content/craftsで技法本文。places CollectionはprefectureIdとrelatedMerchantIds、craftNotes CollectionはcraftIdで関連付ける。本文ファイル名と対応するマスタIDを一致させ、汎用のplaces/[place].astro・crafts/[craft].astroでrenderする。src/lib/schema.tsとscripts/validate.tsで整合性、affiliate.tsに広告解決を集約。部品に直書きトラッキングURLを置かない。

地域・技法の公開条件はpublished、空でない本文、一次出典、対応IDを持つpublished商品が1件以上。地域は商品prefectureIdsによる工房の関連と、relatedMerchantIdsによる地域販売店の紹介を分け、販売店所在地を商品製造地へ変換しない。ページ生成とsitemapは同じCollectionと公開条件に従う。空本文・下書き・関連公開商品なしは生成せず、マスタだけの47都道府県ページを作らない。validatorは未知参照、本文slug/ID不一致、空の公開本文、公開商品不在を検出する。

承認条件は保守的に二重ゲート（プログラムと個別リンク）。加盟店単位で停止可能。日付なし広告は有効化しない。下書きは一覧・ページ生成・サイトマップから除外。

独自ワイヤー：細い帯状の説明→余白の大きいロゴ/ナビ→左に編集見出し、右に自作抽象パターンの大きい表紙→種別の入口→3点のカード→濃緑の産地特集→ガイド→編集方針とフッター。スマホは縦積み。参照メディアのコピーや商品写真を使わず、比較軸と根拠表示の考え方を採用。価格と仕様は必ず単一データ参照。

tokens.css：生成り#f7f5ef/墨緑#202c28/森林#293e32/赤茶#923f2e。Georgiaの編集見出しとOS標準sans。外部フォント通信なし。図柄はCSSで独自制作、実物の再現にしない。

公開URL/公開状態/運営名/連絡先は環境設定。初期はpreview、noindex。GitHub新規repoとPagesを優先、権限不足ならローカルプレビューと全ソース、手順を納品。秘密やトークンを保存しない。
