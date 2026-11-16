export const locales = ['en', 'ja'] as const;
export type Locale = typeof locales[number];
export const isLocale = (value: unknown): value is Locale => value === 'en' || value === 'ja';
export const t = (locale: Locale, en: string, ja: string): string => locale === 'ja' ? ja : en;
export const contentSlug = (entry: { id: string }): string => entry.id.replace(/^ja\//, '');
