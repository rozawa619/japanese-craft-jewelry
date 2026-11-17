# 別のAIへ引き継ぐ

確認日：2026-11-17。まずこの文書と[検証ガイド](verification-guide.md)を読めば、過去の会話や全世代の文書を読み直さず着手できる。実際の依頼・AGENTS.md・最新の公開/納品記録を優先する。

構造を調べるときは[architecture.md](architecture.md)、項目別に更新するときは[editing-guide.md](editing-guide.md)へ進む。無関係な履歴文書まで開始時に通読する必要はない。

## 現在の状態

| 項目 | 確認済みの状態 |
| --- | --- |
| サイト | Japanese Craft Jewelry。全国の工芸ジュエリーを選んで紹介する日英メディア。運営者表示はSORA |
| 公開 | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) / [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) |
| リポジトリ | [rozawa619/japanese-craft-jewelry](https://github.com/rozawa619/japanese-craft-jewelry)、main |
| 公開アプリ | `1f0021306e87ce9e7dc43bdf446cffedc59e4134`。[Actions 44024678465](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44024678465)、2026-11-17 05:32:16 UTCにsuccessを確認 |
| ソースの基準 | この文書整備の開始時HEADは`a5e1ee9ea577a513366933394880282a637ca7c6`。公開アプリSHAと、証跡・文書を含むrepo HEADは区別する。作業時に`git rev-parse HEAD`で取り直す |
| 版 / 実装 | 0.15.0、Astroの静的サイト。公開先にNodeサーバー、DB、会員、注文、決済、発送機能はない |
| データ | 公開50商品 / 登録56商品、14地域、公開商品が関連する技法24、一次出典258、23店舗。43商品に店舗案内。購入根拠は通販41・店舗＋現行カタログ9 |
| 画像 | 公開WebP98ファイル＝人物スタイリング48＋ジュエリー単体50。全50商品へ両方を対応。0.15で新規生成なし |
| 導線 | home/産地の種類別入口に代表単体図。地域・種類・素材・予算の絞込、公式リンク、店舗案内、任意表示のGoogleマップ |
| 出典 | 最初は閉じたnative details。価格・商品・店舗の確認日も一覧の中へ。情報そのものを削除していない |
| 広告 | AdSenseはoff固定、実アカウント/認定CMPは未接続。提携リンクも未申請で、現在は通常リンク。アカウント登録・申請・契約・課金はしていない |

数やSHAの最終正本は[deployment-results.json](deployment-results.json)。新しい依頼で数が変わったら、上表の数を維持するために商品を作らず、正本と検証結果を更新する。

## 変えない方針

- 神奈川専用に戻さず、全国へ拡張できる構造を保つ。空の県ページや、件数合わせの未確認商品を公開しない。
- 商品を選ぶサイトとして作る。ブログ一覧・お問い合わせ・カート・販売/発送機能は追加しない。旧読み物URLのnoindexリダイレクトは移行のために残す。
- 日本語/英語を対で保つ。右上の一つの言語ボタンは、同じ商品やページとquery/hashを引き継ぐ。
- 未提供の氏名・住所・メール・経歴を作らない。SORAを運営者表示に使い、GitHubユーザー名を運営者名へ流用しない。
- 公式写真を無断取得・転載・ホットリンク・生成入力へ流用しない。現在の画像はAIイメージであり、実物写真・着用試験・寸法/金具/裏面・販売個数の証拠ではない。captionの「AIイメージ / AI image」と近くの公式実物リンクを保つ。
- 未使用の商品の快適性・低アレルギー・耐久性・レビュー・取材・売上/人気実績を作らない。素材産地・工房所在地・販売店所在地を分ける。
- 円/ドルをサイトの言語で換算しない。日本向け参考価格と海外ストアの別価格を区別し、確認日は各市場の正本を使う。店頭価格や在庫を通販から推定しない。
- 商品ID・slug・既存URLは安定させる。商品、工房、販売店、産地、技法、素材、画像、広告、表示部品を分離する。

## どこを直すか

コード内のパスはリポジトリ基準。表のデータを別の文書や部品へ重複入力しない。

| 直したいもの | 正本と主な関連箇所 |
| --- | --- |
| 商品事実・価格・公開状態・通常/広告URL | `src/data/catalog.json`、`src/lib/schema.ts`。商品/工房/販売店/分類/広告プログラム/リンクは同JSON内でID連携 |
| 日本語の表示文 | `src/data/translations/ja.json`。価格の日本向け正本はcatalogのlocalizedPrices等で、訳文へ数値を複製しない |
| 商品本文 | `src/content/products/`とその`ja/`。公開本文は日英を揃える |
| 選ぶ理由・装い・比較 | `src/data/product-stories.json`、`selection-notes.json`、`region-choice-notes.json`。見出し/要約/判断の独自性を扱い、数値/URLの第二正本にしない |
| 商品固有の3問Q&A | `src/data/product-buying-guides.json`。日英3問と対象商品のsourceIds。展開tokenはsize/findings/fasteningのみ |
| 通販/店頭の購入根拠 | `src/data/purchase-evidence.json`。掲載だけ、古いgallery、別の金具の在庫を現在の注文受付と扱わない |
| 店舗・公式ホーム・訪問案内 | `src/data/visits.json`、`src/lib/visits.ts`。店舗があっても対象SKUの在庫が確定するとは限らない |
| Googleマップ | `src/lib/store-map-embeds.ts`、`map-embed-url.ts`、`src/components/VisitGuide.astro`。Google Shareの確認済みHTTPS URLだけ。明示表示前のiframe/Google通信は0 |
| 画像 | 人物用`src/data/editorial-images.json`、単体用`product-detail-images.json`、実体`public/images/`、権利/用途`docs/assets.json`、採用記録`docs/image-generation-solo-v14.json`等 |
| 調査の根拠 | `docs/research/sources.json`とテーマ別research。公式URL・実確認日・支える事実・未確認範囲を残す |
| 順序・代表・観光順位 | `src/config/selection.ts`、`region-selection.ts`、`src/lib/type-choices.ts`。代表は編集上の選択で、売上順位ではない |
| 広告リンク | `src/lib/affiliate.ts`とcatalogのprograms/links、MarketPurchaseLink/Disclosure。プログラムと商品リンクの両承認、許可host、有効URL・確認日が必要 |
| AdSense停止・Privacy | `src/data/advertising-privacy.json`、`src/lib/advertising-privacy.ts`、日英`src/content/policies/privacy.md`。単なる環境flagで有効化しない |
| 出典の開閉・ページ内リンク | `src/components/Sources.astro`。`#product-sources`の共通処理を使い、商品ページへ別の同期open処理を足さない |
| 共通UI・検索・公開設定 | `src/styles/global.css`、`src/layouts/Base.astro`、`src/lib/seo.ts`、`src/config/site.ts`、`astro.config.mjs` |
| 配信・セキュリティ | `.github/workflows/deploy.yml`、`scripts/check-runtime.mjs`、`scripts/lib/safe-outbound.ts`。権限分離・Action SHA固定・CSP・安全な外部検査を保つ |

型・参照・公開条件は`src/lib/schema.ts`、`src/content.config.ts`、各validatorが検査する。表示部品へ同じ事実を直書きして検査を回避しない。

## 最初の作業

1. ユーザーの今回の依頼、`AGENTS.md`、`README.md`、この文書、[検証ガイド](verification-guide.md)、[deployment-results.json](deployment-results.json)を読む。現在機能の仕様は`specs/016-visual-choices-mobile-security/`。該当するspec/実装へ進み、無関係な旧版を100件読むことは開始条件にしない。
2. Git checkoutなら`git status --short`と`git rev-parse HEAD`で現在地と未保存変更を確認する。ZIP展開には.gitを含めないので、元ZIP/外部proofを保管して別の作業用コピーを使い、Git履歴未取得として記録する。他者の変更・既存raw証跡を消さない。
3. Nodeは24.22.3以上のサポート中の修正版、pnpmは11.25.0。`node scripts/check-runtime.mjs`で最低版を確認する。`pnpm --version`だけではpnpm内蔵Nodeの版を証明できない。standalone pnpmを使う場合も、pnpmのJS CLIを実際のpatched Nodeで起動する構成へ揃える。環境構築はREADMEの手順を使う。
4. 必要なら`pnpm install --frozen-lockfile`。lockfileを通常の本文訂正で更新しない。Chromeの自動検査にはインストール済みChrome channelが必要。
5. 変更する正本と影響範囲を決め、該当spec/タスクと実装を対応させる。検査は[変更別マトリクス](verification-guide.md#変更別に検証を選ぶ)から選ぶ。
6. ビルド担当を一つにし、安定したdistをpreviewする。ブラウザ検査中に共有distや入力を変えない。新しい検査結果には別の出力名を使う。
7. 事実・画面・必要な検査を確認して記録する。公開が依頼範囲なら、GitHub Actionsの対象SHA/successと実公開を確認する。ローカルPASSを公開反映と読み替えない。

## 0.15で修正した、戻してはいけない挙動

出典リンクは、旧実装で「商品側clickによるopen」と「後から来るhashchangeによるopen」が重複した。素早く閉じると再び開き、再検査が88/92になった。現在はSources共通moduleが対象の通常ページ内リンクを処理し、preventDefault→pushState→一度だけ展開→移動先summaryへfocusする。直接URL/履歴のhashchangeにも対応する。次のTabはSource内へ進む。

この部分を変更したら、`node scripts/check-source-anchor-race.mjs`で迅速操作24・focus/次Tab・直接fragment・戻る/進む・JavaScript無効を確認する。「待ち時間を増やすだけ」で不具合を隠さない。[詳細な履歴とrawの所在](mobile-refinement-v15.md)も残している。

産地の日本語見出しは390pxで末尾「ぶ？」が孤立したため、対象の狭幅h2をbalanceにした。種類別画像は、公開商品で同じ産地/種別に属する編集順先頭を表示する。画像変更と一緒に価格・件数・query先を変えない。

## 確認済みと未解決を混同しない

- 最終アプリは静的生成・公開・Source保持・スマホ・出典競合を確認した。最終公開のmobile92、touch4、source race12、Source248、種類画像32、見出し12、補足24、共有meta1等の記録がある。
- 広範囲quality497と価格314、広告fixture6等は初回0.15の結果。最終版で497を再実行してはいない。限定した見出しCSSとSource操作JSの厳密差分、および最終の重点回帰を別に残した。[段階別の検証表](verification-guide.md#015の記録を読む)を参照する。
- セキュリティ監査は既知advisory・コード/CI/公開境界の範囲。実機Safari/iOS、未知の全脆弱性、全Git履歴、全法令への適合、検索順位/流入、将来の店頭在庫を認定していない。
- 現ホストはHTTPS/HSTSとHTML meta CSPが観測済み。HTTP CSPのframe-ancestors、X-Frame-Options、nosniff、Permissions-Policy等の防御は未設定の観測。MFA・共同作業者・branch protection・回復手段のアカウント設定は変更/再認定していない。[security-review-v15.json](security-review-v15.json)参照。
- GitHub Pagesの収益化用途への契約適合、商用ホスト選定/移行、実AdSense接続、認定CMP、必要な広告同意運用、申請者情報と提携先審査は未完了。ビルド・文書追加で完了扱いにしない。
- Googleマップの表示選択は広告の同意や認定CMPではない。閉じてもGoogleへ送った情報やGoogle側Cookieを消さない。AdSense offは維持される。
- Google広告の配信lockと、商品リンクの承認resolverは別の設定である。提携リンクを扱うためにAdSenseを有効化しない。

## 成果物と納品

リポジトリのcheckoutがある場合はそこを修正元とし、隣接deliveryのsource/ZIPだけを修正しない。ZIPだけで引き継ぐ場合は、別の作業用ディレクトリへ展開したsource一式を修正元とし、元の納品物を直接書き換えない。`pnpm package`はsourceを書き出し、旧sourceをbackupへ残す。ZIP作成/全SHAの手順は検証ガイドとREADMEから辿る。

最終納品のファイル数・ZIP SHAは、deployment-resultsのsourceDelivery.proofや同梱の外部proofを優先する。保守用CLIのproof名は`package-verification-<version>-<revision>.json`で、初回0.15の`package-verification-0.15.0.json`と区別する。今回のような文書追加でファイル数は増えるため、以前の822を固定条件にしない。ZIP自身のSHAをZIP内へ入れると自己参照になるので外部proofへ置く。node_modules/dist/artifacts/.git/.env/秘密/退役画像をsourceへ入れない。

スクリーンショット等は別の私的QA証跡。文中のartifactsという平文パスはローカル/納品証跡の所在で、アプリ実行依存ではない。存在しないartifactをMarkdownリンクにせず、実行可能な手順と履歴を分ける。AI原本50PNGの0.14別ZIPは保持し、0.15で新規生成したとは記録しない。

## 別のAIへ貼る依頼文

次の文をコピーし、【今回の依頼】だけ具体化する。鍵・トークン・個人情報・.env内容は貼らない。

~~~text
このリポジトリの日本全国向けジュエリー紹介サイトを引き継ぎ、
【今回の依頼】を実装・検証し、修正内容と根拠を引き継げる状態にしてください。
計画だけで終わらず、依頼範囲の可逆的な作業を進めてください。

現在はJapanese Craft Jewelry、SORA運営、日英、公開50商品、AI WebP98枚。
商品販売・決済・発送、ブログ、お問い合わせはありません。
神奈川専用にせず、全国へ拡張する構造を保ってください。
AdSenseはoff、アカウント/CMP未接続、アフィリエイトは未申請・通常リンクです。
商用ホスト適合、MFA等のアカウント設定、申請/契約は確認済みと扱わないでください。
未確認の仕様/在庫/価格/レビュー/使用経験や未提供の連絡先を作らないでください。
画像はAIイメージと短く表示し、実物の証拠や公式写真の使用許諾と混同しないでください。

先にAGENTS.md、README.md、docs/ai-handoff.md、
docs/verification-guide.md、docs/deployment-results.json、該当specを読んでください。
公開機能の基準はspecs/016-visual-choices-mobile-securityです。
公開アプリ基準は1f0021306e87ce9e7dc43bdf446cffedc59e4134、
Actions44024678465。作業時のrepo HEADと公開SHAは取り直してください。

商品事実/価格/URLはsrc/data/catalog.json、訳はtranslations/ja.json、
商品本文はsrc/content/productsとja、紹介はproduct-stories/selection-notes、
Q&Aはproduct-buying-guides、購入根拠はpurchase-evidence、
店舗はvisits、画像はeditorial-images/product-detail-imagesとdocs/assets、
出典はdocs/research/sourcesが正本です。数値やURLを部品へ複製しないでください。
出典のページ内移動はSources.astroの共通処理を使い、
商品側の重複open handlerを復活させないでください。

Git checkoutならgit statusで他者の変更を保護してください。
ZIPだけなら元ZIP/proofを保管し別の作業用コピーを使い、Git履歴未取得と記録してください。
Node>=24.22.3とpnpm11.25.0を確認してください。
変更の正本・仕様・影響を決め、検証ガイドから必要な検査を選んでください。
データ/広告変更ではpnpm verify、UI/価格/Source等は影響に合う追加検査を行います。
単純な文言訂正のたびに497画面全走査を機械的に実行する必要はありません。
共有buildは一つにし、browser中にdist/入力を変更しないでください。
新しいreport/prefixを指定し、過去の失敗・部分結果を消さず残してください。

最後に、変更ファイル、実行した検査と結果/対象、未実行範囲、未解決事項、
公開した場合は実SHA/Actions/公開URLの確認、次の更新方法を報告してください。
依頼にない新契約/課金/申請やアカウント変更へ作業範囲を広げないでください。
~~~

