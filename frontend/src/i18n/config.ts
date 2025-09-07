// Can be imported from a shared config
export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';