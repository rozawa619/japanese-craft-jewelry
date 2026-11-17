import assert from 'node:assert/strict';
import {officialProductLinks,storeMapLinks} from '../src/lib/visits.ts';
import {storeMapEmbed} from '../src/lib/store-map-embeds.ts';

/** Read only: inspect names, safe destinations and unactivated Maps without opening Google or a retailer. */
export async function assertVisitGuide(page,product,locale,catalog,visits){
 const entry=visits.products.find(entry=>entry.productId===product.id);assert.ok(entry,'Every published product needs sourced visit/official information.');
 const section=page.locator('[data-visit-guide]');assert.equal(await section.count(),1);
 assert.equal(await section.isVisible(),true);assert.equal(await section.getAttribute('data-visit-status'),entry.storeIds.length?'confirmed-stores':'unconfirmed-store');
 assert.equal(await page.locator('.purchase-outfit').evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('[data-visit-guide]'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 assert.equal(await section.evaluate(node=>!!(node.compareDocumentPosition(document.querySelector('.purchase-next'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 const expectedLinks=officialProductLinks(product.id,locale,catalog),official=section.locator('a[data-official-product-url]');
 assert.equal(await official.count(),expectedLinks.length);assert.ok(expectedLinks.length>0);
 for(const expected of expectedLinks){
  const link=section.locator('a[data-official-product-url="'+expected.id+'"]');
  assert.equal(await link.getAttribute('href'),expected.url);
  assert.ok((await link.innerText()).trim().length>5,'The official destination needs a meaningful link name.');
  assert.equal(/https?:\/\//i.test(await link.innerText()),false,'Raw URLs should not replace a readable link name.');
  assert.equal(await link.isVisible(),true);
 }
 const home=section.locator('a[data-official-home-url]');assert.equal(await home.count(),entry.officialHomeUrl?1:0);
 if(entry.officialHomeUrl){assert.equal(await home.getAttribute('href'),new URL(entry.officialHomeUrl).href);assert.equal(await home.getAttribute('data-official-home-role'),entry.officialHomeRole);assert.equal(/https?:\/\//i.test(await home.innerText()),false);assert.ok((await home.innerText()).trim().length>5)}
 const stores=section.locator('[data-store-id]');assert.equal(await stores.count(),entry.storeIds.length);
 for(const id of entry.storeIds){
  const source=visits.stores.find(store=>store.id===id),store=section.locator('[data-store-id="'+id+'"]');assert.ok(source);
  const text=await store.innerText();
  for(const field of ['name','address','visitSummary','stockNote'])assert.ok(text.includes(source[field][locale]),id+' '+field);
  for(const field of ['hours','closedDays','access'])if(source[field])assert.ok(text.includes(source[field][locale]),id+' '+field);
  assert.ok(text.includes(source.checkedAt));assert.equal(await store.locator('.visit-stock-note').isVisible(),true,'Pre-visit stock/contact guidance must stay visible.');
  assert.equal(await store.locator('[data-store-official-url]').getAttribute('href'),new URL(source.officialStoreUrl).href);
  const maps=storeMapLinks(source);assert.ok(maps);
  for(const action of ['search','directions']){
   const link=store.locator('[data-map-action="'+action+'"]');assert.equal(await link.getAttribute('href'),maps[action]);assert.equal(await link.isVisible(),true);
   const url=new URL(await link.getAttribute('href'));assert.equal(url.origin,'https://www.google.com');assert.equal(url.searchParams.get('api'),'1');assert.equal(url.searchParams.get(action==='search'?'query':'destination'),source.mapQuery);assert.equal(url.searchParams.has('origin'),false);
  }
  const embed=storeMapEmbed(id,locale),inline=store.locator('[data-inline-map]');
  assert.equal(await inline.count(),embed?1:0);
  if(embed){
   assert.equal(await inline.getAttribute('data-map-embed'),embed);
   assert.equal(await inline.locator('[data-load-map]').isVisible(),true);
   assert.equal(await inline.locator('[data-load-map]').getAttribute('aria-expanded'),'false');
   assert.equal(await inline.locator('[data-map-canvas]').isHidden(),true);
   assert.equal(await inline.locator('[data-close-map]').isHidden(),true);
   assert.equal(await inline.locator('iframe[src]').count(),0,'An explicit map action is required before Google receives an iframe request.');
  }
 }
 if(!entry.storeIds.length){assert.equal(await section.locator('[data-map-action]').count(),0);assert.equal(await section.locator('[data-store-fallback]').isVisible(),true);assert.ok((await section.locator('[data-store-fallback]').innerText()).includes(entry.fallback[locale]))}
 for(const link of await section.locator('a[target="_blank"]').all()){
  const rel=(await link.getAttribute('rel')||'').split(/\s+/);assert.ok(rel.includes('noopener')&&rel.includes('noreferrer'));assert.equal(rel.includes('sponsored'),false,'Explicit official/visit links must stay ordinary even when a separate CTA is an ad.');
 }
 assert.equal(await section.locator('iframe[src],script[src^="https:"]').count(),0,'No Google iframe or external script should load before the map action.');
 return {officialProductLinks:expectedLinks.length,homeRole:entry.officialHomeRole,stores:entry.storeIds,storeFallback:!entry.storeIds.length,mapChoiceBeforeConnection:true,mapsExternalFallback:true};
}
