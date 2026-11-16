import assert from 'node:assert/strict';

/** User-visible behavior, shared by local and deployed browser checks. */
export async function assertRegionSelection(page,locale,catalog){
 const published=catalog.products.filter(product=>product.publishStatus==='published');
 const selection=page.locator('[data-region-selection]');
 assert.equal(await selection.count(),1,'The selection needs one region directory.');
 const rows=selection.locator('[data-region-row]');
 assert.ok(await rows.count()>=6,'The region selection must retain the researched destinations.');
 const records=[];
 for(const row of await rows.all()){
  const prefectureId=await row.getAttribute('data-region-row');
  const count=published.filter(product=>product.prefectureIds.includes(prefectureId)).length;
  assert.ok(count>0,'Do not publish empty region rows: '+prefectureId);
  assert.equal(Number(await row.getAttribute('data-region-product-count')),count);
  const regionLink=row.locator('a[data-region-link]');
  const destination=new URL(await regionLink.getAttribute('href'),page.url());
  assert.ok(destination.pathname.endsWith('/'+locale+'/places/'+prefectureId+'/'),'Region names must open that region’s jewelry: '+destination.pathname);
  const piece=row.locator('[data-representative-product]');
  assert.equal(await piece.count(),1,'Each destination has one representative piece.');
  const productId=await piece.getAttribute('data-representative-product');
  const product=published.find(item=>item.id===productId);
  assert.ok(product?.prefectureIds.includes(prefectureId),'The representative must belong to its region.');
  const image=piece.locator('figure[data-editorial-asset]');
  assert.equal(await image.count(),1,'Each regional representative needs its reviewed AI image: '+prefectureId);
  assert.equal((await image.locator('figcaption').innerText()).trim(),locale==='ja'?'AIイメージ':'AI image');
  const productDestination=new URL(await piece.locator('.region-selection-image-link').getAttribute('href'),page.url());
  assert.ok(productDestination.pathname.endsWith('/'+locale+'/objects/'+product.slug+'/'));
  const left=await row.locator('.region-selection-copy').boundingBox(),right=await piece.boundingBox();
  assert.ok(left&&right&&left.x+left.width<=right.x+1,'Region must be on the left and representative on the right, including phones.');
  records.push({prefectureId,productId,count,rank:Number(await row.getAttribute('data-tourism-rank'))||null});
 }
 const ranks=records.filter(record=>record.rank!==null).map(record=>record.rank);
 assert.deepEqual([...ranks].sort((a,b)=>a-b),ranks,'Destinations must retain descending visit-rate order.');
 assert.equal(new Set(records.map(record=>record.prefectureId)).size,records.length);
 if(ranks.length)assert.equal(await selection.locator('[data-tourism-ranking-note]').count(),1,'Travel ranking needs an explicit metric/source note.');
 return {regions:records.length,ranked:ranks.length,rows:records,leftRegionRightPiece:true};
}
