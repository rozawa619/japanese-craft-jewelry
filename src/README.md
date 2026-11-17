# src の編集入口

構成とデータの流れは[architecture](../docs/architecture.md)、日常の変更は[編集手順](../docs/editing-guide.md)を参照してください。起動はトップの[README](../README.md)と[setup](../docs/setup.md)から始めます。

| 変更したいもの | 主な場所 |
| --- | --- |
| 商品の事実・価格・販売先・広告状態 | `data/catalog.json`。日本語の表示文は`data/translations/ja.json` |
| 商品の紹介・選ぶ理由・比較・Q&A | `content/products/`、`data/product-stories.json`、`selection-notes.json`、`product-buying-guides.json` |
| 産地・工芸・工房・方針の本文 | `content/places/`、`content/crafts/`、`content/policies/`。工房の基本情報はcatalog |
| 購入根拠・実店舗 | `data/purchase-evidence.json`、`data/visits.json`。一次出典は`../docs/research/sources.json` |
| AI画像・言語別alt | `data/editorial-images.json`と`data/product-detail-images.json`。実ファイルは`../public/images/`、台帳は`../docs/assets.json` |
| 編集順・産地の代表・公開URL/base | `config/selection.ts`、`config/region-selection.ts`、`config/site.ts` |
| ページ・表示部品・見た目 | `pages/`、`components/`、`layouts/`、`styles/global.css`と部品内の`<style>` |

`lib/`は正本から表示を組み立て、URL・市場・広告・画像・参照を判定する共通処理です。表示上の都合でここへ価格・URL・在庫の別コピーを作らず、既存helper/部品を使います。言語と購入市場、商品事実とAI画像、通常リンクと承認広告は別の情報です。

`pages/`はAstroの静的生成入口で、アプリサーバーや注文APIではありません。ブラウザーの絞込・言語切替・出典開閉・固定CTA・日本地図での産地選択・明示選択後の店舗地図表示だけに小さなJSを使います。出典anchorの制御は`components/Sources.astro`が一度だけ担当します。

`../dist/`、`../.astro/`、`../node_modules/`、`../artifacts/`は編集する正本ではありません。一方`../docs/research/sources.json`や`../docs/assets.json`はbuildの入力なので、docsを一括削除すると動かなくなります。変更後は[検証手順](../docs/verification-guide.md)で対象に合った確認を行ってください。
