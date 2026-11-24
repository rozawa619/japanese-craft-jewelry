# AIの開始手順と有効な制約

ユーザーの最新依頼を優先し、この文書を根拠に未依頼の商品追加・画像再生成・申請・契約・移転を始めない。過去の会話や前任AIのローカル環境は開始条件にしない。

## 最初の5分

1. [START_HERE.md](START_HERE.md)を読む。次に[引継ぎ状態](docs/handoff-status.json)と[公開アプリの記録](docs/deployment-results.json)を確認する。
2. `git status --short`と`git rev-parse HEAD`で作業対象・未保存変更を確認する。公開appのSHA、現在のGit HEAD、過去の納品ZIPを区別する。他者の変更を上書きしない。
3. 最新の引継ぎ整備は[仕様024](specs/024-git-ai-handoff/spec.md)。購入導線は[028](specs/028-purchase-routes/spec.md)。[023](specs/023-japanese-model-styling/spec.md)の画像差し替えは完了済み。次の実装対象はユーザーの今回の依頼から決める。
4. [setup](docs/setup.md)でNode・pnpm・env・base・Chromeを揃え、[architecture](docs/architecture.md)と[editing-guide](docs/editing-guide.md)で変更する正本を特定する。`docs/`のJSONもbuild入力なので削除しない。
5. [verification-guide](docs/verification-guide.md)から影響に合う検査を選び、仕様・実装・検証・引継ぎを対応させる。全旧版を通読したり過去の検査を全再実行したりすることは開始条件ではない。

## サイトの境界

- 運営者表示はSORA。日本全国の工芸ジュエリーを選ぶJA/ENの紹介サイト。神奈川専用やiTOへ戻さない。
- ブログ、Contact、販売・決済・発送の機能を作らず、不要な販売責任説明をUIへ再導入しない。未提供の氏名・住所・メール・経歴を作らない。
- 現在のソースは47都道府県を対象にする。掲載・登録点数と実際の配信状況は公開記録を確認する。未掲載県・空の技法・draftの公開ページを作らない。
- COCOON2、欠品18K、販売未確認の畠山2、hairpinはdraft。復帰には対象variantの現行購入根拠と派生参照の再確認が必要。403を閉店・売切れと判定しない。

## 正本と編集

- 商品・工房・販売店・地域・技法・素材・広告program/linkはcatalogの独立した配列とIDで関連付ける。数値・URLを本文や部品へ重複入力しない。
- 英語/共有事実はcatalog、日本語表示はtranslations/ja、紹介はproduct-storiesと日英Markdown、比較はselection-notes、選び方はproduct-buying-guides。変更単位はediting-guideを確認する。
- id/slugを不用意に変えない。変更時は全参照・URL移行・画像・比較・地域・sitemapを検査する。
- 国内JPYと海外ストアの実額は別市場。表示言語と購入市場を混同せず、FX換算や片耳価格の勝手な倍額化をしない。
- 新商品はdraftから。gallery、古い催事、企業住所だけ、明示欠品、販売未確認の商品を公開しない。日英本文・選定/比較・3問・出典・購入・店舗案内または正直なfallback・画像の公開gateを満たす。
- 一次情報のURL・実確認日・支える主張を残す。未確認仕様、重量、原産地、認証、低アレルギー、レビュー、試着、取材、人気、売上、承認、許諾を作らない。

## 画像とUI

