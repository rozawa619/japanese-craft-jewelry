# 015 検証記録

2026-11-17。Mapsの初期unit2件と、Privacy/商品ガイドのunit7件を合わせ9件成功。型初期実測112files/0errors/warnings（Maps担当）。既存publication helperの未使用引数hintを整理。担当間の中間buildは単体画像が未登録だったためmissing soloで停止し、公開や最終buildの成功とはしていない。全50画像とMaps実装を統合後、rootが再生成して最終の実測を記録する。

## 最終ローカル

全50商品の単体図50ファイルを1254²WebP/AI XMPで統合。実prompt/自作AI参照/原本SHA/採否を記録、静的51/51と日英3幅315/315が成功。全50をcontact sheetで実見し、Tamura/SIMPRICH/PAGEの候補を修正、PAGEは薄い角丸板r2を採用。r2後の最終verifyも成功（113型/111単体/264HTML）。生URLは読めるラベルへ変更し、元hrefを維持・全300詳細で確認。

Google公式Share由来の23店舗×JAEN46固定URLを登録。URL unit2、Maps実ブラウザ9/9（2店舗×2言語×PC/320の8実描画＋未許可provider1）。初期Google通信0、close/reloadでiframe0、自前Storage不変、外部fallback継続。実寸はborder分を含めた許容範囲で検査し、初回の過剰に厳しい期待値4失敗もfirst-attemptへ保存した。

Google帰属表示を保ち、地図の画像化/転載なし。広告CMPと分けたmap-privacy説明、Google限定frame-srcを追加。広告resolver/価格市場/言語保持/退役画像除外をquality497・広告隔離6・SEOで維持。公開/ソース/原本納品は実測後に追記する。

## 公開後の最終検証

公開補足初回の一時503/178HTMLまでの部分結果はhosted-first-attemptへ保持。同URLをfresh Chromeで200確認後、アプリ無変更で補足全件を再実行した。下記248/98は最終runの実測。

アプリf7805ed9489706d08743da4b8091f2a154ff7131、Actions44016172889 completed/success（2026-11-17T04:18:28Z、GitHub API実測）。公開315/315・商品導線497/497・Maps9/9・公開メタ1/1成功。公開補足24/24で248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像の200/全SHA一致を確認。Mapsを選ばない検査で広告/CMP/外部通信0、Mapsは別の任意表示検査で確認した。全結果はprivacy-depth-stage-hosted-*に保存。公開確認後の追加は文書・証跡と納品scriptのみで、アプリ370生成物のbytesは配信検証時と一致する。

## 最終ソース・原本の納品

全ソース754ファイル、公開98画像を含む集合と全件SHA256を照合。完了記録を含め再書出し・ZIP化し、同じ全件検査を行う。ZIP自身のhash/bytesはZIP外のpackage-verification-0.14.0.json。原本50PNG＋manifest/READMEの52エントリーも全件SHA一致、原本ZIP71,967,973bytes、SHA fbb38b7bbaaebc86d2c1950ff1e389109f56341adebde46d35eeb906f331bfe1（originals-verification-0.14.0.json）。新規画像はbuilt-in image_gen、全実promptはimage-generation-solo-v14.json。私的QA画像と補足JSONは隣接delivery/screenshots/0.14.0へ分離し、文中artifacts参照はローカル証跡で公開素材/ソースZIPの実行依存ではない。
