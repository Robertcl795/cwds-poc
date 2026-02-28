import {
  createPrimitiveChip,
  createPrimitiveSelect,
  createPrimitiveSlider,
  createPrimitiveTextField
} from '@ds/primitives';

import './phase2.css';

export function renderPhase2Showcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase2-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 2 Input Surfaces Demo';

  const textFields = document.createElement('section');
  textFields.className = 'phase2-card';
  textFields.append(
    createPrimitiveTextField({
      id: 'phase2-email',
      name: 'phase2-email',
      type: 'email',
      label: 'Email',
      helper: 'Used for release notifications',
      placeholder: 'team@example.com',
      outlined: true
    }).element,
    createPrimitiveTextField({
      id: 'phase2-id',
      name: 'phase2-id',
      label: 'Team ID',
      helper: '3-32 chars',
      icon: '#',
      maxLength: 32,
      charCounter: true,
      outlined: true
    }).element
  );

  const chips = document.createElement('section');
  chips.className = 'phase2-card phase2-chip-row';
  chips.append(
    createPrimitiveChip({
      variant: 'action',
      label: 'Deploy',
      iconStart: '🚀'
    }).element,
    createPrimitiveChip({
      variant: 'filter',
      id: 'phase2-chip-stable',
      name: 'phase2-release',
      value: 'stable',
      label: 'Stable',
      selected: true
    }).element,
    createPrimitiveChip({
      variant: 'filter',
      id: 'phase2-chip-beta',
      name: 'phase2-release',
      value: 'beta',
      label: 'Beta'
    }).element
  );

  const controls = document.createElement('section');
  controls.className = 'phase2-card';
  controls.append(
    createPrimitiveSlider({
      id: 'phase2-volume',
      name: 'phase2-volume',
      label: 'Volume',
      value: 35,
      helper: 'Arrow keys for fine control',
      showValue: true
    }).element,
    createPrimitiveSelect({
      id: 'phase2-status',
      name: 'phase2-status',
      label: 'Release status',
      helper: 'Select deployment channel',
      options: [
        { id: 'stable', label: 'Stable', value: 'stable' },
        { id: 'beta', label: 'Beta', value: 'beta' },
        { id: 'canary', label: 'Canary', value: 'canary' }
      ],
      value: 'stable',
      enhance: true
    }).element
  );

  page.append(heading, textFields, chips, controls);
  container.replaceChildren(page);
}
