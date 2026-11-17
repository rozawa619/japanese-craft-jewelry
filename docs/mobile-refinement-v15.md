# 0.15 モバイル調整と画面検証

2026-11-17。見出しと出典処理の競合を修正後、最終ローカルと最終公開の両方で92＋4＋12検査が成功した。最終公開アプリは1f0021306e87ce9e7dc43bdf446cffedc59e4134。共通スタイルはsrc/styles/global.css、再実行する検査はscripts/check-mobile-refinement.mjs・check-mobile-touch.mjs・check-source-anchor-race.mjs。地域の代表画像・Sources・価格・店舗表示の各部品は担当を分けて統合した。初回、初回公開、失敗履歴、最終ローカル、最終公開を以下で区別する。

## 調整の根拠と変更

変更前の既存previewを日英4ルート×6画面サイズの48画面で確認した。横はみ出しは0だったが、320pxでは言語ボタンが78×42px・文字10px、絞込selectが12px・並べ替えが11px、2列selectの値を読む領域が約83pxだった。日本語の一覧見出しは末尾「を。」だけが次の行に残り、地図の送信説明は10px、「閉じる」は10px・高さ32pxだった。元の記録と画像はartifacts/mobile-baseline-v15*に残す。

共通CSSでは次を調整した。

- 言語切替を44px以上・スマホ文字12pxへ。メニューと各リンクにも十分な高さを持たせ、開いたメニューは短い画面でも枠内をスクロールできるようにした。幅420px以下では装飾的な極小ブランド副題を隠し、主名称と操作部を保った。
- 幅1000px以下の絞込・並べ替えを16px・高さ48pxへ。420px以下は一列とし、長い選択値を読む幅を確保した。解除ボタン、ラベル、結果の補足も調整した。
- 日本語の狭幅一覧見出しを28〜34pxへ調整し、末尾だけが孤立する状態を解消した。「気になったら、お店で。」も320pxで自然に読める幅へ調整した。
- 商品カードの紹介文、商品名の補足、公式情報への副導線、footerを読みやすくした。単独の主要リンクは高さ44pxを確保した。通常の文章中リンクや装飾的captionまで一律44pxとしたものではない。
- 固定の商品リンクにsafe-areaの余白を加えた。focus・anchor移動時のscroll余白を確保し、出典を開くリンクが固定バーに隠れないことを実測した。幅720px以下かつ高さ500px以下の短い横画面では固定バーを出さない。

統合側では地図の送信説明を12px、「閉じる」を12px・高さ44px以上へ変更した。価格の市場ラベルも拡大し、価格直下の確認日を折りたたみ内へ移した。Sourcesはnative detailsを使い、日付・購入根拠・店舗の確認日を閉じた状態から必要に応じて読める。

## 初回ローカル検査（見出し・出典競合の修正前）

Node v24.22.3、fresh Chrome、安定preview http://127.0.0.1:4323/japanese-craft-jewelry/ で実行した。通常のviewport確認に加え、390pxではisMobile・hasTouchを有効、DPR2とした。Chrome上のエミュレーションであり、Safari・iOS・物理端末の実測とは扱わない。

| 検査 | 結果 |
| --- | --- |
| [responsive本体](visual-mobile-stage-before-heading-mobile-results.json) | 92/92成功、失敗0、終了コード0 |
| 日英6ルート×7サイズ | 84画面 |
| 追加 | 直接hash2、JavaScript無効4、実地図2 |
| source操作 | 120パネルの開閉確認 |
| 小さな代表画像 | 112表示で所属・編集順・path・alt・caption・decode・contain照合 |
| axe | 10画面、違反0 |
| 本体撮影 | 16枚 |
| [実タップ補足](visual-mobile-stage-before-heading-touch-results.json) | 4/4成功、失敗0、終了コード0 |
| 補足の内訳 | 日英の実タップ操作2、日英section撮影グループ2 |
| 補足撮影 | 8枚 |

本体は04:47:44.865Z〜04:52:02.291Z、補足は04:52:38.805Z〜04:53:06.559Z。画面サイズは320×740、360×780、390×844、768×1024、768×430、667×375、1440×1000。対象はhome、商品一覧、神奈川の産地ページ、浜松屋ピアス、長い英語商品名のSaskia Diez磁器カフ、Privacy。

本体のSource・CSS・表示部品等14入力は開始前後のSHA256が一致した。全84代表画面で横はみ出しがなく、通常の表示・Source操作中に外部リソースを読み込まなかった。地図の明示表示後のGoogle通信は別の操作として扱った。

