# use-optimistic-update

[![npm version][version-badge]][version]
![Node.js CI](https://github.com/karolis-sh/use-optimistic-update/workflows/Node.js%20CI/badge.svg)
[![License: MIT][license-badge]][license]
[![code style: prettier][code-style-badge]][code-style]

> Improve perceived performance using future prediction

Some actions are predictable and this library provides a set of utilities to
help you build smooth transitions between async state changes (build **Optimistic
UIs**).

## Example

Converting async counter to optimistic component that reacts to user actions instantly:

```diff
  import React, { useState } from 'react';
+ import { useOptimisticUpdate } from "use-optimistic-update";

  export default function UpTo3Counter() {
    const [counter, setCounter] = useState(0);
+   const { value, onUpdate } = useOptimisticUpdate("count3r", counter);

    const increment = (value) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (value <= 3) setCounter(value);
          resolve();
        }, 1000);
      });

    return (
      <button
        onClick={() => {
          const newValue = counter + 1;
-         increment(newValue);
+         onUpdate(() => increment(newValue), newValue);
        }}
      >
        Likes: {counter}
      </button>
    );
  }
```

## Installation

`npm i use-optimistic-update`

or

`yarn add use-optimistic-update`

## Features

- shareable state between multiple components
- hooks
- direct event emitter access
- typescript support

## API

- [useOptimisticUpdate](#useoptimisticupdate)
- [useOptimisticState](#useoptimisticstate)
- [optimist](#optimist)
  - [optimist.sync](#optimistsync)
  - [optimist.update](#optimistupdate)
  - [optimist.getState](#optimistgetstate)
  - [optimist.onUpdate](#optimistonupdate)

### `useOptimisticUpdate`

`useOptimisticUpdate` is a hook that let's you sync and update the optimistic state.

```jsx
import { useOptimisticUpdate } from 'use-optimistic-update';

const { value, isUpdating, onUpdate } = useOptimisticUpdate(stateKey, realValue);
```

Options

- `stateKey: string`
  - **Required**
- `realValue: string | number | boolean | undefined`
  - **Required**

Returns

- `value: string | number | boolean | undefined`
  - The optimistic value
- `isUpdating: boolean`

  - Indication whether an `onUpdate` is in progress somewhere in the app

- ```ts
  onUpdate: (
    updater: () => Promise<void>,
    newValue: string | number | boolean | undefined
  ) => Promise<void>
  ```

  - Updater function that should be called you want to perform optimistic update
  - `updater`
    - Async function that should change the **real** value
    - While this function is executing the optimistic value is perceived
  - `newValue`
    - The new **optimistic** value

#### Using `onUpdate` function

```jsx
<button
  className={}
  onClick={() => {
    onUpdate(async () => {
      await incrementCounter();
    }, counter + 1);
  }}
>
  {counter}
</button>
```

### `useOptimisticState`

`useOptimisticState` is a hook that let's you retrieve the optimistic state.

```jsx
import { useOptimisticState } from 'use-optimistic-update';

const { value, isUpdating } = useOptimisticState(stateKey);
```

Options

- `stateKey: string`
  - **Required**

Returns

- `value?: string | number | boolean`
  - The optimistic value
- `isUpdating: boolean`
  - Indication whether an `onUpdate` is in progress somewhere in the app

### `optimist`

`optimist` is the underlying event emitter used by the hooks. It is responsible
for updating and syncing optimistic / real values.

#### `optimist.sync`

Synchronize the real value with `optimist` instance.

```jsx
import { optimist } from 'use-optimistic-update';

optimist.sync(stateKey, realValue);
```

Options

- `stateKey: string`
  - **Required**
- `realValue: string | number | boolean | undefined`
  - **Required**

##### Using `optimist.sync`

```jsx
import { optimist } from 'use-optimistic-update';

optimist.sync('count3r', counter);
```

#### `optimist.update`

Update optimistic value inside the `optimist` instance.

```jsx
import { optimist } from 'use-optimistic-update';

optimist.update(stateKey, updater, optimisticValue);
```

Options

- `stateKey: string`
  - **Required**
- `updater: () => Promise<void>`
  - **Required**
- `optimisticValue: string | number | boolean | undefined`
  - **Required**

##### Using `optimist.update`

```jsx
import { optimist } from 'use-optimistic-update';

optimist.update(
  'count3r',
  async () => {
    await incrementCounter();
  },
  counter + 1
);
```

#### `optimist.getState`

Retrieve the optimistic state.

```jsx
import { optimist } from 'use-optimistic-update';

const { value, isUpdating } = optimist.getState(stateKey);
```

Options

- `stateKey: string`
  - **Required**

Returns

- `value?: string | number | boolean`
  - The optimistic value
- `isUpdating: boolean`
  - Indication whether an `onUpdate` is in progress somewhere in the app

#### `optimist.onUpdate`

Retrieve the optimistic state.

```jsx
import { optimist } from 'use-optimistic-update';

const unbind = optimist.onUpdate(stateKey, listener);
```

Options

- `stateKey: string`

  - **Required**

- ```ts
  listener: ({
    isUpdating: boolean;
    value?: StateValue;
  }) => void
  ```

  - **Required**
  - A function that will be called every time the optimistic state changes

Returns

- `unbind: () => void`
  - A function to remove the event listener

## FAQ

- **_What is Optimistic UI?_**

Optimistic UI is a pattern that you can use to simulate the results of a mutation
and update the UI even before receiving a response from the server.

## License

MIT

[version-badge]: https://badge.fury.io/js/use-optimistic-update.svg
[version]: https://www.npmjs.com/package/use-optimistic-update
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: https://opensource.org/licenses/MIT
[code-style-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[code-style]: https://github.com/prettier/prettier
