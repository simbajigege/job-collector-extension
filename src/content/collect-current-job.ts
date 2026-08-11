import {collectJobFromPage} from './collect-page';

declare global {
  var __JOB_COLLECTOR_RESULT__: ReturnType<typeof collectJobFromPage> | undefined;
}

globalThis.__JOB_COLLECTOR_RESULT__ = collectJobFromPage(
  {url: location.href, document},
  new Date().toISOString(),
  chrome.runtime.getManifest().version,
);
