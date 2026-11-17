/** Editorial picks and geographic browsing groups, never product facts or rankings.
 * Only groups with published products are rendered as available destinations. */
export const discoveryPrefectureIds=['kagoshima','kumamoto','tokushima'] as const;
export const japanMapAreas=[
 {id:'north',name:{en:'Hokkaido & Tohoku',ja:'北海道・東北'},prefectures:['hokkaido','aomori','iwate','miyagi','akita','yamagata','fukushima']},
 {id:'kanto',name:{en:'Kanto',ja:'関東'},prefectures:['ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa']},
 {id:'chubu',name:{en:'Chubu & Hokuriku',ja:'中部・北陸'},prefectures:['niigata','toyama','ishikawa','fukui','yamanashi','nagano','gifu','shizuoka','aichi']},
 {id:'kansai',name:{en:'Kansai',ja:'関西'},prefectures:['mie','shiga','kyoto','osaka','hyogo','nara','wakayama']},
 {id:'west',name:{en:'Chugoku & Shikoku',ja:'中国・四国'},prefectures:['tottori','shimane','okayama','hiroshima','yamaguchi','tokushima','kagawa','ehime','kochi']},
 {id:'south',name:{en:'Kyushu & Okinawa',ja:'九州・沖縄'},prefectures:['fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima','okinawa']},
] as const;
