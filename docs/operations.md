# 更新・公開の操作手順

更新日：2026-11-16。初めに `AGENTS.md` と `specs/001-media-launch/` を読む。現状は静的な英語メディアで、カート・決済・DB・CMSはない。

## 作業環境と基本コマンド

Node.js 24.22.1以上、pnpm 11.25.0を使用する。依存関係を変えない更新ではロックファイルを保持する。

```text
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm preview
pnpm verify
pnpm readiness
pnpm check:links
```

`dev` は開発用、`preview` は `dist/` の本番ビルドをローカルで確認する。標準の待受先は127.0.0.1。実際のポートは起動結果で確認する。`verify` は型・データ・広告ロジック・ビルド・生成済み内部リンクの確認をまとめて実行する。`check:links` の外部アクセス拒否は閉鎖の証明ではない。`readiness` は公開環境の未設定を検出するので、初期の未入力状態で非0終了するのが正しい。

## 1. 商品と工房を1つ追加する

1. 公式の商品本文と工房情報を確認し、`docs/research/sources.json` に安定ID、URL、タイトル、実確認日、根拠となる主張を追加する。価格・通貨・税・配送・返品を別に確認する。
2. `src/data/catalog.json` の `makers` に必要な工房を追加する。`location` と `productionNote` を使い、販売店所在地だけでは製造地を確定しない。作り手不明ならその事実を示すレコードを使う。
3. `products` に `src/lib/schema.ts` の商品スキーマに沿うレコードを追加する。既存商品を複製して編集してもよいが、ID・slug・仕様・出典・価格・確認日を全て見直す。不明値は `null`、未確認の都道府県は空配列、未許諾写真の `imageAssetIds` は空配列にする。
4. 商品本文を `src/content/products/<安定ID>.md` に追加する。frontmatterは `productId` と `publishStatus`。独自の選ぶ理由、仕様から分からないこと、購入前の確認点を書く。公開商品には公開された空でない本文が必要。
5. 販売店が新規なら `merchants` を追加し、商品との関係を `merchantIds` で結ぶ。`links` に商品と販売店の組み合わせを1件追加する。初期値は `programId: null`、`affiliateUrl: null`、`applicationStatus: "not_applied"`、`affiliateLinkVerifiedAt: null`。`officialProductUrl` は実在する適切な商品・カタログページにする。
6. `docs/assets.json` の `productPhotography` に権利の状態を記録する。写真を追加する場合のみ `assets` に権利根拠等を登録し、商品側の `imageAssetIds` を関連付ける。
7. まず `publishStatus: "draft"` で確認する。必要な事実が揃ってから商品データと本文の両方を `published` にする。`pnpm verify` とPC・スマホ画面で商品名、画像なし、販売店リンクを確認する。

## 2. 都道府県・技法・素材・種別を追加する

`catalog.json` の `prefectures`、`crafts`、`materials`、`productTypes` は独立したマスタ。`products` の対応するID配列で関連付ける。技法マスタには `sourceIds` が必要。全国専用の新コンポーネントや地域ごとの分岐は作らない。

地域本文は `src/content/places/<prefectureId>.md`、技法本文は `src/content/crafts/<craftId>.md` に追加する。既存の神奈川・寄木の本文を構造の見本にできるが、事実・紹介文・出典は対象に合わせて独自に調査する。

