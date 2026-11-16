import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const hosted = new URL(process.env.CHECK_HOSTED_URL || 'https://rozawa619.github.io/ito-craft/');
if (!hosted.pathname.endsWith('/')) hosted.pathname += '/';
const url = path => new URL(path, hosted).href;
const catalog = JSON.parse(await readFile(resolve(root, 'src/data/catalog.json'), 'utf8'));
const products = catalog.products.filter(product => product.publishStatus === 'published');
const longest = [...products].sort((left, right) => right.title.length - left.title.length)[0];
const paths = { home: 'en/', objects: 'en/objects/', product: `en/objects/${longest.slug}/`, contact: 'en/contact/' };
const report = {
  checkedAt: new Date().toISOString(), target: hosted.href,
  method: 'Live GitHub Pages HTTP requests and fresh headless installed Chrome profiles. Existing browsers, GitHub settings and external retailer links are not operated.',
  polls: [], checks: [], pages: [], resources: [], internalLinks: [], screenshots: [], consoleErrors: [], pageErrors: [], failures: [],
};
await mkdir(resolve(root, 'artifacts'), { recursive: true });
await mkdir(resolve(root, 'docs'), { recursive: true });
const timeout = () => AbortSignal.timeout(25000);

async function check(name, action) {
  try {
    const detail = await action();
    report.checks.push({ name, status: 'passed', ...(detail === undefined ? {} : { detail }) });
    console.log(`PASS ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    report.checks.push({ name, status: 'failed', message });
    report.failures.push({ name, message });
    console.error(`FAIL ${name}: ${message}`);
  }
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory() ? filesIn(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))).flat();
}

let browser;
try {
  let available = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url(paths.home), { signal: timeout() });
      report.polls.push({ attempt, checkedAt: new Date().toISOString(), status: response.status, url: response.url });
      console.log(`Live page check ${attempt}: HTTP ${response.status}`);
      if (response.status === 200) { available = true; break; }
    } catch (error) {
      report.polls.push({ attempt, checkedAt: new Date().toISOString(), error: error.message });
      console.error(`Live page check ${attempt}: ${error.message}`);
    }
    if (attempt < 5) await new Promise(resolve => setTimeout(resolve, 30000));
  }
  if (!available) throw new Error('Live home page did not return HTTP 200 within five checks. Publication is not confirmed.');

  await check('Live preview robots and sitemap prevent indexing', async () => {
    const robots = await fetch(url('robots.txt'), { signal: timeout() });
    const robotsBody = await robots.text();
    const sitemap = await fetch(url('sitemap.xml'), { signal: timeout() });
    const sitemapBody = await sitemap.text();
    assert.equal(robots.status, 200);
    assert.match(robotsBody, /Disallow:\s*\//);
    assert.equal(sitemap.status, 200);
    assert.match(sitemapBody, /<urlset\b/);
    assert.equal(/<loc>/.test(sitemapBody), false);
    return { robotsStatus: robots.status, robotsBody: robotsBody.trim(), sitemapStatus: sitemap.status, sitemapUrlCount: (sitemapBody.match(/<loc>/g) || []).length, note: 'Noindex is also checked on every browser-tested page. This is an accessible preview, not an indexing-enabled launch.' };
  });

  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width < 720, hasTouch: viewport.width < 720, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ viewport: viewport.name, url: page.url(), text: message.text() }); });
    page.on('pageerror', error => report.pageErrors.push({ viewport: viewport.name, url: page.url(), text: error.message }));
    page.on('response', response => { if (['stylesheet', 'script', 'image', 'font'].includes(response.request().resourceType())) report.resources.push({ viewport: viewport.name, type: response.request().resourceType(), url: response.url(), status: response.status() }); });
    for (const [kind, path] of Object.entries(paths)) {
      await check(`Live ${viewport.name}: ${kind} renders, noindex and ordinary links are consistent`, async () => {
        const response = await page.goto(url(path), { waitUntil: 'load', timeout: 45000 });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('html').getAttribute('lang'), 'en');
        assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
        assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
        assert.equal(await page.locator('[data-sponsored="true"]').count(), 0);
        const links = await page.locator('.retailer-link').evaluateAll(nodes => nodes.map(link => ({ href: link.href, rel: link.rel, sponsored: link.dataset.sponsored })));
        for (const link of links) {
          assert.equal(link.sponsored, 'false');
          assert.equal(link.rel.includes('sponsored'), false);
          assert.ok(link.rel.includes('noopener'));
          assert.ok(link.rel.includes('noreferrer'));
          assert.ok(catalog.links.some(record => record.officialProductUrl === link.href));
        }
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, background: getComputedStyle(document.body).backgroundColor }));
        assert.ok(dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
        assert.ok(dimensions.body <= dimensions.viewport + 1, JSON.stringify(dimensions));
        assert.equal(dimensions.background, 'rgb(247, 245, 239)');
        assert.ok(await page.locator(`link[rel="stylesheet"][href^="${hosted.pathname}"]`).count() > 0, 'Stylesheet must use the published repository base path.');
        const timings = await page.evaluate(() => { const entry = performance.getEntriesByType('navigation')[0]; return { responseEndMs: entry.responseEnd, loadEventEndMs: entry.loadEventEnd, transferSizeBytes: entry.transferSize }; });
        report.pages.push({ viewport: viewport.name, kind, url: page.url(), status: response.status(), dimensions, ordinaryRetailerLinks: links.length, timings });
        if (kind === 'home') {
          const file = `artifacts/hosted-${viewport.name === 'desktop' ? 'home' : 'mobile'}.png`;
          await page.screenshot({ path: resolve(root, file), fullPage: true });
          report.screenshots.push(file);
        }
        return { status: response.status(), ordinaryRetailerLinks: links.length, dimensions };
      });
    }
    await check(`Live ${viewport.name}: navigation and filtering work under /ito-craft/`, async () => {
      await page.goto(url(paths.home));
      if (viewport.name === 'mobile') {
        await page.locator('.mobile-nav summary').click();
        await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Objects', exact: true }).click();
      } else {
        await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Objects', exact: true }).click();
      }
      await page.waitForURL(url(paths.objects));
      assert.equal(await page.locator('[data-product-card]:visible').count(), products.length);
      await page.locator('select[name="type"]').selectOption('pierced-earrings');
      await page.locator('select[name="prefecture"]').selectOption('kanagawa');
      const expected = products.filter(product => product.productType.includes('pierced-earrings') && product.prefectureIds.includes('kanagawa')).length;
      assert.equal(await page.locator('[data-product-card]:visible').count(), expected);
      assert.equal(new URL(page.url()).pathname, `${hosted.pathname}en/objects/`);
      assert.equal(new URL(page.url()).searchParams.get('prefecture'), 'kanagawa');
      await page.locator('select[name="type"]').selectOption('clip-on-earrings');
      await page.locator('select[name="material"]').selectOption('gold-18k');
      assert.equal(await page.locator('[data-product-card]:visible').count(), 0);
      assert.ok(await page.locator('#empty-state').isVisible());
      await page.locator('#empty-reset').click();
      assert.equal(await page.locator('[data-product-card]:visible').count(), products.length);
      assert.equal(new URL(page.url()).search, '');
      await page.locator('select[name="material"]').selectOption('wood');
      await page.locator('button[type="reset"]').click();
      assert.equal(await page.locator('select[name="material"]').inputValue(), '');
    });
    await check(`Live ${viewport.name}: contact points to the real repository`, async () => {
      await page.goto(url(paths.contact));
      assert.equal(await page.locator('.contact-option a').getAttribute('href'), 'https://github.com/rozawa619/ito-craft/issues/new');
      assert.match(await page.locator('.contact-option').innerText(), /GitHub account is required/);
      assert.equal(await page.locator('form').count(), 0);
    });
    await check(`Live ${viewport.name}: missing page returns a usable HTTP 404`, async () => {
      const response = await page.goto(url('en/this-page-does-not-exist/'));
      assert.equal(response.status(), 404);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.getByRole('link', { name: /Explore the objects/ }).count() > 0);
    });
    await context.close();
  }

  await check('Live static resources loaded with successful HTTP status', () => {
    assert.ok(report.resources.some(resource => resource.type === 'stylesheet' && resource.status === 200));
    assert.deepEqual(report.resources.filter(resource => resource.status >= 400), []);
    return { resourceResponses: report.resources.length, failed: 0 };
  });
  await check('Live pages have no unexpected JavaScript or console errors', () => {
    assert.deepEqual(report.pageErrors, []);
    const unexpected = report.consoleErrors.filter(error => !(error.url.includes('/this-page-does-not-exist/') && error.text.includes('404')));
    assert.deepEqual(unexpected, []);
    return { pageErrors: 0, unexpectedConsoleErrors: 0, expected404ConsoleErrors: report.consoleErrors.length };
  });

  await check('All generated live routes and discovered internal links return HTTP 200', async () => {
    const files = await filesIn(resolve(root, 'dist'));
    const routeUrls = files.filter(file => file.endsWith(`${sep}index.html`)).map(file => url(relative(resolve(root, 'dist'), file).split(sep).join('/').replace(/index\.html$/, '')));
    const pending = new Set([...routeUrls, url('robots.txt'), url('sitemap.xml')]);
    const tested = new Set();
    while (pending.size) {
      const batch = [...pending].slice(0, 4);
      batch.forEach(target => { pending.delete(target); tested.add(target); });
      await Promise.all(batch.map(async target => {
        try {
          const response = await fetch(target, { signal: timeout() });
          const contentType = response.headers.get('content-type') || '';
          report.internalLinks.push({ url: target, status: response.status, finalUrl: response.url, contentType });
          if (contentType.includes('text/html') && response.status === 200) {
            const html = await response.text();
            for (const match of html.matchAll(/\bhref=["']([^"']+)["']/g)) {
              const linked = new URL(match[1].replace(/&amp;/g, '&'), target);
              linked.hash = ''; linked.search = '';
              if (linked.origin === hosted.origin && linked.pathname.startsWith(hosted.pathname) && !tested.has(linked.href)) pending.add(linked.href);
            }
          }
        } catch (error) {
          report.internalLinks.push({ url: target, error: error.message });
        }
      }));
    }
    const failed = report.internalLinks.filter(link => link.status !== 200);
    assert.deepEqual(failed, []);
    return { generatedRoutes: routeUrls.length, totalInternalUrls: report.internalLinks.length, failures: failed.length, externalLinksFollowed: 0 };
  });
} catch (error) {
  const failure = { name: 'Hosted test execution', message: error instanceof Error ? error.stack : String(error) };
  report.failures.push(failure);
  console.error(failure.message);
} finally {
  if (browser) await browser.close();
  report.summary = { checks: report.checks.length, passed: report.checks.filter(check => check.status === 'passed').length, failed: report.failures.length, pages: report.pages.length, internalUrls: report.internalLinks.length, screenshotCount: report.screenshots.length };
  await writeFile(resolve(root, 'docs/hosted-results.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) process.exitCode = 1;
}
