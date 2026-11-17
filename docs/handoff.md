# 引継ぎ — 0.12 商品固有の選ぶ理由と8商品の追加

更新日2026-11-17。AGENTS → constitution → specs/012-distinctive-product-selection/ → 本書 → operationsを読む。前版はarchive/handoff-v11.mdとarchive/deployment-results-v11.json。実配信の成否・アプリcommit・Actionsは最新deployment-resultsを優先し、過去の成功を流用しない。

## 今回の変更

SORAの日英工芸ジュエリーセレクト。The Good Trade / Who What Wear / マイベスト等の実ページから一般的な選択支援の構造を参照し、既存42商品の見出し・冒頭・本文・カード・選択メモを日英で改稿。白シャツ/ニットの一般論から、その品の素材・形・モチーフと比較時の取捨選択へ変えた。新8点の本文も日英各2段落に整えた。

ProductStoryはheadline/standfirst/highlights3件/outfitに加え、decision.bestFor/considerが日英で必須。SelectionDecisionはhero直後に表示する。ChoiceDetailsは実掲載候補の固有見出しとchooseForを先に出し、種類/素材/寸法/価格を正本から参照する。人気順位・星・未試着の感想を作らない。カードは『選んだ理由を見る』から詳細へ進む。

能作2、水引1、友禅1、久留米絣1、SIRI SIRI七宝/銀糸2、伊勢志摩アコヤ1の8点を追加。現在50公開/全56商品、14地域、24公開技法、258出典記録。25AI画像が27品、23品は文字previewと公式実物へのリンク。今回画像生成・写真転載なし。全国一覧の前方に新しい素材/技法を混ぜ、木だけが続く順序を減らした。

## 購入経路と価格

購入証跡はpublished50と一致。41品は注文受付、9品は営業中小売＋現行価格付きカタログ。23店舗を43品へ案内し、7品は公式通販/店舗案内へのfallback。店頭の個別商品在庫、将来の受付・注文成立は保証しない。

正茂の孔雀はイヤリングvariantだけを採用し、欠品中ピアスに受付を流用しない。アコヤはfresh Chromeで現行商品/一覧とも税込22000を確認、readerの古い20000不採用。こよりみはMOCADの確認済み対象品で、別サイト/別仕様/外貨価格を流用しない。貝パールと養殖アコヤは別素材。合皮を裏材と決めつけず、ヱガホを無樹脂と宣言せず、SIRIの銀糸を籐/無垢金と扱わない。

富山/三重は実商品と非空の地域本文を追加。SIRIは東京発ブランドと全国の職人を区別し、全工程東京製としない。ヱガホは久留米絣の素材が分かっても工房所在地未確認なのでprefectureIds空。丸山4品も製造地を神奈川と推定せず地域小売枠。都道府県所属の合計が全商品数に一致しなくても正しい。

箔一はfresh503の公式停止表示で保留。こよりみSTORESの別品は403を閉店/欠品とせず保留、松井真珠/長崎べっ甲等も調査限界を記録。COCOON2/明示欠品18K/畠山2、従来hairpinはdraft維持。復帰は現行購入の再確認と派生参照更新が必要。

## 正本と調査記録

- catalog/ja：商品事実・価格・表示文。priceUnitは根拠がある場合だけ。日本向け実価格を両言語の主表示、海外実価格は別枠、FX換算なし。
- product-stories/商品MD：独自の見出し・冒頭・装い・decision・本文。sourceのない性能/着心地/レビューを作らない。
- selection-notes：商品固有の違い・chooseFor・公開比較ID。価格/URLは複製しない。
- purchase-evidence/visits/sources：現行注文または小売根拠・公式URL・確認日・店舗/固定Maps。HTTP200やvalidatorだけで在庫確認済みとしない。
- affiliate-editorial-reference-v12、editorial-copy-review-v12、essential-products-v12とresearchの同名JSON：一次観察、採否、編集の限界。
- existing-summary-patch/new-editorial-entriesは実装時の提案履歴。統合時の表現修正はeditorial-integration-v12。更新時の別正本にしない。
- editorial-baseline-v11は比較用の固定コピー。check:copyは実改稿と完全一致重複の補助検査で、意味上の独自性・事実・売上を証明しない。

## 維持する条件

ブログ/Contact/販売決済/独自計測広告タグなし。右上の1言語ボタンで同じページ/query/hashを維持。広告はプログラム/商品リンク両方の承認、許可host完全一致、HTTPS/date/localeが揃う場合だけ切替。今回は全not_applied/通常リンクで、申請/承認/広告送信は行っていない。

法務15論点の011監査と商用ホスト/AdSense残条件を継承。GitHub Pagesの用途制限について適合確認または適切な配信先の選択が未解決。移行準備はあるが契約/課金/ドメイン/DNS/配信移転は未実施。AdSenseの登録URL/root配信/所有確認/本人情報/Privacy/CMP/CSPも未完了。商品数・技術PASSを適法/許諾/契約適合/合格に読み替えない。

## 検証と納品

今回の型/単体/生成物/日英全商品/全地域/価格/広告/外部/公開はeditorial-stage各reportと012validationへ分けて記録する。quality-stageは011、market-stageは010の履歴。維持用コマンドはREADMEとoperations。実際の完了件数・時刻は機械可読reportとdeployment-resultsを参照。

全ソースは隣接japanese-craft-jewelry-delivery/sourceとZIPへ書出す。必要設定/CI/lock/仕様/出典/全ソース/最終検証/25公開画像を含め、.git/.env/認証/node_modules/dist/artifacts/無許諾の内部参照写真/退役public10画像を除外する。最終のZIPファイル集合・全件SHA256・版・除外・必須ファイルは同所package-verification-0.12.0.jsonを証跡とし、ZIPの自己hash参照は避ける。
