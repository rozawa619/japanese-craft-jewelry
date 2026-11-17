# 設計と実装範囲

## 一覧地図

正本は[JapanJewelryMap.astro](../../src/components/JapanJewelryMap.astro)。採用予定は外枠max-width1040px/padding24px/margin-block40px、map-layoutを主1.25:副.85/max-width900px、主図をmax-width480px/aspect356:400/max-height540pxとする。これらは設計上限であり、component全体が540px高になるという意味ではない。全体枠とviewport/描画の実寸は旧0.17.2との比較も含めて実測する。

主viewBoxを本州〜北海道へ絞り、沖縄の同じCC0path1個を独立SVGを含むHTML anchorへ移す。予定枠はPC144px/スマホ80pxで、44px以上の通常リンクと日英labelを使う。移動/拡大図であると分かる表示、可視focus、島path/枠/labelの押しやすさを確認する。47path/24controlsを複製せず、HTMLAnchorElementとSVGAElementをpreview更新に含める。

一覧地図はclickで遷移を止めず、hrefから直接産地へ進む。hover/focus/selectは従来のpreview更新として継承する。zoom/scroll/全体表示、地方別一覧は保持。地方別一覧は既にnative detailsで初期closedのため、不要な別の開閉機構を作らない。

## トップの人物写真

正本は[RegionHero.astro](../../src/components/RegionHero.astro)。470/420/330/200/180px等の固定高を元比率の自然高へ変更し、画像本来の横幅/高さに合わせてfigureを組む。containとAIcaptionを保ち、空白を埋めるためのcrop/拡大や原画像の編集を行わない。

写真の外側のcontainerも確認し、画像だけの自然高化後に固定高の親や余白が残らないようにする。全24県の代表画像へ切り替えた状態でも、content-box/containの実paint、画像上下/figure/AIcaption間の人工的な余白を測る。初回で写真と地図が見つかり、通常scrollで全操作へ届くレイアウトを保つ。

## 変更しないもの

[RegionSelection.astro](../../src/components/RegionSelection.astro)のTOP10/DISCOVER共通写真は0.17.2のまま。商品の事実/日英本文/価格/公式URL/出典/店舗/画像registry・118WebP bytes、Google店舗Mapsの同意/30日保存、広告offは維持する。Hero画像の選択と一覧地図の直接遷移を共通click処理へまとめない。

## 実装と検証

1. 旧source/build/必要な寸法を保存し、作業専用のcompact-layout-stage reportへ分離する。
2. map担当がcomponentと専用QA、rootがHero自然比率、Hero QA担当が実paint測定を実装する。
3. 共同buildを凍結してから、日英PC/スマホ・原形/inset/native操作・zoom/scroll・全24県の写真切替・natural paint/余白・focus/axeを検証する。ブラウザー検査中に共有distをbuildしない。
4. 型/単体/build・mobile/Source/SEO・画像保持等の必要な回帰をrootが実施し、失敗raw/原因/修正/再検査を区別する。
5. rootがGit/Actions/実公開を確認し、現在入口文書・版付き全source ZIP/外部proofを確定する。

現在の実装/実測/公開/ZIPの確定状態はvalidation.mdを参照する。作成時点では未完了。
