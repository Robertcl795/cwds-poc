import { applyDescribedBy, applyInvalidState } from '../shared-field/describedby';

export type DescribedByOptions = {
  helpId?: string | undefined;
  errorId?: string | undefined;
  invalid?: boolean | undefined;
};

export function setControlDescription(control: HTMLElement, options: DescribedByOptions = {}): void {
  applyDescribedBy(control, [options.helpId, options.invalid ? options.errorId : undefined]);
  applyInvalidState(control, options.invalid === true);
}
