import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnvFile } from 'node:process';
import { loadProjectData, projectRoot, collectValidationErrors } from './validate.ts';
import { safeHttps } from '../src/lib/affiliate.ts';

export type Readiness = { blockers: string[]; information: string[] };
export function isProductionUrl(value: string | undefined): boolean {
  const safe = safeHttps(value);
  if (!safe) return false;
  const host = new URL(safe).hostname.toLowerCase();
  return !['localhost', '127.0.0.1', '0.0.0.0', '[::1]', 'example.com', 'example.org', 'example.net'].includes(host)
    && !host.endsWith('.localhost') && !host.endsWith('.local')
    && !/\.(example\.com|example\.org|example\.net)$/.test(host);
}

export function checkReadiness(env: Record<string, string | undefined>): Readiness {
  const blockers: string[] = [];
  const information: string[] = [];
  if (!isProductionUrl(env.PUBLIC_SITE_URL)) blockers.push('PUBLIC_SITE_URL: set the real public HTTPS URL; local, placeholder and credential-bearing URLs are not publication targets.');
  if (env.PUBLIC_PUBLISH_MODE !== 'public') blockers.push('PUBLIC_PUBLISH_MODE: set public for the actual public URL and operating identity. Preview builds remain noindex.');
  if (!env.PUBLIC_OPERATOR_NAME?.trim()) blockers.push('PUBLIC_OPERATOR_NAME: provide the operator name or verified public operating identity to be shown.');
  // The operator explicitly deferred Contact. An unused contact setting is not
  // a technical publication requirement or proof of a program's eligibility.
  information.push('Contact is intentionally unpublished. A public Contact page is not a technical publication prerequisite; verify any program-specific requirement before applying.');
  information.push('Application preparation is a separate, pending review: verify the current registration terms and required truthful applicant details in docs/pre-application-checklist.md. This technical check does not certify eligibility, approval, domain ownership or contact delivery, and submits nothing.');
  const publicUrl=safeHttps(env.PUBLIC_SITE_URL);
  if(publicUrl&&new URL(publicUrl).hostname.endsWith('.github.io'))information.push('COMMERCIAL HOSTING REVIEW PENDING: GitHub Pages restricts sites primarily facilitating commercial transactions. Confirm suitability or move to an appropriate host before monetization. A technical build does not establish contractual suitability; see docs/hosting-commercial-readiness-v11.md.');
  return { blockers, information };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  // Node preserves existing environment values. Load higher-priority files first.
  for (const name of ['.env.production.local', '.env.production', '.env.local', '.env']) {
    const file = resolve(projectRoot, name);
    if (existsSync(file)) loadEnvFile(file);
  }
  const result = checkReadiness(process.env);
  try {
    const data=loadProjectData();
    result.blockers.push(...collectValidationErrors(data).map(message => `Data: ${message}`));
    const publishedIds=new Set(data.catalog.products.filter(product=>product.publishStatus==='published').map(product=>product.id));
    const ledger = JSON.parse(readFileSync(resolve(projectRoot, 'docs/assets.json'), 'utf8'));
    const missingPhotos = (ledger.productPhotography || []).filter((entry: { productId:string;permissionStatus?: string }) => publishedIds.has(entry.productId)&&entry.permissionStatus !== 'approved').length;
    if (missingPhotos) result.information.push(`${missingPhotos} products have no licensed product photograph. Use labeled illustrations or the official-page preview; obtain the necessary rights before publishing actual photographs.`);
  } catch (error) {
    result.blockers.push(`Data verification failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  for (const message of result.information) console.log(`INFO ${message}`);
  for (const message of result.blockers) console.error(`BLOCKER ${message}`);
  if (result.blockers.length) {
    console.error(`NOT READY for technical public launch: ${result.blockers.length} blocker(s). A local noindex preview can still be used. Affiliate application readiness is assessed separately.`);
    process.exitCode = 1;
  } else {
    console.log('PASS technical publication configuration only. APPLICATION PREPARATION: pending program-specific review; see docs/pre-application-checklist.md and docs/affiliate-readiness.md.');
  }
}
