const SIGNED_NUMBER = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u;

export function protectCsvCell(value: string): string {
  if (!/^[=+\-@]/u.test(value)) return value;
  if (SIGNED_NUMBER.test(value)) return value;
  return `'${value}`;
}
