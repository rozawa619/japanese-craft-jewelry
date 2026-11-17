# 0.15 セキュリティ点検と修正

確認日2026-11-17。実ソース、CLI、CI、依存関係を確認し、外部リンク検査ツールの接続境界と、Node本体の最低版を修正した。公開サイトはアカウント・決済・投稿API・DBのない静的サイトであり、今回のCLI修正を訪問者向けの公開SSRF脆弱性と表現しない。安全性の全面保証、侵入試験、アカウント設定の再認定ではない。機械可読の根拠・結果は`docs/security-review-v15.json`。

## 修正した問題

`scripts/check-external.mjs`は外部URLを`fetch`の自動redirectで開いていたため、外部サイト側の変更でHTTPや内部ネットワークへのGETが起きうる構成だった。`scripts/lib/safe-outbound.ts`へ接続処理を分け、各hopでHTTPS・認証情報なし・公開ドメインを検証し、返されたA/AAAAの全アドレスを確認する。一つでも非公開アドレスがあれば接続しない。確認したアドレスをsocketのlookupへ固定し、接続時の再DNS解決で別のIPへ変わることを防ぐ。専用Agentは環境proxyや別のsocketを再利用せず、TLS検証を維持する。最大5redirect、全行程15秒、ヘッダー上限、本文を保存しない境界も設けた。

IPv4のprivate/loopback/link-local/metadata/共有/文書用/multicast/reservedと、IPv6の非global・文書用・移行用等を保守的に拒否する。正当な特殊アドレスが含まれる場合も自動迂回せず、手動確認へ回す。遮断や到達失敗だけで店舗の閉鎖・売切れを決めない。この境界は[IANA IPv4](https://www.iana.org/assignments/iana-ipv4-special-registry)、[IPv6](https://www.iana.org/assignments/iana-ipv6-special-registry)と[OWASP SSRF対策](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)を参照した。

ローカルのNodeは24.22.1だったが、[Node公式24.22.3](https://nodejs.org/en/blog/release/v24.22.3)は2026-11-11のsecurity releaseだった。`package.json`の最低版を24.22.3へ上げ、Astro起動前とCIで最低版を検査する。CIは24系列の最新patchを取得してから検査する。公式のWindows binaryを公式SHASUMS256.txtとSHA256照合し、workspaceの`artifacts/runtime/node-v24.22.3-win-x64`へ用意した。機械globalのNodeやPATHは変更していない。独立したPGP署名検証は称しない。

依存関係は`pnpm audit --json`で既知advisory0。package/lockfileの依存バージョンを変える必要はなく、CIへ`pnpm audit --audit-level=low`を追加した。ignore指定やregistry障害を成功扱いする設定は追加していない。[pnpm audit](https://pnpm.io/cli/audit)はパッケージの既知情報による時点検査で、Node実行ファイルや将来の脆弱性まで検査するものではない。

## 維持した境界

販売店/広告の完全一致hostと承認gate、JSON-LDのscript終了文字等のescape、通常テキスト補間、strict CSP、広告off、明示操作後だけのGoogle Mapsを確認した。新たな危険なDOMのHTML書込みは見つけていない。Markdown/コードの編集者は信頼する権限者という前提は残る。

Actionsはfull commit固定、checkoutの資格情報保持off、buildのread権限、deploy jobだけの必要権限を維持する。非信頼PRをprivileged contextでcheckoutするトリガーや、ユーザー入力をshellへ直接展開する箇所は見つからなかった。新しいアカウント・秘密値・登録・契約・DNS変更はない。`docs/security.md`の古い「iframeなし」という説明は、0.14の実装へ更新した。

## 実行した検証

- Node24.22.3を直接使った関連unit23件PASS。新規10件はprivate/DNS混在/redirect先/接続IP固定/再bind/ループ/timeout/Node最低版を検証する。負例はDNS/transport注入で、private宛ての実接続は一度も行っていない。
- Astro checkは120 files、errors0/warnings0/hints0。global旧Node24.22.1のruntime preflightは期待どおりexit1。
- unit成功後だけ、固定した公開HTTPS3 URLへ小規模smokeを実施。自サイトの301→200と、Node公式/浜松屋公式の200を確認。全外部crawlは行っていない。
- 統合preview4323でGoogle Mapsの2店舗×日英×PC/320pxと不正provider拒否、計9ケースPASS。初回/再読込のGoogle通信0、明示表示、閉じる後iframe0、Storage変更なし、横はみ出しなしを再確認。4画面を直接見て道路地図・店舗pin・Google帰属表示の表示を確認した。結果は`docs/visual-mobile-stage-maps-results.json`。
- 現在の追跡テキストへの限定的なcredential形式scanは該当0。機微名の追跡ファイルは`.env.example`だけ。これは汎用の秘密検査や全Git履歴監査ではない。

直接のunit/型検査はpatched Node24.22.3。既存standalone pnpmは別の旧Nodeを内蔵していたため、`pnpm exec node`だけではpnpm本体の更新証明にならない。統合検証では既存pnpm11.25.0のJS CLIをpatched Node24.22.3で動かすtask-local wrapperを使い、nested pnpmも同じwrapperへ通した。rootのshared verifyはunit124件、264HTML・949実行script CSP hash等がPASS、同wrapper経由のauditも全severity0/348依存だった。生結果は`artifacts/visual-mobile-stage-initial2-verify.log`と`visual-mobile-stage-audit.json`。共同作業中にsecurity担当が別のshared buildを実行した記録ではない。最終公開後検証はrootのrelease記録を参照する。

## ホスト・アカウントで残る範囲

公開中0.14の`https://rozawa619.github.io/japanese-craft-jewelry/ja/`は200、同じパスのHTTPは301で対応するHTTPSへ転送された。HTTPSにはHSTSがあり、HTTP CSP/frame-ancestors、X-Frame-Options、nosniff、Permissions-Policyはなかった。HTMLのmeta CSPと`strict-origin-when-cross-origin`のmeta referrerは存在する。各ヘッダーの値と時点は`docs/security-host-observation-v15.json`に記録した。今回設定したヘッダーではない。

不足ヘッダーは多層防御上の差であり、アカウント・フォーム・公開書込APIのない当サイトで、それに結び付く悪用を実証したという意味ではない。[CSP仕様](https://www.w3.org/TR/CSP3/#delivery-html-meta-element)上、metaで`frame-ancestors`は機能しないため、効かないmetaやJSのframe bustingを足して同等の対策済みとはしない。ヘッダー制御が必要な場合は、それを設定できる公開環境で別に実測する必要がある。今回ホスト移行は行っていない。

多要素認証、共同編集者、branch保護、復旧手段、ホストの基盤設定は運営者のアカウント側の管理範囲であり、今回操作も完了認定もしていない。現行の対策と今回の23テスト・監査0を、全問題の解消や将来の安全の保証へ読み替えない。
