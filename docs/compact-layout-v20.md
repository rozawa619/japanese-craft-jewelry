# 一覧地図とトップ写真の余白を整える — 0.17.3

確認日2026-11-17。仕様は[022](../specs/022-compact-map-and-natural-hero/spec.md)。**実装・最終検証・公開・ZIPは作業中です。** 確定した寸法/件数/app/Actionsは[022 validation](../specs/022-compact-map-and-natural-hero/validation.md)・[verification](verification.md)・[deployment-results](deployment-results.json)を参照してください。

## どの表示を変えるか

「日本の『ここ』へ行くなら。」の一覧地図は、全体の枠と主図をコンパクトにします。本州〜北海道の主図から沖縄の同じCC0原形を別枠へ移し、「沖縄（拡大）」と分かる入口にします。予定は外枠max1040px、主図max幅480px/高540px、沖縄枠PC144px/スマホ80px。画面幅による実寸や枠全体の高さは、最終の計測結果を確認してください。

沖縄は島path・枠・labelからclick/tap/Enterでき、直接その産地の商品一覧へ進みます。通常hrefなのでJSなしや修飾clickでも使えます。hover/focus/selectの代表商品preview、zoom/内部scroll/全体表示、地方別details一覧も継承します。県は原形47/掲載24のままです。

メインTopの女性写真は固定高をやめ、自然比率に合う高さへ変更します。画像と外枠、AIcaption前後も含めて人工的な上下余白をなくし、顔・耳・ジュエリーを切らずに表示します。原画像を加工したり、cropで埋めたりせず、AIcaptionを常時表示します。

Heroの地図選択は女性画像/商品カードを切り替える機能です。一覧地図の直接遷移とは役割が異なります。Heroの24県・region query/他query/hash/戻る/言語切替/noJSの契約は保ちます。

## 編集する正本

| 変更 | 場所 |
| --- | --- |
| 一覧地図の枠/主図寸法、沖縄拡大枠、preview/zoom | [JapanJewelryMap.astro](../src/components/JapanJewelryMap.astro) |
| トップ人物写真の自然高、figure/AIcaptionとの余白 | [RegionHero.astro](../src/components/RegionHero.astro) |
| 47県の原形と出典 | [japan-map-geometry.json](../src/data/japan-map-geometry.json)。今回dを変更しない |
| 地図/Heroの専用QA | [check-japan-map.mjs](../scripts/check-japan-map.mjs)・[check-region-hero.mjs](../scripts/check-region-hero.mjs) |

TOP10/DISCOVER3県の共通写真は0.17.2のPC最大300×200px/スマホ最大222×148pxを維持します。変更する場合は[写真の更新ガイド](region-photos-v19.md)を確認し、022の地図/Hero調整へ混ぜないでください。

## 人・別AIが修正するとき

1. component全体の枠と地図viewport/描画、画像content-box/実paintとcaption領域を区別して測ります。固定高の親やpaddingが残っていないかも確認します。
2. 沖縄を複製せず移動し、元47pathと掲載24controlsが一意で、未掲載県は非リンクのままか確認します。見えるlabelとariaの名前を揃えます。
3. 一覧のclick/tap/Enterは通常リンク、Heroの明示選択は画像切替として扱います。両者のclick処理をコピーして統一しません。
4. 安定buildを凍結してから日英PC/スマホ・native入力・noJS・zoom/scroll・24画像切替/自然比率/上下余白・focus/axe、必要なmobile/Source/SEO等を検査します。検査中にbuildしません。
5. 公開app/Actions/実URLの新表示を確認し、仕様・実測・現在の引継ぎ・全source ZIP/外部proofを更新します。

今回の新商品/新bitmapはありません。商品60/24県/118画像・SORA・広告off/実提携未申請・Google店舗Mapsの30日設定を継承します。法務/権利・実アカウント/CMP・商用host等の残条件は、このレイアウト検証で完了になりません。

納品予定はjapanese-craft-jewelry-source-0.17.3-compact-022.zipとpackage-verification-0.17.3-compact-022.jsonです。現時点で作成/全SHA照合済みという意味ではありません。
