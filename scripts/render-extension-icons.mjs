import {mkdir, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

import {chromium} from '@playwright/test';

const rootDirectory = resolve(import.meta.dirname, '..');
const sourcePath = resolve(rootDirectory, 'public/icons/job-collector.svg');
const outputDirectory = resolve(rootDirectory, 'public/icons');
const sizes = [16, 32, 48];
const source = await readFile(sourcePath, 'utf8');

await mkdir(outputDirectory, {recursive: true});

const browser = await chromium.launch({headless: true});
try {
  const masterPage = await browser.newPage({
    viewport: {width: 128, height: 128},
    deviceScaleFactor: 1,
  });
  await masterPage.setContent(`
    <!doctype html>
    <style>
      html, body {
        width: 128px;
        height: 128px;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }
      svg {
        display: block;
        width: 128px;
        height: 128px;
      }
    </style>
    ${source}
  `);
  await masterPage.screenshot({
    path: resolve(outputDirectory, 'icon-128.png'),
    omitBackground: true,
  });
  await masterPage.close();

  const master = await readFile(resolve(outputDirectory, 'icon-128.png'));
  const masterDataUrl = `data:image/png;base64,${master.toString('base64')}`;

  for (const size of sizes) {
    const page = await browser.newPage({
      viewport: {width: size, height: size},
      deviceScaleFactor: 1,
    });
    await page.setContent(`
      <!doctype html>
      <style>
        html, body {
          width: ${size}px;
          height: ${size}px;
          margin: 0;
          overflow: hidden;
          background: transparent;
        }
        img {
          display: block;
          width: ${size}px;
          height: ${size}px;
        }
      </style>
      <img src="${masterDataUrl}" alt="" />
    `);
    await page.screenshot({
      path: resolve(outputDirectory, `icon-${size}.png`),
      omitBackground: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(`Rendered extension icons: ${[...sizes, 128].join(', ')}px`);
