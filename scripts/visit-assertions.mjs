import assert from 'node:assert/strict';
import {officialProductLinks,storeMapLinks} from '../src/lib/visits.ts';

/** Read only: inspect external URLs without opening Maps or a retailer. */
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
  assert.ok((await link.innerText()).includes(expected.url),'The full official URL should be visible text.');
  assert.equal(await link.isVisible(),true);
 }
 const home=section.locator('a[data-official-home-url]');assert.equal(await home.count(),entry.officialHomeUrl?1:0);
 if(entry.officialHomeUrl){assert.equal(await home.getAttribute('href'),new URL(entry.officialHomeUrl).href);assert.equal(await home.getAttribute('data-official-home-role'),entry.officialHomeRole);assert.ok((await home.innerText()).includes(new URL(entry.officialHomeUrl).href))}
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
 }
 if(!entry.storeIds.length){assert.equal(await section.locator('[data-map-action]').count(),0);assert.equal(await section.locator('[data-store-fallback]').isVisible(),true);assert.ok((await section.locator('[data-store-fallback]').innerText()).includes(entry.fallback[locale]))}
 for(const link of await section.locator('a[target="_blank"]').all()){
  const rel=(await link.getAttribute('rel')||'').split(/\s+/);assert.ok(rel.includes('noopener')&&rel.includes('noreferrer'));assert.equal(rel.includes('sponsored'),false,'Explicit official/visit links must stay ordinary even when a separate CTA is an ad.');
 }
 assert.equal(await section.locator('iframe,script').count(),0,'Maps should remain external links, without an embed or external script.');
 return {officialProductLinks:expectedLinks.length,homeRole:entry.officialHomeRole,stores:entry.storeIds,storeFallback:!entry.storeIds.length,mapsRemainExternal:true};
}
