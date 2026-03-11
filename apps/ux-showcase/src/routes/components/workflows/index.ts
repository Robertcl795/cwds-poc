import {
  createActionRibbon,
  createAlertDialog,
  createContextMenu,
  createPrimitiveAlert,
  createPrimitiveButton,
  createPrimitiveCard,
  createPrimitiveIconButton,
  createPrimitiveSnackbarHost,
  createPrimitiveToolbar,
  createPrimitiveTooltip
} from '@ds/components';

import './workflows.css';

export function renderWorkflowComponentsShowcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'workflows-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Workflow Components Demo';

  const subtitle = document.createElement('p');
  subtitle.textContent =
    'Operational workflow surfaces: card, toolbar, alert, snackbar, action ribbon, and overlay extensions.';

  const grid = document.createElement('section');
  grid.className = 'workflows-grid';

  const workflowCard = createPrimitiveCard({
    title: 'Workflow controls',
    supportingText: 'Toolbar + action ribbon + contextual actions',
    variant: 'outlined',
    body: 'Use this surface for dense operational controls and status messaging.'
  });
  workflowCard.element.dataset.workflowsWorkflowCard = 'true';

  const workflowLog = document.createElement('p');
  workflowLog.className = 'workflows-log';
  workflowLog.textContent = 'No workflow action yet.';

  const toolbarNavIcon = document.createElement('span');
  toolbarNavIcon.textContent = '☰';
  toolbarNavIcon.setAttribute('aria-hidden', 'true');

  const toolbarNavButton = createPrimitiveIconButton({
    icon: toolbarNavIcon,
    ariaLabel: 'Open navigation',
    variant: 'standard'
  });

  const toolbar = createPrimitiveToolbar({
    ariaLabel: 'Workflow toolbar',
    title: 'Release Workflow',
    leading: [toolbarNavButton],
    actions: [
      { id: 'refresh', label: 'Refresh', icon: '↻' },
      { id: 'validate', label: 'Validate', icon: '✓' },
      { id: 'deploy', label: 'Deploy', kind: 'primary', icon: '▲' },
      { id: 'archive', label: 'Archive', kind: 'danger', icon: '🗑' }
    ],
    maxVisibleActions: 3,
    onAction(action, source) {
      workflowLog.textContent = `Toolbar action: ${action.id} (${source})`;
    }
  });

  const ribbon = createActionRibbon({
    tone: 'warning',
    selectionCount: 2,
    message: 'Unsaved row edits pending review.',
    actions: [
      { id: 'save', label: 'Save', kind: 'primary' },
      { id: 'discard', label: 'Discard', kind: 'danger' },
      { id: 'diff', label: 'View diff' }
    ],
    maxVisibleActions: 2,
    dismissible: true,
    onAction(action, source) {
      workflowLog.textContent = `Ribbon action: ${action.id} (${source})`;
    }
  });

  const rowContextLabel = document.createElement('div');
  rowContextLabel.style.display = 'flex';
  rowContextLabel.style.alignItems = 'center';
  rowContextLabel.style.justifyContent = 'space-between';
  rowContextLabel.style.border = '1px solid var(--cv-sys-color-border)';
  rowContextLabel.style.borderRadius = '0.5rem';
  rowContextLabel.style.padding = '0.5rem 0.625rem';

  const rowText = document.createElement('span');
  rowText.textContent = 'Deployment row';

  const rowMenuIcon = document.createElement('span');
  rowMenuIcon.textContent = '⋮';
  rowMenuIcon.setAttribute('aria-hidden', 'true');

  const contextTarget = createPrimitiveIconButton({
    icon: rowMenuIcon,
    ariaLabel: 'Deployment row actions',
    variant: 'standard'
  });
  contextTarget.dataset.workflowsContextTarget = 'true';

  createContextMenu({
    target: contextTarget,
    triggerMode: 'both',
    ariaLabel: 'Deployment row actions',
    items: [
      { type: 'label', id: 'ctx-label', label: 'Deployment row' },
      { id: 'inspect', label: 'Inspect run', iconStart: '↗', shortcut: 'Alt+I' },
      { id: 'retry', label: 'Retry', iconStart: '↻', shortcut: 'Alt+R' },
      { id: 'compact', label: 'Compact rows', control: 'checkbox', checked: true },
      { id: 'sort-recent', label: 'Sort by recent', control: 'radio', group: 'sort', checked: true },
      { id: 'sort-name', label: 'Sort by name', control: 'radio', group: 'sort' },
      { type: 'separator', id: 'ctx-sep-1' },
      { id: 'delete', label: 'Delete', iconStart: '🗑', kind: 'danger', shortcut: 'Del' }
    ],
    onAction(item, source) {
      const state = item.control ? ` checked=${item.checked ? 'true' : 'false'}` : '';
      workflowLog.textContent = `Context action: ${item.id}${state} (${source})`;
    }
  });

  rowContextLabel.append(rowText, contextTarget);

  const tooltipButton = createPrimitiveButton({
    label: 'Latency budget details',
    shape: 'text'
  });
  createPrimitiveTooltip({
    trigger: tooltipButton,
    content: 'Tooltip content is supplemental. Keep critical guidance visible.',
    maxWidth: '24ch',
    placement: 'top'
  });

  workflowCard.element.append(toolbar.element, ribbon.element, rowContextLabel, tooltipButton, workflowLog);

  const feedbackCard = createPrimitiveCard({
    title: 'Feedback surfaces',
    supportingText: 'Alert + Snackbar + dialog variant',
    variant: 'filled'
  });
  feedbackCard.element.dataset.workflowsFeedbackCard = 'true';

  const alert = createPrimitiveAlert({
    tone: 'info',
    variant: 'soft',
    title: 'Deploy checks running',
    message: 'The policy scanner is still evaluating the rollout.',
    dismissible: true,
    actions: [{ id: 'details', label: 'View details' }],
    onAction(action) {
      workflowLog.textContent = `Alert action: ${action.id}`;
    }
  });
  alert.element.dataset.workflowsPrimaryAlert = 'true';

  const toneAudit = document.createElement('section');
  toneAudit.className = 'workflows-tone-audit';
  toneAudit.dataset.workflowsToneAudit = 'true';

  const toneAuditTitle = document.createElement('h3');
  toneAuditTitle.textContent = 'Tone audit';

  const toneStack = document.createElement('div');
  toneStack.className = 'workflows-tone-stack';

  const toneConfigs = [
    ['neutral', 'Neutral update', 'Queued changes are waiting for review.'],
    ['info', 'Info update', 'Deployment details are still available for review.'],
    ['success', 'Success update', 'The latest draft validated successfully.'],
    ['warning', 'Warning update', 'A policy check still needs acknowledgement.'],
    ['error', 'Error update', 'An approval failed and requires attention.']
  ] as const;

  for (const [tone, title, message] of toneConfigs) {
    const toneAlert = createPrimitiveAlert({
      tone,
      variant: 'soft',
      title,
      message
    });
    toneAlert.element.dataset.workflowsTone = tone;
    toneStack.append(toneAlert.element);
  }

  toneAudit.append(toneAuditTitle, toneStack);

  const snackbarHost = createPrimitiveSnackbarHost({
    defaultDurationMs: 3500
  });

  const snackbarTrigger = createPrimitiveButton({
    label: 'Show snackbar sequence',
    onPress() {
      snackbarHost.enqueue({ message: 'Draft saved', tone: 'success' });
      snackbarHost.enqueue({
        message: 'Sync interrupted',
        tone: 'error',
        priority: 'assertive',
        action: {
          id: 'retry',
          label: 'Retry'
        }
      });
    }
  });

  const dialogTrigger = createPrimitiveButton({
    label: 'Open alert dialog',
    shape: 'outlined'
  });

  const alertDialog = createAlertDialog({
    trigger: dialogTrigger,
    title: 'Policy acknowledgement',
    description: 'Review the policy note before continuing deployment.'
  });

  dialogTrigger.addEventListener('click', () => {
    alertDialog.showModal();
  });

  feedbackCard.element.append(alert.element, toneAudit, snackbarTrigger, dialogTrigger, alertDialog);

  grid.append(workflowCard.element, feedbackCard.element);
  page.append(heading, subtitle, grid);
  container.replaceChildren(page);
}
