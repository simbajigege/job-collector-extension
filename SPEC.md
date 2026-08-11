# Spec: JobCollector 浏览器扩展

## 1. 当前假设

以下假设来自已经确认的课程规划；如后续改变，应先更新本规格再修改代码。

1. 首版只支持 Chrome/Chromium 桌面浏览器，不支持 Firefox、Safari 和移动端。
2. 首版只采集用户当前主动打开的单条职位详情，不采集收藏列表，也不自动访问其他页面。
3. 首个真实数据源是 BOSS 职位详情页；自动化测试使用脱敏的本地 HTML fixture，不依赖线上站点。
4. 插件不包含岗位分析能力。`ai-job-analysis` Skill 读取 CSV 后负责公司研究、岗位任务与能力模型分析。
5. 用户不检查、补充、编辑或逐条删除字段；插件自动校验，关键字段不完整时拒绝保存。
6. 插件不需要账号、后端、数据库服务、遥测、广告或付费能力，所有职位数据存储在 `chrome.storage.local`。
7. 插件将作为独立公开仓库发布，采用 MIT License；本地项目目录为 `/Users/jigege/job-collector-extension`。
8. 课程通过固定 tag/commit 引用插件，不在 `course-design` 中复制插件源码，也不使用 Git submodule。
9. GitHub 仓库在本地 MVP、README、测试和开源边界验证完成后再创建。

## 2. 目标

### 2.1 要解决的问题

求职者需要把多个真实职位详情整理成结构一致的输入，交给后续 Codex Skills 做岗位研究、能力映射、职位分档和学习计划。手工复制容易漏字段、格式不一致，也不利于重复演示。

JobCollector 提供一个边界明确的采集环节：用户决定看什么职位，扩展只把当前页面已经展示的信息转换为稳定、可追溯的本地记录。

### 2.2 目标用户

- 高阶 AI 产品经理课程学员；
- 需要整理自己主动选择的目标岗位的求职者；
- fork 仓库并学习浏览器扩展、网页解析、测试和数据契约的开发者。

### 2.3 核心用户路径

1. 用户自行登录目标招聘网站并打开一条职位详情。
2. 用户点击浏览器工具栏中的 JobCollector。
3. 用户点击“收集当前职位”。
4. 扩展识别当前网站，通过对应 adapter 读取当前 DOM。
5. 扩展规范化并校验字段。
6. 校验通过后，扩展按来源职位 ID 或规范化 URL 新增/更新本地记录。
7. 弹窗显示成功信息和本地职位总数。
8. 用户在需要时点击“导出 CSV”，将全部记录下载到本地。
9. 用户可以点击“清空全部本地数据”，经二次确认后清除扩展保存的职位记录。

## 3. 范围

### 3.1 MVP 必须包含

- Manifest V3 扩展；
- 只在用户点击后读取当前活动标签页；
- BOSS 职位详情页 adapter；
- 可扩展的 adapter registry；
- 字段清理、必填校验和缺失字段记录；
- 基于来源职位 ID 或规范化 URL 的自动去重与更新；
- `chrome.storage.local` 本地持久化；
- 已收集职位数量；
- UTF-8 with BOM CSV 导出；
- 清空全部本地数据及二次确认；
- 成功、失败、非支持页面和字段缺失状态；
- 脱敏 HTML fixtures、单元测试和本地集成测试；
- 可复现的构建、打包和本地安装说明。

### 3.2 MVP 明确不包含

- 收藏列表或搜索结果批量采集；
- 自动翻页、自动打开职位或定时采集；
- 自动登录、验证码处理、接口逆向、反爬绕过；
- 打招呼、投简历或任何招聘流程自动化；
- 招聘者姓名、聊天记录、账号凭据等个人或敏感数据；
- 云同步、远程数据库、遥测或用户行为分析；
- AI 总结、岗位评分、公司调研或能力模型分析；
- 职位字段预览、人工编辑、补充、逐条删除和复杂数据管理界面；
- Chrome Web Store 上架；
- Firefox、Safari 和移动端支持。

## 4. 技术栈

- Runtime：Chrome/Chromium，Manifest V3；
- Language：TypeScript，启用严格类型检查；
- Build：Vite；
- UI：原生 HTML、CSS、TypeScript，不引入 React；
- Unit/contract tests：Vitest + jsdom；
- Browser integration：Playwright 驱动本地 fixture 页面与解压扩展；
- Code quality：ESLint + Prettier；
- Package manager：npm，依赖版本由 `package-lock.json` 固定；
- Node.js：22 LTS，通过 `.nvmrc` 固定主版本。

