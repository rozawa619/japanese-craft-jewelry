import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

export function assertRuntimeVersion(actual,requirement){
  const minimum=/^>=(\d+)\.(\d+)\.(\d+)$/.exec(requirement);
  const running=/^(\d+)\.(\d+)\.(\d+)$/.exec(actual);
  if(!minimum||!running)throw new Error('A stable Node version and an explicit supported minimum are required.');
  for(let i=1;i<=3;i++){
    if(Number(running[i])>Number(minimum[i]))return;
    if(Number(running[i])<Number(minimum[i]))throw new Error('Node '+actual+' is below the supported security floor '+requirement+'. Use a patched supported runtime.');
  }
}
export function assertProjectRuntime(){
  const pkg=JSON.parse(readFileSync(fileURLToPath(new URL('../package.json',import.meta.url)),'utf8'));
  assertRuntimeVersion(process.versions.node,pkg.engines.node);
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){assertProjectRuntime();console.log('PASS Node '+process.versions.node+' meets the project security floor.');}
