import test from 'node:test';
import assert from 'node:assert/strict';
import {collectPurchaseEvidenceErrors,type PurchaseEvidence} from '../src/lib/purchase-evidence.ts';
import type {Catalog} from '../src/lib/schema.ts';
import type {Visits} from '../src/lib/visits.ts';

// Entirely internal fixtures. These identifiers, prices and shops never enter
// the public catalog, source registry, site routes or deployment configuration.
function fixture(){
 const product:Catalog['products'][number]={id:'test-jewelry',slug:'test-jewelry',locale:'en',title:'Internal test item',originalTitle:'Internal test item',publishStatus:'published',productType:['pierced-earrings'],prefectureIds:[],craftIds:['test-craft'],materialIds:[],makerId:'test-maker',craftClassification:{label:'Test fixture only',sourceIds:['test-item-source']},size:null,weightPerPieceGrams:null,findings:null,fastening:null,priceAmount:8800,priceCurrency:'JPY',priceCheckedAt:'2026-11-16',taxNote:'Internal fixture only',availability:'in_stock',merchantIds:['test-merchant'],sourceIds:['test-item-source'],lastVerifiedAt:'2026-11-16',imageAssetIds:[],editorialSummary:'Internal fixture only',whoItMaySuit:'Internal fixture only',whatToCheck:['Internal fixture only']};
 const catalog:Pick<Catalog,'products'|'links'|'merchants'>={products:[product],links:[{id:'test-official-link',productId:product.id,merchantId:'test-merchant',programId:null,officialProductUrl:'https://maker.example/items/test-jewelry',affiliateUrl:null,applicationStatus:'not_applied',affiliateLinkVerifiedAt:null}],merchants:[{id:'test-merchant',name:'Internal fixture merchant',url:'https://maker.example/',language:'en',shipping:{status:'unknown',summary:'Internal fixture only',countries:null,sourceIds:['test-item-source']},returns:'Internal fixture only',sourceIds:['test-item-source']}]};
 const evidence:PurchaseEvidence={products:[{productId:product.id,checkedAt:'2026-11-16',kind:'online-order',linkId:'test-official-link',storeIds:[],sourceIds:['test-item-source']}]};
 const visits:Visits={stores:[{id:'test-store',name:{en:'Internal fixture shop',ja:'内部試験用店舗'},address:{en:'Internal test address, not a real shop',ja:'実在しない内部試験用住所'},kind:'retail',officialUrl:'https://maker.example/',officialStoreUrl:'https://maker.example/store-guide',hours:null,closedDays:null,access:null,visitSummary:{en:'Internal test record',ja:'内部試験データ'},stockNote:{en:'Internal test record',ja:'内部試験データ'},mapQuery:'INTERNAL TEST RECORD',sourceIds:['test-store-source'],checkedAt:'2026-11-16'}],products:[{productId:product.id,storeIds:['test-store'],officialHomeUrl:'https://maker.example/',officialHomeRole:'maker',sourceIds:['test-item-source','test-store-source'],fallback:null,checkedAt:'2026-11-16'}]};
 const sources=[{id:'test-item-source',url:'https://maker.example/items/test-jewelry',access:'body_read'},{id:'test-store-source',url:'https://maker.example/store-guide',access:'body_read'},{id:'test-unrelated-source',url:'https://maker.example/items/another-product',access:'body_read'}];
 return {catalog,evidence,visits,sources};
}
const errors=(f:ReturnType<typeof fixture>)=>collectPurchaseEvidenceErrors(f.evidence,f.catalog,f.visits,f.sources);

test('a researched product-specific online route is accepted without mutating the records',()=>{
 const f=fixture(),before=JSON.stringify(f);assert.deepEqual(errors(f),[]);assert.equal(JSON.stringify(f),before);
});

test('a bilingual listing selection must be supported by the exact official page',()=>{
 const f=fixture();
 const option={sourceId:'test-item-source',label:{ja:'内部試験用',en:'Internal option'}};
 f.evidence.products[0].listingSelection=option;
 assert.deepEqual(errors(f),[]);
 f.evidence.products[0].sourceIds.push('test-unrelated-source');
 f.catalog.products[0].sourceIds.push('test-unrelated-source');
 option.sourceId='test-unrelated-source';
 assert.match(errors(f).join('\n'),/Listing selection needs its verified product or catalog source/);
 option.sourceId='test-item-source';
 option.label.en=' ';
 assert.match(errors(f).join('\n'),/listingSelection.label.en/);
});

test('a priced catalog can support retail only with its product-linked current store evidence',()=>{
 const f=fixture();f.evidence.products[0].kind='retail-and-catalog';f.evidence.products[0].storeIds=['test-store'];f.evidence.products[0].sourceIds.push('test-store-source');f.catalog.links[0].officialProductUrl='https://maker.example/catalog/accessories.html';f.sources[0].url=f.catalog.links[0].officialProductUrl;assert.deepEqual(errors(f),[]);
 f.evidence.products[0].storeIds=[];assert.ok(errors(f).length>0);
});

