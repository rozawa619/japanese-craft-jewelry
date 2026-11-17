import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { assertDeliveryTargets, deliveryPaths, preflightExport, repositoryFiles, verifySourceExport } from '../scripts/lib/source-export.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixturesRoot = join(projectRoot, 'artifacts', 'source-export-fixtures');

function fixture(t: TestContext) {
  mkdirSync(fixturesRoot, { recursive: true });
  const workspace = mkdtempSync(join(fixturesRoot, 'case-'));
  t.after(() => {
    // This cleanup target is the newly allocated fixture, never the real repo
    // or delivery. Node removes junction entries without following their target.
    assert.equal(dirname(resolve(workspace)), resolve(fixturesRoot));
    rmSync(workspace, { recursive: true, force: true });
  });
  const root = join(workspace, 'repo');
  mkdirSync(root);
  const put = (name: string, contents = 'fixture') => {
    const path = join(root, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
  };
  put('package.json', JSON.stringify({ version: '0.15.0', type: 'module' }));
  put('docs/assets.json', JSON.stringify({ assets: [] }));
  put('src/example.ts', 'export const example = 1;');
  const exportFiles = () => {
    const { source } = deliveryPaths(root);
    for (const name of repositoryFiles(root)) {
      mkdirSync(dirname(join(source, name)), { recursive: true });
      cpSync(join(root, name), join(source, name));
    }
    return source;
  };
  return { put, exportFiles, ...deliveryPaths(root) };
}

test('the common export policy excludes explicit private/generated paths and retired images', t => {
  const f = fixture(t);
  for (const name of ['.env', '.env.local', 'nested/.env.example', '.npmrc', 'nested/.NETRC', '.git-credentials', 'cert.PEM', 'nested/sign.key', 'nested/cert.pfx', 'cert.p12', 'dist/page.html', 'nested/node_modules/x.js', 'artifacts/x.json', 'build.log', 'public/images/retired.webp']) f.put(name);
  f.put('.env.example', 'PUBLIC_OPERATOR_NAME=');
  f.put('public/images/current.webp');
  f.put('docs/assets.json', JSON.stringify({ assets: [{ status: 'retired', localRetiredPath: 'public/images/retired.webp' }] }));
  assert.deepEqual(repositoryFiles(f.root), ['.env.example', 'docs/assets.json', 'package.json', 'public/images/current.webp', 'src/example.ts']);
});

test('matching source/export file sets and every SHA pass with dynamic file counts', t => {
  const f = fixture(t);
  f.exportFiles();
  const result = verifySourceExport(f.root);
  assert.equal(result.repositoryAndExportFileSetsMatch, true);
  assert.equal(result.everyRepositoryFileSha256Checks, 3);
  assert.equal(result.files.length, 3);
});

test('a newly added repository file omitted from an older export is rejected', t => {
  const f = fixture(t);
  f.exportFiles();
  f.put('src/new-helper.ts');
  assert.throws(() => verifySourceExport(f.root), /file set differs:.*new-helper/);
});

test('an extra excluded credential file in an export is rejected', t => {
  const f = fixture(t);
  const source = f.exportFiles();
  writeFileSync(join(source, '.npmrc'), 'fixture-only');
  assert.throws(() => verifySourceExport(f.root), /file set differs:.*\.npmrc/);
});

test('a stale exported file with unchanged file set is rejected by SHA', t => {
  const f = fixture(t);
  const source = f.exportFiles();
  writeFileSync(join(source, 'src/example.ts'), 'changed');
  assert.throws(() => verifySourceExport(f.root), /Stale source export: src\/example.ts/);
});

test('a delivery-root junction is rejected before creating or moving export files', t => {
  const f = fixture(t);
  const elsewhere = join(f.workspace, 'elsewhere');
  mkdirSync(elsewhere);
  writeFileSync(join(elsewhere, 'marker.txt'), 'unchanged');
  symlinkSync(elsewhere, f.delivery, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => preflightExport(f.root), /Links or redirected ancestors/);
  assert.deepEqual(readdirSync(elsewhere), ['marker.txt']);
  assert.equal(readFileSync(join(elsewhere, 'marker.txt'), 'utf8'), 'unchanged');
});

test('a junction inside included repository inputs is rejected before any export exists', t => {
  const f = fixture(t);
  const elsewhere = join(f.workspace, 'elsewhere');
  mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(f.root, 'src', 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => preflightExport(f.root), /Links or junctions/);
  assert.equal(existsSync(f.delivery), false);
});

test('a pre-existing exported junction is rejected rather than archived or traversed', t => {
  const f = fixture(t);
  const source = f.exportFiles();
  const elsewhere = join(f.workspace, 'elsewhere');
  mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(source, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => verifySourceExport(f.root), /Links or junctions/);
});

test('archive targets reject escaping paths and existing junction leaves', t => {
  const f = fixture(t);
  mkdirSync(f.delivery);
  assert.doesNotThrow(() => assertDeliveryTargets(f.root, [join(f.delivery, 'candidate.zip')]));
  assert.throws(() => assertDeliveryTargets(f.root, [join(f.workspace, 'outside.zip')]), /single file/);
  const elsewhere = join(f.workspace, 'elsewhere');
  mkdirSync(elsewhere);
  const linkedZip = join(f.delivery, 'latest.zip');
  symlinkSync(elsewhere, linkedZip, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => assertDeliveryTargets(f.root, [linkedZip]), /Links or redirected ancestors/);
});

test('an unsafe version cannot choose an evidence directory outside delivery', t => {
  const f = fixture(t);
  f.put('package.json', JSON.stringify({ version: '../escape' }));
  assert.throws(() => preflightExport(f.root), /Invalid package version/);
  assert.equal(existsSync(f.delivery), false);
});

test('normal source packaging uses the shared policy and preserves the previous export', t => {
  const f = fixture(t);
  for (const name of ['scripts/package-source.mjs', 'scripts/lib/source-export.mjs']) f.put(name, readFileSync(join(projectRoot, name), 'utf8'));
  f.put('.env', 'not-exported');
  f.put('private.KEY', 'not-exported');
  execFileSync(process.execPath, [join(f.root, 'scripts/package-source.mjs')], { encoding: 'utf8' });
  assert.equal(existsSync(join(f.source, '.env')), false);
  assert.equal(existsSync(join(f.source, 'private.KEY')), false);
  f.put('src/new-helper.ts', 'new source');
  execFileSync(process.execPath, [join(f.root, 'scripts/package-source.mjs')], { encoding: 'utf8' });
  assert.equal(existsSync(join(f.source, 'src/new-helper.ts')), true);
  assert.equal(readdirSync(f.delivery).filter(name => name.startsWith('source-backup-')).length, 1);
  assert.equal(verifySourceExport(f.root).files.length, 6);
});
