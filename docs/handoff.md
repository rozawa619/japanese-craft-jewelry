# 引継ぎ — 0.13 全商品画像と海外検索

更新日2026-11-17。AGENTS → constitution → specs/013-complete-imagery-international-seo/ → 本書 → operationsを読む。前版の引継ぎ・検証・公開結果はdocs/archiveのv12へ保存した。実配信・検証・納品の確定値は最新deployment-results.jsonと各reportを優先する。

## 変更と現在の内容

SORAの日英工芸ジュエリーセレクト。公開商品50/全56、14地域、24公開技法、258商品調査の出典記録、23店舗は0.12から継承。商品・価格・広告・公開採否は今回変更していない。通販注文受付41品、営業中小売＋現行価格付きカタログ9品という前回の確認を、今回の画像生成やHTTP応答で再認定しない。将来の在庫・店頭の個別在庫・注文成立は保証しない。

不足23品へbuilt-in image_genでオリジナルAIスタイリング画像を追加。旧25ファイル/27商品を保持し、計48ファイルで公開50商品すべてをカバー。日英altを各画像の見える特徴に変更。新23は27–33歳の架空成人モデル設定で日本7/米国8/英国8、かわいい系11/上品な系統12。国籍を画像から推定せず、商品検索フィルター等には使わない。写真や有名人の複製ではない。

公式写真は22件を内部で実見。Nanaoのみ公式画像403で未実見のため、公式本文で確認した小さな丸形・色の概念像に限定。全画像は実物の完全再現・着用実績・仕様の証拠ではない。実物確認用の公式URLを維持し、公開captionはAIイメージ/AI imageだけ。商品写真の許諾50件は未取得のままで、AI生成を写真使用許諾に置き換えない。

新23は1536×1024 WebPに圧縮。旧画像も含む全50商品のpreserveRatioをtrueに揃え、全枠で元画像の顔・耳・手首・ネックレスを保持する。新23WebPにIPTC XMP DigitalSourceTypeのtrainedAlgorithmicMediaを明記。これは署名付きC2PA証明でもライセンス宣言でもない。未加工の元PNGは隣接delivery/generated-originals/0.13.0に23点保存し、元hashと実際に使った全promptをdocs/image-generation-v13.jsonへ記録。

英語トップと商品一覧の見出し・導入、商品固有のdescription、WebPage/BreadcrumbList/AI ImageObjectを更新。一般的な英語enを米英で共用し、jewelry/jewelleryを自然な説明で用いる。相互hreflang・canonical・sitemap・noindex境界を保持。Offer/Review/評価を作らない。Googleへの実掲載・順位・米英流入・Search Console所有権は未確認で、HTML検証と区別する。

## 正本と編集入口

| 場所 | 役割 |
| --- | --- |
| src/data/catalog.json・translations/ja.json | 仕様・国内外の実価格・公式URL・広告の正本。独自FX換算なし |
| product-stories・商品Markdown・selection-notes | 日英の固有紹介・選ぶ理由・公開候補間の違い。未試着の感想を作らない |
| purchase-evidence・visits・sources | 注文/営業小売根拠・確認日・店舗と固定Maps。現行の根拠を再確認して更新 |
| src/data/editorial-images.json・docs/assets.json | styling画像の対応・寸法・alt・権利/退役履歴。実物写真と分離 |
| docs/image-generation-v13.json | 実prompt・架空モデル設定・元PNG/公開WebPのhashと確認限界 |
| docs/research/image-briefs-v13.json・image-plan-v13.md | 23品の公式参照・形や色・写真が見られなかった範囲 |
| scripts/prepare-styling-image.mjs | 元PNGを変更せずWebP化しAI XMPを付与。既存出力への上書きは拒否 |
| src/lib/seo.ts・Base.astro | 共有メタ情報、正規化、日英対応、実表示画像の構造化データ |
| docs/international-seo-v13.md・research同名JSON | Google/Schema/IPTC一次調査17件、SEOの実装とSearch Consoleで残る作業 |

新商品は日英本文/画像/alt/出典・購入根拠を揃えてから公開する。pnpm verifyは全件画像の欠落も拒否。画像がない候補を公開する運用へ変える場合、013仕様・validator・UI fallbackの目的と検証を一緒に見直す。

## 維持する条件

ブログ・Contact・販売/決済・計測広告タグなし。operatorはSORA。右上の言語ボタンで同じページ/query/hashを保持。広告はprogramと商品link両方の承認・完全一致の許可host・HTTPS/date/localeが揃う時だけ切替。現物はすべてnot_applied/通常リンク、申請・承認や広告配信を実行していない。

COCOON2/欠品18K/現行販売未確認の畠山2/従来hairpinはdraft維持。復帰時は現行購入を再調査し、本文/比較/画像/地域/sitemapの参照を一緒に更新。退役public10画像はbuild/exportで個別除外する。

011の法務/AdSense/商用ホスト点検を継承。GitHub Pagesの商用用途適合または配信先選択、AdSense実ホスト登録/所有確認、導入時Privacy/同意/CSPは未解決。今回のSEOや商品数、技術PASSで解決したと判断しない。新契約・課金・ドメイン/DNS・公開先移転は行っていない。

## 検証・納品

最新の全体結果はdocs/visual-seo-stage-*、013/validation、deployment-results.json。editorial-stageは012の履歴。pnpm verify、pnpm check:seo、pnpm readiness、日英PC/スマホの画像・導線、隔離広告6ケースを対象とする。Googleアカウントの管理画面による登録/流入検証は別途必要。

全ソースは隣接japanese-craft-jewelry-delivery/sourceとjapanese-craft-jewelry-source.zip。CI/lock/設定例/全ソース/仕様/調査/最終report/公開48画像を含む。.git/.env/認証/node_modules/dist/artifacts/無許諾の内部参照写真/退役public10画像は除外。元PNGはgenerated-originals/0.13.0へ分けて保存。最終版・ファイル集合・全ファイルSHA256は同所package-verification-0.13.0.json。ZIP自身のhashはZIP外で保管する。
