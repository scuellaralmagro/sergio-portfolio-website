import { ui, type UIKey } from './ui';

export type Locale = 'en' | 'es';
export const locales = ['en', 'es'] as const;
export const defaultLocale: Locale = 'en';

const ES_PREFIX = /^\/es(?=\/|$)/;

/** Resolve the locale that owns a pathname. Unprefixed → en. */
export function getLocale(pathname: string): Locale {
  return ES_PREFIX.test(pathname) ? 'es' : 'en';
}

/**
 * Return the equivalent of `pathname` in `target` locale. Strips any existing
 * /es prefix first, then re-adds it for Spanish. Root normalises to '/' (en)
 * and '/es/' (es). Caller preserves query/hash.
 */
export function localizedPath(pathname: string, target: Locale): string {
  const stripped = pathname.replace(ES_PREFIX, '') || '/';
  if (target === 'es') return stripped === '/' ? '/es/' : '/es' + stripped;
  return stripped;
}

/** Bind a translator to a locale. Falls back to the default locale's string. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}