## 操作と照合の範囲

- スマホのメニューをEnterで開き、Tabで最初のリンクへ進み、閉じる。デスクトップ/タブレット側のnavigationも操作領域を測った。
- 絞込の種類と産地を選び、raw catalogから独立して求めた公開商品の集合と照合し、解除後に50品へ戻ることを確認した。
- Sourceは初期closed・日付と購入根拠が非表示。Enterで開閉でき、日付は開いた中で保持される。直接#product-sourcesを開く場合は自動で展開する。JavaScript無効でもnative summaryで開閉できる。入れ子のsource detailsはない。
- 固定バーはスマホ縦画面に限って表示し、リンクの位置がバーより上に収まることを測った。短い横画面・タブレット・デスクトップでは表示しない。
- homeの5種類と神奈川の3種類の代表図は、published・種別・地域・編集順をraw catalogと表示順IDから別に展開して照合した。全14地域の所属網羅は[別担当の画像監査](visual-mobile-stage-type-images-results.json)と全体quality検査の範囲と区別する。
- 390pxの実タップではメニュー→商品一覧→native select→言語切替の往復→商品→Source開閉まで操作した。選択した種類・産地とhashが言語切替後も保たれた。外部通信とpage errorは0だった。
- 実地図2件では明示表示、閉じるの操作領域・文字、閉じた後のiframe削除と表示ボタンへのfocus復帰を確認した。地図のprovider・copyright等の詳しい検査は[Maps9結果](visual-mobile-stage-maps-results.json)を参照する。

## 目視とraw撮影の限界

メニュー、絞込、Source、種類/産地の代表画像、一覧見出し、地図の主要画像を直接目視した。homeの小画像は種類の見分けに使え、神奈川の小画像も対応する種別・価格と一緒に読めた。日本語の一覧見出しで「を。」だけが残る状態は解消した。

本体の*-live-map-*.png 2枚はGoogle内のpin・帰属表示を描画する前の状態を撮っていたため保持し、地図の最終描画や帰属表示の証拠には使わない。重複してChromeを起動せず、copyrightとfonts待機を含む別のMaps9が9/9成功した記録を参照した。artifacts/visual-mobile-stage-map-hamamatsuya-hatajuku-main-{ja,en}-320.png の2枚はこちらでも目視し、pin・Googleロゴ・©・規約と拡大した説明/閉じるが読めることを確認した。

補足の*-region-choices-320.pngは長いsectionの撮影状態でskip linkが重なり、本体のJA768×430 filter撮影はスクロール途中の余白を含んだ。rawを消さず、通常viewport画像と幾何・キーボードの実測を優先する。撮影時の状態だけをアプリの表示不具合や、逆に全場面の成功の根拠にはしない。別担当の通常viewport補足はartifacts/visual-mobile-stage-type-images-normal-{ja,en}-home-320.pngと同type-images-{ja,en}-tokyo-320.png。地図タイルを含む画像は私的QA証跡であり、公開画像資産や埋込み地図の代替にはしない。

## 再実行

安定した最終buildのpreviewを使い、buildと同じbaseを指定する。ローカルと公開の出力名は分け、既存raw記録を消さない。

~~~powershell
$env:CHECK_BASE_URL='http://127.0.0.1:4323'
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:CHECK_REPORT_PATH='docs/visual-mobile-stage-mobile-results.json'
$env:CHECK_SCREENSHOT_PREFIX='visual-mobile-stage-mobile'
node scripts/check-mobile-refinement.mjs
$env:CHECK_REPORT_PATH='docs/visual-mobile-stage-touch-results.json'
$env:CHECK_SCREENSHOT_PREFIX='visual-mobile-stage-touch'
node scripts/check-mobile-touch.mjs
$env:CHECK_REPORT_PATH='docs/visual-mobile-stage-source-anchor-race-results.json'
node scripts/check-source-anchor-race.mjs
~~~

本書の92＋4を、全商品の全端末・すべてのブラウザ・公開後の保証へ拡大しない。全体の商品導線、価格、全出典、セキュリティ、公開設定、配信commit、公開後の同検査はそれぞれの最終記録を参照する。

## 公開後の同検査（産地見出しの追加調整前）

