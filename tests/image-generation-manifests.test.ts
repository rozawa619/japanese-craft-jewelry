import test, {type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import {lstatSync,mkdirSync,mkdtempSync,readFileSync,realpathSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadSoloGenerationManifests} from '../scripts/lib/image-generation-manifests.mjs';

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const fixtureDirectory=join(projectRoot,'artifacts','image-generation-manifest-fixtures');
type Version='v14'|'v16';

function fixture(t:TestContext){
  mkdirSync(fixtureDirectory,{recursive:true});
  // Use the physical parent, so a platform's path alias is not a cleanup target.
  const physicalParent=realpathSync(fixtureDirectory);
  const root=mkdtempSync(join(physicalParent,'case-'));
  mkdirSync(join(root,'docs'));
  t.after(()=>{
    const checked=resolve(root),stats=lstatSync(checked);
    assert.equal(dirname(checked),physicalParent);
    assert.ok(stats.isDirectory()&&!stats.isSymbolicLink());
    assert.equal(dirname(realpathSync(checked)),physicalParent);
    // The checked target is only this newly allocated fixture. No real manifest,
    // generated image, source directory or delivery directory is removed.
    rmSync(checked,{recursive:true,force:true});
  });
  const path=(version:Version)=>join(root,'docs','image-generation-solo-'+version+'.json');
  const raw=(version:Version,body:string)=>writeFileSync(path(version),body);
  const put=(version:Version,images:unknown[])=>raw(version,JSON.stringify({images},null,2)+'\n');
  return{root,path,raw,put};
}

function record(productId:string,version=14){
  return{productId,assetId:'ai-solo-'+productId+'-v'+version,publicPath:'public/images/solo-'+productId+'-v'+version+'.webp',sha256:'a'.repeat(64)};
}

test('the historical manifest remains usable before the optional release exists',t=>{
  const f=fixture(t),old=record('existing-one');f.put('v14',[old]);
  const result=loadSoloGenerationManifests(f.root);
  assert.deepEqual(result.records,[old]);
  assert.deepEqual(result.manifests,[{path:'docs/image-generation-solo-v14.json',images:1}]);
  assert.deepEqual(result.byProductId.get(old.productId),old);
});

test('separate old and new manifests merge without modifying historical bytes or metadata',t=>{
  const f=fixture(t),old={...record('existing-one'),prompt:'An existing reviewed prompt.'},added={...record('added-one',16),sha256:'b'.repeat(64)};
  f.put('v14',[old]);f.put('v16',[added]);
  const beforeOld=readFileSync(f.path('v14')),beforeNew=readFileSync(f.path('v16'));
  const result=loadSoloGenerationManifests(f.root);
  assert.deepEqual(result.records,[old,added]);
  assert.deepEqual([...result.byProductId.keys()],['existing-one','added-one']);
  assert.equal(result.manifests.length,2);
  assert.deepEqual(readFileSync(f.path('v14')),beforeOld);
  assert.deepEqual(readFileSync(f.path('v16')),beforeNew);
});

test('a new manifest cannot replace the required historical generation log',t=>{
  const f=fixture(t);f.put('v16',[record('added-one',16)]);
  assert.throws(()=>loadSoloGenerationManifests(f.root),/Required generation manifest missing: docs\/image-generation-solo-v14\.json/);
});

test('malformed JSON and missing or non-array image collections are rejected',t=>{
  for(const body of ['{',JSON.stringify(null),JSON.stringify({}),JSON.stringify({images:{}}),JSON.stringify({images:'not-an-array'})]){
    const f=fixture(t);f.raw('v14',body);
    assert.throws(()=>loadSoloGenerationManifests(f.root),error=>error instanceof SyntaxError||error instanceof Error&&/needs an images array/.test(error.message));
  }
});

test('invalid product identities cannot become manifest lookup keys',t=>{
  for(const productId of ['',null,123,'UpperCase','../outside','with space']){
    const f=fixture(t);f.put('v14',[{...record('existing-one'),productId}]);
    assert.throws(()=>loadSoloGenerationManifests(f.root),/Invalid generation product ID/);
  }
});

test('a repeated product inside one generation log is rejected',t=>{
  const f=fixture(t),old=record('existing-one');f.put('v14',[old,{...old}]);
  assert.throws(()=>loadSoloGenerationManifests(f.root),/Duplicate generation product ID.*existing-one/);
});

test('another asset and another hash cannot hide a duplicate product across releases',t=>{
  const f=fixture(t);f.put('v14',[record('existing-one')]);
  f.put('v16',[{...record('existing-one',16),sha256:'b'.repeat(64)}]);
  assert.throws(()=>loadSoloGenerationManifests(f.root),/Duplicate generation product ID.*existing-one/);
});

test('the same hash under another asset still cannot duplicate a product across releases',t=>{
  const f=fixture(t);f.put('v14',[record('existing-one')]);
  f.put('v16',[record('existing-one',16)]);
  assert.throws(()=>loadSoloGenerationManifests(f.root),/Duplicate generation product ID.*existing-one/);
});

test('an exact replacement selects the new solo image and preserves both generation records',t=>{
  const f=fixture(t),old=record('existing-one');
  const next={...record('existing-one',16),sha256:'b'.repeat(64),supersedes:old};
  f.put('v14',[old]);f.put('v16',[next]);
  const before=readFileSync(f.path('v14'));
  const result=loadSoloGenerationManifests(f.root);
  assert.deepEqual(result.records,[old,next]);
  assert.deepEqual(result.byProductId.get(old.productId),next);
  assert.deepEqual(readFileSync(f.path('v14')),before);
});

test('solo replacement must identify the previous asset, path and hash for the same product',t=>{
  const old=record('existing-one');
  for (const supersedes of [null,record('another-one'),{...old,publicPath:'public/images/solo-wrong-v14.webp'},{...old,sha256:'c'.repeat(64)}]){
    const f=fixture(t);f.put('v14',[old]);
    f.put('v16',[{...record('existing-one',16),sha256:'b'.repeat(64),supersedes}]);
    assert.throws(()=>loadSoloGenerationManifests(f.root),/Invalid generation replacement for existing-one/);
  }
});

test('unsafe public paths, missing asset identity and malformed hashes are rejected',t=>{
  // The loader checks declared record format. Actual image-byte/hash equality
  // is deliberately checked by check-product-detail-images.mjs, not simulated here.
  const invalid=[
    {publicPath:'https://retailer.example/solo-existing-one-v14.webp'},
    {publicPath:'public/images/../solo-existing-one-v14.webp'},
    {publicPath:'public/images/nested/solo-existing-one-v14.webp'},
    {publicPath:'public/images/solo-UpperCase-v14.webp'},
    {publicPath:'public/images/solo-existing-one-v14.png'},
    {assetId:''},{assetId:null},{assetId:42},
    {sha256:''},{sha256:'a'.repeat(63)},{sha256:'A'.repeat(64)},{sha256:'g'.repeat(64)},{sha256:null},
  ];
  for(const change of invalid){
    const f=fixture(t);f.put('v14',[{...record('existing-one'),...change}]);
    assert.throws(()=>loadSoloGenerationManifests(f.root),/Incomplete reviewed generation record/);
  }
});
