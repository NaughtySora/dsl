'use strict';

const { Tokenizer, Orthography } = require('./tokenizer.js');
const { AST, Grammar } = require('./parser.js');
const { Evaluator, Types } = require('./evaluator.js');

class MathInterpreter {
  static #tokenizer = null;
  static #grammar = null;
  static #resolver = null;

  static {
    const orthography = new Orthography()
      .define('1', '2', '3', '4',
        '5', '6', '7', '8',
        '9', '0', '(', ')',
        '+', '-', '*', '/',
        '.', 'float', 'integer', 'operator'
      )
      .alias('1234567890', 'integer')
      .alias('+-*/', 'operator')
      .allow('integer', ['.', 'float'], ['integer'])
      .allow('.', ['integer', 'float'])
      .allow('float', ['integer', 'float'], ['float'])
      .forbid(
        ['.', '.'], ['(', ')'],
        ['operator', 'operator'], ['float', '.'],
        ['operator', ')'],
      );
    MathInterpreter.#tokenizer = new Tokenizer(orthography);
    MathInterpreter.#grammar = new Grammar(orthography)
      .precedence({ 0: '+-', 1: '*/', });
    const schemas = {
      base: {
        a: { type: 'number' },
        b: { type: 'number' },
      },
      division: {
        a: { type: 'number' },
        b: { type: 'number', valid: (value) => value !== '0' },
      },
    };
    const types = new Types()
      .add('*', schemas.base).add('+', schemas.base)
      .add('-', schemas.base).add('/', schemas.division);
    const evaluator = new Evaluator(types)
      .add('*', (a, b) => a * b).add('+', (a, b) => a + b)
      .add('-', (a, b) => a - b).add('/', (a, b) => a / b);
    MathInterpreter.#resolver = evaluator.resolve.bind(evaluator);
  }

  static calculate(input) {
    try {
      return AST.from(
        MathInterpreter.#tokenizer.consume(input),
        MathInterpreter.#grammar,
      ).traverse(MathInterpreter.#resolver);
    } catch (e) {
      throw new EvalError('MathInterpreter Evaluation error', { cause: e });
    }
  }
}

module.exports = { MathInterpreter };
