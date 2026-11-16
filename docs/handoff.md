# 引継ぎ — 0.8 公式情報と現地への案内

更新日：2026-11-16。AGENTS.md → docs/constitution.md → specs/008-official-links-and-visits/ → 本書 → docs/operations.mdの順で読む。008は007の素材構成と日英導線を維持し、年齢の目安を20代後半〜30代前半へ更新して、全商品の公式URLと現地への案内を追加する仕様。

## 現在のサイト

Japanese Craft Jewelryは、日本各地の工芸ジュエリーを英語・日本語で選んで紹介するサイト。運営者表示はSORA。ピアス・イヤリング・ネックレス・ブレスレットが対象で、商品ごとのデザインと装いを主役にする。ブログ、Contact、当サイト内の販売機能は設けない。

掲載構成は16商品（木8、木以外8）、6都府県、6技法。神奈川・東京・佐賀に石川・京都・愛知を加え、寄木／切子／有田焼／銀線の仕事／京友禅／尾張七宝を紹介する。新しい非木6商品は、葉の雫ペンダント、青のbouquetピアス、磁器カフ、CHECOSの銀の耳飾り、Morphosphereの布の耳飾り、加藤七宝の耳飾り。個別の認証・部品原産地や肌への適合は推測しない。

トップと一覧は素材の偏りを抑えた共通のおすすめ順を使い、実公開商品がある種類・素材・産地へ案内する。商品紹介は短い見出し・画像・価格・公式リンク・ポイントから始め、素材・寸法・出典を下部の閉じたdetailsへ置く。

## 日英の入口と価格・リンク

共通URLは英語・日本語を選ぶ入口。端末言語をもとに候補を見つけやすくするが、強制自動遷移はしない。固定の/en/と/ja/は維持し、右上の1ボタンで同じ商品・分類・方針へ切り替える。一覧のquery/hashも保つ。

BECOS商品は同一SKUの両ストアを確認してから、EN→英語ストア、JA→日本語ストアへ案内する。catalogのlinks.localeで選び、価格事実はproduct.localizedPrices.jaで管理する。日本語表示のJPYと英語表示のUSDは各ストアの実額で、為替換算しない。USD50.40のような端数も残す。

日本語BECOSリンクのprogramIdはnull、広告URL／確認日はnull、状態はnot_applied。英語プログラムを承認しても日本語storeへ広告を流用しない。locale無しの共有リンクは、両言語で同じ行き先を意図する場合だけ使う。実際のリンク先の言語と、海外発送可能という事実は区別する。

## 正本と担当

| 情報 | 正本 |
| --- | --- |
| 仕様・設計・タスク・検証対応 | specs/008-official-links-and-visits/ |
| 店舗・商品関係・公式ホームURL・未確認時の代替 | src/data/visits.json |
| 訪問データ検証・地図URL生成・公式情報表示 | src/lib/visits.ts、src/components/VisitGuide.astro |
| 店舗掲載方法の確認と限界 | docs/visit-publication-review.md、research/visit-publication-legal-v8.json |
| 商品・分類・工房・販売店・地域・価格・広告 | src/data/catalog.json |
| 日本語表示文 | src/data/translations/ja.json |
| 独自の商品本文 | src/content/products/ とproducts/ja/ |
| 見出し・導入・3ポイント・装い | src/data/product-stories.json |
| 日付つき一次資料 | docs/research/sources.json |
| 今回の調査取込記録 | docs/research/nonwood-glass-v7.json、nonwood-metal-v7.json |
| 日英導線と検索設定の調査 | docs/discovery-review-v7.md |
| おすすめの表示順 | src/config/selection.ts |
| 現行画像対応 | src/data/editorial-images.json |
| 画像の用途・権利・世代 | docs/assets.json、docs/image-generation*.json |

調査提案JSONを表示用の別catalogにしない。共有数値・広告URLはstoryやMarkdownへ複製しない。localizedPricesもcatalogだけを更新する。安定ID・slugは維持し、旧journal14件は固定のnoindex移行口。空の都道府県ページは作らない。

## AI画像と人物

現行registryは13画像で15商品へ対応する。C/Dのピアスとイヤリングはそれぞれ画像を共有し、18K商品は抽象装飾。人物は架空の成人日本人女性で、最新の年齢方向は20代後半〜30代前半（概ね27〜33歳）。既存の27/29歳設定と32/33歳の画像は保ち、34歳設定で上に見える2点は29/30歳を目安に更新する。かわいい・個性的・すっきりした雰囲気の違いは保つ。実際の現行ファイルと制作内容はregistry・画像台帳・最新生成記録を照合し、過去prompt自体を書き換えない。

最新ユーザー指示により、画像近くのcaptionは日本語「AIイメージ」、英語「AI image」のみ。About／選定方針もAI制作の短い説明にする。006以前の「実物写真・正確な再現ではない」という長文を公開captionへ戻さない。

内部管理では生成イメージと実物写真を区別し続ける。生成画像は実物の柄・寸法・金具・fitの証拠でも試着レビューでもない。catalog.imageAssetIdsへ混ぜず、registry・実ファイル・台帳・prompt記録をまとめて更新する。現行ファイルはregistryを正本とし、過去世代の画像が残っていても現行13画像の数へ重複計上しない。許諾のない公式写真や内部確認スクリーンショットをpublic・Git・納品ソースへ入れない。

## 全商品の公式URLと訪問案内

