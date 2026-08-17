import {describe, expect, it} from 'vitest';

import type {JobRecord} from '../../src/domain/job-record';
import {CSV_HEADERS, serializeJobsToCsv} from '../../src/export/csv';

function record(overrides: Partial<JobRecord> = {}): JobRecord {
  return {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'job-001',
    sourceUrl: 'https://www.zhipin.com/job_detail/job-001.html',
    jobTitle: '高级 AI 产品经理',
    companyName: '星河创新科技',
    salary: '25-40K',
    location: '北京',
    experience: '3-5年',
    education: '本科',
    jobDescription: '负责产品规划。\n推进评测与迭代。',
    companyDescription: '一家用于课程测试的虚构公司。',
    missingFields: [],
    collectedAt: '2026-08-10T08:00:00.000Z',
    collectorVersion: '0.1.0',
    ...overrides,
  };
}

describe('serializeJobsToCsv', () => {
  it('uses the stable v1 header, BOM, CRLF and quotes every field', () => {
    const csv = serializeJobsToCsv([record()]);
    const expectedHeader = CSV_HEADERS.map((header) => `"${header}"`).join(',');

    expect(csv.startsWith(`\uFEFF${expectedHeader}\r\n`)).toBe(true);
    expect(csv.endsWith('\r\n')).toBe(true);
    expect(csv).toContain('"salary","note","location"');
    expect(csv).toContain('"负责产品规划。\r\n推进评测与迭代。"');
    expect(csv).not.toMatch(/(?<!\r)\n/u);
  });

  it('exports an editable job note', () => {
    const csv = serializeJobsToCsv([record({note: '已投递，周五跟进'})]);

    expect(csv).toContain('"25-40K","已投递，周五跟进","北京"');
  });

  it('escapes commas and double quotes according to RFC 4180', () => {
    const csv = serializeJobsToCsv([
      record({
        jobTitle: '产品经理, AI',
        companyName: '“星河”创新 "Lab"',
      }),
    ]);

    expect(csv).toContain('"产品经理, AI"');
    expect(csv).toContain('"“星河”创新 ""Lab"""');
  });

  it('prefixes dangerous formula text but leaves signed numeric text intact', () => {
    const csv = serializeJobsToCsv([
      record({
        jobTitle: '=HYPERLINK("https://example.invalid")',
        companyName: '+cmd',
        location: '@remote',
        experience: '-not-a-number',
        salary: '-5',
      }),
    ]);

    expect(csv).toContain('"\'=HYPERLINK(""https://example.invalid"")"');
    expect(csv).toContain('"\'+cmd"');
    expect(csv).toContain('"\'@remote"');
    expect(csv).toContain('"\'-not-a-number"');
    expect(csv).toContain('"-5"');
  });

  it('serializes ten Chinese records in collected-at order', () => {
    const records = Array.from({length: 10}, (_, index) =>
      record({
        sourceJobId: `job-${10 - index}`,
        jobTitle: `职位 ${10 - index}`,
        collectedAt: `2026-08-10T${String(17 - index).padStart(2, '0')}:00:00.000Z`,
      }),
    );
    const csv = serializeJobsToCsv(records);

    expect(csv.indexOf('"职位 1"')).toBeLessThan(csv.indexOf('"职位 10"'));
    expect(csv.match(/"0\.1\.0"\r\n/gu)).toHaveLength(10);
  });
});
