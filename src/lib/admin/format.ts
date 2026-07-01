export function truncate(text: string, n: number): string {
  return text.length > n ? text.slice(0, n) + '…' : text;
}

export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatLocation(country: string | null, city: string | null): string {
  return [city, country].filter(Boolean).join(', ') || 'Unknown';
}

export function tokenTotal(item: { input_tokens: number; output_tokens: number }): number {
  return item.input_tokens + item.output_tokens;
}
