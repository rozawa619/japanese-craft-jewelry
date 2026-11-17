# 0.14 店舗内の小さなGoogleマップ

確認日2026-11-17。商品紹介ページの公式URLは説明のあるリンク名へ変更した。店舗欄にはGoogleが提供する公開埋込み地図を追加し、既存23店舗・出典・日英の公式案内とMaps検索/経路リンクを保つ。店舗情報、商品の在庫、Googleの地図上の情報は別に扱う。

## 根拠と範囲

[Google Mapsヘルプ](https://support.google.com/maps/answer/7101463?hl=en)が案内する「共有→地図を埋め込む」のHTMLからiframe URLだけを取得した。[Geo Guidelines](https://about.google/brand-resource-center/products-and-services/geo-guidelines/)のWeb and appsは通常のウェブ埋込みには個別許可を求めておらず、Google/データ提供者の帰属表示を保つよう求める。統合的な商用地図サービス向けAPIとは区別する。[Maps追加規約](https://www.google.com/help/terms_maps/)も確認した。これは現在の一次資料に基づく実装範囲の判断で、将来を含む全面的な合法性や広告審査を保証するものではない。

23店舗×日英46件のURLを`src/lib/store-map-embeds.ts`に置く。店舗事実は従来のvisitsが正本。施設内の店舗ではミュージアム・ホテル・建物など掲載店が入る施設の地図になる。長い検索語で広域の検索地図となった試行や北一のShareボタンtimeoutは不採用とし、施設名を短くして場所を選択し直した。各URLの取得方法・再試行・限界は`docs/research/inline-maps-v14.json`へ記録した。

浜松屋はfresh Chromeで公式店舗ページを読み、畑宿138、主店電話、別の支店電話、各最寄りバス停を区別した。Google検索側の227や一時休業表記から公式の住所や営業状態を上書きしていない。曖昧な検索地図ではなく、工房公式店舗ページに実際に掲載されたGoogle iframe URLを日英とも原文のまま採用する。地図内のGoogleの表記はGoogle側で変化しうるため、公式店舗案内も常に残す。

## 外部送信前の表示選択

初回は静的な枠・説明・「地図をこのページで表示」ボタンだけで、iframe、リモート画像、Google向けpreconnectはない。押した時点でURLを再検証し、その場に本物のGoogle iframeを作る。地図内のGoogleロゴ、帰属表示、規約等のUIを隠したり、別のデザインで置き換えたりしない。地図のスクリーンショットやレビューをサイト資産として転載しない。

[Google Privacy Policy](https://policies.google.com/privacy?hl=en)は埋込みMapsを対象に含み、サービスへの接続でIPアドレス、ブラウザー情報等が送信され、Cookie等が使われることを説明している。枠の下に短い説明と日英Privacyへのリンクを置く。「地図を閉じる」はiframeを削除する。当サイトはこの選択をCookie/LocalStorage/SessionStorageに保存せず、再読込でoffになる。既にGoogleへ送信された情報やGoogleが保存したCookieを消す機能ではない。広告用の同意やGoogle認定CMPとは別のMaps表示選択である。

## 実装と更新

- `VisitGuide.astro`: 名前付き公式リンク、店舗内レイアウト、表示/閉じる。desktopは320×230、mobileはカード幅×210。
- `map-embed-url.ts`: HTTPS、`www.google.com`、`/maps/embed`、単一の`pb`だけを許可。任意のiframe、APIキーURL、追加queryや不正文字を拒否。
- `store-map-embeds.ts`: 調査済みのURLをstable store IDと言語で参照。未登録は`null`として既存外部リンクへ。
- 親ページのCSPは`frame-src https://www.google.com`。親の`connect-src`や画像ホストをGoogle向けに拡張する必要はない。
- DOM: 親`data-inline-map`、表示`data-load-map`、閉じる`data-close-map`、表示後iframe`data-inline-map-frame`、格納`data-map-canvas`。既存公式/店舗/Maps linkのdata属性も維持する。

新店舗は公式で実在小売の所在地を確かめてから、Googleの共有→地図を埋め込むで対象場所を選択する。広域検索の地図を誤って貼らず、施設内店舗の場合は施設と店舗の関係を確認する。URLをregistryへ登録し、日英・PC・320pxの表示、Googleの帰属表示、クリック前の通信0、閉じる/再読込、通常の外部リンクを検証する。APIキーや課金が必要となる機能へ勝手に切り替えない。

## 検証状態

URLガードと全23店舗×日英のselected-place registryを検証するunit 2件PASS。Astro checkは112 files、0 errors/0 warnings/0 hints。初回buildは親担当の商品単体AI画像の統合途中で必須画像の欠落により失敗したため、mapsの成功として扱っていない。生logは`artifacts/maps-build-v14.log`。

親の全50単体画像統合とverify成功の通知後、`scripts/check-inline-maps.mjs`を安定previewで実行した。`CHECK_BASE_URL=http://127.0.0.1:4322`、`CHECK_REPORT_PATH=docs/privacy-depth-stage-maps-results.json`を指定し、浜松屋と箱根丸山×日英×1440/320の8表示と、不正provider拒否の計9ケースがPASS、failures0、exit0だった。

全8表示で、クリック前のGoogle通信0、キーボードの明示表示、実地図と帰属表示、閉じる後のiframe0、自サイトStorageの変更なし、再読込後のGoogle通信0、名前付きリンクと外部fallback、横はみ出しなしを確認した。浜松屋JAと箱根丸山ENのPC/320pxの4スクリーンショットを直接実見し、Googleロゴ、地図データ©2026 Google、規約が枠の端まで見えることを確認。Google側の地図画像を加工/転載した実装ではない。スクリーンショットは`artifacts/inline-map-*-v14.png`の私的QA証跡で、公開地図の代替画像として使わない。

名目320×230の枠はborderを含み、実iframeは318×228。320px画面では248×208となる。初回検査はborderを除いた寸法も名目寸法と完全一致させていたため4ケースが失敗し、途中で中止した。生結果は`docs/privacy-depth-stage-maps-first-attempt-results.json`、logは`artifacts/inline-maps-browser-v14-first-attempt.log`へ保持した。UI/データを変更せず、検査のみ±2pxを許容して全件をfresh contextで再実行した。結果を成功で上書きして初回失敗を消していない。

全23店舗×日英の取得と形式/selected-place検査、代表2店舗の実表示検査は区別する。全店舗の地理的正確性や現在の営業・在庫を新たに認定した記録ではない。浜松屋は工房公式のpb原文を保つ。Google内のコントロール/地名の言語は閲覧環境等で変わり、サイト側の言語ボタンで固定するものではない。サイトの表示ボタン・店舗文・Privacyは日英で切り替わる。Google側の地域制限・同意画面・通信障害等で表示できない場合にも、公式案内/外部Mapsリンクを使える。

## 公開後の確認

アプリcommit `f7805ed9489706d08743da4b8091f2a154ff7131`のGitHub Actions `44016172889`成功通知後、2026-11-17にfresh Chromeで公開先を確認した。`CHECK_BASE_URL=https://rozawa619.github.io`、`PUBLIC_BASE_PATH=/japanese-craft-jewelry/`を使い、runtimeや公開データを変更せず同じ検査scriptを実行した。

- [公開Maps結果](privacy-depth-stage-hosted-maps-results.json)：04:19:24.012Z〜04:21:42.743Z、9/9成功、失敗0、終了コード0。浜松屋・箱根丸山×日英×1440/320pxの8表示と不正provider拒否を確認。表示前と再読込後のGoogle通信0、キーボードによる明示表示、実Google地図と帰属表示、閉じた後のiframe0、自サイトStorageの不変、外部fallbackと横はみ出しなしを確認した。
- [公開メタ結果](privacy-depth-stage-hosted-publication-metadata-results.json)：04:19:23.214Z〜04:19:35.272Z、1/1成功、失敗0、終了コード0。日英の公開canonical、`index, follow, max-image-preview:large`、取り下げた髪飾りとContactの404等を共通assertionで確認した。地図23店舗すべての実表示や検索掲載を確認した件数ではない。

公開側の8スクリーンショットをすべて目視した。箱根丸山JA320の自動撮影はGoogle内の文字の描画前に撮れていたため、その画像を保持し、別のfresh contextでGoogle iframe内の`document.fonts.ready`完了と短い描画待機後に補足撮影した。補足画像では「マップで開く」、Googleロゴ、地図データ©2026 Google、利用規約が見え、地図下の送信説明・Privacy・閉じるも枠内に収まった。他7枚も地図と帰属表示が見える。浜松屋のEN表示ではGoogleの英語コントロールと日英の地名表記を実見しており、Google内の言語を日本語固定とは扱わない。

撮影前に既存ローカル8枚を`artifacts/local-inline-map-*-v14.png`へ退避し、コピーのSHA256一致を確認した。納品の私的QA証跡には同じローカル8枚を`artifacts/privacy-depth-stage-local-map-*-v14.png`、公開8枚を`artifacts/privacy-depth-stage-hosted-map-*-v14.png`へコピーした。元reportのscreenshot pathは変更していない。補足は`artifacts/privacy-depth-stage-hosted-map-hakone-maruyama-main-ja-320-paint-ready-v14.png`、観測記録は`artifacts/privacy-depth-stage-hosted-map-paint-review-v14.json`。これらは地図タイルを含む確認証跡であり、公開サイトの画像資産や埋込み地図の代替として使わない。店舗への問い合わせ、商品の注文、経路検索の送信、アカウント登録はしていない。
