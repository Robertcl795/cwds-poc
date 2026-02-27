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
          '@covalent-poc/tokens': resolve(workspaceRoot, 'packages/tokens/src'),
          '@covalent-poc/styles': resolve(workspaceRoot, 'packages/styles/src'),
          '@covalent-poc/core': resolve(workspaceRoot, 'packages/core/src/index.ts'),
          '@covalent-poc/primitives-foundation': resolve(
            workspaceRoot,
            'packages/primitives-foundation/src/index.ts'
          ),
          '@covalent-poc/components': resolve(workspaceRoot, 'packages/components/src/index.ts')
        }
      }
    };
  }
};

export default config;
