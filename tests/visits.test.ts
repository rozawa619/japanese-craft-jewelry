import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../src/lib/catalog.ts';
import {collectVisitValidationErrors,officialProductLinks,storeMapLinks,visitGuideForProduct,type Visits} from '../src/lib/visits.ts';

const bilingual=(value:string)=>({en:value,ja:value});
const product=catalog.products.find(product=>product.publishStatus==='published')!;
const sources=[{id:'visit-test-source',access:'body_read'}];
function fixture():Visits{return {stores:[{id:'test-store',name:bilingual('A maker shop'),address:bilingual('1-2-3 Kyoto, Japan'),kind:'retail',officialUrl:'https://maker.test/',officialStoreUrl:'https://maker.test/access',hours:null,closedDays:null,access:null,visitSummary:bilingual('A source-checked shop.'),stockNote:bilingual('Individual item stock is not confirmed.'),mapQuery:'A maker shop 1-2-3 Kyoto, Japan',sourceIds:['visit-test-source'],checkedAt:'2026-11-16'}],products:[{productId:product.id,storeIds:['test-store'],officialHomeUrl:'https://maker.test/',officialHomeRole:'maker',sourceIds:['visit-test-source'],fallback:null,checkedAt:'2026-11-16'}]}}

test('official URLs remain ordinary and language-specific when another CTA is approved',()=>{
 const data=structuredClone(catalog),base=data.links.find(link=>link.productId===product.id)!;
 data.links=[{...base,id:'test-en',locale:'en',officialProductUrl:'https://official.test/item',affiliateUrl:'https://tracking.test/item',applicationStatus:'approved',affiliateLinkVerifiedAt:'2026-11-16'},{...base,id:'test-ja',locale:'ja',officialProductUrl:'https://official.test/ja/item'}];
 data.merchants=data.merchants.map(merchant=>merchant.id===base.merchantId?{...merchant,url:'https://official.test/'}:merchant);
 assert.deepEqual(officialProductLinks(product.id,'en',data).map(link=>link.url),['https://official.test/item']);
 assert.deepEqual(officialProductLinks(product.id,'ja',data).map(link=>link.url),['https://official.test/ja/item']);
 data.links[0].officialProductUrl='https://official.test.evil.test/item';
 assert.deepEqual(officialProductLinks(product.id,'en',data),[]);
});

test('Maps links encode the verified query at a fixed Google origin without exposing an origin location',()=>{
 const query='浜松屋 本店 神奈川県箱根町 & destination=https://evil.test/';
 const maps=storeMapLinks({mapQuery:query})!;
 for(const [action,value]of Object.entries(maps)){
  const url=new URL(value);assert.equal(url.origin,'https://www.google.com');assert.equal(url.searchParams.get('api'),'1');
  assert.equal(url.pathname,action==='search'?'/maps/search/':'/maps/dir/');
  assert.equal(url.searchParams.get(action==='search'?'query':'destination'),query);
  assert.equal(url.searchParams.has('origin'),false);
  assert.equal(url.searchParams.size,2);
 }
 assert.equal(storeMapLinks({mapQuery:''}),null);
 assert.equal(storeMapLinks({mapQuery:'bad\u0000query'}),null);
 assert.equal(storeMapLinks({mapQuery:'長'.repeat(600)}),null);
});

test('unconfirmed shops keep an online fallback and never acquire a guessed map',()=>{
 const data=fixture();data.products[0].storeIds=[];data.products[0].fallback=bilingual('Use the official website for current store options.');
 const guide=visitGuideForProduct(product.id,'en',catalog,data);
 assert.deepEqual(guide.stores,[]);assert.match(guide.fallback!,/official website/);assert.ok(guide.officialLinks.length>0);
 assert.deepEqual(collectVisitValidationErrors(data,{products:[product]},sources),[]);
 data.products[0].fallback=null;
 assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).some(error=>error.includes('honest online/store-guide fallback')));
});

test('store records need real dates, safe official links, sources and published-product references',()=>{
 const data=fixture();assert.deepEqual(collectVisitValidationErrors(data,{products:[product]},sources),[]);
 data.stores[0].checkedAt='2026-02-31';assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).length>0);
 data.stores[0].checkedAt='2026-11-16';data.stores[0].officialStoreUrl='javascript:alert(1)';assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).length>0);
 data.stores[0].officialStoreUrl='https://maker.test/access';data.stores[0].sourceIds=['unknown-source'];assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).some(error=>error.includes('unknown source')));
 data.stores[0].sourceIds=['visit-test-source'];data.products[0].storeIds=['invented-store'];assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).some(error=>error.includes('unknown store')));
 data.products=[];assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).some(error=>error.includes('Missing official/visit information')));
});

test('a search snippet alone cannot substantiate a visit and duplicate mappings fail',()=>{
 const data=fixture();
 assert.ok(collectVisitValidationErrors(data,{products:[product]},[{id:'visit-test-source',access:'search_snippet'}]).some(error=>error.includes('body-read')));
 data.products.push({...data.products[0]});
 assert.ok(collectVisitValidationErrors(data,{products:[product]},sources).some(error=>error.includes('Duplicate product visit')));
});
