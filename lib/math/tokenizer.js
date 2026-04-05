'use strict';

class Orthography {
  #id = 0;
  #chars = new Map();
  #ids = new Map();
  #allow = new Map();
  #forbid = new Set();

  #isExpected(char) {
    if (!this.#ids.has(char)) {
      throw new SyntaxError(`Unexpected Token ${char}`);
    }
  }

  define(...tokens) {
    for (const token of tokens) {
      const id = this.#id++;
      this.#ids.set(token, id);
      this.#chars.set(id, token);
    }
    return this;
  }

  alias(tokens, name) {
    const chars = this.#chars;
    const ids = this.#ids;
    const id = ids.get(name) ?? this.#id++;
    this.#chars.set(id, name);
    for (const token of tokens) {
      const prev = this.#ids.get(token);
      if (prev !== undefined) chars.delete(prev);
      this.#ids.set(token, id);
    }
    return this;
  }

  #getAllowed(token) {
    const rules = this.#allow.get(token);
    if (rules === undefined) {
      const rules = new Map();
      this.#allow.set(token, rules);
      return rules;
    }
    return rules;
  }

  allow(token, ...paths) {
    const rules = this.#getAllowed(token);
    for (const { 0: from, 1: to = from } of paths) {
      rules.set(from, to);
    }
    return this;
  }

  forbid(...rules) {
    const get = this.#ids.get.bind(this.#ids);
    for (const rule of rules) {
      this.#forbid.add(rule.map(get).join(''));
    }
    return this;
  }

  id(char) {
    return this.#ids.get(char);
  }

  name(id) {
    return this.#chars.get(id);
  }

  *read(raw) {
    const length = raw.length;
    let pointer = 0;
    while (true) {
      if (pointer >= length) return;
      const char = raw[pointer++];
      if (char.trim() === '') continue;
      this.#isExpected(char);
      yield char;
    }
  }

  forbidden(from, to) {
    const ids = this.#ids;
    const start = ids.get(from);
    if (!start) return true;
    const end = ids.get(to);
    if (!end) return true;
    return this.#forbid.has(`${start}${end}`);
  }

  connected(from, to) {
    const route = this.#allow.get(from);
    if (route === undefined) return;
    return route.get(to);
  }

  recognize(token) {
    const id = this.#ids.get(token);
    return this.#chars.get(id);
  }
}

class Tokenizer {
  #orthography = null;

  constructor(orthography) {
    this.#orthography = orthography;
  }

  consume(input) {
    const output = [];
    const orthography = this.#orthography;
    let state;
    let lexeme = '';
    for (const token of orthography.read(input)) {
      const name = orthography.recognize(token);
      this.#isExpected(state, name);
      if (state === undefined) state = name;
      state = orthography.connected(state, name);
      if (state !== undefined) {
        lexeme += token;
      } else {
        if (lexeme !== '') output.push(lexeme, token);
        else output.push(token);
        lexeme = '';
      }
    }
    if (lexeme !== '') output.push(lexeme);
    return output;
  }

  #isExpected(from, to) {
    if (to === undefined) {
      throw SyntaxError('Unexpected token');
    }
    if (from !== undefined && this.#orthography.forbidden(from, to)) {
      throw SyntaxError('Unexpected token');
    }
  }
}

module.exports = { Orthography, Tokenizer };
