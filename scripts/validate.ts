import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { catalogSchema } from '../src/lib/schema.ts';
import { selection } from '../src/config/selection.ts';
import type { Catalog } from '../src/lib/schema.ts';
import { safeHttps, isAllowedDestination, policyForLink } from '../src/lib/affiliate.ts';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export type SourceRecord = { id: string; url: string; checkedAt: string; [key: string]: unknown };
export type AssetRecord = { id: string; rightsHolder?: string; permissionBasis?: string; [key: string]: unknown };
export type MarkdownRecord = { file: string; body: string; metadata: Record<string, string | string[]> };
export type TranslationData = Record<string, Record<string, Record<string, unknown>>>;
export type ProjectData = {
  catalog: Catalog; sources: SourceRecord[]; assets: AssetRecord[];
  notes: MarkdownRecord[]; guides: MarkdownRecord[]; policies: MarkdownRecord[];
  places: MarkdownRecord[]; craftNotes: MarkdownRecord[]; translations: TranslationData; stories: Record<string,Record<string,Record<string,unknown>>>;
};
export const contentLocale = (record: MarkdownRecord): string => String(record.metadata.locale || 'en');
const publicLocales = ['en', 'ja'] as const;
const jewelryTypes = new Set(['pierced-earrings', 'clip-on-earrings', 'necklace', 'brooch', 'ring', 'bracelet', 'pendant', 'anklet', 'cufflinks']);

