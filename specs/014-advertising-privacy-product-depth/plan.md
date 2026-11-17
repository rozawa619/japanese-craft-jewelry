# 設計

Privacyはpoliciesの日英Markdown。Google等の公式案内へリンクし、現在は広告なし、将来の配信時の説明を条件付きで記載。実アカウントへ依存する認定CMPの導入済み表現や無意味なCookie同意バナーは作らない。広告状態の正本とpolicy versionを持ち、広告off状態で外部広告コードが混入したら生成後検査で拒否する。

商品Q&Aはproduct-buying-guides.json、schema/resolver、共通ProductBuyingGuideに分離。価格/リンクをコピーせず、仕様tokenは日英catalogから解決しunknownを作らない。50品×日英×3件の参照/非空/固有回答を検証し、人間相当の実読レビューを別に記録。本文とQ&Aに同文を繰返さず、比較・装い・選択の役割を整理する。

Privacy、先頭25品、後半25品の調査/本文を並行担当。rootが統合/共有修正/部品/検証/公開/納品。前版は0.13.0 app0608da5、最終文書4d4bee7。v13の成功をv14の実測へ転用せず、privacy-depth-stage prefixで保存する。
