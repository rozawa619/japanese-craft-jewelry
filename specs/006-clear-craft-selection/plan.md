# 設計と対応

R1: policies Collection + policy template + Base footer。Contactのdraftは履歴として保存、生成しない。
R2: home/objects detail/ProductCard表示から販売手順/取引責任説明を除外。出典/素材寸法は下部details。
R3: catalog + translations/ja + product-stories + productNotes + places/crafts。sources.jsonが出典正本。
R4: editorial-images.jsonはproductIdと生成画像を接続し、画像権利台帳と生成promptを別記録。公式画像は内部視認のみ。
R5: 共通resolveRetailerLinkを維持。readinessで技術必須と申請未完を別出力。
R6: verify、browser、隔離広告5状態、公開後検査。レポートはclear-stage-*、最終結果はvalidation.md。
