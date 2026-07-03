import { describe, it, expect } from 'vitest';
import { ui } from './ui';
import { useTranslations } from './utils';

describe('ui dictionary', () => {
  it('en and es have identical key sets', () => {
    const en = Object.keys(ui.en).sort();
    const es = Object.keys(ui.es).sort();
    expect(es).toEqual(en);
  });
  it('no empty strings', () => {
    for (const loc of ['en', 'es'] as const)
      for (const [k, v] of Object.entries(ui[loc])) expect(v, `${loc}.${k}`).not.toBe('');
  });
});

describe('useTranslations', () => {
  it('returns the locale string', () => {
    const t = useTranslations('es');
    expect(t('nav.about')).toBe(ui.es['nav.about']);
  });
});
