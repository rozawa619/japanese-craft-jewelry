# 人物画像の生成意図監査 — 日本人女性への統一前

2026-11-17、サイト0.17.3。正本は[japanese-models-stage-audit.json](japanese-models-stage-audit.json)。現在掲載60商品の58種類の人物画像すべてを、assetId/pathが一致する採用済み生成記録と結び、公開WebPのSHAも一致確認しました。顔や髪の見た目から国籍を推定していません。ここでいうJapanese/American/Britishは架空人物について記録された生成設定です。実在人物の国籍や装着実績の証明ではありません。

- Japanese明記：36画像、保持候補。
- American明記：11画像、差し替え必須。
- British明記：11画像、差し替え必須。
- 記録不明：0画像。合計22画像/22商品が新方針に対する必須差し替え対象です。
- 58画像すべてが1536×1024の現在レジストリに対応。単体画像60種類はこの人物監査の対象外です。

新方針は日本人として設定した架空成人のみ、20代半ばも含め、アクセサリーに合う可愛い/綺麗・華やかな雰囲気を混ぜるものです。この監査時点で画像差し替えや新画像の採用は行っていません。新生成の最終prompt/採用判断は別記録に残してください。

## 優先する掲載箇所

1. 福岡Top10代表：Iwaya漆玉フックピアス。
2. DISCOVER/featured：島津薩摩切子ペンダント、肥後象嵌しずくピアス。
3. featured/catalog先頭：矢留彫金工房の稲穂銀線細工、七窯社Punu、SÙRの透明樹脂/パール、YO-BO-tyの因州和紙。

完全な旧prompt、画像path/assetId/商品ID、素材・技法・装着位置の参照情報、SHAはJSONの各行に残しています。商品事実はcatalog由来の既存値で、今回の新規再調査やSKUの実写再現保証ではありません。

## 全58画像