- 人物画像は架空の日本人成人女性。現行の生成設定は21〜33歳で、神奈川の026では21〜24歳。新規画像ではほくろや目立つシミを避け、笑顔、髪型、服装、正面・横・手元などの視線に変化を付ける。026は既存画像に合わせて淡い室内背景と柔らかい光を用いた。
- captionは常時AIイメージ/AI image。日英alt・元比率/contain・顔/装身具の切れを確認する。AI図を実物写真・完全なSKU再現・素材/寸法/金具/個数・装着実績の証拠にしない。
- 公式写真を許可なく取得・転載・hotlink・生成入力に流用しない。人物editorial-imagesと単体product-detail-images、docs/assets、生成記録を分離する。[画像ガイド023](docs/japanese-model-styling-v21.md)と[原本の取得手順](docs/handoff-assets.md)を使う。
- 023の22置換・36人物保持・単体60保持は完了。旧22はretired/Git追跡解除/ignore・dist/ZIP除外済みで、旧ログ/原本は保持。現在のretired除外対象は37画像。既存v12baselineや全画像の不変条件を一括解除しない。
- `scripts/apply-japanese-model-styling.mjs`は完了した023移行専用。起動・通常検証・次の画像更新のために再実行しない。旧bytesを必要とする一回限りのpreservation検査も通常buildの条件にしない。
- Heroは左の人物画像/右の日本地図。明示的な県選択で画像・商品・国内参考価格を切り替え、region query・他query/hash・履歴・言語を保持する。写真は自然比率・上下人工帯なし。沖縄別枠はPC200px/スマホ80pxを継承する。
- 産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県。47県の原形を主図46＋沖縄別枠1へ分け、実商品がある掲載県のみ通常hrefにする。島・枠・labelの直接click/tap/Enter、preview、zoom/内部scroll、地方一覧、keyboard/noJSを保つ。詳細は[022](docs/compact-layout-v20.md)。
- 旅先検索の地方・県、県内エリアは `src/config/travel-areas.ts`。工房・販売店の所在地を訪問エリアとして使い、産地の事実はcatalogの根拠を確認して管理する。[仕様035](specs/035-national-travel-discovery/spec.md)
- TOP10/DISCOVER共通写真はPC最大300×200px、スマホ最大222×148px。種類の小画像は同じ地域・種類の実公開商品から選び、人気順位としない。
- Sourcesは初期closedのnative details。出典/dateは保持し、希望時に一覧表示する。公式CTA・在庫注意・AI/広告開示まで一緒に隠さない。
- 購入経路とその確認日は商品詳細の主CTA付近に表示する。通販や店舗の文言は購入根拠の種類と確認済みlink IDから導く。市場ごとの価格・販売先と、出典欄の確認日を保つ。
- Sourcesが同ページanchorを一元処理する。pushState→open/scroll/summary focusを保ち、商品templateへ重複open処理を足さない。直接hash/history/noJS/rapidcloseも確認する。
- 同ページ/query/hashの言語切替、filter/reset/0件、44px操作域、16px select、横向き/focus/stickyの非遮蔽を確認する。overflow:hiddenだけで不具合を隠さない。

## 広告・地図・security

- 実提携は未申請・通常リンク。広告はprogram/item両承認、対象merchant、HTTPS・完全一致host・実確認日・localeを満たす共通resolverのみ。欠落・停止時は通常URLへ戻す。
- AdSenseはoff。環境flag・架空ID・自作CMPで有効化しない。認定CMP、実ID、所有確認、同意/配信、CSP/Privacy、host適合は別の未完了作業。
- 店舗Google Mapsはregistryの固定Share URLのみ。初回の明示許可後は日英の登録済み地図を30日自動表示し、未選択/拒否/期限切れではGoogle通信0、オフで全iframe停止。確認済みの埋め込みがない店舗は公式案内と外部地図を表示する。地図専用choice/version/savedAt/expiresAtのみ保存し、不正/旧版/期限切れ値は削除。保存不可はページ限り。複数タブ/戻る/再訪で撤回を尊重する。
- MapsはPC330px/スマホ280pxの枠高を基本とし、Google帰属・fullscreen・公式/外部fallbackを保つ。maps-v17の地図設定と広告Privacy v14/広告CMPは別物である。
- JSON-LD escape、HTTPS/host/locale gate、限定CSPを維持する。外部検査はsafe-outboundの各hop DNS/公開IP/接続pin/timeoutを使う。負例はmockにし、privateへ実接続しない。
- Nodeは24.22.3以上のサポート中の修正版、pnpm11.25.0。PUBLIC_は公開値であり秘密を入れない。.env・秘密・依存実体・生成物をGit/ZIPへ混ぜない。
- HTTPヘッダー、MFA/復旧/branch管理、契約・法令・許諾の未確認を完了扱いにしない。既知audit0と未知も含む全安全を混同しない。[外部条件](docs/remaining-task-audit-v17.md)は画像/UI検査で解消したとしない。

## 検証・公開・引継ぎ

