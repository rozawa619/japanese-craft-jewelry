import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewedMapEmbedUrl} from '../src/lib/map-embed-url.ts';
import {reviewedStoreMapEmbeds,storeMapEmbed} from '../src/lib/store-map-embeds.ts';
import {visits} from '../src/lib/visits.ts';

const permitted='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d139!3d35';

test('only the fixed public Share embed origin, path and pb query are accepted',()=>{
 assert.equal(reviewedMapEmbedUrl(permitted),permitted);
 for(const value of [null,undefined,{},'',permitted+'#fragment',permitted+'&key=secret',permitted+'&pb=!duplicate',permitted+'&q=shop',
  permitted.replace('https:','http:'),permitted.replace('www.google.com','www.google.com.evil.test'),permitted.replace('www.google.com','maps.google.com'),
  permitted.replace('www.google.com','user@www.google.com'),permitted.replace('www.google.com','www.google.com:444'),permitted.replace('/maps/embed','/maps/embed/v1/place'),
  permitted.replace('!1m18','%0A!1m18'),permitted+'%00',permitted+'<script>',permitted+'\n','javascript:alert(1)',
  'https://www.google.com/maps/embed?pb=short','https://www.google.com/maps/embed?pb=!'+'x'.repeat(4096)]){
  assert.equal(reviewedMapEmbedUrl(value),null,String(value));
 }
});

test('each sourced store has a reviewed selected-place embed in both languages; unknown stores have none',()=>{
 assert.deepEqual(Object.keys(reviewedStoreMapEmbeds).sort(),visits.stores.map(store=>store.id).sort());
 for(const store of visits.stores)for(const locale of ['en','ja']as const){
  const url=storeMapEmbed(store.id,locale);assert.ok(url,store.id+' '+locale);
  assert.equal(new URL(url).origin,'https://www.google.com');
  assert.match(new URL(url).searchParams.get('pb')!,/!3m3!1m2!1s/,'A selected place, rather than a broad text-query overview, is required.');
 }
 assert.equal(storeMapEmbed('unreviewed-store','ja'),null);
});
