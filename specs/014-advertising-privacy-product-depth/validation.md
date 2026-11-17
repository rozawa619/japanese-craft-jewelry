# 検証記録

2026-11-17開始。0.13の50公開/48画像/248canonicalを継承。今回の結果はprivacy-depth-stageへ分ける。AdSenseの合否、Googleアカウント接続、CMP認定/設定、商用host適合は技術テストと区別し、実行していない完了を作らない。実測と公開結果を完了後に追記する。

## 最終ローカル

R1/R2: 日英Privacy・10一次資料・off固定state/環境flag拒否・footer導線を実装。unit3と静的4、ブラウザPrivacy6/footer6/storage312、広告/CMP通信0。

R3/R4/R5: 公開50品に日英各3問・計300問答、対象商品の出典と正本token。unit4、実読記録first/second、35旧表現の訂正。日英3幅300詳細で900問答とsource300操作を確認。未知token/価格URL複製/完全一致回答を拒否する。

R6: 最終verify 113型ファイル0/0/0、111単体、264HTML/370生成物、通常1016/広告0。新機能315/315、quality497/497、Maps9/9、隔離広告6/6、SEO248canonical/100商品meta。最終315は2026-11-17T04:11:33.240Z完了・入力hash不変。全件315の一つ前のrunはbefore-page-blueとして保存し、r2後の最終runと区別。

途中build/Maps期待値/撮影合成の扱いはdocs/verification.mdとprivacy-depth-verification-v14.md。R6公開とR7納品は実測後に追記し、Google合格や法令/ホスト適合を成功項目に含めない。

## 公開後の最終検証

公開補足初回の一時503/178HTMLまでの部分結果はhosted-first-attemptへ保持。同URLをfresh Chromeで200確認後、アプリ無変更で補足全件を再実行した。下記248/98は最終runの実測。

アプリf7805ed9489706d08743da4b8091f2a154ff7131、Actions44016172889 completed/success（2026-11-17T04:18:28Z、GitHub API実測）。公開315/315・商品導線497/497・Maps9/9・公開メタ1/1成功。公開補足24/24で248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像の200/全SHA一致を確認。Mapsを選ばない検査で広告/CMP/外部通信0、Mapsは別の任意表示検査で確認した。全結果はprivacy-depth-stage-hosted-*に保存。公開確認後の追加は文書・証跡と納品scriptのみで、アプリ370生成物のbytesは配信検証時と一致する。

## 最終ソース・原本の納品

全ソース754ファイル、公開98画像を含む集合と全件SHA256を照合。完了記録を含め再書出し・ZIP化し、同じ全件検査を行う。ZIP自身のhash/bytesはZIP外のpackage-verification-0.14.0.json。原本50PNG＋manifest/READMEの52エントリーも全件SHA一致、原本ZIP71,967,973bytes、SHA fbb38b7bbaaebc86d2c1950ff1e389109f56341adebde46d35eeb906f331bfe1（originals-verification-0.14.0.json）。新規画像はbuilt-in image_gen、全実promptはimage-generation-solo-v14.json。私的QA画像と補足JSONは隣接delivery/screenshots/0.14.0へ分離し、文中artifacts参照はローカル証跡で公開素材/ソースZIPの実行依存ではない。
