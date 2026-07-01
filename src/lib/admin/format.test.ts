import { describe, it, expect } from 'vitest';
import { truncate, formatLocation, tokenTotal } from './format';

describe('admin format helpers', () => {
  it('truncate adds an ellipsis past the limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
    expect(truncate('hello world', 5)).toBe('hello…');
  });
  it('formatLocation joins city and country, falls back to Unknown', () => {
    expect(formatLocation('ES', 'Marbella')).toBe('Marbella, ES');
    expect(formatLocation('ES', null)).toBe('ES');
    expect(formatLocation(null, null)).toBe('Unknown');
  });
  it('tokenTotal sums input and output', () => {
    expect(tokenTotal({ input_tokens: 10, output_tokens: 5 })).toBe(15);
  });
});
