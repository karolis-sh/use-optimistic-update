import * as React from 'react';
import { useOptimisticState, State } from 'use-optimistic-update';

import { CardsContext } from './Cards';

const Changes: React.FC = () => {
  const selected = React.useContext(CardsContext);
  const changes: State = useOptimisticState('card');

  return (
    <pre style={{ padding: 10 }}>
      True value: {selected}
      <br />
      {JSON.stringify(changes)}
    </pre>
  );
};

export default Changes;
