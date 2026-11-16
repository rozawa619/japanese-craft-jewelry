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
  if (env.PUBLIC_PUBLISH_MODE !== 'public') blockers.push('PUBLIC_PUBLISH_MODE: set public only when the actual domain, operator and contact are ready. Preview builds remain noindex.');
  if (!env.PUBLIC_OPERATOR_NAME?.trim()) blockers.push('PUBLIC_OPERATOR_NAME: provide the operator name or verified public operating identity to be shown.');
  const email = env.PUBLIC_CONTACT_EMAIL?.trim();
  const validEmail = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/@(?:.*\.)?example\.(?:com|org|net)$/i.test(email);
  const repository = env.PUBLIC_REPOSITORY_URL?.trim();
  const validRepository = isProductionUrl(repository) && new URL(repository!).pathname.split('/').filter(Boolean).length >= 2;
  if (!validEmail && !validRepository) blockers.push('Contact: configure a real PUBLIC_CONTACT_EMAIL or a real PUBLIC_REPOSITORY_URL with a working public issue tracker.');
  if (email && !validEmail) blockers.push('PUBLIC_CONTACT_EMAIL: replace the invalid or placeholder email address.');
  if (repository && !validRepository) blockers.push('PUBLIC_REPOSITORY_URL: replace the invalid or incomplete repository URL.');
  if (validRepository && !validEmail) information.push('Repository contact configured: manually confirm that Issues are enabled and a visitor can submit an editorial correction. Do not post private order details.');
  information.push('This check does not submit an affiliate application or establish program eligibility, approval, domain ownership or contact delivery.');
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
    result.blockers.push(...collectValidationErrors(loadProjectData()).map(message => `Data: ${message}`));
    const ledger = JSON.parse(readFileSync(resolve(projectRoot, 'docs/assets.json'), 'utf8'));
    const missingPhotos = (ledger.productPhotography || []).filter((entry: { permissionStatus?: string }) => entry.permissionStatus !== 'approved').length;
    if (missingPhotos) result.information.push(`${missingPhotos} products have no licensed product photograph. No permission is required for unused photographs; retain the labeled abstract substitutes, or obtain rights before adding photos.`);
  } catch (error) {
    result.blockers.push(`Data verification failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  for (const message of result.information) console.log(`INFO ${message}`);
  for (const message of result.blockers) console.error(`BLOCKER ${message}`);
  if (result.blockers.length) {
    console.error(`NOT READY for public launch/application: ${result.blockers.length} blocker(s). A local noindex preview can still be used.`);
    process.exitCode = 1;
  } else {
    console.log('PASS technical publication configuration. Confirm program-specific conditions in docs/affiliate-readiness.md before applying.');
  }
}
