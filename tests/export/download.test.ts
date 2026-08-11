import {describe, expect, it, vi} from 'vitest';

import type {JobRecord} from '../../src/domain/job-record';
import {createCsvFilename, downloadJobsAsCsv} from '../../src/export/download';

describe('CSV download', () => {
  it('creates the specified local-time filename', () => {
    expect(createCsvFilename(new Date(2026, 7, 10, 9, 7))).toBe(
      'job-collector-2026-08-10-0907.csv',
    );
  });

  it('does not create an empty download', () => {
    const createObjectURL = vi.fn();
    expect(
      downloadJobsAsCsv([], {
        document,
        createObjectURL,
        revokeObjectURL: vi.fn(),
        now: new Date(2026, 7, 10, 9, 7),
      }),
    ).toEqual({ok: false, code: 'EMPTY_EXPORT'});
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('downloads a Blob and revokes its object URL', () => {
    const click = vi.fn();
    const anchor = document.createElement('a');
    anchor.click = click;
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    const createObjectURL = vi.fn(() => 'blob:job-csv');
    const revokeObjectURL = vi.fn();
    const minimalRecord = {
      schemaVersion: '1',
      sourceSite: 'boss',
      sourceJobId: '',
      sourceUrl: 'https://www.zhipin.com/job_detail/job.html',
      jobTitle: '产品经理',
      companyName: '示例公司',
      salary: '',
      location: '',
      experience: '',
      education: '',
      jobDescription: '虚构描述',
      companyDescription: '',
      missingFields: [],
      collectedAt: '2026-08-10T08:00:00.000Z',
      collectorVersion: '0.1.0',
    } satisfies JobRecord;

    expect(
      downloadJobsAsCsv([minimalRecord], {
        document,
        createObjectURL,
        revokeObjectURL,
        now: new Date(2026, 7, 10, 9, 7),
      }),
    ).toEqual({ok: true, filename: 'job-collector-2026-08-10-0907.csv'});
    expect(anchor.download).toBe('job-collector-2026-08-10-0907.csv');
    expect(anchor.href).toBe('blob:job-csv');
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:job-csv');
    createElement.mockRestore();
  });
});
