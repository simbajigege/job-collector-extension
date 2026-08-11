# JobCollector 数据契约 v1

本文件定义 JobCollector 本地记录和 CSV 的稳定字段。`ai-job-analysis` 等下游工具应依赖本契约，而不是依赖某个招聘网站的 DOM。

## 1. CSV 表头与顺序

```text
schema_version
source_site
source_job_id
source_url
job_title
company_name
salary
location
experience
education
job_description
company_description
missing_fields
collected_at
collector_version
```

表头顺序属于契约。新增、删除、重命名或改变字段含义时必须升级 schema version。

## 2. 字段定义

| 字段                  | 必填 | 说明                                                   |
| --------------------- | ---- | ------------------------------------------------------ |
| `schema_version`      | 是   | 当前固定为 `1`                                         |
| `source_site`         | 是   | 稳定、机器可读的数据源 ID，MVP 为 `boss`               |
| `source_job_id`       | 否   | 页面或 URL 中可可靠获得的职位 ID；不可可靠获得时为空   |
| `source_url`          | 是   | 去除 hash 和已知追踪参数后的规范化职位 URL             |
| `job_title`           | 是   | 页面展示的职位名称原文                                 |
| `company_name`        | 是   | 页面展示的公司名称原文                                 |
| `salary`              | 否   | 页面展示的薪资原文，不换算区间或年薪                   |
| `location`            | 否   | 页面展示的工作地点原文                                 |
| `experience`          | 否   | 页面展示的经验要求原文                                 |
| `education`           | 否   | 页面展示的学历要求原文                                 |
| `job_description`     | 是   | 完整职位描述，保留有意义的段落和换行                   |
| `company_description` | 否   | 当前页面已经展示的公司简介；不额外请求公司页面         |
| `missing_fields`      | 是   | 缺失的可选字段名，以半角分号连接；没有缺失时为空字符串 |
| `collected_at`        | 是   | 最近一次主动采集的 ISO 8601 UTC 时间                   |
| `collector_version`   | 是   | 生成记录的扩展版本                                     |

## 3. 规范化规则

- 所有字符串统一为 Unicode 文本；
- 去除首尾空白、零宽空白和不承担语义的页面装饰字符；
- 将不换行空格转换为普通空格；
- 单行字段折叠连续空格；
- 描述字段保留段落换行，但清理每行首尾空格和超过两个的连续空行；
- 不总结、翻译、改写、推断或补全页面原文；
- `source_url` 删除 fragment 和明确的追踪参数，但不猜测或构造不存在的职位 URL；
- `source_job_id` 只有在页面或 URL 中可稳定、可靠获得时才填写。

## 4. 校验规则

缺少下列任一字段时，整条记录不得保存：

```text
source_site
source_url
job_title
company_name
job_description
```

其他字段缺失时：

1. 对应字段写为空字符串；
2. 将字段名加入 `missing_fields`；
3. 允许保存和导出。

## 5. 去重与更新

优先去重键：

```text
source_site + ":" + source_job_id
```

当 `source_job_id` 为空时使用：

```text
source_site + ":" + normalized(source_url)
```

再次采集同一职位时，用本次页面内容替换旧记录，并刷新 `collected_at` 和 `collector_version`。记录数量不增加。

## 6. CSV 编码与转义

- UTF-8 with BOM；
- CRLF 行结束符；
- 英文逗号分隔；
- 所有字段统一使用双引号包裹；
- 字段内的 `"` 写成 `""`；
- 描述中的换行保留在引号内；
- 不输出公式；以 `=`, `+`, `-`, `@` 开头的非数值文本必须按防 CSV 注入规则处理，同时保留可追溯的原始语义。

## 7. 示例

```csv
"schema_version","source_site","source_job_id","source_url","job_title","company_name","salary","location","experience","education","job_description","company_description","missing_fields","collected_at","collector_version"
"1","boss","example-001","https://www.example.com/job/example-001","高级AI产品经理","示例科技","25-40K","北京","3-5年","本科","负责AI产品规划与落地。\r\n推进评测与迭代。","一家用于课程测试的虚构公司。","","2026-08-10T08:00:00.000Z","0.1.0"
```
