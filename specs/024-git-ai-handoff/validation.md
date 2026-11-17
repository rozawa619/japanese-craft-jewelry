# 検証記録

2026-11-17、仕様024。Gitにあるソースと公開GitHub資料からの再開を確認しました。現在の状態は[handoff-status](../../docs/handoff-status.json)、集約は[検証JSON](../../docs/git-handoff-stage-results.json)です。

## 基準

- Git HEAD: b6ac11fcf589daa1b7b4786bc98702b36bfee482。
- 公開app: f2bb423f4c4cf476e449d8ec37837243f764cfee。
- Actions44089370227: completed/success、公開0.18.0。
- 直前の公開出力: docs/japanese-models-stage-build-manifest.json、471件/344HTML/118WebP。
- 直前のsource ZIP: models-023、1198ファイル。今回のGit資料追加後の件数と区別する。

## GitHubの新規環境

[Actions44100922768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44100922768)はcompleted/success。対象は`537ee24ca021a9b61801108a4689e22936a3a08a`、Node24.22.3です。[CI記録](../../docs/git-handoff-stage-ci-results.json)はAPIのジョブ/ステップと検証noticeから採取しました。

| 確認 | 結果 |
| --- | --- |
| 新規checkoutの入力 | node_modules/dist/.astro/.env/ローカルruntime/元PNG/隣接deliveryなし、preflight3/3 |
| 固定ツールと依存導入 | 一時prefixへのpnpm11.25.0導入と`pnpm install --frozen-lockfile`が成功。ポリシー緩和・前任node_modulesコピー・dependency cache actionなし |
| 通常verify | 型153ファイル・error/warning/hint0、unit149、build/link/人物/単体/Privacyが成功 |
| 追加検査 | SEO・元PNGなし日本人モデル設定QA・文書検査が成功 |
| 独立照合 | 471ファイル/344HTML/118WebPのpath集合・全SHAが公開app baselineと一致、3/3 |
| 権限/公開 | contents:readのみ。Pagesを再公開しない手動検証workflow |

初回[Actions44099414779](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44099414779)はpnpmのglobal導入段階で失敗しました。[初回記録](../../docs/git-handoff-stage-ci-initial-results.json)を残し、runnerの一時prefixへ分離して上記の全手順を再実行しました。初回ログ配信hostにもこのPCから接続できず、詳細な失敗原因は未認定です。成功した導入と初回失敗を混同しません。

## ローカルの独立clone

[fresh記録](../../docs/git-handoff-stage-fresh-results.json)：公開GitHubから認証なしでcloneした`88949fd45137de57b62913c2e66a3ee961c9b7ea`の1217trackedファイルは、autocrlf=trueでも全Git blobとbyte一致。`.gitattributes`でproof/固定SHA記録の暗黙改行変換を防いでいます。

このPCのnpm通信は通常/権限付き/IPv4ともtimeoutでした。[ネットワーク診断](../../docs/git-handoff-stage-network-results.json)ではGitHub rawは200、npmはtimeoutです。標準pnpm cacheを隔離コピーして270依存を再構築しましたが、offlineの供給網metadataが不足したため**ローカルのpnpm install/verify/dev成功とは記録していません**。

依存698symlinkと主要moduleはすべてfresh内、既存node_modulesのコピー/祖先参照なし。14個のNode実装検査はすべてexit0、unit149、生成物471件の全SHA一致を確認。既定envの直接Node devでは日英ページ/画像が200、ページはnoindexで、専用server停止も確認しました。ここでの型152/hint1は非同期Promiseの型推論hintで、JSDoc型注記を加えた後の正式CIは型153/hint0です。アプリの動作コードは変更していません。

## GitHubの配布資料と文書

[配布manifest](../../docs/handoff-assets.json)の8assetを[GitHub Release](https://github.com/rozawa619/japanese-craft-jewelry/releases/tag/ai-handoff-2026-11-17)へ保存。[実取得記録](../../docs/git-handoff-stage-download-results.json)で無認証8download/213,014,996 bytes・独立SHA8/8・再利用1・unsafe拒否11を含む全12policyチェックの成功を確認。型注記後にも新たなproof取得を検証しています。取得は展開・実行・公開への反映を行いません。

画像原本4世代、models-023 source ZIP、3proofを配布し、proof3件とPC/スマホ参考画面はGit内にも保存しました。1198は旧models-023 ZIPの件数で、現在のGitを固定する数ではありません。

[文書検査](../../docs/git-handoff-stage-docs-results.json)は60ファイルのパス/見出し/実在コマンドを確認。初期添付[project-brief](../../docs/project-brief.md)には履歴であることを明記し、完了023や旧画像方針を現在の作業指示にしません。最終のGit反映/読み戻しは[集約](../../docs/git-handoff-stage-results.json)へ記録します。

[GitHub読み戻し](../../docs/git-handoff-stage-remote-results.json)では、mainに反映したce57e6129de8d4c994053b11a6e21b044a89e966の入口・状態・取得コード・workflow・画面参考・proofなど18ファイルを認証なしで取得し、全SHA一致を確認しました。CI検証後の差分は文書/結果の追加だけで、実装と生成物は不変です。後続の記録commitもアプリ変更として扱いません。

## 継承する境界

公開appはf2bb423のままです。本文・商品事実・価格・UI・画像・広告/Maps設定は変更せず、全公開出力が一致しました。Node/pnpm/Chrome、ネットワーク、Gitのpush権限は各作業環境で用意します。実機Safariや実契約/本人情報/CMP/AdSense/実提携等の運営条件を、この資料整備やCIで完了にしません。
