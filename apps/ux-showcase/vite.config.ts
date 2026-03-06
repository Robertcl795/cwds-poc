import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(appRoot, '..', '..');

export default defineConfig({
  resolve: {
    alias: {
      '@ds/core/lit': resolve(workspaceRoot, 'packages/design-core/src/lit/index.ts'),
      '@ds/core': resolve(workspaceRoot, 'packages/design-core/src/index.ts'),
      '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts'),
      '@ds/web-components': resolve(workspaceRoot, 'packages/ui-system/web-components/src/index.ts'),
      '@ds/styles/tokens.css': resolve(workspaceRoot, 'packages/styles/src/tokens.css'),
      '@ds/styles/index.css': resolve(workspaceRoot, 'packages/styles/src/index.css')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
