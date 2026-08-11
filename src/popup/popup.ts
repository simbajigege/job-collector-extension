import {downloadJobsAsCsv} from '../export/download';
import type {JobRecord} from '../domain/job-record';
import type {ExtensionRequest, ExtensionResponse} from '../shared/messages';
import './popup.css';

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing side panel element: ${selector}`);
  return element;
}

const collectButton = requireElement<HTMLButtonElement>('#collect');
const exportButton = requireElement<HTMLButtonElement>('#export');
const clearButton = requireElement<HTMLButtonElement>('#clear');
const countElement = requireElement<HTMLElement>('#job-count');
const listElement = requireElement<HTMLTableSectionElement>('#job-list');
const JOB_SITE_ORIGINS = ['https://zhipin.com/*', 'https://www.zhipin.com/*'];

let currentCount = 0;
let isBusy = false;
const feedbackTimers = new WeakMap<HTMLButtonElement, number>();

const fieldLabels: Record<string, string> = {
  source_site: '来源网站',
  source_url: '来源链接',
  job_title: '职位名称',
  company_name: '公司名称',
  job_description: '职位描述',
};

function setCount(count: number): void {
  currentCount = count;
  countElement.textContent = `已收集 ${count} 个职位`;
  exportButton.disabled = isBusy || count === 0;
  clearButton.disabled = isBusy || count === 0;
}

function renderJobs(records: JobRecord[]): void {
  listElement.replaceChildren();

  if (records.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.className = 'empty-list';
    cell.colSpan = 3;
    cell.textContent = '暂无已收集职位';
    row.append(cell);
    listElement.append(row);
    return;
  }

  for (const [index, record] of records.entries()) {
    const row = document.createElement('tr');
    const indexCell = document.createElement('td');
    const companyCell = document.createElement('td');
    const jobCell = document.createElement('td');

    indexCell.className = 'index-cell';
    indexCell.textContent = String(index + 1).padStart(2, '0');
    companyCell.textContent = record.companyName;
    companyCell.title = record.companyName;
    jobCell.textContent = record.jobTitle;
    jobCell.title = record.jobTitle;

    row.append(indexCell, companyCell, jobCell);
    listElement.append(row);
  }
}

function setBusy(busy: boolean): void {
  isBusy = busy;
  collectButton.disabled = busy;
  exportButton.disabled = busy || currentCount === 0;
  clearButton.disabled = busy || currentCount === 0;
}

function showButtonFeedback(
  button: HTMLButtonElement,
  message: string,
  defaultLabel: string,
  tone: 'success' | 'error',
): void {
  const activeTimer = feedbackTimers.get(button);
  if (activeTimer !== undefined) window.clearTimeout(activeTimer);
  button.textContent = message;
  button.dataset.tone = tone;
  const timer = window.setTimeout(() => {
    button.textContent = defaultLabel;
    delete button.dataset.tone;
    feedbackTimers.delete(button);
  }, 1800);
  feedbackTimers.set(button, timer);
}

async function sendRequest(request: ExtensionRequest): Promise<ExtensionResponse> {
  return chrome.runtime.sendMessage(request) as Promise<ExtensionResponse>;
}

async function requestJobSiteAccess(): Promise<boolean> {
  try {
    return await chrome.permissions.request({origins: JOB_SITE_ORIGINS});
  } catch {
    return false;
  }
}

function errorMessage(response: Extract<ExtensionResponse, {ok: false}>): string {
  switch (response.code) {
    case 'UNSUPPORTED_PAGE':
      return '当前页面不受支持。请打开 BOSS 职位详情页后重试。';
    case 'MISSING_REQUIRED_FIELDS':
      return `无法保存：缺少${response.missingFields
        .map((field) => fieldLabels[field] ?? field)
        .join('、')}。`;
    case 'NO_ACTIVE_TAB':
    case 'UNSUPPORTED_TAB':
      return '无法读取当前标签页。请打开普通网页后重试。';
    case 'EXTRACTION_FAILED':
      return '页面结构暂时无法识别，未保存任何数据。';
    case 'INJECTION_FAILED':
      return '无法读取当前页面。请刷新页面并再次点击收集。';
    case 'EMPTY_EXPORT':
      return '尚未收集职位，没有生成 CSV 文件。';
    case 'UNKNOWN_ERROR':
      return '操作未完成，请稍后重试。';
  }
}

async function refreshJobs(): Promise<void> {
  try {
    const response = await sendRequest({type: 'EXPORT_JOBS'});
    if (response.ok && response.type === 'EXPORT_RESULT') {
      setCount(response.records.length);
      renderJobs(response.records);
    }
  } catch {
    setCount(0);
    renderJobs([]);
  }
}

collectButton.addEventListener('click', () => {
  void (async () => {
    const siteAccessGranted = await requestJobSiteAccess();
    if (!siteAccessGranted) {
      collectButton.title = '需要允许 JobCollector 读取 BOSS 职位详情页。';
      showButtonFeedback(collectButton, '需要允许页面访问', '收集当前职位', 'error');
      return;
    }

    setBusy(true);
    collectButton.textContent = '正在收集…';
    delete collectButton.dataset.tone;
    collectButton.removeAttribute('title');
    try {
      const response = await sendRequest({type: 'COLLECT_CURRENT_JOB'});
      if (!response.ok) {
        collectButton.title = errorMessage(response);
        showButtonFeedback(
          collectButton,
          response.code === 'UNSUPPORTED_PAGE' ? '请打开职位详情页' : '收集失败，请重试',
          '收集当前职位',
          'error',
        );
        return;
      }
      if (response.type === 'COLLECT_RESULT') {
        await refreshJobs();
        showButtonFeedback(
          collectButton,
          response.action === 'added' ? '已收集' : '已更新',
          '收集当前职位',
          'success',
        );
      }
    } catch {
      collectButton.title = '无法连接扩展后台，请关闭弹窗后重试。';
      showButtonFeedback(collectButton, '收集失败，请重试', '收集当前职位', 'error');
    } finally {
      setBusy(false);
    }
  })();
});

exportButton.addEventListener('click', () => {
  void (async () => {
    setBusy(true);
    exportButton.textContent = '正在生成…';
    delete exportButton.dataset.tone;
    exportButton.removeAttribute('title');
    try {
      const response = await sendRequest({type: 'EXPORT_JOBS'});
      if (!response.ok) {
        exportButton.title = errorMessage(response);
        showButtonFeedback(exportButton, '下载失败', '下载 CSV', 'error');
        return;
      }
      if (response.type === 'EXPORT_RESULT') {
        const result = downloadJobsAsCsv(response.records);
        if (!result.ok) exportButton.title = errorMessage(result);
        showButtonFeedback(
          exportButton,
          result.ok ? '已下载' : '暂无职位',
          '下载 CSV',
          result.ok ? 'success' : 'error',
        );
      }
    } catch {
      exportButton.title = '导出失败，请稍后重试。';
      showButtonFeedback(exportButton, '下载失败', '下载 CSV', 'error');
    } finally {
      setBusy(false);
    }
  })();
});

clearButton.addEventListener('click', () => {
  if (!window.confirm('确定清空全部本地职位数据吗？此操作无法撤销。')) return;

  void (async () => {
    setBusy(true);
    clearButton.removeAttribute('title');
    try {
      const response = await sendRequest({type: 'CLEAR_ALL'});
      if (!response.ok) {
        clearButton.title = errorMessage(response);
        showButtonFeedback(clearButton, '清空失败', '清空', 'error');
        return;
      }
      if (response.type === 'CLEAR_RESULT') {
        await refreshJobs();
        showButtonFeedback(clearButton, '已清空', '清空', 'success');
      }
    } catch {
      clearButton.title = '清空失败，本地数据未被修改。';
      showButtonFeedback(clearButton, '清空失败', '清空', 'error');
    } finally {
      setBusy(false);
    }
  })();
});

void refreshJobs();
