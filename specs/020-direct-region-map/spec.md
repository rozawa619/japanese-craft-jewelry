# 020 日本地図を大きくし、県から直接商品へ進む

2026-11-17。開始repo HEAD83205bb8、公開アプリ0.17.0/b8edee4。ユーザーの最新依頼は「日本地図をもう少し大きく」「そのままクリックできるように」。旧019のtap→preview→CTAの二段階を更新し、アプリ0.17.1として反映する。

- R1 PCの地図表示を広く大きくし、小さな県を選びやすくする。小画面でもページ全体を横にはみ出させず、地図の拡大/縮小/全体表示と内部スクロールを用意する。
- R2 掲載県のクリック/タップ/Enterは通常のhrefでその産地の商品一覧へ直接進む。JavaScriptのclick横取りやpreviewへの強制scrollを行わず、修飾click/JSなしの通常リンクも維持する。
- R3 hover/focusと地域selectは代表商品previewに使う。24県の画像/商品数/国内参考価格と行き先の所属を維持し、zoom controlsは44px以上、keyboard/focus/縮小端/全体resetを確認する。
- R4 home/objects/placesの日英を揃え、TOP10の順、DISCOVER3、47県形状/未掲載非リンク、商品60/24県/118画像と価格・公式URLを維持する。店舗Google Mapsの30日同意・Privacy・広告offは変更しない。
- R5 型/単体/build/CSP・新操作の実遷移・戻る・JSなし・hover/focus/select・zoom/pan・PC/スマホを実測する。旧193件のpreview操作を新しいクリック遷移の検証と呼ばない。
- R6 仕様/設計/タスク/実測/最新引継ぎを更新し、Git/Actions/実URL/全source ZIPを照合する。未検証の公開や納品を成功扱いにしない。

## 追加依頼：ホーム先頭とTOP10

作業中に、ホーム先頭を左の女性着用イメージ/右の日本地図へ変更し、県選択で女性画像を切り替える追加依頼を受けた。TOP10の人物画像も大き過ぎるためコンパクトにする。これは既存の大きな一覧地図の直接リンクと異なる、ホームHero専用の選択機能として扱う。

- R7 新RegionHeroをホーム先頭へ配置。初期はselection.heroProductIdの既存モデル画像/産地を使い、24掲載県の代表商品に紐づく既存人物画像へ、click/tap/Enter/Spaceの明示選択で切り替える。hover/focusだけでは切り替えない。画像は元比率/containで顔や耳を切らず、AIcaptionを常時表示する。
- R8 選択に応じfigure asset/preserveRatio・画像src/alt/寸法・商品タイトル/URL・国内価格metadata/単位・産地CTAを揃える。商品情報カードは各県分を正本と共通MarketPriceから事前生成し、選択県のカード1件だけを表示する。画像DOMは1枚だけを更新する。
- R9 Hero選択は有効な地域idだけをregion queryへreplaceStateで反映し、他query/hashとhistory.stateを保持。初回query/戻るを復元し、不正idは既定産地へ戻す。既存言語切替で同じ地域/女性を維持し、強制転送やStorageは追加しない。JSなしでは初期モデルと全地域への通常リンクを保つ。
- R10 TOP10の行/人物画像をコンパクトにし、順位・地域名・代表商品・価格の導線を維持する。Hero・TOP10・大きい一覧地図の役割を混同しない。RootがTOP10の実装/検証を担当する。