选择原生 UI 的原因是 MVP 只有少量状态和四个操作，引入 UI 框架会增加教学负担，却不会改善核心功能。

## 5. 权限模型

MVP 只申请完成单一目的所需的最小权限：

- `activeTab`：只在用户点击扩展后临时访问当前标签页；
- `scripting`：按用户动作注入已随扩展打包的采集脚本；
- `sidePanel`：把采集界面固定为可跨页面保留的 Chrome 侧边栏；
- `storage`：将规范化职位记录保存在浏览器本地。

为支持侧边栏在新标签页中继续采集，manifest 只声明 `https://zhipin.com/*` 与 `https://www.zhipin.com/*` 为 `optional_host_permissions`。扩展必须在用户点击“收集当前职位”后调用 Chrome 原生权限提示；用户未确认前不获得常驻页面访问权限。

原则上不申请：

- `<all_urls>`；
- 必需的 BOSS host permission；
- BOSS 以外的 optional host permission；
- `tabs`；
- `cookies`；
- `webRequest`；
- `debugger`；
- 用户浏览历史相关权限。

CSV 优先通过扩展页面创建 Blob 并触发用户下载，避免仅为导出申请 `downloads` 权限。如果浏览器验证表明该方式不稳定，必须先更新规格并说明原因，才能增加权限。

所有可执行代码必须随扩展打包，不加载或执行远程代码。

## 6. 架构

```text
Side Panel UI
  ├─ 请求采集当前职位
  ├─ 显示采集结果与总数
  ├─ 请求导出 CSV
  └─ 请求清空本地数据
          │
          ▼
Service Worker
  ├─ 查询 active tab
  ├─ 通过 scripting 注入 content entry
  ├─ 接收并校验 JobRecord
  └─ 调用 storage repository 执行 upsert/count/clear
          │
          ▼
Content Entry
  └─ Adapter Registry
      ├─ BossJobAdapter (MVP)
      └─ Future adapters
          │
          ▼
Normalized JobRecord → chrome.storage.local → CSV exporter
```

### 6.1 Adapter 契约

```ts
export interface JobSourceAdapter {
  readonly sourceSite: string;
  canHandle(context: PageContext): boolean;
  extract(context: PageContext): ExtractionResult;
}
```

- `canHandle` 只判断当前 URL 和页面是否属于该 adapter；
- `extract` 只读取当前 DOM，不发出网络请求，不导航页面；
- adapter 输出统一 `JobRecordDraft`，不直接访问 storage 或 UI；
- 找不到支持的 adapter 时返回明确的 `UNSUPPORTED_PAGE`，不做启发式兜底采集。

### 6.2 数据流

1. Side Panel 在用户动作中确认可选 BOSS 页面权限，并触发 `COLLECT_CURRENT_JOB`；
2. Service Worker 确认存在 HTTP(S) 活动标签页；
3. Content Entry 选择 adapter 并读取 DOM；
4. 规范化模块执行空白清理、URL 规范化和字段校验；
5. Service Worker 以 `sourceSite + sourceJobId` 为首选键、规范化 URL 为退化键进行 upsert；
6. Side Panel 获取结构化结果并更新按钮反馈、计数和职位列表；
7. Exporter 从 repository 读取稳定顺序的数据，生成 CSV。

## 7. 数据契约

规范化数据和 CSV 的详细定义见 `docs/data-contract.md`。核心 TypeScript 类型如下：

```ts
export interface JobRecord {
  schemaVersion: '1';
  sourceSite: string;
  sourceJobId: string;
  sourceUrl: string;
  jobTitle: string;
  companyName: string;
  salary: string;
  location: string;
  experience: string;
  education: string;
  jobDescription: string;
  companyDescription: string;
  missingFields: string[];
  collectedAt: string;
  collectorVersion: string;
}
```

必填字段：

- `sourceSite`；
- `sourceUrl`；
- `jobTitle`；
- `companyName`；
- `jobDescription`。

任一必填字段缺失时拒绝保存，并返回缺失字段列表。可选字段缺失时允许保存，将字段保留为空字符串，并写入 `missingFields`。

## 8. Side Panel 交互规格

### 8.1 默认状态

- 显示产品名；
- 主按钮：“收集当前职位”；
- 数量卡片：“已收集 N 个职位”；
- 三列职位列表：“# / 公司 / 职位”；
- 次按钮：“下载 CSV”；
- 危险操作按钮：“清空”。

### 8.2 状态反馈

