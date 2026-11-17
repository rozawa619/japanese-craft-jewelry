# 日本地図による産地選択 — 0.17.0

この文書は0.17.0（019）の地図取得・初期操作・検証の履歴です。0.17.1で地図拡大と県の直接リンクへ更新したため、現在の操作は[直接選択の説明](japan-map-direct-v18.md)と[020仕様](../specs/020-direct-region-map/spec.md)を確認してください。以下の当時の実測やライセンス記録は変更しません。

確認日2026-11-17。掲載県の位置と、その県の代表ジュエリーを一つの画面で結び付ける。TOP10の旅行順位は維持し、その後に日本地図、その後にDISCOVERを3件だけ置く。共通のRegionSelectionを使うhome/objects/placesの日英に適用する。

## 地理形状の出典と利用条件

- 配布者の一次ページ: [MapSVG — Japan](https://mapsvg.com/maps/japan/)。47 shapes、個人/商用利用、改変、単独利用、帰属表示不要、CC0との記載を確認。
- 実取得した原本: [Japan SVG](https://mapsvg.com/maps/geo-calibrated/japan.svg)。原本SHA256は`5901595ee1d9accdc99a7ca3c86ccbe12bc4ed3de07b0a4e8a5b203b00a110f8`。
- ライセンス: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)。商標権・プライバシー権等の別権利までCC0が許諾するという意味ではない。店舗や商品画像の使用許諾に流用しない。
- 出典/取得日/license/原本SHA/加工内容は[src/data/japan-map-geometry.json](../src/data/japan-map-geometry.json)内のsourceにも保持。

XMLを丸ごとHTMLへ埋め込まず、原本47件のpathから`d`・`id`・英語titleだけを抽出。`JP-01`〜`JP-47`を安定した地域slug・日本語名へ対応させた。`d`はSVG path命令と数値の文字だけ、47件の一意ISO codeを確認。script、style、foreignObject、event属性、リンク、画像、外部参照、元metadataを取り込まない。地図配布者が用意する有料プラグインや外部JSは利用しない。表示用viewBoxに8単位の外側余白を追加し、輪郭が端に接しないようにした。

抽出手順は、原本をUTF-8で取得→DOCTYPE/ENTITYを拒否→pathタグごとに属性を読み`id`を`^JP-\d\d$`、`d`を`^[MmLlHhVvCcSsQqTtAaZz0-9eE,.\s+-]+$`で検証→ISO順に整列→47件/重複なしを確認→JSON保存。作業用の実行記録はartifacts/extract-japan-map-v17.mjsと原本artifacts/japan-map-source-v17.svgに保存しており、通常buildはそれらへ依存しない。地図は旅行先選びの略図であり、測量/法的な行政境界/店舗位置/経路案内を認定するものではない。

## ソースの役割

| ファイル | 内容 |
| --- | --- |
| [japan-map-geometry.json](../src/data/japan-map-geometry.json) | CC0由来の47県の形・ISO code・地域slug/ラベル。商品事実を含めない |
| [japan-map.ts](../src/config/japan-map.ts) | 地方グループとDISCOVER3県の編集指定。価格・在庫・画像URLを複製しない |
| [JapanJewelryMap.astro](../src/components/JapanJewelryMap.astro) | 公開商品と日英の産地本文がある県だけを選択可能にし、代表商品/画像/実価格を正本から表示 |
| [RegionSelection.astro](../src/components/RegionSelection.astro) | TOP10→地図→3ピックアップの順序。全県分の長いDISCOVER行を繰り返さない |

掲載地域は現時点24県。固定閾値にせず、公開商品と内容のある産地ページから導出する。旧24県にない新県は商品と産地を公開すると地図でも選べる。代表は既存regionalRepresentativesから、その県に属する公開商品のみ採用する。未設定時はその県の公開編集順先頭。商品以外の地理slugには空URLを作らない。未掲載23県は灰色の非リンク形状のみ。

## 操作とアクセシビリティ

- hover/focusで県名・件数・技法・代表単体AI画像・商品名・国内通販参考価格・県の商品へのCTAを切替。
- 地図クリック/タップは選択プレビュー。CTAから県の商品へ進む。修飾キー付きclickやリンクの新規tab操作は通常の地域リンクとして維持。
- 小さな県形状をタップしづらい場合は、44px超の行き先selectか、地方別の全掲載県リンク一覧を使う。SVGの小県形状そのものを44pxと偽らない。
- セクション冒頭の「日本地図から選ぶ / Choose on the map」は44px以上のジャンプリンクで、TOP10をスクロールしきらず地図へ進める。
- 一覧はnative detailsで、各県リンクのタップ域は46px以上。県数を増やしても画像付きの長い紹介行を増やさない。
- JavaScript無効でもSVGの地域リンクと地方別一覧リンクは動作し、初期代表も表示する。JS専用selectは隠す。
- hover操作に依存しない。Tab→Enter/Space、selectのキーボード操作、日英、320pxを含む狭幅を最終browser検証で確認する。
- 画像は既存単体AI図を再利用し、常時AIイメージ/AI imageと表示する。実物写真へ見せ替えたりcropで仕様を認定したりしない。
- テキストはtextContent、URLはローカル正本のみ。data JSONは既存serializeJsonLdで`<>&`等をescapeし、HTML injectionを避ける。地図tile/API/外部送信/位置情報/Storage/Cookieは利用しない。Google Mapsの店舗埋込は別コンポーネントで扱う。

## この担当での確認

`node scripts/astro.mjs check`は138ファイルでerror/warning/hint 0。最初にwrapperを使わない直接astro CLIを試した際は、telemetryのAppData書込がEPERMになり停止した。repo wrapperを使用した再確認は成功し、外側の権限やtelemetry設定を変更していない。

CC0 geometry単独をChromeで描画し、47 pathのbboxが有限/幅0なし、日本列島の位置関係と24県の着色を目視した。これは最終画面全体・interaction・配信を認定する検査ではない。共有distのbuildは行っていない。最終build/日英UI/タップ/公開検査は作業019の検証に集約する。

## 最初の安定buildでの地図QA

独立した[scripts/check-japan-map.mjs](../scripts/check-japan-map.mjs)で193/193が成功。JA/EN×home/objects/places×320/390/1440、47shapeと公開24県、TOP10順→地図→DISCOVER3件、代表の所属/単体AI画像/国内価格/URL、全県select、hover/focus、keyboard、実touch2flow、noJS2flowを確認した。選択チェック188、axe6画面で違反0、page/console/external request0、入力9ファイルSHA不変。

初回の実測は[before-preview-scroll](discovery-map-stage-japan-map-before-preview-scroll-results.json)。小県形状のhitboxが44pxあるという認定はせず、select/一覧の同等操作で44px以上を確認した。実画面ではPCの地図＋カード、390pxの画像/文字/価格/CTAが収まることを目視した。一方、狭幅の地図tapで下側のpreviewがviewport外にある場合があり、明示tap/click時だけ最小scrollでpreviewを見せる追加改善を行うことにした。初回の機能検査成功と、この後の改善後検査は別段階として保持する。

初回report/log/6画面はartifacts/discovery-map-stage/before-preview-scrollとjapan-map-before-preview-scroll.logにも保持。最終実測は作業019のvalidationと最終reportを正本とする。地図担当の最初のQA helperにはconfig変数と関数名の重複があり、node --checkで実行前に検出して修正した。アプリ/配信の不具合ではなく、修正後のsyntax検査と193項目が成功した。
## 明示選択時のpreview可視化後

狭幅620px以下のclick/tap/Space activationでだけ、選択結果のpreviewへ`block: nearest`の最小スクロールを行う。hover/focusでは結果を切り替えるだけで、previewへスクロールしない。prefers-reduced-motionがreduceならauto、それ以外はsmoothを使い、previewのscroll marginは24px。修飾clickの別タブ等は通常リンクの動作を保つ。

最終の[地図QA](discovery-map-stage-japan-map-results.json)も193/193・選択188・axe6画面0・page/console/external request0、入力9ファイルSHA不変。追加した狭幅Enterと実touch2flowでは、テスト側の補助スクロールを行う**前**にpreviewカードの上下がviewport内にあることを確認した。日英・320/390/1440の最終6画面を実際に開き、画像の全体表示、選択地域と色、文字/価格/CTAの収まり、余白を目視した。テキストや写真を隠して成功にしていない。

この結果は最終local buildに対する検証。公開URLの確認や、地図以外の全機能の最終再検査へ読み替えず、作業019の集約記録と区別する。
