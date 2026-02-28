import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(packageRoot, '..', '..');

export default defineConfig({
  resolve: {
    alias: {
      '@ds/headless': resolve(workspaceRoot, 'packages/headless/src/index.ts'),
      '@ds/utils-a11y': resolve(workspaceRoot, 'packages/utils-a11y/src/index.ts'),
      '@ds/utils-icons': resolve(workspaceRoot, 'packages/utils-icons/src/index.ts')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
