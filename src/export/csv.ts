import type {JobRecord} from '../domain/job-record';
import {protectCsvCell} from './csv-security';

export const CSV_HEADERS = [
  'schema_version',
  'source_site',
  'source_job_id',
  'source_url',
  'job_title',
  'company_name',
  'salary',
  'location',
  'experience',
  'education',
  'job_description',
  'company_description',
  'missing_fields',
  'collected_at',
  'collector_version',
] as const;

function recordCells(record: JobRecord): string[] {
  return [
    record.schemaVersion,
    record.sourceSite,
    record.sourceJobId,
    record.sourceUrl,
    record.jobTitle,
    record.companyName,
    record.salary,
    record.location,
    record.experience,
    record.education,
    record.jobDescription,
    record.companyDescription,
    record.missingFields.join(';'),
    record.collectedAt,
    record.collectorVersion,
  ];
}

function quote(value: string): string {
  const normalizedNewlines = protectCsvCell(value)
    .replace(/\r\n?/gu, '\n')
    .replace(/\n/gu, '\r\n');
  return `"${normalizedNewlines.replace(/"/gu, '""')}"`;
}

export function serializeJobsToCsv(records: readonly JobRecord[]): string {
  const sorted = [...records].sort((left, right) =>
    left.collectedAt.localeCompare(right.collectedAt),
  );
  const rows = [
    CSV_HEADERS.map(quote),
    ...sorted.map((record) => recordCells(record).map(quote)),
  ];
  return `\uFEFF${rows.map((row) => row.join(',')).join('\r\n')}\r\n`;
}
