# 残タスクの棚卸しとソース点検 — 2026-11-17

今回の「残っているタスクを全部終える」という依頼に対し、公開前の制作作業、本人・契約に依存する運営作業、過去の記録を区別した。点検開始時はアプリ0.16.0、公開60商品/登録66商品・24県・118公開AI画像。現在は0.17.0として公開確認済み。最終検証は今回のdeployment-resultsと仕様のvalidationを正本にする。

## 今回の制作で処理するもの

| 項目 | 処理方針・完了確認の根拠 |
| --- | --- |
| DISCOVERが長い | 2〜3県の編集ピックアップへ絞り、全掲載県は日本地図と一覧から辿れるようにする。TOP10の既存順位を維持 |
| 位置を地名だけで判断する | ローカルの日本地図、掲載商品に対応する代表画像、hoverだけに依存しない選択、地域ページへの入口を追加。スマホ・keyboard・JSなしを確認 |
| 店舗Mapsの面積と繰り返し操作 | 大きさ/配置と表示方式を更新。第三者送信/保存/撤回に関する実装とJA/EN Privacyを揃え、旧「再読込off/Storageなし」の検査を無断で流用しない |
| 法務の再確認 | 一次資料のURL・確認日・適用範囲・未確認を新しい法務記録へ。権利/広告/同意/ホスト契約を一括した「適法保証」にしない |
| 申請前の案内が古い | `pre-application-checklist.md`と`affiliate-readiness.md`の入口を0.17公開版と正本参照へ更新済み。当時の調査/条件をdetails内の履歴として保持 |
| 古い未完了checkbox | 007のR6は最終verifyと当時の公開補足・後続納品の記録を指し、完了記録の漏れを補完済み。新しい作業が残る項目と区別 |
| 検証・公開・引継ぎ・全source | 型/単体/build/必要UI検証、実際の公開後の確認、README/AI用prompt/変更手順、repo/export/ZIPの全件整合性を今回版で記録する |

この表は作業の棚卸しであり、作成時点で新UIの全検証が終わったという宣言ではない。最終の実数・公開SHA・Actions・納品proofは[公開と納品の正本](deployment-results.json)、最終手順は[検証ガイド](verification-guide.md)を確認する。

## 本人・契約・外部審査が必要なもの

| 項目 | 既存状態と完了に必要なこと |
| --- | --- |
| 実アフィリエイト申請 | 全program/linkは未申請・通常リンク。対象媒体/市場/商品/報酬/支払/禁止事項/AI図の扱いを現行規約で確認し、真実の本人・支払情報で申請する。商品追加を承認と扱わない |
| AdSenseアカウント/所有確認/実ID | 未接続・広告off。実アカウントの所有確認、審査対象ホスト、実コード等が必要。架空のpublisher ID・ads.txt・承認実績を作らない |
| 認定CMP/広告同意/実配信 | 未導入。Google広告を開始する場合に、当該配信方式の現行条件と実際のCMP・地域別配信を実装/検証する。店舗Mapsの選択は広告CMPではない |
| 商用ホストの適合/移行 | GitHub Pagesの用途条件は別の契約論点。今回のソース公開を適合認定・移転完了にしない。別ホストの新契約、実ドメイン/DNSの指定、公開元の変更が必要な場合は実情報で進める |
| アカウントMFA/復旧/共同管理/branch保護 | アカウント/リポジトリ側の管理事項。現在のローカルソースから設定済みとは証明できない。認証の回復手段や共同管理体制も本人の実環境に依存 |
| Google掲載/検索流入 | canonical/hreflang/sitemapの技術検証と別。Search Consoleの実プロパティ所有確認・URL検査・掲載/クリックの観測が必要。順位や訪問数は作らない |
| 商品写真の利用許諾/実物試用 | 未取得・未実施。AI図を掲載していても写真転載権、試着・使い心地・素材安全性の証拠は得られない。無断の写真取得/転載や架空レビューで埋めない |
| 実機iOS/Safari | Chrome emulationの結果で置き換えない。実機での表示・操作と必要な支援技術の確認は別の証拠が必要 |

