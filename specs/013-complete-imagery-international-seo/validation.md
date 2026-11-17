# 013 検証記録

2026-11-17開始、基準0.12.0（アプリ9da1bfb、最終文書9a87074）。旧版の成功を今回へ転用しない。今回の実測はvisual-seo-stageへ分ける。

画像：既存25ファイルで27品をカバー、23品不足。新規23画像の生成/参照/寸法/圧縮/AI metadata/全50coverage/旧画像非破壊/元比率表示を確認する。

検索：現状JA/ENの固有URL、canonical/hreflang/sitemapはある。海外検索のインデックス・流入・順位はSearch Console未接続で未確認。実装の改善と掲載実績を区別する。

最終の実行結果・公開アプリcommit・Actions・画像/メタのHTTP確認・納品検査は完了後に追記する。申請/審査/収益/検索流入/適法・許諾の保証は行わない。

## 公開前の確定実測

不足23を生成し、48画像/公開50商品のcoverageを確認。旧25ファイルのSHA保持、全50をpreserveRatio:trueへ統一、新23の1536×1024/WebP/AI XMP/生成記録と元PNGを保存。公式写真22件を内部で実見、Nanaoだけ画像403のため本文範囲の概念像として限界を記録した。

最終pnpm verifyは95files 0error/warning/hint、102/102単体、264HTML/14744参照/1949anchor/1016通常0広告/601実行CSP hash/248JSON、旧journal14/退役画像10除外。画像gate49/49、48ファイル計4160080bytes、警告0。SEOは248canonical/相互hreflang/sitemap一致、100商品ページ/100AI ImageObject、16noindexを確認。readinessは技術設定のみPASS。

手動QAで旧画像の顔端cropを発見し全50へ元比率表示を適用。再生成後、最終画像320/320（300詳細・858画像枠・axe30画面0）、46再撮影は目視済み版とSHA全一致、18配置目視PASS。最終quality497/497（300詳細・地域222往復・axe30画面0）、JS/console/意図しない外部要求0。pre-polishの320/497は別名の履歴へ分離。途中のbilingual全体検証はpolishのため停止し、成功実績にせず再実行中。

隔離広告6/6は元比率flag統一前に完了。実catalog/dist不変を確認しており、以後は画像flagのみの変更でresolver/広告/価格/リンク事実は変えていない。最終公開と維持全体・納品の実測は追記する。
