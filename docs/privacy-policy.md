# JobCollector Privacy Policy / 隐私政策

**Effective date / 生效日期：2026-08-11**  
**Last updated / 最后更新：2026-08-11**

## 中文

### 1. 概述

JobCollector（以下简称“本扩展”）是一款本地优先的 Chrome/Chromium 浏览器扩展。它的单一用途是：在用户主动点击“收集当前职位”后，读取当前 BOSS 直聘职位详情页中已经展示的职位信息，将其保存在用户自己的浏览器中，并在用户主动操作时导出为 CSV 文件。

本扩展没有开发者运营的后端服务，不要求用户创建 JobCollector 账号，不包含广告、遥测、第三方分析、云同步或远程代码。

### 2. 本扩展处理的数据

只有当用户打开受支持的职位详情页并主动点击“收集当前职位”时，本扩展才会读取和处理以下数据：

- 当前职位页面的网址和可识别的职位 ID；
- 职位名称、公司名称、薪资、工作地点、经验要求和学历要求；
- 职位描述和当前页面已展示的公司简介；
- 数据采集时间、扩展版本，以及用于标记缺失可选字段的技术元数据。

这些数据属于当前网页的内容和与当前网页有关的浏览活动信息。本扩展只处理完成职位收集、去重、本地展示和 CSV 导出所必需的数据。

### 3. 本扩展不处理的数据

本扩展不会主动收集或访问：

- 用户姓名、电子邮箱、电话号码或其他身份资料；
- BOSS 直聘账号密码、Cookie、登录令牌或其他身份验证信息；
- 招聘者姓名、联系方式、聊天记录或个人通信；
- 支付、财务或健康信息；
- 与当前职位详情无关的表单数据、页面内容或浏览历史；
- 用户点击、使用频率、设备标识、崩溃日志或其他分析和遥测数据。

本扩展不会自动登录、翻页、打开其他职位、调用招聘网站私有接口，或在后台持续监控用户的浏览活动。

### 4. 数据的使用方式

本扩展仅将读取的数据用于以下用户可见功能：

- 规范化并校验当前职位信息；
- 按职位 ID 或规范化网址去重并更新本地记录；
- 在扩展侧边栏显示已收集职位的数量、公司名称和职位名称；
- 根据用户操作生成并下载 CSV 文件；
- 根据用户操作清空本扩展保存的全部本地职位数据。

本扩展不会使用这些数据进行用户画像、广告投放、信用评估、自动化招聘操作或任何未披露的用途。

### 5. 数据存储、保留和删除

职位数据存储在用户设备上的 `chrome.storage.local` 中，不会由本扩展上传到开发者服务器或云端服务。

数据会保留到用户执行以下任一操作为止：

- 在扩展中点击“清空”并确认删除；
- 通过浏览器清除本扩展的数据；
- 卸载本扩展（具体清理行为由浏览器控制）。

当用户主动导出 CSV 后，该文件会保存在用户选择或浏览器配置的下载位置。导出文件位于本扩展的控制范围之外，用户应自行管理和删除。

### 6. 数据共享和传输

本扩展不会向开发者、广告商、数据经纪商、分析服务或其他第三方传输、出售、出租或共享职位数据及浏览活动信息。

本扩展只读取用户浏览器中已经加载的当前职位页面。用户访问 BOSS 直聘网站时，该网站自身产生的网络通信由 BOSS 直聘的条款和隐私政策管理，并非由本扩展发起或控制。

### 7. 浏览器权限说明

本扩展使用以下最小权限：

- `activeTab`：在用户主动操作后识别并访问当前活动标签页；
- `scripting`：在用户点击收集后，将随扩展打包的职位读取脚本注入当前页面；
- `sidePanel`：在 Chrome 侧边栏中提供收集、列表、导出和清空界面；
- `storage`：在用户浏览器本地保存职位记录；
- 对 `https://zhipin.com/*` 和 `https://www.zhipin.com/*` 的可选访问权限：仅在用户点击收集时请求，用于读取受支持的 BOSS 直聘职位详情页。

本扩展不申请 `<all_urls>`、Cookie、浏览器历史、下载、网页请求拦截或调试器权限。用户可以拒绝可选网站访问权限；拒绝后，本扩展不会读取职位页面。

### 8. 数据安全

本扩展通过最小权限、本地存储和随扩展打包的代码来降低数据风险。由于本扩展不向开发者或第三方服务器传输职位数据，因此不存在由本扩展发起的职位数据网络传输。

用户仍应保护自己的设备、浏览器配置文件和导出的 CSV 文件，避免未经授权的访问。

### 9. Chrome Web Store Limited Use 声明

JobCollector 对从 Chrome API 和当前职位页面获得的信息的使用，遵守 Chrome Web Store 用户数据政策（包括 Limited Use 要求）。本扩展只将这些信息用于提供其明确披露的单一用途和用户可见功能，不将其用于个性化广告，也不出售或转移给第三方。

### 10. 儿童隐私

本扩展面向整理求职信息的用户，并非面向儿童。本扩展不会有意收集儿童的个人信息。

### 11. 第三方服务

本扩展是独立工具，与 BOSS 直聘不存在隶属、赞助或官方合作关系。用户使用招聘网站时，仍应遵守相应网站的条款和隐私政策。

### 12. 政策变更

如果本扩展的数据处理方式发生变化，本政策会同步更新生效日期和内容。涉及新增数据类型、用途或共享方式的重大变更，将在收集相关数据前通过商店页面或扩展界面向用户明确披露，并在适用时取得用户同意。

