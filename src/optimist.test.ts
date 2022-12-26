import Optimist from './optimist';
import { State } from './types';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 5));

it('should handle single update', async () => {
  const optimist = new Optimist();
  const key = 'test-1';

  let state: State | undefined;
  const history: State[] = [];

  optimist.onUpdate(key, (newState) => {
    state = newState;
    history.push(newState);
  });

  expect(state).toBeUndefined();

  optimist.sync(key, 1);
  expect(state).toEqual({ isUpdating: false, value: 1 });

  optimist.update(key, delay, 2);
  expect(state).toEqual({ isUpdating: true, value: 2 });

  await delay();
  expect(state).toEqual({ isUpdating: false, value: 1 });

  expect(history).toEqual([
    { isUpdating: false, value: 1 },
    { isUpdating: true, value: 2 },
    { isUpdating: false, value: 1 },
  ]);
});

it('should handle consecutive updates', async () => {
  const optimist = new Optimist();
  const key = 'test-1';

  let state: State | undefined;
  const history: State[] = [];

  optimist.onUpdate(key, (newState) => {
    state = newState;
    history.push(newState);
  });

  expect(state).toBeUndefined();

  optimist.sync(key, 1);
  expect(state).toEqual({ isUpdating: false, value: 1 });

  optimist.update(key, delay, 2);
  expect(state).toEqual({ isUpdating: true, value: 2 });

  optimist.update(key, delay, 3);
  expect(state).toEqual({ isUpdating: true, value: 3 });

  await delay();
  expect(state).toEqual({ isUpdating: true, value: 3 });
  optimist.sync(key, -1);

  await delay();
  expect(state).toEqual({ isUpdating: false, value: -1 });

  expect(history).toEqual([
    { isUpdating: false, value: 1 },
    { isUpdating: true, value: 2 },
    { isUpdating: true, value: 3 },
    { isUpdating: false, value: -1 },
  ]);
});

it('should handle identical updates', async () => {
  const optimist = new Optimist();
  const key = 'test-1';

  let state: State | undefined;
  const history: State[] = [];

  optimist.onUpdate(key, (newState) => {
    state = newState;
    history.push(newState);
  });

  expect(state).toBeUndefined();

  optimist.sync(key, 1);
  expect(state).toEqual({ isUpdating: false, value: 1 });

  optimist.update(key, delay, 2);
  expect(state).toEqual({ isUpdating: true, value: 2 });

  optimist.update(key, delay, 2);
  expect(state).toEqual({ isUpdating: true, value: 2 });

  await delay();
  expect(state).toEqual({ isUpdating: true, value: 2 });
  optimist.sync(key, -999);

  await delay();
  expect(state).toEqual({ isUpdating: false, value: -999 });

  expect(history).toEqual([
    { isUpdating: false, value: 1 },
    { isUpdating: true, value: 2 },
    { isUpdating: false, value: -999 },
  ]);
});
