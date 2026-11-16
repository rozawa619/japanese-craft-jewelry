import { z } from 'zod';
import { safeHttps } from './affiliate.ts';
const id = z.string().regex(/^[a-z0-9-]+$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const url = z.url().refine(v => !!safeHttps(v), 'Public credential-free HTTPS URL required');
const host = z.string().refine(v => !!safeHttps(`https://${v}/`) && new URL(`https://${v}/`).hostname === v && !v.includes('/') && !v.includes(':'), 'An exact lower-case public hostname is required');
const named = z.object({ id, name: z.string(), description: z.string().optional() });
export const applicationStatus = z.enum(['not_applied', 'pending', 'approved', 'rejected', 'paused']);
export const linkSchema = z.object({
  id, productId: id, merchantId: id, programId: id.nullable(), locale: z.enum(['en','ja']).optional(),
  officialProductUrl: url.nullable(), affiliateUrl: url.nullable(),
  applicationStatus, affiliateLinkVerifiedAt: date.nullable(),
});
export const productSchema = z.object({
  id, slug: id, locale: z.enum(['en','ja']), title: z.string(), originalTitle: z.string(),
  publishStatus: z.enum(['published', 'draft']), productType: z.array(id).min(1),
  prefectureIds: z.array(id), craftIds: z.array(id).min(1), materialIds: z.array(id),
  makerId: id, craftClassification: z.object({ label: z.string(), sourceIds: z.array(id) }),
  size: z.string().nullable(), weightPerPieceGrams: z.number().positive().nullable(),
  findings: z.string().nullable(), fastening: z.string().nullable(),
  priceAmount: z.number().nonnegative().nullable(), priceCurrency: z.string().length(3).nullable(),
  localizedPrices: z.object({ja: z.object({amount:z.number().nonnegative(),currency:z.string().length(3),checkedAt:date,taxNote:z.string(),sourceIds:z.array(id).min(1)}).optional()}).optional(),
  priceCheckedAt: date.nullable(), taxNote: z.string(), availability: z.enum(['listed', 'in_stock', 'out_of_stock', 'unknown']),
  merchantIds: z.array(id).min(1), sourceIds: z.array(id).min(1), lastVerifiedAt: date,
  imageAssetIds: z.array(id), editorialSummary: z.string(), whoItMaySuit: z.string(), whatToCheck: z.array(z.string()).min(1),
});
export const catalogSchema = z.object({
  prefectures: z.array(named), crafts: z.array(named.extend({ sourceIds: z.array(id) })),
  materials: z.array(named), productTypes: z.array(named),
  makers: z.array(named.extend({ location: z.string(), productionNote: z.string(), url, sourceIds: z.array(id) })),
  merchants: z.array(named.extend({ url, language: z.string(), shipping: z.object({ status: z.enum(['confirmed', 'unknown', 'unavailable']), summary: z.string(), countries: z.array(z.string()).nullable(), sourceIds: z.array(id) }), returns: z.string(), sourceIds: z.array(id) })),
  programs: z.array(named.extend({ recruitmentUrl: url, applicationUrl: url.nullable(), recruitmentStatus: z.enum(['open', 'uncertain', 'closed']), applicationStatus, merchantIds: z.array(id), affiliateAllowedHosts: z.array(host).default([]), disclosure: z.string().nullable() })),
  links: z.array(linkSchema), products: z.array(productSchema),
});
export type Product = z.infer<typeof productSchema>;
export type RetailerLink = z.infer<typeof linkSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
