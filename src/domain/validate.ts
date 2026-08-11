import {
  SCHEMA_VERSION,
  type JobRecordDraft,
  type RequiredFieldName,
  type ValidationResult,
} from './job-record';
import {normalizeDescription, normalizeSingleLine, normalizeSourceUrl} from './normalize';

const REQUIRED_FIELDS: ReadonlyArray<{
  key: keyof JobRecordDraft;
  contractName: RequiredFieldName;
}> = [
  {key: 'sourceSite', contractName: 'source_site'},
  {key: 'sourceUrl', contractName: 'source_url'},
  {key: 'jobTitle', contractName: 'job_title'},
  {key: 'companyName', contractName: 'company_name'},
  {key: 'jobDescription', contractName: 'job_description'},
];

const OPTIONAL_FIELDS: ReadonlyArray<{
  key: keyof JobRecordDraft;
  contractName: string;
}> = [
  {key: 'sourceJobId', contractName: 'source_job_id'},
  {key: 'salary', contractName: 'salary'},
  {key: 'location', contractName: 'location'},
  {key: 'experience', contractName: 'experience'},
  {key: 'education', contractName: 'education'},
  {key: 'companyDescription', contractName: 'company_description'},
];

function normalizeDraft(draft: JobRecordDraft): JobRecordDraft {
  return {
    sourceSite: normalizeSingleLine(draft.sourceSite).toLowerCase(),
    sourceJobId: normalizeSingleLine(draft.sourceJobId),
    sourceUrl: normalizeSourceUrl(draft.sourceUrl),
    jobTitle: normalizeSingleLine(draft.jobTitle),
    companyName: normalizeSingleLine(draft.companyName),
    salary: normalizeSingleLine(draft.salary),
    location: normalizeSingleLine(draft.location),
    experience: normalizeSingleLine(draft.experience),
    education: normalizeSingleLine(draft.education),
    jobDescription: normalizeDescription(draft.jobDescription),
    companyDescription: normalizeDescription(draft.companyDescription),
  };
}

export function validateJobRecord(
  draft: JobRecordDraft,
  collectedAt: string,
  collectorVersion: string,
): ValidationResult {
  const normalized = normalizeDraft(draft);
  const missingRequired = REQUIRED_FIELDS.filter(
    ({key}) => normalized[key].length === 0,
  ).map(({contractName}) => contractName);

  if (missingRequired.length > 0) {
    return {
      ok: false,
      code: 'MISSING_REQUIRED_FIELDS',
      missingFields: missingRequired,
    };
  }

  const missingFields = OPTIONAL_FIELDS.filter(
    ({key}) => normalized[key].length === 0,
  ).map(({contractName}) => contractName);

  return {
    ok: true,
    record: {
      schemaVersion: SCHEMA_VERSION,
      ...normalized,
      missingFields,
      collectedAt,
      collectorVersion,
    },
  };
}
