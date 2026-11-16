import type { RetailerLink } from './schema.ts';
export function safeHttps(value: string | null | undefined): string | null {
  if (!value) return null;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export function resolveRetailerLink(link: RetailerLink | undefined, programStatus?: string) {
  if (!link) return null;
  const affiliate = safeHttps(link.affiliateUrl);
  const approved = link.applicationStatus === 'approved' && programStatus === 'approved' && !!link.programId && !!link.affiliateLinkVerifiedAt;
  if (approved && affiliate) return { href: affiliate, sponsored: true, rel: 'sponsored noopener noreferrer' };
  const official = safeHttps(link.officialProductUrl);
  return official ? { href: official, sponsored: false, rel: 'noopener noreferrer' } : null;
}
