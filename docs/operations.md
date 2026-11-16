# 商品の追加・訴求・公開手順

更新日：2026-11-16。AGENTS、constitution、specs/005-product-appeal/を先に読む。Japanese Craft Jewelryは商品セレクトを中心とした日英の静的紹介サイト。ブログ、カート、注文受付、決済、発送、DB、CMSはない。商品追加のために読みもの記事を作る必要はない。0.5の商品詳細はデザインの魅力・装い・価格/販売先を先に置き、仕様・配送・出典を閉じたdetailsで確認する。

## 基本操作

Node.js 24.22.1以上、pnpm 11.25.0。依存を変えない更新ではlockfileを保持する。

```text
pnpm install --frozen-lockfile
pnpm dev
pnpm verify
pnpm readiness
pnpm check:browser
pnpm check:ads
pnpm check:links
```

開発はdev、本番生成はbuild、生成済みdistの確認はpreview。待受先は127.0.0.1で、URL/ポートは起動結果を確認する。verifyは型・参照・単体・ビルド・生成リンクを検査する。外部の403/503等を閉鎖と即断しない。readinessの設定不足は依存しない制作と分けて記録する。

## 1. 商品と作り手を追加する

1. 公式商品・工房・販売店の一次資料を確認し、docs/research/sources.jsonへ安定ID、URL、題名、実確認日、支える主張を追加する。価格・通貨・税・在庫・送料・返品を混同しない。
2. src/data/catalog.jsonのmakers/merchantsに必要なレコードを追加する。販売店住所から製造地を推定せず、不明な製造者や生産地は不明と示す。
3. productsにsrc/lib/schema.tsに沿う商品を追加する。ID/slugを安定させ、種別、素材、工房、産地、技法、出典を結ぶ。不明仕様はnull、未確認の産地や未許諾の写真IDは空配列。別商品の値を複製したまま公開しない。
4. src/content/products/＜商品ID＞.mdとproducts/ja/＜同ID＞.mdへ独自の商品紹介を書く。frontmatterはproductId/publishStatus、日本語はlocale: ja。紹介の中心は具体的なデザインの魅力・選んだ理由・服との合わせ方。商品種別の前提（ピアス穴がある等）を推薦理由にしない。商品未使用なら試着レビューを作らない。購入前の確認点はcatalogのwhatToCheck等に残し、下部detailsで読めるようにする。価格/広告URL/仕様の正本はcatalogのままにする。日本語の表示文はsrc/data/translations/ja.jsonの同商品IDへ追加する。
5. 商品/販売店の組み合わせをlinksへ登録する。未承認の初期値はprogramId:null、affiliateUrl:null、applicationStatus:not_applied、affiliateLinkVerifiedAt:null。officialProductUrlはその販売店の実在する商品・公式カタログへ向け、merchantのホストと一致させる。
6. 写真を使う場合のみ許諾を取得してdocs/assets.jsonへ記録する。AI着用イメージは下記の独立registryへ登録し、実物写真のimageAssetIdsへ混ぜない。
7. 最初はdraftで確認する。公開条件の日英本文・訳文・出典・共有事実が揃ってからcatalogと商品本文をpublishedへ。かんざし等の現在の対象外はdraftを維持する。
8. 商品一覧はpublished商品から生成される。トップで選ぶ商品はsrc/config/selection.tsのheroProductId/featuredProductIdsを安定商品IDで更新する。新規IDは実在する公開商品にし、欠品をおすすめ候補へ混ぜない。トップの順序を商品価格や本文に埋め込まない。
9. verifyとPC/390/320の画面で、魅力の導入・価格・主CTA前開示・閉じた詳細・画像なし/AI画像・日英切替・絞込を確認する。スマホ追従CTAは初期非表示、主CTA通過後のみ表示、フッターで非表示を実測する。

## 商品の見せ方を更新する

src/data/product-stories.jsonを安定productIdで登録し、src/lib/product-stories.tsのstoryFor(productId, locale)から読む。全公開商品にen/jaの両方で次を揃える。

