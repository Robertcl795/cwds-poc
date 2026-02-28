import {
  createPrimitiveChip,
  createPrimitiveSelect,
  createPrimitiveSlider,
  createPrimitiveTextField
} from '@ds/primitives';

import './phase2-hardening.css';

const statusOptions = [
  { id: 'stable', label: 'Stable', value: 'stable' },
  { id: 'beta', label: 'Beta', value: 'beta' },
  { id: 'canary', label: 'Canary', value: 'canary' }
];

export function renderPhase25HardeningShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase25-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 2.5 Hardening Demo';

  const form = document.createElement('form');
  form.className = 'phase25-card';

  const result = document.createElement('pre');
  result.className = 'phase25-result';
  result.textContent = 'Submit the form to inspect payload.';

  const textField = createPrimitiveTextField({
    id: 'phase25-email',
    name: 'email',
    type: 'email',
    label: 'Email',
    helperText: 'Release notifications only',
    required: true,
    errorText: 'Email is required',
    validateOnInitialRender: false
  });

  const chipStable = createPrimitiveChip({
    variant: 'filter',
    id: 'phase25-chip-stable',
    name: 'releaseTrackStable',
    value: 'stable',
    label: 'Stable',
    selected: true
  });

  const chipBeta = createPrimitiveChip({
    variant: 'filter',
    id: 'phase25-chip-beta',
    name: 'releaseTrackBeta',
    value: 'beta',
    label: 'Beta'
  });

  const slider = createPrimitiveSlider({
    id: 'phase25-volume',
    name: 'volume',
    label: 'Volume',
    helperText: 'Arrow keys and drag are supported',
    value: 35,
    showValue: true
  });

  const selectEnhanced = createPrimitiveSelect({
    id: 'phase25-status-enhanced',
    name: 'statusEnhanced',
    label: 'Status (enhanced if supported)',
    helperText: 'Progressive enhancement path',
    options: statusOptions,
    value: 'stable',
    enhance: true
  });

  const selectBaseline = createPrimitiveSelect({
    id: 'phase25-status-baseline',
    name: 'statusBaseline',
    label: 'Status (baseline)',
    helperText: 'Forced native baseline path',
    options: statusOptions,
    value: 'beta',
    enhance: false
  });

  const chipsRow = document.createElement('div');
  chipsRow.className = 'phase25-chip-row';
  chipsRow.append(chipStable.element, chipBeta.element);

  const actions = document.createElement('div');
  actions.className = 'phase25-actions';

  const submit = document.createElement('button');
  submit.className = 'cv-button';
  submit.type = 'submit';
  submit.textContent = 'Submit hardening form';

  const reset = document.createElement('button');
  reset.className = 'cv-button';
  reset.type = 'reset';
  reset.dataset.shape = 'outlined';
  reset.textContent = 'Reset';

  actions.append(submit, reset);

  form.append(
    textField.element,
    chipsRow,
    slider.element,
    selectEnhanced.element,
    selectBaseline.element,
    actions
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    result.textContent = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
  });

  form.addEventListener('reset', () => {
    result.textContent = 'Form reset.';
  });

  page.append(heading, form, result);
  container.replaceChildren(page);
}
