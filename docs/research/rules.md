# 広告・検索向け表示の一次資料

確認日：2026-11-16。以下は制作上の採用方針とその根拠。特定国の全法令・個別契約への適合を一律に保証するものではない。

| 資料 | 公式本文で確認した点 | 当サイトへの反映 |
| --- | --- | --- |
| [Google：外部リンクのrel](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links) | 広告・有料掲載リンクにはsponsoredが推奨され、複数値も指定できる | 実際に広告URLを採用したリンクへ `rel="sponsored noopener"`。通常の商品リンクと区別 |
| [Google：検索スパム方針](https://developers.google.com/search/docs/essentials/spam-policies) | 独自の価値を加えず販売店の説明をコピーする薄いアフィリエイトを問題にしている | 独自の選び方・比較軸・不明点・出典を載せる。空都道府県や重複したページは生成しない |
| [FTC：Endorsement Guides FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | 報酬関係は明瞭で目立つよう、推薦やリンクの近くに表示する。affiliate linkの語だけでは意味が十分伝わらない場合がある | 最初の広告リンク前で、購入により報酬を受ける可能性を平易な英語で説明。現在の通常リンクだけの状態はその事実に合わせる |
| [消費者庁：ステルスマーケティング](https://www.caa.go.jp/policies/policy/representation/fair_labeling/stealth_marketing/) | 2023-10-01から広告と判別しにくい事業者の表示を規制。対象を広告主と説明している | 広告・商品提供等の実際の関係を隠さず示す。すべての第三者記事が一律に規制対象と断定しない |
| [Skimlinks：画像利用](https://support.skimlinks.com/hc/en-us/articles/360014614557-Can-I-use-merchant-images) | 自分の写真や利用可能な素材が安全で、販売店の条件が異なるため照会を勧める | ネットワーク参加や出典表記だけを画像利用許諾の代わりにしない |
| [Skimlinks：開示](https://support.skimlinks.com/hc/en-us/articles/360005286057-How-do-I-disclose-the-use-of-Skimlinks-on-my-site) | 利用時はAbout/Disclosureと広告リンクのある各記事冒頭で関係を説明する案内 | 将来採用する場合に契約の指定と併せて反映。初期はSkimlinks未導入・未提携 |

初期の実装方針：販売・決済・発送を受け付けない。未試用の感想、架空の口コミ、確認していないアレルギー安全性・重量・配送保証を載せない。広告切替は「承認＋有効URL＋確認日」が揃う場合だけ。承認状態を変更したら実際の出力と開示を検証する。
