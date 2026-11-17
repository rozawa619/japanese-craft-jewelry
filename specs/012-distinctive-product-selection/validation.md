# 012 検証記録

2026-11-17開始。作業前は0.11.0、42公開商品。前版の実測は011およびquality-stageの履歴であり、今回の完了を示すものではない。今回の実測はeditorial-stageの報告へ分けて記録する。

| 要件 | 実装・根拠 | 実測 |
| --- | --- | --- |
| R1 | affiliate-editorial-reference-v12と一次参照 | The Good Trade/Who What Wear/mybestほか。取得可否と観察/非転用の境界を記録 |
| R2 | product-stories/selection-notes/商品本文/catalog訳 | 既存42点改稿、新規8点。50点の日英紹介/decision/比較、100本文各2段落。コピー差分・完全一致重複94/94 |
| R3 | decision構造検査/商品詳細 | 不足/空値/未知フィールド拒否、下書き履歴は維持、公開story取得時もdecision必須 |
| R4 | ChoiceDetails/関連候補の固有文 | 各候補のheadline/chooseForを実データ参照、価格/素材/寸法の再入力なし。日英3幅の実測はeditorial-stage |
| R5 | essential-products-v12/購入証跡/出典/本文/visits | 8点の現行注文確認、富山/三重追加、50公開/14地域/24技法/258出典/23店、通販41/小売9 |
| R6–R7 | verify/browser/links/isolatedads/hosted/export | 静的・価格・広告は下記成功。全体UI/公開/納品の確定値は完了時に追記 |

## 静的・価格・外部

- `pnpm verify`：Astro87files、0 errors/warnings/hints、92/92単体。264HTML、14130href/src、1949anchors、1016通常/0広告、601実行CSP hash、248 inert JSON、14旧読み物移動。退役public10画像をprune。
- 最初の型検査は、draft履歴にdecisionがないことを新型へ強制castできず失敗。保存型はdraft履歴を許容し、公開用storyForの返却前と公開validatorではdecisionを必須とすることで修正。公開の条件を緩めたりdraftへ架空のコピーを補ったりしていない。再実行は上記成功。editorial-stage-static-resultsに記録。
- `check:copy`94/94：旧42点の両言語headline/standfirst/summaryの変更、50点の各主要文の完全一致重複なし。これは意味の独自性・真偽・売上の自動評価ではない。
- 価格browser314/314：50点×日英3幅の300詳細、14地域×6の84価格コンテキスト、海外別市場9点、axe18画面0、JS/console0、入力SHA開始終了一致。
- 隔離広告6/6：関連だけ、海外別市場だけ、下部だけ、停止/URL欠落、不許可host、公開設定/下書き。実catalog/dist不変、通常/広告リンクと開示の対応を確認。
- 外部288URL：279到達、6アクセス制限、2一時的サーバーエラー、1既知hostroot404。**公開商品/店舗の対象81URLは全到達、未解決0**。到達自体を販売/在庫の証拠とせず、8新商品の本文/注文UIと別に記録。
- 写真許諾台帳へ新8点の未取得状態を追加。公開50点の台帳coverageを確認、25AI/27品・文字preview23品、今回の新画像/写真転載なし。

## 編集レビューで修正した点

既存10品を正本の素材/寸法/金具/単位と読み合わせ。新7点は別担当も一次本文と照合し、Sextileの合皮を裏材と割当てる未確認表現を修正。ヱガホを樹脂未使用と暗示せず、銀糸を籐素材/無垢金としない。新8点の本文も採用の内部事情から魅力と装いの2段落へ改稿。アコヤの旧reader20000とfresh22000を切り分けた根拠は研究JSON。Mie JA本文の『一組』は公式の単位明記がないため『一品』へ変更し、broad検証後の差分/再build/対象ページ実測を別記録する。

未実施：実物の試用・取材・比較試験、写真利用許諾取得、新規画像生成、申請/承認、商用ホスト適合の確定・移転、新契約・課金・DNS。技術PASSや文章量を売上/検索順位/AdSense合格の証拠にしない。
