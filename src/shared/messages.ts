import type {JobRecord} from '../domain/job-record';
import type {DedupeKeyInput} from '../domain/dedupe-key';
import type {JobCollectorError} from './errors';

export type ExtensionRequest =
  | {type: 'COLLECT_CURRENT_JOB'}
  | {type: 'GET_COUNT'}
  | {type: 'EXPORT_JOBS'}
  | ({type: 'UPDATE_JOB_NOTE'; note: string} & DedupeKeyInput)
  | ({type: 'DELETE_JOB'} & DedupeKeyInput)
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
  | {ok: true; type: 'UPDATE_NOTE_RESULT'; updated: boolean}
  | {ok: true; type: 'DELETE_RESULT'; removed: boolean; count: number}
  | {ok: true; type: 'CLEAR_RESULT'; count: 0}
  | JobCollectorError;
