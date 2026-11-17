import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const baseline=read('docs/research/editorial-baseline-v11.json');
const baselineCommit=baseline.documentationCommit;
const catalog=read('src/data/catalog.json'),ja=read('src/data/translations/ja.json'),stories=read('src/data/product-stories.json'),notes=read('src/data/selection-notes.json');
const published=catalog.products.filter(product=>product.publishStatus==='published');
const oldPublished=new Set(Object.keys(baseline.products));
const checks=[],failures=[];
const check=(name,fn)=>{try{const detail=fn();checks.push({name,status:'passed',detail});}catch(error){failures.push({name,message:error.message});checks.push({name,status:'failed',message:error.message});}};
for(const locale of ['en','ja']){
 for(const field of ['headline','standfirst','bestFor','consider','editorialSummary'])check(locale+' '+field+' is distinct for each published product',()=>{
  const values=published.map(product=>({id:product.id,value:field==='editorialSummary'?(locale==='ja'?ja.products[product.id].editorialSummary:product.editorialSummary):['bestFor','consider'].includes(field)?stories[product.id][locale].decision[field]:stories[product.id][locale][field]}));
  assert.ok(values.every(item=>typeof item.value==='string'&&item.value.trim()));
  const duplicates=values.filter((item,index)=>values.findIndex(peer=>peer.value.trim().toLowerCase()===item.value.trim().toLowerCase())!==index);
  assert.deepEqual(duplicates,[],'Exact repeated copy is an editorial review failure.');
  return {products:values.length};
 });
 for(const product of published.filter(product=>oldPublished.has(product.id)))check(locale+' refreshed introduction '+product.id,()=>{
  const story=stories[product.id][locale],old=baseline.products[product.id][locale];
  const summary=locale==='ja'?ja.products[product.id].editorialSummary:product.editorialSummary;
  const oldSummary=old.editorialSummary;
  assert.notEqual(story.headline,old.headline);assert.notEqual(story.standfirst,old.standfirst);assert.notEqual(summary,oldSummary);
  assert.ok(notes[product.id][locale].difference&&notes[product.id][locale].chooseFor);
  return {headlineUpdated:true,standfirstUpdated:true,cardSummaryUpdated:true,localizedDecision:true};
 });
}
const report={checkedAt:new Date().toISOString(),baselineCommit,method:'Exact-copy and baseline change checks against v0.11. These checks establish localized coverage and actual revision, not semantic originality, factual truth, legal clearance, SEO or sales performance. Human factual/editorial review remains necessary.',summary:{checks:checks.length,passed:checks.filter(check=>check.status==='passed').length,failed:failures.length,publishedProducts:published.length,existingProducts:published.filter(product=>oldPublished.has(product.id)).length,newProducts:published.filter(product=>!oldPublished.has(product.id)).length},checks,failures};
writeFileSync(resolve(root,process.env.CHECK_EDITORIAL_REPORT_PATH||'docs/editorial-stage-copy-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary));for(const failure of failures)console.error(failure.name+': '+failure.message);if(failures.length)process.exitCode=1;
