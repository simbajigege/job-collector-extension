import {createDedupeKey} from '../domain/dedupe-key';
import type {JobRecord} from '../domain/job-record';
import type {StorageAdapter} from './storage-adapter';

const STORAGE_KEY = 'jobCollector.jobs.v1';

type StoredJobs = Record<string, JobRecord>;

export interface JobRepository {
  upsert(record: JobRecord): Promise<{action: 'added' | 'updated'}>;
  count(): Promise<number>;
  list(): Promise<JobRecord[]>;
  clear(): Promise<void>;
}

export function createJobRepository(storage: StorageAdapter): JobRepository {
  async function read(): Promise<StoredJobs> {
    return (await storage.get<StoredJobs>(STORAGE_KEY)) ?? {};
  }

  return {
    async upsert(record) {
      const jobs = await read();
      const key = createDedupeKey(record);
      const action = Object.hasOwn(jobs, key) ? 'updated' : 'added';
      jobs[key] = record;
      await storage.set(STORAGE_KEY, jobs);
      return {action};
    },
    async count() {
      return Object.keys(await read()).length;
    },
    async list() {
      return Object.values(await read()).sort((left, right) =>
        left.collectedAt.localeCompare(right.collectedAt),
      );
    },
    async clear() {
      await storage.remove(STORAGE_KEY);
    },
  };
}
