import './preview.css';

import '@ds/tokens/index.css';
import '@ds/core/index.css';
import '@ds/components/index.css';

const DEFAULT_STORY_MAX_WIDTH = '72rem';

const applyTheme = (theme: string): void => {
  const nodes = [document.documentElement, document.body];

  for (const node of nodes) {
    if (!node) {
      continue;
    }

    if (theme === 'dark' || theme === 'light') {
      node.dataset.theme = theme;
      continue;
    }

    delete node.dataset.theme;
  }
};

const normalizeStoryResult = (result: unknown): Node => {
  if (result instanceof Node) {
    return result;
  }

  const container = document.createElement('div');

  if (typeof result === 'string') {
    container.innerHTML = result;
    return container;
  }

  if (Array.isArray(result)) {
    container.append(...result.filter((entry): entry is Node => entry instanceof Node));
    return container;
  }

  container.textContent = '';
  return container;
};

const preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Applies the design-system theme through the shared data-theme attribute.',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' }
        ]
      }
    }
  },

  parameters: {
    a11y: {
      test: 'todo'
    },
    controls: {
      expanded: true
    },
    layout: 'fullscreen'
  },

  decorators: [
    (story, context) => {
      applyTheme(String(context.globals.theme ?? 'light'));

      const shell = document.createElement('div');
      shell.className = 'cv-storybook-shell';
      shell.dataset.viewMode = context.viewMode ?? 'story';

      const frame = document.createElement('div');
      frame.className = 'cv-storybook-frame';
      frame.style.setProperty('--cv-storybook-max-width', String(context.parameters.storyMaxWidth ?? DEFAULT_STORY_MAX_WIDTH));

      frame.append(normalizeStoryResult(story()));
      shell.append(frame);

      return shell;
    }
  ],

  tags: ['autodocs']
};

export default preview;
