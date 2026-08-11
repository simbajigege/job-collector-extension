# 新增招聘网站 Adapter

新增数据源前，先确认用户授权、站点规则和产品范围。增加 host permission、远程请求、批量行为或 CSV 字段必须先更新规格并获得批准。

## 步骤

1. 在 `fixtures/<source>/` 创建人工合成或充分脱敏的完整、可选缺失、关键缺失页面；
2. 在 `src/adapters/` 实现 `JobSourceAdapter`；
3. `canHandle` 只匹配明确 URL/页面，不做启发式 fallback；
4. `extract` 只读当前 DOM，不发请求、不导航、不修改 DOM；
5. 输出统一 `JobRecordDraft`，不直接访问 storage、popup 或 exporter；
6. 在 registry 显式注册；
7. 添加 contract tests：三类 fixture、无网络、DOM 不变、selector 失败；
8. 运行完整检查和一次用户主动人工冒烟。

DOM selector 必须全部留在 adapter 内。无法可靠获得 `sourceJobId` 时留空，由领域层使用规范化 URL 去重；不得猜测或构造 ID。
