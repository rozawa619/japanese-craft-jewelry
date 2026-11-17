import test from 'node:test';
import assert from 'node:assert/strict';
import {typeChoicesFor} from '../src/lib/type-choices.ts';

const piece=(id:string,prefectureIds:string[],productType:string[],publishStatus='published')=>({id,prefectureIds,productType,publishStatus});

test('Regional type representatives exclude earlier drafts and pieces from other regions',()=>{
 const products=[piece('draft',['tokyo'],['pierced-earrings'],'draft'),piece('other-region',['kanagawa'],['pierced-earrings']),piece('tokyo-ear',['tokyo'],['pierced-earrings']),piece('tokyo-necklace',['tokyo'],['necklace'])];
 const choices=typeChoicesFor(products,'tokyo');
 assert.deepEqual(choices.map(choice=>[choice.type,choice.representative.id]),[['pierced-earrings','tokyo-ear'],['necklace','tokyo-necklace']]);
 assert.deepEqual(choices.flatMap(choice=>choice.items.map(item=>item.id)),['tokyo-ear','tokyo-necklace']);
 assert.deepEqual(typeChoicesFor(products,'osaka'),[]);
 assert.deepEqual(typeChoicesFor(products,''),[]);
});

test('Each representative belongs to its own type and retains the supplied editorial order',()=>{
 const products=[piece('necklace',['tokyo'],['necklace']),piece('clip',['tokyo'],['clip-on-earrings']),piece('both-ear-types',['tokyo'],['pierced-earrings','clip-on-earrings'])];
 const choices=typeChoicesFor(products,'tokyo');
 assert.deepEqual(choices.map(choice=>choice.type),['necklace','clip-on-earrings','pierced-earrings']);
 assert.deepEqual(choices.map(choice=>choice.representative.id),['necklace','clip','both-ear-types']);
 assert.deepEqual(choices.find(choice=>choice.type==='clip-on-earrings')?.items.map(item=>item.id),['clip','both-ear-types']);
 for(const choice of choices){assert.ok(choice.items.includes(choice.representative));assert.ok(choice.representative.productType.includes(choice.type));}
});

test('Home type choices can span regions while keeping drafts and empty categories out',()=>{
 const products=[piece('kanagawa-ear',['kanagawa'],['pierced-earrings']),piece('tokyo-ear',['tokyo'],['pierced-earrings']),piece('osaka-bracelet',['osaka'],['bracelet']),piece('draft-ring',['nara'],['ring'],'draft')];
 const choices=typeChoicesFor(products);
 assert.deepEqual(choices.map(choice=>[choice.type,choice.items.length,choice.representative.id]),[['pierced-earrings',2,'kanagawa-ear'],['bracelet',1,'osaka-bracelet']]);
 assert.deepEqual(typeChoicesFor([]),[]);
});
