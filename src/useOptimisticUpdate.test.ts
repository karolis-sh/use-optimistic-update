import { renderHook, act } from '@testing-library/react-hooks';

import useOptimisticUpdate from './useOptimisticUpdate';

const sleep = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

it('should sync value without update', () => {
  let initialValue = 1;

  const { result, rerender } = renderHook(() => useOptimisticUpdate('test', initialValue));

  expect(result.current.value).toBe(1);

  initialValue = 2;
  rerender();

  expect(result.current.value).toBe(2);
});

it('should update', async () => {
  let initialValue = 1;

  const { result } = renderHook(() => useOptimisticUpdate('test-2', initialValue));

  expect(result.current.value).toBe(1);
  expect(result.current.isUpdating).toBeFalsy();

  await act(() =>
    result.current.onUpdate(async () => {
      await sleep();
      initialValue += 1;
    }, (result.current.value as number) + 1)
  );

  expect(result.current.value).toBe(2);
  expect(result.current.isUpdating).toBe(false);

  await act(() =>
    result.current.onUpdate(async () => {
      await sleep();
    }, (result.current.value as number) + 1)
  );

  expect(result.current.value).toBe(2);
  expect(result.current.isUpdating).toBe(false);
});
