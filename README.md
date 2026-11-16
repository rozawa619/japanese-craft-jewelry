# Japanese Craft Jewelry — Curated jewelry from Japan

[English](https://rozawa619.github.io/japanese-craft-jewelry/en/) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [全ソース](https://github.com/rozawa619/japanese-craft-jewelry)

日本各地の工芸ジュエリーから、おすすめの商品を英語・日本語で紹介するセレクトサイトです。木の模様、ガラスの光、陶磁器のつやを、デザインや装いから楽しめる構成にしています。運営者表示は **SORA**。ブログや読みものは公開しません。

0.6では既存の寄木8商品に、凛然の切子ピアスと6.KILNの白磁イヤリングを追加しました。公開10商品、神奈川・東京・佐賀の3都県、箱根寄木細工・切子・伊万里／有田焼の3技法が対象です。掲載地域を全国へ増やせる共通データを保ち、商品がない地域ページは作りません。

商品は魅力の見出し、イメージ、価格、公式リンクから紹介し、素材・寸法・出典は下部の折りたたみで確認できます。トップには種類と素材の入口、ガラス・磁器・木工のおすすめ6商品があります。方針は短い日英の説明にし、お問い合わせのページと導線、販売・決済・発送の責任を繰り返す説明を公開UIから外しています。

独自のAI着用イメージは **7点・人物7タイプ**（既存2＋追加5）。いずれも架空の成人日本人女性で、AI画像・実物写真や正確な再現ではないことを常時表示します。未許諾の商品写真は公開していません。提携は未申請・未承認、商品リンクは通常リンクです。申請条件の最終確認と申請送信は別に残ります。

**このREADMEの実装説明は公開反映の証拠ではありません。0.6の検証は specs/006-clear-craft-selection/validation.md と docs/clear-stage-*.json、最新配信は docs/deployment-results.json のversion・commit・時刻で確認してください。未作成や旧版の記録を0.6の成功へ読み替えません。**

## 動かす

Node.js **24.22.1以上**、pnpm **11.25.0**。Astro **7.4.12**、TypeScript、Markdownの静的サイトです。

    pnpm install --frozen-lockfile
    pnpm dev

本番生成は pnpm build、生成後の確認は pnpm preview。実URL等を未設定にしたローカルpreviewはnoindexです。

| コマンド | 用途 |
| --- | --- |
| pnpm check | 型・スキーマ・参照・日英の本文を確認 |
| pnpm test | 広告切替・紹介データ・URL・公開条件の重要ケース |
| pnpm build | dist/ へ静的生成 |
| pnpm verify | 型・データ・単体・ビルド・生成リンクをまとめて確認 |
| pnpm readiness | 実公開URL・public設定・公開運営名とデータを確認。Contactは技術要件にしない |
| pnpm check:links | 外部の商品・募集先リンクを確認 |
| pnpm check:browser | 日英・PC／スマホ・画像・絞込・言語切替・Contact非公開を確認 |
| pnpm check:ads | 実データを変えず、広告の承認・停止・欠落等を隔離確認 |
| pnpm package | 全ソースを隣接する納品フォルダへ書き出す。ZIPは別途作成 |

## 編集入口

| 場所 | 責務 |
| --- | --- |
| src/config/selection.ts | トップの代表商品とおすすめ順序。安定商品IDを指定 |
| src/data/catalog.json | 商品・価格・仕様・工房・産地・技法・販売店・広告設定の共有事実 |
| src/data/translations/ja.json | 安定IDに結ぶ日本語表示。共有数値やURLを重複しない |
| src/data/product-stories.json | 日英の短い見出し・導入・訴求3件・装いの提案 |
| src/content/products/ と products/ja/ | 商品ごとの独自本文 |
| src/content/places/ と crafts/ | 実商品がある産地・技法の分類と背景 |
| src/content/policies/ | About・選定方針・広告・Privacy。Contactは日英ともdraft履歴 |
| src/content/guides/ | 旧読みものの日英下書き。公開導線には使わない |
| src/data/editorial-images.json | 商品IDとAI画像の対応、寸法、日英alt、assetId |
| public/images/ | 公開する7点のWebP。画像台帳と一緒に保存する |
| docs/assets.json | 独自画像の用途と権利状態、商品写真の未許諾状態 |
| docs/image-generation.json と image-generation-v6.json | 既存2点と追加5点の生成prompt・人物・用途の記録 |
| docs/research/sources.json | 一次資料・実確認日・支える事実の正本 |
| docs/research/material-expansion.json | ガラス・磁器の調査／取込記録。表示データの正本はcatalog |
| src/lib/affiliate.ts と共通components | 広告resolver、リンク・開示・画像・言語切替 |
| specs/006-clear-craft-selection/ | 最新の仕様・設計・タスク・検証。005以前は履歴 |
| scripts/ と tests/ | データ・リンク・広告・画面・公開設定の検証 |

## 更新と引継ぎ

商品事実と出典を確認してから、catalog・日本語表示・日英の商品本文・product-storiesを更新します。魅力や服との合わせ方は自分たちの言葉で書き、未確認の仕様、使用体験、レビューは作りません。画像は商品事実とは独立した台帳で扱います。7点のWebPを全ソースに含め、対応・生成記録・AI開示をまとめて維持してください。

/en/ と /ja/ は同じ商品slugで対になり、右上のボタン1つで現在ページと一覧のquery/hashを維持して切り替えます。旧journalの14URLは固定のnoindex移行口のみ残します。正規URLと安定IDを理由なく変えません。

広告化はprogramと商品別リンクの両承認、対象販売店、実際の広告URL、完全一致の許可ホスト、確認日が揃った場合だけです。停止や欠落時は通常URLへ戻ります。最初の広告リンクより前の開示とsponsoredを日英で一致させます。BECOS掲載と個別商品の報酬対象確定は別です。

- 最新の作業状態と履歴：docs/handoff.md
- 商品・画像・公開の更新手順：docs/operations.md
- 申請前に運営者が確認すること：docs/pre-application-checklist.md
- 候補と未確認条件：docs/affiliate-readiness.md、docs/research/affiliate-programs.md
- 承認後の設定・停止：docs/affiliate-operations.md
- 安全設計：docs/security.md
- 実測の確認先：specs/006-clear-craft-selection/validation.md、docs/clear-stage-*.json、docs/deployment-results.json

Contactは現在の明示方針で公開しません。技術検査の合格は提携の申請条件・承認を保証しないため、申請先が実在の窓口や本人情報を求める場合は、その時点の規約に沿って運営者が判断します。未提供の連絡先や個人情報は作りません。検索掲載、流入、売上、試着実績はbuild成功から推測しません。
