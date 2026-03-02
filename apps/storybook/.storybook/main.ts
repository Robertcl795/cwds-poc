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
          '@ds/tokens': resolve(workspaceRoot, 'packages/design-core/tokens/src'),
          '@ds/styles': resolve(workspaceRoot, 'packages/design-core/styles/src'),
          '@ds/core': resolve(workspaceRoot, 'packages/design-core/core/src/index.ts'),
          '@ds/utils-a11y': resolve(workspaceRoot, 'packages/design-core/utils-a11y/src/index.ts'),
          '@ds/utils-icons': resolve(workspaceRoot, 'packages/design-core/utils-icons/src/index.ts'),
          '@ds/primitives': resolve(workspaceRoot, 'packages/ui-system/primitives/src/index.ts'),
          '@ds/web-components': resolve(workspaceRoot, 'packages/ui-system/web-components/src/index.ts'),
          '@ds/angular': resolve(workspaceRoot, 'packages/ui-system/angular/src/index.ts')
        }
      }
    };
  }
};

export default config;
