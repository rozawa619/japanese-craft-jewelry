# Japanese Craft Jewelry

SORAが日本各地の工芸ジュエリーを選んで紹介する、日本語・英語のセレクトメディアです。サイト内の販売・決済・発送、ブログ、お問い合わせは設けません。

[日本語サイト](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [GitHub](https://github.com/rozawa619/japanese-craft-jewelry)

## 最初に読むもの

| やりたいこと | 入口 |
| --- | --- |
| 別のAIへそのまま渡す | [AI引継ぎとコピー用prompt](docs/ai-handoff.md) → [現在状態](docs/handoff.md) |
| 初めて起動する・環境エラーを直す | [セットアップ](docs/setup.md) |
| 商品名・文章・価格・画像・店舗を直す | [編集ガイド](docs/editing-guide.md) |
| sourceの構造を知る | [構造とデータflow](docs/architecture.md) → [srcの案内](src/README.md) |
| 変更に必要な検査を選ぶ | [検証ガイド](docs/verification-guide.md) |
| 公開・元に戻す・ZIPを作る | [公開と納品](docs/setup.md#公開と復旧) |
| その他の資料を探す | [文書一覧](docs/README.md) |

AIは最初に[AGENTS.md](AGENTS.md)を読みます。過去の会話がなくても、上の文書と全sourceから再開できる構成です。古い資料の件数・途中のテスト値を、現在の仕様へ読み替えません。

## 現在の基準

2026-11-17時点の公開アプリは0.16.0、全国追加の仕様018です。公開60/全66商品、下書き6商品、24県、公開商品に関連する34技法（全36）、33店舗、人物58＋単体60のAI画像118ファイル。新たに10県の10商品を追加しました。将来追加する件数の上限ではありません。最新の実数はcatalog、公開commit/Actionsは[公開記録](docs/deployment-results.json)、実測は[検証記録](docs/verification.md)を正本にします。

公開appは`86d6c6e6cb1567839c80d43bcf26f4a509e4a8bb`。[Actions44042180272](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44042180272)のcompleted/successと実公開を確認しました。公開Source328HTML・全328正規URLと118画像のSHA照合、補足24/24、mobile92/92が成功しています。対象・時刻・制約は[検証記録](docs/verification.md)を確認してください。

日英で同じページ・絞込・fragmentへ切替可能。国内JPYと海外ストア実価格は別で、為替換算しません。出典と確認日は閉じた一覧、Google Mapsは表示操作後だけ読込みます。画像はAIイメージで、実物写真や試着の証拠ではありません。

提携リンクは未申請・通常URL、AdSenseはoff固定です。認定CMP/実ID/所有確認・商用host適合は未完了。SORA以外の本人情報や連絡先を作りません。詳細は[申請前の作業](docs/pre-application-checklist.md)と[security](docs/security-review-v15.md)。

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
