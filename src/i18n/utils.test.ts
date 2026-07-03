import { describe, it, expect } from 'vitest';
import { getLocale, localizedPath, defaultLocale } from './utils';

describe('getLocale', () => {
  it('returns es for /es and /es/... paths', () => {
    expect(getLocale('/es/')).toBe('es');
    expect(getLocale('/es')).toBe('es');
    expect(getLocale('/es/projects/kynetix')).toBe('es');
  });
  it('returns en for unprefixed paths', () => {
    expect(getLocale('/')).toBe('en');
    expect(getLocale('/projects/kynetix')).toBe('en');
    expect(getLocale('/espanol')).toBe('en'); // not a locale prefix
  });
  it('defaultLocale is en', () => {
    expect(defaultLocale).toBe('en');
  });
});

describe('localizedPath', () => {
  it('maps root between locales', () => {
    expect(localizedPath('/', 'es')).toBe('/es/');
    expect(localizedPath('/es/', 'en')).toBe('/');
    expect(localizedPath('/es', 'en')).toBe('/');
  });
  it('maps sub-paths between locales', () => {
    expect(localizedPath('/projects/kynetix', 'es')).toBe('/es/projects/kynetix');
    expect(localizedPath('/es/projects/kynetix', 'en')).toBe('/projects/kynetix');
  });
  it('is idempotent for same-locale input', () => {
    expect(localizedPath('/projects/x', 'en')).toBe('/projects/x');
    expect(localizedPath('/es/projects/x', 'es')).toBe('/es/projects/x');
  });
});
