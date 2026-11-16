import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputFiles = ['src/data/catalog.json', 'docs/research/sources.json', 'docs/research/affiliate-sources.json'];
const urls = new Map();
function collect(value, source, path = '') {
  if (Array.isArray(value)) return value.forEach((entry, index) => collect(entry, source, `${path}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).forEach(([key, entry]) => collect(entry, source, `${path}.${key}`));
  if (typeof value !== 'string' || !/^https:\/\/[^\s<>"`]+$/.test(value)) return;
  try {
    const url = new URL(value);
    if (url.username || url.password) throw new Error(`Credential-bearing URL in ${source}${path}`);
    url.hash = '';
    const normalized = url.href;
    if (!urls.has(normalized)) urls.set(normalized, []);
    urls.get(normalized).push(`${source}${path}`);
  } catch (error) {
    throw new Error(`Invalid source URL at ${source}${path}: ${error.message}`);
  }
}
for (const input of inputFiles) {
  try { collect(JSON.parse(await readFile(resolve(root, input), 'utf8')), input); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
if (!urls.size) throw new Error('No external source URLs found; check the input files.');

function classify(status, finalUrl) {
  if (!finalUrl.startsWith('https://')) return 'review_insecure_redirect';
  if (status >= 200 && status < 300) return 'reachable';
  if ([401, 403, 407, 429, 451].includes(status)) return 'review_access_restricted';
  if ([404, 410].includes(status)) return 'review_not_found';
  if (status >= 500) return 'review_temporary_server_error';
  if (status >= 300 && status < 400) return 'review_redirect';
  return 'review_http_error';
}
async function check([url, references]) {
  const started = performance.now();
  try {
    // A single GET avoids treating merchants that reject HEAD as unavailable.
    // Cancel the response body: status and headers are enough for this link check.
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'JapaneseCraftJewelry-Link-Check/0.11', Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.5' } });
    const result = { url, references, method: 'GET', status: response.status, finalUrl: response.url, redirected: response.redirected, contentType: response.headers.get('content-type'), classification: classify(response.status, response.url), durationMs: Math.round(performance.now() - started) };
    await response.body?.cancel();
    return result;
  } catch (error) {
    return { url, references, method: 'GET', status: null, finalUrl: null, redirected: null, contentType: null, classification: ['TimeoutError', 'AbortError'].includes(error.name) ? 'review_timeout' : 'review_network_error', error: error.cause?.code || error.name, durationMs: Math.round(performance.now() - started) };
  }
}
const pending = [...urls.entries()];
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: Math.min(4, pending.length) }, async () => {
  while (cursor < pending.length) {
    const index = cursor++;
    results[index] = await check(pending[index]);
    console.log(`${index + 1}/${pending.length} ${results[index].classification} ${results[index].status ?? '-'} ${results[index].url}`);
  }
}));
const summary = {};
for (const result of results) summary[result.classification] = (summary[result.classification] || 0) + 1;
const report = {
  checkedAt: new Date().toISOString(),
  checkedDateJapan: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date()),
  method: 'HTTPS GET, redirect-follow, 15-second timeout, concurrency 4; response bodies canceled after headers',
  interpretation: 'Reachability only; does not confirm product facts, eligibility, licensing, active stock or approval. Restricted, missing, temporary and network results require manual recheck; no result alone proves closure.',
  inputFiles, total: results.length, summary, results,
};
const output = resolve(root, process.env.CHECK_LINK_REPORT_PATH || 'docs/quality-stage-external-links.json');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Saved ${results.length} results to ${output}: ${JSON.stringify(summary)}`);
// Network restrictions and temporary failures are review items, not a false build failure.
if (results.some(result => result.classification.startsWith('review_'))) console.log('REVIEW: retry unresolved URLs in a normal browser before changing or removing a source.');
