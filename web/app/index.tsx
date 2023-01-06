import * as React from 'react';

import Cards, { CardsContext } from './Cards';
import Changes from './Changes';

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const App: React.FC = () => {
  const [selected, setSelected] = React.useState(1);

  const setDelayedSelected =
    (ms: number) =>
    async (value: number): Promise<void> => {
      await sleep(ms);
      setSelected(value);
      // eslint-disable-next-line no-console
      console.log(`selected${value}`);
    };

  const setDelayedFSelectFail =
    (ms: number) =>
    async (value: number): Promise<void> => {
      await sleep(ms);
      // eslint-disable-next-line no-console
      console.log(`failed to selected${value}`);
    };

  return (
    <CardsContext.Provider value={selected}>
      <div className="App">
        <Cards onSelect={setDelayedSelected(1500)} />
        <br />
        <Cards onSelect={setDelayedSelected(2000)} />
        <br />
        <Cards onSelect={setDelayedFSelectFail(2500)} />
        <br />
        <Changes />
      </div>
    </CardsContext.Provider>
  );
};

export default App;
