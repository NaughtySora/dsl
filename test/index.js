'use strict';

const { resolve } = require('node:path');

const tests = [];

for (const test of tests) require(resolve(__dirname, `${test}.js`));