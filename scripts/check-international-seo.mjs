import {existsSync,readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {dirname,extname,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnvFile} from 'node:process';
import {productSearchMetadata} from '../src/lib/seo.ts';

// Inspect generated public HTML, not Search Console or Google indexing.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['.env.production.local','.env.production','.env.local','.env'])if(existsSync(resolve(root,name)))loadEnvFile(resolve(root,name));
const dist=resolve(root,process.env.CHECK_DIST_DIR||'dist');
const rawBase=process.env.PUBLIC_BASE_PATH||'/';
const parts=rawBase.split('/').filter(Boolean);
const base='/'+parts.join('/')+(parts.length?'/':'');
const origin=process.env.PUBLIC_SITE_URL?new URL(process.env.PUBLIC_SITE_URL).origin:'';
const reportPath=resolve(root,process.env.SEO_REPORT_PATH||'docs/visual-mobile-stage-seo-results.json');
const catalog=JSON.parse(readFileSync(resolve(root,'src/data/catalog.json'),'utf8'));
const ja=JSON.parse(readFileSync(resolve(root,'src/data/translations/ja.json'),'utf8'));
const registry=JSON.parse(readFileSync(resolve(root,'src/data/editorial-images.json'),'utf8'));
const products=catalog.products.filter(product=>product.publishStatus==='published');
const errors=[];
const report={checkedAt:new Date().toISOString(),method:'Read-only inspection of final local public HTML, sitemap, robots and local image files; not a Google indexing, ranking or traffic measurement.',dist:relative(root,dist).replaceAll(sep,'/'),origin,base,canonicalPages:0,noindexPages:0,productPages:0,productImages:0,checks:[],errors};
const fail=(route,message)=>errors.push(route+': '+message);
const requireCondition=(condition,route,message)=>{if(!condition)fail(route,message);};
const decode=value=>value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi,entity=>{
 const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'};
 if(named[entity.toLowerCase()])return named[entity.toLowerCase()];
 const code=entity[2].toLowerCase()==='x'?parseInt(entity.slice(3,-1),16):parseInt(entity.slice(2,-1),10);
 return code<=0x10ffff?String.fromCodePoint(code):entity;
});
function attributes(source){const result={};for(const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g))result[match[1].toLowerCase()]=decode(match[2]??match[3]??match[4]??'');return result;}
const walk=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(directory,entry.name)):[resolve(directory,entry.name)]);
const tagsIn=html=>[...html.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(match=>({name:match[1].toLowerCase(),attrs:attributes(match[2])}));
const meta=(tags,name,value)=>tags.filter(tag=>tag.name==='meta'&&tag.attrs[name]?.toLowerCase()===value).map(tag=>tag.attrs.content||'');
function structuredTypes(value,found=[]){if(!value||typeof value!=='object')return found;if(Array.isArray(value)){for(const entry of value)structuredTypes(entry,found);return found;}if(value['@type'])found.push(...[value['@type']].flat());for(const entry of Object.values(value))structuredTypes(entry,found);return found;}
function fileForUrl(value){const url=new URL(value);if(url.origin!==origin||!url.pathname.startsWith(base))return undefined;const pathname=decodeURIComponent(url.pathname.slice(base.length));const file=resolve(dist,pathname,pathname.endsWith('/')||!extname(pathname)?'index.html':'');return file===dist||file.startsWith(dist+sep)?file:undefined;}
function finish(){report.status=errors.length?'failed':'passed';mkdirSync(dirname(reportPath),{recursive:true});writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`PASS ${report.canonicalPages} canonical pages; reciprocal hreflang, metadata, JSON-LD and sitemap; ${report.productPages} product pages / ${report.productImages} AI page images; ${report.noindexPages} noindex pages. Google index/ranking/traffic unverified.`);}