- headline：デザインや装いへの期待が伝わる短い見出し。
- standfirst：何に惹かれて選ぶかを伝える短い導入。
- highlights：3件。形・模様・コーディネートなど、その商品を選ぶ具体的な切り口。
- outfit.title / outfit.body：具体的な服の組み合わせと装いの提案。

ここへ価格、寸法/重量などの技術仕様、広告URL/承認状態を複製しない。表示ラベルと事実データは従来のcatalog/訳文から読む。共通読込や必要項目を変える場合はschema/validation/日英/共通テンプレートを一緒に見直す。

丸山C/Dの星状/縦長バー・矢羽根状の模様は公式画像の実視を根拠に紹介できる（docs/research/product-merchandising.md）。画像から寸法・金属組成・重さ・快適性を決めず、現物の柄の完全一致も保証しない。作り手が特定できない商品カードは「取り扱い：実在販売店」を使い、販売店をメーカーにしない。不明情報は下部の詳細に残す。

## 2. 画像を追加・変更する

AI着用画像はsrc/data/editorial-images.jsonを商品IDで参照する。実際の画像はpublic/images/へ保存し、寸法と日英alt、assetIdを揃える。共通表示部品のAI/非実物captionを常時見えるままにする。短縮する場合も「AIであり、紹介商品の実物写真/正確な再現ではない」という区別を画像の近くに残し、detailsの中だけに隠さない。画像は商品の柄・寸法・金具・fitの証拠や試着実績ではない。制作prompt/方法はdocs/image-generation.json、用途と権利状態はdocs/assets.jsonへ記録する。公式写真は許諾なく取得・転載・ホットリンクしない。

## 3. 産地・技法・分類を追加する

catalogのprefectures/crafts/materials/productTypesは独立マスタで、商品側のID配列から結ぶ。技法にはsourceIds、日本語表示にはtranslations/jaの同IDを用意する。

産地本文はsrc/content/places/＜prefectureId＞.mdとplaces/ja/、技法本文はsrc/content/crafts/＜craftId＞.mdとcrafts/ja/。地域のfrontmatterはprefectureId/relatedMerchantIds、技法はcraftId。ファイル名と対応IDを一致させる。日英のpublished本文、独自の空でない背景情報、出典、同じ産地/技法に結ぶ公開商品1件以上を揃える。販売店だけでは製造地属性や地域公開条件を満たさない。

産地・技法の公開ページは商品一覧を主役にし、背景説明を折りたたみに置く。日付/著者/読了時間を付けたブログに戻さない。画面は共通ルートで生成し、神奈川専用コードを地域ごとに複製しない。未調査の47都道府県や商品なしの空分類を公開しない。

## 4. 商品本文・価格・出典を更新する

商品本文はproducts、見出し/導入/3つのポイント/装いはproduct-stories、分類背景はplaces/crafts、運営方針はpoliciesで更新する。旧guidesは日英12ファイルの下書き保管であり、公開導線として使わない。現方針では新しいブログ記事を追加しない。

一次資料を読み直した項目だけcatalogのlastVerifiedAt/priceCheckedAtやsourcesの確認日を更新する。価格・通貨・税・数値・広告URLを商品本文や日本語表示へ二重入力しない。確認していない全項目の日付を一括更新せず、在庫はその時点の観測として示す。

商品slugは原則維持する。変更が必要なら移行先を用意し、内部リンクとsitemapも更新する。旧journal移行口は記事本文を出さず、固定した適切な商品/一覧/分類へmeta refresh 0で案内する。noindex、canonicalなし、sitemap対象外を保ち、任意URLを移行先にできる仕組みを加えない。

## 5. 提携承認後に広告リンクへ切り替える

詳細はdocs/affiliate-operations.mdを優先する。公開募集の存在は当サイトや商品別の承認ではない。

