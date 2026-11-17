# 日本人女性の生成設定へ着用画像を統一する — 0.18.0

確認日2026-11-17。仕様は[023](../specs/023-japanese-model-styling/spec.md)。**新22人物画像の生成・個別目視採用・ローカル参照切替と保全/build検証を完了しました。公開app/Actions・実URLと全source ZIPは後続段階です。** 確定状態は[023 validation](../specs/023-japanese-model-styling/validation.md)・[verification](verification.md)・[deployment-results](deployment-results.json)を確認してください。

## 最新の画像方針

人物はすべて「架空の成人日本人女性」という生成設定に揃えます。新規画像は25〜33歳、25歳を含む20代半ばも入れ、かわいらしく華やかな雰囲気と洗練された綺麗な雰囲気、髪型/表情/服装を混ぜます。以前の日本/米国/英国混在・27〜33歳目安を更新するユーザーの明示依頼です。

ここでのJapaneseや年齢は創作上の設定です。見た目から実在人物の国籍・民族・年齢を判断したり、AIが魅力度を客観判定したりしたという説明はしません。サイト上は従来どおり「AIイメージ/AI image」を表示し、実物写真や実際の試着/レビューと誤認させません。

生成記録を根拠とする監査では、現行58unique人物画像/60商品参照のうち22画像が置換対象、36画像は既存のJapanese設定を保持、不明0でした。その22画像を新規生成し、旧自作AI参照22枚と個別に比較して22採用/棄却0。新設定は25〜30歳（25歳6枚）で、かわいい系11/綺麗な系統11です。全60商品がJapaneseと明記された架空成人女性の生成記録に対応し、保持36人物＋新22人物＋単体60＝118公開画像をローカルdistと照合しました。これは公開app/ZIPの確認結果とは分けて扱います。

## 変更する正本

| 変更 | 正本/記録 |
| --- | --- |
| 商品ごとの人物画像/寸法/日英alt | [editorial-images.json](../src/data/editorial-images.json)。同じ画像の共有productId参照も確認 |
| active/retired・権利/用途/AI説明 | [assets.json](assets.json) |
| 置換/保持の監査 | [japanese-models-stage-audit.json](japanese-models-stage-audit.json)と同名Markdown |
| 新規prompt/元PNG/採用棄却/変換/SHA | [image-generation-japanese-v23.json](image-generation-japanese-v23.json)。過去の生成logを上書きしない |
| 個別目視と採用判断 | [japanese-models-stage-visual-review.json](japanese-models-stage-visual-review.json) |
| 新規WebP | `public/images/styling-jp-<productId>-v23.webp` |
| 元PNG | 納品先の`generated-originals/0.18.0/styling-jp-<productId>-v23.png`。元PNG22/自作AI参照22/記録3を原本ZIPへ保存 |
| 旧画像の配信/納品除外 | ledgerのretired/localRetiredPathと[配信prune](../scripts/prune-retired-images.mjs)・[source export](../scripts/lib/source-export.mjs) |

ファイル名のproductIdはcatalogのIDを使い、URL用slugと混同しません。旧ファイルを同名で上書きせず、versioned新assetへ参照を切り替えます。旧22画像だけを明示した置換集合にし、既存の日本人設定36画像と商品単体60画像のbytesは保持します。商品/価格/出典/URL/店舗情報を画像の見え方へ合わせて書き換えません。

## 今回のローカル検証

設定/原本/配信の専用QA63、人物画像59/単体61、独立保全9、`pnpm verify`の型150ファイル（エラー/警告/hint0）・単体149・344HTMLが成功しました。Hero77は24県の日英/4viewport・画像切替/自然高を確認し、上下人工余白0/外部通信0。全商品日英browser124（58unique画像decode、新22商品×2言語を含む）、TOP10/DISCOVER写真37、スマホ92（7viewport/日英/実Maps2）・Sources328・広告off4・SEO7も成功しています。公開/納品の最終状態は[validation](../specs/023-japanese-model-styling/validation.md)を確認してください。

