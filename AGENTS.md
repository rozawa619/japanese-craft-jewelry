# 次のAIへの開始手順

1. `README.md`、`docs/handoff.md`、`docs/constitution.md` を読み、現在の公開・申請状態を確認する。
2. `specs/001-media-launch/spec.md`、`plan.md`、`tasks.md` と最新の `specs/012-distinctive-product-selection/` で該当要件と受入条件を確認する。変更目的と影響範囲を先に記録する。
3. `src/lib/schema.ts`、`src/data/catalog.json`、`src/lib/affiliate.ts`、`src/content.config.ts` を読み、既存の分離を維持する。
4. 変更後はリスクに応じた検証を実行し、仕様・タスク・変更履歴・引継ぎを実態に合わせて更新する。公開や提携承認を推測しない。

## 必ず守る設計

- 商品、工房、販売店、都道府県、技法、素材、記事、画像権利、広告リンク、表示部品を分ける。
- 商品事実は `src/data/catalog.json`、商品本文は `src/content/products/`、ガイド・方針はそれぞれ `src/content/` に置く。価格や広告URLを複数の記事へ再入力しない。
- IDとslugは安定させる。変更する場合は移行・リダイレクトとリンク検査を含める。
- 公開商品には出典と確認日、公開の商品本文が必要。下書きや空カテゴリをナビ・サイトマップへ出さない。
- 広告切替は共通関数 `resolveRetailerLink` と共通部品を使う。商品リンクとプログラムの両方が承認済みで、programId、有効HTTPS URL、確認日があるときだけ広告化する。停止や欠落は通常URL、通常URLもなければCTAなし。
- 関係のある広告開示を最初の広告リンクの前に置く。`sponsored` と表示状態を一致させる。
- 初期版は商品写真を使わない。権利取得前に公式画像をダウンロード・転載・ホットリンクしない。抽象装飾を商品画像と誤認させない。
- `PUBLIC_` 変数はブラウザへ公開される。秘密値やトークンを入れない。環境ファイルをコミットしない。

## 禁止する捏造

未確認の商品仕様・製造地・認証・重量・低アレルギー表現、利用者レビュー、使用経験、訪問取材、資格、販売実績、提携承認、画像許諾、氏名・住所・メールを作らない。実行していないビルド、画面確認、公開、申請送信を完了と書かない。販売店の住所を工房や製造地へ流用しない。

## コマンドと検証の範囲

Node.js 24.22.1以上、pnpm 11.25.0。初回は `pnpm install --frozen-lockfile`。

- `pnpm check`：Astro型とコンテンツスキーマ、ID・参照・公開商品本文の整合性。
- `pnpm test`：広告状態、fallback、URL、公開設定、実データ参照の重要ケース。
- `pnpm build`：本番静的生成。
- `pnpm verify`：上記と生成後の内部リンク等。
- `pnpm readiness`：実URL・公開モード・運営者・広告設定の技術公開要件を検出。Contactは公開しない。提携申請条件は別途プログラムごとに確認する。
- `pnpm check:links`：外部リンク。アクセス拒否や一時的エラーを即閉鎖としない。

広告・データ変更では `pnpm verify` を実行する。UI変更はPCとスマホ、キーボード、長い名称、画像なし、フィルターの組合せ・解除・0件を確認する。公開設定変更はpreview/public両方のcanonical・OGP・robots・sitemapとサブパスを確認する。軽微な装飾のためだけの実装追従テストは増やさない。

外部の提携条件は変更されうる。調査記録を起点に公式ページと管理画面を再確認する。新規課金、本人登録、提携申請の送信は運営者の判断と必要操作として扱い、既存認証の不足を秘密情報の作成・収集で埋めない。

## 0.2以降の掲載範囲と言語

日本全国の工芸ジュエリーが対象。神奈川は現在の調査済み産地の一つで、サイト全体を神奈川専用と表現しない。かんざしは下書き。日本語本文は各Collectionのja/、数値等の共有事実はcatalog.json、日本語表示文はtranslations/ja.json。公開本文・訳文は日英を対で更新し、右上言語ボタンと現在ページ/絞込の往復を確認する。

## 0.3以降の画像
今回のユーザー依頼により、一次情報を参考にした成人女性のAI着用イラストを明示して利用できる。商品写真や試着の証拠として使わず、公式写真は無断取得/転載しない。商品実物データとeditorial画像台帳を分離し、AI表示を常時見えるcaptionに残す。

## 0.4以降の役割
ブログ/読みものは展開せず、おすすめ商品のセレクトと商品詳細へ集約する。記事sourceはdraft履歴、旧journalはnoindexの固定移動口。おすすめ順序はsrc/config/selection.ts、商品事実/広告はcatalogが正本。地域/技法/工房は商品一覧を先にする。

## 0.5以降の商品紹介
最初に商品の魅力・装い・価格・購入先を伝える。『耳に穴がある方』等の自明な条件を選定理由にしない。仕様/確認/出典は下部detailsで見つけやすく残す。product-storiesは安定productIdの表示専用で、価格/URL/未確認仕様を複製しない。

## 0.6以降の公開方針
ユーザー最新指示によりContactは非公開・導線なし。販売/決済/発送/返品の責任説明は公開UIから除く。注文機能自体は設けない。広告・AI非実物表示は維持。木/ガラス/磁器の実商品を紹介し、申請条件の未確認事項はdocs/pre-application-checklist.mdへ分離。旧Contact必須規定より006を優先する。

