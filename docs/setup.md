# 起動・公開・復旧・納品

操作はrepoのルート（package.jsonがあるdirectory）で行います。Windows PowerShell7の例を主に使います。別AIは[ai-handoff](ai-handoff.md)、日々の編集は[editing-guide](editing-guide.md)へ。

## 必要なもの

| 用途 | 要件 |
| --- | --- |
| 起動/build/unit | サポート中の修正版Node。現在の最低版はpackage.jsonの24.22.3、pnpm11.25.0 |
| browser検査 | Google Chrome本体。scriptsはchannel:chromeを使うため、Chromiumだけのインストールとは別 |
| 版管理/公開 | Git。既存remoteはREADMEのrepo。pushには利用者自身の正しい権限が必要 |
| 納品ZIPの自動作成/全SHA | PowerShell7（pwsh）。Node/pnpmだけで行うsource directory書出しも別途可能 |

~~~sh
node --version
pnpm --version
pnpm install --frozen-lockfile
~~~

pnpmが未導入なら、Nodeを用意した上で利用者の環境にpnpm11.25.0を用意します。CIで使っている導入コマンドは次です。管理権限等はそのPCの方針に従ってください。

~~~sh
npm install --global pnpm@11.25.0
~~~

この資料整備でOSglobalのNodeやChromeをインストールしたという意味ではありません。依存の再現にはlockfileを使い、エラーを消すために削除したりauditの無視条件を足したりしません。

## 新しいcloneまたはZIPから起動

GitならREADMEのrepoをcloneして移動、ZIPなら展開してpackage.jsonがある階層へ移動します。.git/.env/node_modules/dist/artifactsや元PNGがないのは正常です。**docsはbuild依存のJSONを含むので全体を残します。**

[START_HERE](../START_HERE.md)が別AI向けの入口、[handoff-assets](handoff-assets.md)がGitHub原本の取得先です。`.gitattributes`はcheckoutのbytesを維持し、Windowsのautocrlfによる固定SHA記録の変更を防ぎます。新規のソース/文書はUTF-8/LFで保存し、過去のmanifest/proofを一括整形しません。

~~~sh
pnpm install --frozen-lockfile
pnpm dev
~~~

.envなしでも起動できます。初期値はbase=/・preview/noindexで、通常は表示されたLocal URLの/ja/と/en/です。Local URLの実際のportを見てください。既存.envがある作業場所では、そのPUBLIC_BASE_PATH等が適用されます。

README等のMarkdownはサイトへ自動掲載されません。画面の文章はsrc/data/とsrc/content/を編集します。

## envの扱い

[.env.example](../.env.example)は変数名だけの見本です。必要な場合だけ.env等のローカル設定へ記入し、Gitへ入れません。PUBLIC_はbuild済みHTML/JavaScriptへ公開される値で、秘密の保管先ではありません。

| 変数 | 意味 |
| --- | --- |
| PUBLIC_SITE_URL | originだけ（現在https://rozawa619.github.io）。repo名や/ja/を末尾へ足さない |
| PUBLIC_BASE_PATH | 現公開は/japanese-craft-jewelry/。ルート配置なら/ |
| PUBLIC_PUBLISH_MODE | 未完成はpreview/noindex。本番同等検査と実公開だけpublic |
| PUBLIC_OPERATOR_NAME | 公開名SORA |
| PUBLIC_REPOSITORY_URL | README記載の実repo URL |
| PUBLIC_CONTACT_EMAIL | 空のまま。Contactは公開しない |

明示したprocess envは.envの読込みで上書きされません。Astro設定は.envを読み、readinessはproduction系envも確認するため、同じprofileを明示して使うのが確実です。詳細は[config](../astro.config.mjs)と[readiness](../scripts/readiness.ts)。

## 本番同等のローカル検査

初回のnoindexプレビューと、本番metaを検査するbuildを分けます。以下は実際の公開と同じ設定でHTMLを作り、localhostから読むだけです。この操作だけでGitHub Pagesへ公開されません。

ターミナルA（PowerShell）:

