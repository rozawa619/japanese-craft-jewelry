# 010 検証記録

2026-11-16 / Version0.10.0。公開の確定はdocs/deployment-results.jsonのversion/commit/Actionsと実配信確認を優先する。009の成功を今回へ読み替えない。

| 要件 | 実装・出典 | 検証 |
| --- | --- | --- |
| R1 国内参考主表示 | market-prices.ts、MarketPrice。catalog原値/国内実額を保持 | 62単体のうち市場関連11。JPY/海外実額、国内独自日付、null/0、端数、正本ID参照を確認 |
| R2 別市場の海外価格 | 詳細のinternational枠、公式市場価格調査 | market-price-review-v10の7原典。BECOS同SKUと直営同商品、価格差説明の範囲を確認。店頭価格/在庫/換算額は未確認 |
| R3 価格と購入先 | MarketPurchaseLink、既存resolver、market-link-policy | 真のlinkID/公開商品/市場/完全一致host/通常URLを生成検証。承認EN広告のJA流用、偽ラベルによる任意URLを拒否。隔離広告6/6 PASS |
| R4 全表示箇所 | home/地域/カード/比較/詳細/sticky、訪問anchor | 手動価格12/12、hero日付再確認6/6、共通header12/12。日英1440/390/320。自動browserの最終値は下記実測報告を参照 |
| R5 仕様/公開/納品 | 010仕様・設計・タスク、README/operations/handoff | 型/データ/本番生成/公開設定、最終公開と全ソースを別工程で記録 |

## 不具合の発見と修正

初回価格browserは61/79。価格・購入先の照合に加えた全ルールaxeで、ブランド/言語切替/画像リンクの可視文字と読み上げ名の不一致、およびmastheadのlandmark外配置を検出した。比較表を30商品とした試験側の誤りは、元来の耳飾り20商品の実集合へ修正（単なる件数上限への変更ではない）。ヘッダーを一つのbannerにし、可視名称とリンク名を合わせた。

再確認67/79でカード番号01等を含む可視文字と上書きした画像リンク名の不一致も検出。番号追加だけでは実DOMの文字区切りと合わなかったため、不要なaria-labelを取り除いた。全カードで読み上げ用の商品名を先頭に残し、画像alt/短いAI注記/番号から自然な名前が得られる構成に修正。axeルールの除外・弱化は行っていない。初回/中間結果はmarket-stage-*initial-resultsに残す。

初回隔離広告検証では工房/技法/地域一覧の広告開示が国内カードと一致しなかった。Disclosureを実表示のjapan市場へ絞り、海外承認だけのケースを追加。最終6ケースは56/1/14/0/0/0 sponsoredで全PASS、実catalog/distの検証中不変を確認。最後のカード番号修正はアクセシブル名のみで広告判定/データ/導線に変更なし。

## 実測報告

- docs/market-stage-policy-results.json：価格11単体と市場リンクの検証方針。
- docs/market-stage-browser-results.json：最終79/79 PASS。日英×3幅、9市場差商品+未知/JPYの66詳細、全30カード/耳飾り20比較/地域/hero、18全ルールaxe0、JS/console0、6screenshots。
- docs/market-stage-manual-results.json、market-stage-hero-followup-results.json、market-stage-header-followup-results.json：目視と表示追跡。
- docs/market-stage-ad-build-results.json：隔離6ケース、通常fallback/海外承認の分離/公開設定。
- 最終型は71files、単体62/62。170HTML、8662 href/src、1177anchor、618通常/0広告、373実行script CSP hash、154 inert JSON、14旧journal移動。公開設定readinessは技術要件PASS、申請条件確認は未完了。

配信後の実測・ソース納品は完了時に追記する。現時点で未実行の公開確認を成功とは記さない。

## 限界

国内通販参考額は実店舗の値札・在庫の確認ではない。海外価格は為替換算・送料税込総額ではない。注文、店舗照会、応募、提携承認、税免除の可否確認、AdSense接続、検索流入・売上の確認は行っていない。
