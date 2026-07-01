/**
 * Split text into render units for the streaming word-fade: each unit is one run of
 * non-whitespace plus its trailing whitespace. As streamed text grows, earlier units stay
 * identical, so React keeps their spans mounted (no re-animation) and only new/last units change.
 */
export function splitIntoWords(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}
