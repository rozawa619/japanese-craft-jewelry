# 設計と実装範囲

## 変更する正本

rootがsrc/components/RegionSelection.astroのscoped styleだけを変更する。rankedなTOP10専用の写真サイズと、DISCOVERに残る別の大きな表示を共通のgroup表示へ揃える。home/objects/placesは既存componentを通じて日英とも反映し、各ページへ別々の写真寸法を追加しない。

写真は既存の元比率とcontainを使い、desktop最大300×200px、行padding18px/min-height264px、mobile最大222×148pxを設計の上限/基準とする。mobileでは右の画像列を少し広げ、左の地域名/価格/商品情報の折返しを確認する。行間を保ち、画像paintを大きくする。画面に応じるため全画像が上限寸法になるとは説明しない。

## 変更しないもの

HTML/JS、選定・順位・リンク先・商品/価格/店舗/画像registryは保持する。RegionHero.astro/JapanJewelryMap.astroとそのCC0 geometry、query/言語保持、沖縄枠/直接遷移/zoom、Google店舗Mapsの同意codeは変更しない。118画像を再書出し・加工・生成しない。style外の差分と画像bytesをpreservationQAで照合する。

## 実装・検証の順序

1. rootが0.17.1の最終source/build基準を保存し、020の途中公開検査をsuperseded-sizeとして保全する。
2. rootが共通styleを変更。写真担当QAは安定build後の37checks（30条件＋axe6画面＋通信/error1）/390画像、Tab focus120sets・8スクリーンショットを予定する。日英3surface×320/390/768/1024/1440px幅、高さ1000px。条件/件数は実行reportで確定する。
3. preservation担当が対象style以外のmarkup/JS・Hero/一覧地図・商品正本・118画像をSHAで確認。旧map217/Hero77の操作実績と今回のsource不変証拠を組み合わせ、写真サイズ自体は新QAで検証する。
4. rootの共同buildを凍結してからmobile92/Sources328/SEO等を必要範囲で実行し、失敗raw・原因・修正・再検査を分離する。ブラウザ検査中はbuild/アプリを変更しない。
5. rootがGit/Actionsと実公開の写真・mobile・Sources/生成物を確認してから、現在文書・版付き全source ZIP・外部proofを確定する。

最新の状態はvalidation.mdへ記録する。作成時点の実装/最終検証/公開/ZIPは未完了。旧020のPASS件数をそのまま021の成功件数へコピーしない。
