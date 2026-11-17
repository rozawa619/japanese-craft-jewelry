# 0.14 / 0.15 プライバシー・商品Q&A・単体AI画像の画面検証

2026-11-17にrootのstable通知後のbuildをChromeで実測し、SIRI PAGEの修正版単体画像採用後にも全体を再実行した。最終ローカルと公開版はそれぞれ315/315成功、失敗0。ローカルの初回18枚・通常viewport補足2枚・最終SIRI PAGE補足2枚に加え、公開18枚と通常viewport補足2枚も目視した。320pxの長尺撮影に固定バー等が重なる点は、通常スクロール時の表示と分けて確認した。

## 実行対象と証跡

- 実行：PowerShellで`CHECK_BASE_URL=http://127.0.0.1:4322`を設定し、`node scripts/check-privacy-depth.mjs`。
- 対象base：`http://127.0.0.1:4322/japanese-craft-jewelry/`。
- 最終run開始：2026-11-17T04:08:38.307Z、終了：2026-11-17T04:11:33.240Z。終了コード0。
- 実測正本：[`privacy-depth-stage-browser-results.json`](privacy-depth-stage-browser-results.json)。
- 初回runは03:58:10.726Z〜04:01:56.784Z、315/315成功。rootが[`privacy-depth-stage-before-page-blue-browser-results.json`](privacy-depth-stage-before-page-blue-browser-results.json)へ保存した。
- スクリーンショット：同reportの`screenshots`配列にある18枚。同じprefixの別目的の既存画像は件数に含めない。
- 既存ソースの編集はこの検証文書のみ。実測reportと撮影証跡を生成し、runtime・data・CSP・policy・検査scriptは変更していない。

## 最終ローカルの実測結果

| 検査 | 実測 |
| --- | ---: |
| 全check | 315成功 / 0失敗 |
| 公開商品 | 50 |
| 商品詳細：50商品×日英×1440/390/320px | 300 |
| 質問・回答の完全照合：各詳細3問 | 900組 |
| 出典detailsのリンク起動・開閉・出典照合 | 300 |
| Privacy：日英×3幅 | 6画面 |
| Footerから現在言語のPrivacy anchorへ実遷移 | 6 |
| Cookie / localStorage / sessionStorage確認 | 312 |
| axe全有効ルール | 12画面、違反0 |
| 本scriptのスクリーンショット生成 | 18 |
| 目視 | 初回18枚＋通常viewport2枚＋最終SIRI PAGE2枚 |
| page / console error | 0 / 0 |
| 外部リソース / 広告・CMP関連リクエスト | 0 / 0 |

Privacyと商品詳細はすべてHTTP 200。全300詳細で横はみ出しがなく、Q&Aのh3/pはviewport内に収まった。検査対象としてhashを記録したQ&A・Privacy・関連表示部品・表示設定等の入力は、最終runの実行前後で同一だった。初回run完了時と最終run開始時の入力hash差分は`src/data/product-detail-images.json`だけで、Q&A・Privacy・表示部品に差分はなかった。

## 独立した期待値との照合

`catalog.json`のpublished集合を正本とし、`product-buying-guides.json`のキー集合との完全一致を要求した。Q&Aの期待値はraw JSONから作り、size/findings/fasteningだけをcatalogと明示的なJA翻訳値から独立展開した。実装側の`renderBuyingGuide`等はimportしていない。

各3問の見出しと回答を全件照合し、未展開tokenがないことを確認した。回答全文を別正本へ複製せず、元データhash、照合した質問と回答hashをreportに記録した。

出典リンクから`#product-sources`を開き、guideのsource IDが商品正本に属すること、公式URL・出典名・確認日の表示を照合した。summaryで閉じる/開く操作も実施した。外部の公式ページへは移動していない。

## 単体AI画像とURLラベル

全300詳細で登録された単体画像のfigureが1件存在し、imgのdecodeが成功した。src・日英alt・naturalWidth/naturalHeightをregistryと照合し、`object-fit:contain`、captionの「AIイメージ / AI image」、理由欄から公式の実物確認ページへのリンクを確認した。

国内公式URL・商品公式URL・工房公式URLの各リンクは意味が分かるラベルで表示され、表示テキストに生のhttp(s) URLやwww.がないことを確認した。画像の形や柄が実物と一致することを、decode検査の結果から推定してはいない。

## 広告停止と選択導線

日英Privacyの6画面で、広告停止status・policy版`2026-11-17-v14`・`advertising-choices`見出しを確認した。Google Partner Ad Settings / DAA WebChoices、Googleの説明・同意要件へのhrefを照合した。外部設定はクリックしていない。targetが_blankの場合のnoopener/noreferrerと、opener不在も確認した。