test('a search snippet, unread page or nonexistent source cannot substantiate ordering',()=>{
 for(const access of ['search_snippet','unread','access_error']){const f=fixture();f.sources[0].access=access;assert.ok(errors(f).length>0)}
 const f=fixture();f.evidence.products[0].sourceIds=['test-unreviewed-source'];assert.ok(errors(f).length>0);
});

test('another product source cannot be relabeled as this item even when both sources were read',()=>{
 const f=fixture();f.evidence.products[0].sourceIds=['test-unrelated-source'];assert.ok(errors(f).length>0);
 f.catalog.products[0].sourceIds.push('test-unrelated-source');assert.ok(errors(f).length>0,'The same merchant host is insufficient without the actual matching product page.');
});

test('a different product link and an off-merchant destination cannot pass the gate',()=>{
 const f=fixture();f.catalog.links[0].productId='test-other-product';assert.ok(errors(f).length>0);
 const other=fixture();other.catalog.links[0].officialProductUrl='https://maker.example.attacker.test/items/test-jewelry';other.sources[0].url=other.catalog.links[0].officialProductUrl;assert.ok(errors(other).length>0);
});

test('unsafe protocols and embedded credentials never become an official order route',()=>{
 for(const url of ['http://maker.example/items/test-jewelry','https://username:password@maker.example/items/test-jewelry','javascript:alert(1)']){const f=fixture();f.catalog.links[0].officialProductUrl=url;f.sources[0].url=url;assert.ok(errors(f).length>0)}
});

test('catalog-only, unrelated-store and unsubstantiated-store claims fail separately',()=>{
 const f=fixture();f.evidence.products[0].kind='retail-and-catalog';assert.ok(errors(f).length>0);
 f.evidence.products[0].storeIds=['test-missing-store'];assert.ok(errors(f).length>0);
 f.evidence.products[0].storeIds=['test-store'];f.evidence.products[0].sourceIds.push('test-store-source');f.visits.products[0].storeIds=[];assert.ok(errors(f).length>0);
 f.visits.products[0].storeIds=['test-store'];f.evidence.products[0].sourceIds=['test-item-source'];assert.ok(errors(f).length>0);
});

test('an explicitly out-of-stock or draft product is not rescued by an old purchase record',()=>{
 const f=fixture();f.catalog.products[0].availability='out_of_stock';assert.ok(errors(f).length>0);
 f.catalog.products[0].availability='in_stock';f.catalog.products[0].publishStatus='draft';assert.ok(errors(f).length>0);
});

test('missing and duplicate product evidence cannot pad or bypass published coverage',()=>{
 const f=fixture();f.evidence.products=[];assert.ok(errors(f).length>0);
 const duplicate=fixture();duplicate.evidence.products.push(structuredClone(duplicate.evidence.products[0]));assert.ok(errors(duplicate).length>0);
});

test('invalid calendar dates and empty sources are rejected',()=>{
 const f=fixture();f.evidence.products[0].checkedAt='2026-02-31';assert.ok(errors(f).length>0);
 f.evidence.products[0].checkedAt='2026-11-16';f.evidence.products[0].sourceIds=[];assert.ok(errors(f).length>0);
});

test('home, about and gallery-only pages cannot be promoted to active product ordering',()=>{
 for(const path of ['/','/?utm_source=sample','/about','/gallery','/company','/contact','/collections/accessories','/view/category/accessories']){const f=fixture();f.catalog.links[0].officialProductUrl='https://maker.example'+path;f.sources[0].url=f.catalog.links[0].officialProductUrl;assert.ok(errors(f).length>0,path+' is not an item ordering page')}
});

test('a source-matched product-specific query is distinguishable from a bare homepage',()=>{
 const f=fixture();f.catalog.links[0].officialProductUrl='https://maker.example/?pid=test-jewelry';f.sources[0].url='https://maker.example/?pid=test-jewelry';assert.deepEqual(errors(f),[]);
 f.sources[0].url='https://maker.example/?pid=another-product';assert.ok(errors(f).length>0);
});

test('a collection breadcrumb does not make a specific Shopify product a category-only page',()=>{
 const f=fixture();f.catalog.links[0].officialProductUrl='https://maker.example/collections/accessories/products/test-jewelry';f.sources[0].url=f.catalog.links[0].officialProductUrl;assert.deepEqual(errors(f),[]);
});

test('a query that identifies another SKU does not count as the same product source',()=>{
 const f=fixture();f.catalog.links[0].officialProductUrl='https://maker.example/item.php?id=test-jewelry';f.sources[0].url='https://maker.example/item.php?id=another-product';assert.ok(errors(f).length>0);
});

test('currency and tracking decoration do not erase a genuinely matching product source',()=>{
 const f=fixture();f.sources[0].url='https://maker.example/items/test-jewelry/?currency=JPY&utm_source=example';assert.deepEqual(errors(f),[]);
 f.catalog.links[0].officialProductUrl='https://maker.example/item.php?id=test-jewelry&option=gold';f.sources[0].url='https://maker.example/item.php?option=gold&id=test-jewelry';assert.deepEqual(errors(f),[]);
});
