import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/{adapters,domain,export,storage}/**/*.ts'],
      thresholds: {
        lines: 90,
      },
    },
  },
});