- 地域のfrontmatterは共通項目に `prefectureId` と `relatedMerchantIds` 配列を追加する。`prefectureId` は `catalog.json` の都道府県ID、ファイル名はそのIDと一致させる。`relatedMerchantIds` は製造地が未確認でも地域の販売店として別枠で紹介する販売店ID。これを商品自身の都道府県属性の代わりに使わない。
- 技法のfrontmatterは共通項目に `craftId` を追加する。`craftId` は `catalog.json` の技法ID、ファイル名もそのIDにする。
- 公開条件は **published本文、空でない独自本文、出典、同IDに関連するpublished商品が1件以上**。地域は `products[].prefectureIds`、技法は `products[].craftIds` で商品を結ぶ。販売店があるだけでは地域の公開条件を満たさない。
- ルートは汎用の `src/pages/en/places/[place].astro` と `src/pages/en/crafts/[craft].astro`。条件を満たす本文を追加すれば `/en/places/<prefectureId>/` と `/en/crafts/<craftId>/` が生成され、サイトマップも同じ公開Collectionへ連動する。都道府県ごとにページ部品を複製しない。
- 準備中は本文の `publishStatus: "draft"` を使う。マスタだけ、空本文、下書き、関連公開商品なしのページは公開しない。`pnpm check` が参照・ID一致・公開条件を検査する。記事内リンクと必要なナビの入口を整え、`pnpm verify` と生成URLの表示確認を行う。

既存の公開条件を変える大きな機能は `specs/002-.../` に目的と受入条件を残す。マスタ追加だけで全都道府県のページを大量生成しない。

## 3. 記事・価格・出典を更新する

ガイドは `src/content/guides/*.md`、方針は `src/content/policies/*.md`、商品紹介本文は `src/content/products/*.md`、地域は `src/content/places/*.md`、技法は `src/content/crafts/*.md`。商品本文以外の共通frontmatterは `title`、`description`、`locale`、`publishStatus`、`updatedAt`、`sourceIds`。ガイドには `category`、`readMinutes`、`productIds`、地域には `prefectureId` と `relatedMerchantIds`、技法には `craftId` を付ける。

関連商品の仕様や価格を記事へ再入力せず、商品IDで共通部品を参照する。出典を読み直した項目だけ `lastVerifiedAt` や `priceCheckedAt` を更新し、`sources.json` の確認日と支える主張を見直す。全項目の再確認をしていないのに日付だけ一括更新しない。在庫は当日の観測として扱う。

slug変更は既存URLを壊すため、原則維持する。変更が必要ならホスティング側のリダイレクトまたは移行ページを用意し、内部リンク・サイトマップも検査する。

## 4. 提携承認後に広告リンクへ切り替える

1. 対象ドメイン、個別商品、深いリンク、画像、開示文言、計測・支払、禁止集客を管理画面または個別契約で確認する。日本語版と英語版を混同しない。調査資料と `docs/affiliate-readiness.md` を更新する。
2. 対象販売店を `merchants` へ登録し、`programs[].merchantIds` に正しいIDを追加する。BECOS承認を他店の商品へ適用しない。
3. 実際の承認を得たプログラムの `applicationStatus` を `approved` にする。公開募集の `recruitmentStatus` は別の状態なので変更理由を混ぜない。
4. 対象 `links` の `programId`、管理画面から取得した `affiliateUrl`、`applicationStatus: "approved"`、実確認日 `affiliateLinkVerifiedAt` を設定する。広告IDやパラメータを推測して作らない。通常の `officialProductUrl` は停止時のため保持する。
5. 広告主指定の文言があれば `programs[].disclosure` に設定し、共通開示部品が対象ページで表示することを確認する。指定文言がないからといって、一般的な明瞭な開示を省略しない。
6. `pnpm verify` を実行し、公開前の画面で最初の広告リンクより前の開示、実際のリンク先、`rel="sponsored noopener noreferrer"` を確認する。リンクを開く際は不要な自己購入・テスト注文をしない。
7. 一時停止は商品リンクまたはプログラムを `paused` にして再ビルド・再公開する。未承認・URL欠落・確認日なしでは通常リンクへ戻り、通常URLもなければCTAは出ない。

テストの追跡URLは `tests/affiliate.test.ts` の中だけに置く。公開JSONへデモURLを入れない。

## 5. ブランド名・色・言語を変更する

