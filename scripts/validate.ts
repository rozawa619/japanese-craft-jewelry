import { readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { catalogSchema } from '../src/lib/schema.ts';
import type { Catalog } from '../src/lib/schema.ts';
import { safeHttps } from '../src/lib/affiliate.ts';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export type SourceRecord = { id: string; url: string; checkedAt: string; [key: string]: unknown };
export type AssetRecord = { id: string; rightsHolder?: string; permissionBasis?: string; [key: string]: unknown };
export type MarkdownRecord = { file: string; body: string; metadata: Record<string, string | string[]> };
export type ProjectData = {
  catalog: Catalog;
  sources: SourceRecord[];
  assets: AssetRecord[];
  notes: MarkdownRecord[];
  guides: MarkdownRecord[];
  policies: MarkdownRecord[];
  places: MarkdownRecord[];
  craftNotes: MarkdownRecord[];
};

// Only the ID/status fields needed for cross-file validation are read here.
// Astro Content Collections performs the full Markdown/YAML schema validation.
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
    if (value.startsWith('[') && value.endsWith(']')) {
      metadata[key] = value.slice(1, -1).split(',').map(scalar).filter(Boolean);
    } else if (!value) {
      const values: string[] = [];
      while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) {
        values.push(scalar(lines[++index].replace(/^\s+-\s+/, '')));
      }
      metadata[key] = values;
    } else {
      metadata[key] = scalar(value);
    }
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
    sources: json('docs/research/sources.json'),
    assets: json('docs/assets.json').assets,
    notes: records('src/content/products'),
    guides: records('src/content/guides'),
    policies: records('src/content/policies'),
    places: records('src/content/places'),
    craftNotes: records('src/content/crafts'),
  };
}

