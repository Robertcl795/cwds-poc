import '@ds/tokens/index.css';
import '@ds/core/index.css';
import '@ds/components/index.css';

import { renderFormComponentsShowcase } from './routes/components/forms';
import { renderNavigationComponentsShowcase } from './routes/components/navigation';
import { renderOverlayComponentsShowcase } from './routes/components/overlays';
import { renderPrimitiveComponentsShowcase } from './routes/components/primitives';
import { renderWorkflowComponentsShowcase } from './routes/components/workflows';
import { renderFoundationShowcase } from './routes/foundation';
import { renderFormVerificationShowcase } from './routes/verification/forms';
import { renderNavigationVerificationShowcase } from './routes/verification/navigation';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app');
}

type ShowcaseRenderer = (container: HTMLElement) => void;

const routeRenderers = new Map<string, ShowcaseRenderer>([
  ['foundation', renderFoundationShowcase],
  ['components-primitives', renderPrimitiveComponentsShowcase],
  ['components-forms', renderFormComponentsShowcase],
  ['verification-forms', renderFormVerificationShowcase],
  ['components-navigation', renderNavigationComponentsShowcase],
  ['verification-navigation', renderNavigationVerificationShowcase],
  ['components-overlays', renderOverlayComponentsShowcase],
  ['components-workflows', renderWorkflowComponentsShowcase],
  ['phase1', renderPrimitiveComponentsShowcase],
  ['phase2', renderFormComponentsShowcase],
  ['phase2-hardening', renderFormVerificationShowcase],
  ['phase3', renderNavigationComponentsShowcase],
  ['phase3-hardening', renderNavigationVerificationShowcase],
  ['phase4', renderOverlayComponentsShowcase],
  ['phase5', renderWorkflowComponentsShowcase]
]);

const routeId = globalThis.location.hash.replace(/^#/, '');
const renderRoute = routeRenderers.get(routeId) ?? renderFoundationShowcase;

renderRoute(app);
