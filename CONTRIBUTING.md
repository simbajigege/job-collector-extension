# Contributing

感谢改进 JobCollector。请先阅读 `SPEC.md` 与 `docs/data-contract.md`。

1. 使用 Node 22 和 `npm install`；
2. 行为变更先补测试，adapter 变更先补脱敏 fixture；
3. 不提交真实职位整页、账号数据、Cookie、聊天记录或招聘者信息；
4. 不增加远程请求、权限、UI 框架、批量/自动化行为或 CSV 字段，除非规格已更新并批准；
5. 提交前运行 `npm run check && npm run test:e2e && npm run package`；
6. 检查 zip 内容和 Git diff 中不存在真实数据、报告、sourcemap 或密钥。

建议分支名使用 `feature/<short-name>` 或 `fix/<short-name>`。公开课程版本使用固定 tag，不依赖浮动分支。
