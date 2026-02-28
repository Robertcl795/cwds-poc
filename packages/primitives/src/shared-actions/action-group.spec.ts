import { describe, expect, it } from 'vitest';

import { partitionActions } from './action-group';

describe('partitionActions', () => {
  it('splits actions into leading, trailing, and overflow groups', () => {
    const partitioned = partitionActions(
      [
        { id: 'select-all', label: 'Select all', group: 'leading' },
        { id: 'save', label: 'Save' },
        { id: 'retry', label: 'Retry' },
        { id: 'delete', label: 'Delete', group: 'overflow' }
      ],
      1
    );

    expect(partitioned.leading.map((action) => action.id)).toEqual(['select-all']);
    expect(partitioned.trailing.map((action) => action.id)).toEqual(['save']);
    expect(partitioned.overflow.map((action) => action.id)).toEqual(['delete', 'retry']);
  });
});
