# 商品・画像・広告・公開の更新手順 — 0.6

更新日：2026-11-16。AGENTS.md、docs/constitution.md、specs/006-clear-craft-selection/、docs/handoff.mdを先に読む。最新のユーザー指定ではContactを公開せず、販売・決済・発送の責任説明を公開UIへ繰り返し置かない。広告／AI開示、正確な商品情報、出典を保つ。

現在は日英の工芸ジュエリー10商品、3都県・3技法、AI着用イメージ7点を持つ静的セレクトサイト。ブログや販売機能を追加する必要はない。商品はデザイン・装い・価格・公式リンクを入口にし、詳細な仕様・出典は閉じたdetailsへ置く。

## 基本操作

Node.js 24.22.1以上、pnpm 11.25.0。依存を変えない更新ではlockfileを保持する。

    pnpm install --frozen-lockfile
    pnpm dev
    pnpm verify
    pnpm readiness
    pnpm check:browser
    pnpm check:ads
    pnpm check:links

開発はdev、本番生成はbuild、生成済みdistの確認はpreview。待受先は127.0.0.1とし、実際のURL／ポートは起動結果を確認する。verifyは型・データ・単体・ビルド・生成リンクを検査する。外部リンクの403／503等を即座に閉鎖と判定しない。readinessの技術公開判定と、提携の申請条件は別に確認する。

## 1. 一次資料から商品を追加する

1. 公式商品・工房・販売店の一次情報を確認し、docs/research/sources.jsonへ安定ID、URL、題名、実確認日、支える事実を記録する。出典の正本はsources.json。research内の調査メモや取込提案はcatalogの代わりに表示へ使わない。
2. src/data/catalog.jsonのmakers／merchants／分類マスタに必要なレコードを追加する。販売店住所から製造地を推定せず、工房との関係と商品別の生産地、技法と個別認証を区別する。
3. productsをsrc/lib/schema.tsに沿って作り、安定ID／slug、種別、素材、工房、産地、技法、出典を結ぶ。不明仕様はnull、未確認の産地や未許諾写真のIDは空配列にする。金具、重量の片耳／一組、税区分などを別商品の値で埋めない。
4. src/data/translations/ja.jsonの同IDへ日本語表示を追加する。共有価格・数値・URL・広告状態の正本はcatalogに保ち、訳文だけで事実を補わない。
5. src/content/products/＜商品ID＞.mdとproducts/ja/＜同ID＞.mdへ独自本文を書く。両方にproductId／publishStatus、日本語にはlocale: jaを付ける。デザインのどこにひかれ、どの服に合わせたいかを具体的に紹介する。ピアス穴の有無など自明な前提を推薦理由にせず、未使用の商品に試着・レビュー・軽さ・快適性の実績を作らない。
6. 商品と販売店をlinksで結ぶ。未申請ならapplicationStatus:not_applied、affiliateUrl:null、affiliateLinkVerifiedAt:nullを保つ。programIdは確認した候補プログラムの実IDまたはnullとし、IDの存在だけで提携・対象確定を主張しない。officialProductUrlは実在する商品または公式カタログで、対象merchantのホストに合わせる。
7. 下記のproduct-storiesへ日英の紹介表示を追加する。商品画像を使う場合は許諾を先に取り、AIイメージは実物写真と別のregistryへ登録する。
8. 最初はdraftで確認し、出典・共有事実・訳文・日英本文・storyが揃ってからcatalogと本文をpublishedへ変更する。かんざしなど対象外の商品はdraftを保つ。
9. 一覧はpublishedから生成する。トップに載せる商品はsrc/config/selection.tsのheroProductId／featuredProductIdsを更新する。公開商品がある素材だけを入口にし、空の地域や分類を増やさない。欠品はおすすめから外す。

新規のガラスと磁器はBECOS英語ストアの確認日のUSD表示を日英共通で使い、独自の為替換算はしない。紹介商品として掲載できることと、アフィリエイト対象として承認されることは別。

## 2. 魅力と装いの紹介を更新する

src/data/product-stories.jsonを安定productIdで管理し、src/lib/product-stories.tsのstoryFor(productId, locale)で読み込む。全公開商品にen／jaで次を揃える。

- headline：デザインや装いへの期待が伝わる短い見出し。
- standfirst：ひかれた理由を伝える短い導入。
- highlights：形・模様・コーディネートなど具体的な3項目。
- outfit.title／outfit.body：服との組み合わせの提案。

