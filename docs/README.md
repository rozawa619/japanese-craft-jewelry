# 文書の入口

作業版0.17.1・地図/着用画像/沖縄拡大枠020（2026-11-17）。文書入口は017を継承し、旧版を現在値へ読み替えません。

<!-- TODO_PUBLIC_V18 -->
0.17.1（仕様020）は公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

PCのホーム先頭は左の人物AI画像・右の日本地図を並べるRegionHeroです。スマホでは写真を全幅で大きく表示し、その下に商品小情報と地図を並べて、顔や耳を切らずに見やすくします。Heroの県はclick/tap/Enter/Spaceで明示選択すると、女性画像と商品/国内参考価格を切り替え、産地CTAから商品一覧へ進みます。hover/focusだけでは切り替えません。有効な公開地域idだけを`?region=`へ反映し、他query/hash・戻る・言語切替で選択を保ちます。Heroの本州〜北海道は余白を詰めて拡大し、沖縄は「拡大」の注記付き別枠から同じ操作で選べます。Heroとは別に、TOP10後の大きい一覧地図は県のnative直接リンクです。TOP10の人物AI画像は横幅を広げ、元比率とPC最大180px・スマホ最大132pxのcontainで上下の帯を抑え、地域名/商品/価格/順位を保ちます。顔や耳を切らず、初期Heroは既存selection.heroProductIdを使います。これらは機能・表示の変更であり、訪問数や検索順位の改善を実測したという意味ではありません。

台帳は60公開/66登録・24県・118画像を継承。確定状態は[deployment-results](deployment-results.json)を参照します。

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

- [地図の直接選択020](../specs/020-direct-region-map/) / [日本地図の直接選択](japan-map-direct-v18.md)・[残タスク](remaining-task-audit-v17.md)・[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)。ホーム先頭のHeroとは別に、産地一覧はTOP10→大きい日本地図→DISCOVER3県の順です。観光TOP10順位は維持し、47県のCC0形状から実商品/産地本文のある掲載24県だけを選択可能にします。県のクリック・タップ・Enterは、その産地の商品一覧へ直接進む通常リンクです。hover/focusと地域selectは代表単体AI画像・商品名・国内参考価格のプレビューに使います。地図は大きくし、100/150/200/300%の拡大・縮小・全体表示と、拡大後の地図内スクロールを用意。地方別一覧・地図ジャンプ・JSなしの直接リンクも保ちます。
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

0.17.1の実測は020 validation・click-map-stage・verificationを正本にし、0.17.0の実測は019 validation・discovery-map-stage、0.16の一次実測はnational-stage、0.15はvisual-mobile-stage、0.14はprivacy-depth-stage、0.13はvisual-seo-stage。旧editorial/quality/market/destination-stage等を最新検証へ転用しません。017のdocs/tool検査はhandoff-stageで区別します。私的スクリーンショット/元PNG/artifactsはZIPの実行依存ではなく、納品先の別資料です。
