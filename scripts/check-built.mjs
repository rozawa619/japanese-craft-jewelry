import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from 'node:process';
import { createHash } from 'node:crypto';
import { resolveRetailerLink, policyForLink, linksInLocale } from '../src/lib/affiliate.ts';
import {collectVisitValidationErrors,officialProductLinks,storeMapLinks} from '../src/lib/visits.ts';
import {purchaseEvidenceFor} from '../src/lib/purchase-evidence.ts';
import {materialCollections} from '../src/lib/material-collections.ts';
import {validateMarketRetailerAnchor} from './market-link-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['.env.production.local', '.env.production', '.env.local', '.env']) {
  if (existsSync(resolve(root, name))) loadEnvFile(resolve(root, name));
}
const dist = resolve(root, process.env.CHECK_DIST_DIR || 'dist');
const rawBase = process.env.PUBLIC_BASE_PATH || '/';
const base = `/${rawBase.split('/').filter(Boolean).join('/')}${rawBase.split('/').filter(Boolean).length ? '/' : ''}`;
const siteUrl = process.env.PUBLIC_SITE_URL || '';
const publicMode = process.env.PUBLIC_PUBLISH_MODE === 'public' && /^https:\/\//.test(siteUrl);
const origin = siteUrl ? new URL(siteUrl).origin : 'https://ito-build-check.invalid';
const errors = [];
let checkedLinks = 0;
let checkedAnchors = 0;
let retailerLinks = 0;
let sponsoredLinks = 0;
let legacyRedirects = 0;
let inlineScriptHashes = 0;
let jsonDataBlocks = 0;
const legacyTargets = {"":"objects/","hakone-yosegi-pierced-earrings":"objects/hamamatsuya-surgical-stainless-pierced-earrings/","hakone-yosegi-non-pierced-earrings":"objects/hamamatsuya-yosegi-non-pierced-earrings/","everyday-craft-earrings":"objects/","pierced-or-clip-on":"objects/","buying-from-overseas":"objects/","understanding-yosegi":"crafts/hakone-yosegi/"};
const fail = (file, message) => errors.push(`${relative(dist, file).replaceAll(sep, '/')}: ${message}`);
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
  const code = entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
  return code <= 0x10ffff ? String.fromCodePoint(code) : entity;
});
function attributes(source) {
  const result = {};
  for (const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
}
if (!existsSync(dist)) throw new Error('No dist directory. Run the production build before this check.');
const files = walk(dist).filter(file => extname(file) === '.html');
if (!files.length) throw new Error('No generated HTML files found.');
const pages = new Map();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const tokenSource = html.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b(?:"[^"]*"|'[^']*'|[^'">])*>)[\s\S]*?<\/script\s*>/gi, '$1</script>');
  const tags = [...tokenSource.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(match => ({ name: match[1].toLowerCase(), attrs: attributes(match[2]), index: match.index }));
  const ids = new Set(tags.flatMap(tag => tag.attrs.id ? [tag.attrs.id] : tag.name === 'a' && tag.attrs.name ? [tag.attrs.name] : []));
  pages.set(file, { html, tokenSource, tags, ids });
}
function requestPath(file) {
  let route = relative(dist, file).replaceAll(sep, '/');
  if (route.endsWith('index.html')) route = route.slice(0, -'index.html'.length);
  return `${base}${route}`;
}
function internalTarget(file, value) {
  if (!value || /^(?:mailto:|tel:|data:|javascript:|blob:)/i.test(value)) return null;
  let url;
  try { url = new URL(value, `${origin}${requestPath(file)}`); }
  catch { fail(file, `invalid URL ${value}`); return null; }
  if (url.origin !== origin) return null;
  const pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith(base) && pathname !== base.slice(0, -1)) { fail(file, `same-site URL escapes configured base ${base}: ${value}`); return null; }
  const route = pathname === base.slice(0, -1) ? '' : pathname.slice(base.length);
  let target = resolve(dist, route);
  if (target !== dist && !target.startsWith(`${dist}${sep}`)) { fail(file, `path escapes dist: ${value}`); return null; }
  if (existsSync(target) && statSync(target).isDirectory()) target = resolve(target, 'index.html');
  else if (!existsSync(target) && !extname(target)) target = resolve(target, 'index.html');
  if (!existsSync(target)) { fail(file, `missing internal target ${value}`); return null; }
  return { file: target, hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : '' };
}
const catalog = JSON.parse(readFileSync(resolve(root, 'src/data/catalog.json'), 'utf8'));
const visitData=JSON.parse(readFileSync(resolve(root,'src/data/visits.json'),'utf8'));
const visitSources=JSON.parse(readFileSync(resolve(root,'docs/research/sources.json'),'utf8'));
for(const error of collectVisitValidationErrors(visitData,catalog,visitSources))errors.push('Visit information: '+error);
const expectedRetailerLinksFor=(locale)=>new Set(linksInLocale(catalog.links,locale).flatMap(link => {
  const status = catalog.programs.find(program => program.id === link.programId)?.applicationStatus;
  const result = resolveRetailerLink(link, status, policyForLink(link, catalog));
  return result ? [`${result.sponsored}|${result.href}`] : [];
}));
for (const [file, page] of pages) {
  const { tags, html, tokenSource } = page;
  const getMeta = (attribute, value) => tags.find(tag => tag.name === 'meta' && tag.attrs[attribute]?.toLowerCase() === value)?.attrs.content || '';
  const csp = getMeta('http-equiv', 'content-security-policy');
  const directives = new Map(csp.split(';').map(part => part.trim().split(/\s+/)).filter(parts => parts[0]).map(([name,...values]) => [name,values]));
  for(const name of ['default-src','script-src'])if(!directives.get(name)?.includes("'self'"))fail(file,`CSP ${name} must restrict navigation assets to self`);
  for(const name of ['object-src','base-uri','form-action','connect-src'])if(directives.get(name)?.join(' ')!=="'none'")fail(file,`CSP ${name} must remain none for this static site`);
  if(directives.get('frame-src')?.join(' ')!=='https://www.google.com')fail(file,'CSP frame-src must allow only the explicitly loaded Google map origin');
  if(directives.get('script-src')?.some(value=>["'unsafe-inline'","'unsafe-eval'",'*'].includes(value)))fail(file,'CSP must not permit unsafe script execution');
  for(const tag of tags)if(Object.keys(tag.attrs).some(name=>/^on[a-z]+$/i.test(name)))fail(file,'inline event-handler attribute bypasses the script policy');
  for(const script of html.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi)){
    const attrs=attributes(script[1]);
    // JSON/JSON-LD are inert data blocks, not executable inline JavaScript.
    // Astro intentionally does not add their hashes to script-src.
    if(['application/ld+json','application/json'].includes((attrs.type||'').trim().toLowerCase())){
      try{JSON.parse(script[2]);jsonDataBlocks++;}catch{fail(file,'structured JSON data block is invalid')}
      continue;
    }
    if(attrs.src){try{if(new URL(attrs.src,origin+requestPath(file)).origin!==origin)fail(file,'script source must remain on this site');}catch{fail(file,'invalid script source')}}
    else if(script[2].trim()){
      const hash="'sha256-"+createHash('sha256').update(script[2]).digest('base64')+"'";
      if(!directives.get('script-src')?.includes(hash))fail(file,'inline script hash is missing from CSP');
      inlineScriptHashes++;
    }
  }
  if (!tags.find(tag => tag.name === 'html')?.attrs.lang) fail(file, 'missing document language');
  if (!/<title\b[^>]*>\s*[^<]+<\/title>/i.test(html)) fail(file, 'missing nonempty title');
  const redirect = !!getMeta('http-equiv', 'refresh');
  if (!redirect) {
    if (!getMeta('name', 'description').trim()) fail(file, 'missing description');
    const h1Count = tags.filter(tag => tag.name === 'h1').length;
    if (h1Count !== 1) fail(file, `expected one h1, found ${h1Count}`);
  }
  const routePath=requestPath(file);
  const localeMatch=routePath.slice(base.length).match(/^(en|ja)\//);
  const isLanguageEntry=routePath===base;
  if(isLanguageEntry){
   if(redirect)fail(file,'language entry must not automatically redirect');
   if(!getMeta('name','robots').split(/[\s,]+/).includes('noindex'))fail(file,'language selector should remain outside content indexing');
   for(const locale of ['en','ja'])if(!tags.some(tag=>tag.name==='a'&&tag.attrs['data-entry-language']===locale&&tag.attrs.href===base+locale+'/'))fail(file,'language entry lacks a permanent '+locale+' HTML link');
  }
  if(localeMatch&&!redirect){
    const locale=localeMatch[1],peer=locale==='en'?'ja':'en';
    const expectedPeer=base+peer+'/'+routePath.slice(base.length+locale.length+1);
    if(tags.find(tag=>tag.name==='html')?.attrs.lang!==locale)fail(file,'html lang does not match route locale');
    const switches=tags.filter(tag=>tag.name==='a'&&(tag.attrs.class||'').split(/\s+/).includes('language-switch'));
    if(switches.length!==1)fail(file,'expected one persistent language switch');
    else{const target=internalTarget(file,switches[0].attrs.href);if(!target||new URL(switches[0].attrs.href,origin+routePath).pathname!==expectedPeer)fail(file,'language switch does not target matching translated page');}
    if(publicMode){
      for(const alternateLocale of ['en','ja']){
        const expected=routePath.replace('/'+locale+'/','/'+alternateLocale+'/');
        const alternate=tags.find(tag=>tag.name==='link'&&(tag.attrs.rel||'').split(/\s+/).includes('alternate')&&tag.attrs.hreflang===alternateLocale);
        if(!alternate||alternate.attrs.href!==origin+expected)fail(file,'missing correct '+alternateLocale+' hreflang alternate');
      }
      const fallback=tags.find(tag=>tag.name==='link'&&tag.attrs.hreflang==='x-default');
      if(!fallback||fallback.attrs.href!==origin+routePath.replace('/'+locale+'/','/en/'))fail(file,'missing English x-default language fallback');
    }
  }
  const objectRoute=routePath.slice(base.length).match(/^(en|ja)\/objects\/([^/]+)\/$/);
  if(objectRoute&&!redirect){
    const locale=objectRoute[1],product=catalog.products.find(product=>product.slug===objectRoute[2]);
    const intro=tags.find(tag=>'data-product-intro' in tag.attrs);
    const price=tags.find(tag=>'data-product-price' in tag.attrs);
    const primary=tags.find(tag=>'data-product-primary-cta' in tag.attrs);
    const details=tags.find(tag=>'data-product-details' in tag.attrs);
    const firstRetailer=tags.find(tag=>tag.name==='a'&&'data-sponsored' in tag.attrs);
    if(!intro||!price||!primary||!details)fail(file,'product purchase flow markers are incomplete');
    if(details&&(details.name!=='details'||'open' in details.attrs))fail(file,'technical specifications must use an initially closed details panel');
    if(details&&[price,primary,firstRetailer].some(tag=>!tag||tag.index>=details.index))fail(file,'price and primary retailer action must precede technical specifications');
    const entry=visitData.products.find(entry=>entry.productId===product?.id);
    const visit=tags.find(tag=>'data-visit-guide' in tag.attrs);
    const outfit=tags.find(tag=>(tag.attrs.class||'').split(/\s+/).includes('purchase-outfit'));
    const next=tags.find(tag=>(tag.attrs.class||'').split(/\s+/).includes('purchase-next'));
    if(!entry||!visit)fail(file,'every product needs its official URL and sourced visit/fallback guide');
    if(visit&&(!outfit||!next||visit.index<outfit.index||visit.index>next.index))fail(file,'visit guide should follow the outfit and precede the final CTA');
    if(entry&&product){
      const evidence=purchaseEvidenceFor(product.id);
      const confirmations=tags.filter(tag=>'data-purchase-evidence' in tag.attrs);
      const [confirmation]=confirmations;
      if(confirmations.length!==1||confirmation.attrs['data-purchase-evidence']!==evidence.kind||confirmation.attrs['data-purchase-checked-at']!==evidence.checkedAt||!intro||!primary||confirmation.index<=intro.index||confirmation.index>=primary.index)fail(file,'purchase confirmation and its date must appear once, beside the primary action');
      const imageNotes=tags.filter(tag=>tag.attrs['data-product-image-note']==='full');
      const [imageNote]=imageNotes;
      if(imageNotes.length!==1||imageNote.name!=='p'||!confirmation||!primary||imageNote.index<=confirmation.index||imageNote.index>=primary.index)fail(file,'AI image guidance must appear once between the purchase evidence and the primary action');
      if(primary){
        const primaryEnd=tokenSource.indexOf('</div>',primary.index);
        const actions=tags.filter(tag=>tag.name==='a'&&tag.index>primary.index&&tag.index<primaryEnd);
        const selections=confirmation?tags.filter(tag=>tag.index>confirmation.index&&tag.index<primary.index&&'data-purchase-selection' in tag.attrs):[];
        if(evidence.listingSelection){
          if(selections.length!==1||selections[0].attrs['data-purchase-selection']!==evidence.linkId||!actions.some(action=>action.attrs['data-market-link-id']===evidence.linkId))fail(file,'the verified listing selection must be visible beside its purchase link');
        }else if(selections.length)fail(file,'a listing selection requires verified evidence');
        const catalogRoute=evidence.kind==='retail-and-catalog';
        const routeLabels={
          'retail-and-catalog':locale==='ja'?'公式カタログを見る':'Official catalog',
          'online-order':locale==='ja'?'公式通販を見る':'Official shop',
          'reservation-inquiry':locale==='ja'?'公式の予約案内を見る':'Official reservation details',
        };
        for(const action of actions){
          const expected=action.attrs['data-market-link-id']===evidence.linkId?routeLabels[evidence.kind]:(locale==='ja'?'日本向け公式ページ':'Japan official listing');
          const labelStart=tokenSource.indexOf('>',action.index)+1;
          if(!tokenSource.startsWith(expected+' ',labelStart))fail(file,'primary action label must reflect the confirmed purchase route for its link');
        }
        const shortcut=tags.find(tag=>'data-price-visit-link' in tag.attrs);
        if(catalogRoute&&(!shortcut||shortcut.index<primaryEnd||shortcut.attrs.href!=='#'+visit?.attrs.id||!entry.storeIds.length))fail(file,'catalog-based buying needs a nearby shortcut to its verified stockists');
      }
      const official=tags.filter(tag=>tag.name==='a'&&'data-official-product-url' in tag.attrs),expected=officialProductLinks(product.id,locale,catalog);
      if(!expected.length||official.length!==expected.length)fail(file,'missing explicit language-matched official product URL');
      for(const link of expected){const tag=official.find(tag=>tag.attrs['data-official-product-url']===link.id);if(!tag||tag.attrs.href!==link.url||(tag.attrs.rel||'').split(/\s+/).includes('sponsored'))fail(file,'explicit official URL must stay ordinary and on the verified merchant host')}
      const homes=tags.filter(tag=>tag.name==='a'&&'data-official-home-url' in tag.attrs);
      if(homes.length!==(entry.officialHomeUrl?1:0)||entry.officialHomeUrl&&homes[0]?.attrs.href!==new URL(entry.officialHomeUrl).href)fail(file,'official brand/retailer home URL disagrees with visit records');
      const cards=tags.filter(tag=>'data-store-id' in tag.attrs).map(tag=>tag.attrs['data-store-id']);
      if(cards.length!==entry.storeIds.length||cards.some(id=>!entry.storeIds.includes(id)))fail(file,'rendered stores disagree with the researched product mapping');
      const maps=tags.filter(tag=>tag.name==='a'&&'data-map-action' in tag.attrs);
      if(maps.length!==entry.storeIds.length*2)fail(file,'each verified store needs Maps search and directions; an unconfirmed store needs none');
      for(const id of entry.storeIds){const store=visitData.stores.find(store=>store.id===id),expected=store&&storeMapLinks(store);if(!expected||!Object.values(expected).every(url=>maps.some(tag=>tag.attrs.href===url)))fail(file,'Google Maps URL must be generated from the verified store query')}
      if(!entry.storeIds.length&&(!tags.some(tag=>'data-store-fallback' in tag.attrs)||visit?.attrs['data-visit-status']!=='unconfirmed-store'))fail(file,'unconfirmed stores need an honest fallback, without an invented map');
      for(const tag of [...official,...homes,...maps])if(!['noopener','noreferrer'].every(value=>(tag.attrs.rel||'').split(/\s+/).includes(value)))fail(file,'official/store external links need noopener and noreferrer');
    }
  }
  const canonical = tags.filter(tag => tag.name === 'link' && (tag.attrs.rel || '').split(/\s+/).includes('canonical'));
  const robots = getMeta('name', 'robots');
  const is404 = /(?:^|[\\/])404(?:\.html|[\\/]index\.html)$/.test(file);
  const legacyMatch=routePath.slice(base.length).match(/^(en|ja)\/journal\/(.*)$/);
  if(legacyMatch){
    const slug=legacyMatch[2].replace(/\/$/,'');
    const target=Object.hasOwn(legacyTargets,slug)?base+legacyMatch[1]+'/'+legacyTargets[slug]:null;
    legacyRedirects++;
    if(!target)fail(file,'unexpected retired reading route generated');
    if(!redirect)fail(file,'retired reading route is not a redirect');
    if(target&&getMeta('http-equiv','refresh')!=='0;url='+target)fail(file,'retired reading route has the wrong refresh destination');
    if(target&&tags.find(tag=>tag.name==='body')?.attrs['data-legacy-redirect']!==target)fail(file,'retired reading route is missing its explicit redirect target');
    if(!robots.split(/[\s,]+/).includes('noindex')||!robots.split(/[\s,]+/).includes('nofollow'))fail(file,'retired reading redirect must be noindex and nofollow');
    if(canonical.length||getMeta('property','og:url')||tags.some(tag=>tag.name==='link'&&tag.attrs.hreflang))fail(file,'retired reading redirect must not emit content SEO metadata');
    if(tags.some(tag=>tag.name==='article')||/"@type"\s*:\s*"Article"/.test(html))fail(file,'retired reading route contains article content');
    if(target&&!tags.some(tag=>tag.name==='a'&&tag.attrs.href===target))fail(file,'retired reading redirect lacks a manual fallback link');
  }
  if (!publicMode) {
    if (!robots.split(/[\s,]+/).includes('noindex')) fail(file, 'preview is missing noindex');
    if (canonical.length) fail(file, 'preview must not emit canonical');
    if (getMeta('property', 'og:url')) fail(file, 'preview must not emit og:url');
  } else if (!redirect && !is404 && !isLanguageEntry) {
    if (canonical.length !== 1) fail(file, 'public content needs exactly one canonical');
    else if (canonical[0].attrs.href !== `${origin}${requestPath(file)}`) fail(file, 'canonical does not match actual route and configured base');
    if (!getMeta('property', 'og:url')) fail(file, 'public content needs og:url');
    if (robots.split(/[\s,]+/).includes('noindex')) fail(file, 'public content unexpectedly noindex');
  }
  for(const figure of html.matchAll(/<figure\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/figure>/gi)){
    if(!Object.hasOwn(attributes(figure[1]),'data-editorial-asset'))continue;
    const caption=figure[2].match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1].replace(/<[^>]*>/g,'').trim();
    const locale=tags.find(tag=>tag.name==='html')?.attrs.lang;
    if(caption!==(locale==='ja'?'AIイメージ':'AI image'))fail(file,'editorial imagery must use exactly the requested short AI image caption');
  }
  const ogImage=getMeta('property','og:image');
  if(ogImage){const target=internalTarget(file,ogImage);if(!target||!publicMode)fail(file,'social image must use a local public asset in a public build')}
  const disclosureTags = tags.filter(tag => tag.attrs['data-disclosure']);
  const renderedSponsored = tags.filter(tag => tag.name === 'a' && (tag.attrs.rel || '').split(/\s+/).includes('sponsored'));
  if (renderedSponsored.length) {
    const disclosure = disclosureTags.find(tag => tag.attrs['data-disclosure'] === 'affiliate' && tag.index < renderedSponsored[0].index);
    if (!disclosure) fail(file, 'affiliate disclosure is missing before the first sponsored link');
    else if (!/commission|報酬|コミッション/i.test(tokenSource.slice(disclosure.index, tokenSource.indexOf('</aside>', disclosure.index)))) fail(file, 'disclosure does not explain the commission relationship');
  } else if (disclosureTags.some(tag => tag.attrs['data-disclosure'] === 'affiliate')) fail(file, 'affiliate disclosure appears without a sponsored link');
  if (renderedSponsored.length && disclosureTags.some(tag => tag.attrs['data-disclosure'] === 'ordinary')) fail(file, 'ordinary-link disclosure contradicts sponsored links');
  for (const tag of tags) {
    if (tag.name === 'a') {
      if(!redirect&&tag.attrs.href){
        try{const destination=new URL(tag.attrs.href,origin+routePath);if(destination.origin===origin&&['en','ja'].some(locale=>destination.pathname.startsWith(base+locale+'/journal/')))fail(file,'normal content links to a retired reading route');if(destination.origin===origin&&['en','ja'].some(locale=>destination.pathname===base+locale+'/contact/'))fail(file,'normal content links to the unpublished Contact route');}catch{}
      }
      const rel = (tag.attrs.rel || '').split(/\s+/);
      const isSponsored = rel.includes('sponsored');
      if (tag.attrs['data-sponsored'] !== undefined) {
        retailerLinks++;
        if ((tag.attrs['data-sponsored'] === 'true') !== isSponsored) fail(file, 'retailer data-sponsored and rel disagree');
        let href;
        try { href = new URL(tag.attrs.href).href; } catch { fail(file, 'retailer link is not an absolute URL'); }
        if('data-purchase-market' in tag.attrs){
          const market=validateMarketRetailerAnchor(tag.attrs,localeMatch?.[1]||'en',catalog);
          if(!market.valid)fail(file,'invalid purchase-market retailer link: '+market.reason);
        }else if (!expectedRetailerLinksFor(localeMatch?.[1]||'en').has(`${isSponsored}|${href}`)) fail(file, 'retailer link does not match the page language and current catalog approval state');
      }
      if (isSponsored) {
        sponsoredLinks++;
        if (tag.attrs['data-sponsored'] !== 'true') fail(file, 'sponsored link bypasses common retailer component');
        if (tag.attrs.target === '_blank' && !rel.includes('noopener')) fail(file, 'new-tab sponsored link needs noopener');
      }
    }
    for (const attr of ['href', 'src']) {
      if (!(attr in tag.attrs)) continue;
      checkedLinks++;
      const target = internalTarget(file, tag.attrs[attr]);
      if (target?.hash && pages.has(target.file)) {
        checkedAnchors++;
        if (!pages.get(target.file).ids.has(target.hash)) fail(file, `missing anchor ${tag.attrs[attr]}`);
      }
    }
  }
}
if (!existsSync(resolve(dist, '404.html')) && !existsSync(resolve(dist, '404/index.html'))) errors.push('Missing generated 404 page.');
for(const locale of ['en','ja'])if(existsSync(resolve(dist,locale,'contact/index.html')))errors.push(`Unpublished Contact page generated for ${locale}.`);
const sitemapFiles = walk(dist).filter(file => /(?:^|[\\/])sitemap[^\\/]*\.xml$/.test(file));
if (!sitemapFiles.length) errors.push('Missing sitemap XML.');
for (const file of sitemapFiles) {
  const xml = readFileSync(file, 'utf8');
  if (!publicMode && /<loc(?:\s|>)/.test(xml)) fail(file, 'preview sitemap must have no URLs');
  if (publicMode) {
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
    if (!locations.length) fail(file, 'public sitemap is empty');
    for (const location of locations) {
      if (!location.startsWith(`${origin}${base}`)) fail(file, `sitemap URL does not match public origin/base: ${location}`);
      if(/\/(?:en|ja)\/journal\//.test(location))fail(file,'retired reading redirect is included in the public sitemap');
      if(/\/(?:en|ja)\/contact\//.test(location))fail(file,'unpublished Contact route is included in the public sitemap');
      internalTarget(file, location);
    }
  }
}
const robotsFile = resolve(dist, 'robots.txt');
if (!existsSync(robotsFile)) errors.push('Missing robots.txt.');
else if (!publicMode && !/^Disallow:\s*\/\s*$/im.test(readFileSync(robotsFile, 'utf8'))) errors.push('Preview robots.txt must disallow all crawling.');
for (const {id,route} of materialCollections) {
  const expected = new Set(catalog.products.filter(product=>product.publishStatus==='published'&&product.materialIds.includes(id)).map(product=>product.id));
  for (const locale of ['en','ja']) {
    const file = resolve(dist,locale,route,'index.html');
    const items = pages.get(file)?.tags.filter(tag=>'data-product-card' in tag.attrs).map(tag=>tag.attrs['data-product-id']) ?? [];
    if (items.length!==expected.size||new Set(items).size!==expected.size||items.some(item=>!expected.has(item))) {
      fail(file,'material collection must include each published matching product exactly once');
    }
    const listing = pages.get(resolve(dist,locale,'objects/index.html'));
    if (!listing?.tags.some(tag=>tag.name==='a'&&tag.attrs.href===`${base}${locale}/${route}`)) {
      fail(file,'material collection must be linked from the localized product index');
    }
  }
}
for (const product of catalog.products) {
  for(const locale of ['en','ja']){
    const output=resolve(dist,`${locale}/objects/${product.slug}/index.html`);
    if(product.publishStatus==='draft'){
      if(existsSync(output))fail(output,'draft product generated a public page');
      for(const [file,page] of pages)if(page.html.includes(`/objects/${product.slug}/`))fail(file,`draft product leaked into markup: ${product.id}`);
    }else if(!existsSync(output))errors.push(`Missing published ${locale} product page: ${product.slug}`);
  }
}
for(const [directory,section]of [['guides','journal'],['policies',''],['places','places'],['crafts','crafts']]){
 const directoryPath=resolve(root,'src/content',directory);
 for(const file of walk(directoryPath).filter(file=>file.endsWith('.md'))){
  const body=readFileSync(file,'utf8'),fm=body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if(!fm||!/^publishStatus:\s*["']?draft["']?\s*$/m.test(fm[1]))continue;
  const local=relative(directoryPath,file).replaceAll(sep,'/');
  const locale=/^locale:\s*["']?ja["']?\s*$/m.test(fm[1])?'ja':'en';
  const slug=local.replace(/^ja\//,'').replace(/\.md$/,'');
  const route=`${locale}/${section?section+'/':''}${slug}/`;
  if(existsSync(resolve(dist,route,'index.html'))){
   const output=pages.get(resolve(dist,route,'index.html'));
   const retiredRedirect=directory==='guides'&&Object.hasOwn(legacyTargets,slug)&&output?.tags.some(tag=>tag.name==='body'&&tag.attrs['data-legacy-redirect']);
   if(!retiredRedirect)errors.push(`Draft ${directory} page generated: ${route}`);
  }
  for(const [output,page]of pages)if(page.html.includes('/'+route))fail(output,`draft ${directory} route leaked: ${route}`);
 }
}
if(legacyRedirects!==Object.keys(legacyTargets).length*2)errors.push('Expected exactly 14 known retired reading redirects.');
if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  console.error(`${errors.length} generated-site problem(s).`);
  process.exitCode = 1;
} else console.log(`PASS ${files.length} HTML pages; ${checkedLinks} href/src references; ${checkedAnchors} anchors; ${retailerLinks} retailer links (${sponsoredLinks} sponsored); ${inlineScriptHashes} executable inline script CSP hashes; ${jsonDataBlocks} valid inert JSON data blocks; ${legacyRedirects} retired reading redirects, 404, drafts, ${publicMode ? 'public' : 'preview'} metadata, sitemap and robots. Base: ${base}`);
