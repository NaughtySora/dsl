'use strict';

const { MathInterpreter } = require('../lib/math/index.js');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('MathInterpreter', () => {
  it('positive cases', () => {
    const tests = [
      { input: '1 + 2', expected: 3 },
      { input: '1 + 2 * 3', expected: 7 },
      { input: '1 * 2 + 3', expected: 5 },
      { input: '4 / 2 + 6', expected: 8 },
      { input: '1 + 2 * 3 + 4', expected: 11 },
      { input: '1 * 2 + 3 * 4', expected: 14 },
      { input: '10 - 2 * 3', expected: 4 },
      { input: '10 / 2 + 3 * 2', expected: 11 },
      { input: '(1 + 2) * 3', expected: 9 },
      { input: '1 * (2 + 3)', expected: 5 },
      { input: '(4 + 6) / 2', expected: 5 },
      { input: '(1 + 2) * (3 + 4)', expected: 21 },
      { input: '((1 + 2) * 3)', expected: 9 },
      { input: '(1 + (2 * 3))', expected: 7 },
      { input: '((1 + 2) * (3 + 4))', expected: 21 },
      { input: '(1 + (2 * (3 + 4)))', expected: 15 },
      { input: '(1 + 2 * 3) + 4', expected: 11 },
      { input: '1 + (2 * 3 + 4)', expected: 11 },
      { input: '(1 + (2 * 3 + 4)) * 5', expected: 55 },
      { input: '(1 + (2 + (3 + (4 + 5))))', expected: 15 },
      { input: '((1 * (2 + 3)) * (4 + (5 * 6)))', expected: 170 },
      { input: '1 + 2 + 3 + 4 + 5', expected: 15 },
      { input: '1 * 2 * 3 * 4 * 5', expected: 120 },
      { input: '10 / 2 / 5', expected: 1 },
      { input: '1 + 2 * 3 / 4', expected: 2.5 },
      { input: '(1 + 2) * 3 / 4', expected: 2.25 },
      { input: '1 + (2 * 3) / 4', expected: 2.5 },
      { input: '(1 + (2 * 3)) / (4 + 2)', expected: 1.1666666666666667 },
      { input: '(1 + (2 * (3 + (4 * (5 + 6)))))', expected: 95 },
      { input: '11 + 25*3 + (16/3)', expected: 91.33333333333333 },
      { input: '(18+3/(25.11-2.11)*6)+10', expected: 28.782608695652172 },
      { input: '(((1 + 2)))', expected: 3 },
      { input: '((1 + 2) * (3 + 4)) / 2', expected: 10.5 },
      { input: '1 + 2 * 3 + 4 * 5 + 6', expected: 33 },
      { input: '((18*3)/(123.0123/2)*6)/10', expected: 0.5267765906336196 },
      { input: '((1+2)*(3+4)*(5+6))/(7+8*2)', expected: 10.043478260869565 },
    ];

    for (const { input, expected } of tests) {
      assert.equal(MathInterpreter.calculate(input), expected);
    }
  });

  it('negative cases', () => {
    const message = 'MathInterpreter Evaluation error';
    const tests = [
      { input: '(((((3)))))', message },
      { input: '1 +', message },
      { input: '+ 1 2', message },
      { input: '1 * (2 + 3', message },
      { input: '1 * )2 + 3(', message },
      { input: '(1 + 2)) * 3', message },
      { input: '1 ** 2', message },
    ];

    for (const { input, message } of tests) {
      assert.throws(() => MathInterpreter.calculate(input), { message });
    }
  });
});



