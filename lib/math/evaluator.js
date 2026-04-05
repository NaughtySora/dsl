'use strict';

class Types {
  #schemas = new Map();

  convert(name, key, value) {
    const schema = this.#schemas.get(name);
    if (schema === undefined) {
      throw new TypeError('Unexpected type');
    }
    const operand = schema[key];
    const type = operand.type;
    if (type === undefined) {
      throw new Error(
        'Schema structure is not valid, expected field type is not found'
      );
    }
    if (operand.valid !== undefined && !operand.valid(value)) {
      throw new TypeError('Validation error');
    }
    return this[type].call(this, value);
  }

  number(value) {
    const number = parseFloat(value);
    if (Number.isFinite(number)) return number;
    throw TypeError('Number type expectance failed');
  }

  add(key, schema) {
    this.#schemas.set(key, schema);
    return this;
  }
}

const isNested = Array.isArray;

class Evaluator {
  #table = new Map();
  #types = null;

  constructor(types) {
    this.#types = types;
  }

  #evaluate(node) {
    const operator = node[0];
    const operation = this.#table.get(operator);
    if (operation === undefined) {
      throw new EvalError('Unexpected operator');
    }
    return operation(
      this.#types.convert(operator, 'a', node[1]),
      this.#types.convert(operator, 'b', node[2]),
    );
  }

  resolve(node) {
    const stack = [node];
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (isNested(top)) {
        const left = top[1];
        if (isNested(left)) {
          stack.push(left); continue;
        }
        const right = top[2];
        if (isNested(right)) {
          stack.push(right); continue;
        }
      }
      const last = stack.pop();
      const result = this.#evaluate(last);
      if (stack.length === 0) return result;
      const root = stack[stack.length - 1];
      if (root[1] === last) root[1] = result;
      else root[2] = result;
    }
  }

  add(operator, callback) {
    this.#table.set(operator, callback);
    return this;
  }
}

module.exports = { Evaluator, Types };
