import { useState, useEffect, useRef } from 'react';

import { State, StateKey } from './types';
import { optimist } from './optimist';

export default (key: StateKey): State => {
  const mounted = useRef(true);
  const [state, setState] = useState(optimist.getState(key));

  useEffect(() => setState(optimist.getState(key)), [key]);

  useEffect(() => {
    const unbind = optimist.onUpdate(key, (newState) => {
      if (mounted.current) setState(newState);
    });
    return (): void => {
      mounted.current = false;
      unbind();
    };
  }, [key]);

  return state;
};
