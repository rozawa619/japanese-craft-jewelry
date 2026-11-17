# 検証記録

開始は公開アプリ1f00213 / 文書HEAD1082263、50公開/56登録・14地域・98公開AI画像。調査/生成/実装/ローカル/公開を分け、今回の実測はnational-stageに保存する。途中や旧版の結果を新規60品の全検証へ流用しない。

## ローカル検証

Node24.22.3 / pnpm11.25.0。全60商品/24県の344HTML・328正規URL・118WebPを生成。最初の通常verifyは型130ファイル0error/warning/hint、unit135/135。その後の画像manifest負例9件追加を含む最終checkは型131ファイル0error/warning/hint、unit144/144。testだけの追加で、ブラウザー走査中のdistは変更していない。

| 対象 | 結果・証跡 |
| --- | --- |
| 全商品・分類/地域・絞込/比較/JSなし | [quality617/617](../../docs/national-stage-quality-results.json)、60品360detail、24地域の往復、axe30画面で違反0、外部通信/page/console error0 |
| 国内JPYと別市場・行き先 | [prices374/374](../../docs/national-stage-prices-results.json)、全60品/24地域、旧9dual-marketを保持、axe18画面で違反0 |
| 出典/date・配信HTMLとlocal SHA | [sources328/328](../../docs/national-stage-sources-results.json)、日英120商品・初期closedを保持 |
| スマホ/keyboard/横向き | [mobile92/92](../../docs/national-stage-mobile-results.json)、7viewport/JAEN、axe10画面で違反0。実機iOSの認定ではない |
| 産地/homeの種類画像 | [types52/52](../../docs/national-stage-type-images-results.json)、24地域・104画像instance、画像/所属/価格/件数/query一致 |
| touch | [4/4](../../docs/national-stage-touch-results.json)、実tap2flow・スクリーンショット8、reset後を固定50から公開件数導出へ |
| 新店舗の地図 | [20/20](../../docs/national-stage-new-maps-results.json)、JAEN×10店舗。初期/reload外部0、表示時のみGoogle20をrouteで遮断して観測、iframe閉削除、cookie/storageなし、住所/名前/URL/proof一致 |
| SEO | [328正規URL](../../docs/national-stage-seo-results.json)、相互hreflang/canonical/JSON-LD/sitemap・120商品、noindex16。実検索掲載/順位は未測定 |
| 文の重複補助 | [copy94/94](../../docs/national-stage-copy-results.json)。同toolのexisting42/new18は旧基準との差で、今回10品という追加数とは別 |
| 画像/広告Privacy | 人物59/59・単体61/61・Privacy4/4。[人物](../../docs/national-stage-editorial-images-results.json)・[単体](../../docs/national-stage-detail-images-results.json)・[Privacy](../../docs/national-stage-privacy-results.json)。Google広告はoff |
| 既存保持 | [Git1082263比較](../../docs/national-stage-preservation-results.json)。旧267catalog record/56商品/199訳/258出典/98画像、旧生成記録3ファイルの値/SHAを保持 |
| 安定した生成物 | [全469ファイルmanifest](../../docs/national-stage-build-manifest.json)。検査中に再buildしていない |

技術公開設定readinessも成功。ローカル実行logはartifacts/national-stageへ分離。顧客向け文章は別担当の独立レビューで、制作内部の都合・内部variant ID・根拠のない厚さ比較を修正した。Akitaの単位未記載の採寸値は表示sizeへ採用せず、一次資料にだけ残す。

## 生成と途中の修正

通常の公開前preflightで、正当な引用符付きYAMLのpublishStatusを作業helperが拒否した。無引用/両引用の正しいscalarを受けるよう直し、無書込み検査と統合6系validatorを再実行して成功。顧客アプリの不具合や公開事故ではない。

AI画像の候補3点は、ネックレス状の折り鶴・4粒の米モチーフ・未確認のクリップを露出した図として棄却。画像生成/編集toolで修正して目視承認し、採用20PNGと棄却3PNG、実prompt/AI参照とSHAを分離保管した。単体図の初回撮影でlazy画像のdecode前を撮ったため、撮影側でdecodeを待って確認した。元画像やCSSを隠して合格させていない。

Maps20flowは外部要求を遮断したapp側の操作検査。Google本体のタイル/ピン/帰属の描画はその検査で認定しない。別の取得段階で、公式公開iframe4件とGoogle Share UI6件の店舗名・住所を照合し、[記録](../../docs/research/national-map-embeds-v16.json)へ残した。第三者API keyは転用しない。

## 公開後の検証

公開アプリは86d6c6e6cb1567839c80d43bcf26f4a509e4a8bb。[Actions44042180272](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44042180272)のcompleted/success（updatedAt 2026-11-17T07:54:26Z）を07:54:34.367ZにGitHub APIで確認した。

[公開集約](../../docs/national-stage-hosted-results.json)のとおり、Source328/328の生HTML SHAが最終distと全件一致。[補足24/24](../../docs/national-stage-hosted-release-results.json)で328正規URLのmetadata/CSPと118画像200/SHA、[mobile92/92](../../docs/national-stage-hosted-mobile-results.json)（7viewport・axe10画面0・実Maps2）、[種類52/52](../../docs/national-stage-hosted-types-results.json)（24県・104画像）、[touch4/4](../../docs/national-stage-hosted-touch-results.json)を確認した。ローカル617/374を公開で再走査したとはしない。

公開種類検査の[初回50/52](../../docs/national-stage-hosted-types-first-attempt-results.json)は広島ENの一時503と付随consoleエラー。原記録を保持し、[fresh200と公開/dist/manifestの三者SHA一致](../../docs/national-stage-hosted-types-recheck-results.json)を確認後、アプリを変えず全52を再走査して成功した。初回を成功として合算しない。

公開検証後にも[469生成物の集合/全SHA一致](../../docs/national-stage-final-output-integrity.json)を確認。以降の変更は文書・証跡・文書検査対象の追加だけで、公開テンプレートやデータは変更しない。

## 納品と引継ぎ

現在のREADME・AGENTS・人向け編集/検証/構造ガイドとAI用コピーpromptを0.16へ更新。旧0.15の公開/検証記録を保存し、[現行検証](../../docs/verification.md)へ入口を統一した。[文書検査](../../docs/national-stage-docs-results.json)で24文書のlocal link/fragment/commandを確認した。外部URLの一括到達性をこの文書検査で認定しない。

全sourceは971ファイル・公開画像118・公開商品60。初回exportと版付きZIPはrepository→export→ZIPの集合/全件SHAに成功。完了記録の反映後にも同じ検証で再梱包する。版付きZIPはjapanese-craft-jewelry-source-0.16.0-national-018.zip、latestはjapanese-craft-jewelry-source.zip、最終bytes/SHAと全件結果はZIP外のpackage-verification-0.16.0-national-018.jsonを正本とする。ZIP自身のhashをZIP内へ自己参照させない。

0.16の原本別ZIPは23PNG（採用20・棄却3）＋生成記録2＋READMEの26ファイルを全SHA照合済み。35,561,799bytes、SHA256383cf02e99cdf06d936118e9d071f35df68a1b99191de31442b7f450de386254。外部originals-verification-0.16.0.jsonに証拠を置き、過去の原本ZIPも保持した。通常buildは同梱WebP/生成記録から動作し、artifactsや原本ZIPへ依存しない。
