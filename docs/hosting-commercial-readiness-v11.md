# 商用公開先への移行準備

確認日：2026-11-16。**これは調査と移行手順の準備であり、移行済みではありません。** Cloudflareのアカウント、契約、プロジェクト、ドメイン、DNS、決済情報は作成・変更していません。現在の公開先はGitHub Pages、全ソースは既存のGitHubリポジトリにあります。

## 収益化の前に解決すること

GitHub Pagesは、オンライン事業や、主に商取引を促進するサイトの無料ホスティングとしての利用に制限があります。当サイトの「外部の商品を紹介して収益化する」目的について、決済を受け付けないから適合すると自動的に判断できません。**適合の確認、または商用の紹介・広告利用が認められる公開先の決定が、高優先の未解決事項です。** ソースをGitHubに保存することと、Pagesで商用配信することは分けます。[GitHub Pagesの利用制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

移行候補としてCloudflareのSelf-Serve契約（2025-09-12版）とDeveloper Platform条件（2026-09-28版）を読みました。読了した範囲ではGitHub Pagesと同じ商用サイトの一般的な禁止は見つからず、Developer Platformによるコンテンツ配信は明示されています。このため候補として検討できますが、**当サイトについてCloudflareの承認を得たわけではありません**。選択時には適用プラン、画面に示される条件、利用内容と料金を再確認します。[Self-Serve契約](https://www.cloudflare.com/terms/)、[Developer Platform条件](https://www.cloudflare.com/service-specific-terms-developer-platform/)

無料サービスの継続・無制限利用・無停止は保証されません。現行Pages Freeにはビルド数、ファイル数、1ファイル容量等の上限があります。また、コンテンツの権利・適法性・利用者への対応の責任は運営者に残ります。[Pagesの上限](https://developers.cloudflare.com/pages/platform/limits/)

現在の公式ガイドは、新規プロジェクトにはWorkersを推奨しつつ、Pagesの静的配信とGit連携も案内しています。以下は**既存の静的AstroをPagesへ移す場合の手順**です。実際に契約する時点で、Workersの静的アセット配信も比較して選び、SSRへの変更や不要なAPIを追加しません。[Cloudflare Pagesの現行案内](https://developers.cloudflare.com/pages/)、[AstroのCloudflare案内](https://docs.astro.build/en/guides/deploy/cloudflare/)

## 運営者が決める事項

1. 公開サービスとプランの条件を読み、利用契約へ同意できることを確認する。無料枠以外の課金・自動アップグレードを勝手に有効化しない。
2. 公開ホスト名を選ぶ。未提供の独自ドメインを作ったり購入したりしない。所有ドメインを使う場合は、DNSの管理権限と既存メール等への影響を確認する。
3. CloudflareとGitHubを連携する場合、対象を`rozawa619/japanese-craft-jewelry`に限定して許可する。全リポジトリの不要な権限や、秘密のトークンをソースへ追加しない。
4. AdSense等の登録では、求められる真実の契約者・本人・支払情報を運営者が入力する。公開名SORAとは区別し、公開GitHubへ本人情報を入れない。

## このサイトに合わせた配信設定

現在は`astro.config.mjs`が`output:'static'`で、`dist/`へHTML等を生成します。GitHubのリポジトリを作り直す必要はありません。PagesはGitHubの変更を取得して配信でき、Astroの出力先として`dist`が公式に案内されています。[GitHub連携](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)、[ビルド設定](https://developers.cloudflare.com/pages/configuration/build-configuration/)

| 設定 | このサイトで使う値・決定方法 |
| --- | --- |
| リポジトリ | `https://github.com/rozawa619/japanese-craft-jewelry`を継続 |
| 本番ブランチ | `main` |
| ビルドの作業ディレクトリ | リポジトリのルート |
| Node | `NODE_VERSION=24.22.1`以上で、検証した対応版に固定 |
| pnpm | `PNPM_VERSION=11.25.0`、packageManager/lockfileと揃える |
| 依存の導入 | 自動導入を止める場合は`SKIP_DEPENDENCY_INSTALL=1`を設定し、下記コマンドでlockfile固定導入 |
| 本番ビルド | `pnpm install --frozen-lockfile && pnpm verify && pnpm readiness` |
| 出力 | `dist` |
| `PUBLIC_SITE_URL` | 運営者が選び、実際に配信・管理できるHTTPS origin。パスを含めない |
| `PUBLIC_BASE_PATH` | 新しいホストのルートに置く場合は`/` |
| `PUBLIC_PUBLISH_MODE` | 本番は`public`、検証環境は`preview` |
| `PUBLIC_OPERATOR_NAME` | `SORA` |
| `PUBLIC_REPOSITORY_URL` | 現在のリポジトリURL |
| Contact | 現状のまま非公開。架空の環境値を追加しない |

Cloudflareのビルド環境はNode/pnpmの上書きと依存自動導入の停止を公式に案内しています。現行の既定Nodeは、このリポジトリの要求版と異なるため、既定任せにしません。[Build image](https://developers.cloudflare.com/pages/configuration/build-image/)

本番向けの`readiness`はpublic設定を要求するので、previewへ同じコマンドを無条件に流用しません。初回は本番mainだけの連携にし、preview自動配信を追加するときは`pnpm verify`とpreview/noindexの確認を使う別の分岐を実装・検証します。ドメインを決める前のテストURLを本番canonicalへ混ぜないようにします。

### 公開までの手順

1. 現行appのcommit、公開URL一覧、価格・画像の正本、デプロイ設定を控える。新しいサービスの利用条件を確認し、運営者がアカウントと必要な連携を承認する。
2. 選んだ新しいホストへ、既存の静的生成物をroot配置する検証環境を用意する。検証中はnoindexで、広告タグを入れず、不要なアクセス解析やスクリプト注入機能を有効化しない。
3. root配置向けの`PUBLIC_SITE_URL`/`PUBLIC_BASE_PATH`で再生成する。商品slugや日英の構成を変更せず、`/en/`と`/ja/`を維持する。旧`/japanese-craft-jewelry/`がCSS・画像・リンク・OGP等に残っていないことを確認する。
4. 下記の受入確認を済ませてから、新しい本番originでpublic生成し直す。既存GitHubの公開workflowは旧origin/baseが固定されているため、変更せず新ホスト向けの検証に流用しない。新公開の確認後、古いコンテンツの二重更新を止めるよう旧配信jobを見直す。GitHubのソース保存・型/テスト等のCIは継続する。
5. 新URLで実測し、結果にアプリcommitとホスト側の配信IDを記録する。設定しただけで移行完了としない。新環境に問題があれば、広告開始前に修正または安全な直前版へ戻す。

## 既存URLと検索設定

旧URLの`/japanese-craft-jewelry/`以下と、新ホストの`/`以下をページ単位で対応させます。日本語の商品ページは同じ日本語の商品へ、英語は同じ英語へ移し、全ページを新トップへまとめて転送しません。新しいページは自己参照canonicalを持ち、hreflang、OGP、内部リンク、robots/sitemapも同じ公開originへ揃えます。[Googleの移転手順](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

Cloudflare Pagesには`_redirects`やドメイン転送の機能があります。ただし、**新しいCloudflareに置いた`_redirects`だけでは、旧GitHubドメインへのアクセスを転送できません**。ルールが動くのは、その配信先へ到達したリクエストです。旧ホストで実際に使える転送方法を別途確認します。[Cloudflare Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

サーバー側の恒久転送を使える場合は、正しい1段の301/308を優先します。GitHubの静的HTMLでしか対応できない場合は、固定した新URLへの即時meta refreshと通常リンク等の代替を実装・実測し、HTTP301を設定したと虚偽に記録しません。検索側の解釈や移転完了を保証せず、旧ホスト側の利用条件も守ります。[Googleの転送方法](https://developers.google.com/search/docs/crawling-indexing/301-redirects)

新ホストへ独自ドメインを割り当てた後、`pages.dev`を正規ドメインへ統一する場合は、Cloudflareの公式手順でパス・query等を保持して転送し、往復ループを検査します。ここにも実際のドメインを決める前の値を入れません。[pages.devからの転送](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)

Search Consoleは運営者が管理できる実プロパティを確認し、新しいsitemapを送信します。Change of Addressはドメイン階層の所有確認等に条件があり、旧サイトのパス階層プロパティだけで使えるとはしません。今回の旧projectパスに対して無条件にツールを実行しないようにします。[Change of Addressの条件](https://support.google.com/webmasters/answer/9370220?hl=en)

## 独自ドメインを選んだ場合のDNS

Cloudflare PagesのCustom domainsへ実際のドメインを登録してから、指定されたDNS設定を行います。apex利用はCloudflare zoneとnameserver設定が必要で、サブドメインは現在のDNS事業者でCNAMEを設定できる場合があります。Pages側へ関連付けずCNAMEだけ作ると正常に動かないことがあるため、公式の順序を守ります。[Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

DNSを変更する前に既存のMX/TXT等を控え、メール、SPF/DKIM、他のサイトを壊さないようにします。未提供のDNS値やドメインを推測して設定しません。HTTPS証明書とapex/wwwの統一を実測し、全サブドメインを管理していない段階で広いHSTS設定を追加しません。

## 移行時のPrivacyとセキュリティ

移行したらPrivacyの配信事業者を実態へ更新します。Cloudflareのサービスや設定によってセキュリティ用Cookie等が生じるため、現在のGitHubでのCookie0観測を新ホストへ流用しません。新しいブラウザで通信先・Cookie・保存領域・bot画面・広告タグ不在を再確認します。CloudflareのPrivacyと、実際に有効にしたサービスの説明を確認します。[Cloudflare Cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)、[Privacy](https://www.cloudflare.com/privacypolicy/)

静的Pagesでは`_headers`で追加ヘッダーを設定できます。移行作業では`frame-ancestors`/`X-Frame-Options`、`nosniff`等を検討し、現在のAstro生成CSPと衝突させずに実測します。AdSenseのためにCSPを全面解除しません。Functions/SSRを加える場合はヘッダーの適用方法も変わるため、本書の静的配信とは別の変更として扱います。[Cloudflare Headers](https://developers.cloudflare.com/pages/configuration/headers/)

## AdSenseへ登録するホストの確認

申請URLに`/japanese-craft-jewelry/ja/`のようなパスを入れて問題を回避することはできません。Googleの入力案内はパス・query・fragment・portのない標準ドメインを求めています。一方、Sites管理の公式案内ではPublic Suffix List掲載プラットフォームのサブドメインも対象として挙げています。[URLの入力条件](https://support.google.com/adsense/answer/2784438?hl=en)、[Sitesの対象](https://support.google.com/adsense/answer/12170421?hl=en)

2026-11-15版の公式Public Suffix Listには`pages.dev`と`github.io`の両方が載っています。したがって「提供サブドメインだから全面不可」「有料の独自ドメイン購入が必須」と一律に断定しません。しかし、PSL掲載だけで実際のアカウントの受理・所有確認・内容審査が通るわけでもありません。今回の運営者のAdSense管理画面では登録・確認をしていません。[Public Suffix List](https://publicsuffix.org/list/public_suffix_list.dat)

実際に選んだホストのrootが200で公開されること、サイト全体を管理して確認コードや必要な広告ファイルを置けること、Google管理画面でそのホストを登録・所有確認できることを確認します。現在の`https://rozawa619.github.io/`が404である課題は、プロジェクトの下層だけが200でも解消しません。新ホストが決まったらrootを起点に確認します。申請・契約・コード取得は運営者の操作として残し、架空のpublisherIDやads.txtは作りません。

## 新公開先での受入確認（未実行）

- [ ] 選択したプラン・契約の商用紹介/広告利用の適合を確認した
- [ ] 運営者が必要なアカウント連携・ドメイン/DNS変更を承認した
- [ ] 実際の公開root/日英トップ/全正規ページ/404が期待するHTTP応答を返す
- [ ] 型・単体・データ参照・本番build・内部リンク・広告切替を確認した
- [ ] canonical/OGP/hreflang/robots/sitemap/画像に新origin/baseが反映された
- [ ] previewはnoindex、本番は意図どおりindex設定になっている
- [ ] 日英スマホ、言語の同ページ往復、絞込/query/hash、店舗リンクを確認した
- [ ] AI28画像と公式プレビューを含む全商品導線を確認した
- [ ] 旧URLから同じ内容の新URLへ移る方法と実際のHTTP/HTML応答を確認した
- [ ] Privacy、通信先/Cookie、CSP/追加ヘッダーを新ホストで実測した
- [ ] AdSense申請ホストの受理・所有確認・同意要件を運営者が確認した
- [ ] 配信ID/commit/結果/更新手順をhandoff・deployment-resultsへ反映した

上記は今後の移行作業であり、本稿を作っただけで完了扱いにはしません。調査記録は`research/legal-audit-v11.json`のhostingMigrationを参照してください。
