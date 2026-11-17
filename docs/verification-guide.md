# 変更に合わせて検証する

確認日：2026-11-17、作業版0.17.1・日本地図拡大/直接選択020。目的は、変更に必要な証拠を得て、過去の成功を今回の成功と混同しないこと。最初に[AI引継ぎ](ai-handoff.md)とAGENTS.mdを読む。公開と納品の確定値は[deployment-results.json](deployment-results.json)、実際の入力・対象・失敗は各JSONを正本とする。

<!-- TODO_PUBLIC_V18 -->
0.17.1（仕様020）は公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

PCのホーム先頭は左の人物AI画像・右の日本地図を並べるRegionHeroです。スマホでは写真を全幅で大きく表示し、その下に商品小情報と地図を並べて、顔や耳を切らずに見やすくします。Heroの県はclick/tap/Enter/Spaceで明示選択すると、女性画像と商品/国内参考価格を切り替え、産地CTAから商品一覧へ進みます。hover/focusだけでは切り替えません。有効な公開地域idだけを`?region=`へ反映し、他query/hash・戻る・言語切替で選択を保ちます。Heroとは別に、TOP10後の大きい一覧地図は県のnative直接リンクです。TOP10の人物AI画像はPC180px・狭幅110px/98pxのコンパクトな枠を基本にcontainで表示し、地域名/商品/価格/順位を保ちます。顔や耳を切らず、初期Heroは既存selection.heroProductIdを使います。これらは機能・表示の変更であり、訪問数や検索順位の改善を実測したという意味ではありません。

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
| 納品だけ | 最新sourceの書出し→ZIP→repository/export/ZIP集合・全SHA照合 | アプリ不変なら同じUIを再走査せず、記録/必須ファイル/秘密・退役物除外を確認 |

関連unitだけ先に実行する例は`node --experimental-strip-types --test tests/market-prices.test.ts`。最終の必要範囲は変更の広がりで決める。CIは独立した公開gateであり、ローカルの小修正検査を省略する理由にも、毎回497を走らせる理由にもしない。

## 0.17.1の記録を読む

追加のホームHeroは一覧地図と別に検査します。全24県の明示選択で女性画像/asset/alt/寸法・商品/価格metadata/単位・産地CTAが一致し、hover/focusで勝手に変わらず、region query/言語/他query/hash/戻る/不正id/noJSが正しいことを確認します。TOP10の縮小は枠の実寸とcontain/可読性/導線で確認し、訪問数の改善とは呼びません。

[地図拡大/直接選択020](../specs/020-direct-region-map/)が現在の作業。旧0.17.0の193件はpreview選択を確かめたもので、今回のクリック遷移や拡大の成功には流用しません。検証はclick-map-stageの専用reportへ分離し、日英home/objects/places、24県の有効href、native click/tap/Enterの実遷移と戻る、hover/focus/selectのpreview、100/150/200/300%と内部scroll/全体表示、JSなし、320/390/1440を確認します。SVGのbbox中心が海や別県になることがあるため、県の実際の塗り領域へ通常の入力を行い、force/DOMclickで合格させません。商品事実・Google店舗Mapsの30日設定は変更しません。実測/公開/ZIPの確定値は020 validationと[verification](verification.md)を正本にします。

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

最新の納品/公開の概要は[deployment-results.json](deployment-results.json)。現在019の地図/保存設定、直前018の全国追加、017の文書整備・旧0.15の公開検査を区別し、過去の件数や実行時刻を書き換えない。