公開16商品すべてに、実在を確認した公式商品／公式カタログの通常URLを文字として明示する。確認できた作り手・ブランドの公式ホームURLも別に示し、作り手未特定の商品をメーカー公式と名付けない。購入CTAが将来広告化しても、VisitGuideの公式商品URLは通常リンクのまま残す。

正本はsrc/data/visits.json。storesに8店舗の住所・営業時間・アクセス・独自紹介・在庫注意・mapQuery・sourceIds・checkedAtを置き、productsのproductId/storeIdsで15商品へ関連付ける。全16商品にproductsの行が必要。公式ホームはofficialHomeUrlとmaker/retailerの役割を対で記録する。CHECOS1商品は現行常設店を確認できていないためstoreIdsを空にし、fallbackで公式取扱店の通販へ案内する。過去の催事や登記住所で地図を埋めない。

清六窯・加藤七宝の事前連絡案内を保つ。公開店舗やブランド取扱いが確認できても、特定SKUの店頭在庫を断定しない。日英の訪問文と出典・確認日を一緒に更新する。相手店舗への連絡案内を、自サイトのお問い合わせ窓口の再作成と混同しない。

Googleマップの場所検索・経路リンクはsrc/lib/visits.tsがmapQueryから生成する。固定のgoogle.com/maps/search/または/maps/dir/、api=1、エンコード済み店舗名／住所を使い、originや利用者の位置を収集しない。写真・ロゴ・地図・口コミの転載や地図埋込はせず、CSPを弱めない。

法務の調査は確認した掲載方法の根拠と限界を示す資料で、全面的な適法性の保証ではない。公式の基本情報を独自文で紹介し、問題がある利用形態は外部の公式情報・行き方・買い方への案内へ置き換える。長い法務説明を公開商品ページへ追加しない。

## 広告・安全・公開条件

全プログラム／商品リンクは未申請。実申請・契約・承認・紹介料発生はない。広告化は、実際の対象merchant・programと商品リンクの両承認・許可された有効HTTPS URL・完全一致host・確認日が揃う場合だけ。停止・不正・欠落は通常URLへ戻り、通常も不正ならCTAなし。同じlocale別リンクをCTAとDisclosureに使う。

Contactはユーザーの明示方針により非公開。メールやGitHub Issuesを代用窓口として出さず、架空の本人情報を作らない。readinessの技術公開と、提携先ごとの規約・参加資格・入力条件を区別する。申請前はdocs/pre-application-checklist.mdを確認し、申請送信は運営者が実際の条件を読んで判断する。

CSP、JSON-LD安全化、Actionsの権限分離・SHA固定、秘密値の除外を維持。広告URLだけなら外部scriptは不要。解析・フォーム等を追加する場合は別仕様で外部送信とPrivacyを見直す。

## 検証と配信の確認先

この文書の構成説明から、検証や公開の成功を推測しない。今回の実行件数・対象commit・完了時刻は次を確認する。

- specs/008-official-links-and-visits/validation.md：008要件との対応。
- docs/visit-stage-*.json：今回の日英・公式URL・店舗・地図・画像・画面・広告・公開の実測。
- docs/deployment-results.json：version0.8.0の配信commit、Actions、公開先。旧versionなら008の配信証拠にしない。
- docs/verification.md：検証説明。過去版の節はその版の履歴。

PC1440／390／320、日英入口・同じページの切替、端数価格、locale別通常／広告リンク、素材・複合・0件・解除、全現行画像、短いAIcaption、全16商品の公式URL、8店舗／15商品の訪問案内、地図検索／経路URL、CHECOSの代替案内、詳細開閉、追従CTA、Contact404、canonical/hreflang/sitemap/robotsを確認する。検索エンジンへの掲載や流入、地域別の速度、売上は別に測る。

## 全ソースと更新

リポジトリ：https://github.com/rozawa619/japanese-craft-jewelry

公開先：https://rozawa619.github.io/japanese-craft-jewelry/ 、/en/、/ja/。全ソースはworkspaceのjapanese-craft-jewelry-delivery/sourceとZIPへ書き出す。registryが参照する現行画像・台帳・日英本文・仕様・検証scriptとレポートを含め、.env・認証情報・node_modules・dist・内部参照写真を除外する。

次の変更では008とoperationsを読み、一次資料→catalog／sources→訳文／本文／story→画像対応→必要な検証→配信確認→資料・納品の順で更新する。

## 履歴 — 0.7以前

0.7の配信commitはc9bc21d985de62981e6fdf32587a6baa95fcf37f、Actions43853333783 success。公開補足18/18で86正規URLと13画像等を確認した。132画面の全公開ブラウザ検証は未実行のまま008へ持ち越しており、007のローカル132画面の成功を公開検証へ読み替えない。discovery-stage-*.jsonは007の履歴として保持する。

0.6は木8＋切子／磁器2の10商品・3都県・3技法・AI7画像。配信commit5abfec84a230b2326f50ad9ea479eed76fff4688、Actions43847763433 success、2026-11-16 19:24:48 JSTに公開123/123・96画面＋補足13/13を確定した。Contactなし・SORAを確認済み。当時の長いAI注記と幅広い年齢設定は007で置き換える。

clear-stage-*.jsonは0.6、appeal-*.jsonは0.5、selection-*.jsonは0.4の履歴として保持する。古いITO名、神奈川のみ、Contact必須、旧画像数、旧captionを最新へ戻す根拠にしない。
