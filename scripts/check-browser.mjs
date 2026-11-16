import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));
const origin = process.env.CHECK_BASE_URL || 'http://127.0.0.1:4321';
const basePath = `/${(process.env.PUBLIC_BASE_PATH || '').split('/').filter(Boolean).join('/')}${(process.env.PUBLIC_BASE_PATH || '').split('/').filter(Boolean).length ? '/' : ''}`;
const route = value => new URL(`${basePath}${value.replace(/^\//, '')}`, origin).href;
const catalog = JSON.parse(await readFile(resolve(root, 'src/data/catalog.json'), 'utf8'));
const published = catalog.products.filter(product => product.publishStatus === 'published');
const longest = [...published].sort((left, right) => right.title.length - left.title.length)[0];
const routes = {
  home: 'en/',
  objects: 'en/objects/',
  product: `en/objects/${longest.slug}/`,
  guide: 'en/journal/pierced-or-clip-on/',
  region: 'en/places/kanagawa/',
  craft: 'en/crafts/hakone-yosegi/',
  contact: 'en/contact/',
};
const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: origin,
  basePath,
  method: 'Fresh headless installed Chrome launched by Playwright; no existing user browser or profile is accessed. Axe WCAG 2 A/AA and 2.1 AA checks. Local timings only, not Lighthouse or field performance.',
  longestProduct: { id: longest.id, title: longest.title },
  checks: [],
  pages: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  failures: [],
};
await mkdir(resolve(root, 'artifacts'), { recursive: true });
await mkdir(resolve(root, 'docs'), { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

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

async function screenshot(page, file) {
  await page.screenshot({ path: resolve(root, file), fullPage: true });
  report.screenshots.push(file);
}

async function verifyFilter(page, selected) {
  for (const key of ['type', 'prefecture', 'material', 'craft']) await page.locator(`select[name="${key}"]`).selectOption(selected[key] || '');
  const expected = published.filter(product => (!selected.type || product.productType.includes(selected.type)) && (!selected.prefecture || product.prefectureIds.includes(selected.prefecture)) && (!selected.material || product.materialIds.includes(selected.material)) && (!selected.craft || product.craftIds.includes(selected.craft))).length;
  await page.waitForFunction(count => document.querySelector('#result-count')?.textContent === `${count} object${count === 1 ? '' : 's'}`, expected);
  assert.equal(await page.locator('[data-product-card]:visible').count(), expected);
  assert.equal(await page.locator('#empty-state').isVisible(), expected === 0);
  for (const [key, value] of Object.entries(selected)) assert.equal(new URL(page.url()).searchParams.get(key), value);
  return expected;
}

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }, { name: 'narrow', width: 320, height: 740 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, isMobile: viewport.width < 720, hasTouch: viewport.width < 720, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ viewport: viewport.name, url: page.url(), text: message.text() }); });
    page.on('pageerror', error => report.pageErrors.push({ viewport: viewport.name, url: page.url(), text: error.message }));
    for (const [kind, path] of Object.entries(routes)) {
      await check(`${viewport.name}: ${kind} renders without viewport overflow`, async () => {
        const response = await page.goto(route(path), { waitUntil: 'load' });
        assert.equal(response?.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('html').getAttribute('lang'), 'en');
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
        assert.ok(dimensions.documentWidth <= dimensions.width + 1, JSON.stringify(dimensions));
        assert.ok(dimensions.bodyWidth <= dimensions.width + 1, JSON.stringify(dimensions));
        const performance = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource');
          return { navigation: navigation ? { responseEndMs: navigation.responseEnd, domContentLoadedMs: navigation.domContentLoadedEventEnd, loadEventEndMs: navigation.loadEventEnd, transferSizeBytes: navigation.transferSize, encodedBodySizeBytes: navigation.encodedBodySize } : null, resources: { count: resources.length, transferSizeBytes: resources.reduce((total, item) => total + item.transferSize, 0), encodedBodySizeBytes: resources.reduce((total, item) => total + item.encodedBodySize, 0) } };
        });
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        const violations = axe.violations.map(violation => ({ id: violation.id, impact: violation.impact, description: violation.description, help: violation.help, helpUrl: violation.helpUrl, nodes: violation.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) }));
        report.pages.push({ viewport: viewport.name, width: viewport.width, kind, url: page.url(), status: response.status(), dimensions, performance, axe: { violations, passedRuleCount: axe.passes.length, incompleteRuleCount: axe.incomplete.length, note: 'Automated checks do not replace manual accessibility review.' } });
        assert.equal(violations.length, 0, `axe violations: ${violations.map(violation => violation.id).join(', ')}`);
        return { status: response.status(), axeViolations: violations.length, dimensions };
      });
      if (kind === 'home' && viewport.name === 'desktop') await screenshot(page, 'artifacts/desktop-home.png');
      if (kind === 'home' && viewport.name === 'mobile') await screenshot(page, 'artifacts/mobile-home.png');
      if (kind === 'objects' && viewport.name === 'desktop') await screenshot(page, 'artifacts/desktop-objects.png');
      if (kind === 'product' && viewport.name === 'mobile') await screenshot(page, 'artifacts/mobile-product.png');
    }

    await check(`${viewport.name}: keyboard skip link targets main content`, async () => {
      await page.goto(route(routes.home));
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Skip to content');
      const box = await page.locator('.skip-link').boundingBox();
      assert.ok(box && box.y >= 0 && box.x >= 0);
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#main');
    });

    await check(`${viewport.name}: navigation is usable`, async () => {
      await page.goto(route(routes.home));
      if (viewport.width < 720) {
        await page.locator('.mobile-nav summary').click();
        await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Objects', exact: true }).click();
      } else {
        await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Objects', exact: true }).click();
      }
      await page.waitForURL(route(routes.objects));
      assert.equal(await page.locator('#result-count').textContent(), `${published.length} objects`);
    });

    await check(`${viewport.name}: filter combination, unknown exclusion, reset and zero results`, async () => {
      await page.goto(route(routes.objects));
      const counts = {};
      counts.pierced = await verifyFilter(page, { type: 'pierced-earrings' });
      counts.kanagawaPierced = await verifyFilter(page, { type: 'pierced-earrings', prefecture: 'kanagawa' });
      counts.woodKanagawaPierced = await verifyFilter(page, { type: 'pierced-earrings', prefecture: 'kanagawa', material: 'wood', craft: 'hakone-yosegi' });
      const unknownOriginCount = published.filter(product => !product.prefectureIds.length).length;
      assert.ok(unknownOriginCount > 0, 'Fixture must contain unknown production origins to test exclusion.');
      for (const value of await page.locator('[data-product-card]:visible').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-prefecture')))) assert.ok(value?.split(' ').includes('kanagawa'));
      counts.knownMetal = await verifyFilter(page, { material: 'surgical-stainless-steel' });
      const unknownMetal = published.filter(product => !product.materialIds.includes('surgical-stainless-steel')).length;
      assert.equal(counts.knownMetal, published.length - unknownMetal);
      counts.zero = await verifyFilter(page, { type: 'clip-on-earrings', material: 'gold-18k' });
      assert.equal(counts.zero, 0);
      await page.locator('#empty-reset').click();
      assert.equal(await page.locator('[data-product-card]:visible').count(), published.length);
      assert.equal(new URL(page.url()).search, '');
      await verifyFilter(page, { prefecture: 'kanagawa', material: 'wood' });
      await page.locator('button[type="reset"]').click();
      assert.equal(await page.locator('[data-product-card]:visible').count(), published.length);
      assert.equal(await page.locator('#empty-state').isVisible(), false);
      return { ...counts, unknownOriginExcluded: unknownOriginCount, total: published.length };
    });

    await check(`${viewport.name}: filter URL restores state and ignores invalid option`, async () => {
      const url = new URL(route(routes.objects));
      url.search = 'type=pierced-earrings&prefecture=kanagawa&material=wood';
      await page.goto(url.href);
      const expected = published.filter(product => product.productType.includes('pierced-earrings') && product.prefectureIds.includes('kanagawa') && product.materialIds.includes('wood')).length;
      await page.waitForFunction(count => document.querySelectorAll('[data-product-card]:not([hidden])').length === count, expected);
      assert.equal(await page.locator('select[name="type"]').inputValue(), 'pierced-earrings');
      assert.equal(await page.locator('select[name="prefecture"]').inputValue(), 'kanagawa');
      assert.equal(await page.locator('select[name="material"]').inputValue(), 'wood');
      url.search = 'type=unrecognised-option';
      await page.goto(url.href);
      assert.equal(await page.locator('select[name="type"]').inputValue(), '');
      assert.equal(await page.locator('[data-product-card]:visible').count(), published.length);
    });

    await check(`${viewport.name}: privacy and contact match configured services`, async () => {
      await page.goto(route('en/privacy/'));
      const text = await page.locator('main').innerText();
      assert.match(text, /do not use analytics scripts/i);
      assert.match(text, /does not provide user accounts/i);
      assert.equal(await page.locator('form').count(), 0);
      await page.goto(route(routes.contact));
      const contact = page.locator('.contact-option');
      if (process.env.PUBLIC_CONTACT_EMAIL) {
        assert.equal(await contact.locator('a[href^="mailto:"]').getAttribute('href'), `mailto:${process.env.PUBLIC_CONTACT_EMAIL}`);
      } else if (process.env.PUBLIC_REPOSITORY_URL) {
        assert.equal(await contact.locator('a').getAttribute('href'), `${process.env.PUBLIC_REPOSITORY_URL.replace(/\/$/, '')}/issues/new`);
        assert.match(await contact.innerText(), /GitHub account is required/i);
      } else {
        assert.equal(await contact.locator('a').count(), 0);
        assert.match(await contact.innerText(), /No editorial contact channel is active/i);
      }
      return { emailConfigured: !!process.env.PUBLIC_CONTACT_EMAIL, repositoryConfigured: !!process.env.PUBLIC_REPOSITORY_URL };
    });

    await check(`${viewport.name}: missing URL responds with HTTP 404`, async () => {
      const response = await page.goto(route('en/this-page-does-not-exist/'));
      assert.equal(response?.status(), 404);
      assert.equal(await page.locator('h1').count(), 1);
      return { status: response.status(), heading: await page.locator('h1').innerText() };
    });
    await context.close();
  }
  await check('No uncaught browser errors on the tested pages', () => {
    assert.equal(report.pageErrors.length, 0, JSON.stringify(report.pageErrors));
  });
  await check('No unexpected console errors on the tested pages', () => {
    const unexpected = report.consoleErrors.filter(error => !(error.url.includes('/this-page-does-not-exist/') && error.text.includes('404 (Not Found)')));
    assert.equal(unexpected.length, 0, JSON.stringify(unexpected));
    return { expectedMissingRouteErrors: report.consoleErrors.length - unexpected.length };
  });
} catch (error) {
  report.failures.push({ name: 'Browser execution', message: error instanceof Error ? error.stack : String(error) });
} finally {
  await browser.close();
  report.summary = { checks: report.checks.length, passed: report.checks.filter(check => check.status === 'passed').length, failed: report.failures.length, pages: report.pages.length, axeViolations: report.pages.reduce((total, page) => total + page.axe.violations.length, 0), screenshotCount: report.screenshots.length };
  await writeFile(resolve(root, 'docs/browser-results.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) process.exitCode = 1;
}
