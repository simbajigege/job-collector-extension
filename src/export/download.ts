import type {JobRecord} from '../domain/job-record';
import type {JobCollectorError} from '../shared/errors';
import {serializeJobsToCsv} from './csv';

interface DownloadEnvironment {
  document: Document;
  createObjectURL(blob: Blob): string;
  revokeObjectURL(url: string): void;
  now: Date;
}

export type DownloadResult =
  {ok: true; filename: string} | Extract<JobCollectorError, {code: 'EMPTY_EXPORT'}>;

function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

export function createCsvFilename(now: Date): string {
  const date = [
    now.getFullYear(),
    twoDigits(now.getMonth() + 1),
    twoDigits(now.getDate()),
  ].join('-');
  const time = `${twoDigits(now.getHours())}${twoDigits(now.getMinutes())}`;
  return `job-collector-${date}-${time}.csv`;
}

export function downloadJobsAsCsv(
  records: readonly JobRecord[],
  environment: DownloadEnvironment = {
    document,
    createObjectURL: URL.createObjectURL.bind(URL),
    revokeObjectURL: URL.revokeObjectURL.bind(URL),
    now: new Date(),
  },
): DownloadResult {
  if (records.length === 0) return {ok: false, code: 'EMPTY_EXPORT'};

  const filename = createCsvFilename(environment.now);
  const blob = new Blob([serializeJobsToCsv(records)], {
    type: 'text/csv;charset=utf-8',
  });
  const objectUrl = environment.createObjectURL(blob);
  const anchor = environment.document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  environment.document.body.append(anchor);
  anchor.click();
  anchor.remove();
  environment.revokeObjectURL(objectUrl);

  return {ok: true, filename};
}
