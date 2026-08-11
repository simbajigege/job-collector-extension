# JobCollector 任务清单

## Gate 0：规格

- [x] Task: 保存产品规格、数据契约、实施计划和任务清单
  - Acceptance: 六个规格核心区域、权限边界、成功标准和开放问题均有明确记录
  - Verify: 人工核对 `SPEC.md`、`docs/data-contract.md`、`tasks/plan.md`、`tasks/todo.md`
  - Files: `SPEC.md`, `docs/data-contract.md`, `tasks/plan.md`, `tasks/todo.md`

- [x] Task: 获得用户对正式规格的批准
  - Acceptance: 用户明确同意范围、数据契约、权限、技术栈和验收标准，或给出需要修改的项目
  - Verify: 对话中存在明确批准记录
  - Files: `SPEC.md`, `docs/data-contract.md`

## Gate 1：工程脚手架

- [x] Task: 初始化 Node、npm 与基础仓库配置
  - Acceptance: Node 22、npm scripts、TypeScript strict、Git ignore 和 MIT License 配置完成
  - Verify: `npm install && npm run typecheck`
  - Files: `.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore`

- [x] Task: 配置 Vite 多入口与 Manifest V3
  - Acceptance: build 输出 popup、service worker、content entry 和只含三项批准权限的 manifest
  - Verify: `npm run build` 后检查 `dist/manifest.json` 并在 Chrome 加载
  - Files: `vite.config.ts`, `manifest.config.ts`, `popup.html`, `src/background/service-worker.ts`, `src/content/collect-current-job.ts`

- [x] Task: 配置格式、lint、单元测试和统一检查命令
  - Acceptance: `lint`、`format:check`、`test`、`check` 命令存在且空项目通过
  - Verify: `npm run check`
  - Files: `eslint.config.js`, `.prettierrc.json`, `vitest.config.ts`, `package.json`

## Gate 2：领域与数据契约

- [x] Task: 用测试定义 JobRecord 与校验结果
  - Acceptance: 完整记录通过；关键字段缺失返回结构化失败；可选字段缺失进入 missingFields
  - Verify: `npm test -- --run tests/domain/job-record.test.ts`
  - Files: `src/domain/job-record.ts`, `src/domain/validate.ts`, `tests/domain/job-record.test.ts`

- [x] Task: 实现文本、描述和 URL 规范化
  - Acceptance: 清理无意义空白但保留描述段落；URL 去除 fragment 和追踪参数
  - Verify: `npm test -- --run tests/domain/normalize.test.ts`
  - Files: `src/domain/normalize.ts`, `tests/domain/normalize.test.ts`

- [x] Task: 实现稳定去重键
  - Acceptance: 优先使用来源职位 ID，缺失时使用规范化 URL，相同职位得到相同键
  - Verify: `npm test -- --run tests/domain/dedupe-key.test.ts`
  - Files: `src/domain/dedupe-key.ts`, `tests/domain/dedupe-key.test.ts`

## Gate 3：Adapter

- [x] Task: 建立脱敏 BOSS fixtures
  - Acceptance: 包含完整、可选字段缺失和关键字段缺失三种页面，不含真实个人/账号数据
  - Verify: 人工敏感信息检查和 fixture 快照测试
  - Files: `fixtures/boss/complete.html`, `fixtures/boss/optional-missing.html`, `fixtures/boss/required-missing.html`

- [x] Task: 定义 adapter 契约和 registry
  - Acceptance: registry 只选择明确支持当前页面的 adapter，不存在启发式 fallback
  - Verify: `npm test -- --run tests/adapters/registry.test.ts`
  - Files: `src/adapters/types.ts`, `src/adapters/registry.ts`, `tests/adapters/registry.test.ts`

- [x] Task: 用 contract tests 实现 BOSS adapter
  - Acceptance: 三种 fixtures 均返回预期结果；不请求网络、不修改 DOM、不读取个人信息
  - Verify: `npm test -- --run tests/adapters/boss-job-adapter.test.ts`
  - Files: `src/adapters/boss-job-adapter.ts`, `tests/adapters/boss-job-adapter.test.ts`

