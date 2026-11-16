# 011 検証と監査結果

2026-11-16開始。最終の時刻・版・アプリcommit・公開成否はdeployment-resultsとquality-stage各reportを優先。46品の途中結果や010以前の成功を最終42品へ転用しない。

| 要件 | 実装・監査 | 確認 |
| --- | --- | --- |
| R1 | legal-audit-v11、法務23原典/移行20原典、現行法API条文照合 | 15論点。18K限定、AIと実物/体験区別、GitHubIP保存、未確認工程語を修正。全世界の適法性や権利クリアは未確認 |
| R2 | competitive-review/adsense-review、4競合と個別例/Google一次資料 | コピーや架空の最低商品/文字数基準なし。ホスト契約、PSLと申請URL/所有確認、Privacy/CMP/CSPを分離 |
| R3/R8 | 旧30+新17候補の販売追査、catalog/訳/本文/visits/証跡 | 27旧品維持+15新規=42。COCOON2/明示欠品18K/現販売未確認畠山2はdraft。hairpinを含む6draft、12URLは404。HARIOは8250で旧cache7480不採用 |
| R4 | ChoiceDetails/selection-notes、RegionalChoiceGuide、shopping-filters、priceUnit | 全42固有noteと2〜3比較ID、12地域の実種類/価格帯、予算6区分/両価格順/未知末尾/同額編集順、単位は確認時だけ |
| R5 | OfficialPreview、近接公式リンク、policy、asset台帳 | 未許諾実物写真なし。25AIが27品、文字プレビュー15品。退役3をarchive/Git除外/registry/prune/export除外で管理。既存AIの個別権利リスクは残る |
| R6 | 既存市場/承認resolver・固定Mapsを維持 | 通常/広告・host/localeゲート、商用適合の未解決警告、Contactなし/SORA/ブログなしを維持 |
| R7 | verify/readiness/isolatedads/browser/hosted/export | 静的検証とローカル価格・UIの結果は下記。公開と納品は完了時に追記 |

## 最終ローカル

- Astro83files、0 errors/warnings/hints。単体90/90。42商品/12地域/18公開技法/240出典記録/20店舗/全日英/販売証跡と選択note参照PASS。
- build220HTML、11878href/src、1617anchor、858通常0広告、497実行CSP hash、204JSON、14旧journal移動。退役10ファイルの公開生成物からの個別除外PASS。
- quality-stage-browser-results：437/437、商品詳細252確認（42×日英3幅）、地域種類の実クリック往復198、全ルールaxe36画面0、26screenshots、JS/console/予期せぬ外部要求0。入力7ファイルの開始終了SHA一致。
- 全6draftの日英12URL404、全220HTMLとsitemapに商品URL/card/comparison残存なし。未知価格公開0を空partitionとして検証し、架空の公開商品を追加していない。
- priority4/4：HARIO EN390/JA320の8250・pair・素材/寸法/未確認金具、福岡EN390/JA320の現1商品/文字preview/COCOON非残存。実画面も目視。
- 隔離広告6/6：78/1/14/0/0/0 sponsored。対象関連だけ/海外だけ/下部だけ承認、停止・欠落・不許可host、公用/previewメタ。実catalog/dist不変。
- 依存auditは既知advisory0（全348依存の時点検査）。侵入試験や安全保証ではない。

## 発見と修正

初期30品UI probe47/47の後、新規文字previewを含む46品で390px幅が473pxに広がる実不具合を検出。compact previewのmin-heightとaspect-ratioが最小幅を作っていた。CSPを緩めず診断し、sourceでaspect-ratio:auto/width100%/min-width0に修正。最終42品の全3幅で再確認。中断46品はinitial46-interrupted/overflow-probeに履歴として保持。

公開保留により4技法本文がdraftになり、既存単体fixtureの「全本文=公開本文」という仮定が崩れて89/90となった。実装の公開条件を緩めず、fixtureを実際のpublished集合へ修正し、各公開本文の関連商品欠如エラーまで個別確認するよう強化。最終90/90。

購入gateは目視・本文の一次調査をデータ化して整合性を守るもので、在庫を自動で実証する仕組みではない。商品/出典/正しいSKU query/現在店舗/実際の価格付きカタログを照合し、bare homepage/gallery・別SKU・未知source・無関係店・明示欠品・draft・不足/重複証跡を拒否。ColorMeのpid商品やShopifyの正当なcollection内商品は受理する。15単体で境界を確認。

## 公開・納品

この段階では公開後の再確認とソースZIPは進行中。確定値はdeployment-resultsの0.11.0と完了時の追記を参照。AdSense申請/承認、Cloudflare等への移行、課金/ドメイン/契約、店頭SKU在庫、将来の在庫・注文成立、全世界の適法性は検証済みではない。
