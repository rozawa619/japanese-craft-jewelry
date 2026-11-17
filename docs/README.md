# 文書の入口

公開版0.16.0・全国追加018（2026-11-17）。文書の入口は保守改訂017を引き継ぎます。この一覧の「現在の保守」が通常の入口で、過去の報告を新しい仕様・現在値として読む必要はありません。

公開appは86d6c6e6cb1567839c80d43bcf26f4a509e4a8bb、[Actions44042180272](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44042180272) completed/success。60公開/66登録商品・24県・118画像を実公開し、[Source328HTML照合](national-stage-hosted-sources-results.json)・[公開補足24](national-stage-hosted-release-results.json)・[mobile92](national-stage-hosted-mobile-results.json)が成功しました。納品ZIPの確定状態は[deployment-results.json](deployment-results.json)を参照します。

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

archiveと番号付きの旧報告は、当時の判断/失敗raw/出典の確認範囲を保つ資料です。design.mdやcontent-inventory.mdなど古い説明にも当時の件数・UIが残っています。今回の全国追加は[018](../specs/018-national-jewelry-expansion/spec.md)、引き継ぐUI/securityは[016](../specs/016-visual-choices-mobile-security/spec.md)、保守文書は[017](../specs/017-maintainer-handoff/spec.md)。

0.16の一次実測はnational-stage、0.15はvisual-mobile-stage、0.14はprivacy-depth-stage、0.13はvisual-seo-stage。旧editorial/quality/market/destination-stage等を最新検証へ転用しません。017のdocs/tool検査はhandoff-stageで区別します。私的スクリーンショット/元PNG/artifactsはZIPの実行依存ではなく、納品先の別資料です。
