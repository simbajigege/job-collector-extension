import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

import {JSDOM} from 'jsdom';
import {describe, expect, it} from 'vitest';

import {collectJobFromPage} from '../../src/content/collect-page';

function page(name: string, url: string): Document {
  return new JSDOM(
    readFileSync(
      resolve(import.meta.dirname, `../../fixtures/boss/${name}.html`),
      'utf8',
    ),
    {url},
  ).window.document;
}

describe('collectJobFromPage', () => {
  it('returns exactly one validated job from the current page', () => {
    const url = 'https://www.zhipin.com/job_detail/synthetic-boss-001.html';
    const result = collectJobFromPage(
      {url, document: page('complete', url)},
      '2026-08-10T08:00:00.000Z',
      '0.1.0',
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.record.sourceJobId).toBe('synthetic-boss-001');
      expect(result.record.jobTitle).toBe('高级 AI 产品经理');
    }
  });

  it('returns an unsupported-page error without a fallback adapter', () => {
    const url = 'https://example.test/jobs/1';
    expect(
      collectJobFromPage(
        {url, document: new JSDOM('<h1>Job</h1>', {url}).window.document},
        '2026-08-10T08:00:00.000Z',
        '0.1.0',
      ),
    ).toEqual({ok: false, code: 'UNSUPPORTED_PAGE'});
  });

  it('returns contract field names when required fields are absent', () => {
    const url = 'https://www.zhipin.com/job_detail/synthetic-boss-003.html';
    expect(
      collectJobFromPage(
        {url, document: page('required-missing', url)},
        '2026-08-10T08:00:00.000Z',
        '0.1.0',
      ),
    ).toEqual({
      ok: false,
      code: 'MISSING_REQUIRED_FIELDS',
      missingFields: ['job_description'],
    });
  });
});
