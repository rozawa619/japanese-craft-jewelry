import type {Locale} from '../lib/i18n';
export const site = {
 name:'Japanese Craft Jewelry', tagline:'Jewelry, makers & stories from Japan.',
 description:'Explore Japanese craft jewelry, from Hakone yosegi earrings to maker stories across Japan. Compare verified details, materials and official retailer information.',
 locale:'en' as Locale,
 url:import.meta.env.PUBLIC_SITE_URL||'',
 publishMode:import.meta.env.PUBLIC_PUBLISH_MODE||'preview',
 contactEmail:import.meta.env.PUBLIC_CONTACT_EMAIL||'',
 operatorName:import.meta.env.PUBLIC_OPERATOR_NAME||'',
 repositoryUrl:import.meta.env.PUBLIC_REPOSITORY_URL||'',
 socialLinks:[] as {label:string;url:string}[],
};
export const siteDescription=(locale:Locale='en')=>locale==='ja'?'日本の工芸ジュエリーを紹介する独立した編集メディア。作り手・技法・選ぶ前の確認点と公式販売店を、日本各地の産地とともに案内します。':site.description;
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