アプリdc90c1d7893ba07d60ff8e462a1e5750c0c070ac、Actions44021129109のcompleted/success（2026-11-17T05:02:11Z、rootがGitHub APIで観測）通知後に実行した。実行先はhttps://rozawa619.github.io/japanese-craft-jewelry/、Node24.22.3。ローカルのreport・画像を上書きせず、hosted専用の出力先を使った。

- [公開responsive本体](visual-mobile-stage-hosted-before-heading-mobile-results.json)：05:03:06.807Z〜05:08:24.311Z、92/92成功、失敗0、終了コード0。日英6ルート×7サイズの84画面と直接hash2・JavaScript無効4・実地図2、source操作120、代表画像112表示、axe10画面/違反0、撮影16枚。対象14入力の開始前後SHA256が一致した。
- [公開実タップ補足](visual-mobile-stage-hosted-before-heading-touch-results.json)：05:03:05.392Z〜05:04:13.215Z、4/4成功、失敗0、終了コード0。日英390px・mobile/touch/DPR2の実タップ操作2とsection撮影グループ2、撮影8枚。種類/産地の絞込と解除、言語切替後のquery/hash保持、商品への移動、Source開閉を確認した。操作中の外部通信とpage errorは0。

公開のhome、言語/メニュー、320px絞込、日本語/英語の一覧見出し、homeの種類別代表画像、神奈川の代表図、320pxの商品Source、768×430pxの絞込を目視した。種別小画像の対応とAI caption、拡大した操作部品、初期は閉じて必要時に読める出典/確認日の反映を確認できた。

公開の実タップ直後の390px Source画像2枚はsmooth scrollの途中を撮っていた。JAは白地、ENは移動中の訪問欄だったためrawを保持し、Sourceの最終位置の証拠にはしない。公開商品への直接hash遷移でSourceが画面内に入り、scroll位置が8フレーム安定してから日英各1枚を別名で補足撮影した。Source先頭は約43.5pxで、商品・国内/海外価格の確認日、購入根拠、公式出典が読めた。補足はartifacts/visual-mobile-stage-hosted-touch-{ja,en}-390-sources-settled.png、観測記録はartifacts/visual-mobile-stage-hosted-touch-scroll-settled.json。既存reportと24枚のraw撮影を置き換えていない。

長いregion section撮影のskip link重なりや初期地図paintの限界も、上のローカルrawと同じ扱いを継承する。DOM/操作・幾何検査の成功と、撮影タイミングで写っているものを区別した。共有build・アプリsourceを公開検査中に変更していない。

この92＋4の完了後、別担当の目視で日本語RegionalChoiceGuideの390px見出しに末尾「ぶ？」が残る行組みを確認した。今回の自動検査はその文字単位の孤立まで判定していない。rootがこの公開記録を追加調整前として保持し、見出し限定のCSS調整とローカル/公開の重点再検証を別に行う。ここに記録した92＋4を、その後の未実行検証の成功に読み替えない。

## 見出し・出典競合修正後の最終ローカル確認

産地見出しは狭幅でtext-wrap:balanceを使うよう調整した。その後の再実行は05:13:19.903Z〜05:16:05.619Zに88/92成功・4失敗・終了コード1となった。[失敗の原本](visual-mobile-stage-mobile-final-first-attempt-results.json)と16枚の画像を保持する。失敗はJA長文商品390px、JA浜松屋768px、JA長文商品768px、EN長文商品390pxのSource開閉だった。画像の退避prefixはvisual-mobile-stage-final-first-attempt-mobile、初回の92＋4と初回公開の92＋4はbefore-headingのreportとして保持している。

これはアプリの重複処理による実際の競合だった。商品ページのclick handlerが同期的にSourceを開き、その直後にsummaryを閉じても、遅れて届くhashchangeの共通handlerが再度開いていた。JA浜松屋768pxの診断では、閉じた906.7msの後にhashchangeが912.9ms、再展開toggleが914.7msに届き、その後の「開く」Enterが閉じる操作へ反転した。activeElementはsummary、hashは#product-sourcesのままで、200ms待っても反転後の状態を保った。イベント・hash・focus・openの診断6flowはartifacts/visual-mobile-stage-final-details-timing-diagnostic.jsonへ残した。

rootはSourcesの共通moduleにページ内source anchor処理を一本化した。通常の対象クリックでpreventDefaultし、history.pushStateでhashを更新して一度だけ開き、商品ページ側の重複handlerを削除した。初期URLと履歴のhashchangeによる展開は保った。明示的なリンク移動では移動先Sourceのsummaryへfocusし、次のTabがSource内へ進む。ロード/履歴移動でfocusを強制しない。

