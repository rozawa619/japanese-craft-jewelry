# 引継ぎ — 0.7 素材の広がりと日英の入口

更新日：2026-11-16。AGENTS.md → docs/constitution.md → specs/007-balanced-jewelry-discovery/ → 本書 → docs/operations.mdの順で読む。007は、006の長い画像注記と広い年齢設定を、最新ユーザー指示に沿って更新する仕様。

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
| 仕様・設計・タスク・検証対応 | specs/007-balanced-jewelry-discovery/ |
| 商品・分類・工房・販売店・地域・価格・広告 | src/data/catalog.json |
| 日本語表示文 | src/data/translations/ja.json |
| 独自の商品本文 | src/content/products/ とproducts/ja/ |
| 見出し・導入・3ポイント・装い | src/data/product-stories.json |
| 日付つき一次資料 | docs/research/sources.json |
| 今回の調査取込記録 | docs/research/nonwood-glass-v7.json、nonwood-metal-v7.json |
| 日英導線と検索設定の調査 | docs/research/discovery-review-v7.md |
| おすすめの表示順 | src/config/selection.ts |
| 現行画像対応 | src/data/editorial-images.json |
| 画像の用途・権利・世代 | docs/assets.json、docs/image-generation*.json |

調査提案JSONを表示用の別catalogにしない。共有数値・広告URLはstoryやMarkdownへ複製しない。localizedPricesもcatalogだけを更新する。安定ID・slugは維持し、旧journal14件は固定のnoindex移行口。空の都道府県ページは作らない。

## AI画像と人物

現行registryは13画像で15商品へ対応する。C/Dのピアスとイヤリングはそれぞれ画像を共有し、18K商品は抽象装飾。既存の30歳前後に見える人物は残し、年代が上に見えた星形・バー・木のペンダントは30代前半の設定で更新。追加人物も32〜34歳を中心とする架空の成人日本人女性で、かわいい・個性的・落ち着いた雰囲気の違いを保つ。

最新ユーザー指示により、画像近くのcaptionは日本語「AIイメージ」、英語「AI image」のみ。About／選定方針もAI制作の短い説明にする。006以前の「実物写真・正確な再現ではない」という長文を公開captionへ戻さない。

内部管理では生成イメージと実物写真を区別し続ける。生成画像は実物の柄・寸法・金具・fitの証拠でも試着レビューでもない。catalog.imageAssetIdsへ混ぜず、registry・実ファイル・台帳・prompt記録をまとめて更新する。現行ファイルはregistryを正本とし、過去世代の画像が残っていても現行13画像の数へ重複計上しない。許諾のない公式写真や内部確認スクリーンショットをpublic・Git・納品ソースへ入れない。

## 広告・安全・公開条件

全プログラム／商品リンクは未申請。実申請・契約・承認・紹介料発生はない。広告化は、実際の対象merchant・programと商品リンクの両承認・許可された有効HTTPS URL・完全一致host・確認日が揃う場合だけ。停止・不正・欠落は通常URLへ戻り、通常も不正ならCTAなし。同じlocale別リンクをCTAとDisclosureに使う。

Contactはユーザーの明示方針により非公開。メールやGitHub Issuesを代用窓口として出さず、架空の本人情報を作らない。readinessの技術公開と、提携先ごとの規約・参加資格・入力条件を区別する。申請前はdocs/pre-application-checklist.mdを確認し、申請送信は運営者が実際の条件を読んで判断する。

CSP、JSON-LD安全化、Actionsの権限分離・SHA固定、秘密値の除外を維持。広告URLだけなら外部scriptは不要。解析・フォーム等を追加する場合は別仕様で外部送信とPrivacyを見直す。

## 検証と配信の確認先

この文書の構成説明から、検証や公開の成功を推測しない。今回の実行件数・対象commit・完了時刻は次を確認する。

- specs/007-balanced-jewelry-discovery/validation.md：007要件との対応。
- docs/discovery-stage-*.json：今回の日英・画面・価格・広告・公開の実測。
- docs/deployment-results.json：version0.7.0の配信commit、Actions、公開先。旧versionなら007の配信証拠にしない。
- docs/verification.md：検証説明。過去版の節はその版の履歴。

PC1440／390／320、日英入口・同じページの切替、端数価格、locale別通常／広告リンク、素材・複合・0件・解除、全現行画像、短いAIcaption、詳細開閉、追従CTA、Contact404、canonical/hreflang/sitemap/robotsを確認する。検索エンジンへの掲載や流入、地域別の速度、売上は別に測る。

## 全ソースと更新

リポジトリ：https://github.com/rozawa619/japanese-craft-jewelry

公開先：https://rozawa619.github.io/japanese-craft-jewelry/ 、/en/、/ja/。全ソースはworkspaceのjapanese-craft-jewelry-delivery/sourceとZIPへ書き出す。registryが参照する現行画像・台帳・日英本文・仕様・検証scriptとレポートを含め、.env・認証情報・node_modules・dist・内部参照写真を除外する。

次の変更では007とoperationsを読み、一次資料→catalog／sources→訳文／本文／story→画像対応→必要な検証→配信確認→資料・納品の順で更新する。

## 履歴 — 0.6以前

0.6は木8＋切子／磁器2の10商品・3都県・3技法・AI7画像。配信commit5abfec84a230b2326f50ad9ea479eed76fff4688、Actions43847763433 success、2026-11-16 19:24:48 JSTに公開123/123・96画面＋補足13/13を確定した。Contactなし・SORAを確認済み。当時の長いAI注記と幅広い年齢設定は007で置き換える。

clear-stage-*.jsonは0.6、appeal-*.jsonは0.5、selection-*.jsonは0.4の履歴として保持する。古いITO名、神奈川のみ、Contact必須、旧画像数、旧captionを最新へ戻す根拠にしない。
