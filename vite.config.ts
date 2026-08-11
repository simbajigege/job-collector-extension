import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

import {defineConfig, type Plugin} from 'vite';

import {manifest} from './manifest.config.ts';

function emitManifest(): Plugin {
  return {
    name: 'emit-extension-manifest',
    apply: 'build',
    async closeBundle() {
      await writeFile(
        resolve(import.meta.dirname, 'dist/manifest.json'),
        `${JSON.stringify(manifest, null, 2)}\n`,
        'utf8',
      );
    },
  };
}

export default defineConfig({
  plugins: [emitManifest()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, 'popup.html'),
        'service-worker': resolve(
          import.meta.dirname,
          'src/background/service-worker.ts',
        ),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
