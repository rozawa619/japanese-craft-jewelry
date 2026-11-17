# 0.14 検証（2026-11-17）

最新は014/015とprivacy-depth-stage各JSON。前版の確定値はarchive/verification-v13.mdへ保存。公開Actions/公開検査/納品の確定状態はdeployment-results.jsonを優先する。

| ローカル検査 | 結果 |
| --- | --- |
| 最終verify | 113型ファイル0error/0warning/0hint、111単体成功 |
| 生成物 | 264HTML/370ファイル、15393href/src、2298anchor、通常リンク1016/広告0、701実行script CSP hash、248JSON、14旧読物redirect、退役10画像除外 |
| Privacy停止状態 | 4/4、日英version/off固定/設定導線/広告タグなし |
| 人物画像 | 49/49、48枚4,160,080bytes、旧25SHA保持 |
| 単体図 | 51/51、50品50枚2,509,816bytes、1254²、AI XMP/原本hash/採用台帳 |
| 最終新機能UI | 315/315、300詳細/900問答、source操作300、Privacy6/footer6/storage312、axe12画面0、18撮影、JS/console/外部/広告CMP通信0 |
| 商品導線 | 497/497、50品日英3幅300詳細、地域222往復、axe30画面0、22撮影 |
| Maps | 9/9、浜松屋/丸山の日英1440/320表示前後/閉じる/再読込8件＋未許可URL拒否1件 |
| 隔離広告 | 6/6、実catalog/root dist不変 |
| SEO | 248canonical/sitemap一致、相互hreflang、100商品meta/ImageObject、16noindex |
| 公開メタ共有検査 | local 1/1 |

最終ログはartifacts/privacy-depth-stage-final2-verify.log。normalized proofはstatic-results、全370生成物hashはbuild-manifest。最終315は04:08:38.307Z–04:11:33.240Z、実行中入力hash不変。全50問答のsource/token、リンク名/公式hrefを正本と独立照合。50画像のcontact sheetとPAGE r2のPC/320通常viewportを目視。

途中経緯も保持。Maps初回4失敗はborderで実寸228pxなのに230px固定とした期待値で、±2pxの9件が成功。生成中のmissing solo buildとPAGE採用途中の旧path buildは最終成功に数えない。3画像の形を採用前に修正、最後のr2後にverify/315を完走。quality497/Maps9/広告6はr2のみ差替前の成功で、各対象ロジックは以降不変。

長いsection撮影でsticky CTA/Skipリンクが写るスクロール合成の見え方を別確認した。通常320×844の2商品で回答とCTAの非重複、Skipリンク非focus時画面外を確認。撮影用CSSでUIを変更していない。詳細privacy-depth-verification-v14。

Maps選択は認定CMPではない。広告アカウント/CMP/AdSense審査/所有確認/商用host/法的適合/検索順位/流入/将来在庫は未検証。AI図は実物写真や形状一致/写真許諾の証拠ではない。申請/広告配信/契約/DNS変更なし。公開後実測と納品完了はdeployment-resultsと下記追記を確認する。
