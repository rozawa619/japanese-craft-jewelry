import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../src/lib/catalog.ts';
import {marketPricesFor,formatMarketPrice} from '../src/lib/market-prices.ts';
import {validateMarketRetailerAnchor} from '../scripts/market-link-policy.mjs';
import type {Catalog,Product} from '../src/lib/schema.ts';

const normalize=(text:string)=>text.replace(/\s+/g,' ').trim();
const rinzen=catalog.products.find(product=>product.id==='rinzen-seika-amber-pierced-earrings')!;
const fixture=(product:Product)=>({products:[product],links:catalog.links.filter(link=>link.productId===product.id),merchants:catalog.merchants});

test('the actual RINZEN market prices remain JPY26400 and USD288, not two conversions',()=>{
 const before=structuredClone(catalog);
 const result=marketPricesFor(rinzen.id);
 assert.deepEqual([result.japan?.amount,result.japan?.currency],[26400,'JPY']);
 assert.deepEqual([result.international?.amount,result.international?.currency],[288,'USD']);
 for(const locale of ['en','ja'] as const){
  assert.equal(normalize(formatMarketPrice(result.japan,locale)),'JPY 26,400');
  assert.equal(normalize(formatMarketPrice(result.international,locale)),'USD 288');
 }
 assert.deepEqual(catalog,before,'Selecting a purchase market must not mutate the source prices or locale facts.');
});

test('Japan reference price keeps its own date, tax note and source rather than borrowing the global record',()=>{
 const product=structuredClone(rinzen);
 product.priceCheckedAt='2026-10-01';
 product.taxNote='Global tax inclusion unconfirmed';
 product.localizedPrices!.ja!.checkedAt='2026-10-30';
 product.localizedPrices!.ja!.taxNote='Japan source includes tax';
 product.localizedPrices!.ja!.sourceIds=['japan-specific-source'];
 const result=marketPricesFor(product.id,fixture(product));
 assert.equal(result.japan?.checkedAt,'2026-10-30');
 assert.equal(result.japan?.taxNote,'Japan source includes tax');
 assert.deepEqual(result.japan?.sourceIds,['japan-specific-source']);
 assert.equal(result.international?.checkedAt,'2026-10-01');
 assert.equal(result.international?.taxNote,'Global tax inclusion unconfirmed');
});

test('a global-only quoted price never becomes an invented Japan price',()=>{
 const product=structuredClone(rinzen);delete product.localizedPrices;
 const result=marketPricesFor(product.id,fixture(product));
 assert.equal(result.japan,null);
 assert.deepEqual([result.international?.amount,result.international?.currency],[288,'USD']);
 assert.doesNotMatch(formatMarketPrice(result.japan,'en'),/[0-9]|JPY|USD/);
});

test('unknown prices and absent products stay unknown rather than zero',()=>{
 const unknown=catalog.products.find(product=>product.id==='cocoon-ori-nonhole-earrings')!;
 for(const id of [unknown.id,'missing-test-product']){
  const result=marketPricesFor(id);
  assert.equal(result.japan,null);assert.equal(result.international,null);
  for(const locale of ['en','ja'] as const)assert.doesNotMatch(formatMarketPrice(result.japan,locale),/[0-9]|JPY|USD/);
 }
});

test('a single JPY listing needs no international price and a verified zero price is not missing',()=>{
 const product=structuredClone(catalog.products.find(product=>product.id==='hamamatsuya-catch-pierced')!);
 const original=marketPricesFor(product.id,fixture(product));
 assert.deepEqual([original.japan?.amount,original.japan?.currency,original.japan?.checkedAt],[product.priceAmount,'JPY',product.priceCheckedAt]);
 assert.equal(original.international,null);
 product.priceAmount=0;
 const free=marketPricesFor(product.id,fixture(product));
 assert.equal(free.japan?.amount,0);
 assert.equal(normalize(formatMarketPrice(free.japan,'en')),'JPY 0');
});

test('the international quote retains researched cents when shown beside the Japan reference',()=>{
 const result=marketPricesFor('morphosphere-ultramarine-pansy-pierced-earrings');
 assert.equal(normalize(formatMarketPrice(result.japan,'en')),'JPY 4,620');
 assert.equal(normalize(formatMarketPrice(result.international,'en')),'USD 50.40');
});

