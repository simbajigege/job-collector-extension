import {mkdtemp, mkdir, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

import {chromium} from '@playwright/test';

const rootDirectory = resolve(import.meta.dirname, '..');
const extensionPath = resolve(rootDirectory, 'dist');
const outputDirectory = resolve(rootDirectory, 'store-assets');
const screenshotDirectory = resolve(outputDirectory, 'screenshots');
const promoDirectory = resolve(outputDirectory, 'promo');
const sourceDirectory = resolve(outputDirectory, 'source');
const userDataDirectory = await mkdtemp(join(tmpdir(), 'jobcollector-store-assets-'));

await Promise.all([
  mkdir(screenshotDirectory, {recursive: true}),
  mkdir(promoDirectory, {recursive: true}),
  mkdir(sourceDirectory, {recursive: true}),
]);

const records = [
  {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'demo-001',
    sourceUrl: 'https://www.zhipin.com/job_detail/demo-001.html',
    jobTitle: 'AI 产品架构师',
    companyName: '星河创新科技',
    salary: '30-45K',
    location: '北京',
    experience: '5-10年',
    education: '本科',
    jobDescription: '负责虚构 AI 产品架构设计。',
    companyDescription: '用于商店截图的虚构公司。',
    missingFields: [],
    collectedAt: '2026-08-11T01:00:00.000Z',
    collectorVersion: '0.1.0',
  },
  {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'demo-002',
    sourceUrl: 'https://www.zhipin.com/job_detail/demo-002.html',
    jobTitle: '智能体产品经理',
    companyName: '远山数据实验室',
    salary: '25-40K',
    location: '上海',
    experience: '3-5年',
    education: '本科',
    jobDescription: '负责虚构智能体产品规划。',
    companyDescription: '用于商店截图的虚构公司。',
    missingFields: [],
    collectedAt: '2026-08-11T01:05:00.000Z',
    collectorVersion: '0.1.0',
  },
  {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'demo-003',
    sourceUrl: 'https://www.zhipin.com/job_detail/demo-003.html',
    jobTitle: 'AI 应用产品负责人',
    companyName: '澄明智能',
    salary: '35-55K',
    location: '深圳',
    experience: '5-10年',
    education: '本科',
    jobDescription: '负责虚构 AI 应用产品交付。',
    companyDescription: '用于商店截图的虚构公司。',
    missingFields: [],
    collectedAt: '2026-08-11T01:10:00.000Z',
    collectorVersion: '0.1.0',
  },
  {
    schemaVersion: '1',
    sourceSite: 'boss',
    sourceJobId: 'demo-004',
    sourceUrl: 'https://www.zhipin.com/job_detail/demo-004.html',
    jobTitle: '产品增长经理',
    companyName: '北辰产品研究院',
    salary: '22-38K',
    location: '杭州',
    experience: '3-5年',
    education: '本科',
    jobDescription: '负责虚构产品增长实验。',
    companyDescription: '用于商店截图的虚构机构。',
    missingFields: [],
    collectedAt: '2026-08-11T01:15:00.000Z',
    collectorVersion: '0.1.0',
  },
];

const workSans = await readFile(
  '/Users/jigege/.agents/skills/canvas-design/canvas-fonts/WorkSans-Regular.ttf',
);
const workSansBold = await readFile(
  '/Users/jigege/.agents/skills/canvas-design/canvas-fonts/WorkSans-Bold.ttf',
);
const fontsCss = `
  @font-face {
    font-family: 'Store Work Sans';
    src: url(data:font/ttf;base64,${workSans.toString('base64')}) format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Store Work Sans';
    src: url(data:font/ttf;base64,${workSansBold.toString('base64')}) format('truetype');
    font-weight: 700;
  }
`;

function baseStyles(width, height) {
  return `
    ${fontsCss}
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    html, body {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      overflow: hidden;
      background: #ffffff;
      color: #0a0a0a;
      font-family: 'Store Work Sans', -apple-system, BlinkMacSystemFont,
        'PingFang SC', 'Microsoft YaHei', sans-serif;
      font-synthesis: none;
    }
  `;
}

function brandMark(size) {
  return `<div style="display:grid;width:${size}px;height:${size}px;place-items:center;border-radius:${Math.round(
    size / 4,
  )}px;background:#171717;color:#fff;font-size:${Math.round(
    size * 0.34,
  )}px;font-weight:700;letter-spacing:-0.05em">JC</div>`;
}

async function render(page, {width, height, html, path}) {
  await page.setViewportSize({width, height});
  await page.setContent(
    `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>${baseStyles(
      width,
      height,
    )}</style></head><body>${html}</body></html>`,
  );
  await page.evaluate(() => globalThis.document.fonts.ready);
  await page.screenshot({path, type: 'png'});
}

const context = await chromium.launchPersistentContext(userDataDirectory, {
  headless: true,
  executablePath: chromium.executablePath(),
  viewport: {width: 440, height: 620},
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
  ],
});

