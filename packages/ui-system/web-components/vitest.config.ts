import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(packageRoot, '..', '..', '..');

export default defineConfig({
  resolve: {
    alias: {
      '@ds/core': resolve(workspaceRoot, 'packages/design-core/src/index.ts'),
      '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
});
