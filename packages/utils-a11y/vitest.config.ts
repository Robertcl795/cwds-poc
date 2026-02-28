import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(packageRoot, '..', '..');

export default defineConfig({
  resolve: {
    alias: {
      '@ds/headless': resolve(workspaceRoot, 'packages/headless/src/index.ts')
    }
  },
  test: {
    environment: 'jsdom'
  }
});
