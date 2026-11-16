import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from 'node:process';
import { resolveRetailerLink } from '../src/lib/affiliate.ts';

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
  pages.set(file, { html, tags, ids });
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
const expectedRetailerLinks = new Set(catalog.links.flatMap(link => {
  const status = catalog.programs.find(program => program.id === link.programId)?.applicationStatus;
  const result = resolveRetailerLink(link, status);
  return result ? [`${result.sponsored}|${result.href}`] : [];
}));
for (const [file, page] of pages) {
  const { tags, html } = page;
  const getMeta = (attribute, value) => tags.find(tag => tag.name === 'meta' && tag.attrs[attribute]?.toLowerCase() === value)?.attrs.content || '';
  if (!tags.find(tag => tag.name === 'html')?.attrs.lang) fail(file, 'missing document language');
  if (!/<title\b[^>]*>\s*[^<]+<\/title>/i.test(html)) fail(file, 'missing nonempty title');
  const redirect = !!getMeta('http-equiv', 'refresh');
  if (!redirect) {
    if (!getMeta('name', 'description').trim()) fail(file, 'missing description');
    const h1Count = tags.filter(tag => tag.name === 'h1').length;
    if (h1Count !== 1) fail(file, `expected one h1, found ${h1Count}`);
  }
  const canonical = tags.filter(tag => tag.name === 'link' && (tag.attrs.rel || '').split(/\s+/).includes('canonical'));
  const robots = getMeta('name', 'robots');
  const is404 = /(?:^|[\\/])404(?:\.html|[\\/]index\.html)$/.test(file);
  if (!publicMode) {
    if (!robots.split(/[\s,]+/).includes('noindex')) fail(file, 'preview is missing noindex');
    if (canonical.length) fail(file, 'preview must not emit canonical');
    if (getMeta('property', 'og:url')) fail(file, 'preview must not emit og:url');
  } else if (!redirect && !is404) {
    if (canonical.length !== 1) fail(file, 'public content needs exactly one canonical');
    else if (canonical[0].attrs.href !== `${origin}${requestPath(file)}`) fail(file, 'canonical does not match actual route and configured base');
    if (!getMeta('property', 'og:url')) fail(file, 'public content needs og:url');
    if (robots.split(/[\s,]+/).includes('noindex')) fail(file, 'public content unexpectedly noindex');
  }
  const disclosureTags = tags.filter(tag => tag.attrs['data-disclosure']);
  const renderedSponsored = tags.filter(tag => tag.name === 'a' && (tag.attrs.rel || '').split(/\s+/).includes('sponsored'));
  if (renderedSponsored.length) {
    const disclosure = disclosureTags.find(tag => tag.attrs['data-disclosure'] === 'affiliate' && tag.index < renderedSponsored[0].index);
    if (!disclosure) fail(file, 'affiliate disclosure is missing before the first sponsored link');
    else if (!/commission/i.test(html.slice(disclosure.index, html.indexOf('</aside>', disclosure.index)))) fail(file, 'disclosure does not explain the commission relationship');
  } else if (disclosureTags.some(tag => tag.attrs['data-disclosure'] === 'affiliate')) fail(file, 'affiliate disclosure appears without a sponsored link');
  if (renderedSponsored.length && disclosureTags.some(tag => tag.attrs['data-disclosure'] === 'ordinary')) fail(file, 'ordinary-link disclosure contradicts sponsored links');
  for (const tag of tags) {
    if (tag.name === 'a') {
      const rel = (tag.attrs.rel || '').split(/\s+/);
      const isSponsored = rel.includes('sponsored');
      if (tag.attrs['data-sponsored'] !== undefined) {
        retailerLinks++;
        if ((tag.attrs['data-sponsored'] === 'true') !== isSponsored) fail(file, 'retailer data-sponsored and rel disagree');
        let href;
        try { href = new URL(tag.attrs.href).href; } catch { fail(file, 'retailer link is not an absolute URL'); }
        if (!expectedRetailerLinks.has(`${isSponsored}|${href}`)) fail(file, 'retailer link does not match the current catalog approval state');
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
      internalTarget(file, location);
    }
  }
}
const robotsFile = resolve(dist, 'robots.txt');
if (!existsSync(robotsFile)) errors.push('Missing robots.txt.');
else if (!publicMode && !/^Disallow:\s*\/\s*$/im.test(readFileSync(robotsFile, 'utf8'))) errors.push('Preview robots.txt must disallow all crawling.');
for (const product of catalog.products) {
  const output = resolve(dist, `en/objects/${product.slug}/index.html`);
  if (product.publishStatus === 'draft') {
    if (existsSync(output)) fail(output, 'draft product generated a public page');
    for (const [file, page] of pages) if (page.html.includes(`/objects/${product.slug}/`)) fail(file, `draft product leaked into markup: ${product.id}`);
  } else if (!existsSync(output)) errors.push(`Missing published product page: ${product.slug}`);
}
for (const [directory, route] of [['guides', 'en/journal'], ['policies', 'en']]) {
  const directoryPath = resolve(root, 'src/content', directory);
  for (const file of walk(directoryPath).filter(file => file.endsWith('.md'))) {
    const body = readFileSync(file, 'utf8');
    const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter || !/^publishStatus:\s*["']?draft["']?\s*$/m.test(frontmatter[1])) continue;
    const slug = relative(directoryPath, file).replaceAll(sep, '/').replace(/\.md$/, '');
    if (existsSync(resolve(dist, `${route}/${slug}/index.html`))) errors.push(`Draft ${directory} page was generated: ${slug}`);
    for (const [output, page] of pages) if (page.html.includes(`/${route}/${slug}/`)) fail(output, `draft ${directory} route leaked: ${slug}`);
  }
}
if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  console.error(`${errors.length} generated-site problem(s).`);
  process.exitCode = 1;
} else console.log(`PASS ${files.length} HTML pages; ${checkedLinks} href/src references; ${checkedAnchors} anchors; ${retailerLinks} retailer links (${sponsoredLinks} sponsored); 404, drafts, ${publicMode ? 'public' : 'preview'} metadata, sitemap and robots. Base: ${base}`);
