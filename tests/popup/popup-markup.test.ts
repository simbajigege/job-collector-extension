import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

import {JSDOM} from 'jsdom';
import {describe, expect, it} from 'vitest';

describe('side panel markup', () => {
  const popup = new JSDOM(
    readFileSync(resolve(import.meta.dirname, '../../popup.html'), 'utf8'),
  ).window.document;

  it('starts with the collect action and has the three specified buttons', () => {
    expect(popup.querySelector('.brand-block')).toBeNull();
    expect(popup.querySelector('.brand-mark')).toBeNull();
    expect(popup.querySelector('h1')).toBeNull();
    expect(popup.querySelector('main')?.getAttribute('aria-label')).toBe(
      'JobCollector 职位收集器',
    );
    expect(
      [...popup.querySelectorAll('button')].map((button) => button.textContent?.trim()),
    ).toEqual(['收集当前职位', '下载 CSV', '清空']);
  });

  it('places the collect action before the count card', () => {
    const collect = popup.querySelector('#collect');
    const count = popup.querySelector('.count-card');
    if (!collect || !count) throw new Error('Missing side panel action or count card.');
    expect(collect.compareDocumentPosition(count) & 4).toBeTruthy();
    expect(popup.querySelector('#job-count')?.textContent).toContain('0');
  });

  it('provides a company and job list with row actions', () => {
    expect(
      [...popup.querySelectorAll('th')].map((heading) => heading.textContent?.trim()),
    ).toEqual(['#', '公司', '职位', '薪资', '备注', '操作']);
    expect(popup.querySelector('#job-list .empty-list')?.textContent).toContain(
      '暂无已收集职位',
    );
  });

  it('removes the annotated helper and status copy', () => {
    expect(popup.querySelector('.eyebrow')).toBeNull();
    expect(popup.querySelector('.boundary-note')).toBeNull();
    expect(popup.querySelector('.status-message')).toBeNull();
    expect(popup.querySelector('footer')).toBeNull();
  });
});
