export type InputSource = 'keyboard' | 'pointer' | 'programmatic';

export interface OpenChangeDetail {
  open: boolean;
  source: InputSource;
}

export interface ValueChangeDetail<T = string> {
  value: T;
  source: InputSource;
}

export type CvEventName = 'cv-open-change' | 'cv-value-change' | 'cv-change';
