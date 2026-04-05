'use strict';

const { resolve } = require('node:path');

const tests = ['math'];

for (const test of tests) require(resolve(__dirname, `${test}.js`));
