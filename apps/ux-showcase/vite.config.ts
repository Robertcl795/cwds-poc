import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const appRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(appRoot, '..', '..');

export default defineConfig({
  resolve: {
    alias: {
      '@ds/core': resolve(workspaceRoot, 'packages/design-core/core/src/index.ts'),
      '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts'),
      '@ds/utils-a11y': resolve(workspaceRoot, 'packages/design-core/utils-a11y/src/index.ts'),
      '@ds/utils-icons': resolve(workspaceRoot, 'packages/design-core/utils-icons/src/index.ts'),
      '@ds/web-components': resolve(workspaceRoot, 'packages/ui-system/web-components/src/index.ts'),
      '@ds/tokens/tokens.css': resolve(workspaceRoot, 'packages/design-core/tokens/src/tokens.css'),
      '@ds/styles/index.css': resolve(workspaceRoot, 'packages/design-core/styles/src/index.css')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
