import { renderHook } from '@testing-library/react-hooks';

import useOptimisticUpdate from './useOptimisticUpdate';

it('should sync value without update', () => {
  let initialValue = 1;

  const { result, rerender } = renderHook(() => useOptimisticUpdate('test', initialValue));

  expect(result.current.value).toBe(1);

  initialValue = 2;
  rerender();

  expect(result.current.value).toBe(2);
});
