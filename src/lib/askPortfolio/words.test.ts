import { describe, it, expect } from 'vitest';
import { splitIntoWords } from './words';

describe('splitIntoWords', () => {
  it('returns [] for empty string', () => {
    expect(splitIntoWords('')).toEqual([]);
  });

  it('keeps trailing whitespace attached to each word', () => {
    expect(splitIntoWords('Sergio ships.')).toEqual(['Sergio ', 'ships.']);
  });

  it('preserves multiple spaces and newlines', () => {
    expect(splitIntoWords('a  b')).toEqual(['a  ', 'b']);
    expect(splitIntoWords('a\nb')).toEqual(['a\n', 'b']);
  });

  it('keeps a lone trailing space on the final word', () => {
    expect(splitIntoWords('Sergio ')).toEqual(['Sergio ']);
  });

  it('is append-stable as text grows (earlier units unchanged)', () => {
    const grown = splitIntoWords('Sergio ships fast.');
    expect(grown.slice(0, 2)).toEqual(['Sergio ', 'ships ']);
  });
});
