export const manifest = {
  manifest_version: 3,
  name: 'JobCollector',
  description: 'Collect the current job posting locally and export a stable CSV.',
  version: '0.1.1',
  minimum_chrome_version: '114',
  permissions: ['activeTab', 'scripting', 'sidePanel', 'storage'],
  optional_host_permissions: ['https://zhipin.com/*', 'https://www.zhipin.com/*'],
  icons: {
    16: 'icons/icon-16.png',
    32: 'icons/icon-32.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
  action: {
    default_title: '打开 JobCollector 侧边栏',
    default_icon: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
    },
  },
  side_panel: {
    default_path: 'popup.html',
  },
  background: {
    service_worker: 'assets/service-worker.js',
    type: 'module',
  },
} as const;