表示名・説明・言語・SNS設定は `src/config/site.ts`、色・余白・文字等は `src/config/tokens.css`。共通レイアウトとページ本文にもブランドの言及があるため、`rg "ITO|Objects with a story" src` で使用箇所を確認する。ブランド変更時は本文や申請草稿、画像台帳の説明も更新する。

初期言語は英語、URLは `/en/` 配下。新しい言語を追加するときは `src/content.config.ts` とデータのlocale制約、ルーティング、ナビ、言語メタ情報を一緒に設計する。英語を単に置換して既存URLを壊さない。空翻訳ページは作らない。

## 6. 公開環境と更新

`.env.example` は設定名だけの見本。必要な値をローカルの `.env` または利用先の環境設定に入力する。`.env` と秘密値をコミットしない。`PUBLIC_` の値は公開されるためトークンを入れない。

| 設定 | 内容 |
| --- | --- |
| `PUBLIC_SITE_URL` | 実際の公開HTTPS URL。exampleやlocalhostを本番メタ情報へ入れない |
| `PUBLIC_BASE_PATH` | ドメイン直下は `/`、GitHub Pagesのプロジェクト公開は `/リポジトリ名/` |
| `PUBLIC_PUBLISH_MODE` | 下見は `preview`、正式公開の準備後だけ `public` |
| `PUBLIC_OPERATOR_NAME` | 公開する運営責任の表示。未提供の氏名は作らない |
| `PUBLIC_CONTACT_EMAIL` | 実際に受信できる公開用連絡先。未入力なら捏造しない |
| `PUBLIC_REPOSITORY_URL` | 実際のリポジトリ。問い合わせに使うならIssuesを有効にし外部から使えることを確認 |

値を設定後に `pnpm readiness` と `pnpm verify` を実行する。`dist/` が静的公開物。正式公開ではcanonical・OGP・sitemap・robotsが実URLと公開状態に合うこと、previewではnoindexであることを実際の生成物とHTTPで確かめる。404の扱いとサブパスも公開先で確認する。

GitHubのリポジトリ作成・push・Pages公開は認証と権限がある場合だけ実行する。未成功なら公開済みと記録しない。新規作成時は `git init`、`git add`、`git commit`、実在する作成済みリポジトリへのremote設定、`git push` の順とし、秘密値や `node_modules` が含まれていないことを確認する。Pages等のホスティング設定が提供されている場合は、そのワークフロー内のNode・pnpm・環境値と照合する。

公開後は実URLの主要画面、全内部リンク、広告状態、Contact、robots、sitemap、404を再確認する。公開とアフィリエイト申請は別の操作。申請は運営者が条件・入力内容を確認して送信し、承認前は通常リンクを継続する。

## 更新時の引継ぎ

重要な変更は `CHANGELOG.md` に日付と要件への影響を記録し、`specs/001-media-launch/tasks.md` と `docs/handoff.md` に実行結果・未実行・制約を残す。連絡先や権利取得を別のAIが確認済みだと推測しない。外部ページが変わった場合は直近の一次情報を読み直す。

## GitHub Pagesの有効化

作成済みrepoはhttps://github.com/rozawa619/ito-craft。ソースをmainへpush後、Settings→Pages→SourceをGitHub Actionsにする。deploy.ymlで検証して公開する。初期modeはpreviewで検索対象外。PUBLIC_OPERATOR_NAMEと必要な公開用Contactを確認し、正式検索公開時だけRepository variablesのPUBLIC_PUBLISH_MODEをpublicに変更。元のプレビューmodeでもPages URLで閲覧できるが、公開成功はHTTPとActions結果で確認する。

GitHub Pagesのプロジェクト公開ではrobots.txtは/ito-craft/配下になる。検索エンジンがドメイン直下のrobots.txtを参照する点に注意し、previewの検索除外は各HTMLのnoindexでも実施する。独自ドメインへ移す場合はドメイン直下のrobotsも再確認する。
