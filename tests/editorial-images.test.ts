import test from 'node:test';
import assert from 'node:assert/strict';
import {collectEditorialImageErrors} from '../src/lib/editorial-images.ts';
const image={assetId:'ai-test-style',path:'images/test-style.webp',width:1536,height:1024,preserveRatio:true,alt:{en:'AI styling illustration of a fictional adult.',ja:'架空の成人によるAIイメージ。'}};
const products=[{id:'published-one',publishStatus:'published'},{id:'published-two',publishStatus:'published'},{id:'draft-one',publishStatus:'draft'}];
const assets=[{id:image.assetId,source:'public/'+image.path,productImage:false,status:'active',rightsHolder:'Project AI output',permissionBasis:'Explicit fictional-model generation request'}];
const registry=()=>({'published-one':structuredClone(image),'published-two':structuredClone(image)});

test('intentional shared styling images retain consistent metadata and cover published jewelry only',()=>{
 assert.deepEqual(collectEditorialImageErrors(registry(),products,assets),[]);
});
test('a missing published image is not silently treated as full coverage',()=>{
 const data=registry();delete (data as Partial<typeof data>)['published-two'];
 assert.ok(collectEditorialImageErrors(data,products,assets).some(error=>error.includes('published-two')));
 assert.deepEqual(collectEditorialImageErrors(data,products,assets,false),[]);
});
test('remote, traversal and mixed-case image paths cannot bypass the reviewed local registry',()=>{
 for(const path of ['https://retailer.test/photo.webp','images/../secret.png','images/nested/photo.png','images/Model.webp']){
  const data=registry();data['published-one'].path=path;
  assert.ok(collectEditorialImageErrors(data,products,assets).some(error=>error.includes('local image path')));
 }
});
test('retired or photograph entries cannot be rebound as active styling assets',()=>{
 for(const ledger of [[{...assets[0],status:'retired'}],[{...assets[0],productImage:true}],[]])assert.ok(collectEditorialImageErrors(registry(),products,ledger).some(error=>error.includes('ledger')));
});
test('dimensions, translations and crop flags must remain usable',()=>{
 const data=registry();data['published-one'].width=0;data['published-one'].alt.ja=' ';
 (data['published-one'] as unknown as Record<string,unknown>).preserveRatio='yes';
 const errors=collectEditorialImageErrors(data,products,assets);
 assert.ok(errors.some(error=>error.includes('width')));assert.ok(errors.some(error=>error.includes('ja alt')));assert.ok(errors.some(error=>error.includes('preserveRatio')));
});
test('draft images and conflicting aliases cannot enter the active selection',()=>{
 const data={...registry(),'draft-one':structuredClone(image)};data['published-two'].height=1000;
 const errors=collectEditorialImageErrors(data,products,assets);
 assert.ok(errors.some(error=>error.includes('only published')));assert.ok(errors.some(error=>error.includes('conflicting metadata')));
});
