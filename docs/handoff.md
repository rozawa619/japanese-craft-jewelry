# 引継ぎ — 0.10 日本で買う参考価格

更新日2026-11-16。AGENTS.md → constitution → specs/010-market-prices/ → 本書 → operationsの順に読む。公開成否はdeployment-resultsのversion/commit/Actionsと実URLで確認し、旧版の検証を成功へ転用しない。

## 現在の構成

Japanese Craft Jewelryは日英の商品セレクト。SORAが運営者表示。ブログ/Contact/販売決済なし。上部1ボタンで同じ商品/産地/絞込へ言語切替。全30商品、12都道府県、13技法、28AI画像。画像未登録0で18K未登録は解消。旧0.8の詳細はarchive/handoff-v8.md。

home/objects/placesは左に産地、右に代表1品を共通RegionSelectionで表示。地域名→地域内の商品群、代表画像→商品詳細。全商品と組合せフィルターはobjects/#all-jewelry以下で維持。種類/素材の入口はquery+このanchorへ着地する。

## 価格表示の最新方針

言語と購入市場を分離する。主価格は日英とも日本向けオンライン参考額。catalogの海外ストアpriceAmount/priceCurrencyは実額のまま保持し、localizedPrices.jaと別に管理する。market-prices.tsがcanonical商品IDから国内/海外の額・日付・出典・通常URLを選び、MarketPrice/MarketPurchaseLinkでhero/地域/カード/比較/詳細/stickyを揃える。

星華アンバーの26400円税込はBECOS日本向けと凛然直営通販で確認。BECOS同一SKUの日英比較に加え、直営品は商品名/色/セット/寸法の一致を確認（共通メーカーSKUの公開は未確認）。Global288USDは別ストアの販売価格。Global公式FAQは国際向けサービスを反映する設定と説明するが、SKU差額の内訳や全送料税込みとは確認しない。実店舗の値札/在庫を推定せず、国内通販の参考価格と呼ぶ。

ENの国内参照とJAの海外参照は通常公式URL。現在のページ言語に合う元リンクだけ既存広告resolverを使う。MarketPurchaseLinkの市場/実linkIDはgenerated checkerでも検証し、market属性だけの任意URL許可やEN広告のJA流用を拒否。Disclosureは実際の市場/linkIdsで絞る。USD50.40等の端数と国内固有の確認日、未知/nullと実数0の区別を保つ。

商品詳細の主CTAと追従CTAは国内価格に対応する国内URL、店舗案内へは既存VisitGuideのanchor。Global価格とGlobal購入先は別枠。初めての価格調査はdocs/research/market-price-review-v10.json。更新と検証はoperationsの0.10節とspec010へ。010の配信/実測はmarket-stageとdeployment-resultsで確認。009の確定配信はarchive/deployment-results-v9.json、詳細はarchive/handoff-v9.md。

## TOP10の意味

観光庁2025年暦年確報・表6-1、全目的/全国籍地域/複数回答の都道府県訪問率。東京50.8、大阪41.3、千葉35.1、京都29.7、福岡11.0、神奈川9.3、奈良9.0、山梨8.1、北海道7.3、愛知6.9%。人数/宿泊数/アクセサリー売上人気と呼ばない。佐賀・石川は順位外の別枠。各TOP10地域に2点以上ある。

原典の抽出/確認日はresearch/tourism-top10-v9.json。表示設定はsrc/config/region-selection.ts。公式XLSはhttps://www.mlit.go.jp/kankocho/content/002025515.xls 。新年度への変更は比較可能な通年確報を確認してから行う。

## 新規14商品