~~~powershell
$env:PUBLIC_SITE_URL='https://rozawa619.github.io'
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:PUBLIC_PUBLISH_MODE='public'
$env:PUBLIC_OPERATOR_NAME='SORA'
$env:PUBLIC_REPOSITORY_URL='https://github.com/rozawa619/japanese-craft-jewelry'
$env:PUBLIC_CONTACT_EMAIL=''
New-Item -ItemType Directory -Path artifacts/checks -Force | Out-Null
$env:CHECK_IMAGE_REPORT_PATH='artifacts/checks/image-files.json'
$env:CHECK_DETAIL_IMAGE_REPORT_PATH='artifacts/checks/detail-image-files.json'
$env:CHECK_PRIVACY_REPORT_PATH='artifacts/checks/privacy.json'
$env:SEO_REPORT_PATH='artifacts/checks/seo.json'
pnpm verify
pnpm check:seo
node scripts/astro.mjs preview --port 4323 --host 127.0.0.1
~~~

Local URLはhttp://127.0.0.1:4323/japanese-craft-jewelry/です。previewが動いている間、同じdistをbuildし直しません。ターミナルBへenvは自動で引き継がれないので、検査側にもbaseとoriginを設定します。

~~~powershell
$env:PUBLIC_BASE_PATH='/japanese-craft-jewelry/'
$env:CHECK_BASE_URL='http://127.0.0.1:4323'
New-Item -ItemType Directory -Path artifacts/checks -Force | Out-Null
$env:CHECK_REPORT_PATH='artifacts/checks/my-change-mobile.json'
$env:CHECK_SCREENSHOT_PREFIX='my-change-mobile'
pnpm check:mobile
~~~

目的に応じてcheck:types/check:headings/check:sources等へ変え、report名も変えます。詳細は[検証matrix](verification-guide.md)。Source/SEO等は本番canonical/sitemapを前提とするため、未設定noindex buildでの全項目成功を求めません。pnpm readinessも公開設定用で、未設定localの失敗は通常起動の失敗ではありません。

macOS/Linux等では同じ値をexportし、mkdir -p artifacts/checksでdirectoryを用意します。例:

~~~sh
export PUBLIC_BASE_PATH=/japanese-craft-jewelry/
export CHECK_BASE_URL=http://127.0.0.1:4323
export CHECK_REPORT_PATH=artifacts/checks/my-change-types.json
export CHECK_SCREENSHOT_PREFIX=my-change-types
mkdir -p artifacts/checks
pnpm check:types
~~~

PUBLIC_BASE_PATHはbuildと検査で必ず一致させます。今回整えた主要QA toolは/とproject subpathを正規化しますが、既定値やportには世代差があるため、省略して自動推定へ頼らないでください。

## このWindows作業環境の補足

このPCのglobal Node24.22.1は残し、公式SHAを照合したtask-local Node24.22.3をartifacts/runtime/node-v24.22.3-win-x64へ置いてあります。同dirのpnpm.cmdは既存pnpmのJS CLIをpatched Nodeで起動する便宜的wrapperです。他PCのfresh cloneには含まれず、必要条件でもありません。

~~~powershell
$taskRuntime=Join-Path (Get-Location) 'artifacts/runtime/node-v24.22.3-win-x64'
$env:PATH=$taskRuntime+';'+$env:PATH
node --version
pnpm --version
pnpm exec node --version
~~~

pnpm --versionはpnpm自体が使うNode版の証明ではなく、pnpm exec nodeは子processの確認です。旧Nodeを固定して起動するpnpm.cmdがある場合は、上のwrapper等でpnpm本体もpatched Nodeから起動するか、利用者の通常環境を整え直します。wrapperはこのPCの実際のCLI配置に依存し、別PCへ持ち出す設定ではありません。

## よくあるエラー

| 症状 | 確認すること |
| --- | --- |
| Node is below the supported security floor | package.jsonの最低版と、実際に選択されたnodeを確認。gateを削除しない |
| Chromeが見つからない | この検査はchannel:chrome。Chrome本体を用意し、Node installと混同しない |
| 最初のpageが404/画像が出ない | build/preview/checkerのbaseと実portを揃える。CHECK_BASE_URLへrepo pathは付けない |
| Source/SEOがlocalで失敗 | noindex buildとpublic profileを混同していないか確認 |
| Another astro preview server | 表示されたPID/URLがこの作業のものか確認。該当するならnode scripts/astro.mjs preview stopで停止して再起動 |
| missing source/image/guide/reference | [編集ガイド](editing-guide.md)の更新単位を確認。validatorを緩めて隠さない |
| 外部URLが403/503 | 一時/閲覧制約と事実変更を区別。生結果を残しfresh browserで再確認してから判断 |
| npm取得がETIMEDOUT | 公式registryへの通信条件を確認し、生ログを残す。lockfile固定版が標準pnpm cacheに揃っている場合だけ`pnpm install --frozen-lockfile --offline`で再現可能。cacheがなければ通信復旧が必要。TLS検査やlockfileを無効化しない |
| 日本語JSONが読めない | UTF-8で保存、JSONの引用符/末尾カンマ/重複IDを確認。Windows旧PowerShellの文字コードにも注意 |

