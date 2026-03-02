import { applyDescribedBy, applyInvalidState } from './describedby';

export type FieldLinkageOptions = {
  helpId?: string | undefined;
  errorId?: string | undefined;
  describedBy?: string | undefined;
  invalid: boolean;
};

export function applyFieldLinkage(control: HTMLElement, options: FieldLinkageOptions): void {
  applyDescribedBy(control, [options.helpId, options.invalid ? options.errorId : undefined, options.describedBy]);
  applyInvalidState(control, options.invalid);
}
