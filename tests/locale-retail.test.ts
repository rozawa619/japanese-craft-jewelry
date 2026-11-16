import test from 'node:test';
import assert from 'node:assert/strict';
import japaneseText from '../src/data/translations/ja.json' with {type:'json'};
import {linksInLocale,policyForLink,resolveRetailerLink} from '../src/lib/affiliate.ts';
import {catalog,catalogFor,linksFor,price,sources} from '../src/lib/catalog.ts';
import type {RetailerLink} from '../src/lib/schema.ts';

test('shared destinations stay available while language-specific destinations do not cross languages',()=>{
 const links=[{id:'shared'},{id:'english',locale:'en'},{id:'japanese',locale:'ja'}];
 assert.deepEqual(linksInLocale(links,'en').map(link=>link.id),['shared','english']);
 assert.deepEqual(linksInLocale(links,'ja').map(link=>link.id),['shared','japanese']);
});

test('an approved English affiliate relationship cannot turn the Japanese ordinary destination into an advertisement',()=>{
 const en:RetailerLink={id:'en-only',productId:'test-piece',merchantId:'test-en',programId:'test-en-program',locale:'en',officialProductUrl:'https://english-shop.test/products/piece',affiliateUrl:'https://tracking.test/piece',applicationStatus:'approved',affiliateLinkVerifiedAt:'2026-11-16'};
 const ja:RetailerLink={id:'ja-only',productId:'test-piece',merchantId:'test-ja',programId:null,locale:'ja',officialProductUrl:'https://japanese-shop.test/products/piece',affiliateUrl:null,applicationStatus:'not_applied',affiliateLinkVerifiedAt:null};
 const fixtureCatalog={merchants:[{...catalog.merchants[0],id:'test-en',url:'https://english-shop.test/'},{...catalog.merchants[0],id:'test-ja',url:'https://japanese-shop.test/'}],programs:[{...catalog.programs[0],id:'test-en-program',applicationStatus:'approved' as const,merchantIds:['test-en'],affiliateAllowedHosts:['tracking.test']}]};
 const render=(locale:'en'|'ja')=>linksInLocale([en,ja],locale).map(link=>resolveRetailerLink(link,'approved',policyForLink(link,fixtureCatalog)));
 assert.deepEqual(render('en'),[{href:en.affiliateUrl,sponsored:true,rel:'sponsored noopener noreferrer'}]);
 assert.deepEqual(render('ja'),[{href:ja.officialProductUrl,sponsored:false,rel:'noopener noreferrer'}]);
 // Even accidental copied tracking fields cannot borrow the other storefront's program.
 const copied={...ja,affiliateUrl:en.affiliateUrl,applicationStatus:'approved' as const,affiliateLinkVerifiedAt:'2026-11-16'};
 assert.equal(resolveRetailerLink(copied,'approved',policyForLink(copied,fixtureCatalog))?.sponsored,false);
});

test('USD prices keep meaningful cents instead of rounding the researched price',()=>{
 const piece={...catalog.products[0],priceAmount:50.4,priceCurrency:'USD'};
 assert.equal(price(piece,'en').split(String.fromCharCode(160)).join(' '),'USD 50.40');
 assert.equal(price({...piece,priceAmount:4620,priceCurrency:'JPY'},'ja').split(String.fromCharCode(160)).join(' '),'JPY 4,620');
});

test('real BECOS products use sourced Japanese prices and a separate ordinary Japanese storefront destination',()=>{
 const items=catalog.products.filter(product=>product.publishStatus==='published'&&product.merchantIds.includes('becos-en'));
 assert.ok(items.length>0,'This integration guard must cover actual BECOS products.');
 const sourceById=new Map(sources.map(source=>[source.id,source]));
 const localized=catalogFor('ja');
 for(const item of items){
  const checked=item.localizedPrices?.ja;
  assert.ok(checked,item.id+': missing checked Japanese price');
  assert.equal(checked.currency,'JPY',item.id);
  assert.ok(checked.sourceIds.some(id=>sourceById.get(id)?.url.startsWith('https://www.thebecos.com/products/')),item.id+': Japanese price needs a Japanese product source');
  assert.ok(checked.sourceIds.every(id=>sourceById.has(id)),item.id+': price source is missing');
  const display=localized.products.find(product=>product.id===item.id)!;
  assert.deepEqual([display.priceAmount,display.priceCurrency,display.priceCheckedAt,display.taxNote],[checked.amount,checked.currency,checked.checkedAt,checked.taxNote],item.id+': Japanese display must use the checked source record');
  const text=(japaneseText.products as Record<string,Record<string,unknown>>)[item.id]||{};
  for(const field of ['priceAmount','priceCurrency','priceCheckedAt','localizedPrices'])assert.equal(Object.hasOwn(text,field),false,item.id+': price facts must not be duplicated in translations');
  const english=linksFor([item.id],'en').filter(link=>link.merchantId.startsWith('becos-'));
  const japanese=linksFor([item.id],'ja').filter(link=>link.merchantId.startsWith('becos-'));
  assert.ok(english.length>0&&japanese.length>0,item.id+': both storefront destinations are required');
  assert.ok(english.every(link=>link.locale==='en'&&new URL(link.officialProductUrl!).hostname==='en.thebecos.com'),item.id+': English users must reach the English store');
  assert.ok(japanese.every(link=>link.locale==='ja'&&new URL(link.officialProductUrl!).hostname==='www.thebecos.com'&&link.programId===null&&link.affiliateUrl===null),item.id+': Japanese users must reach the separate ordinary Japanese store');
 }
});
