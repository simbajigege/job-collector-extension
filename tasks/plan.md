# JobCollector 实施计划

## 1. 目标

按 `SPEC.md` 实现一个可独立 fork、可离线测试、只在用户主动点击时采集当前单条职位的本地优先浏览器扩展。实施遵循纵向切片：每个阶段都形成可验证的闭环，不先堆积无法运行的模块。

## 2. 依赖关系

```text
规格与数据契约
    ↓
工程脚手架与 Manifest
    ↓
领域模型、规范化、校验
    ↓
BOSS fixture 与 adapter
    ↓
用户点击 → 注入 → 解析 → 返回结果
    ↓
本地 upsert、计数与清空
    ↓
CSV 导出
    ↓
Popup 交互与无障碍
    ↓
浏览器集成、打包与开源文档
    ↓
人工真实页面冒烟检查
    ↓
提醒用户创建 GitHub 仓库
```

## 3. 阶段计划

### Phase 0：规格批准

交付：

- `SPEC.md`；
- `docs/data-contract.md`；
- `tasks/plan.md`；
- `tasks/todo.md`。

检查点：用户确认产品范围、最小权限、CSV 契约、技术栈与验收标准后，才能开始功能实现。

### Phase 1：可构建的空扩展

- 初始化 npm、TypeScript、Vite、Vitest、ESLint、Prettier 和 Playwright；
- 生成 Manifest V3；
- 建立 popup、service worker 和 content entry；
- 提供 `dev/build/typecheck/lint/test/check/package` 命令；
- 加载空扩展，确认只声明 `activeTab`、`scripting`、`storage`。

检查点：`npm run check` 通过，Chrome 能加载 `dist/`，popup 能打开。

### Phase 2：领域模型与数据契约

- 用测试先定义 JobRecord、文本规范化、URL 规范化、校验和去重键；
- 实现可预期的成功与失败结果；
- 固定 schema version 与 CSV 表头。

检查点：领域单元测试覆盖完整/缺失/异常输入，关键字段缺失不会产生可保存记录。

### Phase 3：BOSS adapter 与 fixtures

- 创建人工脱敏/合成的完整、可选缺失、关键缺失 fixtures；
- 实现 adapter registry；
- 实现 BOSS adapter，只读取当前 DOM；
- 增加 selector 变化与错误返回测试。

检查点：三个 fixture contract tests 通过；测试无网络依赖；不采集个人信息。

### Phase 4：单条采集闭环

- Popup 发出用户动作；
- Service Worker 查询 active tab 并注入 content entry；
- Content Entry 选择 adapter 并返回结构化结果；
- Popup 显示成功、非支持页面、关键字段缺失和注入失败。

检查点：本地 fixture 页上每次点击只处理当前一条记录，没有自动导航或后台采集。

### Phase 5：本地存储闭环

- 实现 storage repository；
- 支持 upsert、count、list 和 clear-all；
- 重复职位更新但不增加计数；
- 清空全部数据需要二次确认。

检查点：关闭并重开 popup 后计数保留；重复采集仍只有一条；清空后为零。

### Phase 6：CSV 导出闭环

- 实现稳定表头、BOM、CRLF、全字段引号转义和 CSV 注入防护；
- 从 repository 获取稳定排序的数据；
- 使用 Blob 触发用户下载；
- 空数据时不生成文件。

检查点：含中文、引号、逗号和多行描述的 10 条 fixture 导出正确；无需 `downloads` 权限。

### Phase 7：教学级 UI 与无障碍

- 完成简洁 popup 视觉；
- 增加 loading、成功、错误、空状态；
- 支持键盘、焦点、状态播报和 reduced motion；
- 不增加编辑、预览、逐条删除和设置页面。

检查点：窄小 popup 中无溢出；仅包含规格中的四类操作；键盘可完成完整路径。

### Phase 8：集成验证、打包与开源准备

- Playwright 加载解压扩展和本地 fixture；
- 完成 `README`、安装、架构、adapter 开发和贡献文档；
- 增加 MIT License、`.gitignore`、安全/隐私说明；
- 生成 zip 并验证从 zip 解压后可加载；
- 建立适合课程的 tag/branch 策略说明。

检查点：`npm run check`、`npm run test:e2e`、`npm run package` 全部通过；新开发者按 README 能独立运行。

### Phase 9：真实页面人工冒烟与 GitHub 准备

- 用户主动打开真实职位详情页；
- 只执行一次单条人工采集检查；
- 如 selector 有差异，只调整 adapter 和 fixture；
- 再次运行所有检查并审计打包内容；
- 明确提醒用户创建 GitHub 仓库，并提供建议的仓库名、描述和发布步骤。

检查点：没有自动访问真实招聘网站；公开包不含真实页面、账号数据或调试产物。

## 4. 风险优先级

1. **平台规则与数据边界**：通过用户动作、当前页、单条、本地保存和无远程请求降低风险；不声称已获授权。
2. **DOM 脆弱性**：通过 adapter 隔离、fixtures 和显式失败处理控制。
3. **无预览导致错误数据**：通过必填校验和拒绝启发式兜底控制。
4. **CSV 成为下游契约**：通过 schema version、固定表头和契约测试控制。
5. **教学可复现性**：真实站点不可作为自动测试依赖，课程演示必须有本地 fixtures。

## 5. 顺序与并行性

- Phase 1–4 必须顺序执行，因为后续依赖可构建扩展、领域契约和 adapter；
- Phase 5 与 Phase 6 在领域模型稳定后可以分别实现，但最终需要在 Popup 中串联验证；
- UI 视觉可以在核心闭环稳定后进行，避免样式掩盖行为缺陷；
- 文档随每个阶段更新，最终开源检查集中在 Phase 8–9。

## 6. 完成定义

只有 `SPEC.md` 的全部成功标准满足、命令真实通过、人工检查结果如实记录，并且公开包通过敏感信息审计，MVP 才算完成。GitHub 创建、推送和 Release 发布不在默认授权范围内，需要用户在本地 MVP 完成后执行或另行授权。
