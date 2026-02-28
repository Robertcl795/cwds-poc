import {
  createPrimitiveButton,
  createPrimitiveCheckbox,
  createPrimitiveDivider,
  createPrimitiveIconButton,
  createPrimitiveProgress,
  createPrimitiveRadio,
  createPrimitiveSwitch
} from '@ds/primitives';
import { clearIconRegistry, registerIcons } from '@ds/utils-icons';

import './phase1.css';

export function renderPhase1Showcase(container: HTMLElement): void {
  clearIconRegistry();
  registerIcons({
    check: {
      viewBox: '0 0 24 24',
      paths: ['M4 12l5 5 11-11']
    },
    close: {
      viewBox: '0 0 24 24',
      paths: ['M6 6L18 18', 'M18 6L6 18']
    }
  });

  const page = document.createElement('main');
  page.className = 'phase1-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 1 Primitives Demo';

  const actions = document.createElement('section');
  actions.className = 'phase1-card';
  actions.append(
    createPrimitiveButton({ label: 'Save' }),
    createPrimitiveButton({ label: 'Delete', color: 'negative', shape: 'outlined' }),
    createPrimitiveIconButton({ icon: 'check', ariaLabel: 'Confirm', variant: 'filled' }),
    createPrimitiveIconButton({ icon: 'close', ariaLabel: 'Cancel', variant: 'outlined' })
  );

  const controls = document.createElement('section');
  controls.className = 'phase1-card';
  controls.append(
    createPrimitiveCheckbox({
      id: 'phase1-check',
      name: 'phase1-check',
      label: 'Enable notifications'
    }),
    createPrimitiveRadio({
      id: 'phase1-low',
      name: 'phase1-priority',
      value: 'low',
      label: 'Low'
    }),
    createPrimitiveRadio({
      id: 'phase1-high',
      name: 'phase1-priority',
      value: 'high',
      label: 'High',
      checked: true
    }),
    createPrimitiveSwitch({
      id: 'phase1-switch',
      name: 'phase1-switch',
      label: 'Auto deploy',
      checked: true
    })
  );

  const visuals = document.createElement('section');
  visuals.className = 'phase1-card';
  const dividerRow = document.createElement('div');
  dividerRow.className = 'phase1-row';
  dividerRow.append('Start', createPrimitiveDivider({ orientation: 'vertical' }), 'End');

  visuals.append(
    createPrimitiveDivider(),
    dividerRow,
    createPrimitiveProgress({ ariaLabel: 'Upload progress', value: 35 }),
    createPrimitiveProgress({ ariaLabel: 'Background sync progress', indeterminate: true })
  );

  page.append(heading, actions, controls, visuals);
  container.replaceChildren(page);
}
