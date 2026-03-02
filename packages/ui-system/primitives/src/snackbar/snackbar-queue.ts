import type { PrimitiveSnackbarMessage } from './snackbar.types';

export interface SnackbarQueueItem extends PrimitiveSnackbarMessage {
  id: string;
}

export interface SnackbarQueue {
  enqueue: (item: SnackbarQueueItem) => void;
  dequeue: () => SnackbarQueueItem | null;
  remove: (id: string) => boolean;
  clear: () => void;
  size: () => number;
}

export const createSnackbarQueue = (): SnackbarQueue => {
  const queue: SnackbarQueueItem[] = [];

  return {
    enqueue(item: SnackbarQueueItem): void {
      queue.push(item);
    },
    dequeue(): SnackbarQueueItem | null {
      return queue.shift() ?? null;
    },
    remove(id: string): boolean {
      const index = queue.findIndex((entry) => entry.id === id);
      if (index < 0) {
        return false;
      }

      queue.splice(index, 1);
      return true;
    },
    clear(): void {
      queue.length = 0;
    },
    size(): number {
      return queue.length;
    }
  };
};
