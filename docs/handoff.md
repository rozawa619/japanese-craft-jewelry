# 引継ぎ — 0.14 選ぶ内容・単体図・小型地図・広告Privacy

2026-11-17。AGENTS → constitution → specs/014/015 → 本書 → operationsの順で読む。前版はdocs/archiveのv13へ保存。公開の確定状態はdeployment-results.jsonを優先する。

SORAの日英工芸ジュエリーセレクト。公開50/全56商品、14地域、24技法、258商品出典、23店舗を維持。41品の公式注文受付・9品の営業小売/現行価格付きカタログという前版の購入根拠を保持する。今回の本文実読や画像/HTTP検査を将来在庫や注文成立の保証へ置き換えない。

## 今回の内容

- 全50品に固有の選び方を日英各3問、計300問答追加。仕様はcatalog/jaのtokenから展開し、価格/URLを複製しない。出典は商品のsourceIdsへ対応。公式本文実読とToyToy/錺之等の旧表現35項目訂正をresearchへ記録。
- 全50品の『惹かれる、その理由。』へ単体AI図。人物スタイリング48枚を保持し、計98公開WebP。新50枚は1254²/2,509,816bytes/AI XMP付き。短いAI caption、日英alt、実物確認用公式リンクを併設。
- 生URLを意味の分かるリンク名へ変更し、hrefを維持。
- 23店舗に小型Google公式Share地図。説明と表示操作後だけ読み込み、閉じる/再読込でiframeを削除。選択を自前Cookie/Storageへ保存しない。外部地図/経路/公式案内のfallbackを保持。地図選択は広告の認定CMPではない。
- 日英Privacyに現在offと、将来Google広告Cookie/情報利用/設定/拒否/同意管理、地図表示後の送信を分けて明記。footer設定導線と、環境flagだけで広告を開始できないoff固定検査を追加。

単体図はbuilt-in image_genで既存の自作AIスタイリングを参照して生成。実物写真/正確なSKU再現/試着感/仕様根拠ではない。Tamura/SIMPRICH/PAGEは採用前に修正、PAGEは薄い角丸板のr2を採用。実prompt/参照hash/原本/採否はimage-generation-solo-v14.json。商品写真50件の許諾は未取得。IPTC XMPは署名付きC2PA証明ではない。

## 編集入口

| 正本/実装 | 役割 |
| --- | --- |
| catalog.json・translations/ja.json | 事実/価格/URL。国内JPYと海外実価格を分け、FX換算しない |
| product-stories・selection-notes・content/products | 固有の魅力/装い/比較。架空レビュー/未確認仕様を作らない |
| product-buying-guides.json・lib同名・ProductBuyingGuide.astro | 日英3問/対象商品の出典/size・findings・fastening token |
| editorial-images.json・product-detail-images.json・docs/assets.json | 人物と単体図/alt/権利/退役履歴を分離 |
| docs/image-generation-solo-v14.json | 実prompt/自作AI参照/hash/PNG原本/目視の限界 |
| purchase-evidence・visits・docs/research/sources.json | 現行購入根拠/店舗事実/一次資料/確認日 |
| lib/store-map-embeds.ts・map-embed-url.ts・VisitGuide.astro | 固定Google Share origin/path/pbを検証、選択時だけiframe生成 |
| advertising-privacy.json・lib同名・AdvertisingPrivacyStatus.astro | off状態/policy version/環境flag拒否/公開状態表示 |
| content/policies/{ja/,}privacy.md・Base.astro | 日英Privacy/footer/限定CSP、Google frameだけ許可 |
| lib/affiliate.ts・market-prices.ts | 承認/host/date/localeの二重gate、価格と市場リンクの対応 |

## 維持条件・申請前の残作業

ブログ/Contact/販売決済なし、operatorはSORA。同一ページ/query/hashの言語切替、全国構造、TOP10訪問率の出典を維持。COCOON2/欠品18K/販売未確認の畠山2/hairpinはdraft。復帰は現行購入を再調査し日英/比較/画像/地域/sitemapを同時更新。退役10画像を戻さない。

提携プログラム/個別リンクは未申請・通常リンク。AdSenseアカウント/実ID/所有確認/実host設定/認定CMP/地域別同意と配信/稼働状態に応じたPrivacy/CSP統合は未実施。GitHub Pagesの商用用途適合確認または適した公開先の選択も残る。off固定は配信可能な完成CMPではない。実アカウントで対応し、秘密をGitへ保存しない。申請/契約/課金/DNS変更は実行していない。

合格/法令/契約適合/実在庫を保証しない。問数や字数をGoogle独自価値の証明とせず、追加も公式情報に基づく固有の選び方を作る。SEOはhreflang/canonical/sitemap/固有metaを維持し、掲載/順位/流入はSearch Consoleで別確認。

## 検証・納品

最終ローカルverifyは113型ファイル0/0/0、111単体、264HTML/370生成物、通常リンク1016/広告0。新機能315、商品導線497、Maps9、隔離広告6、SEO248canonicalを確認。画像r2後にverify/315を再実行。quality497/Maps9/広告6はr2以外の実装が同じ段階の結果。詳細はverification・privacy-depth-verification-v14・inline-maps-v14・各JSON。公開後の確定値はdeployment-resultsを優先する。

全ソースは隣接japanese-craft-jewelry-delivery/sourceとjapanese-craft-jewelry-source.zip。CI/lock/全ソース/仕様/調査/台帳/検証/公開98画像を含み、.git/.env/秘密/node_modules/dist/artifacts/内部参照写真/退役10画像は除外。PNG原本50枚はgenerated-originals/0.14.0とjapanese-craft-jewelry-ai-originals-0.14.0.zipへ分離。旧0.13の23原本は別版で保持。全件SHA/集合/ZIP hashは納品先package-verification-0.14.0.jsonとoriginals-verification-0.14.0.json。原本/ソースZIPは引継ぎ資料で、公開アプリの配布物ではない。

## 公開後の最終検証

公開補足の初回は一時503でHTML178件までの部分結果。rawはhosted-first-attempt、同URLのfresh200はhosted-503-recheckへ保存。アプリ変更なしで全件を再実行し、最終248/98・24/24を確認した。

アプリf7805ed9489706d08743da4b8091f2a154ff7131、Actions44016172889 completed/success（2026-11-17T04:18:28Z、GitHub API実測）。公開315/315・商品導線497/497・Maps9/9・公開メタ1/1成功。公開補足24/24で248正規URLの200/meta/hreflang/JSON-LD/CSPと98画像の200/全SHA一致を確認。Mapsを選ばない検査で広告/CMP/外部通信0、Mapsは別の任意表示検査で確認した。全結果はprivacy-depth-stage-hosted-*に保存。公開確認後の追加は文書・証跡と納品scriptのみで、アプリ370生成物のbytesは配信検証時と一致する。

## 最終ソース・原本の納品

全ソース754ファイル、公開98画像を含む集合と全件SHA256を照合。完了記録を含め再書出し・ZIP化し、同じ全件検査を行う。ZIP自身のhash/bytesはZIP外のpackage-verification-0.14.0.json。原本50PNG＋manifest/READMEの52エントリーも全件SHA一致、原本ZIP71,967,973bytes、SHA fbb38b7bbaaebc86d2c1950ff1e389109f56341adebde46d35eeb906f331bfe1（originals-verification-0.14.0.json）。新規画像はbuilt-in image_gen、全実promptはimage-generation-solo-v14.json。私的QA画像と補足JSONは隣接delivery/screenshots/0.14.0へ分離し、文中artifacts参照はローカル証跡で公開素材/ソースZIPの実行依存ではない。
