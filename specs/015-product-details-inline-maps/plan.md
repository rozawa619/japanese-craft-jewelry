# 設計・実装と確認

商品単体の画像は既存のAI人物スタイリング画像だけをローカル参照としてbuilt-in image_genで作る。各参照をview_imageで見てから利用し、人物・肌・服を除いて見えるジュエリー前面をアイボリー背景へ。公式写真の転載や未知の裏面/金具/石の創作は避け、実物写真や正確なSKU再現と呼ばない。単体図registryと権利台帳/実prompt/原本PNG/hashを分離し、hero画像registryを置き換えない。ProductDetailImageは理由の本文と並べ、AI captionと実物の公式リンクを表示する。

MapsはGoogle公式Share→Embedの選択済みplace pbを記録、浜松屋は工房の公式ページで公開されたpbを優先する。map-embed-urlはHTTPS、www.google.com、/maps/embed、単一pbだけを許可し、資格情報/port/fragment/任意API/keyを拒否。Googleの著作権・帰属UIを隠さない。店舗事実はvisitsを正本としGoogleの休業表示だけで上書きしない。

VisitGuideは表示前にiframeを持たず、説明とloadボタンを表示。選択後に同じページへ320×230（スマホ210高）のiframeを生成、closeで削除。選択をCookie/Storageへ保存せず再読込はoff。Googleへの接続はload後、広告の認定CMPとは独立。CSPはframe-srcのGoogle originだけ変更し、親connect-src noneやscript hash等は維持。Privacy日英のmap-privacy anchorへ説明を追加。

リンク名化はhref/locale/market/広告判定data属性を維持して、商品/工房/店舗の意味ある名前へ。Sourcesの資料名は保持。

型・9件の新規unit・全画像metadata/hash/出典・Privacyoff・全300詳細/900問答/単体図・PC/スマホ/日英・地図の読込/閉じる/再読込と実Google表示・広告/SEO/リンク・公開後を別reportで検証。画像生成中の中間buildは最終成功に含めない。
