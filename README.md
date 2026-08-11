# JobCollector Extension

JobCollector 是一个本地优先的 Chrome/Chromium Manifest V3 侧边栏扩展。用户主动打开一条职位详情并点击“收集当前职位”后，它只读取当前页面已经展示的一条职位，校验并保存在 `chrome.storage.local`，随后可导出稳定的 CSV v1，供 `ai-job-analysis` 等后续工具使用。

当前本地 MVP 已完成自动化实现与离线 fixture 验证；真实 BOSS 页面的一次用户主动冒烟检查尚未执行。项目尚未创建远程仓库、提交、推送或发布。

## 产品边界

- 每次只采集用户当前打开的一条职位；
- 不自动登录、翻页、遍历、导航、打招呼或投递；
- 不调用网站私有接口，不逆向接口，不绕过访问限制；
- 不在扩展内做岗位分析、评分、总结或公司研究；
- 不提供字段预览、编辑、补充或逐条删除；
- 职位数据只保存在浏览器本地，用户主动导出时才写入 CSV；
- 生产 manifest 只申请 `activeTab`、`scripting`、`sidePanel`、`storage`；首次收集时由用户选择是否授予仅限 `zhipin.com` 的可选页面访问权限。

完整范围见 [SPEC.md](SPEC.md)，CSV 字段见 [docs/data-contract.md](docs/data-contract.md)。

## 5 分钟开始

要求 Node.js 22、npm，以及 Chrome/Chromium 桌面浏览器。

```bash
nvm use
npm install
npx playwright install chromium
npm run check
npm run test:e2e
```

本地加载：

1. 运行 `npm run build`；
2. 打开 `chrome://extensions`；
3. 开启“开发者模式”；
4. 点击“加载已解压的扩展程序”，选择本仓库的 `dist/`；
5. 点击 JobCollector 工具栏图标打开侧边栏；首次收集时确认仅限 BOSS 的页面访问权限。侧边栏保持打开后，可在不同职位页面间继续使用。

不要用自动化访问真实招聘网站。脱敏 fixture 演示由 `npm run test:e2e` 在浏览器内通过本地 route 完成，不产生线上请求。

## 常用命令

| 命令                    | 用途                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | 监听侧边栏/service worker 与 content IIFE，持续输出 `dist/` |
| `npm run build`         | 生产构建并断言权限与必要入口                                |
| `npm run typecheck`     | TypeScript strict 检查                                      |
| `npm run lint`          | ESLint 检查                                                 |
| `npm run format:check`  | Prettier 检查                                               |
| `npm test -- --run`     | 单元、契约和 DOM fixture 测试                               |
| `npm run test:coverage` | 核心模块覆盖率                                              |
| `npm run test:e2e`      | 本地 Chromium 解压扩展集成测试                              |
| `npm run check`         | 类型、格式、lint、测试和生产构建                            |
| `npm run package`       | 在 `artifacts/` 生成经过内容审计的 zip                      |

## 目录与架构

```text
Side Panel → Service Worker → optional BOSS access + scripting
                              ↓
                  Content Entry → Adapter Registry → BOSS Adapter
                              ↓
             normalize + validate → chrome.storage.local → CSV
```

- DOM selector 只存在于 adapter；
- content entry 构建为自包含 IIFE，只在用户点击后注入；
- service worker 负责活动标签页、upsert/count/list/clear；
- 侧边栏负责操作、计数和职位列表，不展示或编辑职位字段详情；
- CSV 严格遵守 `docs/data-contract.md` v1。

详见 [架构说明](docs/architecture.md)、[安装与验证](docs/installation.md) 和 [新增 adapter](docs/adding-an-adapter.md)。

## 测试边界

自动化测试使用三份人工合成 HTML：完整、可选字段缺失、关键字段缺失。结构用于 selector contract，内容均为虚构信息。Playwright 可加载真实扩展页面并验证侧边栏配置、production content bundle、持久化、重复键、CSV 下载和清空；Chrome 的可选页面权限提示仍需在真实浏览器中由用户人工确认。

## 隐私与安全

扩展没有后端、遥测、广告、远程代码或云同步。它不采集账号凭据、Cookie、聊天记录、招聘者个人信息。清空操作只删除 JobCollector 自己的本地 storage key。公开发布前仍需重新核验目标网站规则、浏览器商店政策和 fixture 敏感信息。

公开发布资料见 [隐私政策](docs/privacy-policy.md) 和 [Chrome Web Store 中英文文案](docs/chrome-web-store-listing.md)。

安全问题与开源边界见 [SECURITY.md](SECURITY.md)，贡献流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 版本与课程引用

- `main` 保持可构建；
- 可在公开仓库建立 `starter` 分支供课程起点使用；
- 课程使用固定 tag（建议 `course-v0.1.0`）或 commit SHA 引用；
- 不在课程仓库复制源码，也不使用 Git submodule。

本地 MVP、人工冒烟和产物审计全部完成后，再创建 GitHub 仓库与 Release。
