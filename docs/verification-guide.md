# 変更に合わせて検証する

商品詳細の購入経路と確認日は、国内参考価格の主CTA付近に表示します。出典、商品情報、価格・店舗情報の確認日は従来の開閉欄にあります。`pnpm verify`で日英の生成HTMLを確認し、`pnpm check:mobile`と`pnpm check:sources`はこの配置を検査します。 [仕様028](../specs/028-purchase-routes/spec.md)

現行配信をSearch Consoleで検査する場合は、URLプレフィックス `https://rozawa619.github.io/japanese-craft-jewelry/` を使います。所有確認後にプロジェクト配下の `sitemap.xml` を送信し、日英トップと代表の産地・商品ページをURL検査します。所有確認とインデックスの結果はアカウント上で確認します。 [Googleの所有確認手順](https://support.google.com/webmasters/answer/9008080) · [公開サイトマップ](https://rozawa619.github.io/japanese-craft-jewelry/sitemap.xml)

確認日：2026-11-17、公開版0.18.0・日本人女性の着用画像023。目的は、変更に必要な証拠を得て、過去の成功を今回の成功と混同しないこと。最初に[AI引継ぎ](ai-handoff.md)とAGENTS.mdを読む。公開と納品の確定値は[deployment-results.json](deployment-results.json)、実際の入力・対象・失敗は各JSONを正本とする。

<!-- PUBLIC_V23 -->
0.18.0（仕様023）公開済み。人物は架空の日本人成人女性25〜33歳という生成設定へ統一。新22枚（25〜30歳、かわいい11/綺麗11）を採用、既存36枚と単体60枚を保持。app `f2bb423f4c4cf476e449d8ec37837243f764cfee`、[Actions44089370227](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44089370227) completed/success。実URLでHero・TOP10/DISCOVER・日英/スマホ・全商品画像・旧22URL非配信を検証済み。詳細はdeployment-results.json。

0.18.0の全sourceは1198ファイル・公開画像118枚。repository/export/ZIPの集合と全SHAを照合済み。全source ZIPはjapanese-craft-jewelry-source-0.18.0-models-023.zip、外部proofはpackage-verification-0.18.0-models-023.json、原本ZIPはjapanese-craft-jewelry-originals-0.18.0.zip（47ファイル）。完了記録を含め最終再梱包し、ZIP hashは自己参照を避け外部proofへ保存する。正本はdeployment-results.jsonのsourceDelivery。

023で人物着用画像を、架空の日本人成人女性という生成設定へ統一しました。58人物画像/60商品参照のうち22枚を新生成・採用・公開し、日本人設定の36枚を保持しました。新規は25〜30歳（25歳6枚）、全体は25〜33歳、かわいい系11/綺麗な系統11です。実在人物の国籍・年齢を見た目から認定しません。生成logはdocs/image-generation-japanese-v23.json、readerはscripts/lib/styling-generation-manifests.mjs、専用QAはscripts/check-japanese-model-styling.mjs。旧22画像はbytesを上書きせずretired/Git追跡解除/ignoreとし、dist/ZIPから除外。v12baseline・保持36人物・単体60・商品facts/レイアウト/広告off/Google Maps同意を維持しました。新元PNG22枚と旧自作AI参照22枚・全prompt/目視記録を別原本ZIPへ保存しました。

旧版の公開記録：0.17.3（仕様022）公開済み。app `ef8ae160e7fc7d2b41cdce1063094313b719df6e`、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success。実URLで一覧地図241・Hero77・mobile92・Sources328・補足24を確認。地図枠縮小/一覧沖縄別枠とトップ写真の自然比率を反映。確定値はdeployment-results/verificationを参照。 0.17.3の全sourceは1155ファイルを照合済み。これは023の生成/検証/公開/納品結果ではありません。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。

## 変更別に検証を選ぶ

すべての変更で全ブラウザ検査を走らせる必要はない。AGENTS.mdの広告・データ変更に対する`pnpm verify`は守り、その上に影響する検査を足す。新しい実装をそのまま写しただけのテストや、可逆的な文言修正だけの新規テストは増やさない。

| 変更 | 基本の確認 | 追加する対象 |
| --- | --- | --- |
| docs内の説明/リンクだけ | 差分、参照ファイル、Markdownリンク、`git diff --check` | アプリを変更していなければブラウザ497や価格314は不要 |
| 商品/方針本文Markdownの小さな文言訂正 | `pnpm check`、`pnpm build`、`node scripts/check-built.mjs`、対象日英ページ | 価格/URL/事実も変えるならデータ変更の行へ。新しい紹介体験や性能を作らない |
| 商品事実・価格・URL・出典・公開状態などJSON正本 | `pnpm verify` | 対象商品の日英、価格/CTA/Source/比較/一覧。市場価格なら`check:prices`、Source表示なら`check:sources` |
| 新商品/産地/公開復帰 | 正式な購入根拠・現行公式情報/許諾、日英本文、Q&A・画像・分類・店舗/比較の整合＋`pnpm verify` | 公開/除外・空分類・filter/0件・リンク・SEO。共通集合が変わるため`check:quality`等の広範囲を選ぶ |
| 紹介/Q&A/比較のJSON | `pnpm verify`、対象日英を読む | `check:copy`は完全一致重複等の補助。Q&A共通処理なら`check:depth`。字数やPASSを独自性の自動認定にしない |
| ヘッダー・global CSS・filter・固定CTA | `pnpm verify`、`check:mobile`、`node scripts/check-mobile-touch.mjs` | キーボード・縦/横・320/360/390/768/PC。小さな局所CSSなら該当検査と目視へ限定できる |
| 種類の代表図・産地見出し | `pnpm verify`、`check:types` / `check:headings` | 所属/編集順/価格帯/件数/query/hash/AI表示/元比率。新画像生成と既存図の再利用を区別 |
| SourceのHTML/確認日/開閉 | `pnpm verify`、`check:sources`、`node scripts/check-source-anchor-race.mjs` | `check:mobile`、必要なら`check-mobile-touch.mjs`。初期closed、直接hash、history、迅速close、focus/Tab、noJS |
| 価格共通処理・通貨/市場の行き先 | `pnpm verify`、`check:prices` | 単品/片耳/一組、JPY/海外実額、未知価格、言語往復、sticky、広告の別市場への流用防止 |
| 全国地図 | `pnpm verify`、`node scripts/check-japan-map.mjs` | 47形状/掲載県、代表画像/価格/行き先、TOP10→地図→DISCOVER3、hover/focus/selectのpreview、県のnative click/tap/Enter直接移動、zoom/内部pan/reset/地方一覧/noJS、320px |
| 店舗・Googleマップ | `pnpm verify`、公式所在地/地図、`node scripts/check-map-preferences.mjs`・`node scripts/check-inline-maps.mjs` | 未選択/拒否/期限切れ通信0、初回許可後30日の全店舗/日英自動表示、全撤回/不正/旧版/保存不可/複数タブ/戻る、帰属/fullscreen |
| 広告リンク/Privacy/CMP/外部送信 | `pnpm verify`、`check:privacy`、`check:ads` | 実際の状態と日英Privacy、最初の広告前開示、承認/host/fallback、送信/拒否/撤回。実広告導入は現在のoff版と別の実装 |
| 依存・Node・URL境界・CI/CSP | runtime check、`pnpm audit --audit-level=low`、関連unit、`pnpm verify` | URLなら`outbound-security.test.ts`、CI権限、公開header/console、対象の実host。監査0件を完全安全としない |
| origin/base/公開設定・SEO・配信 | `pnpm verify`、`pnpm readiness`、`check:seo` | preview/public、canonical/hreflang/sitemap/robots、公開meta、実URL、最終HTML/画像照合 |
| 素材から探す専用ページ | `pnpm verify`、`pnpm check:seo` | 日英の素材別掲載商品、商品一覧とフッターからのリンク、320px幅、JavaScript無効時、公開サイトマップ |
| AI画像の確認案内 | `pnpm verify`、対象の日英画面 | 主購入リンクの手前、単体画像、固定購入欄、着用AI画像付きカード。公式通販・カタログのリンク、320px幅の固定欄、JavaScript無効時の表示。 [仕様031](../specs/031-product-image-disclosure/spec.md) |
| 公式ページで選ぶ色・金具、カタログの掲載名 | `pnpm verify`、対象の日英画面 | 台帳の出典と国内リンク、一覧カード・詳細・固定欄の選択名、英語での日本語表記、国内・海外の販売単位。 [仕様032](../specs/032-purchase-selections/spec.md) |
| SORAの動画商品一覧 | `pnpm verify`、`pnpm check:seo`、日英の `/sora/` | 公開照合台帳・商品ID・画像ID、重複排除、320pxの冒頭リンク、日英のクエリ・ハッシュ、JavaScript無効時の商品ページ。 [仕様033](../specs/033-sora-video-jewelry/spec.md) |
| 納品だけ | 最新sourceの書出し→ZIP→repository/export/ZIP集合・全SHA照合 | アプリ不変なら同じUIを再走査せず、記録/必須ファイル/秘密・退役物除外を確認 |

関連unitだけ先に実行する例は`node --experimental-strip-types --test tests/market-prices.test.ts`。最終の必要範囲は変更の広がりで決める。CIは独立した公開gateであり、ローカルの小修正検査を省略する理由にも、毎回497を走らせる理由にもしない。

## 0.17.1の記録を読む

追加のホームHeroは一覧地図と別に検査します。全24県の明示選択で女性画像/asset/alt/寸法・商品/価格metadata/単位・産地CTAが一致し、hover/focusで勝手に変わらず、region query/言語/他query/hash/戻る/不正id/noJSが正しいことを確認します。TOP10の縮小は枠の実寸とcontain/可読性/導線で確認し、訪問数の改善とは呼びません。

[地図拡大/直接選択020](../specs/020-direct-region-map/)は地図/Heroを変更する際の前段階の基準。旧0.17.0の193件はpreview選択を確かめたもので、今回のクリック遷移や拡大の成功には流用しません。検証はclick-map-stageの専用reportへ分離し、日英home/objects/places、24県の有効href、native click/tap/Enterの実遷移と戻る、hover/focus/selectのpreview、100/150/200/300%と内部scroll/全体表示、JSなし、320/390/1440を確認します。SVGのbbox中心が海や別県になることがあるため、県の実際の塗り領域へ通常の入力を行い、force/DOMclickで合格させません。商品事実・Google店舗Mapsの30日設定は変更しません。実測/公開/ZIPの確定値は020 validationと[verification](verification.md)を正本にします。

## 0.17の記録を読む

[地図と表示設定019](../specs/019-geographic-discovery-map-privacy/)は直前0.17.0の記録。産地の共通入口はTOP10→日本地図→DISCOVER3県。観光TOP10順位は維持し、47県のCC0形状から実商品/産地本文のある掲載24県だけを選択可能にします。代表単体AI画像・商品名・国内参考価格を正本から表示し、select・地方別一覧・地図ジャンプも用意します。hoverだけに頼らず、タップ/keyboard/JSなしの通常リンクを保ちます。

Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。

0.17.0当時の型/単体/build/新UI/実公開の結果は019 validationとdiscovery-map-stageの各reportへ記録しています。旧検査の「再読込off/Storageなし」を今回へ流用しません。新bitmap生成はなく、旧画像/原本と商品事実を保持した証拠を確認します。[日本地図の直接選択](japan-map-direct-v18.md)・[残タスク](remaining-task-audit-v17.md)・[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)を参照。対応ホストを模したheader試験と、GitHubの実HTTP header観測も分けます。

## 0.16の記録を読む

[全国追加018](../specs/018-national-jewelry-expansion/)は10県の10商品を加える変更。台帳は公開60/全66商品・下書き6商品、24県、公開関連34技法（全36）、一次出典293件、33店舗/53商品の関連、人物58＋単体60の118画像。購入根拠は国内通販51商品、小売＋公式カタログ9商品であり、全品を通販在庫ありと読み替えない。

0.16当時の実測はnational-stageと[保存版verification](verification-v16.md)で追う。ローカルでは型130ファイル・既存unit135・verify成功、stable dist344HTML/328canonical/118画像を確認。実公開の[Source328/328HTML SHA](national-stage-hosted-sources-results.json)、[補足24/24と328正規URL・118画像SHA](national-stage-hosted-release-results.json)、[mobile92/92](national-stage-hosted-mobile-results.json)もすべて成功した。旧0.15の497/314や14地域の画像検査件数を、拡張後の対象数・実行成功として転記しない。

単体画像は[共通reader](../scripts/lib/image-generation-manifests.mjs)が旧v14と新v16のmanifestを併読し、active registry全60商品の対応、重複、実ファイル、distのSHAを検査する。人物の新生成ログは単体ログと別資料。旧98画像の不変、新規23PNGの採用20・棄却3、公開118WebPの整合を分けて確認し、PNG原本を通常buildの入力にしない。

## 0.15の記録を読む

最終公開アプリは`1f0021306e87ce9e7dc43bdf446cffedc59e4134`、[Actions 44024678465](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44024678465)は2026-11-17 05:32:16 UTCにsuccess。repoの文書整備開始時HEADは`a5e1ee9ea577a513366933394880282a637ca7c6`で、公開アプリSHAとは違う。

| 記録 | どの段階を確認したか |
| --- | --- |
| [最終static](visual-mobile-stage-static-results.json) | 最終アプリのverify。124型ファイル/124単体成功、0 error/warning/hint、264HTML、369出力。将来の文書/helper追加後の件数固定条件ではない |
| [local quality497](visual-mobile-stage-quality-results.json) / [公開quality497](visual-mobile-stage-hosted-quality-results.json) | dc90の初回0.15。300商品詳細・地域往復等。見出し/Source操作の最終修正後に497を再実行した記録ではない |
| [価格314](visual-mobile-stage-prices-results.json) / [隔離広告6](visual-mobile-stage-ad-build-results.json) | 初回の広範囲。現在の最終版で再実行したとは書かない |
| [見出し差分](visual-mobile-stage-heading-build-delta.json) | 旧公開dc90の264HTML SHAを旧manifestと結び、対象の見出しCSSと対応CSPだけの変化を厳密比較 |
| [Source差分](visual-mobile-stage-source-nav-build-delta.json) | 見出し調整後からSource/productの2つのscriptと対応CSPだけを置換。その他HTML・CSS・JSON-LD・URL・98画像の不変を確認 |
| [88/92の失敗原本](visual-mobile-stage-mobile-final-first-attempt-results.json) | 初回の見出し調整後、迅速Source操作が4失敗。同期click openと後着hashchangeの二重処理という実不具合。raw/event traceを残してアプリを修正 |
| [最終local mobile92](visual-mobile-stage-mobile-results.json) / [touch4](visual-mobile-stage-touch-results.json) / [競合12](visual-mobile-stage-source-anchor-race-results.json) | Source一本化・pushState・summary focus後。rapid24、次Tab、直接URL/history/noJSを含む |
| [最終公開mobile92](visual-mobile-stage-hosted-mobile-results.json) / [touch4](visual-mobile-stage-hosted-touch-results.json) / [競合12](visual-mobile-stage-hosted-source-anchor-race-results.json) | 最終1f002の実公開。同じ範囲を再確認し、失敗0。mobileは7サイズ×日英6ルートの84画面＋hash/noJS/Maps |
| [最終公開Source248](visual-mobile-stage-hosted-sources-results.json) | 同じresponseのrawHTML SHAを最終distへ全件照合。100商品ページ、348閉じた一覧、1246出典record。258種類の出典がページごとに再登場した件数を含む |
| [最終公開の種類画像32](visual-mobile-stage-hosted-type-images-results.json) / [見出し12](visual-mobile-stage-hosted-heading-browser-results.json) | 全14地域/homeの日英代表画像84表示、狭幅の行組み・query・Source。0.15後の保守用CLIはscriptsへ整理 |
| [最終公開補足24](visual-mobile-stage-hosted-supplement-results.json) / [公開meta1](visual-mobile-stage-hosted-publication-metadata-results.json) | 248正規URL/98画像の200、meta/CSP/JSON-LD/hreflang等。HTML/画像SHAとlocalを照合 |
| [一時503の部分結果](visual-mobile-stage-final-hosted-first-attempt-results.json) / [再確認](visual-mobile-stage-final-hosted-503-recheck-results.json) | 初回は22/24・HTML133/画像33まで。fresh200/SHA一致後、アプリ無変更で全補足24を再実行した |
| [securityレビュー](security-review-v15.json) / [host観測](security-host-observation-v15.json) | Node/依存/外部URL検査・CIと実hostの範囲。MFAや全Git履歴、全安全、商用適合を認定しない |

初回local/publicの92/4は`visual-mobile-stage-before-heading-*`と`visual-mobile-stage-hosted-before-heading-*`へ保存した。最終結果と古い時刻を混ぜない。[mobile-refinement-v15.md](mobile-refinement-v15.md)に失敗から修正・再検証までの詳細がある。

Source248はHTMLの保持/初期状態を調べる。JavaScriptの操作競合がないことは競合12やmobileで別に調べる。画像decode、axe、URLの200、CSSのはみ出し0も、それだけで実物再現・全アクセシビリティ・購入可能性・法令適合・AdSense合格を認定するものではない。

## 実行前に揃えるもの

- Node>=24.22.3のサポート中の修正版、pnpm11.25.0、必要な場合はChrome channel。`node scripts/check-runtime.mjs`、`node --version`、`pnpm --version`を確認する。pnpmの版は組込Nodeの証明ではないので、standalone版でもpnpm JS CLIをpatched Nodeで起動する構成へ揃える。READMEのセットアップ手順を使う。
- Git checkoutでは`git status --short`、ZIPだけなら元ZIP/proofと作業用コピーの差分で変更を把握し、使うapp/入力/buildを凍結する。共有distのビルドは一系列。ブラウザ実行中にapp・入力JSON・distを変えない。
- 古い成功/失敗を上書きしない。以下の`change-local`は新しい作業名の例で、実際は変更IDや日付を付ける。フォルダーが必要なら先に作る。
- .envは納品/Gitに入れず、値をログへdumpしない。PUBLIC_の値は公開情報であり秘密値を入れない。Node CLIの.env読込実装は一様ではないため、検証に使う環境変数は同じterminalで明示する。
- 多くのscriptは`CHECK_BASE_URL`をoriginとして使う。projectのパスは`PUBLIC_BASE_PATH`へ分ける。root公開なら`/`で、buildと同じ値を指定する。portやbaseの既定値4321/4322/4323を推測で流用しない。

### 本番設定と同じ生成物をlocalで確認する例

既存の公開環境に対する例。設定を永続保存する命令ではない。新しい公開先を決める操作とは区別する。

~~~powershell
$env:PUBLIC_SITE_URL='https://rozawa619.github.io'
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:PUBLIC_PUBLISH_MODE='public'
$env:PUBLIC_OPERATOR_NAME='SORA'
$env:PUBLIC_REPOSITORY_URL='https://github.com/rozawa619/japanese-craft-jewelry'
$env:CHECK_IMAGE_REPORT_PATH='docs/change-local-image-files-results.json'
$env:CHECK_PRIVACY_REPORT_PATH='docs/change-local-static-privacy-results.json'
$env:CHECK_DETAIL_IMAGE_REPORT_PATH='docs/change-local-detail-image-results.json'
pnpm verify
pnpm readiness
$env:SEO_REPORT_PATH='docs/change-local-seo-results.json'
pnpm check:seo
~~~

別terminalにも必要な設定を揃え、`node scripts/astro.mjs preview --host 127.0.0.1 --port 4323`で最終distを表示する。サーバー出力の実portを確認する。未設定のfresh local previewはnoindexであり、それを本番公開の成功と数えない。Source全canonical保持やSEOの検査は本番canonicalを持つprofileが前提で、空のpreview sitemapを検証対象にしない。

### local/公開を切り替える例

~~~powershell
$env:CHECK_BASE_URL='http://127.0.0.1:4323'
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:CHECK_REPORT_PATH='docs/change-local-mobile-results.json'
$env:CHECK_SCREENSHOT_PREFIX='change-local-mobile'
pnpm check:mobile

$env:CHECK_BASE_URL='https://rozawa619.github.io'
$env:CHECK_REPORT_PATH='docs/change-hosted-mobile-results.json'
$env:CHECK_SCREENSHOT_PREFIX='change-hosted-mobile'
pnpm check:mobile
~~~

`CHECK_BASE_URL`を変えただけで本番を生成したことにはならない。公開照合前に、対象appのCI成功と実公開への反映を確認する。

## コマンドと出力先

通常は上のマトリクスから必要な行だけ選ぶ。同じterminalの前のreport変数が次の検査へ残るので、コマンドごとに設定し直す。

| コマンド | 対象 / 出力を分ける環境変数 |
| --- | --- |
| `pnpm check` / `pnpm test` / `pnpm build` / `pnpm verify` | verifyは型・参照・unit・build・builtと画像/Privacy/単体図をまとめる。画像3系のJSONは上記の専用変数で分ける |
| `pnpm check:mobile` | 代表レスポンシブ92。`CHECK_REPORT_PATH`、`CHECK_SCREENSHOT_PREFIX` |
| `node scripts/check-mobile-touch.mjs` | 実tap2flow＋撮影2group。共通report/prefix |
| `node scripts/check-source-anchor-race.mjs` | Source迅速操作/通常/focus/history/noJSの12。`CHECK_REPORT_PATH` |
| `pnpm check:sources` | sitemap全canonicalのSourceと実HTML SHA。`CHECK_REPORT_PATH`。比較先は同checkoutの`dist`固定で、独自のCHECK_DIST_DIRは使わない |
| `pnpm check:types` / `node scripts/check-type-choice-images.mjs` | 全地域/homeの代表画像。共通report/prefix。0.15後に保守用scriptへ整理したもの |
| `pnpm check:headings` / `node scripts/check-regional-headings.mjs` | 地域見出し、画像/query/Source。共通report/prefix。0.15後に保守用scriptへ整理したもの |
| `pnpm check:quality` | 全商品詳細・分類/地域・除外/0件等。件数は公開集合から算出し、旧0.15の497へ固定しない。共通report/prefix |
| `pnpm check:prices` | 全価格/市場・行き先・地域。件数は公開集合から算出し、旧0.15の314へ固定しない。共通report/prefix |
| `pnpm check:depth` | 全商品の日英3問、Source操作、Privacy、単体図。共通report/prefix |
| `node scripts/check-japan-map.mjs` | 全国地図の47形状/代表画像/価格/選択/代替操作と3県。共通report/prefix |
| `node scripts/check-map-preferences.mjs` | 30日設定/全撤回/保存不可/不正/旧版/期限/複数タブ/Privacy。共通report/prefix |
| `node scripts/check-inline-maps.mjs` | 実Google埋込と帰属/全撤回。新設定の前提で実行し、旧9ケースを最新成功にしない。共通report/prefix |
| `pnpm check:seo` | 生成HTMLのSEO。`SEO_REPORT_PATH`、任意の`CHECK_DIST_DIR`。本番origin/base/public設定が必要 |
| `node scripts/check-publication-metadata.mjs` | 共有公開metaの重点確認。`CHECK_REPORT_PATH`、本番のPUBLIC_SITE_URL/PUBLIC_PUBLISH_MODE |
| `node scripts/check-hosted-release.mjs` | 公開HTML/画像とlocalの補足。出力は`CHECK_HOSTED_REPORT_PATH`であり、共通CHECK_REPORT_PATHではない |
| `pnpm check:images` / `pnpm check:detail-images` | 画像実寸/metadata/hash/台帳/生成物。`CHECK_IMAGE_REPORT_PATH` / `CHECK_DETAIL_IMAGE_REPORT_PATH` |
| `pnpm check:privacy` | 現広告停止lock・policy版・生成HTML。`CHECK_PRIVACY_REPORT_PATH` |
| `pnpm check:ads` | 隔離fixtureの提携広告切替6。`CHECK_AD_REPORT_PATH`。実catalog/root distを変更せず、広告/申請を配信しない |
| `pnpm check:copy` | 紹介文の完全一致重複等。`CHECK_EDITORIAL_REPORT_PATH`。意味/事実/独自性の人間的判断を代替しない |
| `pnpm check:links` | 安全な外向きHTTPS検査。`CHECK_LINK_REPORT_PATH`。redirect/DNSでprivateへ迂回しない。403/429/503等は要確認で、即閉鎖の証拠にしない |
| `pnpm check:browser` | 既存の広範囲bilingual suite。共通report/prefix。0.15最終で全suiteを実行した記録ではなく、必要時に現仕様と期待を確認して使う |

例：Sourceと公開補足を別ファイルへ保存する。

~~~powershell
$env:CHECK_REPORT_PATH='docs/change-hosted-sources-results.json'
pnpm check:sources
$env:CHECK_HOSTED_REPORT_PATH='docs/change-hosted-supplement-results.json'
node scripts/check-hosted-release.mjs
~~~

Source/公開補足は最終local生成物と比較する。別版のdistや、再ビルド中のdistと公開を比べて全件SHA不一致になった場合は、データ不良と断定する前に版・base・入力・生成物を揃える。

## 失敗・公開問題からの復旧

1. **元の結果を保つ。** report、対象SHA/URL/base、終了コード、時刻、入力hash、スクリーンショットを別名に残す。途中の133HTML/33画像を全248/98成功と数えない。
2. **失敗の層を分ける。** パス/port/未反映、HTTP一時障害、期待値の不備、アプリ不具合、外部情報の変更を切り分ける。Sourceの88/92ではhash/focus/openとevent順を採り、実不具合を修正した。
3. **必要な修正を行う。** API/HTTPの一時503は同じURLのfresh responseと期待SHAを確認する。事実が変わった場合は一次情報と購入根拠を再調査する。失敗を消すために日付、価格、検査期待を無根拠に変えない。
4. **再実行の範囲を決める。** 同じappの一時応答なら当該URLの再確認と途中で止まった走査全体。アプリを変えたら影響範囲を再検査する。広い結果を引き継ぐ場合は、0.15の2段差分のような具体的な不変証拠と重点回帰を記録する。
5. **配信候補を固定する。** 共有buildを一つにして検証し、branch/作業中の変更を保護する。必要な修正commitまたはreview可能なrevertを作る。未保存変更をreset/上書きして復旧しない。
6. **公開を確認する。** 対象commit、GitHub Actionsのrun/headSha/success、実URL、生成物SHA/挙動を確認する。mainの文書commitが進んでも、公開アプリの記録を推測で変更しない。今回の検査が未完了ならそのまま未完了と記す。

最後に更新したspec/タスク、検査、公開記録、引継ぎを揃える。アカウントのMFA/権限やホストheader、AdSense/CMP/商用契約の未解決は[AI引継ぎ](ai-handoff.md)へ残し、技術PASSで解決したことにしない。

## 納品検証とリリースの記録

通常は`pnpm package:delivery`が最新repositoryからexport→ZIP→照合proofをまとめて行う（PowerShell7が必要）。exportだけなら`pnpm package`。`-SkipExport`は既存exportを使う明示的な例外で、先にpackageを行うことは通常の必須手順ではない。実際のpackage.jsonとREADMEの手順を確認する。納品先のsource/ZIPだけを修正しない。

repository→export→ZIPのファイル集合・必須設定/spec/正本/検査script・全ファイルSHA256を照合する。.git/.env/指定した認証ファイル名・秘密鍵拡張子/node_modules/dist/artifacts/退役画像を除き、画像registryの現行ファイルが揃うことを確認する。指定パスとリンク/ジャンクションの拒否は、任意ファイル内容やGit全履歴の機密検査ではない。新しい保守文書/helper追加後はファイル数が増えるため、旧822などを固定値として合格させない。

ZIP検証後に完了記録を更新した場合は、もう一度export/ZIP/全SHAを検証する。ZIP自身のbytes/SHAは外部の`package-verification-<version>-<revision>.json`へ置き、ZIP内へ自己参照させない。初回0.15の`package-verification-0.15.0.json`は当時の記録として保持する。旧0.15の私的QAのPNG/JSONは別のscreenshots/0.15.0へ分離した資料で、0.16の新しい証跡を上書き保存しない。

最新の納品/公開の概要は[deployment-results.json](deployment-results.json)。現在023の人物画像更新、前段階022のコンパクト一覧地図/Hero自然高、021の写真共通化、020の地図/Hero、019の地図/保存設定、018の全国追加、017の文書整備・旧0.15の公開検査を区別し、過去の件数や実行時刻を書き換えない。


## 継承する0.17.2の写真共通サイズ021

TOP10/DISCOVERの共通写真サイズは[021](../specs/021-unified-region-photos/)・[運用説明](region-photos-v19.md)を継承。021当時の写真37検査は全3画面・日英・5幅/390画像と両group寸法/実paint・focus/axe、保全8検査は0.17.1→0.17.2の494入力と全1453script/画像の差分です。固定baselineを持つnode scripts/check-region-style-preservation.mjsはこの旧差分の証跡で、Hero/一覧地図も変更する022の新しい保全PASSへ読み替えません。共通写真サイズを変更するときはnode scripts/check-region-photos.mjsを使い、今回のHero/地図・保持/回帰は022の必要範囲と専用reportで確認します。前段階の37/92や217/77を新表示の検証へ加算しません。

## 0.17.3 一覧地図とトップ写真022

地図/Heroレイアウトの継承基準は[022](../specs/022-compact-map-and-natural-hero/)・[操作/編集ガイド](compact-layout-v20.md)。node scripts/check-japan-map.mjsでコンパクト枠・47原形/24controls・沖縄別枠のnative遷移・preview/zoom/scroll/noJSを、node scripts/check-region-hero.mjsで全24県の自然比率/実paint/画像とAIcaption前後の上下余白・選択/query/言語を確認します。component全体と地図viewport、画像content-boxと実paintを区別。CHECK_REPORT_PATH/SCREENSHOT_PREFIXはcompact-layout-stage専用とし、旧021の37/92・旧020の217/77を新表示の検証と呼びません。必要なmobile/Source/SEOと実公開/ZIPの確定値は022 validationへ記録します。


## 日本人女性の人物画像023

0.18.0の人物生成/編集・監査・退役と検証の方針は[023ガイド](japanese-model-styling-v21.md)・[仕様と検証](../specs/023-japanese-model-styling/)を確認します。新規22枚の生成/採用/公開と全source ZIPの照合は完了し、最終件数・app/Actions・集合/全SHAはdeployment-resultsと外部proofが正本です。旧生成logのUS/UK等は歴史として残し、現在のactive registryに対応する生成設定だけを監査します。023の新画像を、旧022の241/77/92や旧「全画像不変」の成功へ加算しません。


### 023の新しい人物画像を検査する

監査で確定した22置換/36保持を基準に、scripts/check-japanese-model-styling.mjsでactive人物の明示的なJapanese成人設定・manifest/registry/ledger・実bytes/AI metadata・採用記録を確認します。新readerはscripts/lib/styling-generation-manifests.mjs。保持36人物/単体60/v12baselineは不変、旧22はretired/Gitignore/Git追跡解除とdist/ZIP除外を確認します。旧生成logにUS/UKが残っていても歴史として保存し、active集合へ混ざらないことを検査します。国籍/年齢/魅力度のピクセル分類を合格根拠にしません。

v12baselineや023以外の全画像不変gateを一括書換えせず、今回の対象だけを明示例外へ。Hero全24県・商品ページ・Top10/DISCOVERの日英/スマホ/自然比率/AIcaption・Source/SEO/公開URLを必要範囲で検査します。旧022の固定保全6はUI差分の歴史で、新しい人物画像の保全結果として再利用しません。画像/商品factsやレイアウトJS・広告/Maps設定の保全と、生成/採用の確認を別に記録します。専用QAの件数・成功・公開/ZIPはまだ未確定です。
