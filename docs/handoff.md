# 引継ぎ — 0.6 素材から楽しむ工芸ジュエリー

更新日：2026-11-16。開始時は AGENTS.md → docs/constitution.md → specs/006-clear-craft-selection/ → 本書 → docs/operations.md を読む。006が今回の変更仕様で、001〜005と過去の検証レポートは履歴として扱う。お問い合わせの非公開は今回の明示依頼が旧要件に優先する。

## 現在の目的と実装

Japanese Craft Jewelryは、日本各地の工芸ジュエリーを英語・日本語で選んで紹介するセレクトサイト。運営者表示はSORA。商品にひかれ、服との合わせ方を想像できる紹介を主役にする。ブログ・読みもの・当サイトでの販売機能は展開しない。

公開商品は10点（既存の寄木8点＋凛然の切子ピアス＋6.KILNの白磁イヤリング）。神奈川・東京・佐賀の3都県、箱根寄木細工・切子・伊万里／有田焼の3技法。かんざしはdraftを維持し、空地域・空技法を公開しない。工房との関係や商品欄の産地を、部品すべての製造地や個別認証へ読み替えない。

トップの代表は凛然のアンバーガラス。おすすめはガラス・磁器と木工4点の計6点で、選定順序はsrc/config/selection.tsに分離している。種類に加え、木・ガラス・陶磁器の実商品へ絞り込める。商品紹介の先頭は魅力の見出し、画像、価格、公式リンク、訴求3点。素材・寸法・工芸の背景・出典は下部の閉じたdetailsに残す。

方針は日英とも平易な短文へ更新した。Contactは本文をdraft履歴として残し、生成ページ・ナビ・フッター・sitemapから除外。メールやGitHub Issuesを代わりの窓口として出さない。公開UIから販売・決済・発送の責任を繰り返す説明を外した。広告状態とAI画像の開示は維持する。

## 正本と編集先

| 情報 | 正本／入口 |
| --- | --- |
| 仕様・設計・タスク | specs/006-clear-craft-selection/ |
| 商品事実・分類・工房・販売店・広告 | src/data/catalog.json |
| 日本語表示 | src/data/translations/ja.json |
| 独自の商品本文 | src/content/products/ と products/ja/ |
| 見出し・導入・訴求3点・服の提案 | src/data/product-stories.json、読込はsrc/lib/product-stories.ts |
| 一次資料・実確認日・支える事実 | docs/research/sources.json |
| ガラス・磁器の調査と取込記録 | docs/research/material-expansion.json。取込後は表示用の正本にしない |
| 画像の対応と公開ファイル | src/data/editorial-images.json、public/images/ |
| 画像の用途・権利・未許諾写真 | docs/assets.json |
| 生成の記録 | docs/image-generation.json、docs/image-generation-v6.json |

価格・数値・広告URL・承認状態をstoryや商品本文へ複製しない。事実を訳文だけで補わない。新しい日英商品にはheadline、standfirst、highlights3件、outfit.title/bodyを揃える。未使用の商品に試着レビュー、軽さ・快適性・肌への適合を作らない。公式写真を見て分かる形と色を、材質組成・寸法・金具の認定へ広げない。

## AI画像7点と保存上の注意

既存2点に、外見・年齢・服装の異なる架空の成人日本人女性5タイプを追加した。追加分は、非対称ボブとチャコール服、まとめ髪とコーラル服、ピクシーヘアとオリーブ服、白髪まじりボブと藍色服、編んだ髪と生成り服。制作時の指定はimage-generation-v6.jsonに残している。

公開ファイルは次の7点。すべてpublic/images/にあり、ソース納品に含める。

- hakone-yosegi-pierced-styling.webp
- hakone-yosegi-clipon-styling.webp
- rinzen-amber-glass-styling-v1.webp
- arita-halfmoon-styling-v1.webp
- yosegi-star-styling-v1.webp
- yosegi-bar-mature-styling-v1.webp
- yosegi-pendant-styling-v1.webp

registryは9商品に対応するが、星形は丸山Cのピアス／イヤリング、縦長は丸山Dのピアス／イヤリングで同じ画像を共有するため、画像の実数は7点。未登録の18K商品は抽象装飾を使う。画像は実物写真や正確な商品再現、装着方法・寸法・金具・着用感の証拠ではない。

