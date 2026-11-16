# 承認後の広告リンク設定

現在は未申請・未承認で、全商品が通常の販売店リンクです。広告枠や外部scriptを先に挿入しなくても、承認後に設定だけで販売店ボタンを広告リンクへ切り替えられます。設定の正本は`src/data/catalog.json`、表示は共通`RetailerLink`と`Disclosure`です。

1. 広告主の正式な管理画面または担当者で、当サイト・対象商品・販売店・画像利用・開示・禁止事項・支払等を確認。申請募集の存在を当サイトの承認と混同しません。現在掲載している神奈川の商品をBECOSの対象と推定しません。
2. 対象programへ実際の`merchantIds`、`applicationStatus: approved`、実際に確認できた広告先のホストを`affiliateAllowedHosts`配列へ設定します。値は`["実在するホスト名"]`の形式で、`https://`・パス・ワイルドカード・大文字を含めません。ホスト名はこの資料の例ではなく、承認済みリンクの実物から確認してください。空配列は広告先を一つも許可しません。
3. 対象linkに、そのprogramの`programId`、`applicationStatus: approved`、発行された`affiliateUrl`、確認した日の`affiliateLinkVerifiedAt`（YYYY-MM-DD）を設定します。`officialProductUrl`は通常リンクへの戻し先として残します。通常URLのホストは登録merchantの`url`と一致する必要があります。別店舗ならmerchantを分けて登録します。
4. 表示部品を変えずに`pnpm verify`と`pnpm check:ads`を実行。日英の最初の広告ボタンより前に広告開示、広告ボタンに`sponsored`、通常ボタンと説明の一致を確認します。`pnpm check:browser`でスマホ・言語切替も確認します。
5. Gitへ保存して公開。公開URLで実際のリンク・表示・リダイレクト先を確認して記録します。無断のテスト購入や架空の成果を作りません。ネットワーク固有の計測テストは契約で許される方法で別に行います。

停止する場合はprogramまたはlinkの`applicationStatus`を`paused`にして再配信します。有効な通常URLがあれば通常ボタンへ戻ります。承認していてもURL未設定・未許可ホスト・確認日欠落・対象merchant不一致では広告化しません。広告URLのホストが変更されたら、先に公式管理画面等で再確認し、許可ホストとURLを一緒に更新します。

広告IDがURLへ含まれること自体はありますが、APIキー・アクセストークン・管理画面の認証情報は入れません。`PUBLIC_`値とGitのファイルは公開されます。広告script、アクセス解析、外部送信を追加する場合は`docs/security.md`に沿って別途設計します。

`tests/`と`artifacts/`の隔離fixtureにある架空URL・テスト承認は、実データへコピーしません。通常/広告の二重承認、許可先、停止、欠落、URL不正、日英の開示は共通関数と実ビルド検証で確認します。