test('market reference links stay on the verified official store even if an English ad is approved',()=>{
 const source=structuredClone(fixture(rinzen)) as Pick<Catalog,'products'|'links'|'merchants'>;
 const english=source.links.find(link=>link.locale==='en')!;
 english.applicationStatus='approved';english.affiliateLinkVerifiedAt='2026-11-16';
 english.affiliateUrl='https://tracking.example.test/global-approved-reference';
 const result=marketPricesFor(rinzen.id,source);
 assert.ok(result.japanLinks.length>0&&result.internationalLinks.length>0);
 assert.ok(result.japanLinks.every(link=>new URL(link.url).hostname==='www.thebecos.com'));
 assert.ok(result.internationalLinks.every(link=>new URL(link.url).hostname==='en.thebecos.com'));
 assert.equal([...result.japanLinks,...result.internationalLinks].some(link=>link.url===english.affiliateUrl),false,'A plain cross-market reference cannot acquire the other language market’s affiliate URL.');
});

test('an off-merchant official URL cannot be used to pair a price with an unrelated checkout',()=>{
 const source=structuredClone(fixture(rinzen)) as Pick<Catalog,'products'|'links'|'merchants'>;
 for(const link of source.links)link.officialProductUrl='https://unrelated.example.test/products/other';
 const result=marketPricesFor(rinzen.id,source);
 assert.deepEqual(result.japanLinks,[]);assert.deepEqual(result.internationalLinks,[]);
});

function approvedMarketFixture(){
 const source=structuredClone(catalog);
 const english=source.links.find(link=>link.productId===rinzen.id&&link.locale==='en')!;
 const japanese=source.links.find(link=>link.productId===rinzen.id&&link.locale==='ja')!;
 const program=source.programs.find(program=>program.id===english.programId)!;
 program.applicationStatus='approved';program.affiliateAllowedHosts=['tracking.example.test'];
 english.applicationStatus='approved';english.affiliateLinkVerifiedAt='2026-11-16';english.affiliateUrl='https://tracking.example.test/global-approved-reference';
 const attributes=(link:typeof english,market:string,href=link.officialProductUrl!,advertised=false)=>({href,rel:advertised?'sponsored noopener noreferrer':'noopener noreferrer','data-sponsored':String(advertised),'data-purchase-market':market,'data-market-link-id':link.id});
 return {source,english,japanese,attributes};
}

test('generated-site market policy permits explicit ordinary cross-language references',()=>{
 const {source,english,japanese,attributes}=approvedMarketFixture();
 assert.equal(validateMarketRetailerAnchor(attributes(japanese,'japan'),'en',source).valid,true);
 assert.equal(validateMarketRetailerAnchor(attributes(english,'international'),'ja',source).valid,true);
});

test('generated-site market policy rejects English advertising on a Japanese cross-market reference',()=>{
 const {source,english,attributes}=approvedMarketFixture();
 assert.equal(validateMarketRetailerAnchor(attributes(english,'international',english.affiliateUrl!,true),'en',source).valid,true);
 assert.equal(validateMarketRetailerAnchor(attributes(english,'international',english.affiliateUrl!,true),'ja',source).valid,false);
 assert.equal(validateMarketRetailerAnchor(attributes(english,'international',english.affiliateUrl!,false),'ja',source).valid,false);
 assert.equal(validateMarketRetailerAnchor(attributes(english,'international'),'en',source).valid,false,'An in-language approved link must still use the common resolver.');
});

test('generated-site market labels cannot bypass the source ID, channel or exact official URL',()=>{
 const {source,english,japanese,attributes}=approvedMarketFixture();
 assert.equal(validateMarketRetailerAnchor({...attributes(japanese,'japan'),'data-market-link-id':'nonexistent-source'},'en',source).valid,false);
 assert.equal(validateMarketRetailerAnchor(attributes(english,'japan'),'en',source).valid,false);
 assert.equal(validateMarketRetailerAnchor(attributes(japanese,'international'),'en',source).valid,false);
 assert.equal(validateMarketRetailerAnchor(attributes(japanese,'japan','https://www.thebecos.com/products/a-different-product'),'en',source).valid,false);
 assert.equal(validateMarketRetailerAnchor({...attributes(japanese,'japan'),'data-purchase-market':'any-price'},'en',source).valid,false);
});
