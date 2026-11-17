# 012 検証記録

2026-11-17開始。作業前は0.11.0、42公開商品。前版の実測は011およびquality-stageの履歴であり、今回の完了を示すものではない。今回の実測はeditorial-stageの報告へ分けて記録する。

| 要件 | 実装・根拠 | 実測 |
| --- | --- | --- |
| R1 | affiliate-editorial-reference-v12と一次参照 | The Good Trade/Who What Wear/mybestほか。取得可否と観察/非転用の境界を記録 |
| R2 | product-stories/selection-notes/商品本文/catalog訳 | 既存42点改稿、新規8点。50点の日英紹介/decision/比較、100本文各2段落。コピー差分・完全一致重複94/94 |
| R3 | decision構造検査/商品詳細 | 不足/空値/未知フィールド拒否、下書き履歴は維持、公開story取得時もdecision必須 |
| R4 | ChoiceDetails/関連候補の固有文 | 各候補のheadline/chooseForを実データ参照、価格/素材/寸法の再入力なし。日英3幅の実測はeditorial-stage |
| R5 | essential-products-v12/購入証跡/出典/本文/visits | 8点の現行注文確認、富山/三重追加、50公開/14地域/24技法/258出典/23店、通販41/小売9 |
| R6–R7 | verify/browser/links/isolatedads/hosted/export | 静的/価格/広告/全体UI/最終公開と納品を完了。確定値は下記と各report |

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

## ローカル全体と最終の調整

- focused497/497：50品×日英3幅300詳細、地域種類222往復、axe36画面0、JS/console/外部要求0、掲載入力8ファイルの開始終了SHA一致。6draftの日英12URL404と264HTML/sitemapへの非残存を確認。
- 維持全体455/455：420画面訪問/138経路、全50品と14地域、商品詳細306確認（最長品の重複6を含む）、地域84、axe402画面0、74画像、JS/console0、7入力SHA一致。
- 価格314/314、隔離広告6/6、外部の対象81URL全到達は上記のとおり。これらのbroad実測後に、Mie JA本文の一組→一品、decision見出しのbalance/320px23px、地域見出しのbalance/strictという最小の調整を行った。broadを最終調整後に全走査したと読み替えない。
- 調整後の型/単体/本番生成は87files0/0/0・92/92・264HTMLで成功。最後のCSS strict追加後も本番再生成/全生成リンク・CSP検査を完了。最終20重点（Mie日英3幅＋14地域JA320、axe8画面0、JS/console0）と新Chromeの4画面目視も成功。
- 全296生成ファイルをbefore/after SHA比較。CSS1入替、264HTMLの変更を記録。235HTMLは既知の共通stylesheet名/CSP style hashだけを元へ戻すと元SHAと完全一致、残るMie JA1ページ/地域28ページは予定の本文・scoped style差分。想定外0。CSP/script-srcや本文全体を無条件に正規化した検査ではない。初期の『商品/地域HTMLだけが変わる』という検査仮定はAstroの共通style CSP更新を考慮できず失敗し、旧3CSSのSHA一致を確認したうえで既知のstyleメタデータのみの逆置換へ修正した。
- 集計補助をverify完了前に動かした1回は成功と扱わず、exit0回収後に静的記録と最終差分を確定した。各reportのcompletedAt/recordedAtを優先する。

最終の生成物差分はeditorial-stage-final-build-delta、重点20はfinal-copy-results、目視4はfinal-visual-results。公開後の全50品/3幅検証は別のhosted reportに記録する。

<!-- v12-final-hosted -->

## 最終公開

アプリ9da1bfb8f671107debb16293e73eea3d50f0924c、Actions43998680246は2026-11-17T01:52:06Zにsuccess。公開focused497/497、全50品300詳細/地域222往復/axe36画面0、JS/console/外部要求0。補足24/24は正規248URL全200/25画像全200・SHA一致。除外22/22は6draftの日英12URLと退役10画像404。最終重点20/20はMie日英3幅と14地域JA320、axe8画面0。掲載入力8ファイルはローカル/公開および各開始終了SHA一致。最終公開のdecision/富山見出しも別担当が目視。

最終ソースZIPと展開元の全ファイル集合/全件SHA256、版0.12.0、50公開decision、25公開画像、必須設定/CI/仕様/調査/検証と退役public10/秘密等の除外は、隣接delivery/package-verification-0.12.0.jsonへ記録する。ZIP自身のSHA256をZIP外へ置いて自己参照を避ける。

納品照合は577/577ファイル全件で一致、公開50点の日英decision/公開画像25、必須14パス、退役public10の除外を確認した。完了印を含む文書を入れた最終ZIPも再照合し、最新SHA256を外部JSONへ記録する。全QA/補助workerは正常終了回収済み。