### 13. 联系方式

如果您对本隐私政策或 JobCollector 的数据处理方式有疑问，可以：

- 发送邮件至 [simbaji@163.com](mailto:simbaji@163.com)；或
- 通过 [GitHub Issues](https://github.com/simbajigege/job-collector-extension/issues) 联系维护者。请勿在公开 Issue 中提交真实职位数据、账号信息或其他敏感内容。

---

## English

### 1. Overview

JobCollector (the “Extension”) is a local-first extension for Chrome and Chromium-based browsers. Its single purpose is to read job information already displayed on the current BOSS Zhipin job-detail page after the user clicks **Collect current job**, store that information in the user's own browser, and export it as a CSV file when requested by the user.

The Extension has no developer-operated backend, does not require a JobCollector account, and contains no advertising, telemetry, third-party analytics, cloud sync, or remotely hosted code.

### 2. Data handled by the Extension

The Extension reads and processes the following data only when the user opens a supported job-detail page and actively clicks **Collect current job**:

- The current job-page URL and an identifiable job ID;
- Job title, company name, salary, workplace location, experience requirement, and education requirement;
- Job description and any company description already displayed on the current page;
- Collection time, Extension version, and technical metadata identifying missing optional fields.

This information is website content and browsing-activity information associated with the current page. The Extension handles only the information necessary to collect, deduplicate, display locally, and export the selected job posting.

### 3. Data the Extension does not handle

The Extension does not intentionally collect or access:

- The user's name, email address, telephone number, or other identity information;
- BOSS Zhipin passwords, cookies, login tokens, or other authentication information;
- Recruiter names, contact details, chat messages, or personal communications;
- Payment, financial, or health information;
- Form data, page content, or browsing history unrelated to the current job-detail page;
- Click analytics, usage frequency, device identifiers, crash reports, or other analytics or telemetry data.

The Extension does not automatically sign in, paginate, open other job postings, call private recruiting-site APIs, or continuously monitor browsing activity in the background.

### 4. How data is used

The Extension uses the data only for the following user-facing features:

- Normalizing and validating the current job information;
- Deduplicating and updating local records by job ID or normalized URL;
- Showing the number of saved jobs, company names, and job titles in the side panel;
- Generating and downloading a CSV file at the user's request;
- Clearing all locally stored JobCollector data at the user's request.

The Extension does not use this data for profiling, advertising, credit assessment, automated recruiting actions, or any undisclosed purpose.

### 5. Storage, retention, and deletion

Job data is stored in `chrome.storage.local` on the user's device. The Extension does not upload it to a developer server or cloud service.

The data remains until the user does one of the following:

- Clicks **Clear** in the Extension and confirms deletion;
- Clears the Extension's data through the browser; or
- Uninstalls the Extension, subject to the browser's data-removal behavior.

When the user exports a CSV file, the file is saved to the location selected by the user or configured in the browser. Exported files are outside the Extension's control, and the user is responsible for managing and deleting them.

### 6. Data sharing and transfer

The Extension does not transmit, sell, rent, or share job data or browsing-activity information with the developer, advertisers, data brokers, analytics providers, or any other third party.

The Extension reads only the current job page already loaded in the user's browser. Network communications generated by BOSS Zhipin while the user visits its website are governed by BOSS Zhipin's own terms and privacy policy and are not initiated or controlled by the Extension.

### 7. Browser permissions

The Extension uses the following minimum permissions:

- `activeTab`: Identifies and accesses the active tab after a user action;
- `scripting`: Injects the packaged job-reading script after the user clicks the collection button;
- `sidePanel`: Provides the collection, list, export, and clear interface in the Chrome side panel;
- `storage`: Stores job records locally in the user's browser;
- Optional access to `https://zhipin.com/*` and `https://www.zhipin.com/*`: Requested only when the user clicks the collection button and used to read supported BOSS Zhipin job-detail pages.

The Extension does not request `<all_urls>`, cookies, browser history, downloads, web-request interception, or debugger permissions. Users may deny the optional website permission; if denied, the Extension will not read the job page.

### 8. Data security

The Extension reduces data risk through minimum permissions, local storage, and code packaged with the Extension. Because it does not send job data to developer-operated or third-party servers, there is no network transmission of job data initiated by the Extension.

Users should still protect their devices, browser profiles, and exported CSV files against unauthorized access.

### 9. Chrome Web Store Limited Use disclosure

JobCollector's use of information received from Chrome APIs and the current job page complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. The Extension uses this information only to provide its clearly disclosed single purpose and user-facing features. It does not use the information for personalized advertising or sell or transfer it to third parties.

### 10. Children's privacy

The Extension is intended for people organizing job-search information and is not directed to children. The Extension does not knowingly collect personal information from children.

### 11. Third-party services

The Extension is an independent tool and is not affiliated with, sponsored by, or officially endorsed by BOSS Zhipin. Users remain responsible for complying with the terms and privacy policies of websites they use.

### 12. Changes to this policy

If the Extension's data practices change, this policy and its effective date will be updated. Any material change involving new data types, purposes, or sharing practices will be prominently disclosed through the store listing or Extension interface before the relevant data is handled, and user consent will be obtained where required.

### 13. Contact

For questions about this policy or JobCollector's data practices, you may:

- Email [simbaji@163.com](mailto:simbaji@163.com); or
- Contact the maintainer through [GitHub Issues](https://github.com/simbajigege/job-collector-extension/issues). Do not post real job data, account information, or other sensitive information in a public issue.
