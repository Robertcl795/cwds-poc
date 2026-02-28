import { createSelectController, type InputSource, type SelectControllerOptions } from '@ds/headless';
import { createIconNode } from '@ds/utils-icons';

import { applyFieldLinkage, createFieldIds, resolveFieldMessages, syncFieldDataState } from '../shared-field';
import { enhanceNativeSelect } from './enhance-select';
import type { PrimitiveSelect, PrimitiveSelectOption, PrimitiveSelectOptions } from './select.types';

const EMPTY_OPTION_ID = '__cv-select-empty-option';

const appendIcon = (control: HTMLElement, iconValue: string | HTMLElement): void => {
  const icon = document.createElement('span');
  icon.className = 'cv-select-field__icon';
  icon.setAttribute('aria-hidden', 'true');

  if (typeof iconValue === 'string') {
    try {
      icon.append(createIconNode(iconValue));
    } catch {
      icon.textContent = iconValue;
    }
  } else {
    icon.append(iconValue);
  }

  control.append(icon);
};

export const createPrimitiveSelect = (options: PrimitiveSelectOptions): PrimitiveSelect => {
  const ids = createFieldIds(options.id);
  const messages = resolveFieldMessages(options);
  const shouldRenderEmptyOption = options.required === true && options.value === undefined;

  const normalizedOptions: PrimitiveSelectOption[] = shouldRenderEmptyOption
    ? [{ id: EMPTY_OPTION_ID, label: '', value: '' }, ...options.options]
    : [...options.options];

  const controllerOptions: SelectControllerOptions = {
    options: normalizedOptions,
    ...(options.value !== undefined ? { value: options.value } : {}),
    ...(options.onValueChange !== undefined ? { onValueChange: options.onValueChange } : {})
  };

  const controller = createSelectController(controllerOptions);

  const wrapper = document.createElement('div');
  wrapper.className = 'cv-select-field';
  wrapper.dataset.outlined = options.outlined === false ? 'false' : 'true';
  wrapper.dataset.hasIcon = options.icon ? 'true' : 'false';
  wrapper.dataset.naturalMenuWidth = options.naturalMenuWidth ? 'true' : 'false';
  wrapper.dataset.fixedMenuPosition = options.fixedMenuPosition ? 'true' : 'false';

  const label = document.createElement('label');
  label.className = 'cv-select-field__label';
  label.id = ids.labelId;
  label.textContent = options.label;
  label.htmlFor = ids.controlId;

  const control = document.createElement('div');
  control.className = 'cv-select-field__control';

  if (options.icon) {
    appendIcon(control, options.icon);
  }

  const select = document.createElement('select');
  select.className = 'cv-select';
  select.id = ids.controlId;
  select.name = options.name;

  if (options.required) {
    select.required = true;
  }

  if (options.disabled) {
    select.disabled = true;
  }

  for (let index = 0; index < normalizedOptions.length; index += 1) {
    const option = normalizedOptions[index];
    if (!option) {
      continue;
    }

    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    optionElement.disabled = option.disabled === true;

    if (shouldRenderEmptyOption && index === 0) {
      optionElement.hidden = true;
    }

    select.append(optionElement);
  }

  select.value = controller.getSelectedValue();

  const helper = document.createElement('p');
  helper.className = 'cv-select-field__helper';
  helper.id = ids.helpId;
  helper.textContent = messages.helperText;
  let open = false;

  const supportsSelectOpenSelector = (() => {
    const css = globalThis.CSS;
    if (!css || typeof css.supports !== 'function') {
      return false;
    }

    try {
      return css.supports('selector(select:open)');
    } catch {
      return false;
    }
  })();

  const syncValidation = (): boolean => {
    const isInvalid = options.required === true && select.value.trim().length === 0;
    applyFieldLinkage(select, {
      helpId: ids.helpId,
      describedBy: options.describedBy,
      invalid: isInvalid
    });
    helper.textContent = isInvalid ? messages.errorText || messages.helperText : messages.helperText;

    return isInvalid;
  };

  const syncState = (): void => {
    const invalid = syncValidation();
    syncFieldDataState(wrapper, select, { invalid }, { enhanced: wrapper.dataset.enhanced === 'true', open });
  };

  const setOpen = (nextOpen: boolean): void => {
    if (open === nextOpen) {
      return;
    }

    open = nextOpen;
    syncState();
  };

  const syncOpenFromSelector = (): boolean => {
    if (!supportsSelectOpenSelector) {
      return false;
    }

    try {
      setOpen(select.matches(':open'));
      return true;
    } catch {
      return false;
    }
  };

  const queueOpenSync = (fallbackOpen: boolean): void => {
    queueMicrotask(() => {
      if (!syncOpenFromSelector()) {
        setOpen(fallbackOpen);
      }
    });
  };

  if (options.validateOnInitialRender) {
    syncState();
  } else {
    applyFieldLinkage(select, {
      helpId: ids.helpId,
      describedBy: options.describedBy,
      invalid: false
    });
    syncFieldDataState(wrapper, select, { invalid: false }, { open: false });
  }

  const isEnhanced = enhanceNativeSelect(select, {
    enabled: options.enhance !== false
  });
  syncFieldDataState(wrapper, select, {}, { enhanced: isEnhanced });

  let pendingSource: InputSource = 'programmatic';

  select.addEventListener('pointerdown', () => {
    pendingSource = 'pointer';
    queueOpenSync(true);
  });

  select.addEventListener('keydown', (event) => {
    pendingSource = 'keyboard';

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'F4') {
      queueOpenSync(true);
      return;
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  select.addEventListener('focus', () => {
    syncOpenFromSelector();
    syncState();
  });
  select.addEventListener('blur', () => {
    setOpen(false);
  });

  select.addEventListener('change', () => {
    controller.selectByIndex(select.selectedIndex, pendingSource);
    pendingSource = 'programmatic';
    setOpen(false);
  });

  control.append(select);
  wrapper.append(label, control, helper);

  return {
    element: wrapper,
    selectElement: select,
    setValue(value: string): void {
      select.value = value;
      const index = normalizedOptions.findIndex((option) => option.value === value);
      controller.selectByIndex(index);
      syncState();
    }
  };
};
