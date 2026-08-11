import {resolve} from 'node:path';

import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/assets',
    emptyOutDir: false,
    sourcemap: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/content/collect-current-job.ts'),
      formats: ['iife'],
      name: 'JobCollectorContent',
      fileName: () => 'collect-current-job.js',
    },
  },
});
