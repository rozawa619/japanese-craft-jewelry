# SORA｜旅先で待ち合わせ — 新チャットへの完全引継ぎ入口

**最終更新：2026-11-22（JST）／引継ぎ対象：アクセサリー副業プロジェクト**

このファイルが新チャットの**第一入口**。過去チャットの長文や記憶に依存してはいけない。**同じGitHubリポジトリの最新 main を毎回読み直す**。チャットの添付動画やTikTokアカウントへのアクセスが制限される場合、未確認を正しく区別する。

> ユーザーの依頼：「このチャットがいっぱいになる可能性があるので、新しいチャットを立てて完全に引き継ぎたい。引継ぎ文も書いて」。新作をいま生成/公開する依頼ではない。

## 0. 初めに開くURL（動画とサイトは別ワークフロー）

- **GitHubリポジトリ**：https://github.com/rozawa619/japanese-craft-jewelry
- **この引継ぎファイル**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/NEW_CHAT_HANDOFF.md
- **動画制作の手順入口**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/README.md
- **動画SDD**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/spec.md
- **動画制作進捗**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/production-status.json
- **TikTok公開照合と重複防止**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/tiktok-publication-registry.json
- **次の京都候補7品**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/docs/video/kyoto-series-plan.json
- **全体サイト作業の入口**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/START_HERE.md
- **サイト側のAI向け規則**：https://github.com/rozawa619/japanese-craft-jewelry/blob/main/AGENTS.md
- **日本語公開サイト**：https://rozawa619.github.io/japanese-craft-jewelry/ja/
- **英語公開サイト**：https://rozawa619.github.io/japanese-craft-jewelry/en/
- **TikTokアカウント**：https://www.tiktok.com/@soracraftdiary
- **次回候補の京都府ページ**：https://rozawa619.github.io/japanese-craft-jewelry/ja/places/kyoto/

## 1. コンセプトと収益化の立ち位置

- **ブランド名**：SORA｜旅先で待ち合わせ
- **作品世界**：各都道府県を旅して、サイトのアクセサリーを着けた日本人の成人女性と一人称のデートをするような雰囲気。視聴者は恋人目線。1本約10秒、女性から自然な日本語で問いかけ、親しみやすい微笑みと商品を見せる。女性は商品ごとにサイト掲載の異なる設定であり、単一主人公の使い回しではない。
- **展開**：神奈川から始め、47都道府県を目指す。現在は神奈川を概ね一巡したので**他県へ進む検討段階**。次のシリーズとして**京都府（7点）を推薦済みだが、ユーザーによる京都の正式確定はまだない**。この時点で京都動画は1本も作成/公開済みとして記録されていない。
- **事業**：国内・海外向け日本工芸アクセサリーの紹介メディア。最終的にアフィリエイト収益化を目指す。現時点のサイトは紹介中心で、実アフィリエイト提携は未申請、通常リンク。存在しない商品/契約/承認/アクセス実績を捏造しない。
- **サイトの公開スナップショット（2026-11-19のデプロイ記録）**：v0.20.0、公開69商品・登録75商品・28都道府県・人物67＋単体69のAI画像136枚。GitHub main の文書更新と公開済みアプリSHAは別。正本は docs/deployment-results.json。
- **出典ポリシー**：作成済みサイトに掲載されている商品・女性画像から動画を作る。サイト外の商品や架空のモデルを「サイト掲載済み」と言わない。商品情報は src/data/catalog.json と src/data/translations/ja.json、画像対応は src/data/editorial-images.json。

## 2. 新動画の標準ワークフロー（重要な最新ユーザー指示）

