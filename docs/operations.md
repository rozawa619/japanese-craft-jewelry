# 商品・店舗・画像・価格・広告・公開の更新手順 — 0.10

更新日：2026-11-16。AGENTS.md、docs/constitution.md、specs/010-market-prices/、docs/handoff.mdを先に読む。現行は30商品・12都道府県・13技法、28画像が全30商品へ対応。店舗13件を25商品に関連づけ、実店舗未確認の5商品は公式通販/販売案内へ進める。正本の分離とGoogleMaps外部リンク方式は008を継承。最新の実測は010validationとmarket-stage結果、地域・画像の前版実測は009validationを参照。

最新ユーザー指示は、20代後半〜30代前半の女性、全商品の公式URLと現地案内、短い「AIイメージ / AI image」表示、木以外も選べる構成、日英で使いやすい入口。Contact非公開、SORA、ブログなしを維持する。

## 基本操作

Node.js24.22.1以上、pnpm11.25.0。通常のコンテンツ更新ではlockfileを変えない。

    pnpm install --frozen-lockfile
    pnpm dev
    pnpm verify
    pnpm readiness
    pnpm check:browser
    pnpm check:ads
    pnpm check:links

本番生成はbuild、生成済みdistの表示はpreview。待受は127.0.0.1とし、実際のportは起動結果を見る。verifyは型・参照・単体・ビルド・生成リンクの検査。外部リンクの403/503等を即閉鎖としない。

## 1. 一次資料から商品を追加する

1. 公式商品・工房・販売店の本文を確認し、docs/research/sources.jsonへ安定ID、URL、題名、実確認日、支える事実を記録する。調査提案は履歴で、catalogとsourcesの別正本を作らない。
2. catalog.jsonのmakers／merchants／prefectures／crafts／materials／productTypesへ必要なmasterを追加する。販売店住所から製造地を推定せず、一般技法と個別商品の認証を分ける。
3. productsをsrc/lib/schema.tsに沿って追加する。安定ID／slug、種類、素材、工房、地域、技法、出典、確認日を揃える。不明仕様はnull。未確認地域や未許諾写真IDは空配列。weightPerPieceGramsは片耳の重さが確認できる耳飾りだけで使い、ブレスレットやネックレスの重さを流用しない。
4. translations/ja.jsonへ表示文を追加する。数値・広告URL・承認・locale別価格はcatalogが正本で、訳文だけに事実を追加しない。素材や仕上げの重要補足はwhatToCheckへ簡潔に残し、不要な取引責任の説明は公開UIへ戻さず、008で追加する店舗や通販への実用的な買い方案内と区別する。
5. src/content/products/＜ID＞.mdとproducts/ja/＜同ID＞.mdに独自本文を書く。productId／publishStatus、日本語にはlocale:jaを付ける。デザインと服の提案を書き、使用経験・レビュー・快適性・低アレルギー等を作らない。
6. product-stories.jsonへ両言語のheadline、standfirst、highlights3件、outfit.title/bodyを揃える。価格・重量・URLは重複しない。
7. 確認した通常リンクと必要ならlocale別価格を下記手順で追加する。画像は生成registryと台帳に分離する。
8. 初めはdraftで確認し、出典・本文・対訳・story・参照が揃ってからcatalogと本文をpublishedへ。かんざしはdraftを保ち、公開商品がない地域／技法は作らない。

トップと一覧のおすすめはsrc/config/selection.tsの安定商品IDを使う。新しい種類はproductTypesと日英表示、種類入口、絞込に反映する。木・ガラス・磁器・銀・布・七宝など、素材を混ぜて選べる順序にする。欠品商品をおすすめに加えない。

## 2. 日英の実価格と通常リンクを設定する

BECOS英語／日本語は別storeとして扱う。同じSKUの実ページと価格を各storeで確認し、URLの置換だけで存在や国内利用可を推測しない。日本語の404と英語の日本配送不可が分かったKAGAMI候補は採用していない。

英語のpriceAmount／priceCurrency／priceCheckedAt／taxNoteはproductsの既存フィールド、日本語の異なる実価格は同じ商品内のlocalizedPrices.jaへ置く。実装の形は次のとおり。

    localizedPrices: {
      ja: {
        amount: 27500,
        currency: "JPY",
        checkedAt: "2026-11-16",
        taxNote: "日本語ストアの税込表示。",
        sourceIds: ["実際に確認した出典ID"]
      }
    }

この数値は構造例。更新時は実ページを読んだ値にする。marketPricesFor(productId)が正本から国内参考/海外実価格を選ぶため、translations/jaや商品本文へ同じ価格を再入力しない。catalogFor(locale)による表示言語の選択と購入市場を混同しない。通貨の違いを為替換算で埋めない。USD50.40なら数値50.4を保ち、表示は50.40になることを確認する。整数への丸めや切捨て、通貨記号だけの変更はしない。

