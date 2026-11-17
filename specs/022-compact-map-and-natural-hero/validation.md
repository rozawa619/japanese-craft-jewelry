# 検証記録

2026-11-17。アプリ0.17.3/仕様022。**実装・最終ローカル検証・公開・ZIPは未完了。** 予定と確定結果を区別し、専用reportへ実測を残す。

## 開始基準

公開0.17.2/app19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success、文書HEADcf0da898787628240801807142db7f6d61e10f85。全source ZIP1118ファイル/118公開画像の集合/全SHAが照合済み。

0.17.2の公開結果は[region-photos-stage集約](../../docs/region-photos-stage-hosted-summary.json)。写真37/37・mobile92/92・Sources328/328・補足24/24は当時の実績で、022のコンパクト地図/沖縄別枠やHero上下余白の成功ではない。

## 022の検証予定

| 項目 | 検査内容 | 状態 |
| --- | --- | --- |
| 一覧地図 | 日英home/objects/places、旧版との全体枠/viewport寸法、47原形d/24controls一意、沖縄の島/枠/labelからnative遷移、preview/select・zoom/pan/reset・keyboard/修飾click/noJS・非遮蔽/overflow/axe | QA改修中、件数/寸法/成功は未確定 |
| Hero | 日英4viewport・全24県の画像/asset/alt/価格/CTA、自然比率とcontent-box/containの縦横letterbox<=1.5px、figure/外枠/AIcaption前後の人工的な上下余白、query/hash/history/言語/noJS・初回photo/map可視・axe4 | 77構成を維持し、既存172状態＋noJS2の計174paint測定を予定。実測未実施 |
| 回帰/保持 | 型/単体/build、mobile/Source/SEO、TOP10/DISCOVER共通サイズ、商品/価格/出典/公式URL/店舗・118画像、広告/Maps設定を必要範囲で確認 | 未実施 |
| 公開/納品 | Git/Actions・実URLの新表示/操作・生成物・全source ZIP/全SHA | 未実施 |

Heroの予定viewportは320×740/390×844/1366×768/1440×900。自然高化で写真と地図の全体が常に1画面へ収まるとはせず、初期可視領域・写真の実paintと通常scrollで全操作へ届くことを測る。border/AIcaptionの文字領域と人工的な余白を区別する。

設計上限（外枠max1040/主図max480×540・沖縄枠PC144/mobile80）と実寸は異なる。特に旧mapの描画758×895pxとcomponent全体の高を混同せず、必要な旧基準と新版の両方をreportへ記録する。

## 実行とreportの分離

安定buildのoriginをCHECK_BASE_URL、baseをPUBLIC_BASE_PATHで指定。Mapはnode scripts/check-japan-map.mjs、Heroはnode scripts/check-region-hero.mjsを使う。report名の例は次のとおりで、rootが実行設定と最終件数を確定する。未作成の予定名でPASSを示さない。

- 一覧地図：`docs/compact-layout-stage-map-results.json`
- Hero：`docs/compact-layout-stage-hero-results.json`
- private log/screenshot：`artifacts/compact-layout-stage/`と作業専用prefix

旧reportを上書きせず、初回失敗/中断/修正/最終再検査を分ける。ブラウザー実行中に共有distを再buildしない。実際の塗り領域を使ったnative入力と、出力HTML/source SHAの照合を記録する。

## 公開と納品（未完了）

0.17.3のapp/Actions成功と実URLの表示/操作/HTML・画像を確認後に追記する。確定状態は[deployment-results](../../docs/deployment-results.json)と[verification](../../docs/verification.md)を正本にする。

全source ZIP予定はjapanese-craft-jewelry-source-0.17.3-compact-022.zip、外部proofはpackage-verification-0.17.3-compact-022.json。まだ作成/照合済みではない。確定fileCount・集合/全SHAはsourceDeliveryと外部proofへ残し、ZIP内部に自身の最終hashを書かない。

Chrome emulationと実機Safari/iOSを区別する。検索順位/離脱率/売上・将来在庫・AdSense審査の保証ではない。法務/権利/商用host/実アカウント/認定CMP/本人情報等の従来の残条件をUI検証で完了扱いにしない。
