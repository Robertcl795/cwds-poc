import { createCompositeDialog, createPrimitiveList, createPrimitiveTabs } from '@covalent-poc/components';

import './phase3-hardening.css';

const createPanel = (text: string): HTMLElement => {
  const panel = document.createElement('section');
  panel.textContent = text;
  return panel;
};

export function renderPhase35HardeningShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase35-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 3.5 Hardening Demo';

  const subtitle = document.createElement('p');
  subtitle.textContent =
    'Overlay behavior, focus restoration, keyboard parity, and state semantics hardening for Phase 3 surfaces.';

  const grid = document.createElement('section');
  grid.className = 'phase35-grid';

  const tabsCard = document.createElement('article');
  tabsCard.className = 'phase35-card';

  const tabsTitle = document.createElement('h2');
  tabsTitle.textContent = 'Tabs Keyboard Parity';

  const tabsLog = document.createElement('p');
  tabsLog.className = 'phase35-log';
  tabsLog.id = 'phase35-tabs-log';
  tabsLog.textContent = 'Use arrow keys then Enter/Space to activate.';

  const tabs = createPrimitiveTabs({
    ariaLabel: 'Phase 3.5 tabs',
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
  listCard.className = 'phase35-card';

  const listTitle = document.createElement('h2');
  listTitle.textContent = 'Action List Integrity';

  const listLog = document.createElement('p');
  listLog.className = 'phase35-log';
  listLog.id = 'phase35-list-log';
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
  overlayCard.className = 'phase35-card';

  const overlayTitle = document.createElement('h2');
  overlayTitle.textContent = 'Dialog Focus Restore';

  const overlayLog = document.createElement('p');
  overlayLog.className = 'phase35-log';
  overlayLog.id = 'phase35-overlay-log';
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
  note.className = 'phase35-note';
  note.textContent =
    'Menu and FAB hardening checks are tracked in release-readiness docs; menu/fab primitives are not yet present in this workspace and should be added before final Phase 3.5 signoff.';

  grid.append(tabsCard, listCard, overlayCard);
  page.append(heading, subtitle, grid, note);
  container.replaceChildren(page);
}
