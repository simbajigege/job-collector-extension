import type {JobRecordDraft} from '../domain/job-record';

export interface PageContext {
  url: string;
  document: Document;
}

export type ExtractionResult =
  {ok: true; draft: JobRecordDraft} | {ok: false; code: 'EXTRACTION_FAILED'};

export interface JobSourceAdapter {
  readonly sourceSite: string;
  canHandle(context: PageContext): boolean;
  extract(context: PageContext): ExtractionResult;
}
