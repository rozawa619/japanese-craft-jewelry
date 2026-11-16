# 006 検証対応

2026-11-16。実測した結果のみ記載。

| 要件 | 実装/検証 | 結果 |
| --- | --- | --- |
| R1 | policy本文/route/Base、browser Contact404/導線/sitemap | PASS |
| R2 | 商品hero/3details、販売手順boilerplate除去、価格/CTA先行 | PASS |
| R3 | catalog/JA/story/content/source、10商品/3都県/3技法/43出典 | schema/参照/ENJA PASS |
| R4 | 7ローカルAI画像を9商品へ対応、7人物タイプ、常時caption/alt/台帳 | 96画面・全画像ロード/寸法 PASS |
| R5 | readiness技術3条件、申請条件別資料、通常URL/共通resolver | 単体42/42、広告5/5 PASS |
| R6 | Astro check/verify、Chrome ENJA 1440/390/320 | 型0、123/123、96画面、axe/JS/console0 |
| R6 仕様補足 | 最終data修正後のglass/porcelain/pendant ENJA 390/320 | 12/12 PASS、JS/console0 |
| R6 生成物 | 最終本番build/check-built | 70HTML/2542内部参照/57anchor/212通常0広告/132実行JS CSP/54JSON/14移動/正規sitemap54 |

広告fixtureは実catalog/root dist不変を記録。後続の仕様補足はwhatToCheckと重量不明の表示のみで広告経路は変更なし。全not_applied、申請・承認・実成果計測なし。

根拠: docs/clear-stage-browser-results.json、clear-stage-final-detail-results.json、clear-stage-ad-build-results.json。公開後の状態はclear-stage-hosted-results.jsonとdeployment-results.jsonのversion0.6.0を優先。

## 実公開の確定

commit5abfec84a230b2326f50ad9ea479eed76fff4688、Actions43847763433 success。2026-11-16 19:24:48 JST時点、公開123/123・96画面（axe対象72画面0）・JS/console0。補足13/13、正規54URLすべて200/index、130実行JS hash/54JSON、7画像のローカルSHA一致、Contact日英404/導線・sitemap不在、SORA/3素材/短い選定方針/最終仕様を確認した。全検証プロセスexit0、report確定後の書込なし。

日英プレビュー: https://rozawa619.github.io/japanese-craft-jewelry/ja/ と /en/。実申請/承認/成果発生なし。ソース納品はworkspace内japanese-craft-jewelry-delivery/sourceおよび同フォルダZIP。