linksにはそれぞれのmerchantと通常URLを登録する。BECOSは英語側locale:en／merchantId:becos-en、日本語側locale:ja／merchantId:becos-ja。各merchantのURLと商品URLのhostを一致させる。

locale無しは共有リンクで両言語へ出る。個別localeの行と同じ共有行を不用意に重ねない。英語programのmerchantIdsや承認をJA storeへ広げず、日本語通常リンクはprogramId:null、affiliateUrl:null、applicationStatus:not_applied、affiliateLinkVerifiedAt:nullを保つ。英語リンクも承認前は通常URL。

リンクを変更したら主CTA・再掲・追従CTAの行き先、同localeのDisclosure、JPY/USDと確認日、1ボタン切替後の表示を確認する。サイト本文の言語と、リンク先の対応言語・発送先は別の事実として扱う。

## 3. 画像を20代後半〜30代前半の雰囲気で更新する

現行の対応はsrc/data/editorial-images.jsonが正本。28画像で30商品に対応し、C/Dの耳飾りは同じ柄の2商品で共有。18Kにも画像あり。ファイル名を本文へ別一覧として固定せず、registryから照合する。過去世代は公開対象外の履歴として管理し、現行数へ二重計上しない。使用中で移動できないローカル旧ファイルはGitと書出しから除外し、台帳のlocalRetiredPathへ記録する。履歴の正本はdocs/archive、現在の公開対象はregistry。

制作する人物は概ね27〜33歳の架空の成人日本人女性。既存の27/29歳と32/33歳の画像は保ち、より上に見える画像はこの範囲を目安に更新する。かわいい、個性的、すっきりした雰囲気などは変えてよい。年代が上に見える人物へ戻さない。

更新するものは次の4つ。

1. public/imagesの実ファイル。参照中の画像を落とさず、差替え世代を区別する。
2. editorial-images.jsonのproductId、assetId、path、実寸法、日英alt。
3. docs/assets.jsonの用途・権利・現行／履歴・prompt参照。
4. docs/image-generation*.jsonのprompt、設定した人物、生成元、対応商品。過去記録を今回の制作へ書き換えない。

公開captionは日本語「AIイメージ」、英語「AI image」のみを共通部品で常時表示する。About／選定方針も短いAI制作の説明を使う。旧006の長い非実物・再現免責をcaptionへ復活させない。

内部では生成イメージを実物の柄・寸法・金具・装着感や試着の証拠として使わず、catalog.imageAssetIdsへ混ぜない。今回は公式画像を内部視認にとどめ、許諾のない転載・ホットリンク・public保存をしない。内部確認スクリーンショットはGitや納品ソースへ入れない。写真を将来掲載するときは、権利者・許諾範囲・編集・期間・credit・撤回条件を記録してから別登録する。

## 4. 産地・技法・素材の入口を追加する

prefectures／crafts／materials／productTypesは独立masterで、商品のIDから関連付ける。地域と技法の本文はsrc/content/places/、crafts/と各ja/へ。日英published本文、出典、同じIDを持つ公開商品が1件以上あることを確認する。

新素材はsilver／cotton／enamel-glazeなど実際の商品素材IDを使う。素材の見出しが金属／布など広い名称でも、未確認の商品を条件に含めない。商品一覧が先、背景は折りたたみの共通ルートを保ち、空の47都道府県ページを作らない。

## 5. 日英入口と検索設定を維持する

共通URLにはEnglish／日本語を選べる入口を置く。端末言語は並びを見つけやすくするために使い、強制的に別言語へ送らない。/en/と/ja/の固定URLを保ち、右上の1ボタンで同じ商品・方針・分類へ往復する。一覧のquery/hashも保つ。

公開のcanonical／相互hreflang／title／description／OG、index、sitemap、内部リンクを日英で確認する。入口や404、旧journal移行と、検索対象の本文ページは分ける。GitHub Pagesのproject配下robotsとドメインroot robotsを混同しない。

名称と説明はsrc/config/site.ts、表示は共通layout／styles、順序はselectionで管理する。運営者はSORA。Contactは日英draft・生成なし・導線なし。旧journal14件は固定先へのmeta refresh0、noindex、canonicalとsitemap対象外で保つ。

PUBLIC_SITE_URLは実HTTPS origin、PUBLIC_BASE_PATHは/japanese-craft-jewelry/、PUBLIC_PUBLISH_MODEはpublic、PUBLIC_OPERATOR_NAMEはSORA。PUBLIC_は公開情報で秘密値を入れない。.envをGitや納品に含めない。独自domainへ移すときはHTTPS／base／canonical／sitemap／CSPと公開方針を見直す。検索への掲載・順位・流入や海外での速度は、HTMLやbuildだけで保証しない。

