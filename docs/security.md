# セキュリティと残る運用範囲

確認日：2026-11-16。Japanese Craft JewelryはAstroの静的サイトです。サイト内にアカウント、管理画面、投稿受付、決済、注文、独自API、データベース、解析タグはありません。価格・記事・広告設定はGitのレビュー対象となるファイルで管理し、ブラウザから編集しません。

## 実装した境界

- 通常の販売店リンクは登録されたmerchantのURLと同じホスト名だけを許可。広告先はprogramの`affiliateAllowedHosts`に列挙した完全一致ホストだけを許可します。サブドメインや似たドメインを暗黙に許可せず、プログラムと商品リンクの承認、対象merchant、実在する確認日のすべてが必要です。欠落・停止・不正な広告URLでは通常リンクへ戻し、通常URLも不正ならボタンを出しません。
- 公開URLはHTTPS、認証情報なし、通常の公開ドメインを要求。ローカル名・IPアドレス・非標準ポート・バックスラッシュ・空白や制御文字を拒否します。この検査はサーバー側のURL取得機能ではなく、外部ナビゲーションの設定ミスを防ぐためのものです。
- JSON-LDは`<`、`>`、`&`などをエスケープしてscript終了タグの混入を防ぎます。Astroの通常テキスト補間を使い、記事等をブラウザで`innerHTML`へ渡しません。Markdownとコードの書込権限は信頼する編集者に限定する前提です。
- Astro標準CSPで生成したスクリプト・スタイルのhashと同じサイトのリソースを許可します。`unsafe-inline`・`unsafe-eval`、外部接続、埋込フレーム、object、form送信、base差替えを許可しません。余白指定もCSSへ移し、style属性は使いません。新しい広告コードを貼っても自動では実行されません。
- 着用イメージはローカルの画像だけを許可。公式写真の無断ホットリンク、外部スクリプト、Webフォント配信、第三者の自動翻訳、Cookie保存は追加していません。referrerは`strict-origin-when-cross-origin`、外部販売店ボタンは`noopener noreferrer`を付けます。
- `.env*`はGitから除外（設定名のみの`.env.example`を除く）。`PUBLIC_`値は公開情報として扱い、広告APIキー等を入れません。GitHub公開ソースと静的HTMLに秘密を置かない構成です。

## 今後の変更時

広告リンクのみの利用は外部scriptを必要としません。広告ネットワークのscript、アクセス解析、フォーム、会員機能を追加する場合は、目的・外部送信・Cookie・CSP・プライバシー表記を別の仕様として見直します。CSPを一括で無効にして対応しません。詳しい承認後の作業は`docs/affiliate-operations.md`。

依存関係とGitHub Actionsは固定バージョン/lockfileと更新通知で管理します。監査結果は`docs/dependency-audit-results.json`、実際の公開・ブラウザ検証は`docs/deployment-results.json`と最新のブラウザ結果を参照してください。更新通知だけで自動マージはしません。

## 制約と運営者の責任

静的サイトでもGitHubアカウントや公開ワークフローが乗っ取られれば改変できます。アカウントの多要素認証、共同編集者の最小化、変更の確認は運営者が継続します。依存監査は既知の脆弱性データベースによる時点検査であり、侵入試験や安全の保証ではありません。

GitHub Pagesでは任意のHTTPレスポンスヘッダーをこのソースから設定できません。CSPはHTML内metaです。`frame-ancestors`、`X-Frame-Options`、HSTS等のヘッダーをこの実装で設定済みとは扱いません。クリックジャッキング対策等でヘッダー制御が必要になった場合は、それを設定できるホスティング/プロキシへ移行して実測します。HTTPSは公開ホストで確認する項目です。

許可した広告先でも外部事業者が後から転送先を変える可能性はあります。承認時と更新時に実際の管理画面・リンク・転送先を確認し、問題があればprogramまたはlinkを`paused`にして再配信します。画像はAI生成であり、掲載商品の実物写真やモデルの着用実績ではありません。

訂正窓口のGitHub Issuesは公開投稿です。秘密鍵・認証情報・購入者の個人情報・悪用可能な未修正の詳細を公開投稿しません。2026-11-16にGitHub APIでprivate vulnerability reportingとvulnerability alertsの有効化を確認しました。未修正の脆弱性はリポジトリSecurityの非公開報告窓口を使い、一般の訂正Issuesへ詳細を投稿しません。

根拠：[Astro CSP設定](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)、[GitHub Actionsの安全な利用](https://docs.github.com/en/actions/reference/security/secure-use)。一次資料を2026-11-16に確認しました。
