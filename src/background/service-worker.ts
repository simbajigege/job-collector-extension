import type {
  ContentCollectionResult,
  ExtensionRequest,
  ExtensionResponse,
} from '../shared/messages';
import {createJobRepository} from '../storage/job-repository';
import {createChromeStorageAdapter} from '../storage/storage-adapter';

const repository = createJobRepository(createChromeStorageAdapter());

void chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true});

function isHttpUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const {protocol} = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function readInjectedResult(): ContentCollectionResult | undefined {
  const target = globalThis as typeof globalThis & {
    __JOB_COLLECTOR_RESULT__?: ContentCollectionResult;
  };
  const result = target.__JOB_COLLECTOR_RESULT__;
  delete target.__JOB_COLLECTOR_RESULT__;
  return result;
}

async function collectCurrentJob(): Promise<ExtensionResponse> {
  const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (activeTab?.id === undefined) return {ok: false, code: 'NO_ACTIVE_TAB'};
  if (!isHttpUrl(activeTab.url)) return {ok: false, code: 'UNSUPPORTED_TAB'};

  try {
    await chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      files: ['assets/collect-current-job.js'],
    });
    const [injection] = await chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      func: readInjectedResult,
    });
    const result = injection?.result as ContentCollectionResult | undefined;
    if (!result) return {ok: false, code: 'INJECTION_FAILED'};
    if (!result.ok) return result;

    const {action} = await repository.upsert(result.record);
    return {
      ok: true,
      type: 'COLLECT_RESULT',
      action,
      record: result.record,
      count: await repository.count(),
    };
  } catch {
    return {ok: false, code: 'INJECTION_FAILED'};
  }
}

async function handleRequest(request: ExtensionRequest): Promise<ExtensionResponse> {
  switch (request.type) {
    case 'COLLECT_CURRENT_JOB':
      return collectCurrentJob();
    case 'GET_COUNT':
      return {ok: true, type: 'COUNT_RESULT', count: await repository.count()};
    case 'EXPORT_JOBS':
      return {ok: true, type: 'EXPORT_RESULT', records: await repository.list()};
    case 'UPDATE_JOB_NOTE':
      return {
        ok: true,
        type: 'UPDATE_NOTE_RESULT',
        updated: await repository.updateNote(request, request.note),
      };
    case 'DELETE_JOB':
      return {
        ok: true,
        type: 'DELETE_RESULT',
        removed: await repository.remove(request),
        count: await repository.count(),
      };
    case 'CLEAR_ALL':
      await repository.clear();
      return {ok: true, type: 'CLEAR_RESULT', count: 0};
  }
}

chrome.runtime.onMessage.addListener(
  (
    request: ExtensionRequest,
    _sender,
    sendResponse: (response: ExtensionResponse) => void,
  ) => {
    void handleRequest(request)
      .then(sendResponse)
      .catch(() => sendResponse({ok: false, code: 'UNKNOWN_ERROR'}));
    return true;
  },
);