## 0.7以降の表示と日英導線
画像captionはユーザーの最新指示によりAIイメージ/AI imageのみ。旧003/006の長い非実物caption要件より007を優先。内部台帳はAIと実物仕様を分離したまま。モデルは30代前後、木以外も充実。rootは日英選択しやすい入口で強制転送しない。BECOSは確認済の同一SKU別市場実価格をcatalog.localizedPrices.jaへ、link.localeで通常URLと広告を別言語へ混在させない。JAprogramnullにEN承認を流用しない。価格の端数を保持する。

## 0.8以降の公式情報・訪問案内
モデルは20代後半〜30代前半を目安に。全公開商品に言語に合う公式商品/カタログ通常URLを明示し、確認済みmaker公式サイトを区別して案内。visits.jsonの店舗は公開小売店の一次確認必須で、登記住所/過去催事や個別在庫を推測しない。Mapsは固定Google originの正規search/directions外部リンクのみ。現行店未確認の商品は公式オンライン案内へ。法務確認はdocs/visit-publication-review.mdの範囲と限界を保持し、全面合法/許諾済を保証しない。広告通常リンク分離と短いAI注記、Contact非公開/SORAは維持。店舗更新はvalidate-visitsを含むverify必須。

## 0.9以降の産地セレクト
トップ/商品セレクト/産地一覧はRegionSelectionで左に産地・右に代表商品1点を表示。2025年観光庁確報表6-1の訪問率TOP10順と、順位外の佐賀/石川を区別する。ランキングの正本はresearch/tourism-top10-v9.json、表示設定はsrc/config/region-selection.ts。年度/全目的/複数回答の指標を示し、商品人気順位と混同しない。地域は非空の公開本文+商品が必要。代表商品の所属・全画像・地域クリック・queryリンクの#all-jewelry着地を検証する。
全公開30商品は28画像でカバー。モデルは27–33歳方向でかわいい系/美人系を混ぜ、ほくろ/シミを入れない。18K未登録は解消。preserveRatio画像のペンダント/リングを切らず、長い英語地名もスマホで単語途中改行させない。旧locked画像はlocalRetiredPathでGit/書出し除外、pnpm build末尾でdistから個別除外。旧写真を商品実物の証拠へ転用しない。この版の実測は009validationとdestination-stage結果、最新010は次節。

## 0.10以降の価格と言語・購入市場
日英の主価格は日本向け通販の確認済み参考価格。market-prices.tsはcanonicalのlocalizedPrices.jaまたはJPY原値から選び、USD等の海外ストア原値を換算/上書きしない。海外価格は別枠、店頭価格は未確認なら断定しない。カード/地域/hero/比較/詳細/stickyはMarketPriceを使い、対応する市場のMarketPurchaseLinkと同じURLへ。ENの国内参照/JAの海外参照は通常公式URLのみで、表示言語を理由に別リンク承認を流用しない。既存resolver不変、Disclosureは実表示market/linkIdsのみ。価格unknownは0にしない。差額をすべて送料としない。最新は010validationとmarket-stage結果。

## 0.11 法務・商品選択・購入経路の公開gate

最新は011とquality-stage。各県同数/2点以上より現行の販売根拠を優先。gallery・古い催事・企業住所だけ・明示欠品・確認不能を公開しない。purchase-evidenceは全publishedと完全一致、正しいlinkId/商品source/URLとSKU query/現行store根拠を検証。人間の本文/購入UI観測をvalidatorの自動在庫保証と呼ばない。COCOON2/浜松屋18K/畠山2は保留、hairpinもdraft。復帰は再調査必須。

42品/12地域/18公開技法/240出典、25AIで27品・公式preview15品。新規写真転載なし。note比較はpublishedの正本を参照、未知価格やサイズを埋めず、priceUnitがある片耳/一組のみ明示。ソートはunknown末尾/同額編集順、地域の種類別価格と件数は公開集合から。退役10画像は個別prune/Git除外/export除外で管理。

法務点検は免責で権利問題が消える判断ではない。GitHubPagesの商用hosting適合/AdSense実ホスト受理・接続/広告導入時Privacy・同意・CSPは未解決。SORA/Contact非公開/ブログなしを維持し、新契約・課金・ドメイン・申請を捏造しない。詳細legal/adsense/hosting-commercial-readiness/operations。

## 0.12 商品固有の紹介と候補の違い

最新は012とeditorial-stage。The Good Trade/Who What Wear/mybest等の実読記録はaffiliate-editorial-reference-v12。一般的な購買支援の構造だけを参照し、表現・レビュー・試験や人気実績を移植しない。storyは日英のheadline/standfirst/highlights3件/outfitに加えdecision.bestFor/considerが必須。実際の使い心地を作らず、その品を選ぶ好みと比較上の取捨選択を固有の言葉で説明する。

SelectionDecisionはheroの直後。ChoiceDetailsは実在の公開候補の固有見出しとchooseForを参照し、素材/サイズ/価格は正本から読む。カードのeditorialSummaryも商品ごとに更新。pnpm check:copyは011固定コピーとの差分と完全一致の重複を検査する補助で、意味の独自性や真偽を自動認定しない。新商品は011の購入gate/公式/店舗fallbackを維持し、旧キャッシュや別金具の注文受付を流用しない。価格矛盾・対象variant欠品・営業停止は採否を調査記録に残す。