- 采集中：禁用重复点击，按钮文字变为“正在收集…”；
- 成功：按钮短暂显示新增或更新结果，同时刷新当前总数与职位列表；
- 首次授权：由 Chrome 原生权限提示请求仅限 BOSS 域名的可选页面访问；
- 非支持页面：提示用户打开受支持的职位详情页；
- 关键字段缺失：显示无法保存及缺失字段，不展示原始 DOM；
- 权限/注入失败：显示可操作的重试提示；
- 导出为空：提示尚未收集职位，不生成空文件；
- 清空数据：二次确认，完成后总数归零。

界面必须支持键盘操作、可见焦点和 `prefers-reduced-motion`。不使用渐变、阴影或装饰性动画。侧边栏在同一浏览器窗口切换或新开标签页时保持打开。

## 9. CSV 规格

- 文件名：`job-collector-YYYY-MM-DD-HHmm.csv`；
- 编码：UTF-8 with BOM；
- 换行：CRLF，提升 Excel 兼容性；
- 分隔符：英文逗号；
- 表头稳定且按 `docs/data-contract.md` 排序；
- 所有字段都执行 RFC 4180 风格的引号转义；
- 职位描述中的换行保留在带引号字段内；
- 记录按 `collected_at` 升序导出，保证结果可预测；
- 导出不修改或清除本地数据。

## 10. 命令

初始化依赖后，仓库必须提供以下完整命令：

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format:check
npm test -- --run
npm run test:coverage
npm run test:e2e
npm run check
npm run package
```

- `npm run dev`：监听源码并输出可加载的开发扩展；
- `npm run build`：生成生产扩展目录；
- `npm run check`：依次执行类型、格式、lint、单元/契约测试和生产构建；
- `npm run package`：在 `artifacts/` 生成可分发 zip，但不发布到外部服务。

## 11. 项目结构

```text
job-collector-extension/
├── manifest.config.ts
├── popup.html
├── src/
│   ├── adapters/
│   │   ├── registry.ts
│   │   └── boss-job-adapter.ts
│   ├── background/
│   │   └── service-worker.ts
│   ├── content/
│   │   └── collect-current-job.ts
│   ├── popup/
│   │   ├── popup.ts
│   │   └── popup.css
│   ├── domain/
│   │   ├── job-record.ts
│   │   ├── normalize.ts
│   │   └── validate.ts
│   ├── storage/
│   │   └── job-repository.ts
│   ├── export/
│   │   └── csv.ts
│   └── shared/
│       └── messages.ts
├── fixtures/
│   └── boss/
├── tests/
│   ├── adapters/
│   ├── domain/
│   ├── storage/
│   └── export/
├── e2e/
├── docs/
│   ├── data-contract.md
│   ├── installation.md
│   ├── architecture.md
│   └── adding-an-adapter.md
├── tasks/
│   ├── plan.md
│   └── todo.md
├── SPEC.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

生成目录 `dist/`、`coverage/`、`playwright-report/`、`test-results/`、`artifacts/` 和 `node_modules/` 不提交 Git。

## 12. 代码风格

- 使用函数和小型模块，不使用无必要的 class；
- TypeScript 严格模式，不使用隐式 `any`；
- 单引号、分号、尾逗号；
- 领域函数返回显式结果，不以异常表达可预期的解析失败；
- DOM selector 只存在于 adapter 中；
- UI、adapter、storage 和 exporter 之间通过类型化消息与领域类型协作。

示例：

```ts
export type ValidationResult =
  {ok: true; record: JobRecord} | {ok: false; missingFields: string[]};

export function validateJobRecord(draft: JobRecordDraft): ValidationResult {
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => draft[field].trim().length === 0,
  );

  return missingFields.length === 0
    ? {ok: true, record: toJobRecord(draft)}
    : {ok: false, missingFields};
}
```

## 13. 测试策略

### 13.1 单元测试

- 文本清理与换行保留；
- URL 规范化；
- 必填/可选字段校验；
- 去重键生成；
- CSV 表头、BOM、CRLF、逗号、引号和多行文本转义；
- storage repository 的新增、更新、计数和清空。

### 13.2 Adapter contract tests

- 使用至少三份脱敏 fixture：完整职位、可选字段缺失、关键字段缺失；
- 验证 BOSS adapter 不访问网络、不修改 DOM、不读取非必要个人信息；
- selector 失败时返回明确错误，不生成看似成功的空记录。

### 13.3 浏览器集成测试

