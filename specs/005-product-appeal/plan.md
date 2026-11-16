# 設計

主役は『どんな装いを楽しめるか』。heroはproduct-storiesの見出し/導入、カタログ由来の価格/確認日、共通RetailerLinkで構成。商品名/技法/販売先は保持。AI captionは短く明瞭に常時表示し、画像の詳しい扱いは下部にも残す。

hero後は独自の選定理由と装いの提案、次のCTA。その後のnative detailsに素材/サイズ/金具、配送/返品、確認点、出典を置く。仕様表を隠したふりで消さず、keyboardで開けるようにする。カードのsummaryも商品を選ぶ動機へ。8つのproductIdに日英のstoriesを追加し、共有事実/価格/URLを重複しない。

広告開示は最初の外部CTAより前に共通Disclosureで表示。普通リンク時は短い一文、広告時は関係を明瞭にしprogram文言を残す。mobile追従CTAも同一の共通linkを使い、主CTA通過後/フッター非表示で制御。外部script等は加えない。

検証は既存の重要検査とdata-product-*の順序/閉じたdetails/Enter操作/追従link整合を確認。source/商品写真の権利/売上効果は混同しない。