// Astro validates the full YAML shape. These fields connect content to shared factual data.
export function readMarkdownRecord(file: string): MarkdownRecord {
  const text = readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error(`${file}: frontmatter is missing`);
  const metadata: MarkdownRecord['metadata'] = {};
  const lines = frontmatter[1].split(/\r?\n/);
  const scalar = (value: string) => value.trim().replace(/^(['"])([\s\S]*)\1$/, '$2');
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^([A-Za-z][\w]*):\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    if (value.startsWith('[') && value.endsWith(']')) metadata[key] = value.slice(1, -1).split(',').map(scalar).filter(Boolean);
    else if (!value) {
      const values: string[] = [];
      while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) values.push(scalar(lines[++index].replace(/^\s+-\s+/, '')));
      metadata[key] = values;
    } else metadata[key] = scalar(value);
  }
  return { file, metadata, body: text.slice(frontmatter[0].length).trim() };
}
function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = resolve(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : [];
  });
}
export function loadProjectData(root = projectRoot): ProjectData {
  const json = (file: string) => JSON.parse(readFileSync(resolve(root, file), 'utf8'));
  const records = (directory: string) => markdownFiles(resolve(root, directory)).map(readMarkdownRecord);
  return {
    catalog: catalogSchema.parse(json('src/data/catalog.json')),
    sources: json('docs/research/sources.json'), assets: json('docs/assets.json').assets,
    notes: records('src/content/products'), guides: records('src/content/guides'),
    policies: records('src/content/policies'), places: records('src/content/places'),
    craftNotes: records('src/content/crafts'),
    stories: json('src/data/product-stories.json'),
    translations: existsSync(resolve(root, 'src/data/translations/ja.json')) ? json('src/data/translations/ja.json') : {},
  };
}
export function collectValidationErrors(data: ProjectData): string[] {
  const errors: string[] = [];
  const { catalog, sources, assets } = data;
  const storyFields=new Set(['headline','standfirst','highlights','outfit']);
  const text=(value:unknown)=>typeof value==='string'&&!!value.trim();
  for(const id of Object.keys(data.stories))if(!catalog.products.some(product=>product.id===id))errors.push('stories: unknown product '+id);
  for(const product of catalog.products.filter(product=>product.publishStatus==='published')){
    for(const locale of ['en','ja']){
      const story=data.stories[product.id]?.[locale];
      if(!story||typeof story!=='object'||Array.isArray(story)){errors.push('stories: localized story required for '+product.id+'/'+locale);continue}
      for(const key of Object.keys(story))if(!storyFields.has(key))errors.push('stories: unsupported field '+key+' for '+product.id+'/'+locale);
      if(!text(story.headline)||!text(story.standfirst))errors.push('stories: headline and standfirst required for '+product.id+'/'+locale);
      if(!Array.isArray(story.highlights)||story.highlights.length!==3||!story.highlights.every(text))errors.push('stories: three highlights required for '+product.id+'/'+locale);
      const outfit=story.outfit;
      if(!outfit||typeof outfit!=='object'||Array.isArray(outfit))errors.push('stories: outfit required for '+product.id+'/'+locale);
      else{const value=outfit as Record<string,unknown>;if(!text(value.title)||!text(value.body)||Object.keys(value).some(key=>!['title','body'].includes(key)))errors.push('stories: outfit title/body only for '+product.id+'/'+locale);}
    }
  }

  const selectedIds=[...selection.featuredProductIds];
  if(new Set(selectedIds).size!==selectedIds.length)errors.push('selection: duplicate featured product ID');
  for(const id of new Set<string>([selection.heroProductId,...selectedIds])){
    if(!catalog.products.some(product=>product.id===id&&product.publishStatus==='published'))errors.push('selection: published product required for '+id);
  }
  const groups = { ...catalog, sources, assets };
  for (const [name, records] of Object.entries(groups)) {
    const seen = new Set<string>();
    for (const record of records) {
      if (seen.has(record.id)) errors.push(`${name}: duplicate id ${record.id}`);
      seen.add(record.id);
    }
  }
  const ids = Object.fromEntries(Object.entries(groups).map(([name, records]) => [name, new Set(records.map(record => record.id))]));
  const references = (owner: string, group: keyof typeof groups, values: string[]) => {
    for (const id of values) if (!ids[group].has(id)) errors.push(`${owner}: unknown ${group} id ${id}`);
  };
  const checkDate = (owner: string, value: string | null) => {
    if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value)) errors.push(`${owner}: invalid calendar date ${value}`);
  };
  for (const source of sources) {
    if (!safeHttps(source.url)) errors.push(`source ${source.id}: valid credential-free HTTPS URL required`);
    if (!source.checkedAt) errors.push(`source ${source.id}: checkedAt required`);
    checkDate(`source ${source.id}`, source.checkedAt);
  }
  for (const asset of assets) if (!asset.rightsHolder || !asset.permissionBasis) errors.push(`asset ${asset.id}: rightsHolder and permissionBasis required`);
  for (const craft of catalog.crafts) references(`craft ${craft.id}`, 'sources', craft.sourceIds);
  for (const maker of catalog.makers) references(`maker ${maker.id}`, 'sources', maker.sourceIds);
  for (const merchant of catalog.merchants) {
    references(`merchant ${merchant.id}`, 'sources', merchant.sourceIds);
    references(`merchant ${merchant.id} shipping`, 'sources', merchant.shipping.sourceIds);
    if (merchant.shipping.status === 'confirmed' && merchant.shipping.sourceIds.length === 0) errors.push(`merchant ${merchant.id}: confirmed shipping needs a source`);
  }
  for (const program of catalog.programs) {
    references(`program ${program.id}`, 'merchants', program.merchantIds);
    if (new Set(program.affiliateAllowedHosts).size !== program.affiliateAllowedHosts.length) errors.push(`program ${program.id}: duplicate affiliateAllowedHosts`);
    if (program.applicationStatus === 'approved' && !program.affiliateAllowedHosts.length) errors.push(`program ${program.id}: approved program requires verified affiliateAllowedHosts`);
  }
  const slugs = new Set<string>();
  for (const product of catalog.products) {
    if (slugs.has(product.slug)) errors.push(`products: duplicate shared slug ${product.slug}`);
    slugs.add(product.slug);
    references(`product ${product.id}`, 'makers', [product.makerId]);
    references(`product ${product.id}`, 'productTypes', product.productType);
    references(`product ${product.id}`, 'prefectures', product.prefectureIds);
    references(`product ${product.id}`, 'crafts', product.craftIds);
    references(`product ${product.id}`, 'materials', product.materialIds);
    references(`product ${product.id}`, 'merchants', product.merchantIds);
    references(`product ${product.id}`, 'sources', [...product.sourceIds, ...product.craftClassification.sourceIds]);
    references(`product ${product.id}`, 'assets', product.imageAssetIds);
    for (const assetId of product.imageAssetIds) if (assets.find(asset => asset.id === assetId)?.productImage === false) errors.push(`product ${product.id}: decorative asset ${assetId} cannot represent a product photograph`);
    checkDate(`product ${product.id} verified`, product.lastVerifiedAt);
    checkDate(`product ${product.id} price`, product.priceCheckedAt);
    if (product.priceAmount !== null && (!product.priceCurrency || !product.priceCheckedAt)) errors.push(`product ${product.id}: a price needs currency and checked date`);
    if (product.publishStatus === 'published' && !product.productType.every(type => jewelryTypes.has(type))) errors.push(`product ${product.id}: published product must be jewelry`);
    for (const locale of publicLocales) {
      const notes = data.notes.filter(note => note.metadata.productId === product.id && contentLocale(note) === locale);
      if (notes.length > 1) errors.push(`product ${product.id}: duplicate product notes for ${locale}`);
      if (product.publishStatus === 'published' && !notes.some(note => note.metadata.publishStatus === 'published' && note.body.length > 0)) errors.push(`product ${product.id}: published product note required for ${locale}`);
    }
  }
  const linkPairs = new Set<string>();
  for (const link of catalog.links) {
    references(`link ${link.id}`, 'products', [link.productId]);
    references(`link ${link.id}`, 'merchants', [link.merchantId]);
    if (link.programId) references(`link ${link.id}`, 'programs', [link.programId]);
    const pair = `${link.productId}/${link.merchantId}`;
    if (linkPairs.has(pair)) errors.push(`links: duplicate product/merchant pair ${pair}`);
    linkPairs.add(pair);
    const product = catalog.products.find(product => product.id === link.productId);
    if (product && !product.merchantIds.includes(link.merchantId)) errors.push(`link ${link.id}: merchant is not attached to product`);
    const program = catalog.programs.find(program => program.id === link.programId);
    if (program && !program.merchantIds.includes(link.merchantId)) errors.push(`link ${link.id}: program does not include merchant`);
    if (link.applicationStatus === 'approved' && !link.programId) errors.push(`link ${link.id}: approved link requires programId`);
    if (link.officialProductUrl && !safeHttps(link.officialProductUrl)) errors.push(`link ${link.id}: unsafe officialProductUrl`);
    if (link.affiliateUrl && !safeHttps(link.affiliateUrl)) errors.push(`link ${link.id}: unsafe affiliateUrl`);
    const policy = policyForLink(link, catalog);
    if (link.officialProductUrl && !isAllowedDestination(link.officialProductUrl, policy.officialHosts)) errors.push(`link ${link.id}: official URL host must match the merchant URL host`);
    if (link.applicationStatus === 'approved' && program?.applicationStatus === 'approved' && link.affiliateUrl && !isAllowedDestination(link.affiliateUrl, policy.affiliateHosts)) errors.push(`link ${link.id}: approved affiliate URL host is not in verified affiliateAllowedHosts`);
    checkDate(`link ${link.id}`, link.affiliateLinkVerifiedAt);
  }
  for (const note of data.notes) {
    references(`note ${note.file}`, 'products', [String(note.metadata.productId || '')]);
    const product = catalog.products.find(product => product.id === note.metadata.productId);
    if (product?.publishStatus === 'draft' && note.metadata.publishStatus === 'published') errors.push(`note ${note.file}: published note refers to draft product`);
  }
  const contentCollections = { notes: data.notes, guides: data.guides, policies: data.policies, places: data.places, craftNotes: data.craftNotes };
  for (const [name, records] of Object.entries(contentCollections)) {
    const contentIds = new Set<string>();
    for (const record of records) {
      const locale = contentLocale(record);
      if (!publicLocales.includes(locale as 'en' | 'ja')) errors.push(`${name} ${record.file}: unsupported locale ${locale}`);
      const inJapaneseDirectory = record.file.split(sep).includes('ja') || record.file.replaceAll('\\', '/').includes('/ja/');
      if ((locale === 'ja') !== inJapaneseDirectory) errors.push(`${name} ${record.file}: locale must match the ja directory`);
      const key = name === 'notes' ? String(record.metadata.productId || '') : basename(record.file, '.md');
      const id = `${locale}/${key}`;
      if (contentIds.has(id)) errors.push(`${name}: duplicate content id ${id}`);
      contentIds.add(id);
      if (record.metadata.publishStatus !== 'published') continue;
      if (!record.body.trim()) errors.push(`${name} ${record.file}: published page requires a nonempty body`);
      const peer = records.find(candidate => contentLocale(candidate) !== locale && (name === 'notes' ? candidate.metadata.productId === record.metadata.productId : basename(candidate.file, '.md') === key));
      if (!peer || peer.metadata.publishStatus !== 'published' || !peer.body.trim()) errors.push(`${name} ${record.file}: published bilingual peer required`);
      if (peer && name !== 'notes') {
        for (const field of ['sourceIds', 'productIds', 'prefectureId', 'relatedMerchantIds', 'craftId']) {
          const left = record.metadata[field], right = peer.metadata[field];
          const normalized = (value: string | string[] | undefined) => Array.isArray(value) ? [...value].sort() : value;
          if (JSON.stringify(normalized(left)) !== JSON.stringify(normalized(right))) errors.push(`${name} ${key}: bilingual ${field} references must agree`);
        }
      }
    }
  }
  for (const article of [...data.guides, ...data.policies, ...data.places, ...data.craftNotes]) {
    const sourceIds = article.metadata.sourceIds;
    if (Array.isArray(sourceIds)) references(`article ${article.file}`, 'sources', sourceIds);
    else errors.push(`article ${article.file}: sourceIds must be an ID array`);
    const productIds = article.metadata.productIds;
    if (data.guides.includes(article) && !Array.isArray(productIds)) errors.push(`article ${article.file}: productIds must be an ID array`);
    if (Array.isArray(productIds)) {
      references(`article ${article.file}`, 'products', productIds);
      if (article.metadata.publishStatus === 'published') for (const productId of productIds) {
        if (catalog.products.find(product => product.id === productId)?.publishStatus === 'draft') errors.push(`article ${article.file}: published guide refers to draft product ${productId}`);
      }
    }
  }
  for (const [collection, records, field, group] of [
    ['places', data.places, 'prefectureId', 'prefectures'],
    ['craftNotes', data.craftNotes, 'craftId', 'crafts'],
  ] as const) {
    for (const article of records) {
      const id = String(article.metadata[field] || '');
      if (basename(article.file, '.md') !== id || (article.metadata.slug && article.metadata.slug !== id)) errors.push(`${collection} ${article.file}: Markdown filename/slug must equal ${field} ${id}`);
      references(`${collection} ${article.file}`, group, [id]);
      if (collection === 'places') {
        const merchantIds = article.metadata.relatedMerchantIds;
        if (Array.isArray(merchantIds)) references(`place ${article.file}`, 'merchants', merchantIds);
        else errors.push(`place ${article.file}: relatedMerchantIds must be an ID array`);
      }
      if (article.metadata.publishStatus === 'published') {
        const hasPublishedProducts = catalog.products.some(product => product.publishStatus === 'published' && (collection === 'places' ? product.prefectureIds.includes(id) : product.craftIds.includes(id)));
        if (!hasPublishedProducts) errors.push(`${collection} ${article.file}: published page requires a related published product`);
        if (!Array.isArray(article.metadata.sourceIds) || article.metadata.sourceIds.length === 0) errors.push(`${collection} ${article.file}: published page requires primary sourceIds`);
      }
    }
  }
  const translatedProducts = data.translations.products || {};
  const productTextFields = ['title', 'editorialSummary', 'whoItMaySuit', 'whatToCheck', 'size', 'findings', 'fastening', 'taxNote', 'craftClassificationLabel'];
  for (const [id, translation] of Object.entries(translatedProducts)) {
    references(`ja translation ${id}`, 'products', [id]);
    for (const field of Object.keys(translation)) if (!productTextFields.includes(field)) errors.push(`ja translation ${id}: factual or unsupported field ${field} must remain in catalog`);
  }
  for (const product of catalog.products.filter(product => product.publishStatus === 'published')) {
    const translation = translatedProducts[product.id];
    if (!translation) { errors.push(`product ${product.id}: Japanese product translation required`); continue; }
    for (const field of ['title', 'editorialSummary', 'whoItMaySuit', 'taxNote', 'craftClassificationLabel']) if (typeof translation[field] !== 'string' || !String(translation[field]).trim()) errors.push(`product ${product.id}: nonempty Japanese ${field} required`);
    if (!Array.isArray(translation.whatToCheck) || translation.whatToCheck.length !== product.whatToCheck.length || translation.whatToCheck.some(value => typeof value !== 'string' || !value.trim())) errors.push(`product ${product.id}: Japanese whatToCheck must retain every check`);
    for (const field of ['size', 'findings', 'fastening'] as const) {
      if (product[field] === null && translation[field] !== null) errors.push(`product ${product.id}: unknown ${field} must remain null in Japanese`);
      if (product[field] !== null && (typeof translation[field] !== 'string' || !translation[field].trim())) errors.push(`product ${product.id}: Japanese ${field} required`);
    }
  }
  const published = catalog.products.filter(product => product.publishStatus === 'published');
  const translatedGroups = [
    ['prefectures', published.flatMap(product => product.prefectureIds), ['name']],
    ['crafts', published.flatMap(product => product.craftIds), ['name', 'description']],
    ['materials', published.flatMap(product => product.materialIds), ['name']],
    ['productTypes', published.flatMap(product => product.productType), ['name']],
    ['makers', published.map(product => product.makerId), ['name', 'location', 'productionNote']],
    ['merchants', published.flatMap(product => product.merchantIds), ['name', 'language', 'shippingSummary', 'returns']],
  ] as const;
  const allowedMasterText:Record<string,string[]>={prefectures:['name','description'],crafts:['name','description'],materials:['name','description'],productTypes:['name','description'],makers:['name','description','location','productionNote'],merchants:['name','description','language','shippingSummary','returns']};
  for(const [group]of translatedGroups){
    for(const [id,translation]of Object.entries(data.translations[group]||{})){
      references(`ja ${group} translation`,group,[id]);
      for(const field of Object.keys(translation))if(!allowedMasterText[group].includes(field))errors.push(`ja ${group} ${id}: factual or unsupported field ${field} must remain in catalog`);
    }
  }
  for (const [group, requiredIds, fields] of translatedGroups) for (const id of new Set(requiredIds)) {
    const translation = data.translations[group]?.[id];
    for (const field of fields) if (!translation || typeof translation[field] !== 'string' || !String(translation[field]).trim()) errors.push(`ja ${group} ${id}: nonempty ${field} translation required`);
  }
  return [...new Set(errors)];
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const data = loadProjectData();
    const errors = collectValidationErrors(data);
    if (errors.length) { console.error(errors.map(error => `FAIL ${error}`).join('\n')); process.exitCode = 1; }
    else console.log(`PASS schema and references: ${data.catalog.products.filter(product => product.publishStatus === 'published').length} published jewelry products, ${data.guides.length} localized guides, ${data.places.length} localized places, ${data.craftNotes.length} localized craft notes, ${data.sources.length} sources, ${data.assets.length} assets; EN/JA pairs and shared facts.`);
  } catch (error) { console.error('FAIL validation:', error instanceof Error ? error.message : error); process.exitCode = 1; }
}
