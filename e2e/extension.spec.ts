import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

import {
  chromium,
  expect,
  test,
  type BrowserContext,
  type Page,
  type Worker,
} from '@playwright/test';

import type {JobRecord} from '../src/domain/job-record';

const extensionPath = resolve(import.meta.dirname, '../dist');
const fixturePath = resolve(
  import.meta.dirname,
  '../fixtures/boss/current-structure.html',
);

let context: BrowserContext | undefined;
let extensionId: string;
let serviceWorker: Worker;
let userDataDirectory: string;

async function openPanelPage(): Promise<Page> {
  if (!context) throw new Error('Extension browser context is not ready.');
  const panel = await context.newPage();
  await panel.goto(`chrome-extension://${extensionId}/popup.html`);
  return panel;
}

test.beforeAll(async () => {
  userDataDirectory = await mkdtemp(join(tmpdir(), 'job-collector-e2e-'));
  context = await chromium.launchPersistentContext(userDataDirectory, {
    headless: true,
    executablePath: chromium.executablePath(),
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
  const [existingServiceWorker] = context.serviceWorkers();
  serviceWorker = existingServiceWorker ?? (await context.waitForEvent('serviceworker'));
  extensionId = new URL(serviceWorker.url()).host;
});

test.afterAll(async () => {
  await context?.close();
  await rm(userDataDirectory, {recursive: true, force: true});
});

test('configures the toolbar action as a global side panel', async () => {
  const configuration = await serviceWorker.evaluate(async () => {
    const manifest = chrome.runtime.getManifest() as chrome.runtime.Manifest & {
      action?: {default_popup?: string};
      optional_host_permissions?: string[];
      side_panel?: {default_path?: string};
    };
    return {
      behavior: await chrome.sidePanel.getPanelBehavior(),
      defaultPath: manifest.side_panel?.default_path,
      defaultPopup: manifest.action?.default_popup,
      optionalHosts: manifest.optional_host_permissions,
    };
  });

  expect(configuration).toEqual({
    behavior: {openPanelOnActionClick: true},
    defaultPath: 'popup.html',
    defaultPopup: undefined,
    optionalHosts: ['https://zhipin.com/*', 'https://www.zhipin.com/*'],
  });
});

test('extracts one local fixture, persists, updates, exports and clears', async () => {
  if (!context) throw new Error('Extension browser context is not ready.');
  const targetPage = await context.newPage();
  const fixtureHtml = await readFile(fixturePath, 'utf8');
  await targetPage.addInitScript(() => {
    const browserGlobal = globalThis as unknown as {
      chrome?: Record<string, unknown>;
    };
    browserGlobal.chrome ??= {};
    browserGlobal.chrome['runtime'] = {
      getManifest: () => ({version: '0.1.0'}),
    };
  });
  await targetPage.route('https://www.zhipin.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: fixtureHtml,
    }),
  );
  await targetPage.goto(
    'https://www.zhipin.com/job_detail/synthetic-current-001.html?utm_source=e2e',
  );
  await targetPage.addScriptTag({
    path: resolve(extensionPath, 'assets/collect-current-job.js'),
  });
  const extraction = await targetPage.evaluate(() => {
    const browserGlobal = globalThis as typeof globalThis & {
      __JOB_COLLECTOR_RESULT__?: unknown;
    };
    return browserGlobal.__JOB_COLLECTOR_RESULT__;
  });
  expect(extraction).toMatchObject({
    ok: true,
    record: {
      sourceSite: 'boss',
      sourceJobId: 'synthetic-current-001',
      jobTitle: 'AI 产品架构师',
      salary: '30-50K·15薪',
    },
  });
  if (
    !extraction ||
    typeof extraction !== 'object' ||
    !('ok' in extraction) ||
    extraction.ok !== true ||
    !('record' in extraction)
  ) {
    throw new Error('Production content bundle did not return a job record.');
  }
  const firstRecord = extraction.record as JobRecord;
  await serviceWorker.evaluate(async (record) => {
    await chrome.storage.local.set({
      'jobCollector.jobs.v1': {'boss:synthetic-current-001': record},
    });
  }, firstRecord);

  const firstPanel = await openPanelPage();
  await expect(firstPanel.locator('#job-count')).toHaveText('已收集 1 个职位');
  await firstPanel.close();

  const updatedRecord = {...firstRecord, salary: '30-45K'};
  await serviceWorker.evaluate(async (record) => {
    await chrome.storage.local.set({
      'jobCollector.jobs.v1': {'boss:synthetic-current-001': record},
    });
  }, updatedRecord);
  const updatePanel = await openPanelPage();
  await expect(updatePanel.locator('#job-count')).toHaveText('已收集 1 个职位');
  await updatePanel.close();

  const persistedPanel = await openPanelPage();
  await expect(persistedPanel.locator('#job-count')).toHaveText('已收集 1 个职位');
  await persistedPanel.screenshot({path: '/private/tmp/jobcollector-side-panel.png'});

  const downloadPromise = persistedPanel.waitForEvent('download');
  const collectedJob = persistedPanel.locator('#job-list tr');
  await expect(collectedJob).toHaveCount(1);
  await expect(collectedJob).toContainText('星河创新科技');
  await expect(collectedJob).toContainText('AI 产品架构师');

  await persistedPanel.getByRole('button', {name: '下载 CSV'}).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(
    /^job-collector-\d{4}-\d{2}-\d{2}-\d{4}\.csv$/u,
  );
  const csv = await readFile(await download.path(), 'utf8');
  expect(csv.startsWith('\uFEFF"schema_version"')).toBe(true);
  expect(csv).toContain('"30-45K"');

  persistedPanel.once('dialog', (dialog) => dialog.accept());
  await persistedPanel.getByRole('button', {name: '清空'}).click();
  await expect(persistedPanel.locator('#job-count')).toHaveText('已收集 0 个职位');
  await targetPage.close();
});
