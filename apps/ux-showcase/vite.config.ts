import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const workspaceRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      '@ds/headless': resolve(workspaceRoot, 'packages/headless/src/index.ts'),
      '@ds/primitives': resolve(workspaceRoot, 'packages/primitives/src/index.ts'),
      '@ds/utils-a11y': resolve(workspaceRoot, 'packages/utils-a11y/src/index.ts'),
      '@ds/utils-icons': resolve(workspaceRoot, 'packages/utils-icons/src/index.ts'),
      '@ds/lit': resolve(workspaceRoot, 'packages/adapters/lit/src/index.ts'),
      '@ds/styles': resolve(workspaceRoot, 'packages/styles/src'),
      '@ds/tokens': resolve(workspaceRoot, 'packages/tokens/src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
