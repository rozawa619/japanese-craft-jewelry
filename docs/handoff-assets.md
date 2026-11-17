# GitHubに保存した画像原本と配布資料

現在の編集元はGitHubの`main`です。通常の起動/buildに必要な全ソースと118枚の公開画像はGitにあります。以下は画像編集や過去の納品内容を照合するときの補助資料です。

[引継ぎ用GitHub Release](https://github.com/rozawa619/japanese-craft-jewelry/releases/tag/ai-handoff-2026-11-17)に8ファイルを保存しました。URL・容量・SHA256は[handoff-assets.json](handoff-assets.json)が正本です。GitHubのDownload source codeと、この独立した配布assetを混同しません。

| ID | 内容 |
| --- | --- |
| originals-0.18.0 | 今回の日本人モデル22枚の元PNG、編集参照だった旧自作AI WebP22枚、全prompt/採用記録など47ファイル |
| originals-0.16.0 | 全国追加時の元PNG23枚（採用20/棄却3）と生成・採用記録、26ファイル |
| originals-0.14.0 | 以前の人物/単体AI画像の原本ZIP。過去の設定・候補も含む履歴資料 |
| originals-0.13.0 | さらに前のAI画像原本ZIP。現在の画像方針の指示として扱わない |
| source-models-023 | 0.18.0 models-023納品時点の1198ファイル/118公開画像。今回の引継ぎ024を追加する前のsnapshot |
| proof-originals-0.16.0 | 上記0.16原本ZIPの検証記録 |
| proof-originals-0.18.0 | 上記0.18原本ZIPの検証記録 |
| proof-source-models-023 | 上記source ZIPの検証記録 |

小さい3つのproofは[delivery-proofs/](delivery-proofs/)にも同じbytesで保存しています。proofに記録されたWindowsの絶対パスは当時の検証環境の記録です。別PCでそのパスを作る必要はありません。1198という件数も、その過去snapshotの値です。

## SHAを検証して取得する

Nodeで実行します。ダウンロードにGitHub認証・API keyは不要です。

~~~sh
node scripts/fetch-handoff-asset.mjs --list
node scripts/fetch-handoff-asset.mjs originals-0.18.0
~~~

保存先は`artifacts/handoff-assets/`。登録されたGitHub ReleaseのURLだけへ接続し、redirectのhost/公開DNS・TLS、サイズ、SHAを検査します。同じファイルがあれば再照合して使い、異なるファイルがあれば上書きせず停止します。取得だけでZIP展開・アプリ反映・商品再公開を行いません。GitHubの画面から直接取得した場合も、一覧のSHA256と照合してください。

## 元PNGが必要なとき

現在の公開画像を編集参照にする場合は、Git内の`public/images/`と[人物生成manifest](image-generation-japanese-v23.json)を先に確認します。原本のPNGを使う場合だけ、0.18のZIPを別の作業用ディレクトリへ展開してください。AIツールがある環境で編集対象を表示してから使い、生成記録へ入力/出力/採否を残します。

023専用の`--originals`検証を再現する場合は、ダウンロード済みZIPを次の位置へ展開できます。`<repo-parent>/japanese-craft-jewelry-delivery/`は任意のcloneの親を基準にした相対配置で、前任者PCのパスではありません。

~~~powershell
Expand-Archive -LiteralPath artifacts/handoff-assets/japanese-craft-jewelry-originals-0.18.0.zip -DestinationPath ../japanese-craft-jewelry-delivery/generated-originals/0.18.0
New-Item -ItemType Directory -Path artifacts/checks -Force | Out-Null
$env:CHECK_JAPANESE_MODEL_REPORT_PATH='artifacts/checks/model-originals.json'
node --experimental-strip-types scripts/check-japanese-model-styling.mjs --originals
~~~

既存の展開先がある場合はその内容を確認し、別の空ディレクトリで照合してから扱ってください。元PNGなしの通常verify/モデル設定QAも可能です。旧22画像の退役や移行は完了済みなので、`apply-japanese-model-styling.mjs`を再適用しません。旧495入力の保全検査は当時のcheckout専用で、fresh cloneの必須手順にしません。

画像原本には棄却候補・旧US/UK設定などもあります。公開に採用する画像は現行registryと台帳だけで決め、原本ZIPをそのまま`public/`へコピーしないでください。公式写真の使用許諾や実物/着用試験の証拠でもありません。

## 現状の画面を確認する

023の公開後のChrome検証で撮影した[PCホーム](previews/home-desktop.png)と[スマホホーム](previews/home-mobile.png)をGitにも保存しました。今後の変更時は実際のサイトと照合し、古い画面を将来の見た目の正本として固定しません。
