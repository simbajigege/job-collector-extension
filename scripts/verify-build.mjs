import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const distDirectory = resolve(import.meta.dirname, '../dist');
const manifest = JSON.parse(
  await readFile(resolve(distDirectory, 'manifest.json'), 'utf8'),
);
const expectedPermissions = ['activeTab', 'scripting', 'sidePanel', 'storage'];
const expectedOptionalHostPermissions = [
  'https://zhipin.com/*',
  'https://www.zhipin.com/*',
];
const actualPermissions = [...(manifest.permissions ?? [])].sort();
const actualOptionalHostPermissions = [
  ...(manifest.optional_host_permissions ?? []),
].sort();

if (
  JSON.stringify(actualPermissions) !== JSON.stringify([...expectedPermissions].sort())
) {
  throw new Error(
    `Unexpected manifest permissions: ${JSON.stringify(actualPermissions)}.`,
  );
}

if ('host_permissions' in manifest) {
  throw new Error('The production manifest must not declare required host permissions.');
}

if (
  JSON.stringify(actualOptionalHostPermissions) !==
  JSON.stringify([...expectedOptionalHostPermissions].sort())
) {
  throw new Error(
    `Unexpected optional host permissions: ${JSON.stringify(actualOptionalHostPermissions)}.`,
  );
}

if (manifest.side_panel?.default_path !== 'popup.html') {
  throw new Error('The production manifest must use popup.html as its side panel.');
}

if ('default_popup' in (manifest.action ?? {})) {
  throw new Error('The toolbar action must open the side panel, not a popup.');
}

const expectedIcons = {
  16: 'icons/icon-16.png',
  32: 'icons/icon-32.png',
  48: 'icons/icon-48.png',
  128: 'icons/icon-128.png',
};
const expectedActionIcons = {
  16: expectedIcons[16],
  32: expectedIcons[32],
};
if (JSON.stringify(manifest.icons) !== JSON.stringify(expectedIcons)) {
  throw new Error(`Unexpected extension icons: ${JSON.stringify(manifest.icons)}.`);
}
if (
  JSON.stringify(manifest.action?.default_icon) !== JSON.stringify(expectedActionIcons)
) {
  throw new Error(
    `Unexpected toolbar icons: ${JSON.stringify(manifest.action?.default_icon)}.`,
  );
}

const requiredFiles = [
  'manifest.json',
  'popup.html',
  'icons/icon-16.png',
  'icons/icon-32.png',
  'icons/icon-48.png',
  'icons/icon-128.png',
  'assets/service-worker.js',
  'assets/collect-current-job.js',
];
const entries = await readdir(resolve(distDirectory, 'assets'));
if (!entries.some((entry) => /^popup-[\w-]+\.css$/u.test(entry))) {
  throw new Error('Missing built popup stylesheet.');
}

for (const relativePath of requiredFiles) {
  await readFile(resolve(distDirectory, relativePath));
}

console.log(
  `Verified manifest permissions: ${expectedPermissions.join(', ')}; optional host access: ${expectedOptionalHostPermissions.join(', ')}`,
);
