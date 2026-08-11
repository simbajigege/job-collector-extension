import {describe, expect, it} from 'vitest';

import {createAdapterRegistry} from '../../src/adapters/registry';
import type {JobSourceAdapter} from '../../src/adapters/types';

function fakeAdapter(sourceSite: string, supported: boolean): JobSourceAdapter {
  return {
    sourceSite,
    canHandle: () => supported,
    extract: () => ({ok: false, code: 'EXTRACTION_FAILED'}),
  };
}

describe('adapter registry', () => {
  it('selects only an adapter that explicitly supports the page', () => {
    const supported = fakeAdapter('supported', true);
    const registry = createAdapterRegistry([
      fakeAdapter('unsupported', false),
      supported,
    ]);

    expect(registry.find({url: 'https://example.test/job/1', document})).toBe(supported);
  });

  it('returns undefined without a heuristic fallback', () => {
    const registry = createAdapterRegistry([fakeAdapter('unsupported', false)]);

    expect(
      registry.find({url: 'https://example.test/profile', document}),
    ).toBeUndefined();
  });
});
