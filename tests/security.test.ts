import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedDestination, policyForLink, resolveRetailerLink, safeHttps } from '../src/lib/affiliate.ts';
import { catalogSchema, type RetailerLink } from '../src/lib/schema.ts';
import { collectValidationErrors, loadProjectData } from '../scripts/validate.ts';
import { serializeJsonLd } from '../src/lib/structured-data.ts';

const fixture: RetailerLink = {
  id:'test-link', productId:'test-product', merchantId:'test-merchant', programId:'test-program',
  officialProductUrl:'https://shop.example.org/products/one', affiliateUrl:'https://track.example.org/one',
  applicationStatus:'approved', affiliateLinkVerifiedAt:'2026-11-16',
};
const policy = { merchantId:'test-merchant', officialHosts:['shop.example.org'], programMerchantIds:['test-merchant'], affiliateHosts:['track.example.org'] };

test('navigation URLs reject local networks, credentials, ambiguous syntax and nonstandard ports', () => {
  for (const value of ['https://127.0.0.1/','https://[::1]/','https://2130706433/','https://192.168.1.1/','https://localhost/','https://intranet/','https://host.local/','https://host.internal/','https://user:pass@shop.example.org/','https://shop.example.org:444/','https://shop.example.org./',' https://shop.example.org/','https://shop.example.org/\n','https://shop.example.org\\@evil.example.org/','javascript:alert(1)','data:text/html,one','http://shop.example.org/']) assert.equal(safeHttps(value),null,value);
  assert.equal(safeHttps('https://shop.example.org/products/one?ref=a%20b#details'),'https://shop.example.org/products/one?ref=a%20b#details');
});

test('affiliate destination allowlists are exact and fail closed without policy', () => {
  assert.equal(resolveRetailerLink(fixture,'approved'),null);
  for (const url of ['https://track.example.org.evil.test/one','https://evil.test/one','https://track.example.org@evil.test/one','https://sub.track.example.org/one']) {
    assert.equal(isAllowedDestination(url,policy.affiliateHosts),null);
    assert.equal(resolveRetailerLink({...fixture,affiliateUrl:url},'approved',policy)?.href,fixture.officialProductUrl);
  }
  assert.equal(resolveRetailerLink(fixture,'approved',{...policy,affiliateHosts:[]})?.sponsored,false);
  assert.equal(resolveRetailerLink(fixture,'approved',{...policy,programMerchantIds:[]})?.sponsored,false);
  assert.equal(resolveRetailerLink(fixture,'approved',{...policy,merchantId:'other-merchant'}),null);
});

test('an off-merchant ordinary destination is hidden, not rendered as a fallback', () => {
  assert.equal(resolveRetailerLink({...fixture,applicationStatus:'paused',officialProductUrl:'https://evil.test/one'},'approved',policy),null);
});

test('an invalid calendar verification date cannot enable sponsored navigation', () => {
  for (const affiliateLinkVerifiedAt of ['2026-02-31','yesterday','2026-13-01']) assert.equal(resolveRetailerLink({...fixture,affiliateLinkVerifiedAt},'approved',policy)?.sponsored,false);
});

test('the production catalog has no automatic permission for any future affiliate host', () => {
  const data=loadProjectData();
  for(const program of data.catalog.programs) if(program.applicationStatus!=='approved') assert.deepEqual(program.affiliateAllowedHosts,[]);
  for(const link of data.catalog.links) {
    const resolved=resolveRetailerLink(link,data.catalog.programs.find(program=>program.id===link.programId)?.applicationStatus,policyForLink(link,data.catalog));
    assert.ok(resolved?.href);
    assert.equal(resolved.sponsored,false);
  }
});

test('build validation rejects off-merchant ordinary URLs and unlisted approved tracking hosts', () => {
  const data=structuredClone(loadProjectData());
  const link=data.catalog.links[0];
  link.officialProductUrl='https://wrong.example.org/item';
  data.catalog.programs.push({id:'test-program',name:'Test only',recruitmentUrl:'https://test.example.org/program',applicationUrl:null,recruitmentStatus:'uncertain',applicationStatus:'approved',merchantIds:[link.merchantId],affiliateAllowedHosts:['track.example.org'],disclosure:null});
  Object.assign(link,{programId:'test-program',applicationStatus:'approved',affiliateUrl:'https://unlisted.example.org/one',affiliateLinkVerifiedAt:'2026-11-16'});
  const errors=collectValidationErrors(data);
  assert.ok(errors.some(error=>error.includes('official URL host must match')));
  assert.ok(errors.some(error=>error.includes('not in verified affiliateAllowedHosts')));
  data.catalog.programs.at(-1)!.affiliateAllowedHosts=[];
  assert.ok(collectValidationErrors(data).some(error=>error.includes('approved program requires verified')));
});

test('catalog schema rejects wildcard, URL-shaped and credential-bearing host permissions', () => {
  for (const value of ['*.example.org','https://track.example.org','track.example.org/other','user:pass@track.example.org','localhost','127.0.0.1','TRACK.example.org']) {
    const data=structuredClone(loadProjectData().catalog);
    data.programs[0].affiliateAllowedHosts=[value];
    assert.equal(catalogSchema.safeParse(data).success,false,value);
  }
});

test('JSON-LD cannot close its script or inject markup while preserving the exact data', () => {
  const value={headline:'</script><script>alert("x")</script>',description:'A & B > C\u2028next\u2029line'};
  const serialized=serializeJsonLd(value);
  assert.equal(/[<>&\u2028\u2029]/.test(serialized),false);
  assert.deepEqual(JSON.parse(serialized),value);
});
