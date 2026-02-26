import '@covalent-poc/tokens/tokens.css';
import '@covalent-poc/styles/index.css';

import { createCompositeDialog, createCompositeSelect } from '@covalent-poc/composites';
import {
  createPrimitiveButton,
  createPrimitiveCheckbox,
  createPrimitiveFormField,
  createPrimitiveTextInput
} from '@covalent-poc/primitives';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app container');
}

const page = document.createElement('main');
page.className = 'cv-motion-fade';
page.style.maxWidth = '44rem';
page.style.margin = '2rem auto';
page.style.padding = '1.25rem';
page.style.background = 'var(--cv-sys-color-surface)';
page.style.border = '1px solid var(--cv-sys-color-border)';
page.style.borderRadius = '1rem';
page.style.boxShadow = 'var(--cv-ref-elevation-1)';

const title = document.createElement('h1');
title.textContent = 'Create Alert Rule';

const description = document.createElement('p');
description.textContent =
  'Phase 1 prototype: semantic primitives, headless logic, and token-driven styles.';
description.style.color = 'var(--cv-sys-color-text-muted)';

const form = document.createElement('form');
form.style.display = 'grid';
form.style.gap = '1rem';

const nameInput = createPrimitiveTextInput({
  id: 'rule-name',
  name: 'rule-name',
  placeholder: 'Disk utilization threshold',
  required: true
});

const nameField = createPrimitiveFormField({
  input: nameInput,
  label: 'Rule name',
  helperText: 'Keep names unique and action-oriented.'
});

const severityLabel = document.createElement('label');
severityLabel.className = 'cv-form-field__label';
severityLabel.htmlFor = 'rule-severity';
severityLabel.textContent = 'Severity';

const severity = createCompositeSelect({
  id: 'rule-severity',
  name: 'rule-severity',
  options: [
    { id: 'info', label: 'Info', value: 'info' },
    { id: 'warning', label: 'Warning', value: 'warning' },
    { id: 'critical', label: 'Critical', value: 'critical' }
  ]
});

const severityGroup = document.createElement('div');
severityGroup.className = 'cv-form-field';
severityGroup.append(severityLabel, severity);

const enabled = createPrimitiveCheckbox({
  id: 'auto-remediate',
  name: 'auto-remediate',
  label: 'Enable auto remediation'
});

const actions = document.createElement('div');
actions.style.display = 'flex';
actions.style.justifyContent = 'flex-end';
actions.style.gap = '0.75rem';

const cancelButton = createPrimitiveButton({ label: 'Cancel', variant: 'secondary' });
const saveButton = createPrimitiveButton({ label: 'Save rule' });

const confirmDialog = createCompositeDialog({
  title: 'Create rule?',
  description: 'This will activate alerting for all selected services.',
  confirmLabel: 'Confirm',
  cancelLabel: 'Review'
});

saveButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (typeof confirmDialog.showModal === 'function') {
    confirmDialog.showModal();
    confirmDialog.dataset.state = 'open';
  }
});

cancelButton.addEventListener('click', (event) => {
  event.preventDefault();
  form.reset();
});

actions.append(cancelButton, saveButton);
form.append(nameField.element, severityGroup, enabled, actions);

page.append(title, description, form, confirmDialog);
app.append(page);
