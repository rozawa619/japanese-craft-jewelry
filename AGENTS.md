# AIの開始手順と有効な制約

このファイルは現在有効な規則です。過去の版ごとの記述は[旧AGENTS](docs/archive/AGENTS-before-017.md)へ保存しました。ユーザーの最新依頼を優先し、この文書だけから未依頼の申請・契約・移転を始めません。

## 最初の5分

1. README → docs/ai-handoff.md → docs/handoff.md → docs/architecture.md。
2. Git checkoutならgit status --short、ZIPなら元ZIP/proofと別の作業用コピーを確認。package.json、docs/deployment-results.jsonを読み、公開app commitと文書/作業HEAD、最新ZIPを区別。ZIPに.gitがないことをエラーにしない。
3. 現在の作業はspecs/022-compact-map-and-natural-hero。直前の写真共通化は021、地図/Hero/沖縄の前段階は020。直前の地図/表示設定は019、商品追加は018、引き継ぐUI/securityは016、保守文書の意図は017。必要な領域だけ過去仕様へ戻る。
4. docs/setup.mdでruntime/env/base/Chromeを確認。docsのJSONはbuild入力なので削除しない。
5. 変更する正本を特定し、docs/verification-guide.mdで必要な検査を選び、実装と仕様・引継ぎを合わせる。

## サイトの境界

- 運営者表示SORA、日本全国の工芸ジュエリーを選ぶJA/ENサイト。神奈川専用やiTOへ戻さない。
- ブログ/Contact/販売・決済・発送の機能を作らず、不要な販売責任説明をUIに再導入しない。提供されていない氏名/住所/メールを作らない。
- 作業版0.17.3は0.16の60公開/66登録・24県・34公開関連技法/全36・118AI画像を継承。固定上限や各県同数の条件ではない。地図47県の未掲載県は非リンクで、空の地域/技法やdraftの公開URLを作らない。
- COCOON2/欠品18K/販売未確認の畠山2/hairpinはdraft。復帰には対象variantの現行購入根拠と派生参照の再確認が必要。403を閉店/売切れとしない。

## 正本と編集

- 商品/工房/販売店/地域/技法/素材/広告program/linkはcatalogの独立した配列とIDで関連付ける。数値・URLは本文や部品に重複させない。
- 英語/共有事実catalog、日本語表示translations/ja、紹介product-storiesと日英Markdown、比較selection-notes、選び方product-buying-guides。詳しい変更単位はediting-guide。
- id/slugを不用意に変えない。同じ商品でもidとslugが異なる例がある。変更時は全参照・URL移行・画像・比較・地域・sitemapを検査。
- 国内JPYは国内の実参考値、海外ストアの実額は別。表示言語と購入市場を混同せず、FX換算や片耳価格の勝手な倍額化をしない。
- 新商品はdraftから。gallery/古い催事/企業住所だけ/明示欠品/販売未確認で公開しない。日英本文・選定/比較・3問・出典・購入・訪問案内/正直なfallback・画像の公開gateを満たす。
- 一次情報のURL/実確認日/支える主張を残す。未確認仕様/重量/原産地/認証/低アレルギー、レビュー/試着/取材/人気/販売実績/承認/許諾を作らない。

## 画像とUI

- ホーム先頭のHeroとは別に、産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県の順です。47県のCC0原形を主図46＋沖縄別枠1へ分け、実商品/産地本文がある掲載24県だけを通常リンクにします。沖縄は島path・枠・labelを押せる拡大表示とし、県のclick/tap/Enterで産地の商品一覧へ直接進みます。pointerenter/focus/selectの代表単体画像/商品/国内参考価格preview、100/150/200/300%のzoom・内部scroll・全体表示、地方別の初期closed details・地図ジャンプ・JSなしのhrefを継承します。外枠/主図/沖縄枠の設計値と実測は最新022の説明で区別します。
- [日本地図の直接選択](docs/japan-map-direct-v18.md)・[残タスク](docs/remaining-task-audit-v17.md)・[法務再確認](docs/legal-review-v17.md)・[商用ホスト移行準備](docs/commercial-host-migration-v17.md)を参照。対応ホスト向けpublic/_headersは移行準備です。現GitHub PagesのHTTPヘッダーを設定済みとはせず、実契約/本人情報/広告実ID・CMP/ドメイン・DNS/アカウント管理/検索実績を技術PASSで完了化しません。AdSense off・実提携未申請/通常URLを維持します。今回は新bitmapを生成せず0.16原本を保持。

