import {normalizeSingleLine, normalizeSourceUrl} from './normalize';

export interface DedupeKeyInput {
  sourceSite: string;
  sourceJobId: string;
  sourceUrl: string;
}

export function createDedupeKey(input: DedupeKeyInput): string {
  const sourceSite = normalizeSingleLine(input.sourceSite).toLowerCase();
  const sourceJobId = normalizeSingleLine(input.sourceJobId);
  const identity = sourceJobId || normalizeSourceUrl(input.sourceUrl);

  return `${sourceSite}:${identity}`;
}