## 6. 提携の申請・承認後に切り替える

現在は全て未申請。docs/pre-application-checklist.mdとaffiliate-readiness.mdで現行規約、参加地域、媒体、対象商品、リンク、画像、開示、計測・報酬を確認する。Contactの不在を技術公開のエラーにせず、プログラムが実窓口や本人情報を求める場合だけ運営者が判断する。未提供の情報を作らず、調査として登録・契約・申請送信をしない。

承認後はdocs/affiliate-operations.mdも確認する。英語側の承認を日本語側や浜松屋／丸山へ流用しない。実際のprogramとmerchant、商品リンクの両承認、実在する有効HTTPSのaffiliateUrl、完全一致の許可host、affiliateLinkVerifiedAtを設定する。通常への戻し先を保持する。

CTAとDisclosureは同じlocale別集合を使い、最初の広告リンクより前に開示する。実際の広告だけsponsoredにする。停止はprogramまたはlinkをpausedにし、不正・欠落は通常へ戻し、通常も不正ならCTAなし。架空の広告IDや成果を作らない。

CSPとActionsの権限分離を維持する。広告script、解析、formを追加する場合は別仕様で外部送信・Cookie・Privacyを見直し、一括でCSPを無効にしない。

## 7. 公式URLと店舗・行き方を更新する

1. 商品の公式ページ／公式カタログはcatalog.linksのofficialProductUrlが正本。各localeの実ページとhostを確認し、src/lib/visits.tsのofficialProductLinks経由で全公開商品に通常URLを明示する。広告化したCTAとは別の通常リンクを残し、公式ページが無い商品を推測で公開しない。
2. 店舗と商品関係の正本はsrc/data/visits.json。storesにはid、日英name/address/hours/closedDays/access/visitSummary/stockNote、kind、公式URL2種、mapQuery、sourceIds、checkedAtを記録する。確認できない営業時間等はnullとし、元ページを読まずに作らない。
3. productsには公開商品ごとのproductId、storeIds、officialHomeUrl、officialHomeRole、sourceIds、fallback、checkedAtを置く。maker/retailerの役割を区別し、公式ホームURLと役割は両方設定または両方null。現行は8店舗を15商品へ対応し、CHECOSはstoreIds空と日英fallbackで公式取扱店通販へ進める。
4. 店舗が確認できても当該SKUの在庫は未確認ならそのままにする。清六窯・加藤七宝の事前連絡案内を残す。過去催事、作業場や登記住所、自治体サイトのフッター住所を現行の販売店にしない。
5. 地図URLはstoreMapLinksがmapQueryから生成する。search/dirの固定originとapi=1を維持し、店舗名と住所をエンコードする。ユーザーの現在地を収集せず、APIキー・外部script・地図埋込・写真や口コミの転載は追加しない。
6. 公式サイトの基本情報を短い独自文で案内する。法務の根拠と限界はdocs/visit-publication-review.mdとresearch/visit-publication-legal-v8.jsonを確認し、全面適法やGoogle／店舗との提携を保証しない。掲載方法に問題があれば転載等を行わず、公式情報と行き方・買い方のリンク案内に置き換える。
7. src/lib/visits.tsのschema／collectVisitValidationErrorsと対応検証を実行し、全公開productId、重複ID、storeIds、実読sourceIds、日付、URLの安全性、Googleマップのquery/destinationを確認する。VisitGuide表示で公式商品URL、公式ホームの役割、日英のアクセス、在庫注記、最終確認日を照合する。

## 8. 検証・公開・納品

検証は変更に応じてverify／readiness／browser／ads／linksを実行する。PC1440／390／320で日英入口、全商品の表示、素材の偏らない順序、絞込・0件・解除、braceletを含む種類、JPY/USDと小数、locale別リンク、短いAIcaption、現行画像、全商品の公式URL、店舗の住所・事前連絡・地図検索／経路、店未確認時の通販案内、詳細開閉、追従CTA、Contact404を確認する。

再実行scriptはscripts/check-bilingual.mjs、check-product-details.mjs、check-hosted-release.mjs等を参照。CHECK_BASE_URL、CHECK_REPORT_PATH、CHECK_SCREENSHOT_PREFIX等の各scriptが持つ設定で、localとhostedの出力を分ける。古いclear-stageレポート名の既定値を使うscriptは出力先を明示し、履歴を上書きしない。

