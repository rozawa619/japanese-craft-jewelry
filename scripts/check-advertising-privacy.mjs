import{readFileSync,readdirSync,writeFileSync,existsSync}from'node:fs';
import{resolve,join,relative}from'node:path';
import{fileURLToPath}from'node:url';
import{advertisingPrivacy,assertAdvertisingPrivacyLock}from'../src/lib/advertising-privacy.ts';
const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const dist=resolve(root,process.env.CHECK_DIST_DIR||'dist');
const report={checkedAt:new Date().toISOString(),method:'Inspect the generated HTML and source policy version against the current locked-off Google advertising state. No account, certified CMP, actual consent or law compliance is certified by this check.',checks:[],failures:[],pages:0};
const check=(name,fn)=>{try{const detail=fn();report.checks.push({name,status:'passed',detail});}catch(error){report.failures.push({name,message:String(error)});report.checks.push({name,status:'failed',message:String(error)});}};
const attrs=source=>Object.fromEntries([...source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]??m[4]??'']));
check('Unconfigured Google advertising cannot be activated by an environment flag',()=>assertAdvertisingPrivacyLock(advertisingPrivacy,[process.env.PUBLIC_ADSENSE_ENABLED,process.env.PUBLIC_GOOGLE_ADS_ENABLED]));
for(const locale of ['en','ja'])check(locale+' policy matches the locked-off version and provides real advertising choices',()=>{
 const source=readFileSync(resolve(root,'src/content/policies',locale==='ja'?'ja/privacy.md':'privacy.md'),'utf8');
 if(!source.includes('advertisingPolicyVersion: "'+advertisingPrivacy.policyVersion+'"'))throw Error('Policy state/version mismatch');
 const html=readFileSync(resolve(dist,locale,'privacy/index.html'),'utf8');
 for(const required of ['data-ad-privacy-status','data-ad-serving="off"','data-ad-policy-version="'+advertisingPrivacy.policyVersion+'"','id="advertising-choices"','https://adssettings.google.com/partnerads','https://policies.google.com/technologies/partner-sites','https://optout.aboutads.info/'])if(!html.includes(required))throw Error('Missing policy status or choice: '+required);
 return {version:advertisingPrivacy.policyVersion,mode:'off'};
});
const files=[];function walk(dir){for(const name of readdirSync(dir)){const path=join(dir,name);if(name.endsWith('.html'))files.push(path);else if(!name.includes('.')){try{walk(path);}catch(error){if(error.code!=='ENOTDIR')throw error;}}}}walk(dist);
check('Generated pages contain no Google advertising, analytics or fake consent integration',()=>{
 const forbidden=/(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com|googletagmanager\.com|google-analytics\.com|fundingchoicesmessages\.google\.com)/i;
 let footerPages=0;
 for(const file of files){const html=readFileSync(file,'utf8');
  for(const tag of html.matchAll(/<(script|iframe)\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/\1\s*>/gi)){
   const a=attrs(tag[2]);if(forbidden.test(a.src||'')||tag[1].toLowerCase()==='script'&&/\b(?:adsbygoogle|__tcfapi|__gpp)\b/.test(tag[3]))throw Error('Advertising/consent integration in off state: '+relative(dist,file));
  }
  if(/data-ad-client\s*=|class="[^"]*\badsbygoogle\b/.test(html))throw Error('Ad placement in off state: '+relative(dist,file));
  if(html.includes('class="site-footer"')){
   footerPages++;if(!html.includes('data-advertising-choices')||!html.includes('/privacy/#advertising-choices'))throw Error('Missing advertising-choice link: '+relative(dist,file));
  }
 }
 report.pages=files.length;return {htmlPages:files.length,footerPages,noAdvertisingRequestsInitiatedByTags:true};
});
report.completedAt=new Date().toISOString();report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.status==='passed').length,failed:report.failures.length,htmlPages:report.pages,mode:advertisingPrivacy.mode};
writeFileSync(resolve(root,process.env.CHECK_PRIVACY_REPORT_PATH||'docs/visual-mobile-stage-static-privacy-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(report.summary);for(const failure of report.failures)console.error(failure);if(report.failures.length)process.exitCode=1;
