import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';

const UpTo5Counter: React.FC = () => {
  const [counter, setCounter] = useState(0);

  const increment = (value: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => {
        if (value <= 5) setCounter(value);
        resolve();
      }, 600);
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

test('should render button', () => {
  render(<UpTo5Counter />);
  const button = screen.getByTestId('button');

  expect(button).toBeInTheDocument();
  expect(button.textContent).toBe('Likes: 0');
});
