import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      '@covalent-poc/core': resolve(packageRoot, '../core/src/index.ts')
    }
  },
  test: {
    environment: 'jsdom'
  }
});