1. ユーザーが「次の動画」「次の女性」と言ったら、**必ず最新GitHubで公開商品IDとその商品の女性画像原本を確認**する。
2. **新しい開始画像は作らない。** サイトの女性画像（public/images 配下の元WebP）を**そのまま画面に表示**し、画像の直接URLとサイト商品ページURLを渡す。画像編集、若返り、服の色変更、Canva、縦9:16の追加クロップはユーザーが明示的に依頼した場合のみ。過去には画像を再生成すると別人化、ブラウスの色やブレスレットの数が変わった。ユーザーはこの試行錯誤を繰り返したくない。
3. **重複チェックを先に行う。** TikTok投稿照合台帳、制作台帳、過去エピソードを読み、**商品IDと女性元画像の assetId/path を両方確認**する。制作済み/投稿済み/投稿疑い/予約済みのいずれかと重なれば、ユーザーの再制作指示がない限り候補から外す。顔が同じに見える別ファイルも手で見比べる。
4. Google Flowの Frames / image-to-video。9:16、基本10秒（選択可能なモデルのみ）。もとの女性の顔・髪型・服の色・商品そのまま、1ショット、boyfriend POV。**目線をカメラへ→自然な短文→優しい笑顔の余韻**。手や装身具の動きは最小、顔とアクセサリーを両方入れる。複製・左右入れ替わりを避ける。
5. **音声**：若い成人日本人女性の自然な標準日本語、短文で正しい抑揚。誤読しやすい外来語は避け、ひらがな中心のセリフ1行。過去の「ブレスレット」が「ブレスレ」になる問題があった。読みの英訳/ローマ字を大量に同じ生成プロンプトへ書かない。改善しない場合は映像無音＋後付け日本語音声（別途口パク要調整）。
6. **Flow生成時に字幕・ロゴ・BGMを入れない**。字幕、説明文、音楽、URL誘導は後編集。完成動画が来たらその実ファイルを確認し、商品・女性との一致、装身具の重複、音声を可能な範囲で検査する。
7. TikTok投稿文は動画とサイトの商品情報に基づき「問いかけ → 地域/アクセサリー → 視聴者への質問 → AI生成注記 → 少数タグ」。Instagram用は docs/video/instagram-caption-template.md の日英の構成を優先し、episodeへ全文保存。
8. 各作業後に**同一チャットのうちに** GitHub の docs/video/production-status.json、当該 episode（必要時はTikTok公開照合台帳）を更新。動画生成・完成・公開の区別を守る。投稿URLを実確認するまで published としない。

### Flowの過去の失敗と改善

- **両手にブレスレットが出現**：長い No/Don't 連発でも直らなかった。元画像で片手首だけ映る構図と装身具1点、手を動かさない映像指示を優先。ユーザーが画像を改変してほしいと頼まなければ元画像を変更しない。
- **女性が別人に変わる**：画像を新たに生成し直す方式は不採用。元のサイト画像を厳密に使う。
- **服の色/形の不一致**：服の色を勝手に変えない。質感や顔を改変する希望があっても限定的編集で、元画像との比較が必要。
- **日本語が非ネイティブ風/「ブレスレ」**：口語の短いセリフ・音声を分ける代替を検討。Veo/Flow公式ガイド調査は docs/video/research/flow-veo-prompting-2026-11-21.md に記録。
- **映像の重複**：商品IDだけでは不十分。同じ女性画像を別のピアス/イヤリング品番で再利用するケースもある。

## 3. 制作済み・未確認の厳格な区別（神奈川県）

- 神奈川県の公式IDがある公開商品は **8点**。うち **6点は動画のサンプル確認またはユーザーの「作った」申告がある**。箱根の浜松屋ピアス・イヤリングの2点は過去の素材との関係が未解決。**重複防止のため8点とも次作候補から一旦外している**。詳細は docs/video/kanagawa-coverage-audit-2026-11-22.md。
- 補足：箱根丸山物産の寄木の耳飾り **4点**はサイトで販売店関連として掲載しているが、商品データの県IDは空欄。製造地/作り手を神奈川と断定しない。
- 丸山の「寄木イヤリング C」と「寄木ピアス C」は **同じ女性画像**。「イヤリング D」と「ピアス D」も **同じ女性画像**。とくに D はFlow指示文だけ準備済みで、実動画・TikTok投稿を確認していない。
- **TikTokアカウント：@soracraftdiary**。2026-11-22に公開ページ一覧の直接取得が制限されており、**動画の公開投稿全件との直接照合は未完了**。TikTokを空アカウントと断定しない。投稿URLが未確認の動画を published にしない。台帳に記録のある単一投稿URLは商品との対応未確認。
- 以前ユーザーがTikTok/Instagram用に10秒動画を多数アップロードして投稿文を依頼。**チャット添付のMP4が次チャットへ移るとは限らない**。GitHubの記録はクリップの存在と検査内容を伝えるが、MP4本体や実投稿の完全コピーではない。未確認を「完了」にしない。
- 制作・出版の状態（source of truth）は docs/video/production-status.json の各エピソードと docs/video/tiktok-publication-registry.json。

