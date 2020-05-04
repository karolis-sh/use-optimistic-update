import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import { useOptimisticUpdate } from '.';

const DELAY = 5;

const sleep = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, DELAY + 5));

describe('useOptimisticUpdate', () => {
  const AsyncUpTo3Counter: React.FC = () => {
    const [counter, setCounter] = useState(0);

    const increment = (newValue: number): Promise<void> =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (newValue <= 3) setCounter(newValue);
          resolve();
        }, DELAY);
      });

    return (
      <button
        data-testid="button"
        type="button"
        onClick={(): void => {
          increment(counter + 1);
        }}
      >
        Likes: {counter}
      </button>
    );
  };

  const OptimisticUpTo3Counter: React.FC = () => {
    const [counter, setCounter] = useState(0);
    const { value: optimisticCounter, onUpdate } = useOptimisticUpdate('UpTo3Counter', counter);

    const increment = (newValue: number): Promise<void> =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (newValue <= 3) setCounter(newValue);
          resolve();
        }, DELAY);
      });

    return (
      <button
        data-testid="button"
        type="button"
        onClick={(): void => {
          const newValue = (optimisticCounter as number) + 1;
          onUpdate(() => increment(newValue), newValue);
        }}
      >
        Likes: {optimisticCounter}
      </button>
    );
  };

  it('should have delayed render on AsyncUpTo3Counter interactions', async () => {
    render(<AsyncUpTo3Counter />);
    const button = screen.getByTestId('button');
    expect(button.textContent).toBe('Likes: 0');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 0');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 1');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 1');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 2');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 2');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');
  });

  it('should pre-render optimistic values on OptimisticUpTo3Counter interactions', async () => {
    render(<OptimisticUpTo3Counter />);
    const button = screen.getByTestId('button');
    expect(button.textContent).toBe('Likes: 0');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 1');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 1');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 2');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 2');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');

    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('button').textContent).toBe('Likes: 4');
    await act(() => sleep());
    expect(screen.getByTestId('button').textContent).toBe('Likes: 3');
  });
});
