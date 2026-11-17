# 産地の写真を大きく統一する — 0.17.2

確認日2026-11-17。仕様は[021](../specs/021-unified-region-photos/spec.md)。この説明の作成時点では実装・最終検証・公開・ZIPが未完了です。確定結果は[021 validation](../specs/021-unified-region-photos/validation.md)・[verification](verification.md)・[deployment-results](deployment-results.json)を確認してください。

## 今回の表示

TOP10の写真で調整した自然比率の表示をDISCOVER3県にも揃え、写真をもうひと回り大きくする依頼です。home/objects/placesの日英に共通で反映し、産地一覧だけの巨大画像を解消します。行間と順位/地域名/商品/国内参考価格の導線を保ちます。

設計値はPCで写真最大300×200px、行padding18px/min-height264px、スマホで写真最大222×148px。スマホは右列を少し広げます。これらは上限/基準で、実寸は画面幅と本文の折返しによります。確定した画像paint・行高・行間は最終reportへ残します。原本の自然比率とcontainを保ち、顔・耳・アクセサリーを切り取ったり画像を歪めたりせず、AIcaptionを維持します。

## 変更箇所と境界

正本は[RegionSelection.astro](../src/components/RegionSelection.astro)のscoped styleです。TOP10だけ/DISCOVERだけの寸法を別ページへ複製せず、同じcomponentの全groupを揃えます。HTML/JSや選定/価格/URL/118画像のbytesは変えません。

ホーム先頭のHeroと沖縄独立枠、TOP10後の日本地図本体は今回の変更対象にしません。Heroは明示選択で人物/商品を変え、一覧地図は県の通常リンクで直接産地へ進む020の契約を継承します。詳しくは[地図の引継ぎ](japan-map-direct-v18.md)。店舗Google Mapsの30日設定・Privacy・広告offも継承します。

## 人・別AIが修正するとき

1. 元画像/商品正本を保ったまま共通styleを編集し、TOP10とDISCOVER、日英home/objects/placesへ同じ変更が反映されるか確認します。
2. 安定buildを作ってから写真専用QAを行い、実画像paint/行寸法/列幅、320px等の狭幅、顔耳のcontain、focus/axeを測ります。ブラウザ検査中にbuild/ソースを変えません。
3. preservationQAでstyle外のHTML/JS・Hero/一覧地図・商品正本・118画像をSHA照合します。旧map217/Hero77を新しい写真サイズの検証件数とは呼びません。
4. mobile92/Sources328/SEO等の必要検査を行い、公開app/Actionsと実URLを確認し、文書・全source ZIP/外部proofを確定します。失敗や中止はraw/理由/再検査を残します。

写真専用QAはscripts/check-region-photos.mjsで37checks（30条件＋axe6＋通信/error1）/390画像、Tab focus120sets・8スクリーンショットを予定しています。日英3surface×320/390/768/1024/1440px幅を対象にし、実行前の件数は成功実績ではありません。予定reportはローカルdocs/region-photos-stage-results.json、公開docs/region-photos-stage-hosted-results.jsonです。コマンドと確定結果は021 validationを参照してください。閲覧数・離脱率・購入率・検索順位の改善は測定していません。

0.17.1/app8b53114は公開済みですが、公開map146件/mobile61件の時点で今回依頼により検査を止めました。失敗による停止ではなく、021の完了でもありません。旧結果を最終結果へ読み替えず、[開始基準と中止記録](../specs/021-unified-region-photos/validation.md)を参照してください。

納品予定はjapanese-craft-jewelry-source-0.17.2-unified-021.zipとpackage-verification-0.17.2-unified-021.jsonです。法務・権利・実提携・認定CMP・商用ホスト等の従来の残条件は、この写真調整のPASSで完了にしません。
