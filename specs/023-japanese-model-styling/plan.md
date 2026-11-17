# 設計と実装範囲

## 監査を置換集合の正本にする

既存の`src/data/editorial-images.json`とasset台帳・過去の生成記録を突き合わせる。prompt/構造化model設定にある明示的なJapanese/American/British等を根拠とし、画像ピクセルから国籍を判断しない。監査の基準は22置換/36保持/不明0、現行60公開商品/58unique人物画像。新22画像を生成/採用して同じ22商品参照へ切り替え、ローカルの最終集合は新22＋保持36人物＋単体60で118公開画像と照合した。

監査成果は`docs/japanese-models-stage-audit.json`と同名Markdownへ分離する。旧段階の「全画像不変」検査を無条件で緩めず、監査済みの置換assetId/pathだけを明示した例外集合にする。

## 新規生成と採用

生成設定は架空の日本人成人女性25〜33歳。25歳を含め、かわいらしく華やかなタイプと落ち着いた綺麗なタイプ、髪型/表情/服装に変化を付ける。ジュエリーの装着位置や見せたい形を先に決め、顔と装身具が隠れず、手・髪や不要な別アクセサリーで判別が難しくならない構図を使う。既存のlandscape3:2に合わせ、自然高/containで使用する。

built-in image_genを使い、既存画像を編集する場合は事前に対象を表示して確認する。参照の役割を明示し、保持するジュエリーの特徴と変える人物設定を区別する。公式写真を無断で生成入力へ転用しない。採用前に目視し、顔や耳/装身具の欠け、不自然な装着/手や金具、商品紹介との大きな不整合を棄却理由として残す。生成設定は実在人物の属性認定ではない。

新logは`docs/image-generation-japanese-v23.json`。prompt、生成日時/ツール、架空のmodel設定、入力の由来/役割、元PNG、採用/棄却、寸法/bytes/SHA、WebP変換・AI metadata、目視確認を記録する。新WebPは`styling-jp-<productId>-v23.webp`、元PNGは納品先の`generated-originals/0.18.0/`へ保存。形式変換は既存の`prepare-styling-image.mjs`等を使い、意味を変える修正はimage_genで行う。元PNGを上書きしない。

## 参照切替と旧画像

`editorial-images.json`のassetId/path/width/height/日英altと、`docs/assets.json`のactive/retired・生成manifestを揃える。共有画像は関連する全productIdの参照を切り替える。旧assetをretiredへ移し、既存のretired配信除去/ZIP除外方針と整合させる。旧bytes・生成ログ・原本の履歴を消さず、旧assetのactive参照と直接配信が残らないことを確認する。

単体60画像と既存の日本人設定36人物画像は変更しない。商品/価格/出典・購入先/店舗、地図とHeroの動作、広告/Maps設定、依存関係や公開先は維持する。

## 検証と公開

1. 監査集合と生成/採用集合を照合し、全active人物に日本人女性の明示的な生成設定があるか確認する。これはprompt監査であり、画像からの国籍/年齢/魅力度推定ではない。
2. 全公開商品の画像参照・asset/manifest/AI metadata・日英alt/AIcaption・寸法/SHA、旧画像retired/非配信/ZIP除外を検査する。
3. 保持36人物/単体60/商品正本のSHAを旧版と比較する。新旧人物bytes同一を要求する旧gateは、明示対象を除外して根拠を残す。
4. 安定buildでHero全24県の画像/商品/価格/言語/query、Top10/DISCOVER、商品詳細、日英/スマホ/自然比率・余白・focus/リンクを確認。browser中に共有distをbuildしない。
5. 型/単体/build・Source/SEO・広告off等の必要な検査、Git/Actions/実URLを確認し、全source ZIPと元PNG/外部proofの集合/全SHAを確定する。

新規22画像の生成/個別目視採用、設定監査63、画像59/単体61、保全9、型150ファイル/単体149・344HTMLのローカル結果を確認した。新規設定は25〜30歳（25歳6枚）、かわいい系11/綺麗な系統11で、25〜33歳の成人設定要件を満たす。各検査の対象とbrowser結果は[validation](validation.md)へ分離する。公開app/Actions・実URL・ZIPは後続段階であり、ローカル成功を公開/納品へ読み替えない。

## 画像だけを変えたことの独立した保全

`scripts/check-japanese-model-preservation.mjs`は旧495 app inputs/監査/旧build manifestをpinし、packageのversionだけと`src/data/editorial-images.json`の22対象の参照切替を許可する。他493 inputs・保持画像・単体・旧22ローカルbytesはSHA一致、追加app inputsは新22 WebPだけ、distは旧22out/新22inで118画像、`_astro`4件は名前/全SHA一致、HTML344 routeは同じと確認した。HTML本文のbytesは画像/alt/metadataの更新に伴い変わるため同一を主張しない。

この一回の保全監査は旧retired WebPが残るreviewed checkoutで再現する。source ZIPから旧retired画像を省く方針と矛盾せず、fresh clone/ZIPの通常build依存へは加えない。出力先は`CHECK_REPORT_PATH`/`CHECK_BUILD_MANIFEST_PATH`でrepo内docs/artifacts配下のJSONへ変更できる。既定は`docs/japanese-models-stage-preservation-results.json`と`docs/japanese-models-stage-build-manifest.json`。
