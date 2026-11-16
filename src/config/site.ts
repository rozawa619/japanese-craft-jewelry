export const site = {
  name: 'ITO',
  tagline: 'Objects with a story.',
  description: 'An independent guide to Japanese craft accessories. Discover makers, understand the details, and find your way to the retailer. Beginning in Kanagawa.',
  locale: 'en',
  url: import.meta.env.PUBLIC_SITE_URL || '',
  publishMode: import.meta.env.PUBLIC_PUBLISH_MODE || 'preview',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  operatorName: import.meta.env.PUBLIC_OPERATOR_NAME || '',
  repositoryUrl: import.meta.env.PUBLIC_REPOSITORY_URL || '',
  socialLinks: [] as { label: string; url: string }[],
};
export const path = (route = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${route.replace(/^\//, '')}`;
export const pagePath = (route = '') => path(`en/${route}`);
export const isPublic = site.publishMode === 'public' && /^https:\/\//.test(site.url);