これらを自動で完了扱いにすることは、残作業の解消にならない。実サービスのアカウント/契約に進む際は、最新の[申請前手順](pre-application-checklist.md)と[承認後の設定手順](affiliate-operations.md)から具体化する。

## 過去のcheckboxの扱い

`specs/**/tasks.md`を検索した時点で未チェックだったのは[007のR6](../specs/007-balanced-jewelry-discovery/tasks.md)のみ。[同validation](../specs/007-balanced-jewelry-discovery/validation.md)には最終型54ファイル、unit46、102HTML、画面166、広告5、最終補足16、および後続公開記録への参照がある。現在のUIを検査していないという意味の新規不具合ではなく、当時の完了記録漏れとして扱い、根拠へのリンクと補完日を付けて完了へ更新した。過去の数を今の件数へ書き換えず、旧0.7のソースZIPを新しく再検証したという意味にもしていない。

[商用ホスト準備](hosting-commercial-readiness-v11.md)の未チェック12項目は、仮に選んだ新ホストでの移行受入条件。現在のGitHub Pagesのbuild成功を、新ホストの実測成功へ付け替えない。「AI28画像」等はその文書の当時値であり、移行時には実際の公開集合から検証対象を導出する。

[operations](operations.md)の0.15以前の手順は`LEGACY-HISTORY`境界とdetailsで履歴に分離されている。そこで説明される旧Maps方式、古いNode版、過去の商品/画像件数を現行の規則として順に実行しない。

## 読み取った実装上の境界

- `src/lib/affiliate.ts`はHTTPS/認証情報なし/完全一致hostを要求し、program/item両承認・merchant・実日付が揃わない広告は通常URLへ戻す。通常URLも無効ならCTAを作らない。
- `src/lib/structured-data.ts`はJSON-LDの`<>&`等をescapeする。実行時の危険な`innerHTML`/`document.write`/`eval`の追加を見つけていない。Markdown/コードの編集者を信頼する静的サイトという前提は残る。
- `astro.config.mjs`はobject/base/form/親ページconnectを拒否し、iframeはGoogle originだけ。`map-embed-url.ts`はさらに固定`/maps/embed`と`pb`だけを許可し、任意iframe providerや第三者API keyの転用を認めない。
- `.github/workflows/deploy.yml`はfull SHAでActionsを固定し、checkout資格情報保持off、buildはread中心、deployだけpages/id-token write。非信頼PRをprivileged contextでcheckoutするtriggerは見つからなかった。
- `.github/dependabot.yml`はnpm/Actionsの週次更新通知を設定済み。CIの依存auditは有効。今回のroot担当が2026-11-17に`pnpm audit --json`を再実行し、全severity0件・依存348件を確認した。原結果は私的証跡artifacts/discovery-map-v17-dependency-audit.json。旧0件の転記ではないが、既知advisoryの時点検査であり未知の脆弱性の不存在は保証しない。
- `.gitignore`は.env類（`.env.example`を除く）、依存/生成物/artifactsと退役画像を除外する。限定したsrc/config/CIの機微値形式検索では認証情報の追加を見つけていない。全履歴・任意の秘密形式・画像の埋込情報までの監査ではない。

この点検で新しい悪用可能なソース上の欠陥は特定していない。これは全脆弱性が存在しないという保証ではなく、今回読み取ったコード・設定・ドキュメントの範囲での結果。HTTP追加ヘッダー、ホスト基盤、本人のアカウント設定は[既存securityレビュー](security-review-v15.md)の未完了範囲を引き継ぐ。

## 制作側の完了確認

地図193・表示設定22・mobile92は実公開でも初回成功、Source328HTML/118画像SHAも最終distと一致。残る上表の本人/契約/権利/アカウント事項を制作の成功と区別する。[実測の集約](discovery-map-stage-hosted-results.json)と[公開・納品の正本](deployment-results.json)を参照。互換ホスト用_headersと移行手順は用意し、loopback7検査に成功。現在のGitHubはHSTS/meta CSPのみを観測し、HTTP追加保護は未設定であることを[実応答](discovery-map-stage-hosted-security-headers-results.json)へ記録した。
