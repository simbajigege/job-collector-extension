# 安装与本地验证

## 环境

- Node.js 22 LTS；
- npm；
- Chrome/Chromium 桌面浏览器；
- macOS/Linux 的 `zip` 命令（只用于 `npm run package`）。

```bash
nvm use
npm install
npx playwright install chromium
```

`package-lock.json` 固定依赖版本。不要使用 Node 20 运行当前 Vite/Vitest 工具链。

## 构建并加载

```bash
npm run build
```

打开 `chrome://extensions`，启用开发者模式，选择“加载已解压的扩展程序”，加载仓库中的 `dist/`。构建脚本会验证 manifest 只有 `activeTab`、`scripting`、`sidePanel`、`storage`，没有必需 host permissions，且可选页面权限仅限 `https://zhipin.com/*` 与 `https://www.zhipin.com/*`。

## 离线验证

```bash
npm run check
npm run test:coverage
npm run test:e2e
npm run package
```

Playwright 会用本地脱敏 fixture 响应测试 URL，不会请求真实 BOSS 页面。测试会验证全局侧边栏配置、production content bundle 与扩展存储/UI 闭环；Chrome 的可选页面权限提示属于人工冒烟范围。

## 人工冒烟（仅由用户主动执行）

1. 用户自行登录并打开一条真实职位详情；
2. 在 DevTools Network 中确认没有由扩展发起的远程请求；
3. 点击 JobCollector 工具栏图标打开侧边栏；
4. 点击“收集当前职位”，确认 Chrome 只请求 `zhipin.com` 页面访问权限；
5. 新开另一条 BOSS 职位详情，确认侧边栏保持打开并可直接收集；
6. 确认新增或更新提示、计数、列表和 CSV 字段；
7. 在 `chrome://extensions` 确认没有其他网站或所有网站的访问权限；
8. 若 selector 不匹配，只将结构差异转为脱敏 fixture 后修改 adapter。

不要自动导航、刷新、遍历或重复访问真实网站。
