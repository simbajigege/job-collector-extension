import {beforeEach, describe, expect, it} from 'vitest';

import type {JobRecord} from '../../src/domain/job-record';
import {createJobRepository, type JobRepository} from '../../src/storage/job-repository';
import {createMemoryStorageAdapter} from '../../src/storage/storage-adapter';

function record(overrides: Partial<JobRecord> = {}): JobRecord {
  return {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'job-001',
    sourceUrl: 'https://www.zhipin.com/job_detail/job-001.html',
    jobTitle: 'AI 产品经理',
    companyName: '星河创新科技',
    salary: '25-40K',
    location: '北京',
    experience: '3-5年',
    education: '本科',
    jobDescription: '负责虚构产品规划。',
    companyDescription: '虚构公司。',
    missingFields: [],
    collectedAt: '2026-08-10T08:00:00.000Z',
    collectorVersion: '0.1.0',
    ...overrides,
  };
}

describe('job repository', () => {
  let repository: JobRepository;

  beforeEach(() => {
    repository = createJobRepository(createMemoryStorageAdapter());
  });

  it('adds a record and reports the count', async () => {
    await expect(repository.upsert(record())).resolves.toEqual({action: 'added'});
    await expect(repository.count()).resolves.toBe(1);
    await expect(repository.list()).resolves.toEqual([record()]);
  });

  it('updates a duplicate source job id without increasing the count', async () => {
    await repository.upsert(record());
    const updated = record({
      sourceUrl: 'https://www.zhipin.com/job_detail/changed-path.html',
      salary: '30-45K',
      collectedAt: '2026-08-10T09:00:00.000Z',
    });

    await expect(repository.upsert(updated)).resolves.toEqual({action: 'updated'});
    await expect(repository.count()).resolves.toBe(1);
    await expect(repository.list()).resolves.toEqual([updated]);
  });

  it('uses the normalized URL when a source job id is absent', async () => {
    await repository.upsert(
      record({
        sourceJobId: '',
        sourceUrl: 'https://www.zhipin.com/job_detail/fallback.html?utm_source=first#one',
      }),
    );
    await expect(
      repository.upsert(
        record({
          sourceJobId: '',
          sourceUrl: 'https://www.zhipin.com/job_detail/fallback.html#two',
          salary: '面议',
        }),
      ),
    ).resolves.toEqual({action: 'updated'});
    await expect(repository.count()).resolves.toBe(1);
  });

  it('removes one record by its dedupe identity', async () => {
    const first = record();
    const second = record({sourceJobId: 'job-002', jobTitle: '数据产品经理'});
    await repository.upsert(first);
    await repository.upsert(second);

    await expect(repository.remove(first)).resolves.toBe(true);
    await expect(repository.list()).resolves.toEqual([second]);
    await expect(repository.remove(first)).resolves.toBe(false);
  });

  it('updates and preserves a note when the same job is collected again', async () => {
    const original = record();
    await repository.upsert(original);

    await expect(repository.updateNote(original, '已投递，等待反馈')).resolves.toBe(true);
    await repository.upsert(record({salary: '30-45K'}));

    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({salary: '30-45K', note: '已投递，等待反馈'}),
    ]);
  });

  it('lists records in collected-at order and clears all records', async () => {
    await repository.upsert(
      record({sourceJobId: 'later', collectedAt: '2026-08-10T10:00:00.000Z'}),
    );
    await repository.upsert(
      record({sourceJobId: 'earlier', collectedAt: '2026-08-10T07:00:00.000Z'}),
    );

    const records = await repository.list();
    expect(records.map(({sourceJobId}) => sourceJobId)).toEqual(['earlier', 'later']);

    await repository.clear();
    await expect(repository.count()).resolves.toBe(0);
    await expect(repository.list()).resolves.toEqual([]);
  });
});
