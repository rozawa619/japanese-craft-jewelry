import test from 'node:test';
import assert from 'node:assert/strict';
import geometry from '../src/data/japan-map-geometry.json' with {type:'json'};
import {tourismRanking} from '../src/config/region-selection.ts';
import {travelRegions} from '../src/config/travel-areas.ts';
import {productsFor} from '../src/lib/catalog.ts';
import {productsForTravelPlace,travelAreasFor,travelAreaAnchor} from '../src/lib/travel-areas.ts';
import {visits} from '../src/lib/visits.ts';

test('travel navigation assigns all 47 prefectures exactly once',()=>{
 const grouped=travelRegions.flatMap(region=>region.prefectures);
 assert.equal(grouped.length,47);
 assert.deepEqual(new Set(grouped),new Set(geometry.prefectures.map(prefecture=>prefecture.id)));
 assert.deepEqual(travelRegions.find(region=>region.id==='metropolitan')?.prefectures,['tokyo','kanagawa','chiba','saitama']);
});

test('each tourism Top 10 prefecture has at least seven published local items',()=>{
 const products=productsFor('ja');
 for(const {prefectureId} of tourismRanking.destinations){
  const count=products.filter(product=>product.prefectureIds.includes(prefectureId)).length;
  assert.ok(count>=7, `${prefectureId} has ${count} published local items`);
 }
});

test('Hakone and Kamakura provide separate store-backed results',()=>{
 const selection=productsForTravelPlace(productsFor('en'),'kanagawa',['hakone-maruyama']);
 const areas=travelAreasFor('kanagawa',selection);
 const hakone=areas.find(area=>area.id==='hakone')!;
 const kamakura=areas.find(area=>area.id==='kamakura')!;
 assert.equal(travelAreaAnchor(hakone.id),'area-hakone');
 assert.ok(hakone.local.some(product=>product.id==='hamamatsuya-catch-pierced'));
 assert.ok(hakone.retailer.some(product=>product.id==='maruyama-pierced-c'));
 assert.ok(hakone.retailer.every(product=>!product.prefectureIds.includes('kanagawa')));
 assert.ok(kamakura.local.some(product=>product.id==='yogado-kamakura-bori-camellia-brooch'));
 assert.ok(kamakura.local.some(product=>product.id==='dahliacyan-openwork-moonstone-earrings'));
 assert.ok(!kamakura.local.some(product=>hakone.local.includes(product)));
 assert.deepEqual(kamakura.retailer,[]);
});

test('products without a verified store link remain in the prefecture and outside area refinements',()=>{
 const selection=productsForTravelPlace(productsFor(),'kanagawa',[]);
 const noHakoneStores={...visits,stores:visits.stores.filter(store=>store.id!=='hamamatsuya-hatajuku-main')};
 assert.ok(selection.local.some(product=>product.id==='hamamatsuya-catch-pierced'));
 assert.ok(!travelAreasFor('kanagawa',selection,noHakoneStores).some(area=>area.id==='hakone'));
 assert.ok(travelAreasFor('kanagawa',selection,noHakoneStores).some(area=>area.id==='kamakura'));
});
