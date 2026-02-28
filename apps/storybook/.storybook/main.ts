import type { StorybookConfig } from '@storybook/html-vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const workspaceRoot = resolve(fileURLToPath(new URL('../../..', import.meta.url)));

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
          ...(existingConfig.resolve?.alias ?? {}),
          '@ds/tokens': resolve(workspaceRoot, 'packages/tokens/src'),
          '@ds/styles': resolve(workspaceRoot, 'packages/styles/src'),
          '@ds/headless': resolve(workspaceRoot, 'packages/headless/src/index.ts'),
          '@ds/utils-a11y': resolve(workspaceRoot, 'packages/utils-a11y/src/index.ts'),
          '@ds/utils-icons': resolve(workspaceRoot, 'packages/utils-icons/src/index.ts'),
          '@ds/primitives': resolve(workspaceRoot, 'packages/primitives/src/index.ts'),
          '@ds/lit': resolve(workspaceRoot, 'packages/adapters/lit/src/index.ts'),
          '@ds/angular': resolve(workspaceRoot, 'packages/adapters/angular/src/index.ts'),
          '@ds/utils-overlay': resolve(workspaceRoot, 'packages/utils-overlay/src/index.ts'),
          '@ds/migration-bridge': resolve(workspaceRoot, 'packages/migration-bridge/src/index.ts')
        }
      }
    };
  }
};

export default config;
