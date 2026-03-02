import type { SurfaceAction } from './action.types';

export interface PartitionedActions {
  leading: SurfaceAction[];
  trailing: SurfaceAction[];
  overflow: SurfaceAction[];
}

const isOverflowGroup = (action: SurfaceAction): boolean => action.group === 'overflow';

export const partitionActions = (actions: SurfaceAction[], maxTrailingVisible = 3): PartitionedActions => {
  const leading: SurfaceAction[] = [];
  const trailingAll: SurfaceAction[] = [];
  const overflow: SurfaceAction[] = [];

  for (const action of actions) {
    if (action.group === 'leading') {
      leading.push(action);
      continue;
    }

    if (isOverflowGroup(action)) {
      overflow.push(action);
      continue;
    }

    trailingAll.push(action);
  }

  const clampedVisible = Math.max(0, maxTrailingVisible);
  const trailing = trailingAll.slice(0, clampedVisible);
  const trailingOverflow = trailingAll.slice(clampedVisible);

  return {
    leading,
    trailing,
    overflow: [...overflow, ...trailingOverflow]
  };
};
