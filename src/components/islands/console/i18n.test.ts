import { describe, it, expect } from 'vitest';
import { consoleUi } from './i18n';

describe('console i18n', () => {
  it('en and es have identical keys', () => {
    expect(Object.keys(consoleUi.es).sort()).toEqual(Object.keys(consoleUi.en).sort());
  });
  it('each locale has 3 starters', () => {
    expect(consoleUi.en.starters).toHaveLength(3);
    expect(consoleUi.es.starters).toHaveLength(3);
  });
});
