import type {RequiredFieldName} from '../domain/job-record';

export type JobCollectorError =
  | {ok: false; code: 'UNSUPPORTED_PAGE'}
  | {ok: false; code: 'EXTRACTION_FAILED'}
  | {
      ok: false;
      code: 'MISSING_REQUIRED_FIELDS';
      missingFields: RequiredFieldName[];
    }
  | {ok: false; code: 'NO_ACTIVE_TAB'}
  | {ok: false; code: 'UNSUPPORTED_TAB'}
  | {ok: false; code: 'INJECTION_FAILED'}
  | {ok: false; code: 'EMPTY_EXPORT'}
  | {ok: false; code: 'UNKNOWN_ERROR'};
