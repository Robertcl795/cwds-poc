import {
  createPrimitiveChip,
  createPrimitiveSelect,
  createPrimitiveSlider,
  createPrimitiveTextField
} from '@ds/components';

import './forms.css';

export function renderFormComponentsShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'forms-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Form Components Demo';

  const textFields = document.createElement('section');
  textFields.className = 'forms-card';
  textFields.append(
    createPrimitiveTextField({
      id: 'forms-email',
      name: 'forms-email',
      type: 'email',
      label: 'Email',
      helper: 'Used for release notifications',
      placeholder: 'team@example.com',
      outlined: true
    }).element,
    createPrimitiveTextField({
      id: 'forms-team-id',
      name: 'forms-team-id',
      label: 'Team ID',
      helper: '3-32 chars',
      icon: '#',
      maxLength: 32,
      charCounter: true,
      outlined: true
    }).element
  );

  const chips = document.createElement('section');
  chips.className = 'forms-card forms-chip-row';
  chips.append(
    createPrimitiveChip({
      variant: 'action',
      label: 'Deploy',
      iconStart: '🚀'
    }).element,
    createPrimitiveChip({
      variant: 'filter',
      id: 'forms-chip-stable',
      name: 'forms-release',
      value: 'stable',
      label: 'Stable',
      selected: true
    }).element,
    createPrimitiveChip({
      variant: 'filter',
      id: 'forms-chip-beta',
      name: 'forms-release',
      value: 'beta',
      label: 'Beta'
    }).element
  );

  const controls = document.createElement('section');
  controls.className = 'forms-card';
  controls.append(
    createPrimitiveSlider({
      id: 'forms-volume',
      name: 'forms-volume',
      label: 'Volume',
      value: 35,
      helper: 'Arrow keys for fine control',
      showValue: true
    }).element,
    createPrimitiveSelect({
      id: 'forms-status',
      name: 'forms-status',
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
