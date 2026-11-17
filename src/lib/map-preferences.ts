/** A functional map preference only: no identifier, advertising consent or CMP.
 * A new purpose/provider requires a new version and a fresh choice. */
export const MAP_PREFERENCE_KEY='jcj.map-choice.v1';
export const MAP_PREFERENCE_VERSION='2026-11-17-maps-v17';
export const MAP_PREFERENCE_TTL=30*24*60*60*1000;
export type MapChoice='allowed'|'denied';
export interface MapPreference{version:typeof MAP_PREFERENCE_VERSION;choice:MapChoice;savedAt:number;expiresAt:number}
export interface MapPreferenceStore{getItem(key:string):string|null;setItem(key:string,value:string):void;removeItem(key:string):void}
export function createMapPreference(choice:MapChoice,now=Date.now()):MapPreference{
 if(!['allowed','denied'].includes(choice)||!Number.isSafeInteger(now)||now<0||!Number.isSafeInteger(now+MAP_PREFERENCE_TTL))throw new Error('Invalid map preference');
 return {version:MAP_PREFERENCE_VERSION,choice,savedAt:now,expiresAt:now+MAP_PREFERENCE_TTL};
}
export function parseMapPreference(raw:unknown,now=Date.now()):MapPreference|null{
 if(typeof raw!=='string'||raw.length>300||!Number.isSafeInteger(now)||now<0)return null;
 try{
  const p:unknown=JSON.parse(raw);
  if(!p||typeof p!=='object'||Array.isArray(p))return null;
  const record=p as Record<string,unknown>;
  if(Object.keys(record).sort().join(',')!=='choice,expiresAt,savedAt,version'||record.version!==MAP_PREFERENCE_VERSION||(record.choice!=='allowed'&&record.choice!=='denied'))return null;
  const{savedAt,expiresAt}=record;
  if(typeof savedAt!=='number'||typeof expiresAt!=='number'||!Number.isSafeInteger(savedAt)||!Number.isSafeInteger(expiresAt)||savedAt<0||savedAt>now||expiresAt-savedAt!==MAP_PREFERENCE_TTL||expiresAt<=now)return null;
  return record as unknown as MapPreference;
 }catch{return null;}
}
export function readMapPreference(store:MapPreferenceStore|null,now=Date.now()):MapPreference|null{
 try{const raw=store?.getItem(MAP_PREFERENCE_KEY);const preference=parseMapPreference(raw,now);if(raw!==null&&raw!==undefined&&!preference)store?.removeItem(MAP_PREFERENCE_KEY);return preference;}catch{return null;}
}
export function saveMapPreference(store:MapPreferenceStore|null,preference:MapPreference):boolean{
 if(!store)return false;
 try{store.setItem(MAP_PREFERENCE_KEY,JSON.stringify(preference));return true;}catch{try{store.removeItem(MAP_PREFERENCE_KEY);}catch{}return false;}
}
/** Read-only storage must not resurrect an old permission after withdrawal.
 * Probe a separate transient key rather than rewriting a potentially newer
 * choice from another tab. No expiry is extended and no identifier is stored. */
export function restoreMapPreference(store:MapPreferenceStore|null,now=Date.now()):MapPreference|null{
 const preference=readMapPreference(store,now);if(!preference||!store)return null;
 const probe=MAP_PREFERENCE_KEY+'.check';
 try{store.setItem(probe,'1');store.removeItem(probe);return readMapPreference(store,now);}catch{try{store.removeItem(probe);store.removeItem(MAP_PREFERENCE_KEY);}catch{}return null;}
}
