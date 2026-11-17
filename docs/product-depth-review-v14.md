# 商品選びの内容を深めた範囲

2026-11-17。公開50品を日英で実読し、各3問の選択Q&Aを追加。日英150件ずつ、計300問答。商品名/素材/既存の装いを言い換えるのでなく、金具の選択、寸法が示す部位、片耳とペア、チェーン/トップ、色名と素材、variantの条件、実掲載の比較候補から読者が判断できることを増やした。

先頭25品は全25公式本文をfresh Chromeで取得・実読。後半25品は公式web本文と、取得に制約がある8件のfresh Chrome本文を組み合わせ、古いキャッシュ価格を現行事実へ上書きしなかった。調査方法/URL/観測/限界はresearch/product-depth-first-v14.jsonとproduct-depth-second-v14.json。HTTP200だけで在庫や注文成立を新たに認定していない。

各担当の自己確認に加え、相互に5品ずつを査読。Maps担当は最終Q&A全50の日英を再読し、未根拠の仕様/別正本/AI実物混同を点検した。rootが浜松屋clipの現品選択、Kolmio/SHOWEN/HARIO、正茂/ピアリング/Nanaoの回答を読者向けに整理。『保証しません』『当サイトは紹介していません』等の運営説明の反復を減らし、公式写真とAI画像を区別した。

本文52ファイルを改稿。ToyToy木の彫り面、銀の曲線、錺之の彫り文様についてv13公式画像の観測と旧コピーの矛盾を直し、catalog/story/selection-notes/jaの35フィールドも統合修正した。編集修正の履歴はresearch/editorial-corrections-v14.json。価格/在庫/広告承認/確認日を新しく見せる更新はしていない。

## 正本と表示

- src/data/product-buying-guides.json：商品ID・日英3問・根拠source ID。価格/URLは持たず、寸法/金具/留め方は必要な場合だけcatalogのtokenから表示する。
- src/lib/product-buying-guides.ts：公開集合との完全一致、商品に関連する出典、unknown tokenの拒否、完全一致の回答重複を検査。これを独自価値の自動認定とは呼ばない。
- ProductBuyingGuide：比較の後へ表示し、出典リンクで同じページのdetailsを開く。FAQ rich result/レビュー/星は宣言しない。

追加記事数・文字数・画像数でAdSense合格を保証しない。ブログ/架空の試着/訪問/試験/レビューを増やさず、実物未試用の限界と情報更新を維持する。現段階で利用者テスト、Googleの個別評価、合格率の計測はしていない。最終動作/公開の検証は014/015とprivacy-depth-stage各reportを参照。
