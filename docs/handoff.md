# 現在状態と引継ぎ

文書改訂017、2026-11-17。別AIは[コピー用prompt](ai-handoff.md)、人は[編集ガイド](editing-guide.md)から始められます。過去の途中値を積み上げた説明は[0.15保存版](archive/handoff-v15.md)へ退避しました。

## 何を作っているか

Japanese Craft Jewelryは、SORAが全国の工芸ジュエリーを選ぶ日英サイトです。販売/決済/発送・ブログ・Contactはありません。現時点で公開50/全56商品、14地域、24技法、23店舗/43商品の関連、人物48＋単体50のAI画像98ファイル。今後の追加上限ではありません。

41品の公式注文受付と9品の小売/現行カタログという既存根拠を保持します。将来在庫や店頭の個別在庫は保証しません。COCOON2、欠品18K、現行販売未確認の畠山2、hairpinはdraftを維持。復帰は対象variantの現行販売を再調査します。

## 公開版・source・証拠の区別

| 対象 | 正本 |
| --- | --- |
| 公開アプリ | commit 1f0021306e87ce9e7dc43bdf446cffedc59e4134、[Actions44024678465](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/44024678465) success |
| 現在の作業source | git status / git logと[package.json](../package.json)。文書/task更新のcommitは公開appと異なる場合がある |
| 最新の公開/納品状態 | [deployment-results.json](deployment-results.json) |
| 0.15検証の段階と限界 | [verification.md](verification.md)・[mobile検証](mobile-refinement-v15.md) |
| 今回の保守文書の検査 | [017 validation](../specs/017-maintainer-handoff/validation.md)とhandoff-stageの記録 |

今回の依頼は引継ぎ・人の編集性です。アプリ0.15.0/商品事実/価格/画像/広告状態を変更せず、文書/保守toolと必要なコメントを整備しました。公開appの成功を、新しいdocs commitの公開成功と混同しません。

## 再開の順序

1. [AGENTS](../AGENTS.md)とユーザーの最新依頼を読む。
2. [setup](setup.md)でruntime・env・baseを揃え、[architecture](architecture.md)で正本を特定。
3. [editing-guide](editing-guide.md)に沿い必要なファイルだけ変更。docs JSONはbuild依存なので保持。
4. [verification-guide](verification-guide.md)の影響別検査を行い、Gitならgit diff、ZIPなら保管した展開元とのフォルダー比較。必要なら公開と公開後確認。
5. 仕様/引継ぎ/実測を更新し、[納品手順](setup.md#納品zipを作る)で全sourceとSHAを再作成。

## 守る既存の挙動

- 国内JPY/海外実額/表示言語を分ける。未承認広告を使わず共通resolverの両承認/host/date/locale gateを保つ。
- AI図は実物の証拠ではない。短いcaption/alt/元比率、画像権利と生成記録、退役10画像の除外を維持。
- 出典/dateは初期closed。Sourcesだけが同ページリンクを処理し、pushState→open/scroll/summary focus。重複handlerで即閉じ後の再openを再導入しない。
- Google Mapsは明示表示後だけ。Google帰属表示を隠さず、広告CMPと分け、自前Cookie/Storageで選択を保存しない。
- 日英の同ページ/query/hash、種類画像の実地域/種類との一致、320px/横向き/keyboardの操作性を維持。

## 未完了・判断が必要な事項

| 項目 | 状態/次に必要なこと |
| --- | --- |
| AdSense | off固定。実アカウント/所有確認/実ID/認定CMP/地域別同意・配信の実装は未完了 |
| 提携 | 全program/link未申請・通常URL。申請先の現行条件と真実の申請者情報が必要 |
| 商用host | GitHub Pages用途適合の確認または適した公開先の判断が残る。今回契約/移転/DNSなし |
| security | 実装上の検出問題は修正。HTTP保護header制御やMFA/branch/recovery等はhost/account側の未操作範囲。全安全/侵入試験済みとはしない |
| 実物写真 | 50品とも写真使用許諾は未取得。AI図から仕様や試着を認定しない |
| 検索/端末 | Google掲載/順位/流入は未測定。Chrome emulationを実機Safari/iOSと呼ばない |

0.15の広範囲497/価格314/広告6等と、最後の見出し/Source変更後92・tap4・race12・heading12等は別の段階です。最終公開248HTML/98画像のSHAとSource保持も確認しています。正確な範囲はverificationを読み、全検査を最終版で再実行したと書き換えません。

## 納品物

全sourceは隣接japanese-craft-jewelry-delivery/sourceとlatestのjapanese-craft-jewelry-source.zip。新しい同梱scriptは版付きZIPと外部package-verification JSONも作成します。全件repo/export/ZIP SHAを照合し、ZIP自身hashはZIP外に置きます。新しい件数/最新proof名はdeployment-resultsのsourceDeliveryを参照。

.git/.env/指定した認証ファイル名・秘密鍵拡張子/依存実体/dist/.astro/artifacts/退役画像を除外。自動検査は指定パス・リンク/ジャンクション・ファイル集合・SHAの確認で、任意ファイルの内容やGit全履歴の機密検査ではありません。PNG原本とQA画面は別資料で、fresh cloneのbuildに不要です。元PNG50枚は0.14の別ZIPを保持。task-local Node/pnpm wrapperはこのPC固有の便宜で、他PCはsetupの要件から構築できます。