1. 公式管理画面/契約で対象ドメイン・商品・販売店・深いリンク・写真・開示文言・計測/支払・禁止事項を確認する。BECOS承認を他店の商品へ適用しない。
2. programsのmerchantIdsと実際のapplicationStatusを設定する。affiliateAllowedHostsには承認リンクで確認した完全一致のホストだけを小文字で列挙する。空配列は全広告先不許可。ワイルドカード、URL、パスは入れない。
3. 対象linksへprogramId、実際のaffiliateUrl、applicationStatus:approved、確認日affiliateLinkVerifiedAtを設定する。program側もapprovedが必要。officialProductUrlは通常への戻し先として保持する。架空のIDを作らない。
4. 指定の開示文言があればprograms.disclosureを更新。主CTA前のcompact開示、実際の先、sponsored、通常リンクとの差を日英で確認する。主CTA・繰り返しCTA・スマホ追従CTAは同じRetailerLink/承認resolverを使い、追従だけ別URLや別状態にしない。最初の広告ボタンより前の開示を保ち、verifyとcheck:adsを実行する。
5. 公開後に実URLと転送先を確認する。無断の自己購入・テスト注文・架空成果を作らない。停止はprogramまたはlinkをpausedにして再配信する。不正URL/未許可host/確認日欠落も通常へ戻り、通常URLも不正ならCTAなし。

APIキーや管理画面の認証情報はcatalog/PUBLIC_へ入れない。広告script・解析・フォーム等を加える場合はdocs/security.mdに従い別仕様として外部送信/CSP/Privacyを見直す。CSPを一括で無効にしない。

## 6. ブランド・言語・公開設定を変える

表示名と説明はsrc/config/site.ts、見た目はsrc/config/tokens.cssとstyles。商品セレクトの並びはselection.ts。ブランド変更時は本文/方針/申請草稿も確認する。

/en/と/ja/は同じ商品slugで対になる。本文はCollectionのja/、表示文はi18nとtranslations/ja、商品の訴求はproduct-storiesのen/ja。同じ商品・分類・方針のID/出典を保ち、未確認の仕様を翻訳だけで補わない。右上ボタンを1つに保ち、商品詳細と一覧のquery/hashを往復確認する。

.env.exampleは設定名の見本。PUBLIC_SITE_URLは実HTTPS origin、PUBLIC_BASE_PATHは/japanese-craft-jewelry/、PUBLIC_PUBLISH_MODEはpublicまたはpreview、PUBLIC_OPERATOR_NAMEはユーザー指定のSORA、PUBLIC_REPOSITORY_URLは実在repoを使う。PUBLIC_CONTACT_EMAILは実受信できる値だけ設定し、未提供なら作らない。PUBLIC_は公開情報であり秘密値を入れない。

## 7. 公開・検証・引継ぎ

リポジトリはhttps://github.com/rozawa619/japanese-craft-jewelry。既存のGitHub Actionsでreadiness/verify後にPagesへ配信する。公開先はhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。

1. verify、必要なbrowser/ads/linksを実行し、結果と未実行を記録する。
2. Gitへ保存してpushし、Actionsの対象headとsuccessを確認する。
3. 実URLで日英の商品導線、短い見出し/装い/価格/CTA、閉じた補助情報、AI/非実物caption、スマホ追従CTAの表示条件、絞込、SORA、Contact、広告状態、canonical/hreflang、robots/sitemap、404、旧journal移行を確認する。publicとpreviewの検索設定を混同しない。
4. docs/deployment-results.json、verification.md、handoff、仕様005のtasksを実測に更新し、全ソースとZIPも書き出す。過去のレポートを新バージョンの成功へ読み替えない。

GitHub Pagesのrobotsはプロジェクト配下に置かれる。検索エンジンのroot robotsと区別し、各HTMLのindex/noindexも確認する。独自ドメインへの移行時はHTTPS/base/正規URL/robots/CSP/Contactを再確認する。検索登録・申請送信・承認・成果は公開成功と別に記録する。

## 0.5検証の記録区分

ローカル実測済み：型0エラー/0警告/0ヒント、42単体、56HTML・1819href/src・43アンカー・172通常/0広告・14旧移動。ローカル81/81・54画面、最終カード6/6、広告5/5、公開81/81＋補足10/10が完了。最新配信はbe3d316、Actions43839206515 success。完了後に実行した版とreportを記録する。0.4以前のreportは履歴として残す。販売店クリック、承認成果、報酬・売上改善はそれぞれ別の実測であり、構成変更やbuild成功から達成したと扱わない。
