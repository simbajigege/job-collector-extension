import type {JobRecord} from '../domain/job-record';
import type {JobCollectorError} from './errors';

export type ExtensionRequest =
  | {type: 'COLLECT_CURRENT_JOB'}
  | {type: 'GET_COUNT'}
  | {type: 'EXPORT_JOBS'}
  | {type: 'CLEAR_ALL'};

export type ContentCollectionResult =
  | {ok: true; record: JobRecord}
  | Extract<
      JobCollectorError,
      {
        code: 'UNSUPPORTED_PAGE' | 'EXTRACTION_FAILED' | 'MISSING_REQUIRED_FIELDS';
      }
    >;

export type ExtensionResponse =
  | {
      ok: true;
      type: 'COLLECT_RESULT';
      action: 'added' | 'updated';
      record: JobRecord;
      count: number;
    }
  | {ok: true; type: 'COUNT_RESULT'; count: number}
  | {ok: true; type: 'EXPORT_RESULT'; records: JobRecord[]}
  | {ok: true; type: 'CLEAR_RESULT'; count: 0}
  | JobCollectorError;
