import {
  createPrimitiveButton,
  createPrimitiveCheckbox,
  createPrimitiveDivider,
  createPrimitiveIconButton,
  createPrimitiveMeter,
  createPrimitiveProgress,
  createPrimitiveRadio,
  createPrimitiveSwitch
} from '@ds/components';
import { clearIconRegistry, registerIcons } from '@ds/core';

import './primitives.css';

export function renderPrimitiveComponentsShowcase(container: HTMLElement): void {
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
  page.className = 'primitives-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Primitive Components Demo';

  const actions = document.createElement('section');
  actions.className = 'primitives-card';
  actions.append(
    createPrimitiveButton({ label: 'Save' }),
    createPrimitiveButton({ label: 'Delete', color: 'negative', shape: 'outlined' }),
    createPrimitiveIconButton({ icon: 'check', ariaLabel: 'Confirm', variant: 'filled' }),
    createPrimitiveIconButton({ icon: 'close', ariaLabel: 'Cancel', variant: 'outlined' })
  );

  const controls = document.createElement('section');
  controls.className = 'primitives-card';
  controls.append(
    createPrimitiveCheckbox({
      id: 'primitives-check',
      name: 'primitives-check',
      label: 'Enable notifications'
    }),
    createPrimitiveRadio({
      id: 'primitives-low',
      name: 'primitives-priority',
      value: 'low',
      label: 'Low'
    }),
    createPrimitiveRadio({
      id: 'primitives-high',
      name: 'primitives-priority',
      value: 'high',
      label: 'High',
      checked: true
    }),
    createPrimitiveSwitch({
      id: 'primitives-switch',
      name: 'primitives-switch',
      label: 'Auto deploy',
      checked: true
    })
  );

  const visuals = document.createElement('section');
  visuals.className = 'primitives-card';
  const dividerRow = document.createElement('div');
  dividerRow.className = 'primitives-row';
  dividerRow.append('Start', createPrimitiveDivider({ orientation: 'vertical' }), 'End');

  visuals.append(
    createPrimitiveDivider(),
    dividerRow,
    createPrimitiveProgress({ ariaLabel: 'Upload progress', value: 35 }),
    createPrimitiveProgress({ ariaLabel: 'Background sync progress', indeterminate: true }),
    createPrimitiveMeter({
      label: 'Readiness',
      helper: 'Native meter expresses bounded quality, not task progress.',
      value: 72,
      low: 40,
      high: 80,
      optimum: 90
    }).element
  );

  page.append(heading, actions, controls, visuals);
  container.replaceChildren(page);
}
