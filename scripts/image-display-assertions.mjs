import assert from 'node:assert/strict';

/** Verify displayed source, accessible description and full-frame geometry.
 * This cannot identify a person or establish jewelry reproduction accuracy. */
export async function assertStylingFigure(figure,expected,locale,pageUrl){
 assert.equal(await figure.count(),1,'A styling slot must have exactly one reviewed figure.');
 assert.equal(await figure.getAttribute('data-editorial-asset'),expected.assetId);
 const img=figure.locator('img');assert.equal(await img.count(),1);
 assert.ok(new URL(await img.getAttribute('src'),pageUrl).pathname.endsWith('/'+expected.path));
 assert.equal(await img.getAttribute('alt'),expected.alt[locale]);
 assert.equal(await img.getAttribute('width'),String(expected.width));assert.equal(await img.getAttribute('height'),String(expected.height));
 await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());
 const actual=await img.evaluate(node=>{const box=node.getBoundingClientRect();return {naturalWidth:node.naturalWidth,naturalHeight:node.naturalHeight,width:box.width,height:box.height,objectFit:getComputedStyle(node).objectFit}});
 assert.deepEqual([actual.naturalWidth,actual.naturalHeight],[expected.width,expected.height]);
 assert.ok(actual.width>0&&actual.height>0,'Decoded imagery must have visible dimensions.');
 if(expected.preserveRatio){
  assert.equal(await figure.getAttribute('data-preserve-ratio'),'true');
  assert.ok(Math.abs(actual.width/actual.height-expected.width/expected.height)<0.025,'A full-frame composition was cropped or distorted by its parent layout: '+JSON.stringify(actual));
 }
 const caption=figure.locator('figcaption');assert.equal((await caption.innerText()).trim(),locale==='ja'?'AIイメージ':'AI image');assert.equal(await caption.isVisible(),true);
 return {assetId:expected.assetId,path:expected.path,fullFrame:expected.preserveRatio===true,...actual};
}

export async function assertPageStylingFigures(page,locale,registry){
 const records=[];
 for(const figure of await page.locator('figure[data-editorial-asset]').all()){
  const assetId=await figure.getAttribute('data-editorial-asset'),alt=await figure.locator('img').getAttribute('alt');
  const candidates=Object.values(registry).filter(image=>image.assetId===assetId&&image.alt[locale]===alt);
  assert.ok(candidates.length,'Rendered styling image must match reviewed asset/locale metadata: '+assetId);
  records.push(await assertStylingFigure(figure,candidates[0],locale,page.url()));
 }
 return records;
}
