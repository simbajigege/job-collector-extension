import {describe, expect, it} from 'vitest';

import {createDedupeKey} from '../../src/domain/dedupe-key';

describe('createDedupeKey', () => {
  it('prefers the source job id', () => {
    expect(
      createDedupeKey({
        sourceSite: 'boss',
        sourceJobId: 'abc123',
        sourceUrl: 'https://www.zhipin.com/job_detail/old.html',
      }),
    ).toBe('boss:abc123');
  });

  it('falls back to a normalized URL', () => {
    const first = createDedupeKey({
      sourceSite: 'boss',
      sourceJobId: '',
      sourceUrl: 'https://www.zhipin.com/job_detail/abc.html?utm_source=a#one',
    });
    const second = createDedupeKey({
      sourceSite: 'boss',
      sourceJobId: '',
      sourceUrl: 'https://www.zhipin.com/job_detail/abc.html#two',
    });

    expect(first).toBe('boss:https://www.zhipin.com/job_detail/abc.html');
    expect(second).toBe(first);
  });
});
