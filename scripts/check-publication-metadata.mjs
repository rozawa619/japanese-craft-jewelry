import{chromium}from'@playwright/test';
import{existsSync}from'node:fs';
import{writeFile}from'node:fs/promises';
import{resolve}from'node:path';
import{fileURLToPath}from'node:url';
import{assertPublicationMetadata}from'./publication-metadata-assertions.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
if(existsSync(resolve(root,'.env')))process.loadEnvFile(resolve(root,'.env'));
const origin=new URL(process.env.CHECK_BASE_URL||'http://127.0.0.1:4321').origin;
const parts=(process.env.PUBLIC_BASE_PATH||'/').split('/').filter(Boolean),base='/'+parts.join('/')+(parts.length?'/':'');
const route=(locale,path='')=>origin+base+locale+'/'+path;
const report={checkedAt:new Date().toISOString(),origin,method:'Fresh Chrome executes exactly the shared publication-metadata assertion used by the full bilingual suite. Expected robots includes the intentional large image preview directive. No site code/data changed for this follow-up.',checks:[],failures:[]};
const browser=await chromium.launch({channel:'chrome',headless:true});
try{const detail=await assertPublicationMetadata(browser,{route,base,publishMode:process.env.PUBLIC_PUBLISH_MODE,siteUrl:process.env.PUBLIC_SITE_URL});report.checks.push({name:'Publication metadata, withdrawn hairpin and empty categories are correct',status:'passed',detail});}
catch(error){report.failures.push({message:String(error)});report.checks.push({status:'failed',message:String(error)});process.exitCode=1;}
finally{await browser.close();report.completedAt=new Date().toISOString();report.summary={checks:1,passed:report.failures.length?0:1,failed:report.failures.length};await writeFile(resolve(root,process.env.CHECK_REPORT_PATH||'docs/visual-seo-stage-publication-metadata-results.json'),JSON.stringify(report,null,2)+'\n');console.log(report.summary);}
