# 現在状態と引継ぎ

作業版0.17.1・日本地図拡大/直接選択020、2026-11-17。文書の入口は保守改訂017を引き継ぎます。別AIは[コピー用prompt](ai-handoff.md)、人は[編集ガイド](editing-guide.md)から始められます。過去の途中値を積み上げた説明は[0.15保存版](archive/handoff-v15.md)へ退避しました。

## 何を作っているか

Japanese Craft Jewelryは、SORAが全国の工芸ジュエリーを選ぶ日英サイトです。販売/決済/発送・ブログ・Contactはありません。作業版0.17.1は0.16の台帳である公開60/全66商品・下書き6商品、24県、公開関連34技法（全36）、33店舗/53商品の関連、一次出典293件、人物58＋単体60のAI画像118ファイル。今後の追加上限ではありません。

51品の公式注文受付と9品の小売/現行カタログを購入根拠とします。将来在庫や店頭の個別在庫は保証しません。COCOON2、欠品18K、現行販売未確認の畠山2、hairpinはdraftを維持。復帰は対象variantの現行販売を再調査します。

## 公開版・source・証拠の区別

| 対象 | 正本 |
| --- | --- |
| 公開appの正本 | [deployment-results](deployment-results.json)。作業/文書HEADと実配信appを区別 |
| 現在の作業source | git status / git logと[package.json](../package.json)。文書/task更新のcommitは公開appと異なる場合がある |
| 最新の公開/納品状態 | [deployment-results.json](deployment-results.json) |
| 旧0.16の実公開検証 | [Source328HTML](national-stage-hosted-sources-results.json)・[補足24](national-stage-hosted-release-results.json)・[mobile92](national-stage-hosted-mobile-results.json)、当時全件成功。概要は[0.16保存版](verification-v16.md) |
| 旧0.15の段階と限界 | [検証ガイドの履歴](verification-guide.md#015の記録を読む)・[mobile検証](mobile-refinement-v15.md) |
| 継承した保守文書の検査 | [017 validation](../specs/017-maintainer-handoff/validation.md)とhandoff-stageの記録 |
| 今回の地図拡大・直接選択 | [020仕様と検証](../specs/020-direct-region-map/)と[最新verification](verification.md) |
| 直前の地図/店舗Maps設定 | [019](../specs/019-geographic-discovery-map-privacy/)とdiscovery-map-stage。当時の結果と区別 |
| 全国追加の仕様・検査 | [018](../specs/018-national-jewelry-expansion/)とnational-stageの記録。0.15の証跡とは別 |

直前018の依頼は、全国で追加する価値のあるジュエリーを増やすことでした。秋田・福井・岐阜・広島・鹿児島・徳島・鳥取・沖縄・熊本・島根の10県に10商品を追加し、日英の紹介・比較・3問・公式購入先・店舗案内・人物と単体のAI図を揃えました。広告は通常リンク/offを保ちます。

<!-- TODO_PUBLIC_V18 -->
0.17.1（仕様020）は公開前の検証中です。公開app・Actions・実URL結果は確定後に更新します。

PCのホーム先頭は左の人物AI画像・右の日本地図を並べるRegionHeroです。スマホでは写真を全幅で大きく表示し、その下に商品小情報と地図を並べて、顔や耳を切らずに見やすくします。Heroの県はclick/tap/Enter/Spaceで明示選択すると、女性画像と商品/国内参考価格を切り替え、産地CTAから商品一覧へ進みます。hover/focusだけでは切り替えません。有効な公開地域idだけを`?region=`へ反映し、他query/hash・戻る・言語切替で選択を保ちます。Heroとは別に、TOP10後の大きい一覧地図は県のnative直接リンクです。TOP10の人物AI画像はPC180px・狭幅110px/98pxのコンパクトな枠を基本にcontainで表示し、地域名/商品/価格/順位を保ちます。顔や耳を切らず、初期Heroは既存selection.heroProductIdを使います。これらは機能・表示の変更であり、訪問数や検索順位の改善を実測したという意味ではありません。

今回020の構成は次のとおりです。ホーム先頭のHeroとは別に、産地一覧はTOP10→大きい日本地図→DISCOVER3県の順です。観光TOP10順位は維持し、47県のCC0形状から実商品/産地本文のある掲載24県だけを選択可能にします。県のクリック・タップ・Enterは、その産地の商品一覧へ直接進む通常リンクです。hover/focusと地域selectは代表単体AI画像・商品名・国内参考価格のプレビューに使います。地図は大きくし、100/150/200/300%の拡大・縮小・全体表示と、拡大後の地図内スクロールを用意。地方別一覧・地図ジャンプ・JSなしの直接リンクも保ちます。

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

今回新bitmapは生成せず、0.16のWebP118枚・原本/生成記録を保持します。

全sourceは隣接japanese-craft-jewelry-delivery/sourceとlatestのjapanese-craft-jewelry-source.zip。0.17.1用の版付きZIP名は`japanese-craft-jewelry-source-0.17.1-direct-020.zip`、外部proof名は`package-verification-0.17.1-direct-020.json`です。最終のファイル集合・SHA・検証完了状態は[deployment-results.json](deployment-results.json)のsourceDeliveryと外部proofを参照し、予定名だけで完了としません。ZIP自身hashはZIP外に置きます。

.git/.env/指定した認証ファイル名・秘密鍵拡張子/依存実体/dist/.astro/artifacts/退役画像を除外。自動検査は指定パス・リンク/ジャンクション・ファイル集合・SHAの確認で、任意ファイルの内容やGit全履歴の機密検査ではありません。PNG原本とQA画面は別資料で、fresh cloneのbuildに不要です。元PNG50枚の0.14別ZIPは保持し、0.16の新規23PNG（採用20・棄却3）は別の生成/採否記録とともに扱います。0.16原本ZIPは26ファイル・35,561,799bytes、SHA256 `383cf02e99cdf06d936118e9d071f35df68a1b99191de31442b7f450de386254`を外部`originals-verification-0.16.0.json`で検証済みです。task-local Node/pnpm wrapperはこのPC固有の便宜で、他PCはsetupの要件から構築できます。
