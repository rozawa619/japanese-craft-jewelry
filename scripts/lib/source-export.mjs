import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, parse, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const generatedDirectories = new Set(['node_modules', 'dist', '.git', '.astro', 'artifacts', 'test-results', 'playwright-report']);
const credentialNames = new Set(['.npmrc', '.netrc', '_netrc', '.pypirc', '.git-credentials']);
const privateKeyExtension = /\.(?:pem|key|pfx|p12)$/i;
const versionPattern = /^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/;
const portable = value => value.split(sep).join('/');
const pathKey = value => process.platform === 'win32' ? value.toLowerCase() : value;

function statIfPresent(path) {
  try { return lstatSync(path); } catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
}

// Check ancestors before any write: lexical containment alone does not stop a
// pre-existing junction from redirecting a fixed delivery path elsewhere.
export function assertPlainPath(path) {
  const absolute = resolve(path);
  const ancestors = [];
  for (let current = absolute; ; current = dirname(current)) {
    ancestors.push(current);
    if (current === parse(current).root) break;
  }
  for (const current of ancestors.reverse()) {
    const stats = statIfPresent(current);
    if (!stats) continue;
    if (stats.isSymbolicLink() || pathKey(realpathSync(current)) !== pathKey(current)) {
      throw new Error('Links or redirected ancestors are not delivery inputs/targets: ' + current);
    }
    if (current !== absolute && !stats.isDirectory()) throw new Error('Non-directory ancestor: ' + current);
  }
}

export function deliveryPaths(repositoryRoot) {
  const root = resolve(repositoryRoot);
  const workspace = dirname(root);
  const delivery = resolve(workspace, 'japanese-craft-jewelry-delivery');
  const source = resolve(delivery, 'source');
  if (dirname(delivery) !== workspace || dirname(source) !== delivery || root === delivery) throw new Error('Unsafe export destination');
  return { root, workspace, delivery, source };
}

function excluded(relativePath) {
  const parts = relativePath.split('/');
  const name = parts.at(-1);
  return parts.some(part => generatedDirectories.has(part.toLowerCase()) || credentialNames.has(part.toLowerCase())) ||
    parts.some(part => part.toLowerCase().startsWith('.env') && relativePath !== '.env.example') ||
    privateKeyExtension.test(name) || (parts.length === 1 && name.endsWith('.log'));
}

function walkFiles(root, exclude = () => false) {
  assertPlainPath(root);
  const rootStats = statIfPresent(root);
  if (!rootStats?.isDirectory()) throw new Error('Expected a directory: ' + root);
  const names = [];
  function visit(directory) {
    for (const entry of readdirSync(directory).sort()) {
      const path = resolve(directory, entry);
      const name = portable(relative(root, path));
      if (exclude(name)) continue;
      const stats = lstatSync(path);
      if (stats.isSymbolicLink()) throw new Error('Links or junctions are not source archive entries: ' + path);
      if (stats.isDirectory()) visit(path);
      else if (stats.isFile()) names.push(name);
      else throw new Error('Only regular files belong in a source archive: ' + path);
    }
  }
  visit(root);
  return names.sort();
}

export function repositoryFiles(root) {
  const files = walkFiles(root, excluded);
  if (!files.includes('docs/assets.json') || !files.includes('package.json')) throw new Error('Repository package/asset ledger is missing');
  const ledger = JSON.parse(readFileSync(resolve(root, 'docs/assets.json'), 'utf8'));
  const retired = new Set(ledger.assets.flatMap(asset => asset.status === 'retired' && typeof asset.localRetiredPath === 'string' && /^public\/images\/[a-z0-9-]+\.webp$/.test(asset.localRetiredPath) ? [asset.localRetiredPath] : []));
  return files.filter(name => !retired.has(name));
}

export function assertDeliveryTargets(root, targets) {
  const { delivery } = deliveryPaths(root);
  assertPlainPath(delivery);
  const deliveryStats = statIfPresent(delivery);
  if (deliveryStats && !deliveryStats.isDirectory()) throw new Error('Delivery root must be a directory');
  for (const target of targets) {
    if (!isAbsolute(target) || dirname(resolve(target)) !== delivery) throw new Error('Archive target must be a single file in the delivery directory: ' + target);
    assertPlainPath(target);
    const stats = statIfPresent(target);
    if (stats && !stats.isFile()) throw new Error('Archive target must be a regular file: ' + target);
  }
}

export function preflightExport(repositoryRoot) {
  const paths = deliveryPaths(repositoryRoot);
  assertPlainPath(paths.root);
  assertPlainPath(paths.delivery);
  const files = repositoryFiles(paths.root);
  const version = JSON.parse(readFileSync(resolve(paths.root, 'package.json'), 'utf8')).version;
  if (typeof version !== 'string' || !versionPattern.test(version)) throw new Error('Invalid package version for delivery directory');
  assertPlainPath(paths.source);
  if (statIfPresent(paths.source)) walkFiles(paths.source);
  const evidence = resolve(paths.delivery, 'screenshots', version);
  assertPlainPath(evidence);
  if (statIfPresent(evidence)) walkFiles(evidence);
  return { ...paths, evidence, version, files };
}

function digest(path) { return createHash('sha256').update(readFileSync(path)).digest('hex'); }

export function verifySourceExport(repositoryRoot) {
  const plan = preflightExport(repositoryRoot);
  const actual = walkFiles(plan.source);
  const expectedSet = new Set(plan.files);
  const actualSet = new Set(actual);
  const missing = plan.files.filter(name => !actualSet.has(name));
  const unexpected = actual.filter(name => !expectedSet.has(name));
  if (missing.length || unexpected.length) throw new Error('Repository/export file set differs: ' + JSON.stringify({ missing, unexpected }));
  for (const name of plan.files) {
    if (digest(resolve(plan.root, name)) !== digest(resolve(plan.source, name))) throw new Error('Stale source export: ' + name);
  }
  return { files: actual, repositoryAndExportFileSetsMatch: true, everyRepositoryFileSha256Checks: actual.length };
}

const invokedDirectly = process.argv[1] && pathKey(resolve(process.argv[1])) === pathKey(fileURLToPath(import.meta.url));
if (invokedDirectly) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const [command, ...targets] = process.argv.slice(2);
  if (command === 'preflight') console.log(JSON.stringify(preflightExport(root)));
  else if (command === 'check-export') console.log(JSON.stringify(verifySourceExport(root)));
  else if (command === 'check-targets') { assertDeliveryTargets(root, targets); console.log(JSON.stringify({ checkedTargets: targets.length })); }
  else throw new Error('Use preflight, check-export, or check-targets');
}
