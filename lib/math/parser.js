'use strict';

class Grammar {
  #precedence = new Map();
  #orthography = null;

  constructor(orthography) {
    this.#orthography = orthography;
  }

  precedence(rules) {
    const table = this.#precedence;
    for (const entry of Object.entries(rules)) {
      for (const operator of entry[1]) {
        table.set(operator, parseInt(entry[0]));
      }
    }
    return this;
  }

  order(o1, o2) {
    return this.#precedence.get(o1) >= this.#precedence.get(o2);
  }

  resolve(operators, token) {
    if (operators.length === 0 || this.close(token)) return false;
    const top = operators[operators.length - 1];
    return this.order(top, token);
  }

  operator(token) {
    return this.#orthography.recognize(token) === 'operator';
  }

  section(token) {
    return this.close(token) || this.open(token);
  }

  open(token) {
    return token === "(";
  }

  close(token) {
    return token === ")";
  }
}

class AST {
  #tree = null;

  static from(tokens, grammar) {
    let sections = 0;
    const nodes = [];
    const operators = [];
    const node = () => {
      const root = operators.pop();
      if (grammar.open(root)) return false;
      const right = nodes.pop();
      const left = nodes.pop();
      nodes.push([root, left, right]);
      return true;
    };
    for (const token of tokens) {
      if (grammar.operator(token) || grammar.section(token)) {
        if (grammar.open(token)) sections++;
        if (grammar.close(token)) {
          if (sections < 1) throw new Error('Parsing Error');
          else sections--;
          while (node());
          continue;
        }
        while (grammar.resolve(operators, token)) node();
        operators.push(token);
      } else {
        nodes.push(token);
      }
    }
    while (operators.length > 0) node();
    if (nodes.length !== 1 || sections !== 0) {
      throw new SyntaxError('Parsing Error');
    }
    const ast = new AST();
    ast.#tree = nodes[0];
    return ast;
  }

  flat() {
    return this.#tree.flat(Infinity);
  }

  copy() {
    return this.#tree.slice(0);
  }

  traverse(resolver) {
    return resolver(this.#tree);
  }
}

module.exports = { AST, Grammar };
