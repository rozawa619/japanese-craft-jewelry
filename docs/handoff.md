# 引継ぎ

2026-11-16。別のAIはまずAGENTS.md→constitution→spec/plan/tasks→本ファイルを読む。

## 現在地
英語メディア **ITO — Objects with a story.** の初期版。商品9件、独自ガイド4本、産地1、技法1、工房/不明メーカーの透明性記録2、方針5。27HTMLの静的生成。販売/カート/決済/発送/解析/会員登録なし。

- GitHub： https://github.com/rozawa619/ito-craft 。新規公開repo作成を画面と公式APIで確認、Issues有効。
- 公開preview：https://rozawa619.github.io/ito-craft/en/ 。GitHub Actions run 43821352419成功、HTTP200。preview/noindex。公開先8画面・内部30URL・404等を検証、18/18 PASS。
- ローカルpreview： http://127.0.0.1:4321/en/ 。起動中セッション終了後はpnpm build→pnpm previewで再開。
- GitHubへの全96ソースファイル格納をcommit 234201bで確認。PagesのSource: GitHub Actionsを保存済み。最終コード6973e2eの公開処理成功。実結果はdocs/deployment-results.jsonを参照。プレビューと正式検索公開・申請承認は別。
- 正式公開設定：preview/noindex。個人の運営者名/公開用メールは未提供。架空値なし。実在するGitHub Issuesが訂正窓口（GitHubアカウント必要）。
- 提携：全件not_applied。広告URL0。神奈川商品とBECOSの提携関係なし。
- 画像：商品写真の許諾なし・使用なし。全件、自作の非実物図柄。画像台帳に不足と取得対象を記録。

## 商品
浜松屋5件はKanagawa workshop association（商品単位の製造地認証ではない）。18Kピアス/かんざしは確認時欠品。丸山4件は地域販売店が扱う商品でメーカー/製造地未確認、地域filterは空。価格・金具・寸法・重量・配送の不明は保持。詳細inventoryとsourcesへ。

## 運営者が決めること
1. ITOという仮称と運営責任の公開表示を確定。商標/ドメインの専門調査はしていない。
2. GitHub窓口を継続するか、実際に受信する公開メールを設定。GitHubの公開投稿に個人情報を書かせない。
3. 正式な検索公開を行うURLと公開modeを設定しreadiness/verifyを実行。Pages自体の公開成否はdeployment記録で確認。
4. BECOSに日本居住可否、商品別適用、深いリンク、計測/支払、素材権利、禁止事項を照会し、実条件に同意できる場合だけ申請。申請送信は未実施。
5. 収益化のためBECOS等にある別の商品を独立に一次調査して追加。現在9商品へ無関係なBECOS広告URLを割り当てない。
6. 実物写真を加える前に商品ごとの書面許諾または契約に沿う素材を取得。写真がない現状は明示済み。

## 次の操作
商品/工房追加、地域/技法追加、記事/価格更新、広告承認/停止、ブランド/言語変更、公開更新はdocs/operations.mdに手順。specsの要件IDを変更記録と結び、pnpm verifyを必ず実行。重要変更はbrowser/ad fixturesも必要な範囲で再実行。

## 重要な制約
BECOS最大10%は募集の上限で当サイトへの保証ではない。Millenniumの旧ShareASale経路は現行性に疑義、初期不採用。全世界配送/アレルギー安全/実測軽量/レビュー/訪問取材実績を追加しない。

## 納品時の確定状態

実装完了・GitHubソース保存完了・オンラインpreview公開完了。正式な検索公開/申請準備完了/提携承認ではない。型0errors/0warnings/0hints、29テスト、27HTML全内部リンク、ローカル21画面41項目、地域/技法4項目、隔離広告4ケース、hosted18項目とスマホJPY/税区分表示を確認済み。最小の判断項目はdocs/user-checklist.md。
