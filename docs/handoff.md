# 引継ぎ — 0.5 商品の魅力と購入導線

2026-11-16。AGENTS → constitution → specs/005-product-appeal → 本書を読む。001〜004の仕様と過去レポートは履歴として保持する。

## 最新の目的と範囲

Japanese Craft Jewelryは、全国の工芸ジュエリーから選んだ商品を英語・日本語で紹介するサイト。商品を見て惹かれ、自分の服との合わせ方を想像し、外部販売店へ進める体験を主役にする。ブログ・読みものは公開しない。運営者表示はSORA。当サイトで販売・注文受付・決済・発送は行わない。

掲載対象はピアス・イヤリング・ネックレス8点。現在の調査済み産地は神奈川・箱根。全国の商品・産地・作り手を共通データから増やせる。かんざしはdraft、空県ページなし。地域・技法は商品分類、背景は折りたたみ。

## 0.5で変えたこと

全8商品の日英コピーを、デザイン・装い・選ぶ理由を伝える内容に更新。商品詳細の上部は短い見出し、商品名、画像、価格、販売店CTAと3つのポイント。続いて選定理由と具体的なコーディネート案を置く。仕様・配送/返品・作り手/産地・出典は、下部の閉じたdetailsから確認できる。

「ピアスなので穴がある方」といった前提は推薦理由に使わない。丸山C/Dの星状/縦長バー・矢羽根状の模様は公式画像を実視して説明し、金属組成・寸法・重さ・快適性は写真から認定しない。参照サイトの観察と画像根拠はdocs/research/product-merchandising.md。

カードで作り手を特定できない場合は、実在する販売店を「取り扱い」として示す。販売店をメーカーへ仕立てず、元の不明値と説明は下部の詳細に残す。

## 編集入口

共有事実はsrc/data/catalog.json、日本語表示はtranslations/ja.json、独自本文はsrc/content/products/とproducts/ja/。トップの商品と順序はsrc/config/selection.ts。

新しい訴求データはsrc/data/product-stories.json。安定productIdごとにen/jaのheadline、standfirst、highlights3件、outfit.title/bodyを揃える。読込はsrc/lib/product-stories.tsのstoryFor。価格・仕様数値・広告URL・承認状態をここへ複製しない。紹介文は実物使用の証拠ではなく、装いは編集上の提案として書く。

浜松屋2商品のAI着用イメージは安定商品IDで登録。正規slugは両言語のobjects/hamamatsuya-surgical-stainless-pierced-earrings/とobjects/hamamatsuya-yosegi-non-pierced-earrings/。AI画像の近くに、短い場合も「AI・実物写真/正確な再現ではない」表示を常時残す。写真許諾・制作記録はassets/image-generation、画像対応はeditorial-images.json。

## CTA・広告・安全性

主CTA前のcompact Disclosureを維持する。スマホ追従CTAは有効な販売先がある場合に主CTAを通過してから表示し、フッターが見えると隠す。主/繰り返し/追従CTAは同じRetailerLinkと承認resolverを使う。主CTAが公式カタログなら、直接購入画面と誤認させない文言を使う。

現在は全リンク通常、提携未申請・未承認。広告化にはprogram/item両承認、対象merchant、確認日、有効HTTPS、許可hostが必要。停止/欠落/不正は通常fallback、通常も不正ならCTAなし。日英の開示とsponsoredを一致させる。CSP、JSON-LD安全化、Actions権限分離・SHA固定、Dependabotを維持し、外部adscriptや秘密値を追加しない。

## 検証と公開の状態

0.5ローカルの実測済み結果：型0エラー/0警告/0ヒント、42単体、56HTML・1819href/src・43アンカー・172通常/0広告・14旧移動。

ローカル81/81・54画面、最終カード6/6、広告5/5、公開81/81＋補足10/10が完了。最新配信はbe3d316、Actions43839206515 success。完了を推測しない。最終配信版はdocs/deployment-results.json、実行結果はverificationと最新reportを優先する。商品訴求を変えたことは、実売上や流入が改善した証拠ではない。実物の試着・顧客レビュー・広告承認も未実施。

リポジトリはhttps://github.com/rozawa619/japanese-craft-jewelry。正規先はhttps://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。SORA/public設定、実在GitHub Issues訂正窓口と非公開脆弱性報告を維持。未提供の氏名・住所・メールは作らない。

## 更新手順

1. 仕様005とoperationsを読み、商品事実/訴求/表示/広告の変更範囲を分ける。
2. 一次情報を確認し、catalog・訳文・商品本文・storiesを日英で更新。写真の形と性能評価を混同しない。
3. verify。UIはPC/390/320、主CTAとcompact開示、追従の初期非表示/主CTA通過後表示/フッター非表示、閉じた詳細、画像caption、同一商品の日英、絞込を実確認する。広告変更は5隔離ケースも実行。
4. push後のActionsと実URLを確認し、deployment/verification/handoff/specs005 tasksを実測に更新。全ソースとZIPを書き出す。

旧guidesの日英12sourceはdraftの履歴。旧journal14URLは固定meta refresh0/noindexの移行口で、通常ナビ・商品導線・正規sitemapへ載せない。新しいブログを作らない。

## 過去版の確認記録

0.4はhead e2870106204ca206aff6ee1bb8788e0c6544c619、Actions43834269993 success。公開81/81（日英54画面）＋補足11/11、正規40URLと14旧移動、CSP/画像/SORA/Contactを確認。当時のselection-hosted-results.jsonとselection-ad-build-results.json等は履歴として保持し、0.5の成功として読み替えない。

## 0.5の公開確定

2026-11-16 09:29 UTC、head be3d316c4e9516739d814d446709c3d1052a1e1eのActions43839206515 success。公開81/81（日英54画面）＋補足10/10、axe/JS/console0。全40正規URL、14固定移動、4details初期closed、価格/CTA優先、mobile追従条件、画像2/SORA/Contact、CSP98scriptを実確認。appeal-hosted-results.jsonにスクリーンショット3枚のSHAと確定時刻、過去7report不変を記録。全ソースとZIP/最新画像をjapanese-craft-jewelry-deliveryへ更新。後続資料コミットは配信画面を変更しない。実売上改善や試着実績は未測定。
