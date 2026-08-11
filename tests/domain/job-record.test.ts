import {describe, expect, it} from 'vitest';

import type {JobRecordDraft} from '../../src/domain/job-record';
import {validateJobRecord} from '../../src/domain/validate';

const completeDraft: JobRecordDraft = {
  sourceSite: ' boss ',
  sourceJobId: ' example-001 ',
  sourceUrl: 'https://www.zhipin.com/job_detail/example-001.html?utm_source=test#detail',
  jobTitle: ' 高级 AI 产品经理 ',
  companyName: ' 示例科技 ',
  salary: ' 25-40K ',
  location: ' 北京 ',
  experience: ' 3-5年 ',
  education: ' 本科 ',
  jobDescription: ' 负责产品规划。\n\n\n 推进产品迭代。 ',
  companyDescription: ' 一家虚构公司。 ',
};

describe('validateJobRecord', () => {
  it('normalizes a complete draft into schema v1', () => {
    const result = validateJobRecord(completeDraft, '2026-08-10T08:00:00.000Z', '0.1.0');

    expect(result).toEqual({
      ok: true,
      record: {
        schemaVersion: '1',
        sourceSite: 'boss',
        sourceJobId: 'example-001',
        sourceUrl: 'https://www.zhipin.com/job_detail/example-001.html',
        jobTitle: '高级 AI 产品经理',
        companyName: '示例科技',
        salary: '25-40K',
        location: '北京',
        experience: '3-5年',
        education: '本科',
        jobDescription: '负责产品规划。\n\n推进产品迭代。',
        companyDescription: '一家虚构公司。',
        missingFields: [],
        collectedAt: '2026-08-10T08:00:00.000Z',
        collectorVersion: '0.1.0',
      },
    });
  });

  it('rejects a draft missing required fields', () => {
    const result = validateJobRecord(
      {...completeDraft, jobTitle: ' ', jobDescription: '\u200B'},
      '2026-08-10T08:00:00.000Z',
      '0.1.0',
    );

    expect(result).toEqual({
      ok: false,
      code: 'MISSING_REQUIRED_FIELDS',
      missingFields: ['job_title', 'job_description'],
    });
  });

  it('keeps absent optional values empty and records their contract names', () => {
    const result = validateJobRecord(
      {
        ...completeDraft,
        sourceJobId: '',
        salary: '',
        companyDescription: '',
      },
      '2026-08-10T08:00:00.000Z',
      '0.1.0',
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.record.missingFields).toEqual([
        'source_job_id',
        'salary',
        'company_description',
      ]);
    }
  });
});
