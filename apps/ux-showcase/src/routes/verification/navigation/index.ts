import { createCompositeDialog, createPrimitiveList, createPrimitiveTabs } from '@ds/components';

import './navigation.css';

const createPanel = (text: string): HTMLElement => {
  const panel = document.createElement('section');
  panel.textContent = text;
  return panel;
};

export function renderNavigationVerificationShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'verification-navigation-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Navigation Verification Demo';

  const subtitle = document.createElement('p');
  subtitle.textContent =
    'Overlay behavior, focus restoration, keyboard parity, and state semantics hardening for navigation surfaces.';

  const grid = document.createElement('section');
  grid.className = 'verification-navigation-grid';

  const tabsCard = document.createElement('article');
  tabsCard.className = 'verification-navigation-card';

  const tabsTitle = document.createElement('h2');
  tabsTitle.textContent = 'Tabs Keyboard Parity';

  const tabsLog = document.createElement('p');
  tabsLog.className = 'verification-navigation-log';
  tabsLog.id = 'verification-navigation-tabs-log';
  tabsLog.textContent = 'Use arrow keys then Enter/Space to activate.';

  const tabs = createPrimitiveTabs({
    ariaLabel: 'Navigation verification tabs',
    onSelectedChange(selectedId, source) {
      tabsLog.textContent = `Selected: ${selectedId} (${source})`;
    },
    tabs: [
      { id: 'overview', label: 'Overview', panel: createPanel('Manual activation keeps focus and selection separate.') },
      { id: 'coverage', label: 'Coverage', panel: createPanel('Disabled tabs are skipped by roving tabindex.'), disabled: true },
      { id: 'checks', label: 'Checks', panel: createPanel('Home/End and orientation coverage should be tested.') }
    ]
  });

  tabsCard.append(tabsTitle, tabs.element, tabsLog);

  const listCard = document.createElement('article');
  listCard.className = 'verification-navigation-card';

  const listTitle = document.createElement('h2');
  listTitle.textContent = 'Action List Integrity';

  const listLog = document.createElement('p');
  listLog.className = 'verification-navigation-log';
  listLog.id = 'verification-navigation-list-log';
  listLog.textContent = 'Disabled items should never fire callbacks.';

  const list = createPrimitiveList({
    variant: 'action',
    managedFocus: true,
    items: [
      { id: 'open-report', headline: 'Open hardening report', supportingText: 'Tracks CI gates', leading: '📄' },
      { id: 'run-a11y', headline: 'Run a11y checks', supportingText: 'Axe + manual SR pass', leading: '♿' },
      { id: 'archive', headline: 'Archive outdated baseline', leading: '🗃', disabled: true }
    ],
    onAction(item, source) {
      listLog.textContent = `Action: ${item.id} (${source})`;
    }
  });

  listCard.append(listTitle, list.element, listLog);

  const overlayCard = document.createElement('article');
  overlayCard.className = 'verification-navigation-card';

  const overlayTitle = document.createElement('h2');
  overlayTitle.textContent = 'Dialog Focus Restore';

  const overlayLog = document.createElement('p');
  overlayLog.className = 'verification-navigation-log';
  overlayLog.id = 'verification-navigation-overlay-log';
  overlayLog.textContent = 'Open and close the dialog to verify focus returns to trigger.';

  const openDialog = document.createElement('button');
  openDialog.className = 'cv-button';
  openDialog.type = 'button';
  openDialog.textContent = 'Open hardening dialog';

  const dialog = createCompositeDialog({
    trigger: openDialog,
    title: 'Overlay hardening checks',
    description: 'Verify Escape, focus restoration, and close path consistency.',
    closeOnOutsidePress: true,
    onConfirm: () => {
      overlayLog.textContent = 'Confirmed dialog action.';
    }
  });

  openDialog.addEventListener('click', () => {
    dialog.showModal();
    overlayLog.textContent = 'Dialog opened. Close it and confirm focus returns to trigger.';
  });

  dialog.addEventListener('close', () => {
    const active = document.activeElement;
    const restored = active === openDialog;
    overlayLog.textContent = restored
      ? 'Dialog closed and focus restored to trigger.'
      : 'Dialog closed; verify fallback focus target in hardening checklist.';
  });

  overlayCard.append(overlayTitle, openDialog, overlayLog, dialog);

  const note = document.createElement('p');
  note.className = 'verification-navigation-note';
  note.textContent =
    'Additional overlay hardening checks stay tracked in release-readiness docs; the verified surfaces here cover the currently supported navigation and dialog behaviors.';

  grid.append(tabsCard, listCard, overlayCard);
  page.append(heading, subtitle, grid, note);
  container.replaceChildren(page);
}
