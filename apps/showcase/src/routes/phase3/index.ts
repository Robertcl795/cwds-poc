import { createPrimitiveList, createPrimitiveTabs } from '@covalent-poc/components';

import './phase3.css';

const createPanel = (text: string): HTMLElement => {
  const panel = document.createElement('section');
  panel.textContent = text;
  return panel;
};

export function renderPhase3Showcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase3-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 3 (Path 1) Demo';

  const blurb = document.createElement('p');
  blurb.textContent =
    'This slice includes shared overlay/navigation glue plus baseline list and tabs primitives. Dialog, menu, and FAB land next.';

  const grid = document.createElement('section');
  grid.className = 'phase3-grid';

  const listCard = document.createElement('article');
  listCard.className = 'phase3-card';

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
  tabsCard.className = 'phase3-card';

  const tabsTitle = document.createElement('h2');
  tabsTitle.textContent = 'Tabs (Manual Activation)';

  const tabs = createPrimitiveTabs({
    ariaLabel: 'Phase 3 tabs showcase',
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

  tabs.element.classList.add('phase3-tabs');

  tabsCard.append(tabsTitle, tabs.element);

  grid.append(listCard, tabsCard);
  page.append(heading, blurb, grid);

  container.replaceChildren(page);
}
