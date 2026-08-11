import {describe, expect, it} from 'vitest';

import {
  normalizeDescription,
  normalizeSingleLine,
  normalizeSourceUrl,
} from '../../src/domain/normalize';

describe('normalization', () => {
  it('normalizes single-line whitespace and invisible characters', () => {
    expect(normalizeSingleLine('  高级\u00a0AI\u200B 产品经理\t ')).toBe(
      '高级 AI 产品经理',
    );
  });

  it('preserves meaningful paragraphs while trimming noisy blank lines', () => {
    expect(normalizeDescription(' 第一段  \r\n\r\n\r\n\r\n  第二段\n  第三行 ')).toBe(
      '第一段\n\n第二段\n第三行',
    );
  });

  it('removes fragments and known tracking parameters without guessing the path', () => {
    expect(
      normalizeSourceUrl(
        'https://www.zhipin.com/job_detail/abc123.html?utm_source=course&ka=search_list_1&ref=keep#company',
      ),
    ).toBe('https://www.zhipin.com/job_detail/abc123.html?ref=keep');
  });

  it('rejects non-http URLs', () => {
    expect(normalizeSourceUrl('chrome://extensions')).toBe('');
    expect(normalizeSourceUrl('not a url')).toBe('');
  });
});