try {
  const [existingWorker] = context.serviceWorkers();
  const serviceWorker = existingWorker ?? (await context.waitForEvent('serviceworker'));
  const extensionId = new URL(serviceWorker.url()).host;
  const storedJobs = Object.fromEntries(
    records.map((record) => [`boss:${record.sourceJobId}`, record]),
  );
  await serviceWorker.evaluate(async (jobs) => {
    await globalThis.chrome.storage.local.set({'jobCollector.jobs.v1': jobs});
  }, storedJobs);

  const panel = await context.newPage();
  await panel.setViewportSize({width: 440, height: 620});
  await panel.goto(`chrome-extension://${extensionId}/popup.html`);
  await panel.locator('#job-count').waitFor({state: 'visible'});
  await panel.screenshot({
    path: resolve(sourceDirectory, 'side-panel-demo-440x620.png'),
    type: 'png',
  });
  const panelPng = await readFile(
    resolve(sourceDirectory, 'side-panel-demo-440x620.png'),
  );
  const panelDataUrl = `data:image/png;base64,${panelPng.toString('base64')}`;
  await panel.close();

  const canvas = await context.newPage();

  await render(canvas, {
    width: 1280,
    height: 800,
    path: resolve(screenshotDirectory, '01-jobcollector-overview-1280x800.png'),
    html: `
      <main style="position:relative;display:grid;grid-template-columns:1fr 500px;width:100%;height:100%;padding:56px 72px 44px;gap:52px">
        <section style="display:flex;flex-direction:column;justify-content:space-between;padding:8px 0 10px">
          <div>
            <div style="display:flex;align-items:center;gap:18px">
              ${brandMark(68)}
              <div style="font-size:18px;font-weight:700;letter-spacing:-0.03em">JobCollector</div>
            </div>
            <div style="width:48px;height:4px;margin:86px 0 26px;background:#ff3700"></div>
            <h1 style="max-width:560px;margin:0;font-size:58px;line-height:1.07;letter-spacing:-0.055em;font-weight:700">把选中的职位<br>收进一个清楚的列表</h1>
            <p style="margin:30px 0 0;color:#737373;font-size:21px;line-height:1.55">一次一条 · 本地保存 · CSV 导出</p>
          </div>
          <div style="display:flex;align-items:center;gap:14px;color:#737373;font-size:14px;letter-spacing:.05em">
            <span style="width:10px;height:10px;border-radius:50%;background:#0348ed"></span>
            DEMO DATA · 全部为虚构信息
          </div>
        </section>
        <section style="position:relative;height:700px;overflow:hidden;border:1px solid #e5e5e5;border-radius:28px;background:#fff">
          <img src="${panelDataUrl}" alt="JobCollector side panel" style="display:block;width:100%;height:auto">
        </section>
      </main>`,
  });

  await render(canvas, {
    width: 440,
    height: 280,
    path: resolve(promoDirectory, '02-small-promo-440x280.png'),
    html: `
      <main style="position:relative;width:100%;height:100%;padding:36px 38px;display:flex;flex-direction:column;justify-content:space-between;border:1px solid #e5e5e5">
        <div style="display:flex;align-items:center;gap:16px">
          ${brandMark(62)}
          <div style="font-size:34px;font-weight:700;letter-spacing:-0.055em">JobCollector</div>
        </div>
        <div>
          <div style="width:36px;height:4px;margin-bottom:16px;background:#ff3700"></div>
          <div style="font-size:20px;font-weight:700;letter-spacing:-0.035em">职位，一次一条</div>
          <div style="margin-top:8px;color:#737373;font-size:14px">本地保存 · CSV 导出</div>
        </div>
      </main>`,
  });

  await render(canvas, {
    width: 1400,
    height: 560,
    path: resolve(promoDirectory, '03-marquee-1400x560.png'),
    html: `
      <main style="position:relative;display:grid;grid-template-columns:760px 1fr;width:100%;height:100%;padding:48px 72px;gap:52px">
        <section style="display:flex;flex-direction:column;justify-content:space-between;padding:4px 0">
          <div style="display:flex;align-items:center;gap:16px">
            ${brandMark(58)}
            <div style="font-size:18px;font-weight:700;letter-spacing:-0.035em">JobCollector</div>
          </div>
          <div>
            <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;color:#0348ed;font-size:13px;font-weight:700;letter-spacing:.09em">
              <span style="width:26px;height:2px;background:#0348ed"></span> LOCAL FIRST
            </div>
            <h1 style="margin:0;font-size:62px;line-height:1.04;letter-spacing:-0.06em;font-weight:700">只收集你选中的<br>那一个职位</h1>
            <p style="margin:24px 0 0;color:#737373;font-size:19px">结构清楚，留在本地，需要时再导出。</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;color:#737373;font-size:13px"><span style="width:10px;height:10px;border-radius:50%;background:#ff3700"></span>当前支持 BOSS 职位详情页</div>
        </section>
        <section style="height:464px;overflow:hidden;border:1px solid #e5e5e5;border-radius:28px;background:#fff">
          <img src="${panelDataUrl}" alt="JobCollector side panel" style="display:block;width:100%;height:auto">
        </section>
      </main>`,
  });

  await canvas.close();
} finally {
  await context.close();
  await rm(userDataDirectory, {recursive: true, force: true});
}

console.log('Created Chrome Web Store assets:');
console.log('  store-assets/screenshots/01-jobcollector-overview-1280x800.png');
console.log('  store-assets/promo/02-small-promo-440x280.png');
console.log('  store-assets/promo/03-marquee-1400x560.png');