全詳細のfooterで、現在言語のPrivacy内anchorへのリンクが1件あることを照合し、各幅/言語の代表詳細から実際に遷移した。このanchorは説明と外部設定への案内で、同意済みの証明やCMPの代替ではない。

fresh Chromeの独立contextでCookie・localStorage・sessionStorageを繰り返し確認し、Privacy/終了時にはIndexedDB・CacheStorage・service workerも確認した。検査中に保存内容は生じず、偽の同意バナー・受諾/拒否ボタン、広告/CMPのタグやiframeもなかった。Mapsの表示ボタンは選んでいないため、未操作時のiframe数も0だった。

外部リソース、広告/CMP関連リクエスト、page/console errorは観測範囲で0。外部URLのqueryは不要な識別子を残さないためログに保存しない。GitHubのサーバー側IP記録がないことや、Maps表示後の通信を検証した結果ではない。

## 初回18枚の目視

| 撮影対象 | 1440px | 320px | 目視内容 |
| --- | ---: | ---: | --- |
| Privacy：英語・日本語 | 2 | 2 | 広告停止の枠、将来の広告説明、地図の選択説明、外部設定リンク、見出し・段落の折返し |
| Q&A：英語の耳・ネックレス・リング | 3 | 3 | PCの3列、スマホの1列、見出し/回答/出典の順序、商品タイプごとの判断軸 |
| Q&A：日本語HARIOイヤリング | 1 | 1 | 日本語の見出し、金具/寸法の説明、出典リンク |
| 理由欄＋単体画像：英語の耳・ネックレス・リング | 3 | 3 | PCで図が左、スマホで図が上、非トリミング、AI caption、公式実物確認リンク |
| 合計 | 9 | 9 | 18枚すべて実際に開いて目視 |

代表はHARIO Little Tears、Sangetsu Irodori tombodama necklace、SIMPRICH reversible topaz/ruby chain ring。PCでは単体図と理由文の間隔があり、3列Q&Aも読み進められた。320pxでは単体図が全幅に近い正方形となり、図・caption・公式確認リンクが順に見える。Q&Aは1列に切り替わり、長い英語や日本語も横にはみ出さない。Privacyも320pxで段落・リンクが折り返され、広告の現在の停止状態と導入時の方針を区別して読めた。

### 長尺撮影の重なりと、通常viewportの補足確認

320pxの長尺sectionスクリーンショットでは、固定の商品案内バーが第3回答や理由文の途中に重なった。Q&A画像には画面上部に「Skip to content / 本文へ移動」の固定リンクも写り込んだ。画像自体・AI caption・公式確認リンクは読めるが、一部の本文が撮影画像上で隠れている。

このrunのDOM/text照合と横幅検査は、固定要素による縦方向の見かけの遮蔽を自動検出する検査ではない。rootへ報告後、通常320×844px viewportで第3回答を中央へスクロールし、スクロール後に2 animation frames待って固定バーの状態を確定させてから座標計測・viewport撮影を行った。axeや長尺element screenshotは使わず、実UIのCSSは変更していない。

| 通常viewportの代表 | 第3回答の上下端 | 固定バー上端 | 確認 |
| --- | --- | --- | --- |
| 英語HARIO Little Tears | 310.92〜532.78px | 728.56px | 全文がバーの上に表示され、読める |
| 日本語SIMPRICH reversible chain ring | 311.34〜531.95px | 739.31px | 全文がバーの上に表示され、読める |

両画面ともskip linkはtop=-100pxで画面外、activeElementはBODY。補足2枚も実際に開いて全文の可読性を確認した。座標・撮影path・方法は[`privacy-depth-stage-normal-viewport-review.json`](../artifacts/privacy-depth-stage-normal-viewport-review.json)に記録した。最初の計測ではスクロール直後にバーの非表示状態を読んだため、2 animation frames待った計測へ訂正し、訂正前のJSONも別名で保持した。

通常スクロールでこの2代表の全文を読む妨げは再現せず、長尺section captureへの固定要素の写り込みと判断した。通常viewportの補足2枚は最終run後も保持している。最終runでは既定の18画像を同名で再生成し、初回315checkのreportは別名で保持した。今後の撮影は、長いQ&Aを各問の通常viewportに分ければ、実UIを変えずに読みやすい証跡を残せる。検査scriptの補正はroot管理のため、この担当では行っていない。

## 最終SIRI PAGE画像の追加目視

