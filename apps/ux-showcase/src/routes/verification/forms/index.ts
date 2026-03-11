import {
  createPrimitiveAutocomplete,
  createPrimitiveChip,
  createPrimitiveSelect,
  createPrimitiveSlider,
  createPrimitiveTextField
} from '@ds/components';

import './forms.css';

const statusOptions = [
  { id: 'stable', label: 'Stable', value: 'stable' },
  { id: 'beta', label: 'Beta', value: 'beta' },
  { id: 'canary', label: 'Canary', value: 'canary' }
];

export function renderFormVerificationShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'verification-forms-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Form Verification Demo';

  const form = document.createElement('form');
  form.className = 'verification-forms-card';

  const result = document.createElement('pre');
  result.className = 'verification-forms-result';
  result.textContent = 'Submit the form to inspect payload.';

  const textField = createPrimitiveTextField({
    id: 'verification-forms-email',
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
    id: 'verification-forms-chip-stable',
    name: 'releaseTrackStable',
    value: 'stable',
    label: 'Stable',
    selected: true
  });

  const chipBeta = createPrimitiveChip({
    variant: 'filter',
    id: 'verification-forms-chip-beta',
    name: 'releaseTrackBeta',
    value: 'beta',
    label: 'Beta'
  });

  const slider = createPrimitiveSlider({
    id: 'verification-forms-volume',
    name: 'volume',
    label: 'Volume',
    helperText: 'Arrow keys and drag are supported',
    value: 35,
    showValue: true
  });

  const autocomplete = createPrimitiveAutocomplete({
    id: 'verification-forms-environment',
    name: 'environmentPreset',
    label: 'Environment preset',
    helperText: 'Native datalist suggestions with freeform submission',
    options: [
      { value: 'Production', label: 'Locked rollout' },
      { value: 'Staging', label: 'Pre-release validation' },
      { value: 'QA', label: 'Internal verification' }
    ]
  });

  const selectEnhanced = createPrimitiveSelect({
    id: 'verification-forms-status-enhanced',
    name: 'statusEnhanced',
    label: 'Status (enhanced if supported)',
    helperText: 'Progressive enhancement path',
    options: statusOptions,
    value: 'stable',
    enhance: true
  });

  const selectBaseline = createPrimitiveSelect({
    id: 'verification-forms-status-baseline',
    name: 'statusBaseline',
    label: 'Status (baseline)',
    helperText: 'Forced native baseline path',
    options: statusOptions,
    value: 'beta',
    enhance: false
  });

  const chipsRow = document.createElement('div');
  chipsRow.className = 'verification-forms-chip-row';
  chipsRow.append(chipStable.element, chipBeta.element);

  const actions = document.createElement('div');
  actions.className = 'verification-forms-actions';

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
    autocomplete.element,
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
