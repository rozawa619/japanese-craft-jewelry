# 商用ホストへの移行準備 — 0.17

一次資料の確認日：2026-11-17。この文書は、既存のGitHubリポジトリと静的Astroを保ったまま、Cloudflare Pagesを候補に公開先を移すための実施手順です。新サービスの登録、利用契約、料金同意、DNS変更、実移転は行っていません。現GitHub公開のHTTP保護ヘッダーを設定済みとする資料でもありません。

0.11の[移行検討](hosting-commercial-readiness-v11.md)にある古いNode値より、現在の[package.json](../package.json)・[setup](setup.md)を優先します。最新の実配信SHAと検証は[deployment-results](deployment-results.json)、ホスト用途適合の法務上の区分は[再確認](legal-review-v17.md)を参照してください。

## 1. 完了した準備と、本人の判断が必要なこと

Astroは`output: static`、出力は`dist/`です。会員・注文・決済・DB・SSRは不要で、同じソースを別ホストで生成できます。Cloudflareの公式にもAstroの静的出力とPagesへの配信手順があります。ここでは既存サイトを書き換えて新規作成するCLIやCloudflare adapterを追加しません。[Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

| 項目 | 準備・実行条件 |
| --- | --- |
| ソース | 既存`rozawa619/japanese-craft-jewelry`を継続。移行検証は別ブランチ/別作業コピーで行い、共有distの検証中に再buildしない |
| 実契約 | 本人が選んだサービスの現行規約・用途・プラン・上限を確認して同意する。料金や有料自動変更を推測して承認しない |
| アカウント | 本人の実アカウントと管理権限が必要。MFA・回復方法を設定し、連携対象は必要な一つのリポジトリへ限定する |
| 公開名 | 本人が実際に管理するHTTPSホストを選ぶ。未提供のドメインを購入・設定せず、仮ホストを本番canonicalへ入れない |
| ドメイン所有確認 | 独自ドメインを使う場合は所有権・DNS管理権限が必要。所有しない値や他人のゾーンを使わない |
| 広告 | 移行中もAdSense off・通常リンク。実ID、所有確認、承認、配信方式/CMPは別作業 |

Cloudflareを候補にしたこと自体は、個別アカウント/将来用途/料金の契約適合の認定ではありません。登録時の[Self-Serve Subscription Agreement](https://www.cloudflare.com/terms/)と選択する製品・プラン条件を本人が確認する必要があります。GitHubソースを保存することと、GitHub Pagesで収益化サイトを配信し続けることは別です。[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## 2. Cloudflare Pagesで設定する値

Git連携を選ぶ場合、既存リポジトリの読取連携で構築します。root directoryはリポジトリのルート、出力directoryは`dist`。当初はproductionだけに限定し、任意のPR/ブランチを自動公開しない設定から始めます。[Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

| 設定 | 値 |
| --- | --- |
| Node | `NODE_VERSION=24.22.3`以上の、採用時に検証したサポート中の修正版。現在の最低版は24.22.3 |
| pnpm | `PNPM_VERSION=11.25.0`。packageManager/lockfileと一致させる |
| 自動依存導入 | `SKIP_DEPENDENCY_INSTALL=1`を設定し、下記でlockfile固定導入する方式を選べる |
| Build command（本番） | `pnpm install --frozen-lockfile && pnpm verify && pnpm readiness && pnpm check:seo` |
| Build command（preview） | `pnpm install --frozen-lockfile && pnpm verify` |
| Build output | `dist` |
| Functions/SSR | 使用しない。追加する場合は本書のヘッダー適用前提を再検証する |

Node/pnpmの既定値任せにせず、公式の環境変数による上書きを使います。[Build image](https://developers.cloudflare.com/pages/configuration/build-image/)

`PUBLIC_`は公開値であり、API key・トークン・契約者情報を入れません。Gitへ`.env`を追加しません。次の値はCloudflare側のproductionとpreviewで別々に設定します。

| 変数 | 本番 | 検証用preview |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | 本人が選んだ実HTTPS originだけ。末尾に`/ja/`やrepo名を足さない | 実際の検証origin、または未設定でnoindexを確認 |
| `PUBLIC_BASE_PATH` | ホストのルートなら`/` | 同じルート配置なら`/` |
| `PUBLIC_PUBLISH_MODE` | 実本番だけ`public` | `preview` |
| `PUBLIC_OPERATOR_NAME` | `SORA` | `SORA` |
| `PUBLIC_REPOSITORY_URL` | `https://github.com/rozawa619/japanese-craft-jewelry` | 同じ |
| `PUBLIC_CONTACT_EMAIL` | 空。実連絡先を発明しない | 空 |

現在のGitHub用`PUBLIC_BASE_PATH=/japanese-craft-jewelry/`をroot配信へそのまま持ち込むと、CSS・画像・リンクが壊れます。逆に現GitHub公開をroot設定で上書きしません。

## 3. previewと本番の検索設定を分ける

このリポジトリのpreviewはHTMLがnoindex、canonical/OGの公開URLなし、sitemap URLなし、robotsはDisallow `/`です。Cloudflareのpreview deploymentにも既定で`X-Robots-Tag: noindex`が付きますが、アプリ側のpreview設定を省略する理由にはしません。[Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

previewに`pnpm readiness`や公開用`pnpm check:seo`の成功を求めません。この二つはpublic設定の検査です。previewでは`pnpm verify`と、実際のHTML/HTTP応答のnoindex・リンク・画像を確認します。

本番では実HTTPS originとbaseで生成し直し、正規商品/分類ページに自己参照canonical、相互日英hreflang、同じorigin/baseのOG/JSON-LD/sitemap、公開robotsを確認します。旧originや検証origin、`/japanese-craft-jewelry/`の残存を検査します。既存の404・言語入口・退役読み物などの意図したnoindexは維持し、全HTMLから一律にnoindexを消しません。

## 4. `_headers`の内容と適用範囲

Cloudflare Pagesは静的アセットの`_headers`を解析してHTTPレスポンスへ反映します。Astroでは`public/_headers`を用意すればbuild時に`dist/_headers`へコピーできます。`_headers`自体はCloudflareでは通常の静的ファイルとして配信されません。**このファイルをGitHub Pagesへ置いただけでは、HTTPヘッダーは設定されません。** Filesの存在と実応答の設定成功を区別します。Cloudflare Functions/SSRの生成応答へはこの仕組みが適用されないため、その場合はResponse側で設定し直す必要があります。[Cloudflare Headers](https://developers.cloudflare.com/pages/configuration/headers/)

最小構成の例です。最終的には同梱`public/_headers`と実HTTP応答を照合します。

~~~text
/*
  Content-Security-Policy: frame-ancestors 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=()
~~~

`Referrer-Policy: no-referrer`を採用することもできますが、iframe等の個別`referrerpolicy`が要求に使われることがあります。headerだけで全外部要求のRefererが0になったとは記録せず、採用値と実際のiframe設定・通信を照合します。

既存のAstroはHTML metaに、script hashや`default-src 'self'`、Google限定`frame-src`等のCSPを生成しています。HTTP CSPを上の`frame-ancestors 'none'`だけにすれば、metaの既存制限を保ち、当サイトが他サイトのframeへ埋め込まれることを追加で防げます。複数のCSPはそれぞれが適用され、後のpolicyで前の制限を緩める仕組みではありません。`frame-ancestors`はmetaでは無視されるためHTTPヘッダーが必要です。[W3C CSP3](https://w3c.github.io/webappsec-csp/#multiple-policies)、[frame-ancestors](https://w3c.github.io/webappsec-csp/#directive-frame-ancestors)

誰が当サイトを埋め込めるかと、当サイト内にGoogleマップを読み込めるかは別です。上の`frame-ancestors`やXFO DENYを理由に、Google向け`frame-src`を消しません。Permissions-Policyではfullscreenを禁止せず、地図iframeのfullscreen許可を保ちます。現在地は取得しない設計なのでgeolocationは許可しません。Google iframeと干渉し得るCOEPは追加しません。これらは地図のプライバシー選択・期限・撤回を不要にする設定ではありません。

HSTSの`includeSubDomains`やpreloadは、全対象サブドメインのHTTPSと運用を確認せずに追加しません。`Access-Control-Allow-Origin: *`等もこのサイトに必要な変更ではありません。

## 5. 移行の実行順序

1. 現在の公開app SHA、GitHub Actions run、sitemapのURL一覧、生成物manifest、現DNS/ホスト設定、最新source/原本ZIPを控える。秘密やCookieは公開Gitへ保存しない。
2. 本人がホスト/実アカウント/プラン/公開名を選び、必要な規約・権限に同意する。登録や課金を完了したふりにせず、選択結果を作業台帳へ記録する。
3. productionを切り替える前に、別ブランチ/別作業コピーでroot配置のpreviewを作る。認証・決済・広告・解析・Zaraz等は追加しない。`pnpm verify`を成功させ、リンク・日英・画像・地図設定/撤回を確認する。
4. `_headers`を含む生成物を実ホストへ配信し、HTML・CSS・JS・WebP・404のHTTP responseを確認する。ファイルがあるだけの段階ではヘッダーを配信済みとしない。
5. 実本番originを決定し、public設定でverify/readiness/SEOを再実行する。新本番URLからのHTML/画像SHAとmeta、スマホ・地図・価格・広告offを検査する。
6. 独自ドメインを使う場合は、PagesのCustom domainsに関連付けてから公式手順に従いDNSを変更する。apexではCloudflare zone/nameserverが必要な構成があり、サブドメインでは既存DNSのCNAMEを使える場合がある。先にMX/TXT等を控え、メール/SPF/DKIMを壊さない。実際に割り当てられた値だけを使う。[Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
7. ホストの実態に合わせてPrivacyの配信事業者・処理・保存/権利対応を更新する。Cookie/Storageとボット保護画面等を新ブラウザーで観測し、旧GitHubの通信観測を新ホストへ流用しない。
8. 新公開が安定してから旧GitHub配信を整理する。現deploy workflowはGitHub origin/baseを固定しているので、無変更のまま新サイト用のCI/配信成功として扱わない。GitHubのソース保存と型/テストCIは継続できる。

## 6. 旧URL・転送と二重配信

旧`/japanese-craft-jewelry/{ja,en}/...`と新`/{ja,en}/...`をページ単位で対応させ、商品slugを保ちます。全ページを新トップへまとめて送らず、絞込query・fragmentと言語も必要に応じて実測します。転送先は決定済みのHTTPS originへ固定し、queryから任意ホストへ飛ばせるopen redirectを作りません。

新Cloudflareの`_redirects`は、新ホストへ到達した要求にだけ働きます。これを追加しても旧`rozawa619.github.io`のHTTP応答は転送されません。旧ホストで実際に制御できる方法を使う必要があります。旧GitHubでHTTP301/308を設定できなければ、固定先のHTML meta refreshと通常リンク等の代替を作り、HTTP301を実装したとは記録しません。転送実装は実origin確定後にテストします。[Cloudflare Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

旧GitHubの継続配信jobを停止する場合も、新公開を確認してから実施します。新旧サイトを両方public/indexableのまま独立更新し続けず、旧側の転送・canonical方針と新側の自己参照canonicalを対応させます。Search Consoleの実プロパティ権限を持つ本人が新sitemap等を扱い、パス階層の旧サイトからChange of Addressが必ず使えるとはしません。

## 7. 受入確認と復旧

| 確認 | 実行・記録する内容 |
| --- | --- |
| 静的生成 | 対象envで`pnpm verify`。実行時のNode/pnpm・app SHA・生成manifestと結果を保存 |
| 公開設定 | publicは`pnpm readiness`と`pnpm check:seo`。previewはnoindex/canonicalなし/robots等を別に確認 |
| ヘッダー | 実HTTPSでCSP frame-ancestors、XFO、nosniff、Referrer、Permissionsを確認。meta CSPのhashを維持し、CSP/console errorがない |
| 機能 | JA/EN・320/390/PC、価格と購入先、絞込・地図連動・Sources・全画像とリンク |
| Maps | 未選択/拒否/期限切れではGoogle0、許可後の表示/次ページ/再訪、全撤回・複数タブ、Google帰属・fullscreenを確認 |
| 地図以外 | AdSense off・未承認リンク通常URL・不要な解析/広告/位置取得なし |
| 配信照合 | sitemap正規URL群と全公開画像の200/SHA、意図したdraft/Contact除外、404が正しく404 |
| 転送 | 旧→新の言語/商品対応、query/fragment、ループ、二重canonical。旧ホストで実際のHTTP statusを測る |

PowerShellで応答を確認する場合は、本人が実際に決めたURLを渡します。以下の`$approvedPageUrl`は実URLを設定してから使う変数名です。

~~~powershell
$response = Invoke-WebRequest -Uri $approvedPageUrl -MaximumRedirection 0
$response.StatusCode
$response.Headers
~~~

Cloudflareでは成功済みproduction deploymentへロールバックできます。preview deploymentはその対象ではありません。移行前に、戻すproduction deployment ID・app SHA・そのenvとmanifestを控えます。問題時は新ホスト側で直前の確認済みproductionへ戻し、DNSも変えた場合は控えた実設定へ戻してHTTPS/メール/旧新URLを再確認します。キャッシュやDNSの反映を即時と断定せず、転送ループを避けます。[Cloudflare Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)

アプリの復旧では、他人の変更を消すreset/force pushを避け、問題commitを特定してrevertまたは確認済み版を新commitで再配信します。復旧後にも広告off・地図設定・meta/画像SHAを検査します。新公開・転送・実headerの証拠が揃うまでは、移行完了/全host対策完了と記載しません。

## 8. 次の担当者が記録する欄

### 今回完了したローカルのヘッダー試験

[check-hosting-headers.mjs](../scripts/check-hosting-headers.mjs)は、対応ホストを模したGET限定のサーバーを127.0.0.1の一時portへ立て、固定distを`/japanese-craft-jewelry/`で安全に配信します。パス境界・実pathを検証し、`_headers`自体は配信しません。build/実公開/実サービスの作成は行わず、終了時にChromeとサーバーを閉じます。

実行例は、安定したdistを用意してから`node scripts/check-hosting-headers.mjs`です。`CHECK_REPORT_PATH`で今回専用の出力名を指定します。[今回の結果](discovery-map-stage-migration-headers-results.json)は7/7成功。日英の実HTTP応答2件で5種類のヘッダーを観測し、DOM meta CSPは別に記録しました。親ページから当サイトを埋め込む操作はframe-ancestorsで拒否され、期待したCSP console1件をアプリのエラーから分離しています。商品ページ自身は初期Google接続0、明示許可後のGoogle埋込document要求2件を観測して外部通信を遮断しました。タイル・ピン・Google側Cookieを実表示した検査ではありません。

関連入力10ファイルとdist全470ファイルの前後SHAが一致し、アプリpage error/予期しないconsole errorは0でした。初回は検査側がHTML内のmeta名を大文字固定で検索して2項目失敗したため、HTMLの仕様に合う大文字小文字を区別しない検査へ修正して全件再実行しました。初回raw/logは私的証跡artifacts/discovery-map-stage/migration-headers-first-attempt-results.json等へ保持しています。これは移行準備のローカル試験であり、現在のGitHub PagesへこれらのHTTPヘッダーが適用されたという記録ではありません。

実施時には、選択host/プラン、本人の契約/連携判断、実production/preview originとbase、app SHA、ホストのdeployment ID、実header/通信/SEO/操作検査のreport、旧URL対応表、復旧先を記録します。認証トークン、本人・支払情報、DNS管理用の秘密、Cookie等は記録資料やGitへ入れません。

この準備文書とヘッダー用ソースは移行前に作れます。本人の新サービス/料金への同意、アカウント権限、ドメイン所有権、実DNS値、実ホストでの配信確認は、ソース上の仮設定だけで終わらせられない残作業です。