修正後の安定preview4323をNode24.22.3で再検証した。92本体の同期状態assertを緩めず、アプリの修正と迅速操作の追加回帰検査で解決を確認した。

| 最終ローカル検査 | 結果・時刻 |
| --- | --- |
| [responsive本体](visual-mobile-stage-mobile-results.json) | 92/92成功、失敗0、終了コード0。05:24:16.883Z〜05:28:33.865Z |
| [実タップ補足](visual-mobile-stage-touch-results.json) | 4/4成功、失敗0、終了コード0。05:24:08.193Z〜05:24:58.136Z |
| [Source競合回帰](visual-mobile-stage-source-anchor-race-results.json) | 12/12成功、失敗0、終了コード0。05:24:11.461Z〜05:25:15.475Z |

最終92は7サイズ・日英6ルート、source操作120、代表図112表示、axe10画面/違反0、地図2、撮影16枚を含み、14入力のSHA256が開始前後で同じだった。最終touch4は実タップ2flowと撮影2groupで8枚。画像はfinal2-mobile/final2-touch prefixに分け、以前のrawを上書きしていない。

競合回帰は日英×390/768px×浜松屋/長文カフの8flowで、実guide link→native summary closeを同一taskで実行、一時的なgeneric source子anchor→closeも同一taskで実行、実Enter→summary Enterで直ちに閉じる、の計24迅速操作を確認した。イベントキュー後も閉じたままで、対象のページ内移動によるhashchange二重処理は0だった。通常クリック、summary focus、次TabがSource内へ進むこと、直接fragment、戻る/進むでも確認した。さらにJavaScript無効の日英×390/768pxの4ケースでnative summaryの開閉と情報表示を確認した。回帰検査の対象2入力も前後SHA256が一致した。

この段階ではローカルの確認までを完了した。配信後の確認は次節の別hosted reportへ記録する。

## 最終公開確認（見出し・出典競合修正後）

アプリ1f0021306e87ce9e7dc43bdf446cffedc59e4134、Actions44024678465のcompleted/success（2026-11-17T05:32:16Z、rootがGitHub APIで観測）通知後、https://rozawa619.github.io/japanese-craft-jewelry/ で同じ3検査をNode24.22.3・fresh Chromeで実行した。

| 最終公開検査 | 結果・時刻 |
| --- | --- |
| [responsive本体](visual-mobile-stage-hosted-mobile-results.json) | 92/92成功、失敗0、終了コード0。05:38:45.804Z〜05:44:25.582Z |
| [実タップ補足](visual-mobile-stage-hosted-touch-results.json) | 4/4成功、失敗0、終了コード0。05:38:42.824Z〜05:39:56.130Z |
| [Source競合回帰](visual-mobile-stage-hosted-source-anchor-race-results.json) | 12/12成功、失敗0、終了コード0。05:38:39.898Z〜05:41:26.337Z |

92本体は日英6ルート×7サイズの84画面、直接hash2・JavaScript無効4・実地図2、source開閉120、代表図112表示、axe10画面/違反0、撮影16枚。14入力の開始前後SHA256は同じだった。実タップ4は390pxのmobile/touch/DPR2による日英2操作flowと日英2撮影groupで、撮影8枚。絞込・解除、言語切替後のquery/hash、商品への移動、出典開閉を確認した。

公開の競合回帰でも24迅速操作すべてで閉じた状態を保持した。guideとgeneric子anchorによる同一taskのクリック→閉じる、実Enter→即閉じる、明示移動後のsummary focus→次TabがSource内、通常の開閉、直接fragment、戻る/進む、JavaScript無効4ケースを確認した。対象2入力も開始前後SHA256が一致した。

画像はvisual-mobile-stage-final2-hosted-mobileとfinal2-hosted-touch prefixで保存した。日本語/英語のhome種類別画像、一覧見出し、メニュー、Source本文を直接目視し、公開最終版への反映を確認した。初回dc90の公開記録はbefore-heading、88/92の実失敗と16画像はfinal-first-attempt、最終ローカルはfinal2として保持している。撮影は上記rawのscroll/paintタイミングによる限界を継承し、最終公開の操作・focus・状態判定は各reportを正本とする。

検証中に共有アプリsource・CSS・buildを変更していない。Chromeのエミュレーションの範囲であり、Safari・iOS・物理端末や将来のすべての表示を保証するものではない。注文・申請・問い合わせや、広告の有効化は行っていない。