- 加载解压扩展和本地 fixture 页；
- 用户点击后只采集当前页；
- 首次采集新增记录，再次采集同一职位更新而不增加数量；
- 关闭并重新打开侧边栏后记录数量仍存在；
- 切换或新开 BOSS 职位标签页后侧边栏保持可用；
- 导出文件符合数据契约；
- 清空数据需要确认且完成后计数为零。

### 13.4 人工检查

- 在用户主动打开的真实职位详情页执行单条冒烟检查；
- 检查 Chrome 权限提示与 `chrome://extensions` 中的权限范围；
- 检查键盘、焦点、错误提示和中文显示；
- 不编写自动化测试访问、遍历或持续请求真实招聘网站。

覆盖率目标：核心领域模块、adapter、repository 和 CSV exporter 的行覆盖率不低于 90%；UI glue code 不为覆盖率而制造低价值测试。

## 14. 边界

### Always

- 先更新规格和数据契约，再改变功能或字段；
- 对新增 adapter 使用脱敏 fixtures 和 contract tests；
- 在提交前运行 `npm run check`；
- 保持最小权限和本地优先；
- 对关键字段缺失、页面不支持和注入失败明确报错；
- 在公开发布前清除 fixtures 中的个人信息、账号信息和不可公开内容。

### Ask first

- 增加 `sidePanel` 之外的浏览器权限，或扩大 BOSS 之外的 host permissions；
- 引入后端、远程请求、云同步或遥测；
- 增加新的运行时依赖或 UI 框架；
- 修改 CSV 表头、字段含义或 schema version；
- 增加批量采集、自动导航或招聘流程自动化；
- 发布 GitHub 仓库、Release 或 Chrome Web Store 包；
- 使用真实网站页面内容作为仓库 fixture。

### Never

- 保存或提交账号凭据、Cookie、聊天记录、招聘者个人信息；
- 逆向私有接口、绕过登录/验证码/访问频率或反爬措施；
- 加载或执行远程代码；
- 在未经用户动作的情况下后台采集；
- 把职位数据传输给开发者或第三方；
- 静默保存缺少关键字段的记录；
- 声称受限实现等同于获得目标平台授权。

## 15. 成功标准

1. 用户必须主动点击，且一次只采集当前页面的一条职位。
2. 在支持页面上能采集并保存完整的核心字段。
3. 关键字段缺失时拒绝保存，并准确列出缺失字段。
4. 同一来源职位重复采集执行更新，本地记录总数不增加。
5. 关闭侧边栏、刷新页面和重启浏览器后，记录仍保存在本地。
6. 10 条包含中文、逗号、引号和多行描述的 fixture 数据能导出为结构正确的 CSV。
7. CSV 在 Excel/Numbers 常见导入路径中中文不乱码、列不串位。
8. 插件不访问远程服务，不自动导航，不读取目标范围之外的数据。
9. `npm run check`、`npm run test:e2e` 和 `npm run package` 全部通过。
10. fork 仓库的开发者能按 README 在 15 分钟内完成安装、加载 fixture 演示和运行检查。

## 16. 风险与缓解

| 风险                           | 缓解方式                                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| 目标页面 DOM 改版              | selector 集中在 adapter；使用多 fixture contract tests；失败时显式报错 |
| 单页应用路由导致页面状态变化   | 每次点击时重新读取当前 URL 与 DOM，不缓存页面引用                      |
| 无人工预览导致错误数据进入 CSV | 提高必填校验；无可靠 adapter 时拒绝采集；记录缺失字段                  |
| CSV 中文或多行文本错位         | BOM、CRLF、统一引号转义和契约测试                                      |
| 权限范围逐渐扩大               | 权限变更列为 Ask first；在测试和 README 中记录权限目的                 |
| 开源 fixture 泄漏真实信息      | 只提交人工脱敏或合成 fixture；发布前做敏感信息检查                     |
| 平台规则变化                   | 公开发布/上架前重新核验；不把技术限制等同于授权                        |
| 学员 fork 后难以跟随课程       | `starter` 分支、课程 tag、稳定数据契约和可离线 fixture                 |

## 17. 尚未阻塞规格批准的问题

以下问题不影响开始本地实现，但必须在对应里程碑前确认：

1. GitHub 所属账号/组织与最终仓库 URL；
2. 是否只发布源码，还是同时发布 GitHub Release zip；
3. 是否计划申请 Chrome Web Store 上架；若计划上架，需要单独的隐私政策与发布检查；
4. 最终产品图标和品牌资产；
5. 真实 BOSS 页面当前 DOM selector，只能在用户主动打开页面后进行一次人工验证。
