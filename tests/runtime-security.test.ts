import test from 'node:test';
import assert from 'node:assert/strict';
import {assertRuntimeVersion} from '../scripts/check-runtime.mjs';

test('the runtime floor rejects the old security patch and unstable or ambiguous versions',()=>{
  for(const version of ['24.22.1','24.22.2','24.21.9','22.99.9','24.22.3-rc.1','invalid'])assert.throws(()=>assertRuntimeVersion(version,'>=24.22.3'));
  for(const version of ['24.22.3','24.22.4','24.23.0','26.13.1'])assert.doesNotThrow(()=>assertRuntimeVersion(version,'>=24.22.3'));
});