Gitへ保存してpushした後はActionsの対象commitとsuccess、実公開URLでの反映を確認する。009のvalidation／tasks、docs/destination-stage-*.json、verification、deployment-results、handoffを実測に合わせる。未実行・旧version・未配信を成功へ読み替えない。0.7はdiscovery-stage（全公開132画面は未実行）、0.6はclear-stage、0.5はappeal、0.4はselectionの履歴。

pnpm packageで隣接するjapanese-craft-jewelry-delivery/sourceへ書出し、別途ZIPを作る。registryが参照する現行画像、日英の本文、価格・リンク・店舗関係の正本、台帳、仕様、全検証script・レポートが含まれることを確認する。node_modules／dist／artifacts／.env／認証情報／内部参照写真を除外し、ZIPの必須ファイル・展開内容も照合する。

リポジトリ：https://github.com/rozawa619/japanese-craft-jewelry

公開先：https://rozawa619.github.io/japanese-craft-jewelry/ と/en/、/ja/。技術公開、申請送信、提携承認、検索掲載、クリック・売上はそれぞれ別に確認する。

## 0.9 産地セレクトとランキングの更新

1. 観光庁の比較可能な通年確報の表6-1を確認し、research/tourism-top10-v9.jsonと同等の新年度資料へ年・指標・全目的/全国籍地域・複数回答・原典URL・確認日を記録。宿泊延べ人数や四半期値を混ぜない。
2. src/config/region-selection.tsのtourismRankingとregionalRepresentativesを更新。表示する地域に公開商品/日英地域本文を揃え、代表productIdがその地域へ属することを確認。空ページでTOP10を埋めない。代表商品は編集上の選択で、販売人気や公認を主張しない。
3. 共通RegionSelectionがhome/objects/placesへ反映。地域名は地域内商品群、右の代表画像は個別商品へ。種類/素材で直接絞るリンクは#all-jewelryで全商品欄へ着地。
4. pnpm verify、check:browser、scripts/check-destination-selection.mjsを確認。PC/390/320、日英、全10地域クリック、最低2商品、英語地名の単語途中改行、画像の耳飾り/ペンダント/指輪の見切れを目視。
5. 画像差替えはほくろ・シミを入れず、かわいい系/美人系の27–33歳方向。全prompt/元画像/参考資料/限界をimage-generation-v9.jsonの形式で記録。primarySKU画像未読のARCOSは一般作例と本文からのイラストである限界を保持。
6. 使用中で削除できない旧public画像は台帳localRetiredPathと.gitignore/Git除外を一致させる。pnpm buildはprune-retired-images.mjsでdistの該当ファイルだけを除き、pnpm packageも除外する。再帰削除や公開中画像の移動は不要。

## 0.10 国内参考価格と海外ストア価格

日英の主価格は同じ国内参考。正本はcatalogのlocalizedPrices.jaまたはJPY原値、表示はmarket-prices/MarketPrice。英語のpriceAmount（例:GlobalUSD288）を為替換算で変更しない。同じSKUでもGlobalと国内通販は別市場の価格であり、言語ボタンは市場/価格を切り替えるボタンではない。

1. 価格更新では同一SKU/色/個数を国内/海外の原典で確認。金額/通貨/各市場固有の日付/税注記/出典を正本へ記録。国内の確認日を海外の確認日で上書きしない。原典が無い価格はnull、数値0をunknown代わりにしない。
2. 店頭価格とオンライン価格を同一と推定しない。今回の凛然星華26400円はBECOS日本向けと直営通販で確認。実店舗値札と店頭在庫は未確認。新たに店頭価格を確認する場合は店舗/日付/原典を分ける仕様にし、既存国内通販値を流用しない。
3. hero/地域/カード/比較/詳細/stickyは共通MarketPrice。金額と日付と市場表示は一組。国内JPYのCTAをGlobalUSD商品URLへ向けない。MarketPurchaseLinkが国内・海外を選ぶ。
4. ENの国内参照URL、JAの海外参照URLは通常公式リンクのみ。現在ページ言語に適合する元リンクだけ既存resolverを使い、program/商品二重承認とHTTPS/host/date条件を維持。Disclosureは表示market/linkIdsだけを対象にする。
5. verifyとcheck:pricesで全9複数市場/unknown/単独JPYの両言語・3幅、カード/比較/hero/地域、店舗anchor、stickyと購入先、市場を越えた広告流用防止を確認。check-builtとmarket-link-policyは、market属性だけで外部URLを許可しない。
6. 価格差を説明する際、Global公式FAQが示す海外向けサービスの説明と、商品別差額内訳が未確認であることを分ける。差額全部が送料/全税送料込とは断定しない。market-price-review-v10.jsonが調査記録。最新検証は010validationとmarket-stage結果。
