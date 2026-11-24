# 現在の状態と保守の引継ぎ

2026-11-24。新しいチャットでサイト構築を再開する場合は、[サイト専用の引継ぎ書](SITE_NEW_CHAT_HANDOFF.md)と[コピー用の引継ぎ文](SITE_NEW_CHAT_HANDOFF.md#新チャット貼付用のプロンプト)を使います。[START_HERE](../START_HERE.md)と[AGENTS](../AGENTS.md)に作業の入口と制約があり、[handoff-status.json](handoff-status.json)に再開時の状態、[deployment-results.json](deployment-results.json)に公開アプリの実績があります。

## 完了しているもの

| 項目 | 現在の基準 |
| --- | --- |
| サイト | Japanese Craft Jewelry。全国の工芸ジュエリーを選ぶJA/EN紹介メディア。運営者SORA |
| 公開URL | [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/)・[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) |
| リポジトリ | [rozawa619/japanese-craft-jewelry](https://github.com/rozawa619/japanese-craft-jewelry)・main |
| 最新公開アプリ | **v0.24.1**、アプリSHA `ea640461a02b099a27641f4d8e14b5518d4d709c`。[GitHub Actions](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45332290970)の配信は2026-11-24 14:18 JSTに完了。詳細は[公開記録](deployment-results.json) |
| Gitからの再開方法 | [仕様024](../specs/024-git-ai-handoff/spec.md)が基本手順。[サイト専用の引継ぎ書](SITE_NEW_CHAT_HANDOFF.md)に現行機能と再開順を記録 |
| 内容 | 公開88/登録94商品、下書き6、掲載47都道府県、公開関連技法59/全61、一次出典390、46店舗/69商品に店舗案内。購入根拠は公式通販79商品、店舗とカタログ9商品 |
| 画像 | 人物86＋商品単体88のAI画像174枚。架空の日本人成人女性21〜33歳の生成設定 |
| AI画像の確認案内 | v0.22.1で日英の商品詳細と着用AI画像付きのカードに表示。実物の色・模様・形・金具は販売元の商品情報へ案内する。 [仕様031](../specs/031-product-image-disclosure/spec.md) |
| 販売元の選択名と販売単位 | v0.22.2で10商品の日英購入導線に選択名・カタログ掲載名を表示。凛然 星華 琥珀の国内・海外価格に1組の販売単位を表示。 [仕様032](../specs/032-purchase-selections/spec.md) |
| 動画で紹介した商品 | v0.23.1の日英 `/sora/` で、公開14投稿に対応する京都4・神奈川7商品へ案内。神奈川7商品の購入案内を公式情報と再照合。 [仕様034](../specs/034-kyoto-video-jewelry/spec.md) |
| 全国掲載と旅先検索 | v0.24.0から47都道府県・88商品。注文受付を確認した19県の19商品を追加し、日英で地方・県・訪問エリアから商品に案内。v0.24.1でスマートフォンの初期画面に検索への通常リンクを追加し、選択後の商品プレビューのリンクの高さを44px以上に修正。 [仕様035](../specs/035-national-travel-discovery/spec.md) · [一次情報](research/national-listings-2026-11-24.md) |
| 完了した023の変更 | 22人物を新生成・採用・公開、既存36人物と単体60を保持。新22枚は25〜30歳、かわいい系11/綺麗な系統11 |
| 退役画像 | 旧10＋023の旧22＋026の旧5＝37画像を配信/新Git tree/source ZIPから除外。旧原本と生成記録は保持 |
| 収益化 | AdSense off、実提携未申請、商品リンクは通常URL。広告resolverとPrivacyの土台は実装済み |

上の件数はこの公開版の記録で、全国拡張時の固定上限ではありません。神奈川専用・iTOへ戻さず、空の産地ページや件数合わせの未確認商品を作りません。人物の国籍・年齢は生成設定で、実在人物の属性を見た目から認定したものではありません。

## 次のAIが始めること

1. 今回のユーザー依頼を確認し、`git status --short`と`git rev-parse HEAD`で他者の差分を保護します。023は完了済みなので、22画像差し替えを新しい指示として再開しません。
2. [setup](setup.md)でNode>=24.22.3、pnpm11.25.0、必要ならChromeを揃えます。`pnpm install --frozen-lockfile`→`pnpm dev`で起動できます。.envなしの初期状態はルート配置/noindexプレビューです。
3. [architecture](architecture.md)と[editing-guide](editing-guide.md)から正本を特定します。商品/価格/URL、訳文、本文、比較、出典、購入根拠、店舗、人物/単体画像、広告、部品を分離したまま変更します。
4. 該当する仕様とタスクを作成・更新し、[verification-guide](verification-guide.md)の影響別検査を行います。公開設定/base/originを合わせ、安定した一つのdistを検査します。
5. 実行した結果と未実行範囲を記録し、必要なら公開後のSHA/Actions/実URLを確認します。仕様・handoff-status・関係文書を更新します。

通常の起動・build・検証には前任PCのartifacts、元PNG、外部proofは不要です。`docs/`はbuild入力のJSONを含むため残します。原本編集や過去の厳密な照合が必要なときだけ、[配布資料](handoff-assets.md)をGitHubから取得します。

`scripts/apply-japanese-model-styling.mjs`は完了済み023の移行専用です。fresh cloneの初回処理や次回の画像編集ツールとして実行しません。`check-japanese-model-preservation.mjs`も旧495入力/退役bytesが揃うreviewed checkout向けの一回限りの照合で、通常buildの依存ではありません。現在の画像検査は`check-japanese-model-styling.mjs`を使い、元PNG検査の`--originals`は原本取得後にだけ指定します。

## 維持する画面と表示方針

- ブログ、Contact、商品販売/決済/発送の機能はありません。紹介に不要な販売責任の説明や未提供の連絡先を追加しません。
- 右上の一つのJA/ENボタンは同じページ・商品・query/hashを引き継ぎます。国内JPYと海外ストアの実価格は別市場で、言語切替による為替換算をしません。
- HeroはPC左に女性AI画像、右に日本地図。明示県選択で写真/商品/国内参考価格が切り替わり、region query・他query/hash・戻る/言語を保ちます。写真は自然比率で人工的な上下帯を付けません。沖縄枠はPC200px/スマホ80pxを継承します。
- TOP10とDISCOVER3県の写真は同じstyleでPC最大300×200px/スマホ222×148px。産地一覧はTOP10→コンパクトな日本地図→DISCOVER3。掲載県だけを通常hrefにし、沖縄は独立拡大枠からも直接移動します。preview、zoom、内部scroll、keyboard/noJSを保ちます。詳細は[022](compact-layout-v20.md)と[写真共通化021](region-photos-v19.md)。
- 種類の小画像はその産地・種類に属する実公開商品から選びます。AI caption・日英alt・顔や装身具の見切れ防止を維持します。実物写真や試着の証拠にはしません。[023画像ガイド](japanese-model-styling-v21.md)と[全生成記録](image-generation-japanese-v23.json)を参照します。
- Sourcesは初期closed。出典/dateを消さず、必要時に一覧表示します。ページ内移動のopen/scroll/focusはSources共通処理に任せ、商品側の重複handlerを戻しません。
- 店舗Mapsは初回明示許可後30日自動表示、オフで全停止。未選択/拒否/期限切れはGoogle通信0。Google帰属・外部fallback・最小Storageを保ちます。地図設定maps-v17と広告Privacy v14/広告CMPは別です。

## 公開版の検証記録

v0.24.1は2026-11-24 14:18 JSTにGitHub Pagesへの配信が完了し、日英トップのHTTP 200と修正後HTMLの配信一致を確認しました。ローカルの端末検証はiPhone相当のWebKitエミュレーションとChromiumで行っています。公開後を含む詳しい結果は[仕様035の検証](../specs/035-national-travel-discovery/validation.md)と[公開記録](deployment-results.json)を参照してください。実機iPhone／Safariにはアクセスできず未検証です。

[仕様034の検証](../specs/034-kyoto-video-jewelry/validation.md)には、v0.23.1当時の京都の公開投稿、神奈川7商品の購入案内、iPhone 15相当のWebKit検証、公開応答の照合を記録しています。

[仕様029の検証](../specs/029-sora-profile-links/validation.md)に、SORAのSNSプロフィール用ページと、商品・産地への導線を記録しています。

[仕様028の検証](../specs/028-purchase-routes/validation.md)に、公式通販とカタログの表示、確認日、取扱店の導線を記録しています。

[0.20.0の検証](../specs/027-regional-craft-picks/validation.md)で、新4県の導線、日英の公開ページ、公式購入先、配信画像を確認しました。

[0.19.1の検証](../specs/026-kanagawa-styling-refresh/validation.md)で、神奈川の日英特集と追加5商品の着用画像、差し替え対象外の画像123枚のハッシュを確認しました。

[0.19.0の検証](../specs/025-kanagawa-accessories/validation.md)では、公開の日英神奈川特集、ブローチの絞り込み、CIの149件の単体テストを確認しました。

0.18.0の出力ハッシュと023専用の検査は、[024で検証したコミット](https://github.com/rozawa619/japanese-craft-jewelry/commit/537ee24ca021a9b61801108a4689e22936a3a08a)を対象に再現できます。現行版の検証コマンドは[検証ガイド](verification-guide.md)を参照してください。

0.18.0は公開実URLでHero77・共通写真37・mobile92・全商品browser146・Sources328・公開補足24が成功しています。browserは日英120商品ページ/58画像decodeと旧22画像URLの404、公開補足は328canonical/118画像のlocal SHA一致を確認しました。詳細は[verification](verification.md)と[公開集約](japanese-models-stage-hosted-summary.json)を正本にします。

公開mobile初回90/92は、固定75ms待機とscroll→rAF描画更新の競合を再現し、QA側を実条件/可視状態待機へ修正したものです。アプリ表示を変更せず全92を再実行し、[初回](japanese-models-stage-hosted-mobile-initial-results.json)・[診断](japanese-models-stage-hosted-mobile-timing-diagnostic.json)・[最終](japanese-models-stage-hosted-mobile-results.json)を保持しています。

これらは0.18.0に対する当時の検証です。次の変更の成功件数として転記しません。文書/toolだけの変更と、アプリの変更・公開を区別します。初回full verifyの型150ファイルと、QA修正後の最終型151ファイルも別記録です。

<a id="未完了判断が必要な事項"></a>

## 本人・契約・外部審査に依存するもの

| 項目 | 残る条件 |
| --- | --- |
| AdSense | 実アカウント/所有確認/実ID/認定CMP/地域別同意・配信。offを架空設定で解除しない |
| 実提携 | 現行提携条件・対象商品/媒体/市場の確認と、真実の申請者/支払情報・審査 |
| 商用host | GitHub Pages用途適合の確認または適した公開先の判断。契約/移転/DNSは未実施 |
| セキュリティ運営 | HTTP保護headerの実配信、MFA/復旧/共同管理/branch保護などhost/account側。全安全/侵入試験済みとはしない |
| 画像・使用経験 | 実物写真の許諾/実物試用は未取得・未実施。AI図から素材安全性や装着実績を認定しない |
| 検索/端末 | Search Consoleの実プロパティ/掲載・流入の観測、実機iOS/Safari等は別途必要 |

[残タスクと外部条件](remaining-task-audit-v17.md)・[法務記録](legal-review-v17.md)・[申請前手順](pre-application-checklist.md)を確認します。資料を読んだだけで、未依頼の契約/申請/アカウント操作に進みません。

## Gitと過去の配布物の違い

現在のmainが次の保守を始めるソースです。公開アプリ0.18.0の元のsource ZIPは`japanese-craft-jewelry-source-0.18.0-models-023.zip`で、1198ファイル/118公開画像の集合・全SHAを照合した履歴です。この1198を、引継ぎ文書が増えた現在のGitファイル数や、新しく作るZIPの期待値に固定しません。

原本ZIP・各proof・取得/検証方法は[handoff-assets](handoff-assets.md)を参照します。0.18.0原本ZIPは新PNG22/旧自作AI参照22/記録3の47ファイルです。原本や過去のsource ZIPは必要時だけ取得し、通常buildに前任PCの隣接delivery directoryや絶対パスを要求しません。

Git/sourceには.gitの実体、.env/秘密、依存実体、dist/.astro/artifacts、退役画像を追加しません。過去ZIPの外部proofと、現在Gitから行った検証は分けて保存します。過去の公開appを記録するdeployment-resultsを、文書更新だけで新アプリ公開のように書き換えません。
