#!/bin/bash

pnpm i

pnpm run lint

rm -rf ./lib/

npm version patch # next version
pnpm run package

# publish
npm publish --access public