7ファイルを落とさず、変更時は画像・registryのpath/assetId/寸法/日英alt・assets台帳・生成記録を一緒に更新する。実物写真用のcatalog.imageAssetIdsへAI画像を混ぜない。画面上のAI／非実物captionをdetails内だけに隠さない。内部視認した公式写真やそのスクリーンショットをpublic・ソース納品へ移さない。公式写真は許諾を得て台帳へ記録するまで、転載・ホットリンクしない。

## 提携と公開設定

全プログラムはnot_applied。申請・契約・承認・紹介料の発生はない。新しいBECOS2商品にも通常URLを使い、広告URLと確認日は未設定。programIdの候補関係があっても広告対象や承認を意味しない。

広告化はprogramと商品別リンクの両承認、対象merchant、有効HTTPSの広告URL、完全一致の許可host、確認日が揃う場合だけ。主CTA・繰り返し・スマホ追従は同じRetailerLinkとresolverを使う。停止／不正／欠落は通常URLへ戻し、通常も不正ならCTAなし。最初の広告リンクより前の開示とsponsoredを日英で合わせる。CSP、JSON-LD安全化、Actions権限分離・SHA固定を維持する。

pnpm readinessは実URL・public設定・運営名・データの技術検査で、Contact不在をエラーにしない。申請条件の最終確認はdocs/pre-application-checklist.mdとdocs/affiliate-readiness.mdを参照する。申請先が実在の窓口や本人情報を求める場合は運営者が規約を確認して判断する。未提供の氏名・メール・住所を作らず、認証・個人・支払情報をGitへ保存しない。

リポジトリ：https://github.com/rozawa619/japanese-craft-jewelry

正規公開先：https://rozawa619.github.io/japanese-craft-jewelry/en/ と /ja/。同じ商品slugと右上の単一言語ボタン、一覧のquery/hash往復を維持する。既存の浜松屋slugや旧journal14件の固定noindex移行口を理由なく変えない。

## 0.6の検証・配信を確認する

この文書は新たな検証件数や配信成功を確定しない。実行対象のcommit、時刻、環境、versionが今回のものかを次の記録で照合する。

- specs/006-clear-craft-selection/validation.md：要件と最終の実測結果。
- docs/clear-stage-browser-results.json：日英・PC／スマホ・画像・Contact非公開・絞込等。
- docs/clear-stage-ad-build-results.json：隔離した広告切替。
- docs/verification.md：検証の説明。過去版の節はその版の履歴。
- docs/deployment-results.json：実際に配信したhead、Actionsと公開URL。versionが0.5なら0.6の公開証拠に使わない。

未作成の記録、未実行、未反映はそのまま残す。ソースが完成したことと、公開URLへの反映、検索掲載、申請送信・承認、クリックや売上は別に扱う。

## 次回の更新手順

1. 006とoperationsを読み、変更範囲を仕様／タスクに記録する。
2. 一次資料を再確認してsourcesとcatalogを更新し、訳文・日英本文・story・分類を揃える。確認した項目だけ日付を更新する。
3. 画像を変えるなら7点の保存とregistry／台帳／生成記録を照合する。
4. verify、readiness、必要なbrowser／ads／linksを実行。PC1440・390・320、価格／CTA／開示、閉じた詳細、追従の条件、画像caption、同一商品の日英、素材の実絞込、Contact404を確認する。
5. 配信した場合はActionsのheadと公開URLを確認して最新の実測記録を更新する。006のtasksと引継ぎを合わせ、全ソース・7画像・証跡・ZIPを納品する。

## 履歴 — 0.5以前

0.5は既存8商品の魅力と装いを先にする構成、日英2点のAI着用イメージを実装した版。2026-11-16 09:29 UTC、head be3d316c4e9516739d814d446709c3d1052a1e1e、Actions43839206515 successの公開記録がある。詳細はdocs/appeal-hosted-results.jsonと当時の検証記録を参照。Contactを表示していた当時の画面・件数・成功を、Contactなし／10商品／7画像の0.6へ読み替えない。

0.4以前のselection-*.json、さらに古いbrowser/ad-build等のレポートも履歴として保持する。古いITO名、旧リポジトリURL、神奈川のみ、Contact必須等の記載を、現在の公開仕様へ戻す根拠にしない。
