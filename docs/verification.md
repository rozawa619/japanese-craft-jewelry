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

## 公開後の最終検証

公開補足の初回は1URLで一時503となり23/24、HTML178件までの部分結果だった。rawはhosted-first-attempt、fresh Chromeで同URLの200/正canonical/現本文を確認した記録はhosted-503-recheckへ保存。サイトを変更せず全補足を再実行し、下記の全248/98・24/24を確認した。初回の部分結果を全件成功へ数えていない。

アプリf7805ed9489706d08743da4b8091f2a154ff7131、Actions44016172889 completed/success（2026-11-17T04:18:28Z、GitHub API実測）。公開315/315・商品導線497/497・Maps9/9・公開メタ1/1成功。公開補足24/24で248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像の200/全SHA一致を確認。Mapsを選ばない検査で広告/CMP/外部通信0、Mapsは別の任意表示検査で確認した。全結果はprivacy-depth-stage-hosted-*に保存。公開確認後の追加は文書・証跡と納品scriptのみで、アプリ370生成物のbytesは配信検証時と一致する。

## 最終ソース・原本の納品

全ソース754ファイル、公開98画像を含む集合と全件SHA256を照合。完了記録を含め再書出し・ZIP化し、同じ全件検査を行う。ZIP自身のhash/bytesはZIP外のpackage-verification-0.14.0.json。原本50PNG＋manifest/READMEの52エントリーも全件SHA一致、原本ZIP71,967,973bytes、SHA fbb38b7bbaaebc86d2c1950ff1e389109f56341adebde46d35eeb906f331bfe1（originals-verification-0.14.0.json）。新規画像はbuilt-in image_gen、全実promptはimage-generation-solo-v14.json。私的QA画像と補足JSONは隣接delivery/screenshots/0.14.0へ分離し、文中artifacts参照はローカル証跡で公開素材/ソースZIPの実行依存ではない。
