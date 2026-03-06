import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(appRoot, '..', '..');

export default defineConfig({
  resolve: {
    alias: [
      { find: '@ds/components/web-components', replacement: resolve(workspaceRoot, 'packages/components/src/web-components/index.ts') },
      { find: '@ds/components/index.css', replacement: resolve(workspaceRoot, 'packages/components/src/index.css') },
      { find: '@ds/core/index.css', replacement: resolve(workspaceRoot, 'packages/core/src/index.css') },
      { find: '@ds/tokens/index.css', replacement: resolve(workspaceRoot, 'packages/tokens/src/index.css') },
      { find: '@ds/components', replacement: resolve(workspaceRoot, 'packages/components/src/index.ts') },
      { find: '@ds/core', replacement: resolve(workspaceRoot, 'packages/core/src/index.ts') }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
