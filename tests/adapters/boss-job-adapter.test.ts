import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

import {JSDOM} from 'jsdom';
import {describe, expect, it, vi} from 'vitest';

import {bossJobAdapter} from '../../src/adapters/boss-job-adapter';
import {validateJobRecord} from '../../src/domain/validate';

function fixture(name: string, url: string): Document {
  const html = readFileSync(
    resolve(import.meta.dirname, `../../fixtures/boss/${name}.html`),
    'utf8',
  );
  return new JSDOM(html, {url}).window.document;
}

describe('bossJobAdapter', () => {
  it('extracts an agency-listed job and removes the agency label', () => {
    const url = 'https://www.zhipin.com/job_detail/synthetic-agency-001.html';
    const result = bossJobAdapter.extract({
      url,
      document: fixture('agency-listing', url),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft).toMatchObject({
        sourceJobId: 'synthetic-agency-001',
        jobTitle: 'AI Agent 产品经理',
        companyName: '远航软件科技',
      });
      expect(
        validateJobRecord(result.draft, '2026-08-11T00:00:00.000Z', '0.1.0').ok,
      ).toBe(true);
    }
  });

  it('extracts the current BOSS detail-page structure without confusing nearby fields', () => {
    const url =
      'https://www.zhipin.com/job_detail/synthetic-current-001.html?ka=search_list';
    const result = bossJobAdapter.extract({
      url,
      document: fixture('current-structure', url),
    });

    expect(result).toEqual({
      ok: true,
      draft: {
        sourceSite: 'boss',
        sourceJobId: 'synthetic-current-001',
        sourceUrl: url,
        jobTitle: 'AI 产品架构师',
        companyName: '星河创新科技',
        salary: '30-50K·15薪',
        location: '北京',
        experience: '5-10年',
        education: '本科',
        jobDescription: '负责虚构 AI 产品架构设计。\n推动跨团队交付与评测。',
        companyDescription: '一家用于课程测试的虚构技术公司。\n所有信息均为合成内容。',
      },
    });
  });

  it('extracts a complete synthetic job without network access or DOM mutation', () => {
    const url =
      'https://www.zhipin.com/job_detail/synthetic-boss-001.html?utm_source=fixture';
    const pageDocument = fixture('complete', url);
    const before = pageDocument.documentElement.outerHTML;
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = bossJobAdapter.extract({url, document: pageDocument});

    expect(result).toEqual({
      ok: true,
      draft: {
        sourceSite: 'boss',
        sourceJobId: 'synthetic-boss-001',
        sourceUrl: url,
        jobTitle: '高级 AI 产品经理',
        companyName: '星河创新科技',
        salary: '25-40K·14薪',
        location: '北京·海淀区',
        experience: '3-5年',
        education: '本科',
        jobDescription: '负责虚构 AI 产品的规划与落地。\n\n推进评测、实验与跨团队协作。',
        companyDescription: '一家专注于虚构生产力工具的课程示例公司。',
      },
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(pageDocument.documentElement.outerHTML).toBe(before);
    fetchSpy.mockRestore();
  });

  it('allows optional fields to be absent and records them during validation', () => {
    const url = 'https://www.zhipin.com/job_detail/synthetic-boss-002.html';
    const result = bossJobAdapter.extract({
      url,
      document: fixture('optional-missing', url),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const validated = validateJobRecord(
        result.draft,
        '2026-08-10T08:00:00.000Z',
        '0.1.0',
      );
      expect(validated.ok).toBe(true);
      if (validated.ok) {
        expect(validated.record.missingFields).toEqual([
          'salary',
          'experience',
          'education',
          'company_description',
        ]);
      }
    }
  });

  it('surfaces a missing required description through domain validation', () => {
    const url = 'https://www.zhipin.com/job_detail/synthetic-boss-003.html';
    const result = bossJobAdapter.extract({
      url,
      document: fixture('required-missing', url),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(
        validateJobRecord(result.draft, '2026-08-10T08:00:00.000Z', '0.1.0'),
      ).toEqual({
        ok: false,
        code: 'MISSING_REQUIRED_FIELDS',
        missingFields: ['job_description'],
      });
    }
  });

  it('rejects unsupported URLs and known-page selector failures explicitly', () => {
    const unsupported = fixture(
      'complete',
      'https://example.test/job_detail/synthetic-boss-001.html',
    );
    expect(bossJobAdapter.canHandle({url: unsupported.URL, document: unsupported})).toBe(
      false,
    );

    const broken = new JSDOM('<main><h1>Changed layout</h1></main>', {
      url: 'https://www.zhipin.com/job_detail/synthetic-boss-004.html',
    }).window.document;
    expect(bossJobAdapter.extract({url: broken.URL, document: broken})).toEqual({
      ok: false,
      code: 'EXTRACTION_FAILED',
    });
  });

  it('contains only synthetic fixture content and no personal-data selectors', () => {
    for (const name of [
      'complete',
      'current-structure',
      'agency-listing',
      'optional-missing',
      'required-missing',
    ]) {
      const html = readFileSync(
        resolve(import.meta.dirname, `../../fixtures/boss/${name}.html`),
        'utf8',
      );
      expect(html).not.toMatch(/招聘者|手机号|微信|cookie|chat-record/iu);
    }
  });
});
