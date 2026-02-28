import { createContextMenu, createPrimitiveButton, createPrimitiveIconButton, createPrimitiveTooltip } from '@ds/primitives';
import { defineCvWebComponents } from '@ds/lit';

import './phase4.css';

defineCvWebComponents();

export function renderPhase4Showcase(container: HTMLElement): void {
  const page = document.createElement('main');
  page.className = 'phase4-page';

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 4 Demo';

  const intro = document.createElement('p');
  intro.textContent =
    'Advanced composites: native-first tooltip and context menu plus Lit combobox and advanced select baselines.';

  const grid = document.createElement('section');
  grid.className = 'phase4-grid';

  const tooltipCard = document.createElement('article');
  tooltipCard.className = 'phase4-card';

  const tooltipTitle = document.createElement('h2');
  tooltipTitle.textContent = 'Tooltip (informational only)';

  const tooltipTrigger = createPrimitiveButton({
    label: 'Latency budget details',
    shape: 'text'
  });

  createPrimitiveTooltip({
    trigger: tooltipTrigger,
    content: 'Tooltip is supplemental help. Keep critical instructions in visible labels or helper text.',
    placement: 'top'
  });

  tooltipCard.append(tooltipTitle, tooltipTrigger);

  const contextCard = document.createElement('article');
  contextCard.className = 'phase4-card';

  const contextTitle = document.createElement('h2');
  contextTitle.textContent = 'Context Menu';

  const contextRow = document.createElement('div');
  contextRow.style.display = 'flex';
  contextRow.style.alignItems = 'center';
  contextRow.style.justifyContent = 'space-between';
  contextRow.style.border = '1px solid var(--cv-sys-color-border)';
  contextRow.style.borderRadius = '0.5rem';
  contextRow.style.padding = '0.5rem 0.625rem';

  const contextLabel = document.createElement('span');
  contextLabel.textContent = 'Deployment row';

  const menuIcon = document.createElement('span');
  menuIcon.textContent = '⋮';
  menuIcon.setAttribute('aria-hidden', 'true');

  const contextTarget = createPrimitiveIconButton({
    icon: menuIcon,
    ariaLabel: 'Open deployment row actions',
    variant: 'standard'
  });

  const contextLog = document.createElement('p');
  contextLog.className = 'phase4-log';
  contextLog.textContent = 'Open row actions from the three-dot trigger.';

  createContextMenu({
    target: contextTarget,
    triggerMode: 'click',
    items: [
      { id: 'inspect', label: 'Inspect run', iconStart: '↗' },
      { id: 'retry', label: 'Retry', iconStart: '↻' },
      { id: 'compact', label: 'Compact rows', control: 'checkbox', checked: true },
      { id: 'alerts', label: 'Mute alerts', control: 'switch', checked: false },
      { id: 'archive', label: 'Archive', iconStart: '🗄', disabled: true }
    ],
    onAction(item, source) {
      const state = item.control ? ` checked=${item.checked ? 'true' : 'false'}` : '';
      contextLog.textContent = `Context action: ${item.id}${state} (${source})`;
    }
  });

  contextRow.append(contextLabel, contextTarget);
  contextCard.append(contextTitle, contextRow, contextLog);

  const formCard = document.createElement('article');
  formCard.className = 'phase4-card';

  const formTitle = document.createElement('h2');
  formTitle.textContent = 'Combobox + Advanced Select';

  const form = document.createElement('form');
  form.className = 'phase4-form';

  const assignee = document.createElement('cv-combobox') as HTMLElement & {
    name: string;
    label: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
  };
  assignee.name = 'assignee';
  assignee.label = 'Assignee';
  assignee.placeholder = 'Search users';
  assignee.options = [
    { value: 'amy', label: 'Amy Atlas' },
    { value: 'ben', label: 'Ben Burke' },
    { value: 'cal', label: 'Cal Chen' }
  ];

  const environment = document.createElement('cv-advanced-select') as HTMLElement & {
    name: string;
    label: string;
    searchable: boolean;
    options: Array<{ value: string; label: string }>;
  };
  environment.name = 'environment';
  environment.label = 'Environment';
  environment.searchable = true;
  environment.options = [
    { value: 'prod', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'qa', label: 'QA' }
  ];

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'cv-button';
  submit.textContent = 'Submit';

  const result = document.createElement('pre');
  result.className = 'phase4-result';
  result.textContent = 'Submit to inspect values';

  form.append(assignee, environment, submit);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    result.textContent = JSON.stringify(Object.fromEntries(data.entries()), null, 2);
  });

  formCard.append(formTitle, form, result);

  grid.append(tooltipCard, contextCard, formCard);
  page.append(heading, intro, grid);

  container.replaceChildren(page);
}
