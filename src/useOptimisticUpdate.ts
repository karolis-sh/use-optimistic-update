import { useCallback } from 'react';

import { optimist } from './optimist';
import { State, StateUpdater, StateValue, StateKey } from './types';
import useOptimisticState from './useOptimisticState';

export default (
  key: StateKey,
  value?: StateValue,
): State & {
  onUpdate: (onUpdate: StateUpdater, value?: StateValue) => Promise<void>;
} => {
  optimist.sync(key, value);

  const state = useOptimisticState(key);

  const onUpdate = useCallback(
    (updater: StateUpdater, newValue?: StateValue): Promise<void> =>
      optimist.update(key, updater, newValue),
    [key],
  );

  return { ...state, onUpdate };
};
