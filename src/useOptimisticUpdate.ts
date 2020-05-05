import { State, StateUpdater, StateValue, StateKey } from './types';
import { optimist } from './optimist';
import useOptimisticState from './useOptimisticState';

export default (
  key: StateKey,
  value?: StateValue
): State & {
  onUpdate: (onUpdate: StateUpdater, value?: StateValue) => Promise<void>;
} => {
  optimist.sync(key, value);

  const state = useOptimisticState(key);

  return {
    ...state,
    onUpdate: (onUpdate: StateUpdater, newValue?: StateValue): Promise<void> =>
      optimist.update(key, onUpdate, newValue),
  };
};
