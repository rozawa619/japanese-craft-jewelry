# 大きな日本地図から直接産地を選ぶ — 0.17.1

確認日2026-11-17。仕様は[020](../specs/020-direct-region-map/spec.md)、実装/公開/ZIPの確定結果は[verification](verification.md)・[deployment-results](deployment-results.json)を正本とする。初回R1〜R10はebacc3eで公開検証済み。その後の写真/地図の追加依頼R11/R12は改修中で、追加改修版の最終検証・公開・ZIPは未完了。旧0.17.0の193件や初回公開PASSを最新版へ流用しない。

## ホーム先頭・TOP10・大きな一覧地図の違い

PCのRegionHeroは左の人物AI画像・右の地図を並べ、明示的な県選択で画像と商品カードを切り替える機能です。hover/focusだけでは変わらず、産地CTAで一覧へ進みます。公開idだけのregion queryを使い、他query/hash・戻る・言語切替で選択を維持します。初期はselection.heroProductIdの画像/産地。商品/国内価格は共通MarketPriceのserverカードを選択県だけ表示し、figure asset/preserveRatio・画像src/alt/寸法も揃えます。JSなしは初期モデルと通常の全地域リンクを保ちます。

スマホのHeroは人物画像を全幅の枠でcontain表示し、その下に商品小情報/地図を並べます。初回の写真枠は180〜200px高。3:2の画像を細い列へ縦長に入れて大きな余白を作らず、写真と地図が見つけやすい配置を確認します。320×740で両方の全体が必ず初期画面へ収まるという意味ではありません。追加改修後の地図/画像寸法は最終reportを参照してください。

TOP10は行と文字をcompactにし、順位/地域/代表商品/価格を維持します。初回の写真枠はPC180px/狭幅110px・98pxでした。R11では行高・行間を保ちながら上下のletterbox余白を減らし、元比率で写真そのものを大きくします。原本画像とAIcaptionを保持し、顔や耳を切り取らず、実装後の寸法は最終reportへ記録します。閲覧数や検索順位が改善したという未測定の主張はしません。

R12ではHeroの日本地図をさらに大きくし、沖縄を独立した拡大枠からも選べるようにします。既存CC0の同じ県形状を使い、沖縄を移動・拡大した図であることを日英で明示します。県の数はunique47/掲載24県のままで、再表示した沖縄を別県として数えません。枠内のclick/tap/Enter/Spaceは通常のHeroと同じ明示選択です。女性画像・商品/価格・産地CTA・region queryを同期し、hover/focusでは変えません。追加改修版の操作確認はまだ未完了です。

以下の大きい一覧地図はHeroと別で、県のclick/tap/Enterが直接その産地へ進みます。同じ地理JSONを使っても、二つのclick動作を共通化しないでください。

## 利用者の操作

- 色の付いた県をクリック/タップすると、その産地の商品一覧へ直接進む。keyboardは通常リンクと同じEnter。別タブ/修飾clickやJSなしでもhrefを使う。
- カーソルを合わせる/県リンクへfocusする、または地域selectを変更すると、代表商品の単体AI画像・商品名・国内参考価格をpreviewできる。previewは直接リンクとは別の補助。
- 小さな県は＋で150/200/300%に拡大して選ぶ。−で縮小し、全体表示で100%と元のscroll位置へ戻す。拡大時は地図の中だけを上下左右へscrollする。
- 地図ジャンプと地方別一覧も維持。掲載24県以外の23県は非リンクで、空の商品ページへ誘導しない。

PCは地図側を広く取り、最大760px幅/900px高の枠で表示する。実寸は端末幅とレイアウトによる。旧560px高の上限だけを引き継いで縮めず、拡大後の細部と周囲のpreviewを実画面で確認する。スマホでは拡大・内部scrollと44px以上の操作部品を使う。県形状自体が44pxあるとは説明しない。

## どこを直すか

| 変更 | 正本 |
| --- | --- |
| ホーム先頭のモデル/地図・region query | [RegionHero.astro](../src/components/RegionHero.astro)と[home](../src/pages/[lang]/index.astro) |
| Heroの地図拡大/沖縄独立枠 | RegionHero.astroのscoped layout/SVGと共通のHero選択処理。新しい地理dataを作らない |
| TOP10写真の上下余白/自然比率・行高 | [RegionSelection.astro](../src/components/RegionSelection.astro)のranked表示/style。原本画像は保持 |
| 地図の幅・高さ・列配分・controls | [JapanJewelryMap.astro](../src/components/JapanJewelryMap.astro)のscoped style/markup |
| 100/150/200/300%・中央維持・reset | 同componentのzoom処理。viewportとdrawingを分離 |
| 県の行き先 | 公開catalog/産地本文から導出するhref。clickでpreventDefaultしない |
| 代表商品/国内価格/画像 | 既存の商品/地域代表/単体画像/価格の正本から表示。地図dataへ数値を複製しない |
| 形状の権利と出典 | [旧地図の取得記録](japan-map-v17.md)と[src/data/japan-map-geometry.json](../src/data/japan-map-geometry.json)。変更なし |

県リンクのclickをpreview専用に戻したり、タップ時にカードへ強制scrollして遷移を止めたりしない。hover/focus/selectのpreview更新と、native hrefの遷移を別の役割として保つ。zoomやpanは外部API/タイル/現在地/Storageを使わない。店舗Google Mapsとその同意設定/30日保存は今回の変更対象ではない。

## 検証の入口

安定buildのoriginをCHECK_BASE_URL、baseをPUBLIC_BASE_PATHへ指定し、node scripts/check-japan-map.mjsを使う。report/prefixはclick-map-stage専用へ分離する。実測と正確なコマンド設定は[020 validation](../specs/020-direct-region-map/validation.md)に記録する。共有distをbrowser中にbuildしない。

日英home/objects/places×320/390/1440、全24県のhref/所属/preview、native click/tap/Enterの実遷移・戻る、修飾click/JSなし、zoom上限/下限/reset、地図内panとページ横overflowなし、focus/axeを確認する。pathのbbox中心は海や他県の場合があるため、実際の塗り領域の可視位置へ入力する。forceやDOMclickで操作可能とみなさない。

R11/R12では、改修前reportをbefore-refineとして保持してから再検証します。写真の実paint/行高/行間を比較し、Hero沖縄枠のclick/tap/Enter/Space・region query/言語/noJS・全地域の回帰、unique47/掲載24県、未掲載県非リンク、地図/画像の見切れと狭幅overflowを確認してください。一覧地図217/Hero69/mobile92/Source328/公開補足24の初回公開PASSは、追加改修前のebacc3eに対する結果です。最終件数・寸法・再公開結果は020 validationと最新reportへ記録します。

今回の新bitmap/新地理data/新商品はなし。法律/商用ホスト/広告契約/本人情報等の以前の未完了条件は[棚卸し](remaining-task-audit-v17.md)・[法務](legal-review-v17.md)・[移行準備](commercial-host-migration-v17.md)を引き継ぐ。地図UIの改善をそれらの解消と混同しない。
