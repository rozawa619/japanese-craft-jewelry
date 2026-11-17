# Japanese Craft Jewelry

SORAが日本各地の工芸ジュエリーを選んで紹介する、日本語・英語のセレクトメディアです。サイト内の販売・決済・発送、ブログ、お問い合わせは設けません。

[日本語サイト](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [GitHub](https://github.com/rozawa619/japanese-craft-jewelry)

## 最初に読むもの

| やりたいこと | 入口 |
| --- | --- |
| 別のAIへそのまま渡す | [AI引継ぎとコピー用prompt](docs/ai-handoff.md) → [現在状態](docs/handoff.md) |
| 初めて起動する・環境エラーを直す | [セットアップ](docs/setup.md) |
| 商品名・文章・価格・画像・店舗を直す | [編集ガイド](docs/editing-guide.md) |
| 一覧地図の枠・沖縄別枠・トップ写真を直す | [現在022の編集手順](docs/compact-layout-v20.md) |
| sourceの構造を知る | [構造とデータflow](docs/architecture.md) → [srcの案内](src/README.md) |
| 変更に必要な検査を選ぶ | [検証ガイド](docs/verification-guide.md) |
| 公開・元に戻す・ZIPを作る | [公開と納品](docs/setup.md#公開と復旧) |
| その他の資料を探す | [文書一覧](docs/README.md) |

AIは最初に[AGENTS.md](AGENTS.md)を読みます。過去の会話がなくても、上の文書と全sourceから再開できる構成です。古い資料の件数・途中のテスト値を、現在の仕様へ読み替えません。

## 現在の基準

作業版0.17.3・地図枠とトップ写真の調整022、2026-11-17。台帳は0.16から公開60/登録66商品・下書き6、24県、公開関連34技法（全36）、一次出典293、33店舗/53商品、人物58＋単体60の118画像を継承します。今後の件数上限ではありません。公開/納品の確定値は[deployment-results](docs/deployment-results.json)、実測は[verification](docs/verification.md)を正本にします。

<!-- TODO_PUBLIC_V20 -->
0.17.3（仕様022）は公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。

ホーム先頭のHeroとは別に、産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県の順です。47県のCC0原形を主図46＋沖縄別枠1へ分け、実商品/産地本文がある掲載24県だけを通常リンクにします。沖縄は島path・枠・labelを押せる拡大表示とし、県のclick/tap/Enterで産地の商品一覧へ直接進みます。pointerenter/focus/selectの代表単体画像/商品/国内参考価格preview、100/150/200/300%のzoom・内部scroll・全体表示、地方別の初期closed details・地図ジャンプ・JSなしのhrefを継承します。外枠/主図/沖縄枠の設計値と実測は最新022の説明で区別します。

Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。

日英は同じページ/query/hashへ切替可能。国内JPYと海外実価格は別市場で、為替換算しません。出典/dateは閉じた一覧、画像はAIイメージです。実物写真・試着の証拠にはしません。

[日本地図の直接選択](docs/japan-map-direct-v18.md)・[残タスク](docs/remaining-task-audit-v17.md)・[法務再確認](docs/legal-review-v17.md)・[商用ホスト移行準備](docs/commercial-host-migration-v17.md)を同梱。対応ホスト向けpublic/_headersは移行準備です。現GitHub PagesのHTTPヘッダーを設定済みとはせず、実契約/本人情報/広告実ID・CMP/ドメイン・DNS/アカウント管理/検索実績を技術PASSで完了化しません。AdSense off・実提携未申請/通常URLを維持します。

0.17.3用の版付きZIP名は`japanese-craft-jewelry-source-0.17.3-compact-022.zip`、外部proof名は`package-verification-0.17.3-compact-022.json`です。最終状態はdeployment-resultsのsourceDeliveryと外部proofを参照し、予定名だけで完成としません。今回新bitmap生成なし。0.16の118WebPと元PNG23枚（採用20・棄却3）/生成記録/別ZIPを保持し、旧原本を上書きしません。

## まず起動する

サポート中の修正版Node.js（このrepoの最低版は24.22.3）とpnpm11.25.0が必要です。ブラウザー自動検査にはGoogle Chrome本体も必要です。

cloneまたはZIPを展開し、package.jsonがあるフォルダーへ移動してから実行します。

~~~sh
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
~~~

表示されたLocal URLから /ja/ または /en/ を開きます。.envなしで起動でき、初期設定はルート配置のnoindexプレビューです。端末の既存.envによってbase/公開モードが変わるため、初回・本番同等QA・公開の違いは[setup](docs/setup.md)を参照してください。秘密値はPUBLIC_変数へ入れません。

**docsフォルダーを削除しないでください。** research/sources.json、assets.json、画像の生成/基準JSONは、商品表示やbuild/検証の入力でもあります。省略できる説明書だけのフォルダーではありません。node_modules/dist/.astro/artifactsは正本ではなく、納品sourceから除きます。

## どこを直すか

| 変更 | 正本 |
| --- | --- |
| 英語の商品名・事実・価格・公式URL | [catalog](src/data/catalog.json)。配列ごとの役割は[データ案内](src/data/README.md) |
| 日本語の商品名・表示訳 | [ja.json](src/data/translations/ja.json) |
| 大見出し・導入・装い・選ぶ理由 | [product-stories](src/data/product-stories.json)と[商品本文](src/content/products/) |
| 比較と3問の選び方 | [selection-notes](src/data/selection-notes.json)・[buying-guides](src/data/product-buying-guides.json) |
| 出典・購入根拠・店舗 | [sources](docs/research/sources.json)・[purchase-evidence](src/data/purchase-evidence.json)・[visits](src/data/visits.json) |
| 人物/単体の画像と日英alt | [editorial-images](src/data/editorial-images.json)・[detail-images](src/data/product-detail-images.json)・[権利台帳](docs/assets.json) |
| 掲載順・産地の代表 | [selection](src/config/selection.ts)・[region-selection](src/config/region-selection.ts) |
| 日本地図とDISCOVER3県 | [CC0形状と出典](src/data/japan-map-geometry.json)・[地方/3県指定](src/config/japan-map.ts)・[地図部品](src/components/JapanJewelryMap.astro) |
| 地図の保存と表示設定 | [30日/版の検証](src/lib/map-preferences.ts)・[全表示/全停止](src/lib/map-preferences-client.ts)・[Privacy設定UI](src/components/MapPreferences.astro) |
| 見た目・共通部品 | [global.css](src/styles/global.css)・[components](src/components/) |

JSONの部分例は[編集ガイド](docs/editing-guide.md)にあります。idとURL用slugを混同せず、数値やURLを紹介文へ重複入力しません。新規商品はdraftから始め、購入根拠・日英・画像等の公開gateを揃えます。

## 変更の流れ

1. 新しい依頼と正本を確認し、必要な範囲だけ編集する。
2. [検証matrix](docs/verification-guide.md)から確認を選ぶ。JSON/広告変更はpnpm verify、画面変更は日英・スマホ・keyboardも確認。
3. Gitならgit diff、ZIPだけなら保管した展開元と作業用コピーのフォルダー比較で、意図した差分だけか確認。秘密や一時ファイルの混入も人が確認する。
4. 公開する変更はmainへのpushでCI→GitHub Pagesへ。文書/toolだけでアプリ生成物不変の場合は、確認根拠を残して不要な再公開を避ける。
5. [引継ぎ](docs/handoff.md)と実測を更新し、必要なら納品ZIPを再作成。

| コマンド | 役割 |
| --- | --- |
| pnpm verify | 型・データ・unit・生成物・リンク・CSP・画像・広告Privacy。Chrome検査は別 |
| pnpm check:docs | 有効な保守文書のlocalリンクとコマンドの整合 |
| pnpm check:seo | 本番設定で作ったHTMLのcanonical/hreflang等。実検索順位は別 |
| pnpm check:mobile / check:types / check:headings | 表示・操作/全産地の小画像/見出しの回帰 |
| pnpm check:sources | 出典/dateの保持と、配信HTML全体のSHAとlocal distの一致 |
| pnpm check:ads | 実データを変えない隔離広告6ケース |
| pnpm package | ソースdirectoryを書出し。ZIP作成ではない |
| pnpm package:delivery | PowerShell7で書出し→ZIP→repo/export/ZIP全件SHA。旧ZIPを保持 |

Chrome検査はbuildと同じPUBLIC_BASE_PATH、正しいCHECK_BASE_URL、別のreport保存先を使います。既存0.15の証跡を上書きしない具体例は[検証ガイド](docs/verification-guide.md)。新規課金・申請・DNS/アカウント設定は実行していません。内容量やテストPASSをAdSense合格・在庫・全安全の保証にしません。
