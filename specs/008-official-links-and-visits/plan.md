# 設計

店舗はsrc/data/visits.jsonに安定storeId・公式sourceIds・日英表示・住所/案内と商品ごとの関係を分離。MapsURLは検証済公開店舗名/住所から共通関数で生成し、公式リンクは既存catalogの普通URLを再利用。公式メーカー発見は別の明示record、unknown makerの穴埋め禁止。

商品詳細は魅力/価格/CTAを維持し、公式情報/訪問案内componentを追加。非広告の公式直リンクと将来の広告CTAを混同しない。店頭在庫確認が必要な関係をデータで表す。

法務は文化庁/Google公式Maps URLsとGeo Guidelines/消費者庁を読み、採用したリンク形式と不採用(画像転載・地図screen)を記録。法令本文が読めないソースを実読と記録しない。

検証: schema/ID/出典/16商品カバレッジ・ホスト/GoogleURLの固定origin/api1・実店舗未確認に地図なし・広告locale分離維持・日英スマホ・公開。
