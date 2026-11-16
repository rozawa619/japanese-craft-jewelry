import {readFileSync,existsSync,unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,sep} from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=resolve(root,'dist');
const ledger=JSON.parse(readFileSync(resolve(root,'docs/assets.json'),'utf8'));
const retired=new Set(ledger.assets.filter(asset=>asset.status==='retired'&&asset.localRetiredPath).map(asset=>asset.localRetiredPath));
const removed=[];
for(const relative of retired){
 if(!/^public\/images\/[a-z0-9-]+\.webp$/.test(relative))throw new Error('Invalid retired local image path');
 const target=resolve(dist,relative.slice('public/'.length));
 if(!target.startsWith(dist+sep+'images'+sep))throw new Error('Retired image is outside the generated image directory');
 if(existsSync(target)){unlinkSync(target);removed.push(relative)}
}
console.log(`PASS retired image cleanup: ${removed.length} local-only legacy images excluded from generated site.`);
