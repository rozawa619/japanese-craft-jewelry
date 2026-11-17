import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Every synthetic URL, approval and draft is confined to ignored fixture copies.
// This script never builds into or mutates the project's real dist directory.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = resolve(root, 'artifacts/ad-build-fixture');
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const runRoot = resolve(artifacts, runId);
if (!runRoot.startsWith(artifacts + sep) || !isAbsolute(runRoot)) throw new Error('Fixture directory must stay inside the project artifacts directory.');
mkdirSync(runRoot, { recursive: true });
const reportPath = resolve(root, process.env.CHECK_AD_REPORT_PATH || 'docs/editorial-stage-ad-build-results.json');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const walk = directory => existsSync(directory) ? readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]) : [];
const distDigest = () => {
  const digest = createHash('sha256');
  for (const file of walk(resolve(root, 'dist')).sort()) digest.update(relative(root, file)).update(readFileSync(file));
  return digest.digest('hex');
};
const originalCatalog = readFileSync(resolve(root, 'src/data/catalog.json'));
const sourceCatalog=JSON.parse(originalCatalog);
const relatedFixturePage='en/objects/morphosphere-ultramarine-pansy-pierced-earrings/index.html';
const currentPagePath=resolve(root,'dist',relatedFixturePage);
if(!existsSync(currentPagePath))throw new Error('Build the stable production site before testing related-product advertisements.');
const currentRelated=readFileSync(currentPagePath,'utf8').match(/<section\b[^>]*class="[^"]*\brelated\b[^"]*"[^>]*>([\s\S]*?)<\/section>/i)?.[1]||'';
const relatedSlug=currentRelated.match(/href="[^"]*\/en\/objects\/([a-z0-9-]+)\//)?.[1];
const relatedTarget=sourceCatalog.products.find(product=>product.publishStatus==='published'&&product.slug===relatedSlug);
if(!relatedTarget)throw new Error('A rendered related product is required for the advertisement fixture.');
if(sourceCatalog.links.some(link=>link.productId===relatedTarget.id&&link.locale))throw new Error('The related-card fixture must use a shared domestic destination.');
const internationalTarget=sourceCatalog.products.find(product=>product.id==='rinzen-seika-amber-pierced-earrings'&&product.publishStatus==='published'&&product.localizedPrices?.ja);
if(!internationalTarget)throw new Error('A verified dual-market product is required for the international-only advertisement fixture.');
const rootDistBefore = distDigest();
const results = {
  checkedAt: new Date().toISOString(),
  status: 'running',
  command: 'node scripts/check-ad-build.mjs',
  isolation: { fixtureRoot: relative(root, runRoot).replaceAll(sep, '/'), copies: ['src', 'docs', 'public', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json'], nodeModules: process.platform === 'win32' ? 'junction to existing dependencies' : 'symlink to existing dependencies', envFilesCopied: false, mode: 'preview plus test-only public metadata build; no deployment', rootDistBefore },
  scenarios: [],
};
const progress = () => writeJson(reportPath, results);
progress();
const baseEnv = {
  ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('PUBLIC_') && key !== 'CHECK_DIST_DIR')),
  ASTRO_TELEMETRY_DISABLED: '1', PUBLIC_PUBLISH_MODE: 'preview', PUBLIC_SITE_URL: '', PUBLIC_BASE_PATH: '/', PUBLIC_CONTACT_EMAIL: '', PUBLIC_OPERATOR_NAME: '', PUBLIC_REPOSITORY_URL: '',
};
function fixture(name) {
  const directory = resolve(runRoot, name);
  mkdirSync(directory, { recursive: true });
  for (const item of ['src', 'docs', 'public', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json']) cpSync(resolve(root, item), resolve(directory, item), { recursive: true });
  symlinkSync(resolve(root, 'node_modules'), resolve(directory, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  if (readdirSync(directory).some(name => /^\.env(?:\.|$)/.test(name))) throw new Error('An environment file was copied into a fixture.');
  const catalog = readJson(resolve(directory, 'src/data/catalog.json'));
  // Use a test-only identity, never a real BECOS/Millennium agreement.
  catalog.programs.push({ id: 'test-only-build-program', name: 'TEST ONLY — isolated affiliate build fixture', description: 'Synthetic program used only in ignored local test copies; no real merchant agreement.', recruitmentUrl: 'https://affiliate-build-test.invalid/program', applicationUrl: null, recruitmentStatus: 'uncertain', applicationStatus: 'approved', merchantIds: catalog.merchants.map(merchant=>merchant.id), affiliateAllowedHosts:['affiliate-build-test.invalid'], disclosure: 'TEST ONLY: this isolated fixture demonstrates a commission-bearing link; it is not a real partnership.' });
  const draft = { ...structuredClone(catalog.products[0]), id: 'test-only-draft-object', slug: 'test-only-draft-object', title: 'TEST ONLY draft object', publishStatus: 'draft' };
  catalog.products.push(draft);
  writeFileSync(resolve(directory, 'src/content/products/test-only-draft-object.md'), '---\nproductId: test-only-draft-object\npublishStatus: draft\n---\n\nTest fixture. Never publish.\n');
  writeFileSync(resolve(directory, 'src/content/guides/test-only-draft-guide.md'), '---\ntitle: "TEST ONLY draft guide"\ndescription: "Isolated draft exclusion fixture."\nlocale: "en"\npublishStatus: "draft"\nupdatedAt: "2026-11-16"\nsourceIds: []\ncategory: "Test fixture"\nreadMinutes: 1\nproductIds: ["test-only-draft-object"]\n---\n\nTest fixture. Never publish.\n');
  return { directory, catalog };
}
function approve(catalog, id) {
  const link = catalog.links.find(link => link.productId === id && (!link.locale || link.locale === 'en'));
  if (!link) throw new Error('Missing fixture product ' + id);
  Object.assign(link, { programId: 'test-only-build-program', applicationStatus: 'approved', affiliateUrl: `https://affiliate-build-test.invalid/track/${id}`, affiliateLinkVerifiedAt: '2026-11-16' });
  return link;
}
function command(directory, args, logFile, env = baseEnv) {
  const run = spawnSync(process.execPath, args, { cwd: directory, env, encoding: 'utf8', timeout: 120000, windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  const output = `${run.stdout || ''}${run.stderr || ''}`;
  writeFileSync(logFile, output);
  return { exitCode: run.status, error: run.error?.message || null, log: relative(root, logFile).replaceAll(sep, '/'), summary: output.split(/\r?\n/).filter(line => /^(?:PASS|FAIL)|generated-site problem/.test(line)).slice(-10) };
}
function analyze(directory, targetIds, ordinaryRoute, publicMetadata = false) {
  const dist = resolve(directory, 'dist');
  const errors = [];
  let sponsoredCount = 0;
  let sponsoredPages = 0;
  const tracking = targetIds.map(id => `https://affiliate-build-test.invalid/track/${id}`);
  for (const file of walk(dist).filter(file => file.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    const links = [...html.matchAll(/<a\b[^>]*>/gi)];
    const sponsored = links.filter(link => /\brel="[^"]*\bsponsored\b/.test(link[0]));
    sponsoredCount += sponsored.length;
    if (sponsored.length) {
      sponsoredPages++;
      const disclosure = html.indexOf('data-disclosure="affiliate"');
      if (disclosure < 0 || disclosure > sponsored[0].index) errors.push(`${relative(dist, file)}: disclosure missing before first sponsored link`);
      if (html.includes('data-disclosure="ordinary"')) errors.push(`${relative(dist, file)}: ordinary disclosure contradicts sponsored links`);
      for (const link of sponsored) {
        if (!tracking.some(url => link[0].includes(`href="${url}"`))) errors.push(`${relative(dist, file)}: unexpected sponsored destination`);
        if (!/\bnoopener\b/.test(link[0]) || !link[0].includes('data-sponsored="true"')) errors.push(`${relative(dist, file)}: sponsored rel or data flag incomplete`);
      }
    }
    if (html.includes('test-only-draft-object') || html.includes('test-only-draft-guide')) errors.push(`${relative(dist, file)}: draft text or route leaked`);
  }
  const fixtureCatalog=readJson(resolve(directory,'src/data/catalog.json'));
  const englishOnly=targetIds.filter(id=>fixtureCatalog.links.some(link=>link.productId===id&&link.locale==='en'&&link.applicationStatus==='approved'));
  for(const file of walk(resolve(dist,'ja')).filter(file=>file.endsWith('.html'))){const html=readFileSync(file,'utf8');for(const id of englishOnly)if(html.includes('https://affiliate-build-test.invalid/track/'+id))errors.push(relative(dist,file)+': English-only approval leaked into Japanese page');}
  for(const id of englishOnly){
    const product=fixtureCatalog.products.find(product=>product.id===id);
    const domesticLists=['en/objects/index.html',`en/makers/${product.makerId}/index.html`,...product.prefectureIds.map(id=>`en/places/${id}/index.html`),...product.craftIds.map(id=>`en/crafts/${id}/index.html`)];
    for(const route of domesticLists)if(existsSync(resolve(dist,route))&&readFileSync(resolve(dist,route),'utf8').includes('https://affiliate-build-test.invalid/track/'+id))errors.push(route+': International approval leaked into a domestic-price listing');
  }
  const sitemap = readFileSync(resolve(dist, 'sitemap.xml'), 'utf8');
  if (/\/journal\//.test(sitemap)) errors.push('Retired reading routes present in sitemap');
  if (/\/(?:en|ja)\/contact\//.test(sitemap)) errors.push('Deferred Contact route present in sitemap');
  for (const locale of ['en','ja']) if (existsSync(resolve(dist,locale,'contact/index.html'))) errors.push('Deferred Contact page generated for '+locale);
  if (/test-only-draft/.test(sitemap)) errors.push('Draft route present in sitemap');
  if (!publicMetadata && /<loc(?:\s|>)/.test(sitemap)) errors.push('Preview sitemap unexpectedly has indexed URLs');
  if (publicMetadata) {
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
    if (!locations.length || locations.some(url => !url.startsWith('https://rozawa619.github.io/japanese-craft-jewelry/'))) errors.push('Public sitemap URL missing or outside configured public base');
    const robots = readFileSync(resolve(dist, 'robots.txt'), 'utf8');
    if (!robots.includes('Allow: /') || !robots.includes('Sitemap: https://rozawa619.github.io/japanese-craft-jewelry/sitemap.xml') || /^Disallow:\s*\/$/m.test(robots)) errors.push('Public robots policy or sitemap destination is incorrect');
    const home = readFileSync(resolve(dist, 'en/index.html'), 'utf8');
    if (!home.includes('rel="canonical" href="https://rozawa619.github.io/japanese-craft-jewelry/en/"') || !home.includes('property="og:url" content="https://rozawa619.github.io/japanese-craft-jewelry/en/"')) errors.push('Public home canonical or OGP URL is incorrect');
    if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(home)) errors.push('Public home remains noindex');
  }
  if (existsSync(resolve(dist, 'en/objects/test-only-draft-object/index.html'))) errors.push('Draft object page generated');
  if (existsSync(resolve(dist, 'en/journal/test-only-draft-guide/index.html'))) errors.push('Draft guide page generated');
  const targetedPage = readFileSync(resolve(dist, ordinaryRoute), 'utf8');
  if (targetIds.length) {
    if (!targetedPage.includes('data-disclosure="affiliate"') || !tracking.some(url => targetedPage.includes(url))) errors.push('Selected test page did not expose the expected affiliate link and disclosure');
    if (!sponsoredCount) errors.push('Approved test case generated no sponsored links');
  } else {
    if (sponsoredCount) errors.push('Paused/missing-URL case generated sponsored links');
    for (const file of walk(dist).filter(file => file.endsWith('.html'))) if (readFileSync(file, 'utf8').includes('https://affiliate-build-test.invalid/track/')) errors.push('Test tracking URL failed to fall back to official URL');
    for (const id of ['hamamatsuya-clip', 'maruyama-clip-c', 'hamamatsuya-catch-pierced']) {
      const catalog = readJson(resolve(directory, 'src/data/catalog.json'));
      const p = catalog.products.find(product => product.id === id);
      const link = catalog.links.find(link => link.productId === id);
      const html = readFileSync(resolve(dist, `en/objects/${p.slug}/index.html`), 'utf8');
      if (!html.includes(`href="${link.officialProductUrl}"`) || !html.includes('data-sponsored="false"')) errors.push(`Official fallback missing for ${id}`);
    }
  }
  return { status: errors.length ? 'failed' : 'passed', sponsoredCount, sponsoredPages, drafts: 'Draft object and guide absent from generated pages, markup and sitemap when passed.', publicMetadata: publicMetadata ? 'Test-only public URL/base, canonical, OGP, sitemap and robots assertions; does not establish a successful deployment.' : 'Preview noindex/canonical/sitemap rules checked by generated-site checker.', errors };
}
const scenarios = [
  { name: 'approved-related-product-only', targetIds: [relatedTarget.id], page: relatedFixturePage, mutate(catalog) { approve(catalog, relatedTarget.id); } },
  { name: 'approved-international-detail-only', targetIds: [internationalTarget.id], page: `en/objects/${internationalTarget.slug}/index.html`, mutate(catalog) { approve(catalog, internationalTarget.id); } },
  { name: 'approved-lower-retailer-section-only', targetIds: ['maruyama-clip-c'], page: 'en/places/kanagawa/index.html', mutate(catalog) { approve(catalog, 'maruyama-clip-c'); } },
  { name: 'paused-and-missing-url-fallback', targetIds: [], page: 'en/objects/hamamatsuya-yosegi-non-pierced-earrings/index.html', mutate(catalog) {
    approve(catalog, 'hamamatsuya-clip').applicationStatus = 'paused';
    approve(catalog, 'maruyama-clip-c').affiliateUrl = null;
    catalog.programs.push({ ...structuredClone(catalog.programs.at(-1)), id: 'test-only-paused-program', name: 'TEST ONLY paused program fixture', applicationStatus: 'paused' });
    approve(catalog, 'hamamatsuya-catch-pierced').programId = 'test-only-paused-program';
  } },
  { name: 'unlisted-tracking-host-fallback', targetIds: [], page: 'en/objects/hamamatsuya-yosegi-non-pierced-earrings/index.html', mutate(catalog) {
    approve(catalog, 'hamamatsuya-clip').affiliateUrl = 'https://unlisted-build-test.invalid/track/one';
  } },
  { name: 'test-only-public-base-metadata-and-drafts', targetIds: [], page: 'en/objects/hamamatsuya-yosegi-non-pierced-earrings/index.html', publicMetadata: true,
    env: { PUBLIC_SITE_URL: 'https://rozawa619.github.io', PUBLIC_BASE_PATH: '/japanese-craft-jewelry/', PUBLIC_PUBLISH_MODE: 'public', PUBLIC_OPERATOR_NAME: 'Test fixture only', PUBLIC_REPOSITORY_URL: 'https://github.com/rozawa619/japanese-craft-jewelry' },
    mutate() {} },
];
try {
  for (const scenario of scenarios) {
    const result = { name: scenario.name, status: 'running', targetIds:scenario.targetIds, relatedFixturePage:scenario.name==='approved-related-product-only'?relatedFixturePage:undefined };
    results.scenarios.push(result); progress();
    const { directory, catalog } = fixture(scenario.name);
    scenario.mutate(catalog);
    writeJson(resolve(directory, 'src/data/catalog.json'), catalog);
    result.fixture = relative(root, directory).replaceAll(sep, '/');
    const astroPackage = readJson(resolve(directory, 'node_modules/astro/package.json'));
    const astroBin = typeof astroPackage.bin === 'string' ? astroPackage.bin : astroPackage.bin.astro;
    const env = { ...baseEnv, ...(scenario.env || {}) };
    result.settings = { mode: env.PUBLIC_PUBLISH_MODE, basePath: env.PUBLIC_BASE_PATH, siteUrl: env.PUBLIC_SITE_URL, fixtureOnly: true, deployed: false };
    result.build = command(directory, [resolve(directory, 'node_modules/astro', astroBin), 'build'], resolve(directory, 'build.log'), env);
    if (result.build.exitCode === 0) {
      result.generatedSiteCheck = command(directory, [resolve(directory, 'scripts/check-built.mjs')], resolve(directory, 'check-built.log'), env);
      result.htmlAssertions = analyze(directory, scenario.targetIds, scenario.page, scenario.publicMetadata);
      result.status = result.generatedSiteCheck.exitCode === 0 && result.htmlAssertions.status === 'passed' ? 'passed' : 'failed';
    } else result.status = 'failed';
    progress();
    console.log(`${result.status === 'passed' ? 'PASS' : 'FAIL'} ${scenario.name}`);
    for (const line of result.generatedSiteCheck?.summary || []) console.log(line);
    for (const line of result.htmlAssertions?.errors || []) console.log('FAIL ' + line);
  }
} catch (error) { results.error = error.stack || String(error); }
results.isolation.rootDistAfter = distDigest();
results.isolation.rootDistUnchanged = results.isolation.rootDistBefore === results.isolation.rootDistAfter;
results.isolation.realCatalogUnchanged = originalCatalog.equals(readFileSync(resolve(root, 'src/data/catalog.json')));
results.completedAt = new Date().toISOString();
results.status = !results.error && results.isolation.rootDistUnchanged && results.isolation.realCatalogUnchanged && results.scenarios.length === scenarios.length && results.scenarios.every(result => result.status === 'passed') ? 'passed' : 'failed';
progress();
console.log(`${results.status === 'passed' ? 'PASS' : 'FAIL'} isolated advertisement builds; real dist unchanged: ${results.isolation.rootDistUnchanged}; real catalog unchanged: ${results.isolation.realCatalogUnchanged}`);
if (results.status !== 'passed') process.exitCode = 1;