- 公式写真を許可なく取得/転載/hotlink/生成入力へ転用しない。AI図は実物写真・完全なSKU再現・金具/個数・装着実績の証拠ではない。
- 人物editorial-imagesと単体product-detail-images、権利docs/assets、生成記録を分離。0.16の新規生成記録はimage-generation-v16とimage-generation-solo-v16。単体readerは旧v14＋新v16を併読し、旧記録を上書きしない。画像必須の公開gateをtext previewだけで迂回しない。
- captionは常時AIイメージ/AI image。日英alt、元比率/contain、顔や装身具の切れを検査。人物は架空成人27〜33歳目安、日本/米国/英国の可愛い・美人系という依頼を継承し、国籍を見た目から認定しない。ほくろ/シミなしの方向性を保つ。
- 種類の小画像は実際の公開商品・同地域・同種類から選び、人気順位としない。旧画像bytes保持の条件や退役10画像を勝手に解除しない。
- Sourcesは初期closedのnative details。出典/dateは消さず必要時に一覧表示。公式CTA/在庫注意/AI/広告開示を一緒に隠さない。
- 同ページSource anchorはSourcesが一元管理。pushState→open/scroll/summary focus。商品templateへ重複openを足さない。直接hash/history/noJS/rapidcloseの回帰を保つ。
- 同ページ/query/hashの言語切替、filter/reset/0件、スマホの44px操作域・16px select、横向き/focus/stickyの非遮蔽を確認。overflow:hiddenだけで不具合を隠さない。

## 広告・地図・security

- 実提携は未申請/通常リンク。広告はprogram/item両承認、対象merchant、HTTPS・完全一致host・実確認日・localeを満たす共通resolverだけ。欠落/停止は通常URLへ戻す。
- AdSenseはoff固定。環境flagや架空ID/自作CMPで有効化しない。認定CMP/実ID/所有確認/同意・配信/CSP/Privacy/host適合は別の未完了作業。
- Google Mapsはregistryの固定Share URLのみ。Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。
- JSON-LD escape、HTTPS/host/locale gate、限定CSPを維持。外部検査はsafe-outboundの各hop DNS/公開IP/接続pin/timeoutを使い、負例はmock。privateへ実接続しない。
- Node最低版24.22.3のサポート中の修正版/pnpm11.25.0。PUBLIC_は公開値で秘密を置かない。.env/秘密/依存実体/生成物をGitやZIPへ混ぜない。
- host header/MFA等の未確認・未操作を完了にせず、既知audit0と未知も含む全安全を混同しない。

## 検証・完了の記録

<!-- TODO_PUBLIC_V20 -->
0.17.3（仕様022）は公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。

- 0.17.0のdiscovery-map-stageは当時の証跡。020の直接クリック/拡大を旧193件のpreview操作で合格にしない。現在の022はcompact-layout-stage・022 validation・deployment-results・verificationで確認する。021の37/92と020の217/77は当時の結果で、新しい一覧枠/沖縄別枠/Hero自然高の検証へ流用しない。

- JSON/広告変更はpnpm verify。文言/画面は影響とriskに応じたtype/build/JAEN/mobile等。docs-onlyに497全走査を要求せず、リンク/コマンド/整合と必要なbuildを確認する。
- build中に共有distへbrowser検査しない。ローカル/公開/途中/最終を区別し、CHECK_REPORT_PATH等を作業固有名へ。0.15の既存証跡を上書きしない。
- old497/314/広告6と、最後のheading/Source修正後92/4/race12等を混同しない。最新の事実はdeployment-results/verification。
- 失敗raw→原因→修正→再検証を残し、未実行テスト・公開・承認・Google掲載を成功と書かない。実機SafariとChrome emulationを区別。
- source/README/引継ぎを更新し、package:deliveryで版付きZIPと全SHAを確認。private artifacts/元PNGは外部資料で、全sourceのbuild依存にしない。
