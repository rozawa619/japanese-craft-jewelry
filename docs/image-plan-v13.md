# v0.13 全商品画像の生成計画・一次参照記録

確認日：2026-11-17（日本時間）。この文書と[生成brief JSON](research/image-briefs-v13.json)は、v0.12時点で画像がない公開23商品を対象とする。着手時は50公開商品、25既存画像が27商品をカバーしていた。最新の全商品画像追加という依頼を優先し、旧版の「新規画像なし」を今回の23件に適用しない。

## 目的と分担

各商品の素材・輪郭を一次情報から確かめ、27〜33歳の完全に架空の成人女性による、上質で親しみやすいAIファッションイメージを1商品1枚用意する。商品の正確な写真、実際の試着、着用者の感想、寸法や着け心地の証拠にはしない。公開captionは既定の「AIイメージ / AI image」を維持する。

この計画の担当は参照調査とprompt作成まで。生成、出力の目視、WebP化、image-registry・画像権利台帳への登録、公開画面の確認は統合担当が行う。ここに23個のfilenameがあることだけで、23画像が生成・採用・公開済みとは判断しない。実際にツールへ渡したpromptは `artifacts/imagegen-v13-batch-*.json` 等の実行記録と照合する。HARIOの先行生成は統合担当独自promptであり、この計画の文面と完全一致するとは限らない。

## 一次情報と画像の扱い

- 商品事実の正本は `src/data/catalog.json`。出典は各entryの `officialUrl` と `sourceIds` に結ぶ。価格・仕様・購入状態をこの計画からruntimeへ逆流させない。
- 公式の商品本文と公式ページが公開する写真を可能な範囲で閲覧した。今回、22/23件で写真を実際に見た。本文の閲覧、alt、写真の実見を `referenceRead` で区別する。
- 公式画像ファイルそのものを保存・生成入力・公開画像・ZIP同梱に使わない。閲覧中の内部確認スクリーンショットと抽出本文は `artifacts/reference-v13-*` などに限り、公開・Git・配布対象にしない。写真許諾を取得したという意味ではない。
- 商品名から輪郭を推測しない。ToyToy木は無垢面の彫りで透かし穴ではなく、ToyToy銀は商品名に「滴」があっても滴形の外枠ではなかった。Ayaは有機的曲線ではなく格子、SIMPRICH指輪は1粒大石でなく1面4粒。これらは実見後に修正した。
- 固有の商標図案、作家の精密な絵柄、実在人物の顔・ポーズ・背景のコピーを避け、独立した構図と控えめな素材表現にする。生成画像から金属組成、医療的な適合、認証、使用経験を導かない。

写真実見の限界：`nanao-shuka-nebula-16g-earrings`。アクセス拒否・画像配信の接続失敗等を商品閉鎖や欠品と解釈しない。これらは確認済み本文にある形・色・素材の概念像だけに限定し、精密な模様・部品配置は表現しない。

## 人物・構図

新規23人はJapanese7、American8、British8、cute11、elegant12。国籍は架空人物の背景設定であり、外見から国籍を判定した記録ではない。各国に多様な肌・髪・顔立ちを配し、同じ人種を国籍の固定記号にしない。かわいい/上品は服装・表情の方向性として扱う。ほくろ・シミ・そばかすは入れず、成人らしい自然な肌の質感を保つ。実在人物・有名人・未成年を模さない。

横3:2、1536×1024相当。主役は少し右寄り、中央/正方形cropでも顔と対象ジュエリーが残る余白を取る。耳飾りは顔と見える耳を3/4近景、ネックレスは顔から首胸元、bracelet/bangleは顔と自然な手首、ringは顔と自然な手を同時に収める。耳飾りを髪に隠さず、手・指・装身具を切らない。無関係なアクセサリー、ロゴ、読める文字、透かし、コラージュを足さない。

