import '@ds/tokens/tokens.css';
import '@ds/styles/index.css';

import {
  applyFocusRing,
  applyRipple,
  setElevation
} from '@ds/utils-a11y';
import {
  clearIconRegistry,
  createIconNode,
  registerIcons
} from '@ds/utils-icons';
import { renderPhase1Showcase } from './routes/phase1';
import { renderPhase25HardeningShowcase } from './routes/phase2-hardening';
import { renderPhase2Showcase } from './routes/phase2';
import { renderPhase3Showcase } from './routes/phase3';
import { renderPhase35HardeningShowcase } from './routes/phase3-hardening';
import { renderPhase4Showcase } from './routes/phase4';
import { renderPhase5Showcase } from './routes/phase5';

import './foundation-demo.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app');
}

const renderFoundation = (container: HTMLElement): void => {
  clearIconRegistry();
  registerIcons({
    check: {
      viewBox: '0 0 24 24',
      paths: ['M4 12l5 5 11-11']
    }
  });

  const page = document.createElement('main');
  page.className = 'foundation-page';

  const card = document.createElement('section');
  card.className = 'foundation-card';
  setElevation(card, 2);

  const heading = document.createElement('h1');
  heading.textContent = 'Phase 0 Foundation Demo';

  const row = document.createElement('div');
  row.className = 'foundation-row';

  const button = document.createElement('button');
  button.className = 'cv-button';
  button.textContent = 'Interactive button';
  button.id = 'foundation-button';
  applyFocusRing(button, 'auto');
  applyRipple(button, { styleMutation: 'allow' });

  const icon = createIconNode('check');
  icon.setAttribute('data-size', 'lg');

  row.append(button, icon);
  card.append(heading, row);
  page.append(card);
  container.replaceChildren(page);
};

if (globalThis.location.hash === '#phase1') {
  renderPhase1Showcase(app);
} else if (globalThis.location.hash === '#phase2-hardening') {
  renderPhase25HardeningShowcase(app);
} else if (globalThis.location.hash === '#phase2') {
  renderPhase2Showcase(app);
} else if (globalThis.location.hash === '#phase3') {
  renderPhase3Showcase(app);
} else if (globalThis.location.hash === '#phase3-hardening') {
  renderPhase35HardeningShowcase(app);
} else if (globalThis.location.hash === '#phase4') {
  renderPhase4Showcase(app);
} else if (globalThis.location.hash === '#phase5') {
  renderPhase5Showcase(app);
} else {
  renderFoundation(app);
}