## 公開と復旧

実アプリの公開設定は[deploy.yml](../.github/workflows/deploy.yml)です。mainへのpushで依存監査/readiness/verify/SEO→artifact→Pages deploymentを実行します。Gitへ保存しただけ、build成功だけ、公開成功を分け、該当commitのActions conclusion=successと実URLを確認します。

公開後は最終distとのHTML/画像SHA、日英・スマホ・対象操作を別reportで確認します。新規ドメイン/課金/CMP/本人情報の登録はこのrunbookの実行対象に含めず、[残作業](handoff.md#未完了判断が必要な事項)で判断します。

問題があれば、未commit差分を保存してから対象commitの差分を確認し、公開に問題を入れたcommitをgit revertで打ち消す方法を優先します。未関係の変更が混ざったcommitを丸ごと戻したり、reset --hard/force pushで履歴を消したりしません。戻した後もverify→Actions→実URLを確認します。現在の最終appはdeployment-results.applicationCommitに記録されています。

文書/tool/コメントだけで生成物が最終公開版と同じ場合は、今回のように検査とSHA一致を残し、不要な再公開を避けた文書commitにできます。skip ciを、実アプリの未検証変更を隠すために使いません。

## Gitだけからの引継ぎを再確認する

[検証専用workflow](../.github/workflows/verify-handoff.yml)はGitHub Actionsから手動実行できます。新しいrunnerのcheckoutからNode・固定pnpm・依存導入・通常verify・SEO・元PNGなしモデルQA・文書・公開出力の全SHAを確認します。権限はcontents:readのみで、Pagesへの公開は行いません。結果と対象SHAを確認してから引継ぎ状態へ記録してください。

依存と生成物がまだないfresh cloneでは、`node scripts/check-handoff-portability.mjs --preflight`で引継ぎ入口とGit内の検証資料を確認します。本番設定で生成した後は同スクリプトの`--dist`で、[公開記録](deployment-results.json)と同じ版の全生成物を個別ハッシュ一覧に照合します。

## 納品ZIPを作る

source directoryの書出しだけならpnpm packageです。既存exportはsource-backupへ残ります。ZIPと全SHAまで作るならPowerShell7で次を実行します。

~~~powershell
pnpm package:delivery
~~~

名前を固定する例（同じRevisionで再作成すると旧版をbackupへ保存）:

~~~powershell
pwsh -NoProfile -File scripts/package-delivery.ps1 -Revision docs-017
~~~

既定でexportも実行します。-SkipExportは、exportを先に用意して検証だけしたい場合に限ります。共通の除外ルールから現在のrepo対象ファイルを列挙し、exportの欠落・余分なファイル・SHA不一致で停止します。件数はcatalog/registryから読み、50/98へ固定していません。

隣接japanese-craft-jewelry-deliveryへ、source/、版付きZIP、latestのjapanese-craft-jewelry-source.zip、外部package-verification JSONを作ります。ZIPはcandidateを検証後に確定し、旧ZIP/既存export/同名proofをbackupへ保持。通常のpnpm packageも同じルールで、書込み前に保存先の祖先・入力内のリンク/junctionを検査します。リンク経由の作業場所や納品先は使えないため、実体のあるdirectoryへ置いてください。

対象から除外するのは.env系（ルートの.env.exampleだけ含む）、.npmrc/.netrc/_netrc/.pypirc/.git-credentials、秘密鍵に使われる.pem/.key/.pfx/.p12、依存実体/dist/artifacts等の生成directory、ルートの.log、台帳の退役画像です。任意のファイル本文にあるtokenや個人情報まで自動検出する機能ではないので、追加ファイルは内容も確認してください。repo→export→ZIPの対象ファイル集合と全件SHAを照合し、ZIP自身のSHAはZIP外へ記録します。全Git履歴の秘密監査ではありません。PowerShell7.0の.NETでも使えるSHAの16進表記処理ですが、実行環境自体はサポート中のPowerShellを選んでください。

元PNG/私的QA画面はsourceとは別資料。原本がなくても通常build/verifyはでき、新規画像制作時には生成記録と権利を確認します。完了時は[handoff](handoff.md)・deployment-results.sourceDeliveryを新しいproof/実測へ合わせて再exportし、最後の文書を含むZIPをもう一度照合します。
