# 架构说明

## 数据流

1. 全局 Side Panel 在用户点击“收集当前职位”时请求仅限 BOSS 的可选页面权限，再发送类型化 `COLLECT_CURRENT_JOB`；
2. Service Worker 查询当前活动标签页，拒绝非 HTTP(S) 页面；
3. `chrome.scripting.executeScript` 只向该标签页注入 production content IIFE；
4. Content Entry 用 registry 选择明确支持的 adapter；
5. Adapter 只读 DOM，输出 `JobRecordDraft`；
6. 领域层规范化、校验必填字段并记录可选缺失；
7. Service Worker 以来源 ID、退化为规范化 URL 执行 upsert；
8. Side Panel 显示操作结果、总数和本地职位列表，并在用户切换标签页或同源导航后保持打开。

## 模块边界

- `src/adapters/`：站点判断和 DOM selector，不访问 storage/UI/network；
- `src/domain/`：纯函数数据契约、规范化、校验和 dedupe；
- `src/content/`：当前 document 到一条领域结果；
- `src/background/`：Chrome API、消息和 repository 编排；
- `src/storage/`：单一 namespaced storage key；
- `src/export/`：CSV v1、防公式注入和本地 Blob 下载；
- `src/popup/`：侧边栏的三项按钮操作、计数、职位列表与可访问状态。

## 构建边界

Side Panel 页面和 module service worker 使用主 Vite 构建。按文件注入的 content entry 由第二个 Vite library build 输出自包含 IIFE，避免 classic script 中出现 ESM import。所有代码随扩展打包；没有远程代码和 sourcemap。

## 错误模型

可预期错误使用判别联合返回：不支持页面、selector 失败、关键字段缺失、活动标签页不可用、注入失败、空导出。只有成功校验的 `JobRecord` 才能进入 repository。
