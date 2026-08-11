import {normalizeDescription} from '../domain/normalize';
import type {JobSourceAdapter, PageContext} from './types';

const SELECTORS = {
  root: ['.job-banner .job-primary.detail-box', '.job-detail-box'],
  jobTitle: [
    '.job-banner .job-primary.detail-box .info-primary .name h1',
    '.job-banner .job-name',
  ],
  companyName: [
    '.job-sider .sider-company .company-info a[ka="job-detail-company_custompage"]',
    '.job-banner .job-primary.detail-box .info-primary .brand-name',
    '.company-info .company-name',
  ],
  salary: [
    '.job-banner .job-primary.detail-box .info-primary .name .salary',
    '.job-banner .salary',
  ],
  location: [
    '.job-banner .job-primary.detail-box .info-primary .text-city',
    '.job-attributes [data-field="location"]',
  ],
  experience: [
    '.job-banner .job-primary.detail-box .info-primary .text-experiece',
    '.job-banner .job-primary.detail-box .info-primary .text-experience',
    '.job-attributes [data-field="experience"]',
  ],
  education: [
    '.job-banner .job-primary.detail-box .info-primary .text-degree',
    '.job-attributes [data-field="education"]',
  ],
  jobDescription: [
    '.job-detail > .job-detail-section:not(.job-detail-company) .job-sec-text',
    '.job-detail-section .job-sec-text',
  ],
  companyDescription: [
    '.job-detail-company .company-info-box .job-sec-text',
    '.company-card .company-intro',
  ],
} as const;

function firstElement(
  context: ParentNode,
  selectors: readonly string[],
): Element | undefined {
  return selectors
    .map((selector) => context.querySelector(selector))
    .find((element): element is Element => element !== null);
}

function text(context: ParentNode, selectors: readonly string[]): string {
  for (const selector of selectors) {
    const value = context.querySelector(selector)?.textContent?.trim();
    if (value) return value;
  }
  return '';
}

function companyName(context: ParentNode): string {
  return text(context, SELECTORS.companyName).replace(/^\s*代招公司\s*[：:]\s*/u, '');
}

function textWithBreaks(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR') {
    return '\n';
  }
  return [...node.childNodes].map(textWithBreaks).join('');
}

function description(context: ParentNode, selectors: readonly string[]): string {
  const node = firstElement(context, selectors);
  return node ? normalizeDescription(textWithBreaks(node)) : '';
}

function sourceJobId(context: PageContext, root: Element): string {
  const fromDom = root.getAttribute('data-job-id')?.trim();
  if (fromDom) return fromDom;

  try {
    const match = new URL(context.url).pathname.match(
      /^\/job_detail\/([^/]+?)(?:\.html)?$/u,
    );
    return match?.[1] ?? '';
  } catch {
    return '';
  }
}

export const bossJobAdapter: JobSourceAdapter = {
  sourceSite: 'boss',
  canHandle({url}) {
    try {
      const parsed = new URL(url);
      return (
        (parsed.hostname === 'www.zhipin.com' || parsed.hostname === 'zhipin.com') &&
        /^\/job_detail\/[^/]+(?:\.html)?$/u.test(parsed.pathname)
      );
    } catch {
      return false;
    }
  },
  extract(context) {
    const root = firstElement(context.document, SELECTORS.root);
    if (!root || !this.canHandle(context)) {
      return {ok: false, code: 'EXTRACTION_FAILED'};
    }

    return {
      ok: true,
      draft: {
        sourceSite: this.sourceSite,
        sourceJobId: sourceJobId(context, root),
        sourceUrl: context.url,
        jobTitle: text(context.document, SELECTORS.jobTitle),
        companyName: companyName(context.document),
        salary: text(context.document, SELECTORS.salary),
        location: text(context.document, SELECTORS.location),
        experience: text(context.document, SELECTORS.experience),
        education: text(context.document, SELECTORS.education),
        jobDescription: description(context.document, SELECTORS.jobDescription),
        companyDescription: description(context.document, SELECTORS.companyDescription),
      },
    };
  },
};
