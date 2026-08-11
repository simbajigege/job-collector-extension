import {spawn} from 'node:child_process';

const vite = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const commonArguments = [vite.pathname, 'build', '--watch', '--mode', 'development'];
const children = [
  spawn(process.execPath, commonArguments, {stdio: 'inherit'}),
  spawn(process.execPath, [...commonArguments, '--config', 'vite.content.config.ts'], {
    stdio: 'inherit',
  }),
];

function stop(signal) {
  for (const child of children) child.kill(signal);
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

await Promise.all(
  children.map(
    (child) =>
      new Promise((resolve, reject) => {
        child.on('exit', (code) => {
          if (code === 0 || code === null) resolve();
          else reject(new Error(`Vite watcher exited with code ${code}.`));
        });
        child.on('error', reject);
      }),
  ),
);
