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
} from '@ds/primitives';

import './phase5.css';

export function renderPhase5Showcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase5-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 5 Demo';

  const subtitle = document.createElement('p');
  subtitle.textContent =
    'Enterprise workflow surfaces: card, toolbar, alert, snackbar, action ribbon, and overlay extensions.';

  const grid = document.createElement('section');
  grid.className = 'phase5-grid';

  const workflowCard = createPrimitiveCard({
    title: 'Workflow controls',
    supportingText: 'Toolbar + action ribbon + contextual actions',
    variant: 'outlined',
    body: 'Use this surface for dense operational controls and status messaging.'
  });

  const workflowLog = document.createElement('p');
  workflowLog.className = 'phase5-log';
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
    ariaLabel: 'Open deployment row actions',
    variant: 'standard'
  });
  contextTarget.dataset.phase5ContextTarget = 'true';

  createContextMenu({
    target: contextTarget,
    triggerMode: 'click',
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

  feedbackCard.element.append(alert.element, snackbarTrigger, dialogTrigger, alertDialog);

  grid.append(workflowCard.element, feedbackCard.element);
  page.append(heading, subtitle, grid);
  container.replaceChildren(page);
}
