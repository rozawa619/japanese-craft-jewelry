# 広告用プライバシー説明 — 0.14

確認日2026-11-17。これは現在の広告停止状態に整合した公開説明と、導入前の条件整理であり、AdSense登録・審査・広告配信・認定CMP接続の完了記録ではない。機械可読の一次資料と判断は[privacy-advertising-v14.json](research/privacy-advertising-v14.json)。

## 今回の変更

日英Privacyへ、現在の処理とGoogle広告導入時の処理を分けて記載した。現在はGoogle AdSense、独自解析・広告追跡タグ、当サイトが設定するCookie、アカウント/入力フォームがない。GitHubによるIP記録、外部リンク先の処理、利用者が選んで表示する埋込みGoogleマップの処理は、広告と区別して説明する。

Google広告を導入する場合のCookie等、Googleとパートナーによる過去の閲覧に応じた広告、URL/IP等の送信、広告配信・測定・不正防止の目的、Googleの利用説明/プライバシーを追加した。非パーソナライズ広告をCookieなしとは説明していない。提供会社は未選択なので架空のvendor一覧を作らず、導入前に実際の会社と情報を表示する方針を記載。

読者の選択はGoogle Partner Ad Settings、DAAのWebChoices、ブラウザのCookie制御へ案内する。これらが全事業者・全端末へ一律に適用されるとも、広告がすべて非表示になるとも書かない。Google/ブラウザの選択と当サイトで求める同意を分け、導入後の拒否・選択・変更/撤回の導線を約束する。現在は広告同意を保存するバナー・同意記録がないことを明示した。

EEA・英国・スイスのパーソナライズGoogle広告は、Google認定かつIAB TCF統合のCMPが必要という適用範囲を記録する。通常のCookieバナーや独自の設定画面だけでGoogle認定と扱わない。認定自体も全法令適合の証明ではない。

## 現在の埋込み地図と広告の違い

店舗欄の初期表示は静的な枠・説明・「地図をこのページで表示」ボタンだけで、地図iframe、Google向けpreconnect、地図のリモート画像を読み込まない。ボタン近くにGoogleへの接続、IPアドレス等の送信とCookieの可能性、言語別Privacyへのリンクを表示する。選んだときにだけ、確認済みURLのGoogle iframeをその店舗欄へ作る。外部のMaps検索・経路リンクと公式店舗案内も引き続き使える。

「地図を閉じる」はiframeを削除する。当サイトは表示選択をCookie、localStorage、sessionStorageへ保存せず、ページを開き直すと未読込へ戻る。現在地も取得しない。閉じる操作は、既にGoogleへ送信された情報やGoogle側のCookieを削除する機能ではない。日英Privacyの`#map-privacy`はこの範囲とブラウザでのCookie削除を説明する。

これは地図の表示選択であり、Google広告への同意、広告の同意撤回、Google認定CMPを実装したものではない。地図を表示しても広告の`mode: off`は変わらない。Google広告/CMPの通信がない検査と、利用者が選んだ後の正規Google Maps通信を混同しない。親ページのCSPは`frame-src https://www.google.com`のみを地図向けに許可し、`connect-src`等を一括で緩めない。

実装の正本は`VisitGuide.astro`、`map-embed-url.ts`、`store-map-embeds.ts`、店舗事実は従来の`visits.json`。HTTPS・完全一致の`www.google.com`・`/maps/embed`・単一`pb`のURLガードを通す。取得元、Googleの一次資料、23店舗×日英46件の登録と代表店舗の実表示検証は[inline-maps-v14](inline-maps-v14.md)とその[調査記録](research/inline-maps-v14.json)を参照する。地図の表示選択だけで全法域の要件充足を認定しない。

## 公開文章と実装の契約