## Gate 4：采集与存储闭环

- [x] Task: 定义类型化扩展消息
  - Acceptance: collect/count/export/clear 请求与成功失败响应均为判别联合类型
  - Verify: `npm run typecheck`
  - Files: `src/shared/messages.ts`, `src/shared/errors.ts`

- [x] Task: 串联用户点击、activeTab 注入与 adapter 解析
  - Acceptance: 每次点击只注入当前活动标签页并返回一条结构化结果
  - Verify: 本地 fixture 手工检查和集成测试
  - Files: `src/popup/popup.ts`, `src/background/service-worker.ts`, `src/content/collect-current-job.ts`

- [x] Task: 实现 chrome.storage.local repository
  - Acceptance: upsert/count/list/clear 可测试；重复职位更新且数量不增加
  - Verify: `npm test -- --run tests/storage/job-repository.test.ts`
  - Files: `src/storage/job-repository.ts`, `src/storage/storage-adapter.ts`, `tests/storage/job-repository.test.ts`

## Gate 5：CSV 与 UI

- [x] Task: 用契约测试实现 CSV serializer
  - Acceptance: 固定表头、BOM、CRLF、中文、引号、逗号、多行和公式前缀均处理正确
  - Verify: `npm test -- --run tests/export/csv.test.ts`
  - Files: `src/export/csv.ts`, `src/export/csv-security.ts`, `tests/export/csv.test.ts`

- [x] Task: 实现本地 CSV 下载
  - Acceptance: 有数据时生成约定文件名，无数据时提示且不下载，不申请 downloads 权限
  - Verify: 浏览器集成测试检查下载文件
  - Files: `src/export/download.ts`, `src/popup/popup.ts`, `tests/export/download.test.ts`

- [x] Task: 完成最小 Popup 语义结构与样式
  - Acceptance: 只有采集、计数、导出、清空及状态反馈；键盘和屏幕阅读器可用
  - Verify: 键盘人工检查、无障碍检查和 popup 截图
  - Files: `popup.html`, `src/popup/popup.ts`, `src/popup/popup.css`

## Gate 6：验证与开源准备

- [x] Task: 配置 Playwright 解压扩展测试
  - Acceptance: 测试覆盖新增、重复更新、持久化、导出和清空，不访问真实招聘网站
  - Verify: `npm run test:e2e`
  - Files: `playwright.config.ts`, `e2e/extension.spec.ts`, `e2e/fixture-server.ts`

- [x] Task: 完成安装、架构、隐私和 adapter 贡献文档
  - Acceptance: 新开发者按 README 可在 15 分钟内完成安装、fixture 演示和检查
  - Verify: 在干净临时目录按文档执行一次
  - Files: `README.md`, `CONTRIBUTING.md`, `docs/installation.md`, `docs/architecture.md`, `docs/adding-an-adapter.md`

- [x] Task: 实现打包并审计产物
  - Acceptance: zip 只包含运行扩展所需文件，不含源码 fixture、真实数据、测试报告或 sourcemap
  - Verify: `npm run check && npm run test:e2e && npm run package`，随后列出 zip 内容检查
  - Files: `scripts/package-extension.mjs`, `package.json`, `.gitignore`

- [ ] Task: 执行一次用户主动的真实页面冒烟检查
  - Acceptance: 只在用户打开的当前职位页采集一次；无自动导航和额外请求；结果满足数据契约
  - Verify: 人工核对采集结果和 Chrome 权限
  - Files: 仅在必要时修改 adapter 与脱敏 fixture

- [ ] Task: 提醒用户创建 GitHub 仓库
  - Acceptance: 本地 MVP、文档、检查和敏感信息审计全部完成后，给出仓库名、描述、创建及推送建议
  - Verify: 用户确认 GitHub 账号/组织和仓库设置
  - Files: 无