- 大阪: PREMIUM PEARLの泉州貝パール、スタッド/スウィング。貝パール部材が泉州産。正確な個別工房・全組立地は未確認。養殖/天然真珠ではなく人工真珠。
- 千葉: 鴨川アルコスの宇宙神秘スパイラルペンダント/宇宙のキラキラブレスレット。現代スタジオガラスで国指定を主張しない。旧Switchbackは展示作品のため採用していない。
- 福岡: CO.COON oriイヤリング/フレームピアス。博多織の糸/布との関連。公開カタログは価格・金具合金・寸法未公表なのでnull。全組立工程が福岡との断定なし。
- 奈良: 大和漆工芸杉村の宝相華螺鈿ペンダント/蒔絵指輪蓮。ペンダントの土台詳細は不明。指輪は木製でサイズ変更不可、作り直し案内。Wixの未入力テンプレ文を返品等の条件へ流用しない。
- 山梨: 甲府SIMPRICH水晶しゃぼん玉ピアス/ローズクォーツネックレス。水晶ピアスは白蝶貝との貼合せ。採掘地/個別の伝統工芸認証を主張しない。
- 北海道: 小樽幸愛硝子Mint Veil/Rouge Veil。公式の片方約8–10gという範囲を単一のweightPerPieceGrams値へ変換しない。
- 補完: 京都・中嶋象嵌のナシ型桜/ラインドット両面ペンダント、愛知・加藤七宝SUKE丸透リング。後者はEN USD84、JA JPY7700の実価格とリンクを分離。

## 正本と更新

商品/事実/広告はcatalog.json、訳はtranslations/ja.json、独自見出し/装いはproduct-stories.json、本文はcontent/products。地域・技法本文は対応Collection。出典はdocs/research/sources.json（132件）。researchの取込proposalは変更時の資料であり表示用の第二catalogにしない。

店舗13を25商品へ案内し、5商品（CHECOS、泉州2、CO.COON2）は公式の通販/販売案内。店舗の裏付けがなければMapsを推測しない。visits.jsonとlib/visits.ts/VisitGuideを使用。通常の公式URLを広告CTAと分離したまま必ず残す。GoogleMapsは固定の外部search/directionsのみ。写真/地図/口コミの転載なし。掲載方法の法務確認はvisit-publication-reviewとv8の範囲/限界を継承。

全プログラムと広告リンクは未申請。承認二重ゲート、許可host完全一致、HTTPS、日付、locale分離を維持。広告CTA承認後も公式URLは通常リンクとして残す。AdSenseへの接続/プライバシー変更/申請は今回行っていない。申請に必要な本人情報や連絡先を作らない。

## 画像

現行registryは28画像/30商品。13画像の肌編集＋18Kを含む15新規。27–33歳方向の架空成人日本人女性、かわいい/美人の違いを混ぜる。表記はAIイメージ/AI imageのみ。画像を実物の寸法/金具/着用経験の根拠にしない。公式画像は許諾なしで公開しない。

現行はeditorial-images.json、権利はdocs/assets.json、全prompt/元生成ファイル/参考URL/目視はimage-generation-v9.json。ARCOSの個別SKU画像CDNは制限で読めず、公式一般galleryと商品本文からの独自イラストであることを内部に保持。原典の内部スクリーンショットはartifactsで公開/Git/ソース納品から除外。

Windowsで削除できない退役7画像はlocalRetiredPathと.gitignore/Git除外で管理。pnpm build末尾のprune-retired-imagesはdistから該当ファイルだけを取り除く。package-sourceも除外。現行画像まで一括削除しない。

## 検証・公開・納品

型/62単体/データ/生成サイトはpnpm verify。現行の価格検証はmarket-stage-*.jsonと010validation。地域/画像の009検証はdestination-stageを履歴として保持。browserは全30商品と日英PC/390/320、regions専用は10順位と全60地域/代表クリック往復、広告は隔離fixture。最後の画像見切れ等を修正したら該当画面を再確認し、未再確認を完了としない。

配信はGitHub Pages https://rozawa619.github.io/japanese-craft-jewelry/ja/ と /en/。ソース https://github.com/rozawa619/japanese-craft-jewelry 。Git push/Actions成功/実配信SHAとブラウザ確認は別工程。最終の確定結果はdeployment-resultsとverificationに残す。

全ソースは隣接japanese-craft-jewelry-delivery/sourceとZIPへ再出力。.env/認証/node_modules/dist/artifacts/内部参照写真は入れない。運用手順はoperations、申請前はpre-application-checklistとaffiliate-readinessを参照。
