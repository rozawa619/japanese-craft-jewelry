# 009 検証対応表

更新2026-11-16。公開結果はdocs/deployment-results.jsonのversion0.9.0・対象commitで確認し、旧versionを今回の配信成功と扱わない。

| 要件 | 実装・正本 | 実確認 |
| --- | --- | --- |
| R1 | editorial-images.json、assets.json、image-generation-v9.json | 現行28WebPが全30商品へ対応、未登録0。全28目視・1536×1024・SHA照合。18Kは元のregistry未登録を解消。旧locked7画像はpnpm buildでdistから除去。 |
| R2 | RegionSelection、region-selection.ts、home/objects/places | ローカル地域85/85、全60地域/代表クリック往復、日英3幅、axe18画面0。目視3点はCSS調整後focus19/19・18画面axe0で再確認済み。 |
| R3 | tourism-top10-v9.json、region-selection.ts | 観光庁2025通年確報・表6-1の全目的/全国籍地域/複数回答をXLS実読。TOP10順位/率、佐賀/石川別枠を照合。 |
| R4/R5 | catalog/訳/Collection/stories/sources/visits | 30商品・12地域・13技法・125sources、13店舗/25商品と5商品の正確な代替。51単体、schema/日英/出典/公式URL/訪問参照PASS。外部134URLで404/410なし、新規公式URL全200。 |
| R6 | scripts/check-*、prune-retired-images | Astro65files0 errors/warnings/hints、51/51、170HTML・8524 href/src・1117anchor・600通常0広告・373実行JS CSP hash・154JSON、14旧移動。日英256/256・222画面・axe0・JS/console0。広告隔離5/5、実catalog/dist不変。 |

ローカル全画面後の小修正は、地域行の画像比率/位置と英語地名の改行のみ。最終focusは19/19・18画面axe0、36行cropと12fullpageを更新し、地名改行とアクセサリー見切れを目視で解消。公開確認はdeployment-resultsとhostedレポートを参照。生成画像は実物写真・試着の証拠ではない。素材/部材産地と全組立地を区別し、税や重さ・仕様が不明ならnullを保持。

到達性の再確認では既存原典4件が要注意: 青山スクエア/箔一は一時公開停止、Skimlinks2件はCloudflare403。閉鎖や誤URLとは断定せず、destination-stage-external-links.jsonへ補足。提携申請/AdSense申請・承認・検索流入・成果は未実施/未確認。

## 0.9 公開最終確認

2026-11-16T12:21:19.903Z UTC記録。最終app e74cab62b76071867fd9ebd6991aebcbea05ae2b、Actions 43865116261 success。公開全体256/256・222画面、axe0、JS/console0。公開地域85/85・実クリック往復60、目視5/5、補足20/20、正規URL154全200/メタ確認、現行画像28全200/SHA一致。入口faviconのhost-root404をサブパス内SVG指定で修正・公開再確認済み。詳細はdestination-stage-hosted-*とentry-favicon-fix、deployment-results。
