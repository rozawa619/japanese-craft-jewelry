import type {Locale} from './i18n.ts';
import {reviewedMapEmbedUrl} from './map-embed-url.ts';

/** Public Share > Embed URLs reviewed on 2026-11-17. Hamamatsuya uses the
 * maker-published Google embed. No Google map images or reviews are stored.
 * Acquisition and venue choices: docs/research/inline-maps-v14.json.
 * The Hakuza and Kanoa stores use maker-published embeds checked on 2026-11-24. */
export const reviewedStoreMapEmbeds:Readonly<Record<string,Readonly<Record<Locale,string>>>>={
  "hamamatsuya-hatajuku-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9219.37629412932!2d139.0585010798904!3d35.217881830033974!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6019a2f35ae637e7%3A0xfcbb25f508ffef70!2z5rWc5p2-5bGL!5e0!3m2!1sja!2sjp!4v1538099601467",
    "en": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9219.37629412932!2d139.0585010798904!3d35.217881830033974!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6019a2f35ae637e7%3A0xfcbb25f508ffef70!2z5rWc5p2-5bGL!5e0!3m2!1sja!2sjp!4v1538099601467"
  },
  // The map published on Yogado’s official access page serves both locales.
  "yogado-kamakura-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.3277642123967!2d139.55188206112683!3d35.32268149695028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601845c73d63373b:0xa1aef5516b3e531e!2z6Y6M5YCJ5b2rIOmZvembheWggg!5e0!3m2!1sja!2sjp!4v1492364363891",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.3277642123967!2d139.55188206112683!3d35.32268149695028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601845c73d63373b:0xa1aef5516b3e531e!2z6Y6M5YCJ5b2rIOmZvembheWggg!5e0!3m2!1sja!2sjp!4v1492364363891"
  },
  "hakone-maruyama-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.59156654529!2d139.02685549999998!3d35.1917311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6019986f27c00055%3A0xbd950abf3fe18215!2z5Li45bGx54mp55SjIOeuseagueacrOW6lw!5e0!3m2!1sja!2sjp!4v1794886691292!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.59156654529!2d139.02685549999998!3d35.1917311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6019986f27c00055%3A0xbd950abf3fe18215!2sHakone%20Maruyama%20Bussan!5e0!3m2!1sen!2sjp!4v1794886703069!5m2!1sen!2sjp"
  },
  "rinzen-hirai-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.6740822692577!2d139.84502329999998!3d35.70963710000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601889e5ac596243%3A0xfde7d077b1b9ec4e!2z5p2x5Lqs44Ks44Op44K55bel5oi_IOWHm-eEtg!5e0!3m2!1sja!2sjp!4v1794886703566!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.6740822692577!2d139.84502329999998!3d35.70963710000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601889e5ac596243%3A0xfde7d077b1b9ec4e!2z5p2x5Lqs44Ks44Op44K55bel5oi_IOWHm-eEtg!5e0!3m2!1sen!2sjp!4v1794886703909!5m2!1sen!2sjp"
  },
  "seirokugama-gallery": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.757503534112!2d129.8618636!3d33.194232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356a9b1cb673969d%3A0x8ee4d770aac435!2z5riF5YWt56qv!5e0!3m2!1sja!2sjp!4v1794886715133!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.757503534112!2d129.8618636!3d33.194232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356a9b1cb673969d%3A0x8ee4d770aac435!2z5riF5YWt56qv!5e0!3m2!1sen!2sjp!4v1794886715458!5m2!1sen!2sjp"
  },
  "2016-arita-flagship": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.7219906294868!2d129.8761827!3d33.1951635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356a9b1466b39d77%3A0xbd88977e9ae50467!2s2016%2F%20SHOP!5e0!3m2!1sja!2sjp!4v1794886715561!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.7219906294868!2d129.8761827!3d33.1951635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356a9b1466b39d77%3A0xbd88977e9ae50467!2s2016%2F%20SHOP!5e0!3m2!1sen!2sjp!4v1794886726687!5m2!1sen!2sjp"
  },
  "kanra-shop-kyoto": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.520497930749!2d135.75946679999998!3d34.9936736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108a37fab66a9%3A0x97b5d02d797061c5!2z44Ob44OG44Or44Kr44Oz44Op5Lqs6YO9!5e0!3m2!1sja!2sjp!4v1794886727799!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.520497930749!2d135.75946679999998!3d34.9936736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108a37fab66a9%3A0x97b5d02d797061c5!2sHotel%20Kanra%20Kyoto!5e0!3m2!1sen!2sjp!4v1794886727724!5m2!1sen!2sjp"
  },
  "kato-shippo-store": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.1662850023667!2d136.8950308!3d35.2023268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376a8f86eca99%3A0xb74dd00f9129d4c0!2z77yI5pyJ77yJ5Yqg6Jek5LiD5a6d6KO95L2c5omA!5e0!3m2!1sja!2sjp!4v1794886739246!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260.1662850023667!2d136.8950308!3d35.2023268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376a8f86eca99%3A0xb74dd00f9129d4c0!2z77yI5pyJ77yJ5Yqg6Jek5LiD5a6d6KO95L2c5omA!5e0!3m2!1sen!2sjp!4v1794886739913!5m2!1sen!2sjp"
  },
  "mocad-museum-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.7400266206123!2d135.7812074!3d35.0132124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108e5f2351511%3A0x9b843b1775166a61!2z5Lqs6YO95Lyd57Wx55Sj5qWt44Of44Ol44O844K444Ki44Og!5e0!3m2!1sja!2sjp!4v1794887010868!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.7400266206123!2d135.7812074!3d35.0132124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108e5f2351511%3A0x9b843b1775166a61!2sKyoto%20Museum%20of%20Crafts%20and%20Design!5e0!3m2!1sen!2sjp!4v1794887021722!5m2!1sen!2sjp"
  },
  "arcos-kamogawa-gallery": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.1039136929703!2d140.0346071!3d35.1290803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60180040641f573f%3A0xfa48a99b4be9b152!2z44Ks44Op44K55bel5oi_44Ki44Or44Kz44K5IEdhbGxlcnkgJiBDQUZF!5e0!3m2!1sja!2sjp!4v1794886742591!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.1039136929703!2d140.0346071!3d35.1290803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60180040641f573f%3A0xfa48a99b4be9b152!2sArcos%20Glass%20Studio!5e0!3m2!1sen!2sjp!4v1794886742897!5m2!1sen!2sjp"
  },
  "sugimura-nishinokyo-gallery": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.323590118904!2d135.7829128!3d34.6717817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60013b02f55f0001%3A0xa688e3c51a1f4df5!2z44GM44KT44GT5LiA5b656ZW35bGL!5e0!3m2!1sja!2sjp!4v1794886745822!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.323590118904!2d135.7829128!3d34.6717817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60013b02f55f0001%3A0xa688e3c51a1f4df5!2z44GM44KT44GT5LiA5b656ZW35bGL!5e0!3m2!1sen!2sjp!4v1794886745736!5m2!1sen!2sjp"
  },
  "yamanashi-jewelry-museum-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5458475969344!2d138.5687482!3d35.6635594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601bf9d1d4ac3555%3A0xfa560aa1c15f4f39!2z5bGx5qKo44K444Ol44Ko44Oq44O844Of44Ol44O844K444Ki44Og!5e0!3m2!1sja!2sjp!4v1794887054798!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5458475969344!2d138.5687482!3d35.6635594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601bf9d1d4ac3555%3A0xfa560aa1c15f4f39!2sYamanashi%20Jewelry%20Museum!5e0!3m2!1sen!2sjp!4v1794887065770!5m2!1sen!2sjp"
  },
  "kitaichi-sangokan-yo": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.820956816251!2d141.007334!3d43.1922675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0ae05a9dc3ffff%3A0x9fde1cdddbdce4ae!2z5YyX5LiA56Gd5a2QIOS4ieWPt-mkqA!5e0!3m2!1sja!2sjp!4v1794887099056!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2908.820956816251!2d141.007334!3d43.1922675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0ae05a9dc3ffff%3A0x9fde1cdddbdce4ae!2sKitaichi%20Glass%20III!5e0!3m2!1sen!2sjp!4v1794887110183!5m2!1sen!2sjp"
  },
  "nakajima-zogan-arashiyama": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.6209140898386!2d135.678564!3d35.0161935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001a90c7337e089%3A0x9fc611c4799d5a64!2z5Lit5baL6LGh5bWMIOW1kOWxseW6lyBuYWthamltYS16b3VnYW4!5e0!3m2!1sja!2sjp!4v1794886767660!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.6209140898386!2d135.678564!3d35.0161935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001a90c7337e089%3A0x9fc611c4799d5a64!2z5Lit5baL6LGh5bWMIOW1kOWxseW6lyBuYWthamltYS16b3VnYW4!5e0!3m2!1sen!2sjp!4v1794886767664!5m2!1sen!2sjp"
  },
  "sangetsu-sakaihigashi-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.162148011638!2d135.4818728!3d34.574763499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000dc86f0a18e83%3A0x46f583f34771e6fd!2z5ZKM5rOJ6Jy76JuJ546J6LOH5paZ6aSo77yI5bGx5pyI5bel5oi_5aC65p2x5bqX77yJ!5e0!3m2!1sja!2sjp!4v1794886768008!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.162148011638!2d135.4818728!3d34.574763499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000dc86f0a18e83%3A0x46f583f34771e6fd!2z5ZKM5rOJ6Jy76JuJ546J6LOH5paZ6aSo77yI5bGx5pyI5bel5oi_5aC65p2x5bqX77yJ!5e0!3m2!1sen!2sjp!4v1794886770832!5m2!1sen!2sjp"
  },
  "sghr-kujukuri-factory-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.0297980083674!2d140.3965703!3d35.5282613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6022c166e091c637%3A0x16cd347bea26dd44!2zU2dociDjgrnjgqzjg4_jg6kg44OV44Kh44Kv44OI44Oq44O844K344On44OD44OX!5e0!3m2!1sja!2sjp!4v1794887076698!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.0297980083674!2d140.3965703!3d35.5282613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6022c166e091c637%3A0x16cd347bea26dd44!2sSghr%20Factory%20Shop!5e0!3m2!1sen!2sjp!4v1794887087857!5m2!1sen!2sjp"
  },
  "beams-japan-kyoto-kazarino": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.8793016643904!2d135.7599054!3d35.0097264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600107111f89b021%3A0xb548e1190d8102cf!2z44OT44O844Og44K5IOOCuOODo-ODkeODsyDkuqzpg70!5e0!3m2!1sja!2sjp!4v1794886773480!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.8793016643904!2d135.7599054!3d35.0097264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600107111f89b021%3A0xb548e1190d8102cf!2sBEAMS%20JAPAN%20KYOTO!5e0!3m2!1sen!2sjp!4v1794886773977!5m2!1sen!2sjp"
  },
  "showen-uji-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.6473920246003!2d135.8041126!3d34.8901997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60011109563fe5f7%3A0xad57e366607cca1f!2z5piH6IuR44GP44G_44Gy44KCIOWuh-ayu-acrOW6lw!5e0!3m2!1sja!2sjp!4v1794886773755!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.6473920246003!2d135.8041126!3d34.8901997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60011109563fe5f7%3A0xad57e366607cca1f!2sShowen%20Kumihimo!5e0!3m2!1sen!2sjp!4v1794886776750!5m2!1sen!2sjp"
  },
  "iwaya-yame-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.376937689513!2d130.5555458!3d33.204212999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3541a93371ea0491%3A0xa5bbdee1156ea934!2z5ryG5bel5oi_IOWyqeW8pSDov5Hmnb7ku4_lo4flupc!5e0!3m2!1sja!2sjp!4v1794886776428!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3338.376937689513!2d130.5555458!3d33.204212999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3541a93371ea0491%3A0xa5bbdee1156ea934!2sUrushikobo%20Iwaya%20Chikamatsu%20Buddhist%20Altar%20Shop!5e0!3m2!1sen!2sjp!4v1794886776786!5m2!1sen!2sjp"
  },
  "yuiq-odori-bisse": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2915.0505347627422!2d141.3521829!3d43.06140469999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0b299d0092cbc3%3A0x920a4783979b1bcf!2z77y577y177yp77yx!5e0!3m2!1sja!2sjp!4v1794886780216!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2915.0505347627422!2d141.3521829!3d43.06140469999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0b299d0092cbc3%3A0x920a4783979b1bcf!2z77y577y177yp77yx!5e0!3m2!1sen!2sjp!4v1794886780034!5m2!1sen!2sjp"
  },
  "hario-kodenmacho-store": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.4801443229885!2d139.7783576!3d35.689800399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601889535de662d7%3A0xe12d0036b87d4a2c!2zSEFSSU8gTGFtcHdvcmsgRmFjdG9yeSDlsI_kvJ3ppqznlLrlupc!5e0!3m2!1sja!2sjp!4v1794886780097!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.4801443229885!2d139.7783576!3d35.689800399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601889535de662d7%3A0xe12d0036b87d4a2c!2sHARIO%20Lampwork%20Factory%20Kodenmacho%20Store!5e0!3m2!1sen!2sjp!4v1794886783629!5m2!1sen!2sjp"
  },
  "nousaku-takaoka-factory-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.2483491180496!2d136.99749029999998!3d36.6685294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff783e74f55be8f%3A0xee237e1a408f7c44!2z6IO95L2cIOacrOekvuW3peWgtA!5e0!3m2!1sja!2sjp!4v1794886783597!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.2483491180496!2d136.99749029999998!3d36.6685294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff783e74f55be8f%3A0xee237e1a408f7c44!2sNOUSAKU%20Factory!5e0!3m2!1sen!2sjp!4v1794886783732!5m2!1sen!2sjp"
  },
  "mocad-kyoto-museum-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.7400266206123!2d135.7812074!3d35.0132124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108e5f2351511%3A0x9b843b1775166a61!2z5Lqs6YO95Lyd57Wx55Sj5qWt44Of44Ol44O844K444Ki44Og!5e0!3m2!1sja!2sjp!4v1794887032937!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3267.7400266206123!2d135.7812074!3d35.0132124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108e5f2351511%3A0x9b843b1775166a61!2sKyoto%20Museum%20of%20Crafts%20and%20Design!5e0!3m2!1sen!2sjp!4v1794887044027!5m2!1sen!2sjp"
  },
  "sirisiri-akasaka-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.2822487270487!2d139.7319307!3d35.6700516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b7b299faaab%3A0xba6def0770dfb461!2sSIRI%20SIRI%20SHOP!5e0!3m2!1sja!2sjp!4v1794886788156!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.2822487270487!2d139.7319307!3d35.6700516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b7b299faaab%3A0xba6def0770dfb461!2sSIRI%20SIRI%20SHOP!5e0!3m2!1sen!2sjp!4v1794886790849!5m2!1sen!2sjp"
  },
  "shimadzu-iso-kogeikan": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6174529156715!2d130.57350401553123!3d31.616940481337785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x353e5e5e7ac163d9%3A0xcaa0a651c9acc5b3!2z44CSODkyLTA4NzEg6bm_5YWQ5bO255yM6bm_5YWQ5bO25biC5ZCJ6YeO55S677yZ77yW77yY77yY4oiS77yS77yU!5e0!3m2!1sja!2sjp!4v1652173385791!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6174529156715!2d130.57350401553123!3d31.616940481337785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x353e5e5e7ac163d9%3A0xcaa0a651c9acc5b3!2z44CSODkyLTA4NzEg6bm_5YWQ5bO255yM6bm_5YWQ5bO25biC5ZCJ6YeO55S677yZ77yW77yY77yY4oiS77yS77yU!5e0!3m2!1sja!2sjp!4v1652173385791!5m2!1sja!2sjp"
  },
  "applause-naruto-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6601.730244919464!2d134.59958400146328!3d34.17536594945743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3553658ba5cfd5b1%3A0x7e1601c8dd99be73!2z44CSNzcyLTAwMDMg5b6z5bO255yM6bO06ZaA5biC5pKr6aSK55S65Y2X5rWc6Jut5a2Q5YmN5p2x77yT77yQ4oiS77ySIOOCuOODpeOCqOODquODvOOCouODl-ODreODvOOCug!5e0!3m2!1sja!2sjp!4v1535511554505",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6601.730244919464!2d134.59958400146328!3d34.17536594945743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3553658ba5cfd5b1%3A0x7e1601c8dd99be73!2z44CSNzcyLTAwMDMg5b6z5bO255yM6bO06ZaA5biC5pKr6aSK55S65Y2X5rWc6Jut5a2Q5YmN5p2x77yT77yQ4oiS77ySIOOCuOODpeOCqOODquODvOOCouODl-ODreODvOOCug!5e0!3m2!1sja!2sjp!4v1535511554505"
  },
  "yadome-atelier-akita-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.962570228451!2d140.11572441537484!3d39.71802387945241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8fc2ea58901d7d%3A0xebdbb598e9083513!2z44CSMDEwLTA5MjEg56eL55Sw55yM56eL55Sw5biC5aSn55S677yS5LiB55uu77yR4oiS77yR77yR!5e0!3m2!1sja!2sjp!4v1638866544592!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.962570228451!2d140.11572441537484!3d39.71802387945241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8fc2ea58901d7d%3A0xebdbb598e9083513!2z44CSMDEwLTA5MjEg56eL55Sw55yM56eL55Sw5biC5aSn55S677yS5LiB55uu77yR4oiS77yR77yR!5e0!3m2!1sja!2sjp!4v1638866544592!5m2!1sja!2sjp"
  },
  "hiroshima-peace-park-resthouse-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3180.8394056431343!2d132.453275!3d34.3937863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x355aa20d48f1aba3%3A0xa64cee1fe7e803c2!2z5bqD5bO25biC5bmz5ZKM6KiY5b-15YWs5ZyS44Os44K544OI44OP44Km44K5KOaXp-Wkp-ato-Wxi-WRieacjeW6l-ODu-iiq-eIhuW7uueJqSk!5e1!3m2!1sja!2sjp!4v1747814325165!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3180.8394056431343!2d132.453275!3d34.3937863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x355aa20d48f1aba3%3A0xa64cee1fe7e803c2!2z5bqD5bO25biC5bmz5ZKM6KiY5b-15YWs5ZyS44Os44K544OI44OP44Km44K5KOaXp-Wkp-ato-Wxi-WRieacjeW6l-ODu-iiq-eIhuW7uueJqSk!5e1!3m2!1sja!2sjp!4v1747814325165!5m2!1sja!2sjp"
  },
  "sava-store-sabae-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3229.849558107333!2d136.2741057!3d35.95065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff8a579cf2377ef%3A0x7c7d69c25023c085!2zU0FWQSFTVE9SRSDmnKzlupc!5e0!3m2!1sja!2sjp!4v1794900355679!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3229.849558107333!2d136.2741057!3d35.95065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff8a579cf2377ef%3A0x7c7d69c25023c085!2zU0FWQSFTVE9SRSDmnKzlupc!5e0!3m2!1sja!2sjp!4v1794900355679!5m2!1sja!2sjp"
  },
  "nanayosha-suzuki-tile-tajimi": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3253.7618625311816!2d137.134491!3d35.3615558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60036a9fb122c285%3A0x877ba67bdb859bdc!2z5LiD56qv56S-IOmItOacqOOCv-OCpOODq-W6lw!5e0!3m2!1sja!2sjp!4v1794900457699!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3253.7618625311816!2d137.134491!3d35.3615558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60036a9fb122c285%3A0x877ba67bdb859bdc!2z5LiD56qv56S-IOmItOacqOOCv-OCpOODq-W6lw!5e0!3m2!1sja!2sjp!4v1794900457699!5m2!1sja!2sjp"
  },
  "mitsusuke-kumamoto-main": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.5116427524695!2d130.69183478885495!3d32.8052059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3540f4154e87c8b7%3A0x9b91f1189a0aeb47!2z77yI5qCq77yJ5YWJ5YqpIOiCpeW-jOixoeW1jA!5e0!3m2!1sja!2sjp!4v1794900567039!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.5116427524695!2d130.69183478885495!3d32.8052059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3540f4154e87c8b7%3A0x9b91f1189a0aeb47!2z77yI5qCq77yJ5YWJ5YqpIOiCpeW-jOixoeW1jA!5e0!3m2!1sja!2sjp!4v1794900567039!5m2!1sja!2sjp"
  },
  "menoya-izumo-taisha": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3252.362546896392!2d132.68662319999999!3d35.3962631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35575c981a18586f%3A0x54ac8b299ae7731!2z44KB44Gu44KEIOWHuumbsuWkp-ekvuW6lw!5e0!3m2!1sja!2sjp!4v1794900669456!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3252.362546896392!2d132.68662319999999!3d35.3962631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35575c981a18586f%3A0x54ac8b299ae7731!2z44KB44Gu44KEIOWHuumbsuWkp-ekvuW6lw!5e0!3m2!1sja!2sjp!4v1794900669456!5m2!1sja!2sjp"
  },
  "aoya-washi-museum-shop": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.4210872189647!2d134.01579189999998!3d35.469124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3555e9814ed4444f%3A0x31660ab84a883ba5!2z44GC44GK44KE5ZKM57SZ5bel5oi_!5e0!3m2!1sja!2sjp!4v1794900727816!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.4210872189647!2d134.01579189999998!3d35.469124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3555e9814ed4444f%3A0x31660ab84a883ba5!2z44GC44GK44KE5ZKM57SZ5bel5oi_!5e0!3m2!1sja!2sjp!4v1794900727816!5m2!1sja!2sjp"
  },
  "tete-iias-okinawa-toyosaki": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.196325215678!2d127.65097709999999!3d26.1577349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e569bc128b4f09%3A0xbcc6cae9f1fe820!2stete%20by%20okinawa!5e0!3m2!1sja!2sjp!4v1794900783880!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.196325215678!2d127.65097709999999!3d26.1577349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e569bc128b4f09%3A0xbcc6cae9f1fe820!2stete%20by%20okinawa!5e0!3m2!1sja!2sjp!4v1794900783880!5m2!1sja!2sjp"
  },
  "hakuza-hikarikura-kanazawa": {
    "ja": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6408.46978464583!2d136.667126!3d36.572557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff83374a4ded8ff%3A0x12766d3886069e17!2z566U5bqn44Gy44GL44KK6JeP!5e0!3m2!1sja!2sus!4v1678356931492!5m2!1sja!2sus",
    "en": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6408.46978464583!2d136.667126!3d36.572557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff83374a4ded8ff%3A0x12766d3886069e17!2z566U5bqn44Gy44GL44KK6JeP!5e0!3m2!1sja!2sus!4v1678356931492!5m2!1sja!2sus"
  },
  "kanoa-okinawa-kokusai-street": {
    "ja": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.424084302823!2d127.68477289999998!3d26.215406599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e5696da1fd154b%3A0x2b5196d0ac328c50!2zS2Fub2EgT2tpbmF3YSDlm73pmpvpgJrjgorlupc!5e0!3m2!1sja!2sjp!4v1744128102835!5m2!1sja!2sjp",
    "en": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.424084302823!2d127.68477289999998!3d26.215406599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e5696da1fd154b%3A0x2b5196d0ac328c50!2zS2Fub2EgT2tpbmF3YSDlm73pmpvpgJrjgorlupc!5e0!3m2!1sja!2sjp!4v1744128102835!5m2!1sja!2sjp"
  }
};

export function storeMapEmbed(storeId:string,locale:Locale):string|null{
 return reviewedMapEmbedUrl(reviewedStoreMapEmbeds[storeId]?.[locale]);
}
