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
        alias: {
          ...existingConfig.resolve?.alias,
          '@ds/core/lit': resolve(workspaceRoot, 'packages/design-core/src/lit/index.ts'),
          '@ds/core': resolve(workspaceRoot, 'packages/design-core/src/index.ts'),
          '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts'),
          '@ds/utils-a11y': resolve(workspaceRoot, 'packages/design-core/src/index.ts'),
          '@ds/utils-icons': resolve(workspaceRoot, 'packages/design-core/src/index.ts'),
          '@ds/web-components': resolve(workspaceRoot, 'packages/ui-system/web-components/src/index.ts'),
          '@ds/styles/tokens.css': resolve(workspaceRoot, 'packages/styles/src/tokens.css'),
          '@ds/styles/index.css': resolve(workspaceRoot, 'packages/styles/src/index.css')
        }
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
