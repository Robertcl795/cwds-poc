import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const workspaceRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      '@ds/core': resolve(workspaceRoot, 'packages/design-core/core/src/index.ts'),
      '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts'),
      '@ds/utils-a11y': resolve(workspaceRoot, 'packages/design-core/utils-a11y/src/index.ts'),
      '@ds/utils-icons': resolve(workspaceRoot, 'packages/design-core/utils-icons/src/index.ts'),
      '@ds/web-components': resolve(workspaceRoot, 'packages/ui-system/web-components/src/index.ts'),
      '@ds/styles': resolve(workspaceRoot, 'packages/design-core/styles/src'),
      '@ds/tokens': resolve(workspaceRoot, 'packages/design-core/tokens/src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174
  }
});
