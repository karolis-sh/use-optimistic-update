import { useEffect } from 'react';

import { State, StateUpdater, StateValue, StateKey } from './types';
import { optimist } from './optimist';
import useOptimisticState from './useOptimisticState';

export default (
  key: StateKey,
  value?: StateValue
): State & {
  onUpdate: (onUpdate: StateUpdater, value?: StateValue) => Promise<void>;
} => {
  const state = useOptimisticState(key);

  useEffect(() => optimist.sync(key, value), [key, value]);

  return {
    ...state,
    onUpdate: (onUpdate: StateUpdater, newValue?: StateValue): Promise<void> =>
      optimist.update(key, onUpdate, newValue),
  };
};
