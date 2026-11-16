import test from 'node:test';
import assert from 'node:assert/strict';
import raw from '../src/data/catalog.json' with { type: 'json' };
import sources from '../docs/research/sources.json' with { type: 'json' };
import { safeHttps, resolveRetailerLink } from '../src/lib/affiliate.ts';
import type { RetailerLink } from '../src/lib/schema.ts';
import { catalogSchema } from '../src/lib/schema.ts';
import { collectValidationErrors, loadProjectData } from '../scripts/validate.ts';
import { checkReadiness, isProductionUrl } from '../scripts/readiness.ts';

// These URLs exist only inside tests and are never part of published data.
const ordinary = 'https://retailer.example.org/products/one';
const affiliate = 'https://tracking.example.org/approved-one';
const fixture: RetailerLink = {
  id: 'test-retailer', productId: 'test-product', merchantId: 'test-merchant', programId: 'test-program',
  officialProductUrl: ordinary, affiliateUrl: affiliate, applicationStatus: 'approved', affiliateLinkVerifiedAt: '2026-11-16',
};

test('approved item and program with verified HTTPS URL produce sponsored link', () => {
  assert.deepEqual(resolveRetailerLink(fixture, 'approved'), { href: affiliate, sponsored: true, rel: 'sponsored noopener noreferrer' });
});

for (const status of ['not_applied', 'pending', 'rejected', 'paused'] as const) {
  test(`item status ${status} falls back to ordinary retailer URL`, () => {
    assert.deepEqual(resolveRetailerLink({ ...fixture, applicationStatus: status }, 'approved'), { href: ordinary, sponsored: false, rel: 'noopener noreferrer' });
  });
}

for (const status of [undefined, 'not_applied', 'pending', 'rejected', 'paused']) {
  test(`program status ${String(status)} cannot enable advertising`, () => {
    assert.equal(resolveRetailerLink(fixture, status)?.sponsored, false);
  });
}

for (const value of [null, '', 'not a url', 'http://tracking.example.org/one', 'javascript:alert(1)', 'https://user:secret@tracking.example.org/one']) {
  test(`unusable affiliate URL ${String(value)} falls back safely`, () => {
    assert.equal(resolveRetailerLink({ ...fixture, affiliateUrl: value }, 'approved')?.href, ordinary);
    assert.equal(resolveRetailerLink({ ...fixture, affiliateUrl: value }, 'approved')?.sponsored, false);
  });
}

test('verification date and program identity are required to enable advertising', () => {
  assert.equal(resolveRetailerLink({ ...fixture, affiliateLinkVerifiedAt: null }, 'approved')?.sponsored, false);
  assert.equal(resolveRetailerLink({ ...fixture, programId: null }, 'approved')?.sponsored, false);
});

test('no usable ordinary or affiliate URL means no CTA', () => {
  assert.equal(resolveRetailerLink(undefined), null);
  assert.equal(resolveRetailerLink({ ...fixture, applicationStatus: 'pending', officialProductUrl: null }, 'approved'), null);
  assert.equal(resolveRetailerLink({ ...fixture, applicationStatus: 'pending', officialProductUrl: 'javascript:alert(1)' }, 'approved'), null);
});

test('a fully approved link works even when ordinary URL is unavailable', () => {
  assert.equal(resolveRetailerLink({ ...fixture, officialProductUrl: null }, 'approved')?.href, affiliate);
});

test('normal links never acquire sponsored rel by accident', () => {
  const resolved = resolveRetailerLink({ ...fixture, applicationStatus: 'paused' }, 'approved');
  assert.ok(resolved);
  assert.equal(resolved.rel.includes('sponsored'), false);
  assert.equal(resolved.sponsored, false);
});

test('published JSON uses the real schema and all references have targets', () => {
  assert.equal(catalogSchema.safeParse(raw).success, true);
  assert.ok(sources.length > 0);
  assert.deepEqual(collectValidationErrors(loadProjectData()), []);
});

test('duplicate IDs and missing references are reported', () => {
  const data = structuredClone(loadProjectData());
  data.catalog.materials.push({ ...data.catalog.materials[0] });
  data.catalog.products[0].sourceIds.push('missing-source');
  data.catalog.products[0].makerId = 'missing-maker';
  const errors = collectValidationErrors(data);
  assert.ok(errors.some(error => error.includes('duplicate id')));
  assert.ok(errors.some(error => error.includes('missing-source')));
  assert.ok(errors.some(error => error.includes('missing-maker')));
});

test('a published product without its editorial note is rejected', () => {
  const data = structuredClone(loadProjectData());
  data.notes = [];
  assert.ok(collectValidationErrors(data).some(error => error.includes('published product note required')));
});

test('program and merchant mismatch is rejected before build', () => {
  const data = structuredClone(loadProjectData());
  data.catalog.links[0].programId = data.catalog.programs[0].id;
  data.catalog.links[0].applicationStatus = 'approved';
  assert.ok(collectValidationErrors(data).some(error => error.includes('program does not include merchant')));
});