| productId | 架空の人物設定 | 視覚上の要点・画角 | 参照状態 |
|---|---|---|---|
| `sangetsu-irodori-tombodama-earrings` | American / 28 / cute | 耳 / 暗赤の小とんぼ玉、細い銀色フック | 公式写真を実見 |
| `sangetsu-irodori-tombodama-necklace` | British / 31 / elegant | 首胸元 / 暗赤の一玉、黒い細紐 | 公式写真を実見 |
| `sghr-tie-tie-glass-earrings` | Japanese / 30 / elegant | 耳 / 透明の細い結びネクタイ形ガラス | 公式写真を実見 |
| `sghr-kolmio-glass-ear-cuff` | American / 32 / elegant | 耳 / 淡い青灰の丸三角、下中央に隙間 | 公式写真を実見 |
| `kazarino-hanabishi-copper-earrings` | British / 29 / cute | 耳 / 銅色の花菱透かし、55×28mm | 公式写真を実見 |
| `kazarino-shippo-pattern-brass-bangle` | Japanese / 32 / elegant | 顔＋手首 / 幅24mm真鍮、七宝の彫り模様 | 公式写真を実見 |
| `showen-edo-uchi-silk-bracelet` | American / 27 / cute | 顔＋手首 / 青中心の細かな多色編み、二重巻き、小田巻 | 公式写真を実見 |
| `iwaya-urushi-9mm-hook-earrings` | British / 31 / elegant | 耳 / 赤の漆玉9mm、細い銀色フック | 公式写真を実見 |
| `toytoy-ninkari-nikuri-earrings` | Japanese / 28 / cute | 耳 / 菱形の木面と淡色の彫り線、透かし穴にしない | 公式写真を実見 |
| `toytoy-sirokani-pe-silver-necklace` | American / 30 / elegant | 首胸元 / 銀色の対称カール、滴形の外枠にしない | 公式写真を実見 |
| `tamura-kaisai-enamel-ear-jewelry` | British / 33 / elegant | 耳 / 淡青の丸みある不整四角、紺碧の波、黄丸、銀線 | 公式写真を実見 |
| `nanao-shuka-nebula-16g-earrings` | Japanese / 27 / cute | 耳 / ごく小さい丸ガラス、緑紫赤の内部きらめき | 本文に限定・写真の実見未了 |
| `simprich-reversible-topaz-ruby-chain-ring` | American / 31 / elegant | 顔＋自然な手 / 細鎖、5mmの四角面に白石4粒、裏面は隠す | 公式写真を実見 |
| `simprich-reversible-silver-piaring-single` | British / 32 / elegant | 片耳 / 金銀の細長い卵形、上細・下やや太 | 公式写真を実見 |
| `hario-little-tears-clip-on-earrings` | Japanese / 28 / cute | 耳 / 複数の細鎖先端に小さい透明しずく | 公式写真を実見 |
| `nousaku-dahlia-gerbera-clip-on-earrings` | American / 29 / cute | 耳 / 銀白色の小花9mm、密な花弁 | 公式写真を実見 |
| `nousaku-aya-tin-pendant` | British / 33 / elegant | 首胸元 / 斜めの四角50mm、直線帯の格子と長方形の抜き | 公式写真を実見 |
| `coyorimi-tamamusubi-clip-on-earrings` | Japanese / 27 / cute | 耳 / 白金＋黒の小水引玉2個、金色の細い曲線 | 公式写真を実見 |
| `somemasa-peacock-clip-on-earrings` | American / 30 / elegant | 耳 / 緑の丸トップ、左右で異なる青緑の孔雀柄布 | 公式写真を実見 |
| `egaho-gathered-kurume-kasuri-ear-jewelry` | British / 28 / cute | 耳 / 紺白の布小花＋淡い丸模様ビーズ | 公式写真を実見 |
| `sirisiri-page-blue-enamel-pierced-earrings` | Japanese / 31 / elegant | 耳 / 淡青の角丸四角、片隅のめくれ、繊細な面模様 | 公式写真を実見 |
| `sirisiri-silver-thread-hoop-mini` | American / 29 / cute | 耳 / 小ループを連ねたレース状の銀糸フープ | 公式写真を実見 |
| `mie-akoya-oh002-stud-earrings` | British / 30 / cute | 耳 / 白ピンクの一粒真珠7–7.5mm | 公式写真を実見 |

## 統合時の受入確認

1. JSONの23 IDが公開商品に存在し、各filenameが一意で、sourceIdsが出典台帳に存在する。
2. 1商品に1枚の新規画像を対応させ、出力が既存公式写真・実在人物・商標の複製になっていないか見る。変形した耳、余分な指、鎖/留具の不自然な位置、過大な宝石、左右同一化した非対称商品は採用しない。
3. 首飾り・手首・指輪まで含め、heroとカードの実際のcropで装身具が残るかPC/スマホ両方で確認する。
4. image-registry、catalogの参照、画像権利台帳、常時captionを一致させる。外観はAIイメージであり、出典や実物データを置き換えない。
5. 日本語・英語altは装身具の種類とAIイメージの文脈を簡潔に記す。架空国籍をSEOキーワードにしたり、見た目から国籍を断定するaltにしない。
6. 適用後の `pnpm verify`、本番ビルド、公開50商品の画像欠け検査、内部リンク、公開用ZIPに参照スクリーンショットが入らないことを統合担当が確認する。

## 再生成・更新

`officialUrl` の本文を開き、素材・色・販売variant・大きさを正本と照合してから `referenceRead` と `checkedDateJapan` を更新する。未知の裏側、留め具、肌への影響を補完しない。写真が見えなかった場合は実見済みにしない。モデル背景や服装だけを変える場合も、商品輪郭と素材のbriefは維持する。生成ツールに渡した最終prompt、tool出力、採用/不採用、変換先を実際の記録に残す。画像URL・写真許諾・購入可能性を推測で増やさない。
