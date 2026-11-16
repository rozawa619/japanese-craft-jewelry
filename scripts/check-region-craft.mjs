import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));
const base = `/${(process.env.PUBLIC_BASE_PATH || '').split('/').filter(Boolean).join('/')}`.replace(/\/?$/, '/');
const url = path => new URL(`${base}${path}`, process.env.CHECK_BASE_URL || 'http://127.0.0.1:4321').href;
const results = { checkedAt: new Date().toISOString(), checks: [], failures: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [1440, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    for (const kind of ['region', 'craft']) {
      try {
        const response = await page.goto(url(kind === 'region' ? 'en/places/kanagawa/' : 'en/crafts/hakone-yosegi/'));
        assert.equal(response.status(), 200);
        const prose = page.locator(kind === 'region' ? '.region-intro .prose' : '.article-wrap.prose');
        assert.ok((await prose.innerText()).length > 300, 'The independent Markdown body must be rendered.');
        assert.ok(await prose.getByRole('heading', { level: 2 }).count() > 0);
        assert.ok(await page.locator('[data-product-card]').count() > 0);
        assert.ok(await page.locator('.source-list a').count() > 0);
        for (const href of await page.locator('[data-product-card] h3 a').evaluateAll(links => links.map(link => link.href))) {
          assert.ok(href.startsWith(url('en/objects/')), `Related product URL must honor the base path: ${href}`);
        }
        if (kind === 'region') {
          assert.match(await prose.innerText(), /manufacturing location are not identified/i);
          assert.ok(await page.getByRole('heading', { name: 'Also sold by a regional retailer.' }).isVisible());
        } else {
          const relatedGuide = prose.getByRole('link', { name: 'Read the longer guide to yosegi' });
          assert.equal(await relatedGuide.evaluate(link => link.href), url('en/journal/understanding-yosegi/'));
          await relatedGuide.click();
          await page.waitForURL(url('en/journal/understanding-yosegi/'));
          assert.ok(await page.getByRole('heading', { name: 'Reading the detail in Hakone yosegi', exact: true }).isVisible());
        }
        results.checks.push({ width, page: kind, status: 'passed', checked: ['Markdown body', 'related products', 'primary-source links', 'base-path links', ...(kind === 'craft' ? ['related guide navigation'] : ['workshop and retailer separation'])] });
        console.log(`PASS ${width}px ${kind}: Markdown body and related links`);
      } catch (error) {
        const failure = { width, page: kind, message: error instanceof Error ? error.message : String(error) };
        results.failures.push(failure);
        console.error(JSON.stringify(failure));
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(resolve(root, 'docs/region-craft-results.json'), `${JSON.stringify(results, null, 2)}\n`);
  if (results.failures.length) process.exitCode = 1;
}