ここへ価格、寸法・重量、広告URL・承認状態を重複入力しない。丸山C／Dの形やガラスの色など、公式写真を視認して書ける内容と、写真から分からない材質組成・寸法・金具・快適性を区別する。元の柄の完全一致を保証しない。製造者不明の商品は実在の販売店を「取り扱い」と表示し、販売店をメーカーにしない。

商品本文はproducts、短い紹介はproduct-stories、背景はplaces／crafts、方針はpoliciesへ分ける。Contactと旧guidesはdraft履歴。新しいブログを作らず、旧journal14件は固定のnoindex移行口として維持する。

## 3. 7点のAI画像を保存・更新する

現在のpublic/images/には、既存2点と0.6追加5点のWebPがある。全ソースを書き出す際はこの7点を必ず含める。

| 画像 | 対応する安定商品ID |
| --- | --- |
| hakone-yosegi-pierced-styling.webp | hamamatsuya-catch-pierced |
| hakone-yosegi-clipon-styling.webp | hamamatsuya-clip |
| rinzen-amber-glass-styling-v1.webp | rinzen-seika-amber-pierced-earrings |
| arita-halfmoon-styling-v1.webp | six-kiln-half-moon-earrings |
| yosegi-star-styling-v1.webp | maruyama-clip-c／maruyama-pierced-c |
| yosegi-bar-mature-styling-v1.webp | maruyama-clip-d／maruyama-pierced-d |
| yosegi-pendant-styling-v1.webp | hamamatsuya-pendant |

7画像で9商品に対応する。星形と縦長はC／Dそれぞれの2商品で共有している。人物を別人と誤記したり、画像ファイルを商品数分だけ複製したりしない。18K商品には未登録のため抽象装飾を使う。

画像を変更するときは、次を一緒に更新する。

1. public/images/の実ファイル。残る7点を削除せず、参照切れを作らない。
2. src/data/editorial-images.jsonの商品ID、path、assetId、実寸法、日英alt。
3. docs/assets.jsonの用途・権利状態・生成記録への参照。
4. docs/image-generation.json（既存2点）またはdocs/image-generation-v6.json（追加5点）のprompt、人物、生成元、対応商品。将来の追加分も新旧を区別して記録する。

AI画像は架空の成人日本人女性と創作したアクセサリーの装いの参考。実物写真、正確な再現、金具・寸法・fitの証拠ではない。共通表示部品のAI／非実物captionを常時画像の近くに表示し、details内やaltだけに隠さない。catalog.imageAssetIdsへAI画像を混ぜない。

公式写真は内部視認にとどめ、許諾なしに転載・ホットリンクしない。内部確認用の公式スクリーンショットや生成前の参照写真をpublic、Git、納品ソースに入れない。実物写真を将来使う場合は、権利者・用途・編集範囲・期間・クレジット・撤回条件を確認し、docs/assets.jsonへ許諾の根拠を残してから登録する。

## 4. 地域・技法・素材を追加する

catalogのprefectures／crafts／materials／productTypesは独立マスタで、商品側のID配列から結ぶ。技法のsourceIds、日本語表示も用意する。素材入口はwood／glass／porcelainで、実公開商品があるものだけ出る。

産地本文はsrc/content/places/＜prefectureId＞.mdとplaces/ja/、技法はsrc/content/crafts/＜craftId＞.mdとcrafts/ja/。frontmatterのIDとファイル名を一致させる。日英published本文、空でない背景情報、出典、同じIDに結ぶ公開商品1件以上を揃える。未調査の47都道府県や商品なしの分類は公開しない。

ページは商品一覧を主役にし、背景を折りたたむ共通ルートを使う。神奈川専用の実装を複製せず、全国向けの構造を維持する。

## 5. 価格・出典を見直す

一次資料を読み直した項目だけcatalogのlastVerifiedAt／priceCheckedAtとsourcesの確認日を更新する。確認していない全項目の日付を一括更新しない。在庫は確認時点の観測で、将来の保証にしない。重量の基準、税、送料、金具などの不明値は不明のまま保つ。

商品slugは原則維持する。変更時は移行先、内部リンク、sitemap、日英の対応をまとめて更新する。旧journal移行は固定した商品／一覧／分類へのmeta refresh 0、noindex、canonicalなし、sitemap対象外を保つ。任意URLへ転送する仕組みは加えない。

## 6. 提携に申請する・承認後に切り替える

現在は未申請・未承認。申請前にdocs/pre-application-checklist.mdとdocs/affiliate-readiness.mdで現行規約・参加地域・個別商品・入力項目・画像利用・報酬条件を確認する。公開Contactは現在設けない方針で、readinessの技術必須項目ではない。申請先が窓口を求める場合は、運営者が実在の手段を用意するかプログラムを見送るか判断する。未提供の連絡先や個人情報を作らない。登録・契約・申請送信を調査のつもりで実行しない。

