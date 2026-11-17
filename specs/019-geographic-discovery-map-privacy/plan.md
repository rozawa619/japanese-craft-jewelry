# 設計と作業分担

地域表示はRegionSelectionから独立したJapanJewelryMapへ。利用条件を確認した47県geometryをローカルdataへ保存し、公開catalogと編集上の代表商品を組み合わせる。出典/ライセンス/元SHAと抽出方法はdocs/japan-map-v17.md。商品/産地/画像/地図形状を別の正本として保つ。

Googleマップは既存Share registryとURL gateを継承する。map-preferences.tsが厳密な版/choice/日時/期限を検証し、map-preferences-client.tsが全panel・Privacy設定・storage event/expiryを一元管理する。初期HTMLに外部iframeを置かず、有効な明示選択後だけ生成する。30日は法定期限ではなく運営上の選択。有効期限/旧版/破損値は読み取り時に削除、Storage拒否時はページ内だけで機能する。

VisitGuideの地図側を約半幅/最大560px、実地図330px高（狭幅280px）へ拡張。Google表示へボタン等を重ねない。撤回は全iframeを除去し、以後のページでもオフ。ブラウザ/Google側の保存済みデータを消すと説明しない。

法務/残作業/地図を並行で調査・実装。rootが同意・Privacy・統合/検証/公開を担当。buildは一つ、ブラウザー検証中はdistと入力を固定する。旧0.16の証跡は保持し、discovery-map-stageの新報告へ記録する。

互換ホスト用public/_headersは移転準備として生成物へ同梱する。GitHub Pagesでレスポンスヘッダーが有効になったとは扱わない。移転先作成・契約・DNSは行わず、必要な入力と検査を文書化する。
