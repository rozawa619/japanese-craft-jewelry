import {isPublic,site,pagePath} from '../config/site';
import {catalog,products} from '../lib/catalog';
import {contentFor,contentSlug} from '../lib/content';
import {locales} from '../lib/i18n';
export async function GET(){
 const urls:string[]=[];
 if(isPublic){for(const locale of locales){
  const places=(await contentFor('places',locale)).filter(n=>n.body?.trim()&&products.some(p=>p.prefectureIds.includes(n.data.prefectureId)));
  const crafts=(await contentFor('craftNotes',locale)).filter(n=>n.body?.trim()&&products.some(p=>p.craftIds.includes(n.data.craftId)));
  const routes=['','objects/','places/',...products.map(p=>`objects/${p.slug}/`),...catalog.makers.filter(m=>products.some(p=>p.makerId===m.id)).map(m=>`makers/${m.id}/`),...places.map(n=>`places/${contentSlug(n)}/`),...crafts.map(n=>`crafts/${contentSlug(n)}/`),...(await contentFor('policies',locale)).map(n=>`${contentSlug(n)}/`)];
  urls.push(...routes.map(r=>`<url><loc>${new URL(pagePath(r,locale),site.url).href.replace(/&/g,'&amp;')}</loc></url>`));
 }}
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
