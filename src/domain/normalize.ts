const INVISIBLE_CHARACTERS = /[\u200B-\u200D\u2060\uFEFF]/gu;
const TRACKING_PARAMETER_NAMES = new Set([
  'from',
  'ka',
  'lid',
  'securityid',
  'sessionid',
  'spm',
  'trackid',
]);

function normalizeUnicodeWhitespace(value: string): string {
  return value.replace(INVISIBLE_CHARACTERS, '').replace(/\u00a0/gu, ' ');
}

export function normalizeSingleLine(value: string): string {
  return normalizeUnicodeWhitespace(value).replace(/\s+/gu, ' ').trim();
}

export function normalizeDescription(value: string): string {
  const lines = normalizeUnicodeWhitespace(value)
    .replace(/\r\n?/gu, '\n')
    .split('\n')
    .map((line) => line.trim().replace(/[\t ]+/gu, ' '));

  return lines
    .join('\n')
    .trim()
    .replace(/\n{3,}/gu, '\n\n');
}

export function normalizeSourceUrl(value: string): string {
  try {
    const url = new URL(normalizeSingleLine(value));
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';

    url.hash = '';
    for (const name of [...url.searchParams.keys()]) {
      const lowerName = name.toLowerCase();
      if (lowerName.startsWith('utm_') || TRACKING_PARAMETER_NAMES.has(lowerName)) {
        url.searchParams.delete(name);
      }
    }

    return url.toString();
  } catch {
    return '';
  }
}
