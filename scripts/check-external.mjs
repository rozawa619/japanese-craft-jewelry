import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {safeHttps} from '../src/lib/affiliate.ts';
import {checkPublicHttps,OutboundPolicyError} from './lib/safe-outbound.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputFiles = ['src/data/catalog.json', 'src/data/visits.json', 'docs/research/sources.json', 'docs/research/affiliate-sources.json'];
const urls = new Map();
function collect(value, source, path = '') {
  if (Array.isArray(value)) return value.forEach((entry, index) => collect(entry, source, `${path}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).forEach(([key, entry]) => collect(entry, source, `${path}.${key}`));
  if (typeof value !== 'string' || !/^https:\/\/[^\s<>"`]+$/.test(value)) return;
  try {
    const safe=safeHttps(value);if(!safe)throw new Error(`Unsafe public HTTPS URL in ${source}${path}`);
    const url = new URL(safe);
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
    // Every redirect and DNS address is checked before a direct TLS connection.
    // The transport pins that checked DNS result and discards bodies at headers.
    const response=await checkPublicHttps(url);
    return {url,references,method:'GET',status:response.status,finalUrl:response.finalUrl,redirected:response.redirected,contentType:response.contentType,redirectHops:response.hops,classification:classify(response.status,response.finalUrl),durationMs:Math.round(performance.now()-started)};
  } catch (error) {
    return { url, references, method: 'GET', status: null, finalUrl: null, redirected: null, contentType: null, classification:error instanceof OutboundPolicyError?'review_unsafe_destination':['TimeoutError', 'AbortError'].includes(error.name)?'review_timeout':'review_network_error',error:error instanceof OutboundPolicyError?error.code:error.cause?.code||error.name,durationMs:Math.round(performance.now()-started)};
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
  method:'Direct HTTPS GET, at most5 manual redirects, public-unicast A/AAAA validation and pinned lookup at every hop,15-second whole-chain timeout,concurrency4;TLS certificate verification enabled,environment proxies not used,bodies discarded after headers',
  interpretation: 'Reachability only; does not confirm product facts, eligibility, licensing, active stock or approval. Restricted, missing, temporary and network results require manual recheck; no result alone proves closure.',
  inputFiles, total: results.length, summary, results,
};
const catalog=JSON.parse(await readFile(resolve(root,'src/data/catalog.json'),'utf8'));
const visits=JSON.parse(await readFile(resolve(root,'src/data/visits.json'),'utf8'));
const publishedIds=new Set(catalog.products.filter(product=>product.publishStatus==='published').map(product=>product.id));
const normalize=value=>{const url=new URL(value);url.hash='';return url.href};
const purchaseAndStoreUrls=[...new Set([...catalog.links.filter(link=>publishedIds.has(link.productId)&&link.officialProductUrl).map(link=>normalize(link.officialProductUrl)),...visits.stores.map(store=>normalize(store.officialStoreUrl))])];
const unresolved=purchaseAndStoreUrls.flatMap(url=>{const result=results.find(result=>result.url===url);return result?.classification==='reachable'?[]:[{url,status:result?.status??null,classification:result?.classification??'missing-from-scan'}]});
report.publishedProductAndStoreSubset={uniqueUrls:purchaseAndStoreUrls.length,reachable:purchaseAndStoreUrls.length-unresolved.length,unresolved};
const output = resolve(root, process.env.CHECK_LINK_REPORT_PATH || 'docs/editorial-stage-external-links.json');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Saved ${results.length} results to ${output}: ${JSON.stringify(summary)}`);
// Network restrictions and temporary failures are review items, not a false build failure.
if (results.some(result => result.classification.startsWith('review_'))) console.log('REVIEW: retry unresolved URLs in a normal browser before changing or removing a source.');
