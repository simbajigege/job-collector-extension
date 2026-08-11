# Chrome Web Store Listing Copy / 商店文案

本文档中的文案按 JobCollector 0.1.0 当前实现编写，可直接复制到 Chrome Web Store Developer Dashboard。发布行为发生变化时，应同步更新商店声明和隐私政策。

## 基本信息 / Basic information

- **产品名称 / Product name:** JobCollector
- **主要类别 / Primary category:** Productivity / 生产力工具
- **默认语言 / Default language:** 中文（简体）
- **主页 / Homepage:** https://github.com/simbajigege/job-collector-extension
- **支持页面 / Support URL:** https://github.com/simbajigege/job-collector-extension/issues
- **隐私政策 / Privacy policy:** https://github.com/simbajigege/job-collector-extension/blob/main/docs/privacy-policy.md

## 中文（简体）

### 简短描述（不超过 132 个字符）

收集指定BOSS 职位详情，本地保存并导出供后续分析。

### 详细描述

JobCollector 帮你把主动选择的职位详情整理成结构统一、可追溯的本地记录。

当你打开一条 BOSS 直聘职位详情并点击“收集当前职位”后，JobCollector 会读取当前页面已经展示的职位名称、公司、薪资、地点、经验、学历、职位描述和公司简介，完成字段校验和自动去重，然后保存在你的浏览器本地。需要进一步整理或分析时，可一键导出稳定格式的 CSV。

核心功能

• 一次只收集当前打开的一条职位，不自动翻页或批量抓取
• 自动校验关键字段，并按职位 ID 或网址去重更新
• 在 Chrome 侧边栏查看已收集职位数量、公司和职位名称
• 导出 UTF-8 CSV，便于在 Excel、表格工具或其他工作流中继续使用
• 支持一键清空本扩展保存的全部本地数据

隐私优先

• 只有在你点击“收集当前职位”后才读取当前职位页面
• 职位页面网址及页面中已展示的职位内容仅保存在 chrome.storage.local
• 没有后端、账号系统、云同步、广告、遥测或第三方分析
• 不读取账号密码、Cookie、聊天记录或招聘者联系方式
• 不自动登录、打招呼、投递简历或调用招聘网站私有接口

当前版本仅支持 zhipin.com 和 www.zhipin.com 的职位详情页。首次收集时，Chrome 会询问你是否允许 JobCollector 访问这两个域名；拒绝授权后，扩展不会读取页面。

JobCollector 是独立工具，与 BOSS 直聘不存在隶属、赞助或官方合作关系。使用时请遵守相关网站的条款和政策。

### 单一用途说明

在用户主动操作后读取当前 BOSS 直聘职位详情页中已展示的职位信息，将其保存在用户浏览器本地，并按用户要求导出为结构化 CSV。

### 权限用途说明

**activeTab**

仅在用户点击“收集当前职位”后识别并临时访问当前活动标签页，以确认当前页面是否为受支持的职位详情页。

**scripting**

在用户点击收集后，将随扩展打包的职位读取脚本注入当前标签页。脚本只读取当前页面已展示的职位字段，不加载或执行远程代码。

**sidePanel**

用于在 Chrome 侧边栏中提供职位收集、已收集职位列表、CSV 下载和清空本地数据界面。

**storage**

用于把用户主动收集的职位记录保存在 chrome.storage.local，以便在浏览器会话之间保留、显示、导出和删除。数据不会上传到开发者服务器。

**可选网站访问权限：zhipin.com、www.zhipin.com**

仅在用户点击收集时通过 Chrome 原生权限提示请求，用于读取受支持的 BOSS 直聘职位详情页。权限不是安装时强制授予，不用于其他网站或后台浏览监控。

### 版本 0.1.0 发布说明

首次公开版本：支持用户主动收集当前 BOSS 职位详情、本地去重保存、侧边栏列表、CSV 导出和全部数据清空。

## English

### Short description (132 characters or fewer)

Save the current BOSS Zhipin job posting locally and export clean, structured CSV—one job at a time.

### Detailed description

JobCollector turns job postings you actively select into consistent, traceable local records.

Open a BOSS Zhipin job-detail page and click “Collect current job.” JobCollector reads the job title, company, salary, location, experience, education, job description, and company description already displayed on that page. It validates the fields, deduplicates the record, and stores it locally in your browser. When you are ready to organize or analyze your saved jobs, export them as a stable CSV file.

Core features

• Collects only the currently open job posting, one at a time
• Never paginates, opens jobs, or performs bulk collection automatically
• Validates required fields and updates duplicates by job ID or normalized URL
• Shows the saved-job count, company names, and job titles in the Chrome side panel
• Exports UTF-8 CSV for use in Excel, spreadsheet tools, or other workflows
• Clears all locally stored JobCollector data on request

Privacy first

• Reads the current job page only after you click “Collect current job”
• Stores the job-page URL and displayed job content only in chrome.storage.local
• Has no backend, account system, cloud sync, ads, telemetry, or third-party analytics
• Does not access passwords, cookies, chat messages, or recruiter contact details
• Does not sign in, contact recruiters, submit applications, or call private recruiting-site APIs

