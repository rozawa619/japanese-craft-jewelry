# 設計・対応

| 要件 | 実装 | 検証 |
| --- | --- | --- |
| R1 | RegionalChoiceGuide・home type-links、公開product+product-detail-images | 実産地/種類に属する代表・lazy image/contain/alt/AI、query/hashと絞込 |
| R2 | global.cssと必要箇所のscoped styles | JAENの幅/向き、focus・target・overflow・固定要素・全商品/地域 |
| R3 | Sourcesのnative details、product情報slot、MarketPrice表示を簡潔化、VisitGuide店舗dateを出典へ | 初期非表示→keyboard/クリック一覧→閉じる、正本dateとsource URL一致、直接hashとJSなし |
| R4 | security audit、外部検査URL/DNS/redirect等の境界、CI/依存 | 悪意入力のunit、audit、built/CSP・公開HTTP、秘密の存在パターン検査 |
| R5 | 016tasks/validation・handoff/operations・source ZIP | 実Actions成功、公開UI/配信SHA、source/ZIP全件SHA |

分担: Aは画像入口、Bはsecurity、Cはglobal mobileとfocused QA、rootは出典UI/統合/共有build/公開/納品。共有distを生成する操作はrootがfreeze後に順次実行。商品/出典の事実データと画像bytesは変更しない。
