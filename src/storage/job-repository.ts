import {createDedupeKey, type DedupeKeyInput} from '../domain/dedupe-key';
import type {JobRecord} from '../domain/job-record';
import type {StorageAdapter} from './storage-adapter';

const STORAGE_KEY = 'jobCollector.jobs.v1';

type StoredJobs = Record<string, JobRecord>;

export interface JobRepository {
  upsert(record: JobRecord): Promise<{action: 'added' | 'updated'}>;
  updateNote(input: DedupeKeyInput, note: string): Promise<boolean>;
  remove(input: DedupeKeyInput): Promise<boolean>;
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
      const existingNote = jobs[key]?.note;
      jobs[key] = existingNote === undefined ? record : {...record, note: existingNote};
      await storage.set(STORAGE_KEY, jobs);
      return {action};
    },
    async updateNote(input, note) {
      const jobs = await read();
      const key = createDedupeKey(input);
      const record = jobs[key];
      if (!record) return false;

      jobs[key] = {...record, note};
      await storage.set(STORAGE_KEY, jobs);
      return true;
    },
    async remove(input) {
      const jobs = await read();
      const key = createDedupeKey(input);
      if (!Object.hasOwn(jobs, key)) return false;

      delete jobs[key];
      if (Object.keys(jobs).length === 0) {
        await storage.remove(STORAGE_KEY);
      } else {
        await storage.set(STORAGE_KEY, jobs);
      }
      return true;
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
