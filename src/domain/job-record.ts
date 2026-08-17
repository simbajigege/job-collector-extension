export const SCHEMA_VERSION = '1' as const;

export interface JobRecordDraft {
  sourceSite: string;
  sourceJobId: string;
  sourceUrl: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  location: string;
  experience: string;
  education: string;
  jobDescription: string;
  companyDescription: string;
}

export interface JobRecord extends JobRecordDraft {
  schemaVersion: typeof SCHEMA_VERSION;
  note?: string;
  missingFields: string[];
  collectedAt: string;
  collectorVersion: string;
}

export type RequiredFieldName =
  'source_site' | 'source_url' | 'job_title' | 'company_name' | 'job_description';

export type ValidationResult =
  | {ok: true; record: JobRecord}
  | {
      ok: false;
      code: 'MISSING_REQUIRED_FIELDS';
      missingFields: RequiredFieldName[];
    };
