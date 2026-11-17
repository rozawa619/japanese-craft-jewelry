import assert from 'node:assert/strict';

/** Shared by the full browser suite and a focused follow-up when metadata
 * changes. This checks HTML directives, never actual Google indexing. */
export async function assertPublicationMetadata(browser,{route,origin,base,publishMode,siteUrl}){
 const page=await browser.newPage(),results=[];
 try{
  for(const locale of ['en','ja']){
   assert.equal((await page.goto(route(locale))).status(),200);
   const robots=await page.locator('meta[name="robots"]').getAttribute('content');
   if(publishMode==='public'){
    assert.equal(robots,'index, follow, max-image-preview:large');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),new URL(base+locale+'/',siteUrl).href);
    assert.equal(await page.locator('link[hreflang]').count(),3);
    assert.equal(await page.locator('link[hreflang="x-default"]').getAttribute('href'),new URL(base+'en/',siteUrl).href);
    const ogImage=await page.locator('meta[property="og:image"]').getAttribute('content');assert.ok(ogImage?.startsWith(new URL(base,siteUrl).href));
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
   }else{
    assert.match(robots,/noindex/);assert.equal(await page.locator('link[rel="canonical"]').count(),0);
   }
   assert.equal((await page.request.get(route(locale,'objects/hamamatsuya-yosegi-kanzashi/'))).status(),404);
   assert.equal((await page.request.get(route(locale,'contact/'))).status(),404,'Deferred Contact route must return404.');
   results.push({locale,robots,canonical:await page.locator('link[rel="canonical"]').count()?await page.locator('link[rel="canonical"]').getAttribute('href'):null,withdrawnHairpin:404,contact:404});
  }
  return results;
 }finally{await page.close();}
}
