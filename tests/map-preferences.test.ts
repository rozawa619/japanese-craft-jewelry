import test from 'node:test';
import assert from 'node:assert/strict';
import{MAP_PREFERENCE_KEY,MAP_PREFERENCE_TTL,createMapPreference,parseMapPreference,readMapPreference,saveMapPreference,restoreMapPreference}from'../src/lib/map-preferences.ts';
const now=1800000000000;
test('Only a current explicit map choice authorizes automatic display',()=>{
 for(const choice of ['allowed','denied'] as const){const p=createMapPreference(choice,now);assert.equal(parseMapPreference(JSON.stringify(p),now+1)?.choice,choice);assert.equal(p.expiresAt,now+MAP_PREFERENCE_TTL);}
 for(const raw of [undefined,null,'','{}','null','[]','true','{"choice":"allowed"}','x'.repeat(301)])assert.equal(parseMapPreference(raw,now),null);
});
test('Expired, future, other-purpose and altered preference records cannot enable a map',()=>{
 const good=createMapPreference('allowed',now);
 for(const patch of [{version:'old'},{choice:'advertising'},{choice:['allowed']},{savedAt:now+1},{expiresAt:good.expiresAt+1},{savedAt:-1},{savedAt:1.5},{extra:'tracking'},{expiresAt:null}])assert.equal(parseMapPreference(JSON.stringify({...good,...patch}),now),null);
 assert.equal(parseMapPreference(JSON.stringify(good),good.expiresAt),null);
 assert.equal(parseMapPreference(JSON.stringify(good),now+MAP_PREFERENCE_TTL+1),null);
});
test('The map preference stores only a version, a choice and an expiry, and refusal replaces permission',()=>{
 const map=new Map<string,string>();const store={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:(k:string)=>{map.delete(k);}};
 assert.equal(readMapPreference(store,now),null);
 assert.equal(saveMapPreference(store,createMapPreference('allowed',now)),true);
 assert.deepEqual([...map.keys()],[MAP_PREFERENCE_KEY]);
 assert.deepEqual(Object.keys(JSON.parse(map.get(MAP_PREFERENCE_KEY)!)).sort(),['choice','expiresAt','savedAt','version']);
 assert.equal(readMapPreference(store,now)?.choice,'allowed');
 saveMapPreference(store,createMapPreference('denied',now+10));assert.equal(readMapPreference(store,now+10)?.choice,'denied');
 assert.equal(readMapPreference(store,now+10+MAP_PREFERENCE_TTL),null);assert.equal(map.has(MAP_PREFERENCE_KEY),false);
});
test('Blocked or malformed browser storage fails closed without breaking the page',()=>{
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
 assert.equal(readMapPreference(blocked,now),null);assert.equal(saveMapPreference(blocked,createMapPreference('allowed',now)),false);
 assert.equal(readMapPreference(null,now),null);assert.equal(saveMapPreference(null,createMapPreference('allowed',now)),false);
 assert.equal(readMapPreference({...blocked,getItem:()=>'{bad'},now),null);
});
test('Read-only storage never revives a previous allow; a restore cannot overwrite another tab withdrawal',()=>{
 const map=new Map([[MAP_PREFERENCE_KEY,JSON.stringify(createMapPreference('allowed',now))]]);
 const store={getItem:(k:string)=>map.get(k)??null,setItem(){throw Error('Quota or read-only');},removeItem:(k:string)=>{map.delete(k);}};
 assert.equal(restoreMapPreference(store,now),null);assert.equal(map.has(MAP_PREFERENCE_KEY),false);
 map.set(MAP_PREFERENCE_KEY,JSON.stringify(createMapPreference('allowed',now)));
 assert.equal(saveMapPreference(store,createMapPreference('denied',now)),false);assert.equal(map.has(MAP_PREFERENCE_KEY),false);
 const writable={...store,setItem:(k:string,v:string)=>{map.set(k,v);}};
 map.set(MAP_PREFERENCE_KEY,JSON.stringify(createMapPreference('allowed',now)));
 assert.equal(restoreMapPreference(writable,now+1)?.savedAt,now);assert.deepEqual([...map.keys()],[MAP_PREFERENCE_KEY]);
 const concurrent={...writable,setItem:(k:string,v:string)=>{map.set(k,v);if(k.endsWith('.check'))map.set(MAP_PREFERENCE_KEY,JSON.stringify(createMapPreference('denied',now+1)));}};
 assert.equal(restoreMapPreference(concurrent,now+1)?.choice,'denied');
});