[独立保全checker](../scripts/check-japanese-model-preservation.mjs)は旧495 inputsをpinし、packageの版だけとJSON画像registryの22商品参照変更を許可します。他493 inputs/旧22ローカルbytesと保持96公開画像のSHAを保持し、distは旧22out/新22in、`_astro`4件の全SHA/344HTMLのroute・他static9件は一致しました。HTML本文の全byte同一は主張しません。[report](japanese-models-stage-preservation-results.json)と[現在build manifest](japanese-models-stage-build-manifest.json)を残しています。

この一回の保全は旧retired WebPを残したreviewed checkoutで実行し、fresh clone/新source ZIPの通常build依存へは加えません。CLIは`node scripts/check-japanese-model-preservation.mjs`。`CHECK_REPORT_PATH`/`CHECK_BUILD_MANIFEST_PATH`はrepo内docs/artifacts配下のJSONへ変更できます。旧画像は台帳retired/ignore・Git追跡解除により配信/全sourceから除外し、既存v12 baselineは変更しません。

## 人・別AIが更新するとき

1. 監査集合・現在のregistry・元のpromptを先に確認します。不明な履歴をJapanese設定だったと後付けせず、必要なら新規生成して記録します。
2. built-in image_genで1asset/variantずつ生成/編集します。CLI/APIへの切替はユーザーの明示選択なしでは行いません。既存画像を編集する場合は先に表示し、参照/編集対象の役割と保持するアクセサリーの特徴を明示します。公式写真の無断入力/転載は行いません。
3. 顔・耳・装身具が見える3:2の構図で、髪や手がアクセサリーを隠さないか、装着位置や金具に大きな不自然さがないか、商品説明から大きく逸脱していないかを目視します。棄却/再生成もprompt・理由・元PNGを残します。
4. [prepare-styling-image.mjs](../scripts/prepare-styling-image.mjs)等で寸法を保った形式変換/AI metadata付与を行い、生成した内容を別ツールで意味的に修正しません。元PNGを残し、新WebPの寸法/bytes/SHAとmanifest/assetId/path/日英altを揃えます。
5. 新参照へ切替えた旧画像はretiredへ移し、配信/全source ZIPから除外しつつ、旧ログと原本を保持します。旧「全人物bytes不変」gateを一括解除せず、今回許可された対象だけを例外にします。
6. 安定buildでHero全24県、Top10/DISCOVER、商品詳細、日英/スマホ、自然比率/上下余白/AIcaptionと画像欠落・リンク・SEO等を確認します。browser検査中にbuildをやり直しません。
7. 公開app/Actionsと実URL・全source/元PNG・外部proofを確定し、予定/途中/最終と初回失敗を区別して引き継ぎます。

## 変更しないもの

0.17.3のHero自然高、コンパクト一覧地図/沖縄別枠とnative遷移、Top10/DISCOVERの共通サイズ300×200/222×148は維持します。新しい人物画像を、余白を埋めるためにcropしたり画像を歪めたりしません。単体画像・商品facts・SORA・全国構造、広告off/実提携未申請、Google店舗Mapsの同意/30日保存も同じです。

旧0.17.3のMap241/Hero77/mobile92等は当時の実測です。今回の画像切替後にも必要な専用/既存QAで確認し、旧検査を新画像の成功件数として加算しません。生成設定や画像の目視は、実物/実在人物の属性や全権利適合・AdSense承認を保証しません。本人/契約/商用ホスト等の[運営残条件](remaining-task-audit-v17.md)を画像更新の成功で完了扱いにしません。

予定の全source ZIPは`japanese-craft-jewelry-source-0.18.0-models-023.zip`、外部proofは`package-verification-0.18.0-models-023.json`。別資料の原本ZIP `japanese-craft-jewelry-originals-0.18.0.zip`は47ファイル（新PNG22/旧自作AI参照22/記録3）を照合済み、44,104,939 bytes、SHA256 `20422809c6f97d93c50176e84abd5bc81161a7d344a8620c9d40050d4225e942`。全sourceの集合/全SHA・公開/納品状態はdeployment-resultsのsourceDeliveryと外部proofを正本にし、原本ZIPの成功で公開/source ZIPの確認を代替しません。
