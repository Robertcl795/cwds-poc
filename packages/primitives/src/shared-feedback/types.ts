export type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export type FeedbackMode = 'inline' | 'transient';

export type FeedbackPriority = 'polite' | 'assertive';

export interface FeedbackMessage {
  id: string;
  tone: FeedbackTone;
  text: string;
  mode: FeedbackMode;
  priority?: FeedbackPriority;
}
