import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertPlainPath, preflightExport, verifySourceExport } from './lib/source-export.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Eligible inputs and destination ancestors are checked before any write or
// backup rename. pnpm package and ZIP creation share the same selection policy.
const plan = preflightExport(root);
const evidenceFiles = [];
const artifacts = resolve(root, 'artifacts');
assertPlainPath(artifacts);
for (const entry of (existsSync(artifacts) ? readdirSync(artifacts) : []).filter(entry => entry.startsWith('visual-mobile-stage-') && !entry.includes('-pre-polish-') && /\.(?:png|json)$/.test(entry))) {
  const path = resolve(artifacts, entry);
  assertPlainPath(path);
  if (!lstatSync(path).isFile()) throw new Error('Evidence must be a regular file: ' + path);
  evidenceFiles.push({ from: path, to: resolve(plan.evidence, entry) });
}

mkdirSync(plan.delivery, { recursive: true });
if (existsSync(plan.source)) {
  const backup = resolve(plan.delivery, 'source-backup-' + Date.now() + '-' + randomUUID());
  assertPlainPath(backup);
  renameSync(plan.source, backup);
}
mkdirSync(plan.source);
for (const name of plan.files) {
  const from = resolve(root, name);
  const to = resolve(plan.source, name);
  assertPlainPath(from);
  assertPlainPath(to);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}
verifySourceExport(root);
mkdirSync(plan.evidence, { recursive: true });
for (const { from, to } of evidenceFiles) {
  assertPlainPath(to);
  cpSync(from, to);
}
console.log('Current source exported; any previous export was preserved as a backup:', plan.source);
