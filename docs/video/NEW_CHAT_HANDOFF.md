# SORA｜旅先で待ち合わせ — 新チャットへの完全引継ぎ入口

**最終更新 2026-11-25（JST）｜アクセサリー副業プロジェクト**

新しいチャットや別のAIは、このページを最初に開き、**毎回GitHubの最新 `main` を読む**。進行中の回は[制作台帳](production-status.json)の `currentEpisodeId`、使用する指示文はその回の `currentPromptVersion` で確認する。添付やTikTokを閲覧できない場合は該当項目を未確認として扱う。 [コピペ用の引継ぎ文](#6-新しいチャットや別のaiに渡す引継ぎ文)

## 0. 初めに開くURL（動画とサイトは別ワークフロー）

- **GitHubリポジトリ**：https://github.com/rozawa619/japanese-craft-jewelry
- **この引継ぎファイル**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/NEW_CHAT_HANDOFF.md
- **動画制作の手順入口**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/README.md
- **[動画SDD](spec.md)** と **[Flow共通テンプレート](flow-template.md)**
- **動画制作進捗**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/production-status.json
- **TikTok公開照合と重複防止**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/tiktok-publication-registry.json
- **京都編の7商品と制作順**。 [京都編の台帳](kyoto-series-plan.json)
- **全体サイト作業の入口**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/START_HERE.md
- **サイト側のAI向け規則**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/AGENTS.md
- **日本語公開サイト**：https://rozawa619.github.io/japanese-craft-jewelry/ja/
- **英語公開サイト**：https://rozawa619.github.io/japanese-craft-jewelry/en/
- **TikTokアカウント**：https://www.tiktok.com/@soracraftdiary
- **京都府の公開ページ**。 [日本語サイト](https://rozawa619.github.io/japanese-craft-jewelry/ja/places/kyoto/)

### 今後の全動画に共通する基準

1. **商品を選ぶ前に、原本の縦の収まりを見る。** 未使用候補の原本で9:16相当の中央範囲を確認し、両目・口元・装身具全体に余白がある画像を優先する。人物が片側に寄る場合は、人物側に枠を寄せた画角も確かめ、収まりをepisodeに記録する。
2. **Flowの開始プレビューを確認してからモードを選ぶ。** 実際の縦9:16プレビューに必要な範囲が収まればFrames。見切れが残るときや実プレビューを確認できないときは、同じサイト原本1枚をIngredientsに指定する。プロンプトで顔と装身具を0秒から同時に入れ、全編で画角を固定する。
3. **自然な肌のキメを保ち、ほくろや濃い点が見えない状態を指示する。** 頬・口元まわり・あごのほくろや単独の濃い点の有無を元画像と見比べる。顔立ち・髪・服・装身具は原本を基準にする。
4. **生成後の0秒・0.5秒・1秒と顔がよく見える後半を検品する。** 冒頭で両目・口元・装身具に見切れがある場合や、ほくろ・濃い点が見える場合は `revision_needed` として記録する。添付を確認できない場合は該当検査を未確認とし、次の作業を制作台帳とepisodeに残す。

詳細は最新版の[動画SDD](spec.md#冒頭の見切れを防ぐ手順)と[Flow共通テンプレート](flow-template.md)を参照。東京編第2話の[実例と再生成指示](episodes/tokyo-rinzen-leaf-glass-pendant.md)に、元画像の中央切り出しと頬の黒点を確認した経緯を保存している。

## 1. コンセプトと収益化の立ち位置

- **ブランド名**：SORA｜旅先で待ち合わせ
- **作品世界**：各都道府県を旅して、サイトのアクセサリーを着けた日本人の成人女性と一人称のデートをするような雰囲気。視聴者は恋人目線。1本約10秒、女性から自然な日本語で問いかけ、親しみやすい微笑みと商品を見せる。女性は商品ごとにサイト掲載の異なる設定であり、単一主人公の使い回しではない。
- 神奈川、京都に続いて東京編を制作。制作地域と進行中の回は最新の[制作台帳](production-status.json)の `seriesFocus` と `currentEpisodeId` で確認する。
- **事業**：国内・海外向け日本工芸アクセサリーの紹介メディア。最終的にアフィリエイト収益化を目指す。現時点のサイトは紹介中心で、実アフィリエイト提携は未申請、通常リンク。存在しない商品/契約/承認/アクセス実績を捏造しない。
- サイトの公開版と商品数は[公開記録](../deployment-results.json)で確認する。
- **出典ポリシー**：作成済みサイトに掲載されている商品・女性画像から動画を作る。サイト外の商品や架空のモデルを「サイト掲載済み」と言わない。商品情報は src/data/catalog.json と src/data/translations/ja.json、画像対応は src/data/editorial-images.json。

## 2. 新動画の標準ワークフロー（重要な最新ユーザー指示）

1. ユーザーが「次の動画」「次の女性」と言ったら、**必ず最新GitHubで公開商品IDとその商品の女性画像原本を確認**する。
2. **新しい開始画像は作らない。** サイトの女性画像（public/images 配下の元WebP）を**そのまま画面に表示**し、画像の直接URLとサイト商品ページURLを渡す。画像編集、若返り、服の色変更、Canva、縦9:16の追加クロップはユーザーが明示的に依頼した場合のみ。過去には画像を再生成すると別人化、ブラウスの色やブレスレットの数が変わった。ユーザーはこの試行錯誤を繰り返したくない。
3. **重複チェックを先に行う。** TikTok投稿照合台帳、制作台帳、過去エピソードを読み、**商品IDと女性元画像の assetId/path を両方確認**する。制作済み/投稿済み/投稿疑い/予約済みのいずれかと重なれば、ユーザーの再制作指示がない限り候補から外す。顔が同じに見える別ファイルも手で見比べる。
4. [今後の全動画に共通する基準](#今後の全動画に共通する基準)を適用する。Google Flowは縦9:16、10秒を選べる場合は10秒。1ショットの一人称デート視点で手の動きを抑え、装身具の左右と数を保つ。
5. **音声**：若い成人日本人女性の自然な標準日本語、短文で正しい抑揚。誤読しやすい外来語は避け、ひらがな中心のセリフ1行。過去の「ブレスレット」が「ブレスレ」になる問題があった。読みの英訳/ローマ字を大量に同じ生成プロンプトへ書かない。改善しない場合は映像無音＋後付け日本語音声（別途口パク要調整）。
6. **Flow生成時に字幕・ロゴ・BGMを入れない**。字幕、説明文、音楽、URL誘導は後編集。完成動画が来たらその実ファイルを確認し、商品・女性との一致、装身具の重複、音声を可能な範囲で検査する。
7. TikTok投稿文は動画とサイトの商品情報に基づき「問いかけ → 地域/アクセサリー → 視聴者への質問 → AI生成注記 → 少数タグ」。Instagram用は docs/video/instagram-caption-template.md の日英の構成を優先し、episodeへ全文保存。
8. 各作業後に**同一チャットのうちに** GitHub の docs/video/production-status.json、当該 episode（必要時はTikTok公開照合台帳）を更新。動画生成・完成・公開の区別を守る。投稿URLを実確認するまで published としない。

### Flowの過去の失敗と改善

- **見切れと頬の黒点**。東京編第2話では、元画像の中央を縦に切り出した画角と0秒がほぼ一致し、右側の目とチェーンが見切れた。後半の確認フレームで、元画像に見えなかった頬の黒点が現れた。SDD v1.13では、候補を出す前の縦画角確認と、生成後の肌の採用基準を追加した。 [東京編第2話](episodes/tokyo-rinzen-leaf-glass-pendant.md)
- **両手にブレスレットが出現**：長い No/Don't 連発でも直らなかった。元画像で片手首だけ映る構図と装身具1点、手を動かさない映像指示を優先。ユーザーが画像を改変してほしいと頼まなければ元画像を変更しない。
- **女性が別人に変わる**：画像を新たに生成し直す方式は不採用。元のサイト画像を厳密に使う。
- **服の色/形の不一致**：服の色を勝手に変えない。質感や顔を改変する希望があっても限定的編集で、元画像との比較が必要。
- **日本語が非ネイティブ風/「ブレスレ」**：口語の短いセリフ・音声を分ける代替を検討。Veo/Flow公式ガイド調査は docs/video/research/flow-veo-prompting-2026-11-21.md に記録。
- **映像の重複**：商品IDだけでは不十分。同じ女性画像を別のピアス/イヤリング品番で再利用するケースもある。

## 3. 制作済み・未確認の厳格な区別（神奈川県）

- 神奈川県IDの公開商品8点のうち、**7商品はTikTok公開を確認**。残るDahliacyan オレンジムーンストーンの透かし彫りピアスは動画のサンプル確認済みで、投稿URLが未確認。重複防止のため8点とも新作候補から外す。 [神奈川の確認記録](kanagawa-coverage-audit-2026-11-22.md)
- 補足：箱根丸山物産の寄木の耳飾り **4点**はサイトで販売店関連として掲載しているが、商品データの県IDは空欄。製造地/作り手を神奈川と断定しない。
- 丸山の「寄木イヤリング C」と「寄木ピアス C」は **同じ女性画像**。「イヤリング D」と「ピアス D」も **同じ女性画像**。とくに D はFlow指示文だけ準備済みで、実動画・TikTok投稿を確認していない。
- **TikTokアカウントは @soracraftdiary**。2026-11-22に公開プロフィールの動画10本を確認し、キャプションとサムネイルを7商品に照合。以前共有された動画は浜松屋の寄木ペンダントを紹介する芦ノ湖のカフェ編。公開動画の全編・音声と、箱根60秒総集編の完成・公開は未確認。 [TikTok公開台帳](tiktok-publication-registry.json)
- 以前ユーザーがTikTok/Instagram用に10秒動画を多数アップロードして投稿文を依頼。**チャット添付のMP4が次チャットへ移るとは限らない**。GitHubの記録はクリップの存在と検査内容を伝えるが、MP4本体や実投稿の完全コピーではない。未確認を「完了」にしない。
- 制作・出版の状態（source of truth）は docs/video/production-status.json の各エピソードと docs/video/tiktok-publication-registry.json。

## 4. 京都府シリーズ

- 京都編の7商品は重複防止の対象。全都道府県の掲載商品は[商品台帳](../../src/data/catalog.json)を確認する。
- **京都はサイト掲載7商品、対応する女性元画像7点**。進行中の回と着手状況は[制作台帳](production-status.json)を参照する。 [京都編の台帳](kyoto-series-plan.json)
- 京都商品には工芸の種類が多い。**「七宝文様」の真鍮バングルは七宝焼と断定しない**。オリジナル画像を基準に毎回目視確認。
- 表は京都編の制作順。最新の生成・公開の情報は[制作台帳](production-status.json)と[TikTok公開台帳](tiktok-publication-registry.json)を照合する。

| 仮順 | サイト商品 | 商品ID | URL | 動画 |
| ---: | --- | --- | --- | --- |
| 1 | Morphosphere tint 群青パンジーピアス | morphosphere-ultramarine-pansy-pierced-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/morphosphere-ultramarine-pansy-pierced-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/morphosphere-blue-pansy-styling-v9.webp) | [制作状況と現行の指示文](episodes/kyoto-morphosphere-ultramarine-pansy-pierced-earrings.md) |
| 2 | 中嶋象嵌 ナシ型 桜・ラインドット ペンダント | nakajima-pear-sakura-pendant | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/nakajima-pear-sakura-pendant/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/nakajima-sakura-damascene-pendant-styling-v9.webp) | [制作状況と現行の指示文](episodes/kyoto-nakajima-pear-sakura-pendant.md) |
| 3 | 錺之 はなびし 銅のピアス | kazarino-hanabishi-copper-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/kazarino-hanabishi-copper-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-kazarino-hanabishi-copper-earrings-v23.webp) | TikTok公開カード照合済み |
| 4 | 染工房正茂 × Sextile 孔雀 友禅イヤリング | somemasa-peacock-clip-on-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/somemasa-peacock-clip-on-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-somemasa-peacock-clip-on-earrings-v23.webp) | TikTok公開カード照合済み |
| 5 | こよりみ 玉結び 水引イヤリング | coyorimi-tamamusubi-clip-on-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/coyorimi-tamamusubi-clip-on-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/coyorimi-tamamusubi-clip-on-earrings-styling-v13.webp) | 生成記録あり。公開URL未確認 |
| 6 | 昇苑くみひも 正絹 江戸打ち 二重巻きブレスレット 青 | showen-edo-uchi-silk-bracelet | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/showen-edo-uchi-silk-bracelet/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-showen-edo-uchi-silk-bracelet-v23.webp) | 生成記録あり。冒頭の構図は要修正 |
| 7 | 錺之 七宝文様 真鍮バングル S | kazarino-shippo-pattern-brass-bangle | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/kazarino-shippo-pattern-brass-bangle/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/kazarino-shippo-pattern-brass-bangle-styling-v13.webp) | [制作記録](episodes/kyoto-kazarino-shippo-pattern-brass-bangle.md) |

