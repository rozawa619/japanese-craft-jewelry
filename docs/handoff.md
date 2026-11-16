# 引継ぎ — 0.11 法務点検と購入経路を確認したセレクト

更新日2026-11-16。AGENTS → constitution → specs/011-legal-quality-expansion/ → 本書 → operationsを読む。公開成否はdeployment-resultsのversion/commit/Actions/実測を優先。前版はarchive/handoff-v10.md、archive/deployment-results-v10.json。

## 最新の方針

SORAの日英商品紹介。ブログ/Contact/販売決済/計測広告タグなし。右上1ボタンは同じページ/query/hashを維持。国内価格を主、海外価格は別枠、換算なし。二重承認/許可host完全一致/HTTPS/date/localeの広告ゲートは不変。

全42商品・12都道府県・18公開技法、240出典記録。現行25AI画像が27品に対応し、15品は公式ページへの独自テキストプレビュー。全品に公式URLと販売証跡、20店舗を37品に案内。店頭SKU在庫は未確認。製造地が未確認の丸山4品は神奈川小売枠であり、神奈川製と数えない。

## 重要な追加指示：紹介サイトだけでは公開しない

purchase-evidence.jsonは公開42品と完全に一致する。33品は対象注文UIと価格、9品は現行小売取扱い＋価格付きカタログを確認。紹介/galleryだけ、古い催事、明示欠品、現行確認できない403候補は保留。購入受付の観測は注文成立や将来在庫の保証ではない。

COCOON2/浜松屋18K/畠山2はdraft。hairpinも従来からdraft。商品本文/未使用技法/画像registry/比較/地域代表/visits/selection/サイトマップの派生参照も更新済み。退役3画像はdocs/archive/withdrawn-v11へ保存しlocalRetiredPath/Git除外/pruneで配信と納品public画像から除外。退役全10をまとめて消す再帰操作は不要。写真の未取得権利をAIのユーザー依頼で埋めない。

一次追査はresearch/existing-availability-v11.json、availability-gate-v11.json、hario-addition-v11.json、excluded-products-v11.json。旧regional-product-researchの16候補原案は検討履歴で、全16が公開という意味ではない。最終は14採用+HARIO1。HARIO価格8250、ペア、標準金具。旧cache7480不採用。個別SKUの製作工房は未特定で、東京との工房/作り手関連と全工程東京製を区別。

## 実装と更新

catalogが数値/価格/priceUnit/広告の正本。notesは商品固有の違いと嗜好、比較IDと当該商品sourceIdsのみ。比較はcanonicalの種類/素材/寸法/国内価格を読む。新カードや比較を広告として追加するのでなく、商品詳細へ進む通常内部リンク。地域はnoteの短い選び方と種類別の実件数/価格帯。予算/価格順は国内実額のみ、未知は低予算扱いせず両方向で末尾。同額は編集順。

公開時にはpurchase evidenceのlinkIdを本当に観測した商品へ結び、商品ID queryを別SKUと混同しない。pid等を落とさず、currency/utm等の非identityだけを正規化。ホーム/galleryをonline-orderと宣言しない。小売の場合はvisitsの当該商品との関係と現行店出典が必要。自動validatorだけで実在庫を確認したとは報告しない。

## 法務・AdSense・ホストの未解決事項

legal-audit-v11は15論点と新17候補の追査。英語18K限定、AIの非実物/非体験説明、公式実物確認の入口、GitHub IP保存の説明、未確認ToyToy工程語を修正。全面適法/個別権利クリア/申請合格は未確認。既存AIの個別類似性等の残余リスクはある。

GitHub Pagesの商取引促進を主目的とする無料hosting利用条件は高優先の適合確認事項。収益化前に適合を確認するか適切な公開先を選ぶ。移行準備文書はあるが、Cloudflare契約/新アカウント/DNS/ドメイン/公開移転は実行していない。ソースGitHub継続とPagesの公開先を分ける。

AdSenseは固定の商品/記事/文字数で合格判定しない。PSL対象のgithub.io/pages.devを一般subdomainとして一律不可にしない一方、現在host root404、実サイト登録/所有確認/審査/本人情報/CMP/Privacy/CSPは未完了。Googleタグ/ads.txtの架空IDを作らない。公開Contactを無条件追加しない。競合の文章/写真/レビュー/スコアや実績を流用しない。

## 検証・公開・納品

型83files0/0/0、90単体、220HTML/11878href-src/1617anchor/858通常0広告/497実行CSP hash/204JSON/旧journal14を検証。最終browser/ad/外部/公開の件数と時刻はquality-stage各report、011validationとdeployment-resultsを確認。46件の中断テストと旧版の成功を42件の完了へ流用しない。

全ソースは隣接japanese-craft-jewelry-delivery/sourceとZIPへ出力し、最終版/全ファイル/25公開画像/秘密・生成物・退役public画像の除外を検証する。確定のZIP内容とSHAは同所package-verification-0.11.0.json。運用はoperations、申請前はpre-application-checklist/adsense-review/affiliate-readiness。
