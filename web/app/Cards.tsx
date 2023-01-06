import * as React from 'react';
import { useOptimisticUpdate } from 'use-optimistic-update';

export const CardsContext = React.createContext(1);

type OnSelect = (value: number) => Promise<void>;

const Card: React.FC<{
  name: number;
  selected?: boolean;
  onSelect: () => void;
}> = ({ name, selected, onSelect }) => {
  return (
    <button
      type="button"
      style={{
        border: `1px solid ${selected ? 'blue' : 'black'}`,
        padding: 10,
        flex: 1,
        margin: 5,
        cursor: 'pointer',
        backgroundColor: selected ? 'pink' : 'lightgrey',
      }}
      onClick={(): void => onSelect()}
    >
      CARD {name}
    </button>
  );
};

const Cards: React.FC<{ onSelect: OnSelect }> = ({ onSelect }) => {
  const selected = React.useContext(CardsContext);

  const { onUpdate, value } = useOptimisticUpdate('card', selected);

  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          name={index}
          selected={index === value}
          onSelect={(): Promise<void> =>
            onUpdate(async (): Promise<void> => {
              await onSelect(index);
            }, index)
          }
        />
      ))}
    </div>
  );
};

export default Cards;