修正版`solo-sirisiri-page-blue-enamel-pierced-earrings-r2-v14.webp`の採用後に、英語1440pxの理由sectionと、日本語320×844pxの通常viewportを新しく撮影して目視した。

- `artifacts/privacy-depth-stage-final-page-blue-en-1440.png`
- `artifacts/privacy-depth-stage-final-page-blue-ja-320.png`
- 実測：[`privacy-depth-stage-final-page-blue-review.json`](../artifacts/privacy-depth-stage-final-page-blue-review.json)。

どちらも薄い角丸四角の小板として見え、一隅のわずかなめくれと淡い葉・扇の模様を確認できた。筒状には見えない。図・AI caption・公式の実物確認リンクが順に読め、画像の切れや横方向のはみ出しはなかった。両画面でHTTP 200、r2画像のsrc、1254×1254px、contain、registryの日英alt、「AI image / AIイメージ」、生URLではない公式確認ラベルを確認した。

最終315checkにもSIRI PAGEの日英×3幅の6checkが含まれ、全6件が成功した。この目視はAIイメージの表示と形の確認であり、実物の仕様や販売数量の証明として扱わない。

## 公開版の検証

rootがapplication commit `f7805ed9489706d08743da4b8091f2a154ff7131`、Actions run `44016172889`の成功をAPI確認した旨を通知した後に、公開サイトへ同じ検査を実施した。runtimeや公開設定の変更は行っていない。

- 対象：`https://rozawa619.github.io/japanese-craft-jewelry/`。
- 環境変数：`CHECK_BASE_URL=https://rozawa619.github.io`、`CHECK_REPORT_PATH=docs/privacy-depth-stage-hosted-browser-results.json`、`CHECK_SCREENSHOT_PREFIX=privacy-depth-stage-hosted`。
- 実行：`node scripts/check-privacy-depth.mjs`。2026-11-17T04:19:00.215Z〜04:24:16.118Z、終了コード0。
- 公開版正本：[`privacy-depth-stage-hosted-browser-results.json`](privacy-depth-stage-hosted-browser-results.json)。ローカル最終reportと初回reportは保持した。

| 公開版check | 実測 |
| --- | ---: |
| 成功 / 失敗 | 315 / 0 |
| 公開商品 / 商品詳細 / 質問回答照合 | 50 / 300 / 900組 |
| 出典開閉・表示照合 | 300 |
| Privacy / Footer実遷移 / storage確認 | 6 / 6 / 312 |
| axe画面 / 違反 | 12 / 0 |
| 本scriptの撮影 / 追加通常viewport撮影 | 18 / 2 |
| page error / console error | 0 / 0 |
| 外部リソース / 広告・CMPリクエスト | 0 / 0 |

公開版でも全300詳細の単体画像decode・登録src・日英alt・寸法・contain・AI caption・公式実物確認リンクが成功した。SIRI PAGEのr2画像も日英3幅の6件で成功した。Q&A900組の全文と出典、Privacyの広告停止状態・外部設定href、各言語Footerの遷移を確認し、地図未操作時のiframeは0だった。検査対象入力hashは実行中不変で、最終ローカル完了時と公開版開始時の入力hash差分も0だった。

reportの`screenshots`配列にある公開18枚をすべて実際に開いて目視した。PCの3列Q&A、図を左に置いた理由欄、スマホの1列Q&A・上置き単体図、日英Privacyの折返しはローカルと同様だった。単体図・AI caption・公式確認リンクに欠けはなく、新たな見た目の不具合は認めなかった。

長尺captureには固定バーとskip linkの写り込みが同様にあるため、公開版の通常320×844px viewportでも英HARIO・日SIMPRICH ringの第3回答を中央へスクロールし、補足2枚を撮影・目視した。第3回答下端は532.78 / 531.95px、固定バー上端は728.56 / 739.31px。両方で全文がバーより上にあり、skip linkも画面外だった。補足証跡は[`privacy-depth-stage-hosted-normal-viewport-review.json`](../artifacts/privacy-depth-stage-hosted-normal-viewport-review.json)と、そのrecordsに記録した2枚。実UIや撮影用CSSは変更していない。

## 範囲と引継ぎ

公開版とローカル版の同一検査は、別の`CHECK_REPORT_PATH` / `CHECK_SCREENSHOT_PREFIX`で保存済み。最終ビルド、広告起動防止の否定fixture、地図を選択した後の動作、公式外部リンクの到達性、SEO全体、公開とソースZIPはroot側の014/015記録を参照する。

この画面検査は、記載した幅・遷移・未操作状態での観測であり、AdSenseの合格、法令への適合、将来の広告/CMP接続後の動作を保証するものではない。

