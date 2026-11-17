# 文書の入口

公開版0.17.3・地図枠とトップ写真の調整022（2026-11-17）。文書入口は017を継承し、旧版を現在値へ読み替えません。

0.17.3（仕様022）公開済み。app `ef8ae160e7fc7d2b41cdce1063094313b719df6e`、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success。実URLで一覧地図241・Hero77・mobile92・Sources328・補足24を確認。地図枠縮小/一覧沖縄別枠とトップ写真の自然比率を反映。確定値はdeployment-results/verificationを参照。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。

台帳は60公開/66登録・24県・118画像を継承。確定状態は[deployment-results](deployment-results.json)を参照します。

## 現在の地図枠とトップ写真022

[022仕様と検証](../specs/022-compact-map-and-natural-hero/)・[調整/編集ガイド](compact-layout-v20.md)。一覧地図の枠/沖縄別枠とHero写真の自然高を更新中。最新実測はcompact-layout-stageへ分けます。

## 継承する写真サイズ021

[写真共通サイズ021](../specs/021-unified-region-photos/)・[操作と更新](region-photos-v19.md)。前段階021でTop10/DISCOVERを日英3画面で共通化し、37検査/390画像と保全8検査を確認済み。022ではこの写真サイズを保ち、新しい地図/Heroの実測は別reportへ記録する。

## 現在の保守

| 資料 | 読むとき |
| --- | --- |
| [現在状態・残作業](handoff.md) | 公開app/最新source/未完了を知る |
| [別AIへ渡すprompt](ai-handoff.md) | 会話履歴なしで再開する |
| [起動・公開・復旧・ZIP](setup.md) | 初回や別PC、環境エラー、公開/納品 |
| [編集cookbook](editing-guide.md) | 商品・日英・価格・画像・店舗を直す |
| [構造と正本](architecture.md) | データ/表示/ブラウザーの分担を理解する |
| [検証matrix](verification-guide.md) | 必要な検査とreport保存先を選ぶ |
| [運用の旧記録](operations.md) | 従来手順の背景だけを調べる |
| [共通原則](constitution.md) / [AI規則](../AGENTS.md) | 捏造禁止・権利・広告gate・作業方針 |

## 検証と未完了条件

- [地図の直接選択020](../specs/020-direct-region-map/) / [日本地図の直接選択](japan-map-direct-v18.md)・[残タスク](remaining-task-audit-v17.md)・[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)。ホーム先頭のHeroとは別に、産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県の順です。47県のCC0原形を主図46＋沖縄別枠1へ分け、実商品/産地本文がある掲載24県だけを通常リンクにします。沖縄は島path・枠・labelを押せる拡大表示とし、県のclick/tap/Enterで産地の商品一覧へ直接進みます。pointerenter/focus/selectの代表単体画像/商品/国内参考価格preview、100/150/200/300%のzoom・内部scroll・全体表示、地方別の初期closed details・地図ジャンプ・JSなしのhrefを継承します。外枠/主図/沖縄枠の設計値と実測は最新022の説明で区別します。
- Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。
- 今回新bitmapはなく0.16の画像/原本を保持。対応ホスト向けpublic/_headersは移行準備です。現GitHub PagesのHTTPヘッダーを設定済みとはせず、実契約/本人情報/広告実ID・CMP/ドメイン・DNS/アカウント管理/検索実績を技術PASSで完了化しません。AdSense off・実提携未申請/通常URLを維持します。

- [公開/納品の機械記録](deployment-results.json)と[実測説明](verification.md)。HTML生成の成功、公開成功、Googleの審査は別です。
- [全国追加018](../specs/018-national-jewelry-expansion/)。0.16の10県10商品、日英・画像・店舗・購入根拠とnational-stageの検査を確認します。
- [保守文書017の検証](../specs/017-maintainer-handoff/validation.md)。文書と再実行手順の確認は、過去の画面改修の検査から分けています。
- [security監査](security-review-v15.md) / [現在の境界](security.md) / [host観測](visual-mobile-stage-hosted-security-headers-results.json)。検出した問題とhost/accountの残範囲を区別します。
- [申請前チェック](pre-application-checklist.md) / [商用hostの確認](hosting-commercial-readiness-v11.md) / [AdSense点検の履歴](adsense-review-v11.md)。未申請を承認済みにしません。
- [旧単体画像の生成記録](image-generation-solo-v14.json) / [0.16人物画像](image-generation-v16.json) / [0.16単体画像](image-generation-solo-v16.json) / [地図の取得と実装](inline-maps-v14.md) / [海外SEO](international-seo-v13.md)。実画像/実地図/検索実績の限界も記録しています。

## 説明書でもありbuild入力でもある資料

| ファイル | 使用箇所 |
| --- | --- |
| [research/sources.json](research/sources.json) | catalog loader/商品・地域等の出典表示、validator |
| [assets.json](assets.json) | 画像権利・退役・data/build validator・export |
| [image-generation-solo-v14.json](image-generation-solo-v14.json) | 旧単体AI画像50点のhash/生成記録。新ログに置き換えず保持 |
| [image-generation-solo-v16.json](image-generation-solo-v16.json) | 新単体AI画像10点。共通readerが旧v14と併読し、active registry全60商品との一致を検査 |
| [image-generation-v16.json](image-generation-v16.json) | 新人物AI画像10点のprompt・原本・採否。単体ログと分離 |
| [image-baseline-v12.json](research/image-baseline-v12.json) | 保持する旧画像のSHA検査 |

この表だけで全依存を網羅したものではありません。新しい環境へはdocs全体を含む全sourceを渡し、docsを一括削除しないでください。

## 履歴の読み方

archiveと番号付きの旧報告は、当時の判断/失敗raw/出典の確認範囲を保つ資料です。design.mdやcontent-inventory.mdなど古い説明にも当時の件数・UIが残っています。現在は[020](../specs/020-direct-region-map/spec.md)、直前の地図/表示設定は[019](../specs/019-geographic-discovery-map-privacy/spec.md)、全国追加は[018](../specs/018-national-jewelry-expansion/spec.md)、引き継ぐUI/securityは[016](../specs/016-visual-choices-mobile-security/spec.md)、保守文書は[017](../specs/017-maintainer-handoff/spec.md)。

0.17.3の実測は022 validation・compact-layout-stage・verificationを正本にし、0.17.2は021 validation・region-photos-stageで区別し、0.17.1は020 validation・click-map-stageで区別し、0.17.0の実測は019 validation・discovery-map-stage、0.16の一次実測はnational-stage、0.15はvisual-mobile-stage、0.14はprivacy-depth-stage、0.13はvisual-seo-stage。旧editorial/quality/market/destination-stage等を最新検証へ転用しません。017のdocs/tool検査はhandoff-stageで区別します。私的スクリーンショット/元PNG/artifactsはZIPの実行依存ではなく、納品先の別資料です。
