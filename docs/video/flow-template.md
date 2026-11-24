# Google Flow プロンプト標準テンプレート — SORA v2.4（サイト掲載原本優先）

2026-11-25更新。[制作仕様 v1.13](spec.md)、[新チャット引継ぎ](NEW_CHAT_HANDOFF.md)と[Google公式調査](research/flow-veo-prompting-2026-11-21.md)を先に読む。

**重要**：以前の長文テンプレートで重複した手首が防げなかったため、開始画像を検査して**短い1シーン/1動作**の指示に変更。Google公式は画像→動画で「画像が示す人物/風景を再説明せず動きに集中」を推奨する。「No / Don't」の長い否定命令も排除。これらは再現性の改善を狙う運用仮説で、重複ゼロを保証するものではない。

## 0. 開始画像と縦構図を確認する（必須）

- `src/data/catalog.json` の公開商品ID・`src/data/editorial-images.json` の該当人物画像を参照する。
- 新作選定前に元画像の9:16相当の中央範囲を見て、両目・口元・装身具全体に余白があるか確認する。収まる未使用候補を優先する。人物が片側に寄る原本では、人物側に縦枠を寄せた場合も確認し、episodeに収まりを記録する。装身具の個数、装着側、見える腕と、頬・口元・あごのほくろや濃い点も見る。
- FramesはFlowの実際の開始プレビューで両目・口元・装身具が余白付きで収まる場合に使う。見切れがある場合や確認できない場合は、対応モデルのIngredientsに同じ元画像を1枚指定する。指示文の前に想定モードを書く。 [冒頭の見切れを防ぐ手順](spec.md#冒頭の見切れを防ぐ手順)
- **ユーザーの明示した編集依頼がない限り、サイト掲載の女性原本画像をそのまま使う。** 9:16派生開始画像を勝手に作らない。画像の加工を明示依頼された時だけ、元画像と同じ顔・服・商品を保持する別ファイルとして作り、目視照合する。元の公開画像は上書きしない。
- ブレスレット編では、**片腕に1個、反対側に複製を作らない、手を動かさない**指示を優先する。ユーザーから加工依頼がなければ静止画再生成を行わず、元画像の見え方から構図を検討する。

## A. 通常版（音声あり・1動作）

- 縦9:16、10秒を選べるモデルなら10秒。使用モードは上の手順で選ぶ。
- `[...]` を置換する。Framesなら `first frame`、Ingredientsなら `sole visual reference` を指定する。モデルに応じて尺を調整する。
- **画像内の商品と顔の同一性が優先**。

```text
Use the supplied site image as the [first frame / sole visual reference], vertical 9:16, 10 seconds if supported.
One continuous boyfriend-POV shot in [LOCATION], Japan.

From 0.0 seconds, she is already in position. Show both eyes, her whole mouth and all of [ACCESSORY] with clear margins. Hold this framing throughout.
Keep her original facial features, hair, clothing and [ACCESSORY] as shown.
Soft, even light preserves her natural skin tone and fine texture. Both cheeks, the skin around her mouth and her chin stay free of visible moles and isolated dark spots throughout.
[POSITIVE COMPOSITION: for a bracelet, a close portrait with the single bracelet-wearing wrist visible near her torso and her other arm outside the composition.]

Motion: [ONE SMALL ACTION: she meets the viewer's gaze with a small, warm smile. Her bracelet wrist stays relaxed and still].
Camera: locked-off, natural eye level. Soft ambient sound.

The woman speaks in natural, conversational standard Japanese:
[ONE SHORT JAPANESE SENTENCE IN HIRAGANA AS NEEDED]

Avoid: heavy skin smoothing, duplicated jewelry, extra limbs, distorted hands, captions, logos, jump cuts.
```

**発話テスト**：Google Cloudのガイドでは `The woman says: 発話` 形式（引用符なし）を紹介。DeepMindでは引用符ありの例もある。字幕が混入する/発音が変なら引用符の有無を単独変数として試す。生成プロンプトに訳・ローマ字・Meaningの解説を入れず、辞書的な読みは episode の人間向け欄に記録。

## B. 無音版（発音失敗を切り分ける）

Google Flowの **project Settings → Return silent videos** をON（公式ヘルプで確認）。映像だけを生成し、CapCut等の編集ソフトで自然な日本語音声を合成する。**口パクの同期は別工程**であり、無音のモデルの口の動きを自動で直したとはみなさない。

```text
Use the supplied site image as the [first frame / sole visual reference], vertical 9:16.
One continuous boyfriend-POV shot in [LOCATION], Japan.
From 0.0 seconds, she is already in position. Show both eyes, her whole mouth and all of [ACCESSORY] with clear margins. Hold this framing throughout.
Keep her original facial features, hair, clothing and [ACCESSORY] as shown.
Soft, even light preserves her natural skin tone and fine texture. Both cheeks, the skin around her mouth and her chin stay free of visible moles and isolated dark spots throughout.
[POSITIVE COMPOSITION]
Motion: she meets the viewer's gaze with a small, warm smile. Her hands remain still.
Camera: locked-off, natural eye level.
A quiet, natural smiling reaction, designed for a later Japanese voice-over.
Avoid: heavy skin smoothing, duplicated jewelry, extra limbs, distorted hands, captions, logos, jump cuts.
```

## C. 失敗時の順番

1. 元画像の見える範囲を確認し、上の手順で使用モードを決める
2. 公開商品ID・サイト女性画像IDをTikTok台帳と照合し、短い指示文で1クリップ生成する。画像・モード・モデル・尺を記録する
3. **0秒・0.5秒・1秒で両目・口元・装身具を確認する。** 顔が見える後半も元画像と照合する。冒頭の見切れ、ほくろや濃い点のいずれかがあれば `revision_needed` とし、縦の開始画角とモードを見直す
4. 商品が複製された場合は構図と動きを変更する
5. 発音だけ悪い場合は短い1行と話者形式をテストし、改善しなければ無音版と後録りに切り替える
6. 結果を `production-status.json` とepisodeに記録する。動画保存先と投稿URLも記録する

## 投稿文（Flowとは別）

TikTokキャプションは「問いかけ → 地域・商品 → 視聴者への質問 → AI注記 → 少数ハッシュタグ」。商品の事実と現行URLはサイトの台帳から確認。字幕・BGMは編集段階で追加する。