export function collectValidationErrors(data: ProjectData): string[] {
  const errors: string[] = [];
  const { catalog, sources, assets } = data;
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
  for (const asset of assets) {
    if (!asset.rightsHolder || !asset.permissionBasis) errors.push(`asset ${asset.id}: rightsHolder and permissionBasis required`);
  }
  for (const craft of catalog.crafts) references(`craft ${craft.id}`, 'sources', craft.sourceIds);
  for (const maker of catalog.makers) references(`maker ${maker.id}`, 'sources', maker.sourceIds);
  for (const merchant of catalog.merchants) {
    references(`merchant ${merchant.id}`, 'sources', merchant.sourceIds);
    references(`merchant ${merchant.id} shipping`, 'sources', merchant.shipping.sourceIds);
    if (merchant.shipping.status === 'confirmed' && merchant.shipping.sourceIds.length === 0) errors.push(`merchant ${merchant.id}: confirmed shipping needs a source`);
  }
  for (const program of catalog.programs) references(`program ${program.id}`, 'merchants', program.merchantIds);
  const slugs = new Set<string>();
  for (const product of catalog.products) {
    if (slugs.has(`${product.locale}/${product.slug}`)) errors.push(`products: duplicate locale/slug ${product.locale}/${product.slug}`);
    slugs.add(`${product.locale}/${product.slug}`);
    references(`product ${product.id}`, 'makers', [product.makerId]);
    references(`product ${product.id}`, 'productTypes', product.productType);
    references(`product ${product.id}`, 'prefectures', product.prefectureIds);
    references(`product ${product.id}`, 'crafts', product.craftIds);
    references(`product ${product.id}`, 'materials', product.materialIds);
    references(`product ${product.id}`, 'merchants', product.merchantIds);
    references(`product ${product.id}`, 'sources', [...product.sourceIds, ...product.craftClassification.sourceIds]);
    references(`product ${product.id}`, 'assets', product.imageAssetIds);
    for (const assetId of product.imageAssetIds) {
      const asset = assets.find(asset => asset.id === assetId);
      if (asset?.productImage === false) errors.push(`product ${product.id}: decorative asset ${assetId} cannot represent a product photograph`);
    }
    checkDate(`product ${product.id} verified`, product.lastVerifiedAt);
    checkDate(`product ${product.id} price`, product.priceCheckedAt);
    if (product.priceAmount !== null && (!product.priceCurrency || !product.priceCheckedAt)) errors.push(`product ${product.id}: a price needs currency and checked date`);
    const notes = data.notes.filter(note => note.metadata.productId === product.id);
    if (notes.length > 1) errors.push(`product ${product.id}: duplicate product notes`);
    if (product.publishStatus === 'published' && !notes.some(note => note.metadata.publishStatus === 'published' && note.body.length > 0)) errors.push(`product ${product.id}: published product note required`);
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
    checkDate(`link ${link.id}`, link.affiliateLinkVerifiedAt);
  }
  for (const note of data.notes) references(`note ${note.file}`, 'products', [String(note.metadata.productId || '')]);
  for (const article of [...data.guides, ...data.policies, ...data.places, ...data.craftNotes]) {
    const sourceIds = article.metadata.sourceIds;
    if (Array.isArray(sourceIds)) references(`article ${article.file}`, 'sources', sourceIds);
    else errors.push(`article ${article.file}: sourceIds must be an ID array`);
    const productIds = article.metadata.productIds;
    if (data.guides.includes(article) && !Array.isArray(productIds)) errors.push(`article ${article.file}: productIds must be an ID array`);
    if (Array.isArray(productIds)) {
      references(`article ${article.file}`, 'products', productIds);
      if (article.metadata.publishStatus === 'published') for (const productId of productIds) {
        const product = catalog.products.find(product => product.id === productId);
        if (product?.publishStatus === 'draft') errors.push(`article ${article.file}: published guide refers to draft product ${productId}`);
      }
    }
  }
  for (const [collection, records, field, group] of [
    ['places', data.places, 'prefectureId', 'prefectures'],
    ['craftNotes', data.craftNotes, 'craftId', 'crafts'],
  ] as const) {
    const contentIds = new Set<string>();
    for (const article of records) {
      const id = String(article.metadata[field] || '');
      const stem = basename(article.file, '.md');
      references(`${collection} ${article.file}`, group, [id]);
      if (stem !== id || (article.metadata.slug && article.metadata.slug !== id)) errors.push(`${collection} ${article.file}: Markdown filename/slug must equal ${field} ${id}`);
      const contentId = `${article.metadata.locale || 'en'}/${id}`;
      if (contentIds.has(contentId)) errors.push(`${collection}: duplicate content id ${contentId}`);
      contentIds.add(contentId);
      if (collection === 'places') {
        const merchantIds = article.metadata.relatedMerchantIds;
        if (Array.isArray(merchantIds)) references(`place ${article.file}`, 'merchants', merchantIds);
        else errors.push(`place ${article.file}: relatedMerchantIds must be an ID array`);
      }
      if (article.metadata.publishStatus === 'published') {
        if (!article.body.trim()) errors.push(`${collection} ${article.file}: published page requires a nonempty body`);
        const hasPublishedProducts = catalog.products.some(product => product.publishStatus === 'published' && (collection === 'places' ? product.prefectureIds.includes(id) : product.craftIds.includes(id)));
        if (!hasPublishedProducts) errors.push(`${collection} ${article.file}: published page requires a related published product`);
        if (!Array.isArray(article.metadata.sourceIds) || article.metadata.sourceIds.length === 0) errors.push(`${collection} ${article.file}: published page requires primary sourceIds`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    const data = loadProjectData();
    const errors = collectValidationErrors(data);
    if (errors.length) {
      console.error(errors.map(error => `FAIL ${error}`).join('\n'));
      process.exitCode = 1;
    } else {
      console.log(`PASS schema and references: ${data.catalog.products.length} products, ${data.guides.length} guides, ${data.places.length} places, ${data.craftNotes.length} craft notes, ${data.sources.length} sources, ${data.assets.length} assets.`);
    }
  } catch (error) {
    console.error('FAIL validation:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
