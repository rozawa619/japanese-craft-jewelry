# Google Flow / Veo 実践調査 — 手首・アクセサリー重複と日本語音声

調査日: 2026-11-21 / SDDへの採用判断: 実証と仮説を分ける。
対象: SORA「サイトの着用女性画像から縦9:16のPOVデート動画を作る」ワークフロー。
このドキュメントはサイトの商品 facts を変更しない。Google公式の一般的なベストプラクティスは「一個のブレスレットが絶対に維持される」保証ではない。

## 検証した一次資料と採用判断

| ID | 調査結果 | 分類 | SORAでの採用 |
| --- | --- | --- | --- |
| G1 | 画像→動画では高品質の開始画像が起点。画像がすでに人物・背景・様式を示しているので **プロンプトは主に動き**に集中し、人物/背景の詳細を重複説明しない | Google公式の推奨 | 必須：開始画像を先に静止画で検査。画像編集が必要な場合、**同じサイトの成人女性・同じ装身具**を維持した動画専用派生画像を作成し元を変更しない |
| G2 | 短尺では1シーン・単純な動きに絞る。構図/視点/動き/音を明示する | Google公式の推奨 | 必須：片腕が見える顔寄りの構図と微笑み/目線の1動作から開始 |
| G3 | Google Cloudの負例ガイドは否定の命令文（No/Don't）より、排除したい要素の名詞列を勧めている | Google公式の推奨。Cloudの説明でありFlow UIに独立したnegative欄が必ずあるとは限らない | 長い「Don't ...」連発を廃止。基本は**見せたい構図を肯定文**で書き、負例は短いキーワードへ |
| G4 | Flowでは **Video → Frames** にstart / end画像を指定でき、**Video → Ingredients** で人物・物の参照画像を追加できる。機能はモデルや地域で異なる | Google Flow公式ヘルプ | 必須：現行サイト着用画像を参照。条件が合えば（必要なときだけ）同じ人物と同じ商品を別々の参照へ。モデルごとの対応を確認する |
| G5 | Flowは生成長と縦横比をモデル設定で選択。Gemini Omni Flashで4/6/8/10秒の例がある | Google Flow公式ヘルプ | 9:16、以前の制作を踏襲し10秒が選択できれば10秒。使っているモデルで無い場合は対応長を選び、台帳へ実値を記録 |
| G6 | 音声指示は短く単純に。Google Cloudはスピーカーの後のコロンで発話させ、引用符を付けない例を推奨（画面上の文字生成を防ぐため）。別の公式Veoページには引用符の例もあるため **唯一の正解とは断言しない** | Google公式資料間で表現例が異なる | 現行の日本語は **「The woman says in natural Japanese: ねえ、見て。……」の1行**をまずA/B検証。説明用の英訳、長いローマ字列、否定文を生成プロンプトから外す |
| G7 | Flowの **Omni Flash + Ingredients** は音声参照 / custom voice を使える場合がある。Voice referenceはIngredients以外では使えない | Google Flow公式ヘルプ | 音声を再現したいときの条件付き選択肢。音声の日本語品質、特定モード/契約での可否は実際に試して判断。Veoのどのモードでも使える機能と主張しない |
| G8 | Flowのプロジェクト設定に **Return silent videos** がある | Google Flow公式ヘルプ | 日本語発音の試行が続けて失敗したら **無音生成→編集ソフトで日本語音声追加**へ切替。ただし口の動きは自動一致しないので字幕/顔の動きを合わせ、必要なら別の適切なリップシンク手段を検討 |
| G9 | Image-to-videoでは開始画像が最初のフレーム。Framesで終点も指定できるが、複雑な変化を完全には制御できない | Google Flow公式ヘルプ | 片手のみ写った **9:16動画専用開始画像** を優先。末尾の静止画は必要時に試すが、商品が両手へ増殖しない保証とはしない |

