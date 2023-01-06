import { render, screen, fireEvent, act } from '@testing-library/react';
import React, { useState } from 'react';

import { useOptimisticUpdate } from '.';

const DELAY = 5;

const sleep = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, DELAY + 5));

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
    const { value: optimisticCounter, onUpdate } = useOptimisticUpdate(
      'UpTo3Counter',
      counter,
    );

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

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 0');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 1');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 1');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 2');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 2');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 3');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 3');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 3');
  });

  it('should pre-render optimistic values on OptimisticUpTo3Counter interactions', async () => {
    render(<OptimisticUpTo3Counter />);
    const button = screen.getByTestId('button');
    expect(button.textContent).toBe('Likes: 0');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 1');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 1');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 2');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 2');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 3');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 3');

    fireEvent.click(button);
    expect(button.textContent).toBe('Likes: 4');
    await act(() => sleep());
    expect(button.textContent).toBe('Likes: 3');
  });

  const OptimisticCheckbox: React.FC = () => {
    const [selected, setSelected] = useState(true);
    const { value, onUpdate } = useOptimisticUpdate('checkbox', selected);

    return (
      <div>
        <input
          data-testid="checkbox"
          type="checkbox"
          checked={value as boolean}
          onChange={(): void => {
            onUpdate(async () => {
              setSelected(!value);
            }, !value);
          }}
        />
        <span data-testid="result">{value ? 'Active' : 'Inactive'}</span>
      </div>
    );
  };

  it('should pre-render initial value', async () => {
    render(<OptimisticCheckbox />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox.getAttribute('checked')).toBe('');
    expect(screen.getByTestId('result').textContent).toBe('Active');

    fireEvent.click(checkbox);

    // expect(checkbox.getAttribute('checked')).toBeNull(); // TODO: why this doesn't update?
    expect(screen.getByTestId('result').textContent).toBe('Inactive');
    await act(() => sleep());
    // expect(checkbox.getAttribute('checked')).toBeNull(); // TODO: why this doesn't update?
    expect(screen.getByTestId('result').textContent).toBe('Inactive');
  });
});
