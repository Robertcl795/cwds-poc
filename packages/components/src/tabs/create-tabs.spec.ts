import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveTabs } from './create-tabs';

const buildPanels = () => {
  const overview = document.createElement('section');
  overview.textContent = 'Overview panel';

  const activity = document.createElement('section');
  activity.textContent = 'Activity panel';

  const settings = document.createElement('section');
  settings.textContent = 'Settings panel';

  return { overview, activity, settings };
};

describe('tabs primitive', () => {
  it('renders linked tabs and panels', () => {
    document.body.innerHTML = '';

    const panels = buildPanels();
    const tabs = createPrimitiveTabs({
      tabs: [
        { id: 'overview', label: 'Overview', panel: panels.overview },
        { id: 'activity', label: 'Activity', panel: panels.activity }
      ]
    });
    document.body.append(tabs.element);

    expect(tabs.tabList.getAttribute('role')).toBe('tablist');
    expect(tabs.tabElements).toHaveLength(2);
    expect(tabs.tabElements[0]?.getAttribute('role')).toBe('tab');
    expect(tabs.panelElements[0]?.getAttribute('role')).toBe('tabpanel');
    expect(tabs.panelElements[0]?.hidden).toBe(false);
    expect(tabs.panelElements[1]?.hidden).toBe(true);
  });

  it('keeps manual activation when arrowing between tabs', () => {
    document.body.innerHTML = '';

    const panels = buildPanels();
    const onSelectedChange = vi.fn();

    const tabs = createPrimitiveTabs({
      tabs: [
        { id: 'overview', label: 'Overview', panel: panels.overview },
        { id: 'activity', label: 'Activity', panel: panels.activity }
      ],
      onSelectedChange
    });
    document.body.append(tabs.element);

    const first = tabs.tabElements[0];
    const second = tabs.tabElements[1];

    if (!first || !second) {
      throw new Error('Expected two tabs');
    }

    first.focus();
    tabs.tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(second);
    expect(tabs.getSelectedId()).toBe('overview');

    second.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(tabs.getSelectedId()).toBe('activity');
    expect(onSelectedChange).toHaveBeenCalledWith('activity', 'keyboard');
  });

  it('skips disabled tabs during roving focus', () => {
    document.body.innerHTML = '';

    const panels = buildPanels();

    const tabs = createPrimitiveTabs({
      tabs: [
        { id: 'overview', label: 'Overview', panel: panels.overview },
        { id: 'activity', label: 'Activity', panel: panels.activity, disabled: true },
        { id: 'settings', label: 'Settings', panel: panels.settings }
      ]
    });
    document.body.append(tabs.element);

    const first = tabs.tabElements[0];
    const third = tabs.tabElements[2];

    if (!first || !third) {
      throw new Error('Expected first and third tabs');
    }

    first.focus();
    tabs.tabList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(third);
  });
});