承認後の詳細はdocs/affiliate-operations.mdを優先する。

1. 実際の契約・管理画面で対象ドメイン、販売店、個別商品、深いリンク、開示、画像、計測・支払・禁止事項を確認する。BECOS承認を浜松屋や丸山の商品へ適用しない。
2. programsのmerchantIds／applicationStatusを実態に合わせる。affiliateAllowedHostsは承認リンクで確認した完全一致の小文字hostだけ。空配列は全広告先不許可で、ワイルドカードやURL／パスを入れない。
3. 承認対象のlinksへprogramId、実際のaffiliateUrl、applicationStatus:approved、affiliateLinkVerifiedAtを設定する。program側もapprovedが必要。通常への戻し先officialProductUrlを保持する。架空の広告IDは作らない。
4. 指定開示があればprograms.disclosureを更新し、最初の広告リンクより前に見えること、日英の文言とsponsoredが実際のリンクに一致することを確認する。主・繰り返し・追従CTAは同じ共通resolverを使う。
5. verifyと隔離広告確認を実行して配信し、実URLと転送先を確認する。無断の自己購入や架空成果を作らない。停止はprogramまたはlinkをpausedにして再配信する。不正URL・未許可host・確認日欠落は通常へ戻り、通常も不正ならCTAなし。

秘密値をcatalogやPUBLIC_へ入れない。広告script・解析・フォームを追加する場合は別仕様でCSP・外部送信・Privacyを見直す。CSPを一括無効にしない。

## 7. ブランド・言語・公開設定

名称と説明はsrc/config/site.ts、見た目はconfig／styles、選定順序はselection.tsで変更する。運営名はSORAを維持し、GitHubユーザー名を運営者として表示しない。

/en/と/ja/は同じ商品slugで対になる。Collectionのja/、translations/ja、product-storiesのen／jaを揃える。右上の言語ボタン1つで同じ商品・方針・分類へ往復でき、一覧のquery/hashを保つことを確認する。

.env.exampleは設定名の見本。公開時はPUBLIC_SITE_URLに実HTTPS origin、PUBLIC_BASE_PATHに/japanese-craft-jewelry/、PUBLIC_PUBLISH_MODEにpublic、PUBLIC_OPERATOR_NAMEにSORA、PUBLIC_REPOSITORY_URLに実repoを設定する。未使用のPUBLIC_CONTACT_EMAILを埋める必要はなく、設定だけでContact公開や到達性を保証しない。PUBLIC_は公開情報なので秘密値を入れない。

## 8. 検証・配信・全ソースの引継ぎ

リポジトリはhttps://github.com/rozawa619/japanese-craft-jewelry、正規先はhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。既存Actionsで検査後にPagesへ配信する。

1. verifyとreadiness、必要なbrowser／ads／linksを実行し、対象commit・日時・環境と未実行項目を記録する。
2. PC1440／390／320で日英の価格・CTA・広告／AI開示・閉じた詳細、追従CTAの初期非表示／主CTA通過後表示／footerで非表示を確認する。画像7点と全対応商品、素材の絞込と複合／解除／0件、言語切替、Contactリンクなしと両言語404も確認する。
3. Gitへ保存してpushした場合はActionsの対象headとsuccessを確認し、実URLで同じ操作とcanonical／hreflang／robots／sitemap／404／旧journal移行を確認する。ローカルpreviewとpublicの検索設定を混同しない。
4. specs/006-clear-craft-selection/validation.mdとtasks、docs/clear-stage-*.json、verification、deployment-results、handoffを実測に合わせる。過去レポートを今回の成功へ読み替えず、未実施は未実施と残す。
5. pnpm packageで全ソースを隣接のjapanese-craft-jewelry-delivery/sourceへ書き出し、7点のWebPと台帳・日英本文・仕様・検証記録が含まれることを確認する。node_modules／dist／認証情報／.env／内部参照スクリーンショットを含めない。ZIPは別途作成し、展開して同じソースが入ることを確認する。

GitHub Pagesのproject配下robotsとドメインroot robotsは別。HTMLのindex／noindexも確認する。独自ドメインへ移す際はHTTPS／base／正規URL／robots／CSPと、当時の公開方針を見直す。技術公開の合格は提携申請条件、承認、検索掲載、クリック・売上の証拠ではない。

0.5以前の測定はdocs/handoff.mdの履歴と過去レポートに分けて保持する。0.6の最終検証・配信状態は、その版の実行結果ファイルを優先する。
