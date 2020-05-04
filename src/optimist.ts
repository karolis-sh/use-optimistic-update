import { createNanoEvents, Emitter, Unsubscribe } from 'nanoevents';

import { State, StateUpdater, StateValue, StateKey } from './types';

type InternalState = State & {
  sequence: number;
  onUpdate: StateUpdater;
  realValue?: StateValue;
};

const DEFAULT_STATE: InternalState = { sequence: 0, onUpdate: async () => {}, isUpdating: false };

enum UPDATE {
  INITIATE,
  START,
  FINISH,
  SYNC,
}

type Action =
  | { type: UPDATE.INITIATE; payload: { value?: StateValue; onUpdate: StateUpdater } }
  | { type: UPDATE.START }
  | { type: UPDATE.FINISH; payload: number }
  | { type: UPDATE.SYNC; payload?: StateValue };

function reducer(state: InternalState = DEFAULT_STATE, action: Action): InternalState {
  switch (action.type) {
    case UPDATE.INITIATE:
      return {
        ...state,
        sequence: state.sequence + 1,
        value: action.payload.value,
        onUpdate: action.payload.onUpdate,
      };
    case UPDATE.START:
      return {
        ...state,
        isUpdating: true,
      };
    case UPDATE.FINISH:
      if (action.payload === state.sequence) {
        return {
          ...state,
          isUpdating: false,
          value: state.realValue,
        };
      }
      return state;
    case UPDATE.SYNC:
      if (action.payload !== state.realValue) {
        return {
          ...state,
          realValue: action.payload,
          value: state.isUpdating ? state.value : action.payload,
        };
      }
      return state;
    default:
      throw new Error();
  }
}

interface EmitterEvents {
  update: (key: StateKey) => void;
}

class Optimist {
  private emitter: Emitter<EmitterEvents>;

  private state: Partial<Record<StateKey, InternalState>> = {};

  private emissions: Partial<Record<StateKey, State>> = {};

  constructor() {
    this.emitter = createNanoEvents<EmitterEvents>();
  }

  private getInternalState(key: StateKey): InternalState {
    return this.state[key] || DEFAULT_STATE;
  }

  private dispatch(key: StateKey, action: Action): void {
    this.state[key] = reducer(this.state[key], action);

    const previous = this.emissions[key];
    const current = this.getState(key);
    if (previous?.isUpdating !== current.isUpdating || previous?.value !== current.value) {
      this.emissions[key] = current;
      this.emitter.emit('update', key);
    }
  }

  private isUpdating(key: StateKey): boolean | undefined {
    return this.getInternalState(key).isUpdating;
  }

  private isIdentical(key: StateKey): boolean {
    const { value, realValue } = this.getInternalState(key);
    return value === realValue;
  }

  private async process(key: StateKey): Promise<void> {
    const { onUpdate, sequence } = this.getInternalState(key);

    try {
      this.dispatch(key, { type: UPDATE.START });
      await onUpdate();
    } finally {
      this.dispatch(key, { type: UPDATE.FINISH, payload: sequence });
      if (sequence !== this.getInternalState(key).sequence) await this.process(key);
    }
  }

  async update(key: StateKey, onUpdate: StateUpdater, value?: StateValue): Promise<void> {
    this.dispatch(key, { type: UPDATE.INITIATE, payload: { value, onUpdate } });
    if (this.isUpdating(key)) return;
    if (this.isIdentical(key)) return;
    await this.process(key);
  }

  sync(key: StateKey, value?: StateValue): void {
    this.dispatch(key, { type: UPDATE.SYNC, payload: value });
  }

  onUpdate(key: StateKey, listener: (state: State) => void): Unsubscribe {
    return this.emitter.on('update', (emittedKey: StateKey) => {
      if (key === emittedKey) listener(this.getState(key));
    });
  }

  getState(key: StateKey): State {
    const state = this.getInternalState(key);
    return { value: state.value, isUpdating: state.isUpdating };
  }
}

export const optimist = new Optimist();

export default Optimist;
