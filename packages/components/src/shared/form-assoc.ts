import {
  applyDescribedBy,
  applyFieldLinkage,
  applyInvalidState,
  syncFieldDataState,
  type AdditionalFieldState,
  type FieldLikeControl,
  type ResolvedFieldMessages
} from '@ds/core';

type DescribedByOptions = {
  helpId?: string | undefined;
  errorId?: string | undefined;
  invalid?: boolean | undefined;
};

export function setControlDescription(control: HTMLElement, options: DescribedByOptions = {}): void {
  applyDescribedBy(control, [options.helpId, options.invalid ? options.errorId : undefined]);
  applyInvalidState(control, options.invalid === true);
}

type LinkedFieldStateOptions = {
  host: HTMLElement;
  control: FieldLikeControl;
  helper: HTMLElement;
  helpId: string;
  describedBy?: string | undefined;
  invalid: boolean;
  messages: ResolvedFieldMessages;
  extraState?: AdditionalFieldState | undefined;
};

export function syncLinkedFieldState(options: LinkedFieldStateOptions): boolean {
  applyFieldLinkage(options.control, {
    helpId: options.helpId,
    describedBy: options.describedBy,
    invalid: options.invalid
  });
  options.helper.textContent = options.invalid
    ? options.messages.errorText || options.messages.helperText
    : options.messages.helperText;
  syncFieldDataState(options.host, options.control, { invalid: options.invalid }, options.extraState);
  return options.invalid;
}
