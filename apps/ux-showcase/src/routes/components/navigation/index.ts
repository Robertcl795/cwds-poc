import { createPrimitiveList, createPrimitiveTabs } from '@ds/components';

import './navigation.css';

const createPanel = (text: string): HTMLElement => {
  const panel = document.createElement('section');
  panel.textContent = text;
  return panel;
};

export function renderNavigationComponentsShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'navigation-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Navigation Components Demo';

  const blurb = document.createElement('p');
  blurb.textContent =
    'This route covers baseline list and tabs navigation behavior with package-owned runtime glue underneath.';

  const grid = document.createElement('section');
  grid.className = 'navigation-grid';

  const listCard = document.createElement('article');
  listCard.className = 'navigation-card';

  const listTitle = document.createElement('h2');
  listTitle.textContent = 'Action List';

  const listLog = document.createElement('p');
  listLog.textContent = 'Activate an item to inspect callback source.';
  listLog.style.margin = '0';
  listLog.style.color = 'var(--cv-sys-color-text-muted)';

  const list = createPrimitiveList({
    variant: 'action',
    managedFocus: true,
    items: [
      { id: 'release', headline: 'Open release board', supportingText: 'Progressive enhancement checklist', leading: '📋' },
      { id: 'publish', headline: 'Publish changelog', supportingText: 'Draft ready for review', leading: '📝' },
      { id: 'archive', headline: 'Archive old snapshot', leading: '🗃', disabled: true }
    ],
    onAction(item, source) {
      listLog.textContent = `Activated ${item.id} from ${source}`;
    }
  });

  listCard.append(listTitle, list.element, listLog);

  const tabsCard = document.createElement('article');
  tabsCard.className = 'navigation-card';

  const tabsTitle = document.createElement('h2');
  tabsTitle.textContent = 'Tabs (Manual Activation)';

  const tabs = createPrimitiveTabs({
    ariaLabel: 'Navigation tabs showcase',
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        panel: createPanel('Arrow keys move focus; Enter and Space activate selected tab.')
      },
      {
        id: 'activity',
        label: 'Activity',
        panel: createPanel('Selection updates panel visibility with APG-aligned tab roles.')
      },
      {
        id: 'alerts',
        label: 'Alerts',
        panel: createPanel('Disabled tabs are skipped in roving focus.'),
        disabled: true
      }
    ]
  });

  tabs.element.classList.add('navigation-tabs');

  tabsCard.append(tabsTitle, tabs.element);

  grid.append(listCard, tabsCard);
  page.append(heading, blurb, grid);

  container.replaceChildren(page);
}
