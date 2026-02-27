import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const workspaceRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      '@covalent-poc/core': resolve(workspaceRoot, 'packages/core/src/index.ts'),
      '@covalent-poc/components': resolve(workspaceRoot, 'packages/components/src/index.ts'),
      '@covalent-poc/primitives-foundation': resolve(workspaceRoot, 'packages/primitives-foundation/src/index.ts'),
      '@covalent-poc/styles': resolve(workspaceRoot, 'packages/styles/src'),
      '@covalent-poc/tokens': resolve(workspaceRoot, 'packages/tokens/src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
