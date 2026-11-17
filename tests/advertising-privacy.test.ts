import test from 'node:test';
import assert from 'node:assert/strict';
import {advertisingPrivacy,assertAdvertisingPrivacyLock} from '../src/lib/advertising-privacy.ts';
test('Unconfigured advertising remains off without generating a fake CMP or publisher identity',()=>{
 assert.equal(assertAdvertisingPrivacyLock(advertisingPrivacy,['false',undefined]).mode,'off');
 assert.equal(Object.hasOwn(advertisingPrivacy,'publisherId'),false);
});
test('An activation environment value cannot bypass the current privacy state',()=>{
 for(const value of ['true','1','on','enabled','TRUE'])assert.throws(()=>assertAdvertisingPrivacyLock(advertisingPrivacy,[value]),/locked off/);
});
test('A mode switch, claimed consent setup or unknown tracking field requires a reviewed integration',()=>{
 for(const bad of [{...advertisingPrivacy,mode:'on'},{...advertisingPrivacy,certifiedCmp:'configured'},{...advertisingPrivacy,trackingUrl:'https://example.org'}])assert.throws(()=>assertAdvertisingPrivacyLock(bad));
});