The current version supports job-detail pages on zhipin.com and www.zhipin.com only. The first time you collect a job, Chrome asks whether JobCollector may access these domains. If you deny access, the Extension does not read the page.

JobCollector is an independent tool and is not affiliated with, sponsored by, or officially endorsed by BOSS Zhipin. Please follow the terms and policies of the websites you use.

### Single-purpose description

After an explicit user action, read job information already displayed on the current BOSS Zhipin job-detail page, store it locally in the user's browser, and export it as structured CSV when requested.

### Permission justifications

**activeTab**

Used only after the user clicks “Collect current job” to identify and temporarily access the active tab and confirm that it is a supported job-detail page.

**scripting**

Injects the packaged job-reading script into the current tab after the user clicks the collection button. The script reads only job fields already displayed on the page and does not load or execute remote code.

**sidePanel**

Provides the job collection, saved-job list, CSV download, and local-data clearing interface in the Chrome side panel.

**storage**

Stores job records actively collected by the user in chrome.storage.local so they remain available across browser sessions for display, export, and deletion. Data is not uploaded to a developer server.

**Optional host access: zhipin.com and www.zhipin.com**

Requested through Chrome's native permission prompt only when the user clicks the collection button. It is used to read supported BOSS Zhipin job-detail pages and is not required at installation, used on other websites, or used for background browsing monitoring.

### Version 0.1.0 release notes

Initial public release: manually collect the current BOSS Zhipin job posting, deduplicate and save it locally, view saved jobs in the side panel, export CSV, and clear all saved data.

## Privacy practices 表单建议 / Recommended privacy form answers

### 数据类型 / Data types

根据当前实现，建议勾选：

- **Website content / 网站内容：是**。扩展读取并保存当前页面展示的职位字段。
- **Web history 或 Web browsing activity / 网页浏览活动：是**。扩展保存当前职位页面的 URL；Google 对该类别的定义包含用户访问或交互的域名和 URL。

建议不要勾选：

- Personally identifiable information / 个人身份信息；
- Health information / 健康信息；
- Financial and payment information / 财务和支付信息；
- Authentication information / 身份验证信息；
- Personal communications / 个人通信；
- Location / 用户位置（职位的工作地点属于网页职位内容，不是用户设备位置）；
- User activity / 用户活动分析（扩展不进行点击、遥测或行为分析）。

最终应以提交版本的实际行为和 Dashboard 当时显示的字段定义为准。

### 数据用途与 Limited Use 认证 / Data use certifications

当前实现满足以下声明，可按 Dashboard 的实际措辞勾选认证：

- 数据只用于提供 JobCollector 明确披露的单一用途；
- 不向第三方出售数据；
- 不将数据用于与单一用途无关的用途；
- 不将数据用于信用评估或贷款；
- 不将数据用于个性化广告；
- 不允许人工读取用户数据；
- 不向开发者服务器或第三方传输职位数据。

### 远程代码 / Remote code

选择：**No, I am not using remote code / 否，不使用远程代码**。

## 审核测试说明 / Reviewer test instructions

### 中文参考

1. 安装扩展并点击 JobCollector 工具栏图标，打开 Chrome 侧边栏。
2. 在 `https://www.zhipin.com/job_detail/` 下打开一条可正常展示详情的职位页面。
3. 在侧边栏点击“收集当前职位”。
4. 首次使用时，在 Chrome 原生权限提示中允许访问 `zhipin.com` 和 `www.zhipin.com`。
5. 收集成功后，侧边栏会显示职位数量，并在列表中显示公司和职位名称。
6. 再次收集同一职位会更新原记录，不会新增重复记录。
7. 点击“下载 CSV”可导出所有本地记录。
8. 点击“清空”并确认后，会删除本扩展在 chrome.storage.local 中保存的全部职位记录。

扩展不要求 JobCollector 账号，也没有后端。若 BOSS 直聘要求登录才能查看测试职位，请使用审核环境中可用的 BOSS 直聘账号。扩展不会读取账号凭据、Cookie 或聊天内容。

### English version

1. Install the Extension and click the JobCollector toolbar icon to open the Chrome side panel.
2. Open a job-detail page under `https://www.zhipin.com/job_detail/` that displays the full job details.
3. Click “Collect current job” in the side panel.
4. On first use, approve Chrome's native optional-permission prompt for `zhipin.com` and `www.zhipin.com`.
5. After collection succeeds, the side panel shows the saved-job count, company name, and job title.
6. Collecting the same job again updates the existing record instead of creating a duplicate.
7. Click “Download CSV” to export all locally stored records.
8. Click “Clear” and confirm to delete all job records stored by the Extension in chrome.storage.local.

The Extension requires no JobCollector account and has no backend. If BOSS Zhipin requires sign-in to view the test job, use a BOSS Zhipin account available in the review environment. The Extension does not access account credentials, cookies, or chat content.