| assetId | 商品ID | 記録上の架空人物設定 | 判断 | 生成記録 |
| --- | --- | --- | --- | --- |
| ai-hakone-yosegi-pierced-styling-v9 | hamamatsuya-catch-pierced | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/3` |
| ai-hakone-yosegi-clipon-styling-v9 | hamamatsuya-clip | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/4` |
| ai-rinzen-amber-glass-styling-v9 | rinzen-seika-amber-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/0` |
| ai-arita-halfmoon-styling-v9 | six-kiln-half-moon-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/7` |
| ai-yosegi-star-styling-v9 | maruyama-clip-c, maruyama-pierced-c | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/9` |
| ai-yosegi-bar-styling-v9 | maruyama-clip-d, maruyama-pierced-d | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/5` |
| ai-yosegi-pendant-styling-v9 | hamamatsuya-pendant | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/6` |
| ai-checos-silver-flower-styling-v9 | checos-japanese-apricot-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/8` |
| ai-morphosphere-blue-pansy-styling-v9 | morphosphere-ultramarine-pansy-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/10` |
| ai-kato-green-cloisonne-styling-v9 | kato-suke-drop-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/1` |
| ai-arita-blue-bouquet-styling-v9 | six-kiln-blue-bouquet-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/11` |
| ai-rinzen-green-leaf-styling-v9 | rinzen-leaf-glass-pendant | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/12` |
| ai-saskia-porcelain-cuff-styling-v9 | saskia-diez-drake-porcelain-cuff | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/13` |
| ai-senshu-white-pearl-stud-styling-v9 | senshu-pearl-stud-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/14` |
| ai-simprich-crystal-bubble-styling-v9 | simprich-crystal-bubble-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/16` |
| ai-yukie-mint-glass-styling-v9 | yukieglass-mint-veil-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/17` |
| ai-sugimura-raden-flower-pendant-styling-v9 | sugimura-hosoge-raden-pendant | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/18` |
| ai-arcos-cosmic-spiral-pendant-styling-v9 | arcos-cosmic-spiral-pendant | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/19` |
| ai-arcos-cosmic-glass-bracelet-styling-v9 | arcos-cosmic-glass-bracelet | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/20` |
| ai-senshu-white-pearl-swing-styling-v9 | senshu-pearl-swing-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/21` |
| ai-sugimura-lotus-makie-ring-styling-v9 | sugimura-lotus-makie-ring | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/22` |
| ai-simprich-rose-quartz-necklace-styling-v9 | simprich-rose-quartz-necklace | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/24` |
| ai-yukie-rouge-glass-styling-v9 | yukieglass-rouge-veil-earrings | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/25` |
| ai-nakajima-sakura-damascene-pendant-styling-v9 | nakajima-pear-sakura-pendant | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/26` |
| ai-kato-blue-round-enamel-ring-styling-v9 | kato-suke-round-ring | Japanese | 保持候補 | docs/image-generation-v9.json `/assets/27` |
| ai-hario-little-tears-clip-on-earrings-styling-v13 | hario-little-tears-clip-on-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/0` |
| ai-sirisiri-page-blue-enamel-pierced-earrings-styling-v13 | sirisiri-page-blue-enamel-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/1` |
| ai-mie-akoya-oh002-stud-earrings-styling-v13 | mie-akoya-oh002-stud-earrings | British | 差し替え必須 | docs/image-generation-v13.json `/images/2` |
| ai-sangetsu-irodori-tombodama-necklace-styling-v13 | sangetsu-irodori-tombodama-necklace | British | 差し替え必須 | docs/image-generation-v13.json `/images/3` |
| ai-sangetsu-irodori-tombodama-earrings-styling-v13 | sangetsu-irodori-tombodama-earrings | American | 差し替え必須 | docs/image-generation-v13.json `/images/4` |
| ai-simprich-reversible-topaz-ruby-chain-ring-styling-v13 | simprich-reversible-topaz-ruby-chain-ring | American | 差し替え必須 | docs/image-generation-v13.json `/images/5` |
| ai-simprich-reversible-silver-piaring-single-styling-v13 | simprich-reversible-silver-piaring-single | British | 差し替え必須 | docs/image-generation-v13.json `/images/6` |
| ai-sirisiri-silver-thread-hoop-mini-styling-v13 | sirisiri-silver-thread-hoop-mini | American | 差し替え必須 | docs/image-generation-v13.json `/images/7` |
| ai-nousaku-aya-tin-pendant-styling-v13 | nousaku-aya-tin-pendant | British | 差し替え必須 | docs/image-generation-v13.json `/images/8` |
| ai-sghr-tie-tie-glass-earrings-styling-v13 | sghr-tie-tie-glass-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/9` |
| ai-nousaku-dahlia-gerbera-clip-on-earrings-styling-v13 | nousaku-dahlia-gerbera-clip-on-earrings | American | 差し替え必須 | docs/image-generation-v13.json `/images/10` |
| ai-sghr-kolmio-glass-ear-cuff-styling-v13 | sghr-kolmio-glass-ear-cuff | American | 差し替え必須 | docs/image-generation-v13.json `/images/11` |
| ai-toytoy-ninkari-nikuri-earrings-styling-v13 | toytoy-ninkari-nikuri-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/12` |
| ai-somemasa-peacock-clip-on-earrings-styling-v13 | somemasa-peacock-clip-on-earrings | American | 差し替え必須 | docs/image-generation-v13.json `/images/13` |
| ai-toytoy-sirokani-pe-silver-necklace-styling-v13 | toytoy-sirokani-pe-silver-necklace | American | 差し替え必須 | docs/image-generation-v13.json `/images/14` |
| ai-tamura-kaisai-enamel-ear-jewelry-styling-v13 | tamura-kaisai-enamel-ear-jewelry | British | 差し替え必須 | docs/image-generation-v13.json `/images/15` |
| ai-coyorimi-tamamusubi-clip-on-earrings-styling-v13 | coyorimi-tamamusubi-clip-on-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/16` |
| ai-iwaya-urushi-9mm-hook-earrings-styling-v13 | iwaya-urushi-9mm-hook-earrings | British | 差し替え必須 | docs/image-generation-v13.json `/images/17` |
| ai-egaho-gathered-kurume-kasuri-ear-jewelry-styling-v13 | egaho-gathered-kurume-kasuri-ear-jewelry | British | 差し替え必須 | docs/image-generation-v13.json `/images/18` |
| ai-showen-edo-uchi-silk-bracelet-styling-v13 | showen-edo-uchi-silk-bracelet | American | 差し替え必須 | docs/image-generation-v13.json `/images/19` |
| ai-kazarino-hanabishi-copper-earrings-styling-v13 | kazarino-hanabishi-copper-earrings | British | 差し替え必須 | docs/image-generation-v13.json `/images/20` |
| ai-kazarino-shippo-pattern-brass-bangle-styling-v13 | kazarino-shippo-pattern-brass-bangle | Japanese | 保持候補 | docs/image-generation-v13.json `/images/21` |
| ai-nanao-shuka-nebula-16g-earrings-styling-v13 | nanao-shuka-nebula-16g-earrings | Japanese | 保持候補 | docs/image-generation-v13.json `/images/22` |
| ai-styling-applause-awa-indigo-pearl-clip-on-earrings-v16 | applause-awa-indigo-pearl-clip-on-earrings | Japanese | 保持候補 | docs/image-generation-v16.json `/images/0` |
| ai-styling-earth-hiroshima-origami-crane-chain-earrings-v16 | earth-hiroshima-origami-crane-chain-earrings | Japanese | 保持候補 | docs/image-generation-v16.json `/images/1` |
| ai-styling-menoya-izumo-magatama-n15-necklace-v16 | menoya-izumo-magatama-n15-necklace | Japanese | 保持候補 | docs/image-generation-v16.json `/images/2` |
| ai-styling-mitsusuke-higo-zogan-shizuku-pierced-earrings-v16 | mitsusuke-higo-zogan-shizuku-pierced-earrings | British | 差し替え必須 | docs/image-generation-v16.json `/images/3` |
| ai-styling-nanayosha-punu-gold-vanilla-pierced-earrings-v16 | nanayosha-punu-gold-vanilla-pierced-earrings | British | 差し替え必須 | docs/image-generation-v16.json `/images/4` |
| ai-styling-shimadzu-satsuma-kiriko-hikari-l-pendant-v16 | shimadzu-satsuma-kiriko-hikari-l-pendant | American | 差し替え必須 | docs/image-generation-v16.json `/images/5` |
| ai-styling-sur-basic1-clear-pearl-pierced-earrings-v16 | sur-basic1-clear-pearl-pierced-earrings | American | 差し替え必須 | docs/image-generation-v16.json `/images/6` |
| ai-styling-tete-ryukyu-glass-hanagasa-heart-pierced-earrings-v16 | tete-ryukyu-glass-hanagasa-heart-pierced-earrings | Japanese | 保持候補 | docs/image-generation-v16.json `/images/7` |
| ai-styling-yadome-akita-rice-silver-pierced-earrings-v16 | yadome-akita-rice-silver-pierced-earrings | American | 差し替え必須 | docs/image-generation-v16.json `/images/8` |
| ai-styling-yoboty-inshu-washi-indigo-long-nonhole-earrings-v16 | yoboty-inshu-washi-indigo-long-nonhole-earrings | British | 差し替え必須 | docs/image-generation-v16.json `/images/9` |