- Privacy EN/JAのfrontmatterと`src/data/advertising-privacy.json`は`2026-11-17-v14`で一致する。共通statusもこの版と停止状態を表示し、schemaとbuild検査が整合を確認する。
- footerから日英Privacyの`#advertising-choices`へ到達できるよう、両言語とも明示的な`<h2 id="advertising-choices">`を置いた。ここは説明/外部設定への案内で、CMP接続済みの同意操作ボタンではない。
- この版の公開冒頭は「現在AdSenseなし」。将来の有効化時には、文面・実際の配信会社・送信先・CMP・保存/撤回方法・更新日/版を一緒に更新する。環境変数やIDだけを変更して広告を有効化しない。
- `advertising-privacy.ts`は`mode: off`、実アカウント/CMP未接続、商用host確認中、広告統合未有効の現在状態に固定する。広告有効化の環境flagも拒否する。これは誤起動防止であり、AdSense接続や認定CMPの代替ではない。
- policyの既存`sourceIds`は実在の4件を使い、今回の再読日/追加資料は本researchへ記録。中央の商品出典台帳へ未登録IDを追加していない。

## 導入前に残る確認

1. 公開先の商用利用条件、AdSenseの申請対象URL・実際のサイト接続・所有確認を完了する。この変更では解決していない。
2. 実際の配信方式/対象地域/広告技術提供者を選び、説明とCMPのvendor設定を一致させる。EEA/UK/スイスのパーソナライズ広告では、現行の認定リストに載るCMPを使い、目的/受領者・拒否・撤回導線・記録を確認する。
3. Cookieを使う非パーソナライズ広告にも必要な同意がある。単にNPAへ切替えて同意不要と決めつけない。制限付き広告等も、適用される現行仕様と法域を別途確認する。
4. 新たに扱うデータの種類、保存期間・削除、国外移転、処理主体/責任と実在する連絡経路、個別の権利対応など、実運営に適用される法域の説明事項を確認する。未提供の本人情報・住所・メールを今回作っていない。ここに記載したGoogle向け要素だけでGDPR等の全義務を満たすとの判断はしない。
5. 広告を実際に導入する版でCSPの必要最小限の通信許可、同意前/拒否/許可/撤回後・再訪問・JavaScript無効時を実測する。現在の地図表示/閉じるの成功を広告の同意試験へ流用しない。認証IDやCookieなどの秘密値を公開repoへ入れない。
6. 導入直前にGoogleの必須コンテンツ・EU user consent・認定CMP・契約者アカウント内の条件を再確認する。AdSense合格や法令適合を確約しない。

## 実施と検証の範囲

広告説明の一次情報を2026-11-17に再読し、日英対応、既存source ID、anchorとpolicy version、外部設定リンクを確認した。後から追加された地図の現在処理も日英Privacyと整合させた。広告のアカウント登録、本人/支払情報入力、CMPの接続、広告同意の収集、広告リクエスト、申請送信はしていない。

- [静的Privacy検査](privacy-depth-stage-static-privacy-results.json)：4/4成功。広告停止lock、264生成HTML、日英説明と版等を確認。
- [最終Chrome検査](privacy-depth-stage-browser-results.json)と[検証説明](privacy-depth-verification-v14.md)：315/315成功。全50商品×日英×3幅の300詳細、Privacy6画面、footer実遷移6件、Cookie/Storage312確認、axe12画面を含む。この検査は地図を開かず、外部通信/広告・CMP通信はいずれも0だった。
- [地図の実表示検査](privacy-depth-stage-maps-results.json)：代表2店舗×日英×1440/320pxの8表示と不正provider拒否、計9ケース成功。初期通信0、明示表示後の実Google iframe、閉じる後のiframe0、再読込時の未読込、自サイトStorageが変わらないことを確認した。全23店舗の実表示を検証した件数ではない。

上記は保存されたローカル実測の範囲。最終の型/本文schema、生成HTML、リンク、画像、公開commit/Actionsと公開URLの実測は[verification](verification.md)・[deployment-results](deployment-results.json)を優先する。ローカル成功を公開確認、AdSense合格、全法令適合へ読み替えない。
