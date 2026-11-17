# 0.15 モバイル調整と画面検証

2026-11-17。共通スタイルはsrc/styles/global.css、再実行する検査はscripts/check-mobile-refinement.mjsとscripts/check-mobile-touch.mjs。地域の代表画像・Sources・価格・店舗表示の各部品は担当を分けて統合した。本書はローカル実測の範囲であり、公開後の結果は別reportへ保存する。

## 調整の根拠と変更

変更前の既存previewを日英4ルート×6画面サイズの48画面で確認した。横はみ出しは0だったが、320pxでは言語ボタンが78×42px・文字10px、絞込selectが12px・並べ替えが11px、2列selectの値を読む領域が約83pxだった。日本語の一覧見出しは末尾「を。」だけが次の行に残り、地図の送信説明は10px、「閉じる」は10px・高さ32pxだった。元の記録と画像はartifacts/mobile-baseline-v15*に残す。

共通CSSでは次を調整した。

- 言語切替を44px以上・スマホ文字12pxへ。メニューと各リンクにも十分な高さを持たせ、開いたメニューは短い画面でも枠内をスクロールできるようにした。幅420px以下では装飾的な極小ブランド副題を隠し、主名称と操作部を保った。
- 幅1000px以下の絞込・並べ替えを16px・高さ48pxへ。420px以下は一列とし、長い選択値を読む幅を確保した。解除ボタン、ラベル、結果の補足も調整した。
- 日本語の狭幅一覧見出しを28〜34pxへ調整し、末尾だけが孤立する状態を解消した。「気になったら、お店で。」も320pxで自然に読める幅へ調整した。
- 商品カードの紹介文、商品名の補足、公式情報への副導線、footerを読みやすくした。単独の主要リンクは高さ44pxを確保した。通常の文章中リンクや装飾的captionまで一律44pxとしたものではない。
- 固定の商品リンクにsafe-areaの余白を加えた。focus・anchor移動時のscroll余白を確保し、出典を開くリンクが固定バーに隠れないことを実測した。幅720px以下かつ高さ500px以下の短い横画面では固定バーを出さない。

統合側では地図の送信説明を12px、「閉じる」を12px・高さ44px以上へ変更した。価格の市場ラベルも拡大し、価格直下の確認日を折りたたみ内へ移した。Sourcesはnative detailsを使い、日付・購入根拠・店舗の確認日を閉じた状態から必要に応じて読める。

## 最終ローカル検査

Node v24.22.3、fresh Chrome、安定preview http://127.0.0.1:4323/japanese-craft-jewelry/ で実行した。通常のviewport確認に加え、390pxではisMobile・hasTouchを有効、DPR2とした。Chrome上のエミュレーションであり、Safari・iOS・物理端末の実測とは扱わない。

| 検査 | 結果 |
| --- | --- |
| [responsive本体](visual-mobile-stage-mobile-results.json) | 92/92成功、失敗0、終了コード0 |
| 日英6ルート×7サイズ | 84画面 |
| 追加 | 直接hash2、JavaScript無効4、実地図2 |
| source操作 | 120パネルの開閉確認 |
| 小さな代表画像 | 112表示で所属・編集順・path・alt・caption・decode・contain照合 |
| axe | 10画面、違反0 |
| 本体撮影 | 16枚 |
| [実タップ補足](visual-mobile-stage-touch-results.json) | 4/4成功、失敗0、終了コード0 |
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
~~~

本書の92＋4を、全商品の全端末・すべてのブラウザ・公開後の保証へ拡大しない。全体の商品導線、価格、全出典、セキュリティ、公開設定、配信commit、公開後の同検査はそれぞれの最終記録を参照する。

