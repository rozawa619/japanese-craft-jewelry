# AdSense申請前の詳細点検 — 0.11調査

2026-11-16確認。監査の基準版は0.10.0（30公開商品）。今回の追加実装後はspec011とverificationの実測を優先する。**情報を増やすだけで合格するという判定はできない。** Googleへの登録、サイト追加、所有権接続、審査依頼、広告配信のいずれも実行していない。

## 先に解決する申請対象URL

[GoogleのURL入力案内](https://support.google.com/adsense/answer/2784438?hl=en)は、申込URLにpath等を含めないと説明し、一般のsubdomainとhost partnerの例を区別する。当サイトの公開先は `/japanese-craft-jewelry/` 配下。通常Chromeで `https://rozawa619.github.io/` は404（Site not found）、プロジェクト配下は200を確認した。

このため、現在の配下URLをそのまま申請できると案内しない。ただし、[GoogleのSites変更案内](https://support.google.com/adsense/answer/12170421?hl=en)はPublic Suffix List（PSL）掲載プラットフォーム上のsubdomainを追加対象に含めている。[PSL公式リスト](https://publicsuffix.org/list/public_suffix_list.dat)の2026-11-15版でgithub.ioとpages.devを実確認した。一般のURL例だけでGitHub Pagesや無料subdomainを全面的に申請不可と断定せず、独自ドメイン購入も必須と決めつけない。実際のサイト受理・root配信・所有権の接続・審査は未確認で別工程。root用リポジトリの新設、ドメイン購入・DNS変更、移転は勝手に行わない。

[サイト追加の公式手順](https://support.google.com/adsense/answer/12169212?hl=en)では実際のサイト接続と審査が別工程。meta、ads.txt、広告コードの選択肢がある。いずれも実際に発行された自分のIDだけを使う。広告コードを貼らずにmetaで所有権を接続する場合も、申込受理や審査通過が自動になるわけではない。

さらに、申請URLの形式とホスティング利用条件は別問題。[GitHub Pagesの公式用途制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)は、オンライン事業や主に商取引を促進するサイトの無料hostingとしての利用を制限している。決済機能がないことだけで、アフィリエイトを目的とする運営が自動的に適合するとは扱わない。法律違反の確定とは区別し、収益化前の高優先の契約確認事項とする。詳細はlegal-audit-v11.md。商用利用を許す配信先への変更を判断する場合も、GitHubにソースを置くこととサイトをPagesで公開することを区別する。

## 内容と導線

[AdSenseの参加要件](https://support.google.com/adsense/answer/9724?hl=en)と[ページ準備の公式案内](https://support.google.com/adsense/answer/7299563?hl=en)は、独自で役立つ内容と分かりやすい導線を求めている。今回実読した要件に、商品・記事・文字の固定最低数を確認していない。「各県5商品」「30記事」「1000文字」等をGoogle必須条件として設定しない。ブログの新設も必須と確認していない。

0.10時点で素材・種類・地域・技法の絞込、日英切替、公式URL、店舗、出典、価格日付、独自の装い提案は存在する。ただし、同じような装い表現が続き、2品だけの地域が多い。競合の単なる仕様・紹介文の翻訳を増やすのではなく、商品固有の違い、比較相手、国内予算からの絞込、地域内の選び分けを優先する。改善の根拠はcompetitive-review-v11.md。

[Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938?hl=en)では低価値・内容のない画面、付加価値のない複製、本文より広告が多い画面、誤操作を誘う広告配置などに制限がある。言語選択だけのroot、旧journal移動口、404、0件状態に一律で広告を載せる設計にしない。現在はGoogle広告なしなので、既にこれらの広告配信違反が起きていると認定したものではない。

[Searchのスパムポリシー](https://developers.google.com/search/docs/essentials/spam-policies)は付加価値の乏しいアフィリエイトや量産を扱う。これは検索ポリシーで、AdSenseの合否判定と同一ではない。[有用な内容の自己点検](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)も、検索用の水増しを避け、調査・比較・著者/作成方法を正確に示す方向。AI使用そのものを一律禁止と解釈しないが、短いAI注記や出典表記だけで独自価値や画像の正確さが立証されるわけでもない。

## 広告を有効にする前の条件

| 項目 | 現在 | 導入前に残ること |
| --- | --- | --- |
| 所有者・申込情報 | 公開名SORA。年齢/支払情報は未確認 | 実際の契約者情報・年齢要件等を本人が確認。架空の住所/メール/IDを入れない |
| Privacy | 現状の独自解析/広告タグ/Cookieなしを説明 | 実際のGoogleデータ送信・Cookie等・第三者・目的・Google案内を、導入内容に合わせて更新 |
| EEA/UK/スイス | Google広告を送信していない | [Google認証CMP/TCFの要件](https://support.google.com/adsense/answer/13554116?hl=en)と配信方法を確認。Googleの認証は全法令適合の保証ではない |
| CSP/通信 | connect-src/frame-src等を厳しく制限 | 広告導入を独立変更として扱い、必要origin・CMP・同意前後を検証。安易な全許可やunsafe設定へ緩和しない |
| 広告位置 | AdSenseコードなし | 最初の有益な本文を押し下げず、購入CTA/言語/メニュー/追従CTAとの誤クリックを避ける。画面種別ごとに除外 |
| ads.txt等 | 個人IDなし | 実発行IDと対象ドメインrootを確認し、Googleが案内する接続方法の実配信を確認 |
| 運営者・連絡先 | SORA/About/方針、Contactはユーザー意向で非公開 | 今回読んだ案内で独立Contactページを一律必須とは確認していない。実規約・審査から要求された場合に、実在する窓口で対応を判断 |
| 内容の継続性 | 初期の調査版 | 商品・公式URL・価格・店舗と出典の日付を保守。訪問/着用していないことを隠さず、根拠のある情報を更新 |

現時点の結論は「内容を改善しながら申請前の技術・契約条件を確認する段階」。Googleアカウント内の個別評価・受理・合否は未確認。審査可能性の数値や合格確約、商品数だけによるReady判定はしない。

## 0.11の内容改善後の確認

最終版は購入経路を再確認した42商品。全品に素材・技法・形による独自の選択メモと実掲載品との比較を用意し、国内予算による絞込、地域内の選び分け、公式の実物写真への通常リンクを追加した。紹介のみで購入経路を確かめられない品は公開数に含めない。ブログや架空のレビュー、未確認の着用経験は追加していない。

日英・1440/390/320pxの内容と動作は `quality-stage-browser-results.json` で437項目、国内外市場の価格と導線は `quality-stage-prices-results.json` で73項目が合格した。確認対象には0件状態、言語切替、出典に基づく比較、公式URL、公開を保留した6点の除外が含まれる。これはブラウザで表示・データ対応が正しいという証拠であり、Googleが独自価値を十分と判定した証拠ではない。

申請URLの受理、root配信、所有権接続、GitHub Pagesの用途制限、実際の広告/CMP/Privacy設計は上表の条件として残る。許諾を得た実物写真や実取材がない点も変わらず、短いAI表示だけで画像の正確さや独自性を担保したと扱わない。申請や広告送信は未実施。

公開後の再検証も `quality-stage-hosted-browser-results.json` で437/437項目合格した。これは今回の改善が公開先でも動くことの確認であり、申請対象URLやホスティング用途制限、Google側の受理・審査に関する残条件を解消したという意味ではない。
