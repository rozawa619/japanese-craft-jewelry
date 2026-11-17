import test from 'node:test';
import assert from 'node:assert/strict';
import {collectValidationErrors,loadProjectData} from '../scripts/validate.ts';

test('published jewelry cannot lose either localized decision while keeping a valid product story',()=>{
 const original=loadProjectData();
 const product=original.catalog.products.find(product=>product.publishStatus==='published')!;
 for(const locale of ['en','ja']){
  const data=structuredClone(original);
  delete data.stories[product.id][locale].decision;
  assert.ok(collectValidationErrors(data).includes('stories: localized decision required for '+product.id+'/'+locale));
 }
});

test('empty or unexpected decision data is rejected before publishing',()=>{
 const original=loadProjectData();
 const product=original.catalog.products.find(product=>product.publishStatus==='published')!;
 for(const decision of [{bestFor:'  ',consider:'A concrete comparison'},{bestFor:'A particular taste',consider:''},{bestFor:'A particular taste',consider:'A concrete comparison',rating:5},['A particular taste','A comparison']]){
  const data=structuredClone(original);
  data.stories[product.id].en.decision=decision;
  assert.ok(collectValidationErrors(data).some(error=>error.startsWith('stories:')&&error.includes('decision')&&error.includes(product.id+'/en')));
 }
});
