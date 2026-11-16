import type {Locale} from '../lib/i18n';
export const site = {
 name:'Japanese Craft Jewelry', tagline:'Selected Japanese craft jewelry.',
 description:'A curated selection of Japanese craft jewelry, earrings and necklaces. Discover our picks, compare source-checked details and visit the official retailer.',
 locale:'en' as Locale,
 url:import.meta.env.PUBLIC_SITE_URL||'',
 publishMode:import.meta.env.PUBLIC_PUBLISH_MODE||'preview',
 contactEmail:import.meta.env.PUBLIC_CONTACT_EMAIL||'',
 operatorName:import.meta.env.PUBLIC_OPERATOR_NAME||'',
 repositoryUrl:import.meta.env.PUBLIC_REPOSITORY_URL||'',
 socialLinks:[] as {label:string;url:string}[],
};
export const siteDescription=(locale:Locale='en')=>locale==='ja'?'日本各地の工芸ジュエリーをセレクト。おすすめのピアス・イヤリング・ネックレスを、確認した仕様・価格・公式販売店とともに紹介します。':site.description;
export const path=(route='')=>`${import.meta.env.BASE_URL.replace(/\/$/,'')}/${route.replace(/^\//,'')}`;
export const pagePath=(route='',locale:Locale='en')=>path(`${locale}/${route.replace(/^\//,'')}`);
export function localizedPath(pathname:string,locale:Locale){
 const base=path('');
 const relative=pathname.startsWith(base)?pathname.slice(base.length):pathname.replace(/^\//,'');
 const parts=relative.split('/');
 if(parts[0]==='en'||parts[0]==='ja'){parts[0]=locale;return path(parts.join('/'))}
 return pagePath('',locale);
}
export const isPublic=site.publishMode==='public'&&/^https:\/\//.test(site.url);
