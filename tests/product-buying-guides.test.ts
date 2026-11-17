import test from 'node:test';
import assert from 'node:assert/strict';
import {collectBuyingGuideErrors,renderBuyingGuide} from '../src/lib/product-buying-guides.ts';
const product={id:'sample',publishStatus:'published',sourceIds:['official'],size:'9mm ornament',findings:'Silver fitting',fastening:'Hook'};
const guide={sourceIds:['official'],en:{questions:[{question:'Which part is measured?',answer:'The published dimensions are {size}; this describes the ornament.'},{question:'Which metal is specified?',answer:'The listed hardware is {findings}.'},{question:'How does it attach?',answer:'The fastening is {fastening}.'}]},ja:{questions:[{question:'どこの寸法？',answer:'公表寸法は{size}。モチーフの大きさを表します。'},{question:'どの金属？',answer:'金具の表記は{findings}です。'},{question:'どう留める？',answer:'留め方は{fastening}です。'}]}};
test('Buying questions follow a changed localized fact without copying its old number',()=>{
 assert.equal(renderBuyingGuide(guide,{...product,size:'装飾部の径9mm'},'ja').questions[0].answer,'公表寸法は装飾部の径9mm。モチーフの大きさを表します。');
 assert.match(renderBuyingGuide(guide,{...product,size:'12mm ornament'},'en').questions[0].answer,/12mm/);
});
test('Unknown or unsupported buying-guide facts cannot become filled specifications',()=>{
 assert.throws(()=>renderBuyingGuide(guide,{...product,size:null},'en'),/Unknown product fact/);
 const bad=structuredClone(guide);bad.en.questions[0].answer='{madeUp}';assert.throws(()=>renderBuyingGuide(bad,product,'en'),/Unsupported/);
});
test('Buying guides require exact published coverage and product-attached primary sources',()=>{
 assert.deepEqual(collectBuyingGuideErrors({sample:guide},[product],[{id:'official'}]),[]);
 assert.ok(collectBuyingGuideErrors({},[product],[{id:'official'}]).length);
 assert.ok(collectBuyingGuideErrors({sample:guide},[{...product,publishStatus:'draft'}],[{id:'official'}]).length);
 const bad=structuredClone(guide);bad.sourceIds=['unrelated'];assert.ok(collectBuyingGuideErrors({sample:bad},[product],[{id:'unrelated'}]).some(e=>e.includes('attached')));
});
test('Copied complete answers and separate price or URL masters are rejected',()=>{
 const bad=structuredClone(guide);bad.en.questions[1].answer=bad.en.questions[0].answer;assert.ok(collectBuyingGuideErrors({sample:bad},[product],[{id:'official'}]).some(e=>e.includes('Repeated complete')));
 bad.en.questions[1].answer='USD 200 at https://example.org';assert.ok(collectBuyingGuideErrors({sample:bad},[product],[{id:'official'}]).some(e=>e.includes('prices and URLs')));
});
