# Google Flow プロンプト標準テンプレート — SORA v2.0（画像優先）

更新: 2026-11-21。[制作仕様 v1.2](spec.md)と[Google公式調査](research/flow-veo-prompting-2026-11-21.md)を先に読む。

**重要**：以前の長文テンプレートで重複した手首が防げなかったため、開始画像を検査して**短い1シーン/1動作**の指示に変更。Google公式は画像→動画で「画像が示す人物/風景を再説明せず動きに集中」を推奨する。「No / Don't」の長い否定命令も排除。これらは再現性の改善を狙う運用仮説で、重複ゼロを保証するものではない。

## 0. 開始画像を確認する（必須）

- `src/data/catalog.json` の公開商品ID・`src/data/editorial-images.json` の該当人物画像を参照する。
- 顔、装身具の個数、装着側、見える腕をチェック。サイト画像が横3:2等なら、縦9:16で商品が見えるか確認する。
- 姿勢/構図が不向きなら、**同じ女性・同じ服・同じ商品**を保持する動画用9:16派生開始画像を別名で作成・目視採用する。元の公開画像は上書きしない。
- ブレスレット編では、**片方の手首だけが写り、アクセサリーは1個**という静止画を作ってからFlowへ。未生成の派生画像を「完成した」と書かない。

## A. 通常版（音声あり・1動作）

- Google Flow: Video → Frames のstart frameを指定。9:16、10秒を選べるモデルなら10秒。
- `[...]` 部だけ置換する。モデルに応じて使用可能な尺へ調整。
- **画像内の商品と顔の同一性が優先**。

```text
Image-to-video from the supplied start frame, vertical 9:16, 10 seconds if supported.
One continuous boyfriend-POV shot in [LOCATION], Japan.

Keep the woman and [ACCESSORY] exactly as shown in the start frame.
[POSITIVE COMPOSITION: for a bracelet, a close portrait with the single bracelet-wearing wrist visible near her torso and her other arm outside the composition.]

Motion: [ONE SMALL ACTION: she turns her eyes toward the camera and smiles; her bracelet wrist stays relaxed and still].
Camera: locked-off, natural eye level. Soft ambient sound.

The woman speaks in natural, conversational standard Japanese:
[ONE SHORT JAPANESE SENTENCE IN HIRAGANA AS NEEDED]

Avoid: duplicated jewelry, extra limbs, distorted hands, captions, logos, jump cuts.
```

**発話テスト**：Google Cloudのガイドでは `The woman says: 発話` 形式（引用符なし）を紹介。DeepMindでは引用符ありの例もある。字幕が混入する/発音が変なら引用符の有無を単独変数として試す。生成プロンプトに訳・ローマ字・Meaningの解説を入れず、辞書的な読みは episode の人間向け欄に記録。

## B. 無音版（発音失敗を切り分ける）

Google Flowの **project Settings → Return silent videos** をON（公式ヘルプで確認）。映像だけを生成し、CapCut等の編集ソフトで自然な日本語音声を合成する。**口パクの同期は別工程**であり、無音のモデルの口の動きを自動で直したとはみなさない。

```text
Image-to-video from the supplied start frame, vertical 9:16.
One continuous boyfriend-POV shot in [LOCATION], Japan.
Keep the woman and [ACCESSORY] exactly as shown in the start frame.
[POSITIVE COMPOSITION]
Motion: she looks at the camera and smiles softly. Her hands remain still.
Camera: locked-off, natural eye level.
A quiet, natural smiling reaction, designed for a later Japanese voice-over.
Avoid: duplicated jewelry, extra limbs, distorted hands, captions, logos, jump cuts.
```

## C. 失敗時の順番

1. **先に静止画を修正**：手首・商品が片側で、9:16に収まるか
2. 同じ短いpromptで1クリップ生成（画像/モデル/尺を台帳へ記録）
3. 商品が複製された場合は長い禁止文を追加せず、構図と動きを変更
4. 発音だけ悪い場合は短い1行と話者形式をテスト→改善しなければ無音版+後録り
5. 成功/失敗を `production-status.json` とepisodeへ記録し、動画保存先と投稿URLを別々に管理

## 投稿文（Flowとは別）

TikTokキャプションは「問いかけ → 地域・商品 → 視聴者への質問 → AI注記 → 少数ハッシュタグ」。商品の事実と現行URLはサイトの台帳から確認。字幕・BGMは編集段階で追加する。
