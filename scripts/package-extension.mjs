import {mkdir, readFile, readdir, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const distDirectory = resolve(rootDirectory, 'dist');
const artifactsDirectory = resolve(rootDirectory, 'artifacts');
const packageMetadata = JSON.parse(
  await readFile(resolve(rootDirectory, 'package.json'), 'utf8'),
);
const filename = `job-collector-extension-${packageMetadata.version}.zip`;
const artifactPath = resolve(artifactsDirectory, filename);

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await listFiles(resolve(directory, entry.name), relativePath)));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

const files = await listFiles(distDirectory);
const forbidden = files.filter((file) =>
  /(?:^|\/)(?:fixtures?|tests?|coverage|playwright-report)(?:\/|$)|\.map$/u.test(file),
);
if (forbidden.length > 0) {
  throw new Error(`Forbidden files in dist: ${forbidden.join(', ')}`);
}

await mkdir(artifactsDirectory, {recursive: true});
await rm(artifactPath, {force: true});
const zip = spawnSync('zip', ['-X', '-q', '-r', artifactPath, '.'], {
  cwd: distDirectory,
  encoding: 'utf8',
});
if (zip.status !== 0) {
  throw new Error(zip.stderr || 'zip failed without an error message.');
}

console.log(`Created artifacts/${filename}`);
console.log(files.map((file) => `  ${file}`).join('\n'));