## 4. 次に有力な京都府シリーズ（提案・未確定）

- サイト公開商品の都道府県別件数：神奈川8 → **京都7** → 東京5 → 北海道/千葉/大阪/山梨が各4。公開69点、地域28。
- **京都はサイト掲載7商品／紐付く着用女性画像ファイル7点**。制作台帳に京都商品を扱った動画記録はない。ただし、実際のTikTok全投稿を読めていないので、TikTokに一切ないことは証明していない。
- 京都商品には工芸の種類が多い。**「七宝文様」の真鍮バングルは七宝焼と断定しない**。オリジナル画像を基準に毎回目視確認。
- 候補と順序は docs/video/kyoto-series-plan.json。**ユーザーが選ぶ前に京都7本を勝手に生成・投稿しない**。

| 仮順 | サイト商品 | 商品ID | URL | 動画 |
| ---: | --- | --- | --- | --- |
| 1 | Morphosphere tint 群青パンジーピアス | morphosphere-ultramarine-pansy-pierced-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/morphosphere-ultramarine-pansy-pierced-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/morphosphere-blue-pansy-styling-v9.webp) | 未制作（候補） |
| 2 | 中嶋象嵌 ナシ型 桜・ラインドット ペンダント | nakajima-pear-sakura-pendant | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/nakajima-pear-sakura-pendant/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/nakajima-sakura-damascene-pendant-styling-v9.webp) | 未制作（候補） |
| 3 | 錺之 はなびし 銅のピアス | kazarino-hanabishi-copper-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/kazarino-hanabishi-copper-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-kazarino-hanabishi-copper-earrings-v23.webp) | 未制作（候補） |
| 4 | 染工房正茂 × Sextile 孔雀 友禅イヤリング | somemasa-peacock-clip-on-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/somemasa-peacock-clip-on-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-somemasa-peacock-clip-on-earrings-v23.webp) | 未制作（候補） |
| 5 | こよりみ 玉結び 水引イヤリング | coyorimi-tamamusubi-clip-on-earrings | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/coyorimi-tamamusubi-clip-on-earrings/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/coyorimi-tamamusubi-clip-on-earrings-styling-v13.webp) | 未制作（候補） |
| 6 | 昇苑くみひも 正絹 江戸打ち 二重巻きブレスレット 青 | showen-edo-uchi-silk-bracelet | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/showen-edo-uchi-silk-bracelet/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/styling-jp-showen-edo-uchi-silk-bracelet-v23.webp) | 未制作（候補） |
| 7 | 錺之 七宝文様 真鍮バングル S | kazarino-shippo-pattern-brass-bangle | [商品](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/kazarino-shippo-pattern-brass-bangle/) / [人物原本](https://raw.githubusercontent.com/rozawa619/japanese-craft-jewelry/main/public/images/kazarino-shippo-pattern-brass-bangle-styling-v13.webp) | 未制作（候補） |

**次の一手**：新チャットで「京都から始めよう」と指示が来たら、最新の catalog / editorial-images / video status / TikTok de-dup台帳を再取得し、1本目候補の **Morphosphere tint 群青パンジーピアス** に該当するサイト女性の**画像原本を表示**。顔と商品を確認して、必要な場合だけ Google Flow のコピー用10秒動画プロンプトを作成。ユーザーが別の商品や県を選んだらそちらを優先する。チャット開始文が「引継ぎ完了を確認」だけなら、いきなり動画を生成せず引継ぎ内容を簡潔に報告する。

## 5. このファイルに書かれていないことの扱い

- 公式サイト： https://rozawa619.github.io/japanese-craft-jewelry/ja/
- GitHub main 最新の公開商品・画像を毎回読む。静的なこのファイルの数値が後で古くなったら **GitHubの最新実データを優先**。
- 現行アプリの公開成功スナップショット： docs/deployment-results.json。GitHub docsのコミット更新だけを新しいアプリの公開成功と呼ばない。
- 音声付き10秒動画ファイルの中身は元クリップが利用可能なときだけ検証。キャプションを作ったという事実を投稿済みと混同しない。
- コネクタ権限・TikTokの公開制限などアクセス不能なものは正直に伝える。作業を実施できたことだけ完了と記録する。
- サイトの女性・商品は紹介用のAIイメージであり、商品の現物撮影や試着実証ではない。メーカー公認/認定/アフィリエイト実提携を勝手に示唆しない。

## 6. 新しいChatGPTチャットに貼る引継ぎ文（そのまま使用）

~~~text
SORA｜旅先で待ち合わせ（アクセサリー副業）の動画制作を、この新しいチャットに完全に引き継いでください。

GitHubの正本は https://github.com/rozawa619/japanese-craft-jewelry （main）です。

まず、次のファイルを実際に開いて、必ず最新を読んでください：
1. docs/video/NEW_CHAT_HANDOFF.md
2. docs/video/README.md
3. docs/video/spec.md
4. docs/video/production-status.json
5. docs/video/tiktok-publication-registry.json
6. docs/video/kyoto-series-plan.json
7. src/data/catalog.json
8. src/data/editorial-images.json
9. src/data/translations/ja.json
必要なら START_HERE.md、AGENTS.md、各episode、Google Flowテンプレート、Instagramキャプションテンプレートも参照してください。

TikTokは https://www.tiktok.com/@soracraftdiary です。公開投稿一覧を直接確認できなかったため、公開済みと未確認を厳密に分けてください。

ルールは、作成したサイトに公開済みの商品と、その商品ページで実際に使っている女性の元画像だけで動画を作ること。商品ID・女性画像IDの重複を必ず調べ、過去に制作済み/公開済み/予約済みの組合せは再提案しないこと。元画像を勝手に生成・編集・縦長加工しないこと。画像原本とサイトURLを示してください。

動画はGoogle Flowで縦9:16、基本10秒、恋人の一人称デート視点、自然な日本語の短い会話、女性とアクセサリーを固定、動き最小限。字幕とBGMは後編集。TikTokとInstagramの紹介文は既存SDDに合わせること。

神奈川県は8商品が概ね一巡。次の県として掲載7商品の京都府を提案済みですが、京都を正式に確定して1本目を制作した状態ではありません。京都の7商品の候補と重複しないサイト女性画像は kyoto-series-plan.json で確認してください。

最初に、GitHubで確認できた最新の制作状況・今後の候補・未確認事項を短く整理してください。その後、私が「京都の次の動画」と言ったら、未使用の商品とサイトの女性原本をまず表示し、Flowの指示文まで作ってください。作業後は毎回GitHubの台帳/episodeを更新してください。

前チャットの添付動画やTikTokの全公開投稿がアクセスできないなら、推測で補わず、未確認と明記してください。前チャットで何度も話した方針を再質問せず、今あるGitHubの正本を基に進めてください。
~~~

## 7. 引継ぎの完成判定

- このファイル・SDD・動画進捗台帳・TikTok重複台帳・京都候補を、GitHubで新チャットから読めること
- 既存のサイト原本画像・商品情報・過去キャプション・Flow指示文がつながっていること
- 確定事項と未確認事項を混同していないこと
- ユーザーの**最後の方針（サイト画像原本だけ／重複禁止／他県へ進む）**が最優先であること

**限界**：過去ChatGPTの文脈を文字どおり100%複製したり、他のチャットでしか参照できない動画データや閲覧制限されたTikTok投稿まで自動取得したりすることは保証しない。だが、次に制作を開始するための**決定ルール・サイトデータ参照先・既知の進捗・注意点**をGitHubに永続化する。