制作の再開時は[制作台帳](production-status.json)から進行中の回とその制作記録を開く。

## 5. このファイルに書かれていないことの扱い

- 公式サイト： https://rozawa619.github.io/japanese-craft-jewelry/ja/
- GitHub main 最新の公開商品・画像を毎回読む。静的なこのファイルの数値が後で古くなったら **GitHubの最新実データを優先**。
- 現行アプリの公開成功スナップショット： docs/deployment-results.json。GitHub docsのコミット更新だけを新しいアプリの公開成功と呼ばない。
- 音声付き10秒動画ファイルの中身は元クリップが利用可能なときだけ検証。キャプションを作ったという事実を投稿済みと混同しない。
- コネクタ権限・TikTokの公開制限などアクセス不能なものは正直に伝える。作業を実施できたことだけ完了と記録する。
- サイトの女性・商品は紹介用のAIイメージであり、商品の現物撮影や試着実証ではない。メーカー公認/認定/アフィリエイト実提携を勝手に示唆しない。

## 6. 新しいチャットや別のAIに渡す引継ぎ文

~~~text
「SORA｜旅先で待ち合わせ」の動画制作を引き継いでください。最初に以下のGitHub引継ぎ書を開いてください。
https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/NEW_CHAT_HANDOFF.md

最新mainのAGENTS.md、動画SDD（docs/video/spec.md）、Flow共通テンプレート（docs/video/flow-template.md）、制作台帳とTikTok公開台帳を読んでください。制作台帳のcurrentEpisodeIdで現在の回を特定し、該当するepisodePathとcurrentPromptVersionから指示文を開いてください。