- [公開記録](docs/deployment-results.json)は公開app、[引継ぎ状態](docs/handoff-status.json)はGitから再開する入口。023は完了したアプリ変更、024はGit引継ぎの整備。文書/toolだけの変更をアプリ公開と呼ばない。
- JSON/広告変更はpnpm verify。文言/画面は影響に合うtype/build/JAEN/mobile等を選ぶ。docs-onlyに過去497画面等の全走査を機械的に要求しない。
- build担当は一つにし、browser検査中に共有distや入力を変えない。env/base/originを一致させ、CHECK_REPORT_PATH等を作業固有名にする。過去の成功・失敗・部分結果を上書きしない。
- 0.18.0公開のHero77/写真37/mobile92/browser146/Sources328/補足24は当時の結果。新しい変更を検査した成功件数へ流用しない。詳細は[verification](docs/verification.md)。
- 失敗raw→原因→修正→再検証を残す。75msの固定待機競合はQA側で実条件/rAF待機へ修正済み。未実施の検査・公開・承認・Google掲載を成功と書かず、Chrome emulationと実機Safari/iOSを区別する。
- 次の作業完了時は仕様・引継ぎ・実測を更新する。必要な納品はpackage:deliveryで新しい版付きZIP/全SHAを確認し、過去0.18.0の1198ファイルの履歴を現在のGit全件数へ読み替えない。
- fresh cloneの通常buildに私的artifacts、元PNG、外部ZIP/proofは不要。原本編集・歴史的照合が必要な場合だけ[GitHub上の配布資料](docs/handoff-assets.md)を取得する。認証情報や前任PCの絶対パスを必須にしない。

## 新しいチャットや別のAIへの引継ぎ（SORA動画）

- どのチャットやAIでも **[新チャット完全引継ぎ](docs/video/NEW_CHAT_HANDOFF.md)** を最初に開く。最新mainの[動画SDD](docs/video/spec.md)、[Flow共通テンプレート](docs/video/flow-template.md)、[制作進捗](docs/video/production-status.json)、[TikTok重複防止台帳](docs/video/tiktok-publication-registry.json)を参照する。
- 制作中の地域・回は制作台帳の `seriesFocus` と `currentEpisodeId` で確認し、該当エントリーの `episodePath` と `currentPromptVersion` で指示文を開く。神奈川8商品と[京都編の7商品](docs/video/kyoto-series-plan.json)は重複照合に含める。
- **サイトの女性の原本画像をそのまま使う**。ユーザーから明示指示がなければ画像新規生成・加工・クロップ・Canva開始画像を作らない。商品IDと人物画像 assetId/path の重複を双方チェックする。
- TikTokの公開確認は [投稿照合台帳](docs/video/tiktok-publication-registry.json) を参照する。確認した投稿URLと商品・女性画像の対応を記録し、動画制作と投稿の状態を区別する。作業後は制作台帳と対象エピソードを更新する。

## TikTok・Instagram・Google Flow の動画制作と投稿文

「SORA｜旅先で待ち合わせ」のTikTok動画制作では、最初に [新チャット完全引継ぎ](docs/video/NEW_CHAT_HANDOFF.md)、[動画引継ぎ](docs/video/README.md)、[制作仕様](docs/video/spec.md)、[進捗台帳](docs/video/production-status.json)、進行中のepisodeの固定指示文を読む。サイトの公開商品IDと `src/data/editorial-images.json` の **同じ女性画像** をFlowに入力し、勝手に新しい女性や未掲載商品を作らない。新作の提案前に元画像の9:16の収まりを確認し、[冒頭の見切れを防ぐ手順](docs/video/spec.md#冒頭の見切れを防ぐ手順)に沿ってFramesまたはIngredientsを選ぶ。冒頭に見切れがあるテイクや、[ほくろや単独の濃い点](docs/video/spec.md#動画の肌と表情)が見えるテイクは要修正として記録する。Flowは原則9:16/対応時10秒/一人称デート/ひらがな中心の音声（解像度はモデル設定で確認）、字幕とBGMは後編集。毎回指示文を再発明せず、実際の生成・レビュー・公開状態を区別して台帳に反映する。

Instagramリールの紹介文は [共通テンプレート](docs/video/instagram-caption-template.md) を使い、本文を対象のepisodeに、下書き・公開確認を [進捗台帳](docs/video/production-status.json) の `instagramCaption` に記録する。
