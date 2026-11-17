# 現在状態と引継ぎ

作業版0.18.0・日本人女性の着用画像023、2026-11-17。文書の入口は保守改訂017を引き継ぎます。別AIは[コピー用prompt](ai-handoff.md)、人は[編集ガイド](editing-guide.md)から始められます。過去の途中値を積み上げた説明は[0.15保存版](archive/handoff-v15.md)へ退避しました。

## 何を作っているか

Japanese Craft Jewelryは、SORAが全国の工芸ジュエリーを選ぶ日英サイトです。販売/決済/発送・ブログ・Contactはありません。作業版0.18.0は0.16の台帳である公開60/全66商品・下書き6商品、24県、公開関連34技法（全36）、33店舗/53商品の関連、一次出典293件、人物58＋単体60のAI画像118ファイル。今後の追加上限ではありません。

51品の公式注文受付と9品の小売/現行カタログを購入根拠とします。将来在庫や店頭の個別在庫は保証しません。COCOON2、欠品18K、現行販売未確認の畠山2、hairpinはdraftを維持。復帰は対象variantの現行販売を再調査します。

## 公開版・source・証拠の区別

| 対象 | 正本 |
| --- | --- |
| 公開appの正本 | [deployment-results](deployment-results.json)。作業/文書HEADと実配信appを区別 |
| 現在の作業source | git status / git logと[package.json](../package.json)。文書/task更新のcommitは公開appと異なる場合がある |
| 最新の公開/納品状態 | [deployment-results.json](deployment-results.json) |
| 現在の人物生成/差し替え | [023仕様と検証](../specs/023-japanese-model-styling/)・[画像ガイド](japanese-model-styling-v21.md) |
| 継承する地図枠/Hero自然高 | [022仕様と検証](../specs/022-compact-map-and-natural-hero/)・[編集手順](compact-layout-v20.md) |
| 継承する写真サイズ・全ページ共通化 | [021仕様と検証](../specs/021-unified-region-photos/)・[編集手順](region-photos-v19.md) |
| 旧0.16の実公開検証 | [Source328HTML](national-stage-hosted-sources-results.json)・[補足24](national-stage-hosted-release-results.json)・[mobile92](national-stage-hosted-mobile-results.json)、当時全件成功。概要は[0.16保存版](verification-v16.md) |
| 旧0.15の段階と限界 | [検証ガイドの履歴](verification-guide.md#015の記録を読む)・[mobile検証](mobile-refinement-v15.md) |
| 継承した保守文書の検査 | [017 validation](../specs/017-maintainer-handoff/validation.md)とhandoff-stageの記録 |
| 前段階から継承する地図・Hero | [020仕様と検証](../specs/020-direct-region-map/)と[最新verification](verification.md) |
| 直前の地図/店舗Maps設定 | [019](../specs/019-geographic-discovery-map-privacy/)とdiscovery-map-stage。当時の結果と区別 |
| 全国追加の仕様・検査 | [018](../specs/018-national-jewelry-expansion/)とnational-stageの記録。0.15の証跡とは別 |

直前018の依頼は、全国で追加する価値のあるジュエリーを増やすことでした。秋田・福井・岐阜・広島・鹿児島・徳島・鳥取・沖縄・熊本・島根の10県に10商品を追加し、日英の紹介・比較・3問・公式購入先・店舗案内・人物と単体のAI図を揃えました。広告は通常リンク/offを保ちます。

<!-- TODO_PUBLIC_V21 -->
0.18.0（仕様023）は画像差し替え・公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

023では人物着用画像を、架空の日本人成人女性という生成設定へ統一する作業中です。新規は25歳を含む25〜33歳、華やかなかわいさ/洗練された綺麗さと髪型・表情・装いの変化を使います。見た目から実在人物の国籍・年齢を推定/認定しません。監査は22画像置換/36画像保持/不明0で、新画像の生成・採用・公開の完了数ではありません。新logはdocs/image-generation-japanese-v23.json、readerはscripts/lib/styling-generation-manifests.mjs、専用QAはscripts/check-japanese-model-styling.mjs。旧22画像のbytesを上書きせずasset台帳でretiredへ移し、dist/ZIP除外とGitの追跡解除/ignoreを対応付けます。v12baselineは変更せず、保持36人物・単体60・商品facts/レイアウト/広告off/Google Maps同意を維持します。新元PNGは納品先のgenerated-originals/0.18.0/へ別保存し、旧記録/原本も残します。

旧版の公開記録：0.17.3（仕様022）公開済み。app `ef8ae160e7fc7d2b41cdce1063094313b719df6e`、[Actions44081729750](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44081729750) completed/success。実URLで一覧地図241・Hero77・mobile92・Sources328・補足24を確認。地図枠縮小/一覧沖縄別枠とトップ写真の自然比率を反映。確定値はdeployment-results/verificationを参照。 0.17.3の全sourceは1155ファイルを照合済み。これは023の生成/検証/公開/納品結果ではありません。

旧版の公開記録：0.17.2（仕様021）公開済み。app `19f066ee20f4aa8eb1b441a4178dc92ffcb25ae7`、[Actions44072612768](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44072612768) completed/success。実URLの写真37・mobile92・Sources328・補足24が成功。Top10とDISCOVER3の写真を全3ページで統一。確定値はdeployment-results/verificationを参照。 0.17.2の全sourceは1118ファイルを照合済み。これは022の実測/公開/納品結果ではありません。

ホーム先頭のRegionHeroはPCで左に人物AI画像、右に日本地図を並べます。022では写真をheight:autoの元比率・containで表示し、画像/figure/AIcaption前後に人工的な上下letterboxを残さない設計です。顔・耳・ジュエリーとAIcaptionを保ち、スマホも自然高で表示します。Heroはclick/tap/Enter/Spaceの明示県選択で女性画像・商品/国内参考価格・CTAを切り替え、公開idだけのregion queryと他query/hash・戻る・言語切替を維持します。Heroの沖縄拡大枠はPC200px/スマホ80pxを継承。別の一覧地図は外枠をコンパクトにし、本州〜北海道の主図と沖縄の独立拡大枠（設計PC144px/スマホ80px）から、通常hrefのclick/tap/Enterで産地へ直接進みます。preview/select・zoom/内部scroll・noJSも保持します。TOP10/DISCOVER3県の共通写真はPC最大300×200px・スマホ最大222×148pxのままです。実装寸法と最終検証は022 guide/validationを参照し、旧021の37/92や旧020の217/77を今回の成功に加算しません。

前段階020から継承する構成は次のとおりです。ホーム先頭のHeroとは別に、産地一覧はTOP10→コンパクトな日本地図→DISCOVER3県の順です。47県のCC0原形を主図46＋沖縄別枠1へ分け、実商品/産地本文がある掲載24県だけを通常リンクにします。沖縄は島path・枠・labelを押せる拡大表示とし、県のclick/tap/Enterで産地の商品一覧へ直接進みます。pointerenter/focus/selectの代表単体画像/商品/国内参考価格preview、100/150/200/300%のzoom・内部scroll・全体表示、地方別の初期closed details・地図ジャンプ・JSなしのhrefを継承します。外枠/主図/沖縄枠の設計値と実測は最新022の説明で区別します。

Googleマップは初回の明示許可後、日英・全店舗で30日間自動表示します。未選択/拒否/期限切れではGoogle通信0、オフ操作で全iframeを停止。localStorageには地図専用choice/version/savedAt/expiresAtだけを保存し、不正/旧版の値は削除し、有効期限30日を過ぎた値は次の読込/再表示時に削除します。保存不可はページ限りです。複数タブ/戻る/再訪でも撤回を尊重します。PC330px/スマホ280pxの枠高を基本に、Google帰属・fullscreen・公式/外部リンクを保ちます。地図設定版maps-v17と広告Privacy版v14は別で、地図設定は広告同意/CMPではありません。

[日本地図の直接選択](japan-map-direct-v18.md)・[残タスク](remaining-task-audit-v17.md)・[法務再確認](legal-review-v17.md)・[商用ホスト移行準備](commercial-host-migration-v17.md)を参照。対応ホスト向けpublic/_headersは移行準備です。現GitHub PagesのHTTPヘッダーを設定済みとはせず、実契約/本人情報/広告実ID・CMP/ドメイン・DNS/アカウント管理/検索実績を技術PASSで完了化しません。AdSense off・実提携未申請/通常URLを維持します。

## 再開の順序

1. [AGENTS](../AGENTS.md)とユーザーの最新依頼を読む。
2. [setup](setup.md)でruntime・env・baseを揃え、[architecture](architecture.md)で正本を特定。
3. [editing-guide](editing-guide.md)に沿い必要なファイルだけ変更。docs JSONはbuild依存なので保持。
4. [verification-guide](verification-guide.md)の影響別検査を行い、Gitならgit diff、ZIPなら保管した展開元とのフォルダー比較。必要なら公開と公開後確認。
5. 仕様/引継ぎ/実測を更新し、[納品手順](setup.md#納品zipを作る)で全sourceとSHAを再作成。

## 守る既存の挙動

- 国内JPY/海外実額/表示言語を分ける。未承認広告を使わず共通resolverの両承認/host/date/locale gateを保つ。
- AI図は実物の証拠ではない。短いcaption/alt/元比率、画像権利と生成記録、退役10画像の除外を維持。
- 出典/dateは初期closed。Sourcesだけが同ページリンクを処理し、pushState→open/scroll/summary focus。重複handlerで即閉じ後の再openを再導入しない。
- 店舗Mapsは初回許可後30日自動表示、オフで全停止。未選択/拒否/期限切れはGoogle0。地図専用の最小Storageのみ、保存不可はページ限り。Google帰属と外部fallback、広告同意との分離を保つ。
- 日英の同ページ/query/hash、種類画像の実地域/種類との一致、320px/横向き/keyboardの操作性を維持。

## 未完了・判断が必要な事項

| 項目 | 状態/次に必要なこと |
| --- | --- |
| AdSense | off固定。実アカウント/所有確認/実ID/認定CMP/地域別同意・配信の実装は未完了 |
| 提携 | 全program/link未申請・通常URL。申請先の現行条件と真実の申請者情報が必要 |
| 商用host | GitHub Pages用途適合の確認または適した公開先の判断が残る。今回契約/移転/DNSなし |
| security | 実装上の検出問題は修正。HTTP保護header制御やMFA/branch/recovery等はhost/account側の未操作範囲。全安全/侵入試験済みとはしない |
| 実物写真 | 60品とも写真使用許諾は未取得。AI図から仕様や試着を認定しない |
| 検索/端末 | Google掲載/順位/流入は未測定。Chrome emulationを実機Safari/iOSと呼ばない |

過去の0.15では、広範囲497/価格314/広告6等と、最後の見出し/Source変更後92・tap4・race12・heading12等が別の段階です。旧0.15最終公開248HTML/98画像の確認を、0.16の公開検査へ転用しません。正確な範囲はverificationを読み、全検査を最終版で再実行したと書き換えません。

## 納品物

023では監査済み22人物が新規生成/置換の対象です。保持36人物と単体60のbytes、旧原本/生成記録を保持します。

全sourceは隣接japanese-craft-jewelry-delivery/sourceとlatestのjapanese-craft-jewelry-source.zip。0.18.0用の版付きZIP名は`japanese-craft-jewelry-source-0.18.0-models-023.zip`、外部proof名は`package-verification-0.18.0-models-023.json`です。最終のファイル集合・SHA・検証完了状態は[deployment-results.json](deployment-results.json)のsourceDeliveryと外部proofを参照し、予定名だけで完了としません。ZIP自身hashはZIP外に置きます。

.git/.env/指定した認証ファイル名・秘密鍵拡張子/依存実体/dist/.astro/artifacts/退役画像を除外。自動検査は指定パス・リンク/ジャンクション・ファイル集合・SHAの確認で、任意ファイルの内容やGit全履歴の機密検査ではありません。PNG原本とQA画面は別資料で、fresh cloneのbuildに不要です。元PNG50枚の0.14別ZIPは保持し、0.16の新規23PNG（採用20・棄却3）は別の生成/採否記録とともに扱います。0.16原本ZIPは26ファイル・35,561,799bytes、SHA256 `383cf02e99cdf06d936118e9d071f35df68a1b99191de31442b7f450de386254`を外部`originals-verification-0.16.0.json`で検証済みです。task-local Node/pnpm wrapperはこのPC固有の便宜で、他PCはsetupの要件から構築できます。

## 写真の統一021

Top10とDISCOVER3県は同じstyleでPC最大300×200px/スマホ最大222×148px。ホーム/商品一覧/産地一覧すべてに適用。変更先はRegionSelection.astro末尾の共通group styleで、rankedだけの指定へ戻さない。[更新手順](region-photos-v19.md)と[最新実測](verification.md)を参照。020の公開map/mobileの中止分、021の最終37/92/328/24、022の新しい検証は別の段階として記録します。

## 地図枠とHero自然高022

022から継承するレイアウトは一覧地図のコンパクト枠と沖縄独立拡大枠、Hero人物写真のheight:auto/上下余白なしです。023は人物画像/生成設定だけを更新します。Top10/DISCOVER共通写真は021を継承します。022当時の実装寸法/検証は[022の説明](compact-layout-v20.md)・[最新verification](verification.md)を確認し、旧1118ファイルや旧37/92を今回の納品/実測にしません。


## 日本人女性の人物画像023

0.18.0の人物生成/編集・監査・退役と検証の方針は[023ガイド](japanese-model-styling-v21.md)・[仕様と検証](../specs/023-japanese-model-styling/)を確認します。新規生成/採用/公開/ZIPは作業中で、最終件数・app/Actions・集合/全SHAはdeployment-resultsと外部proofが正本です。旧生成logのUS/UK等は歴史として残し、現在のactive registryに対応する生成設定だけを監査します。023の新画像を、旧022の241/77/92や旧「全画像不変」の成功へ加算しません。
