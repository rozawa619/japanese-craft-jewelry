# 015 検証記録

2026-11-17。Mapsの初期unit2件と、Privacy/商品ガイドのunit7件を合わせ9件成功。型初期実測112files/0errors/warnings（Maps担当）。既存publication helperの未使用引数hintを整理。担当間の中間buildは単体画像が未登録だったためmissing soloで停止し、公開や最終buildの成功とはしていない。全50画像とMaps実装を統合後、rootが再生成して最終の実測を記録する。

## 最終ローカル

全50商品の単体図50ファイルを1254²WebP/AI XMPで統合。実prompt/自作AI参照/原本SHA/採否を記録、静的51/51と日英3幅315/315が成功。全50をcontact sheetで実見し、Tamura/SIMPRICH/PAGEの候補を修正、PAGEは薄い角丸板r2を採用。r2後の最終verifyも成功（113型/111単体/264HTML）。生URLは読めるラベルへ変更し、元hrefを維持・全300詳細で確認。

Google公式Share由来の23店舗×JAEN46固定URLを登録。URL unit2、Maps実ブラウザ9/9（2店舗×2言語×PC/320の8実描画＋未許可provider1）。初期Google通信0、close/reloadでiframe0、自前Storage不変、外部fallback継続。実寸はborder分を含めた許容範囲で検査し、初回の過剰に厳しい期待値4失敗もfirst-attemptへ保存した。

Google帰属表示を保ち、地図の画像化/転載なし。広告CMPと分けたmap-privacy説明、Google限定frame-srcを追加。広告resolver/価格市場/言語保持/退役画像除外をquality497・広告隔離6・SEOで維持。公開/ソース/原本納品は実測後に追記する。