if(process.env.PUBLIC_PUBLISH_MODE!=='public'||!origin.startsWith('https://'))fail('configuration','A real public-mode build with configured HTTPS origin/base is required.');
if(!existsSync(dist))fail('build','No generated directory. Build the final site before running this checker.');
if(errors.length){finish();}else{
 const pages=new Map();
 for(const file of walk(dist).filter(file=>extname(file)==='.html')){
  const route=base+relative(dist,file).replaceAll(sep,'/').replace(/index\.html$/,'');
  const html=readFileSync(file,'utf8');
  const tags=tagsIn(html.replace(/<!--[\s\S]*?-->/g,'').replace(/(<script\b(?:"[^"]*"|'[^']*'|[^'">])*>)[\s\S]*?<\/script\s*>/gi,'$1</script>'));
  const robotEntries=meta(tags,'name','robots'),robots=robotEntries.join(',').toLowerCase();
  const links=tags.filter(tag=>tag.name==='link');
  const canonicals=links.filter(tag=>tag.attrs.rel==='canonical');
  requireCondition(robotEntries.length===1,route,'Expected one robots directive.');
  if(/\bnoindex\b/.test(robots)){
   report.noindexPages++;
   requireCondition(canonicals.length===0,route,'Noindex utility pages must not become public canonical destinations.');
   continue;
  }
  const canonical=new URL(route,origin).href;
  requireCondition(canonicals.length===1&&canonicals[0].attrs.href===canonical,route,'Self canonical must preserve origin/base and exclude query/hash.');
  requireCondition(/\bindex\b/.test(robots)&&/\bfollow\b/.test(robots)&&/max-image-preview:large/.test(robots),route,'Public robots must permit indexing, following and large image preview.');
  const locale=route.slice(base.length).split('/')[0];
  requireCondition(['en','ja'].includes(locale),route,'Public canonical must have a supported language path.');
  const htmlTag=tags.find(tag=>tag.name==='html');
  requireCondition(htmlTag?.attrs.lang===locale,route,'HTML language must match URL.');
  requireCondition(tags.filter(tag=>tag.name==='h1').length===1,route,'Expected one visible primary heading.');
  const title=decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'').trim();
  const descriptions=meta(tags,'name','description');
  requireCondition(!!title&&descriptions.length===1&&!!descriptions[0].trim(),route,'Title and one nonempty description are required.');
  const alternates=links.filter(tag=>tag.attrs.rel==='alternate'&&tag.attrs.hreflang);
  requireCondition(alternates.length===3,route,'Expected self/alternate en, ja and x-default hreflang.');
  for(const lang of ['en','ja','x-default']){
   const peer=lang==='x-default'?'en':lang;
   const expected=new URL(base+route.slice(base.length).replace(/^(?:en|ja)\//,peer+'/'),origin).href;
   const matches=alternates.filter(tag=>tag.attrs.hreflang===lang);
   requireCondition(matches.length===1&&matches[0].attrs.href===expected,route,'Incorrect '+lang+' hreflang.');
  }
  const blocks=[];
  for(const match of html.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi))if(attributes(match[1]).type==='application/ld+json'){try{blocks.push(JSON.parse(match[2]));}catch{fail(route,'Malformed JSON-LD.');}}
  requireCondition(blocks.length===1,route,'Expected one page JSON-LD block.');
  const graph=blocks[0]?.['@graph']||[];
  const page=graph.find(entry=>entry['@type']==='WebPage');
  requireCondition(blocks[0]?.['@context']==='https://schema.org'&&page?.url===canonical&&page?.inLanguage===locale,route,'Expected accurate localized WebPage in a Schema.org graph.');
  requireCondition(page?.description===descriptions[0],route,'Structured page summary differs from meta description.');
  const unsupported=blocks.flatMap(block=>structuredTypes(block)).filter(type=>['Product','Offer','AggregateOffer','Review','AggregateRating'].includes(type));
  requireCondition(unsupported.length===0,route,'Do not fabricate product offers, reviews or ratings for this editorial release.');
  const primary=page?.primaryImageOfPage;
  if(primary){
   requireCondition(primary['@type']==='ImageObject'&&primary.contentUrl===primary.url,route,'Primary image must be a consistent ImageObject.');
   requireCondition(primary.caption===(locale==='ja'?'AIイメージ':'AI image')&&primary.digitalSourceType==='https://schema.org/TrainedAlgorithmicMediaDigitalSource',route,'Primary styling image must retain AI provenance.');
   requireCondition(tags.some(tag=>tag.name==='img'&&new URL(tag.attrs.src||'',canonical).href===primary.contentUrl),route,'Primary image is not displayed on this page.');
   for(const key of ['license','acquireLicensePage','copyrightNotice','author'])requireCondition(!Object.hasOwn(primary,key),route,'Do not invent image '+key+'.');
  }
  pages.set(canonical,{route,html,tags,title,description:descriptions[0],page,graph,alternates});
 }
 report.canonicalPages=pages.size;
 requireCondition(pages.size>0,'build','No public canonical pages found.');
 for(const [canonical,page]of pages)for(const alternate of page.alternates){const peer=pages.get(alternate.attrs.href);requireCondition(!!peer,page.route,'Alternate URL is not an indexable built page.');if(peer)requireCondition(peer.alternates.some(link=>link.attrs.hreflang===page.page?.inLanguage&&link.attrs.href===canonical),page.route,'Alternate page does not link back.');}
 const descriptionsByLocale={en:[],ja:[]};
 for(const product of products)for(const locale of ['en','ja']){
  const route=base+locale+'/objects/'+product.slug+'/';
  const canonical=new URL(route,origin).href,entry=pages.get(canonical);
  requireCondition(!!entry,route,'Published localized product page missing.');
  if(!entry)continue;
  report.productPages++;
  const local=locale==='ja'?{...product,...ja.products[product.id]}:product;
  const crafts=product.craftIds.map(id=>locale==='ja'?ja.crafts[id]?.name||catalog.crafts.find(craft=>craft.id===id)?.name:catalog.crafts.find(craft=>craft.id===id)?.name).filter(Boolean).join(locale==='ja'?'、':', ');
  const expected=productSearchMetadata(local,locale,crafts);
  const expectedTitle=expected.title.includes('Japanese Craft Jewelry')?expected.title:expected.title+' | Japanese Craft Jewelry';
  requireCondition(entry.title===expectedTitle&&entry.description===expected.description,route,'Product metadata must derive from localized canonical copy.');
  descriptionsByLocale[locale].push(entry.description);
  requireCondition(entry.page?.about?.['@type']==='Thing'&&entry.page.about.name===local.title,route,'Editorial subject must be the localized product name.');
  const breadcrumbs=entry.graph.find(node=>node['@type']==='BreadcrumbList');
  const items=breadcrumbs?.itemListElement;
  requireCondition(entry.page?.breadcrumb?.['@id']===breadcrumbs?.['@id']&&items?.length===2&&items[0].position===1&&items[0].name===(locale==='ja'?'商品セレクト':'The selection')&&items[0].item===new URL(base+locale+'/objects/',origin).href&&items[1].position===2&&items[1].name===local.title&&items[1].item===canonical,route,'Visible selection/product breadcrumb hierarchy is incomplete.');
  const image=registry[product.id],primary=entry.page?.primaryImageOfPage;
  requireCondition(!!image,route,'Published product lacks a registered styling image.');
  if(image){
   const expectedImage=new URL(base+image.path,origin).href;
   requireCondition(primary?.contentUrl===expectedImage&&primary?.width===image.width&&primary?.height===image.height&&primary?.description===image.alt[locale],route,'AI page image differs from the reviewed image registry.');
   requireCondition(meta(entry.tags,'property','og:image')[0]===expectedImage&&meta(entry.tags,'property','og:image:alt')[0]===image.alt[locale],route,'Localized Open Graph image/alt differs from the registry.');
   requireCondition(entry.tags.some(tag=>tag.name==='img'&&new URL(tag.attrs.src||'',canonical).href===expectedImage&&tag.attrs.alt===image.alt[locale]),route,'Visible product image and localized alt differ from metadata.');
   const imageFile=fileForUrl(expectedImage);
   requireCondition(!!imageFile&&existsSync(imageFile),route,'Primary image is not present in generated files.');
   const caption=locale==='ja'?'AIイメージ':'AI image';
   requireCondition([...entry.html.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/gi)].some(match=>decode(match[1].replace(/<[^>]+>/g,'')).trim()===caption),route,'Visible AI image caption missing.');
   if(primary?.contentUrl===expectedImage)report.productImages++;
  }
 }
 for(const locale of ['en','ja'])requireCondition(new Set(descriptionsByLocale[locale]).size===products.length,locale,'Localized published product descriptions must be distinct and complete.');
 requireCondition(report.productPages===products.length*2&&report.productImages===products.length*2,'products','All published products need both localized page/image records.');
 const sitemapFile=resolve(dist,'sitemap.xml');
 if(!existsSync(sitemapFile))fail('sitemap','Missing sitemap.xml.');else{
  const locations=[...readFileSync(sitemapFile,'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>decode(match[1]));
  report.sitemapUrls=locations.length;
  requireCondition(new Set(locations).size===locations.length,'sitemap','Duplicate URL.');
  requireCondition(locations.length===pages.size&&locations.every(url=>pages.has(url)),'sitemap','Sitemap and indexable canonical page set must match.');
  for(const url of locations){const parsed=new URL(url);requireCondition(parsed.origin===origin&&parsed.pathname.startsWith(base)&&!parsed.search&&!parsed.hash&&!/\/(?:journal|contact)\//.test(parsed.pathname),'sitemap','Noncanonical, retired or out-of-base URL.');}
 }
 const robotsFile=resolve(dist,'robots.txt');
 if(!existsSync(robotsFile))fail('robots','Missing robots.txt.');else{const robots=readFileSync(robotsFile,'utf8');requireCondition(/User-agent:\s*\*/i.test(robots)&&/^Allow:\s*\/$/m.test(robots)&&!/^Disallow:\s*\/$/m.test(robots)&&robots.includes('Sitemap: '+new URL(base+'sitemap.xml',origin).href),'robots','Public crawl or sitemap instructions are incorrect.');}
 report.checks=['Final public canonical and sitemap URL sets match','Localized metadata and reciprocal en/ja/x-default hreflang','All published product metadata derives from canonical copy','Visible breadcrumb hierarchy and editorial WebPage subject','Registered local AI images, visible caption and localized OG/HTML alt','No invented Product/Offer/review/rating or image licensing claims','Public robots and noindex utility isolation'];
 finish();
}
