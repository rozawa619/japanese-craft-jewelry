# 042 点検と公開の記録

**v0.29.2** は2026-11-27 10:36 JSTにGitHub Pagesへ公開した。 [配信記録](https://github.com/rozawa619/japanese-craft-jewelry/actions/runs/45923380473) · [日本語](https://rozawa619.github.io/japanese-craft-jewelry/ja/) · [English](https://rozawa619.github.io/japanese-craft-jewelry/en/)

| 確認 | 結果 |
| --- | --- |
| 旧公開版の画像 | 着用174枚・単体176枚を一覧で目視し、該当画像と修正版を実寸で確認した |
| 最終ビルド | 159テストが成功。916 HTML、900正規URL、着用173枚と単体175枚を検査した |
| レイアウト | Chromiumで日英9画面を320・390・720・768・1024・1440pxで表示。108表示で横はみ出し、読み込みエラー、スクリプト例外を検出しなかった |
| 操作と画像 | 320・390・1440pxの日英で計60件を確認。6商品画像の元比率と着用画像のラベル、SORAのサムネイル、地図と旅先検索、言語切替での条件保持、絞り込みの解除、予約案内を含む |
| 公開URL | 日英のトップ・プロフィール・産地・一覧・商品詳細・修正画像・京都の原本2枚を含む38応答がビルドのSHA-256に一致。対象4ページと退役6画像の公開URLは404を確認した |
| 実機 | スマートフォン相当はChromiumの画面幅を使用した。iPhone実機、Safari、SNS内ブラウザーは未検証 |

旧販売先の404は2026-11-27にHTTPSで再確認した。島根の出雲・松江の案内と、国内の価格順で残る2点に移動できることを確認した。 [島根のページ](https://rozawa619.github.io/japanese-craft-jewelry/ja/places/shimane/)

島津薩摩切子の金赤ルリは、公式掲載の税込24,200円と予約問い合わせの案内を確認した。商品詳細とスマートフォンの固定欄で、購入リンクが予約案内を表示する。予約の受付状況と納期は公式ページから確認できる。 [商品詳細](https://rozawa619.github.io/japanese-craft-jewelry/ja/objects/shimadzu-satsuma-kiriko-hikari-l-pendant/)

[ビルドと公開応答のハッシュ](../../docs/site-visual-v42-build-manifest.json) · [着用画像の生成記録](../../docs/image-generation-styling-v42.json)