### 参照URL（2026-11-21確認）
- Google Cloud — Best practices for generating videos: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice
- Google Cloud — Video generation prompt guide（negative prompt・音声・動き）: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide
- Google Flow Help — Create videos（Frames / Ingredients / Voices）: https://support.google.com/flow/answer/16353334?hl=en
- Google Flow Help — Project settings（Return silent videos）: https://support.google.com/flow/answer/16935308?hl=en
- Google DeepMind — Veo prompt guide: https://deepmind.google/models/veo/prompt-guide/
- Google Cloud Blog — Ultimate prompting guide for Veo 3.1: https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1
- Google Blog — 5 tips for using Flow（公開時点のfeature一覧は変わりうる）: https://blog.google/innovation-and-ai/products/flow-video-tips/

## このエピソード固有の観測・仮説

- **観測（動画/ユーザー）**：前のブレスレット動画で、両手首に同じブレスレットが生成された。ユーザーは再修正版(v3)でも両手首に出たと報告。音声が「ブレスレ」に聞こえる、標準日本語らしくないとの報告もあり。
- **サイト台帳の事実**：人物開始画像は `public/images/styling-jp-dahliacyan-openwork-rhodochrosite-bracelet-v26.webp`、**1536×1024（横長3:2）**、目標は**縦9:16**。
- **仮説A（未実証）**：横長を縦長に再構図する際、手やアクセサリーの映像補完が発生し、不必要な手首/装身具が増える可能性。
- **仮説B（未実証）**：複数の手首動作や「ブレスレット」への繰り返し注目が、重複へ寄与した可能性。
- **仮説C（未実証）**：長いローマ字読みや説明文、長尺セリフが日本語音声生成の品質へ影響した可能性。
- これらはGoogle公式が「必ず重複する原因」と述べたものではない。**推測として小さく検証すること**。

## 制作ゲート（SORAの運用設計）

1. **商品/女性一致**：公開商品ID・サイト人物画像パスを確認。公式画像の無許可使用はしない。
2. **静止画プリフライト**：元画像を目視し、顔・アクセサリーがある片手首・余分な手首がどう写るか確認。横長3:2→縦9:16の見切れを事前チェック。元画像は変更しない。必要なら動画専用の派生開始画像を別ファイルにし、同じ顔・服・装飾・片手首を保つ（生成・修正後に目視）。**無理なクロップで主商品を消さない**。
3. **A/Bテストは一度に1変数**：A=元画像 + 短い動きのみ、B=縦9:16の片手首開始画像 + 同じ短い動き。音声は同じ短い1行で比較。複数の変更を同時に混ぜた場合は個別の有効性を断言しない。
4. **動き最小限**：両腕/手首を上げず、ブレスレット着用の片腕は体の近くに静止。表情・軽い目線移動だけ。カメラほぼ固定。
5. **レビュー**：冒頭・中間・終端に加え全尺で手首の数、装身具の数、顔の一貫性、セリフと口の動きを確認。1個以外になったら不合格。
6. **切替条件（運用ルール）**：同種の腕複製が2回続いたら、禁止文をさらに足すのでなく開始画像/構図を改める。音声の品質不良が2回続いたら短文1行の再テスト、それでも悪ければ無音生成＋別録りへ。
7. **記録**：モデル、選択尺、開始画像ファイル、音声方式、promptVersion、検査結果と次の一手、実在する成果物URLを `production-status.json` と対象episodeに記載。実際にやっていないテストは結果を作らない。

## 参照画像の使い分け

- **原本**：サイトと同一性を結ぶ正式参照（現行 `editorial-images.json` を常に根拠にする）。
- **動画専用派生**（まだ未作成）：元の女性・装飾を維持し、片手首が自然に見える9:16の開始静止画。元画像とは別ID/別ファイルで管理。
- **商品単体の画像参照**：現行サイトの `product-detail-images.json` にあるAI商品画像。追加する場合は同じ商品IDで照合。新規商品の仮写真や未許可の公式画像を混ぜない。
- **音声参照**：モデルとUIが対応する場合だけ。追加によって画像の品質が上がるとの保証はない。

## 次に検証すること

鎌倉Dahliacyanブレスレット編は、v3の「他方の手を出さない」という文面だけでは改善しなかった（ユーザー報告）。次は**同一女性で片腕だけが写る縦9:16開始画像の設計/確認**を最優先とし、最小動作のv4を使う。追加生成を実施する前に開始画像が完成・検証されたかを台帳へ記録する。
