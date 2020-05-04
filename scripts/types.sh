#!/bin/bash

echo "
declare module \"use-optimistic-update\" {
  import main = require(\"index\");
  export = main;
}" >> lib/index.d.ts