新作では公開商品ID・女性画像ID・画像パスの重複を照合し、サイト掲載の元画像をそのまま表示して、元画像と商品ページのURLを添えてください。提案前に元画像で9:16相当の縦の収まりを確認し、両目・口元・装身具全体に余白がある未使用候補を優先します。人物が寄っている場合は、人物側に縦枠を寄せた画角も確認します。

Flowの実際の縦の開始プレビューに必要な範囲が収まればFramesを使います。見切れが残る場合、または開始プレビューを確認できない場合は、同じ原本1枚をIngredientsに指定します。縦9:16、選べる場合は10秒、冒頭から顔と装身具が収まる一人称デートの固定構図、自然な日本語を一言。元の顔立ち・髪・服・装身具を保ち、頬・口元・あごにほくろや単独の濃い点が見えないよう指定します。

生成後は0秒・0.5秒・1秒の見切れと、顔がよく見える後半のほくろや濃い点を元画像と照合します。どちらかがあれば要修正（revision_needed）です。確認結果と次の作業を対象エピソードと制作台帳に記録し、未確認の生成・検品・SNS公開を区別してください。
~~~

## 7. 引継ぎの完成判定

- このファイル、SDD、Flow共通テンプレート、制作台帳、TikTok公開台帳をGitHubの最新 `main` から読めること
- 既存のサイト原本画像・商品情報・過去キャプション・Flow指示文がつながっていること
- 確定事項と未確認事項を混同していないこと
- サイト原本の9:16の収まりを提案前に確認し、生成後の見切れとほくろ・濃い点の採用基準を適用できること

**限界**：過去ChatGPTの文脈を文字どおり100%複製したり、他のチャットでしか参照できない動画データや閲覧制限されたTikTok投稿まで自動取得したりすることは保証しない。だが、次に制作を開始するための**決定ルール・サイトデータ参照先・既知の進捗・注意点**をGitHubに永続化する。
