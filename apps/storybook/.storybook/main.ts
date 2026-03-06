import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/html-vite';

const storybookRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspaceRoot = resolve(storybookRoot, '..', '..', '..');

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/html-vite',
    options: {}
  },

  async viteFinal(existingConfig) {
    return {
      ...existingConfig,
      resolve: {
        ...existingConfig.resolve,
        alias: [
          { find: '@ds/components/web-components', replacement: resolve(workspaceRoot, 'packages/components/src/web-components/index.ts') },
          { find: '@ds/components/index.css', replacement: resolve(workspaceRoot, 'packages/components/src/index.css') },
          { find: '@ds/core/index.css', replacement: resolve(workspaceRoot, 'packages/core/src/index.css') },
          { find: '@ds/tokens/index.css', replacement: resolve(workspaceRoot, 'packages/tokens/src/index.css') },
          { find: '@ds/components', replacement: resolve(workspaceRoot, 'packages/components/src/index.ts') },
          { find: '@ds/core', replacement: resolve(workspaceRoot, 'packages/core/src/index.ts') },
          ...(Array.isArray(existingConfig.resolve?.alias) ? existingConfig.resolve.alias : [])
        ]
      },
      build: {
        ...existingConfig.build,
        rollupOptions: {
          ...existingConfig.build?.rollupOptions,
          output: {
            ...existingConfig.build?.rollupOptions?.output,
            manualChunks(id) {
              if (id.includes('node_modules/axe-core')) {
                return 'axe-core';
              }

              if (id.includes('node_modules/prismjs') || id.includes('node_modules/react-syntax-highlighter')) {
                return 'docs-code';
              }

              if (id.includes('node_modules/@storybook')) {
                return 'storybook-vendor';
              }
            }
          }
        }
      }
    };
  }
};

export default config;
