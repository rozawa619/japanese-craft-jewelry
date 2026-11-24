import {japanMapAreas} from './japan-map.ts';
import type {Locale} from '../lib/i18n.ts';

type Copy = Record<Locale, string>;
type TravelRegion = {id:string; name:Copy; prefectures:readonly string[]};
type TravelArea = {id:string; name:Copy; storeIds:readonly string[]};

const metro = ['tokyo','kanagawa','chiba','saitama'];

/** Browsing groups for travel. The Japanese map retains its own labels and geometry. */
export const travelRegions:readonly TravelRegion[] = [
 {id:'metropolitan',name:{en:'Greater Tokyo',ja:'首都圏'},prefectures:metro},
 ...japanMapAreas.map(region=>region.id==='kanto'
  ?{id:'north-kanto',name:{en:'Northern Kanto',ja:'北関東'},prefectures:region.prefectures.filter(id=>!metro.includes(id))}
  :region),
];

const area = (id:string, en:string, ja:string, ...storeIds:string[]):TravelArea => ({id,name:{en,ja},storeIds});

/** Location refinements: use only store records with confirmed addresses. A
 * shop's location does not establish where any particular piece was made. */
export const travelAreas:Readonly<Record<string, readonly TravelArea[]>> = {
 hokkaido:[area('sapporo','Sapporo','札幌','yuiq-odori-bisse'),area('otaru','Otaru','小樽','kitaichi-sangokan-yo')],
 iwate:[area('kuji','Kuji','久慈','kuji-kohaku-main-shop')],
 miyagi:[area('ishinomaki','Ishinomaki','石巻','hikari-crew-reclaimed-ceramic-earrings-247-shop')],
 akita:[area('akita-city','Akita City','秋田市','yadome-atelier-akita-shop'),area('kakunodate','Kakunodate','角館','tomioka-art-and-craft-kazuki')],
 yamagata:[area('yonezawa','Yonezawa','米沢','juyoukan-yonezawa-kura-shop')],
 fukushima:[area('aizuwakamatsu','Aizuwakamatsu','会津若松','sakamoto-tsuya-jewel-tang-crimson-pendant-shop','aizu-machikata-denshokan')],
 tochigi:[area('mashiko','Mashiko','益子','naoko-otsuka-mashiko-crescent-moon-earrings-shop')],
 chiba:[area('kujukuri','Kujukuri','九十九里','sghr-kujukuri-factory-shop'),area('kamogawa','Kamogawa','鴨川','arcos-kamogawa-gallery')],
 tokyo:[
  area('nihonbashi','Nihonbashi','日本橋','hario-kodenmacho-store'),
  area('akasaka','Akasaka','赤坂','sirisiri-akasaka-shop'),
  area('hirai','Hirai, Edogawa','江戸川・平井','rinzen-hirai-shop'),
 ],
 kanagawa:[
  area('hakone','Hakone','箱根','hamamatsuya-hatajuku-main','hakone-maruyama-main'),
  area('kamakura','Kamakura','鎌倉','yogado-kamakura-shop','dahliacyan-sakanoshita-atelier'),
 ],
 toyama:[area('takaoka','Takaoka','高岡','nousaku-takaoka-factory-shop')],
 ishikawa:[area('kanazawa','Kanazawa','金沢','hakuza-hikarikura-kanazawa')],
 fukui:[area('sabae','Sabae','鯖江','sava-store-sabae-main')],
 yamanashi:[area('kofu','Kofu','甲府','yamanashi-jewelry-museum-shop')],
 nagano:[area('kiso-hirasawa','Kiso-Hirasawa','木曽平沢','maruyoshi-kosaka-tsubusa-clear-urushi-clip-on-earrings-shop')],
 gifu:[area('tajimi','Tajimi','多治見','nanayosha-suzuki-tile-tajimi')],
 aichi:[area('nagoya','Nagoya','名古屋','kato-shippo-store')],
 kyoto:[
  area('central-kyoto','Central Kyoto','京都市中心部','kanra-shop-kyoto','beams-japan-kyoto-kazarino'),
  area('okazaki','Okazaki','岡崎','mocad-museum-shop','mocad-kyoto-museum-shop'),
  area('arashiyama','Arashiyama','嵐山','nakajima-zogan-arashiyama'),
  area('uji','Uji','宇治','showen-uji-main'),
 ],
 osaka:[area('sakai','Sakai','堺','sangetsu-sakaihigashi-shop')],
 hyogo:[area('kobe','Kobe','神戸','pearl-pearl-kobe-coulee-black-akoya-pierced-earrings-shop')],
 nara:[area('nishinokyo','Nishinokyo','西ノ京','sugimura-nishinokyo-gallery'),area('naramachi','Naramachi','ならまち','atelier-ozaki-naramachi'),area('suimoncho','Suimon-chō, near Tōdaiji','水門町・東大寺周辺','je-et-nous-nara-suimoncho')],
 tottori:[area('aoya','Aoya','青谷','aoya-washi-museum-shop')],
 shimane:[area('izumo','Izumo','出雲','menoya-izumo-taisha')],
 hiroshima:[area('hiroshima-city','Hiroshima City','広島市','hiroshima-peace-park-resthouse-shop')],
 yamaguchi:[area('yamaguchi-city','Yamaguchi City','山口市','nakamura-ouchi-lacquer-red-pierced-earrings-shop')],
 tokushima:[area('naruto','Naruto','鳴門','applause-naruto-main')],
 kagawa:[area('takamatsu','Takamatsu','高松','dizzy459-only-you-red-lacquer-rose-ring-shop')],
 ehime:[area('uwajima','Uwajima','宇和島','yamashita-uwajima-akoya-four-pearl-chain-pierced-earrings-shop')],
 fukuoka:[area('yame','Yame','八女','iwaya-yame-shop'),area('tobata','Tobata, Kitakyushu','北九州市・戸畑','itohen-tobata-atelier'),area('itoshima','Itoshima','糸島','tabinokiseki-itoshima-workshop-shop')],
 saga:[area('arita','Arita','有田','seirokugama-gallery','2016-arita-flagship')],
 kumamoto:[area('kumamoto-city','Kumamoto City','熊本市','mitsusuke-kumamoto-main')],
 oita:[area('beppu','Beppu','別府','cotake-beppu-shop')],
 kagoshima:[area('kagoshima-city','Kagoshima City','鹿児島市','shimadzu-iso-kogeikan')],
 okinawa:[area('tomigusuku','Tomigusuku','豊見城','tete-iias-okinawa-toyosaki'),area('naha','Naha','那覇','kanoa-okinawa-kokusai-street')],
};
