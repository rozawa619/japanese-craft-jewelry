import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalog} from '../src/lib/catalog.ts';
import {collectSelectionNoteErrors,selectionNotes,selectionNoteFor} from '../src/lib/selection-notes.ts';

const sources=JSON.parse(readFileSync(new URL('../docs/research/sources.json',import.meta.url),'utf8'));
function fixture(){
 const base=catalog.products.find(product=>product.publishStatus==='published')!;
 const names=['alpha','beta','gamma'];
 const products=names.map(name=>({...structuredClone(base),id:'test-'+name,sourceIds:['source-'+name],publishStatus:'published' as const}));
 const input=Object.fromEntries(products.map(product=>[product.id,{sourceIds:[...product.sourceIds],compareWith:products.filter(peer=>peer.id!==product.id).map(peer=>peer.id),en:{difference:'A specific material and form distinction.',chooseFor:'An editorial preference, not a wear test.'},ja:{difference:'素材とかたちによる違い。',chooseFor:'装いの提案であり、着用試験ではありません。'}}]));
 return {products,input,sources:names.map(name=>({id:'source-'+name}))};
}

test('the actual published selection has bilingual notes, sourced comparisons and no source mutation',()=>{
 const before=JSON.stringify({catalog,selectionNotes});
 assert.deepEqual(collectSelectionNoteErrors(selectionNotes,catalog,sources),[]);
 for(const product of catalog.products.filter(product=>product.publishStatus==='published')){
  for(const locale of ['en','ja'] as const){
   const note=selectionNoteFor(product.id,locale);
   assert.ok(note.difference.trim()&&note.chooseFor.trim());
   assert.ok(note.compareWith.length>=2&&note.compareWith.length<=3);
   assert.ok(note.sourceIds.every(id=>product.sourceIds.includes(id)));
  }
 }
 assert.equal(JSON.stringify({catalog,selectionNotes}),before);
});

test('choice notes cannot turn a draft or unknown product into a published comparison',()=>{
 const f=fixture();
 const draft={...structuredClone(f.products[0]),id:'test-draft',publishStatus:'draft' as const};
 f.input['test-alpha'].compareWith=['test-beta',draft.id];
 assert.ok(collectSelectionNoteErrors(f.input,{products:[...f.products,draft]},f.sources).length>0);
 f.input['test-alpha'].compareWith=['test-beta','test-missing'];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
});

test('self and duplicate comparisons cannot pad the selection with apparent alternatives',()=>{
 const f=fixture();
 f.input['test-alpha'].compareWith=['test-alpha','test-beta'];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
 f.input['test-alpha'].compareWith=['test-beta','test-beta'];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
});

test('a known source for another product cannot substantiate this product choice',()=>{
 const f=fixture();
 f.input['test-alpha'].sourceIds=['source-beta'];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
});

test('missing and invented sources fail rather than silently losing provenance',()=>{
 const f=fixture();
 f.input['test-alpha'].sourceIds=['source-not-researched'];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
 f.input['test-alpha'].sourceIds=[];
 assert.ok(collectSelectionNoteErrors(f.input,{products:f.products},f.sources).length>0);
});

test('every published product needs notes, while draft-only notes cannot create a route',()=>{
 const f=fixture();
 const absent=structuredClone(f.input);delete absent['test-gamma'];
 assert.ok(collectSelectionNoteErrors(absent,{products:f.products},f.sources).length>0);
 const draft={...structuredClone(f.products[0]),id:'test-draft',publishStatus:'draft' as const};
 const notes={...f.input,[draft.id]:structuredClone(f.input['test-alpha'])};
 assert.ok(collectSelectionNoteErrors(notes,{products:[...f.products,draft]},f.sources).length>0);
});

test('incomplete translations and URL-shaped IDs do not bypass the content schema',()=>{
 const f=fixture();
 const blank=structuredClone(f.input);blank['test-alpha'].ja.difference='  ';
 assert.ok(collectSelectionNoteErrors(blank,{products:f.products},f.sources).length>0);
 const external=structuredClone(f.input);external['test-alpha'].compareWith=['test-beta','https://unreviewed.example/item'];
 assert.ok(collectSelectionNoteErrors(external,{products:f.products},f.sources).length>0);
 const wrongShape={...f.input,'https://unreviewed.example/item':structuredClone(f.input['test-alpha'])};
 assert.ok(collectSelectionNoteErrors(wrongShape,{products:f.products},f.sources).length>0);
});

test('an unsourced product lookup fails explicitly rather than inventing generic choice copy',()=>{
 assert.throws(()=>selectionNoteFor('test-absent-product','en'));
});
