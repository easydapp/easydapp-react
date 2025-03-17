#!/bin/bash

pnpm i

pnpm run lint

rm -rf ./lib/

pnpm run package

# publish
npm version patch # next version
npm publish --access public