test('guide cannot expose a draft product through a related-product reference', () => {
  const data = structuredClone(loadProjectData());
  data.catalog.products[0].publishStatus = 'draft';
  data.guides[0].metadata.productIds = [data.catalog.products[0].id];
  assert.ok(collectValidationErrors(data).some(error => error.includes('published guide refers to draft')));
});

test('region and craft content reject unknown references and mismatched URL IDs', () => {
  const data = structuredClone(loadProjectData());
  data.places[0].metadata.prefectureId = 'missing-prefecture';
  data.places[0].metadata.relatedMerchantIds = ['missing-merchant'];
  data.craftNotes[0].metadata.craftId = 'missing-craft';
  data.craftNotes[0].metadata.sourceIds = ['missing-source'];
  const errors = collectValidationErrors(data);
  for (const id of ['missing-prefecture', 'missing-merchant', 'missing-craft', 'missing-source']) assert.ok(errors.some(error => error.includes(id)), id);
  assert.ok(errors.some(error => error.includes('Markdown filename/slug must equal')));
});

test('published region and craft pages need content and a published matching product', () => {
  const data = structuredClone(loadProjectData());
  data.places[0].body = '  ';
  data.craftNotes[0].body = '';
  data.catalog.products.forEach(product => { product.publishStatus = 'draft'; });
  const errors = collectValidationErrors(data);
  assert.equal(errors.filter(error => error.includes('published page requires a nonempty body')).length, 2);
  assert.equal(errors.filter(error => error.includes('published page requires a related published product')).length, data.places.length + data.craftNotes.length);
  for (const record of [...data.places, ...data.craftNotes]) record.metadata.publishStatus = 'draft';
  const draftErrors = collectValidationErrors(data);
  assert.equal(draftErrors.some(error => error.includes('published page requires')), false);
});

test('publication rejects missing, placeholder, local and unsafe URLs', () => {
  for (const value of [undefined, '', 'http://real-domain.test', 'https://localhost', 'https://127.0.0.1', 'https://example.com', 'https://sub.example.org', 'https://user:pass@real-domain.test']) assert.equal(isProductionUrl(value), false, String(value));
  assert.equal(safeHttps('https://safe.test/path'), 'https://safe.test/path');
  assert.ok(checkReadiness({}).blockers.length >= 4);
});

test('technical readiness requires an explicit public mode and a contact configuration', () => {
  const env = { PUBLIC_SITE_URL: 'https://ito-craft.test', PUBLIC_PUBLISH_MODE: 'public', PUBLIC_OPERATOR_NAME: 'Test identity', PUBLIC_REPOSITORY_URL: 'https://github.com/test-owner/test-repo' };
  assert.deepEqual(checkReadiness(env).blockers, []);
  assert.ok(checkReadiness({ ...env, PUBLIC_PUBLISH_MODE: 'preview' }).blockers.some(message => message.includes('PUBLIC_PUBLISH_MODE')));
  assert.ok(checkReadiness({ ...env, PUBLIC_REPOSITORY_URL: '' }).blockers.some(message => message.includes('Contact')));
});


test('published jewelry requires Japanese content and preserves shared factual fields', () => {
 const data=structuredClone(loadProjectData());
 const product=data.catalog.products.find(product=>product.publishStatus==='published')!;
 delete data.translations.products[product.id];
 data.notes=data.notes.filter(note=>!(note.metadata.productId===product.id&&note.metadata.locale==='ja'));
 const errors=collectValidationErrors(data);
 assert.ok(errors.some(error=>error.includes('Japanese product translation required')));
 assert.ok(errors.some(error=>error.includes('published product note required for ja')));
});

test('Japanese presentation cannot duplicate price facts or fill unknown hardware', () => {
 const data=structuredClone(loadProjectData());
 const product=data.catalog.products.find(product=>product.publishStatus==='published'&&product.findings===null)!;
 data.translations.products[product.id].priceAmount=1;
 data.translations.products[product.id].findings='invented metal';
 const errors=collectValidationErrors(data);
 assert.ok(errors.some(error=>error.includes('factual or unsupported field priceAmount')));
 assert.ok(errors.some(error=>error.includes('unknown findings must remain null')));
});

test('published English and Japanese pages need matching peers and source references', () => {
 const data=structuredClone(loadProjectData());
 const ja=data.guides.find(guide=>guide.metadata.locale==='ja')!;
 ja.metadata.sourceIds=[];
 assert.ok(collectValidationErrors(data).some(error=>error.includes('bilingual sourceIds references must agree')));
 data.guides=data.guides.filter(guide=>guide!==ja);
 assert.ok(collectValidationErrors(data).some(error=>error.includes('published bilingual peer required')));
});

test('hair accessories stay out of the published jewelry catalog', () => {
 const data=structuredClone(loadProjectData());
 const hair=data.catalog.products.find(product=>product.productType.includes('hair-accessory'));
 assert.ok(hair);
 assert.equal(hair.publishStatus,'draft');
 hair.publishStatus='published';
 assert.ok(collectValidationErrors(data).some(error=>error.includes('published product must be jewelry')));
});
