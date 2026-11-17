import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalPageUrl,pageSearchData,productSearchMetadata} from '../src/lib/seo.ts';
import {serializeJsonLd} from '../src/lib/structured-data.ts';

test('filter and tracking states share one same-origin canonical without discarding its base path',()=>{
 assert.equal(canonicalPageUrl('https://example.com','/japanese-craft-jewelry/en/objects/?material=glass&utm_source=test#all-jewelry'),'https://example.com/japanese-craft-jewelry/en/objects/');
 for(const origin of ['http://example.com','https://user:pass@example.com','https://localhost','https://127.0.0.1'])assert.throws(()=>canonicalPageUrl(origin,'/en/'));
 assert.throws(()=>canonicalPageUrl('https://example.com','https://another.example/en/'));
});

test('editorial jewellery structured data identifies AI imagery without inventing product offers or reviews',()=>{
 const canonical='https://example.com/japanese-craft-jewelry/en/objects/one/';
 const data=pageSearchData({canonical,title:'A glass earring',description:'A source-based selection.',locale:'en',subjectName:'The verified product',image:{url:'https://example.com/japanese-craft-jewelry/images/one.webp',width:1536,height:1024,description:'AI styling illustration of a fictional adult woman.'},breadcrumbs:[{name:'The selection',url:'https://example.com/japanese-craft-jewelry/en/objects/'},{name:'A glass earring',url:canonical}]});
 const page=data['@graph'][0];
 assert.equal(page['@type'],'WebPage');assert.deepEqual(page.about,{'@type':'Thing',name:'The verified product'});
 assert.deepEqual(page.primaryImageOfPage,{'@type':'ImageObject','@id':canonical+'#styling-image',contentUrl:'https://example.com/japanese-craft-jewelry/images/one.webp',url:'https://example.com/japanese-craft-jewelry/images/one.webp',width:1536,height:1024,caption:'AI image',description:'AI styling illustration of a fictional adult woman.',digitalSourceType:'https://schema.org/TrainedAlgorithmicMediaDigitalSource'});
 assert.equal(data['@graph'][1]['@type'],'BreadcrumbList');
 assert.doesNotMatch(JSON.stringify(data),/"(?:offers|review|aggregateRating|price|availability|license|copyrightNotice|author)"/);
 assert.equal(Object.hasOwn(page,'dateModified'),false,'A product fact-check date must not silently become a page-modified date.');
});

test('image and breadcrumb metadata cannot point to another origin or invent a missing page image',()=>{
 const input={canonical:'https://example.com/ja/objects/one/',title:'工芸の耳飾り',description:'独自のセレクト。',locale:'ja' as const};
 const data=pageSearchData(input);assert.equal(data['@graph'].length,1);assert.equal(Object.hasOwn(data['@graph'][0],'primaryImageOfPage'),false);
 assert.throws(()=>pageSearchData({...input,breadcrumbs:[{name:'外部',url:'https://different.example/'}]}));
 assert.throws(()=>pageSearchData({...input,image:{url:'https://different.example/one.webp',width:1,height:1,description:'Unknown'}}));
 assert.throws(()=>pageSearchData({...input,image:{url:'https://example.com/one.webp',width:0,height:1,description:'Unknown'}}));
});

test('search summaries stay localized, preserve official names and do not break dotted brand names',()=>{
 const product={title:'6.KILN porcelain earrings',editorialSummary:'A porcelain half-moon hangs from a tassel. Consider its long shape.'};
 const en=productSearchMetadata(product,'en','Imari-Arita porcelain');assert.equal(en.title,product.title);assert.match(en.description,/^A porcelain half-moon hangs from a tassel\./);assert.match(en.description,/Japanese jewellery/);assert.doesNotMatch(en.description,/free shipping|best|tested|reviewed/i);
 const ja=productSearchMetadata({title:'白磁の耳飾り',editorialSummary:'白磁の形を選ぶ耳飾り。'},'ja','有田焼');assert.match(ja.description,/有田焼/);assert.match(ja.description,/公式/);
 const escaped=serializeJsonLd(pageSearchData({canonical:'https://example.com/en/',locale:'en',title:'</script><script>x</script>',description:'A & B'}));assert.equal(/[<>&]/.test(escaped),false);assert.equal(JSON.parse(escaped)['@graph'][0].headline,'</script><script>x</script>');
});
