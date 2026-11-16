import type { Catalog, RetailerLink } from './schema.ts';

// Link destinations are public navigation targets, never private-network endpoints.
export function safeHttps(value: string | null | undefined): string | null {
  if (!value || value !== value.trim() || /[\u0000-\u0020\u007f\\]/.test(value)) return null;
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    if (u.protocol !== 'https:' || u.username || u.password || u.port || host.endsWith('.')) return null;
    if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(host)) return null;
    if (host === 'localhost' || /\.(?:localhost|local|internal|home|lan)$/.test(host)) return null;
    return u.href;
  } catch { return null; }
}

export type RetailerLinkPolicy = {
  merchantId: string;
  officialHosts: readonly string[];
  programMerchantIds: readonly string[];
  affiliateHosts: readonly string[];
};

export function isAllowedDestination(value: string | null | undefined, allowedHosts: readonly string[]): string | null {
  const safe = safeHttps(value);
  if (!safe) return null;
  const host = new URL(safe).hostname;
  // Exact matches only: "shop.example" must never approve "shop.example.evil.test".
  return allowedHosts.some(allowed => allowed === host) ? safe : null;
}

export function policyForLink(link: RetailerLink, catalog: Pick<Catalog, 'merchants' | 'programs'>): RetailerLinkPolicy {
  const merchant = catalog.merchants.find(item => item.id === link.merchantId);
  const program = catalog.programs.find(item => item.id === link.programId);
  const merchantUrl = safeHttps(merchant?.url);
  return {
    merchantId: merchant?.id || '',
    officialHosts: merchantUrl ? [new URL(merchantUrl).hostname] : [],
    programMerchantIds: program?.merchantIds || [],
    affiliateHosts: program?.affiliateAllowedHosts || [],
  };
}

const validDate = (value: string | null) => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;

export function resolveRetailerLink(link: RetailerLink | undefined, programStatus?: string, policy?: RetailerLinkPolicy) {
  if (!link || !policy || policy.merchantId !== link.merchantId) return null;
  const affiliate = isAllowedDestination(link.affiliateUrl, policy.affiliateHosts);
  const approved = link.applicationStatus === 'approved' && programStatus === 'approved' && !!link.programId && validDate(link.affiliateLinkVerifiedAt) && policy.programMerchantIds.includes(link.merchantId);
  if (approved && affiliate) return { href: affiliate, sponsored: true, rel: 'sponsored noopener noreferrer' };
  const official = isAllowedDestination(link.officialProductUrl, policy.officialHosts);
  return official ? { href: official, sponsored: false, rel: 'noopener noreferrer' } : null;
}
