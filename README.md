# DSL (Domain Specific Language)

Making a language requires a things:
1. A concept - Define grammar and rules
2. Tokenizer - Split raw string into meaningful parts. Ensure correctness.
3. Parser - build a structure (tree) from valid tokens.
4. Evaluator - go through tree and execute predefined commands. 

Every language has its alphabet, set of symbols that language uses.
Grammar is a set of rules that describe how tokens can be combined 
to form a valid program.
Process of splitting input into meaningful grammar pieces is 
called tokenization or lexical analysis and the those parts are tokens.

## Tokenization
Tokenizer or Lexer reads raw input and producers a stream of tokens.
Steps by step:
1. Read character.
2. Identify longest matching token (keyword, numbers, identifiers, symbols).
3. Ignore white spaces and comments.
4. Output tokens.

### Example
- Simple Math DSL
- Input: '1.25 + 2 * 3'
- Tokens: ['1.25', '+', '2', '*', '3']

### Notes
- Tokenizer should define set of symbols it supports (if possible)
- Tokenizer can normalize, alias, merge, split tokens, and rearrange 
for less memory and cpu consumption.
- Tokenizer should also minimize output and provide the way to 
identify tokens for the rest of the program.

# Parsing - Syntax Analysis
Parser takes tokens and produces an AST representing program structure.

## Parser types:
1. Top-down
- start from root
- has predefined set of scenarios or rules.
- pick one rule depending on token.
- follow rule with specific expected value
- rule ends, pick another one
- expectation fails -> error

2. Bottom-up
- start from bottom
- build structure by combining tokens
- form higher-level structures

## AST (Abstract syntax tree)
AST is what compilers or interpreters use to understand
- Tree represents code without unnecessary details
- Nodes are operators, functions, control structures.
- Leaves are literals, variables

### Example
```js
       +
     /   \
   5       *
         /   \
        3     2
```

### Building an AST
There are two ways to build a tree
- recursive (natural and mathematics) 
- with explicit stack (less dangerous and productive, but more complicated)

### Parser steps:
- Look at current token
- Decide what rule applies
- Consume token
- Build node
- Repeat

# Precedence
- Operators can have their precedence.
- Parse can handle overriding precedence if language defines it.

### Example how to handle overriding precedence
- syntax - ()
- encounter '(', put it into operators, it server as a barrier or a wall
- encounter ')', resolve node till '('

### Example of building an AST
- tokens ['1', '*', '2', '+', '3']
- nodes []
- operators []
1. encounter '1'
nodes ['1']
2. encounter '\*'
operators ['\*']
3. encounter '2'
nodes ['1', '2']
4. encounter '+'
at this point, there are 2 operators
top of the stack: '\*'
current: '+'
compare (\* > +)
if true, we resolve(build) a node
pop operator and last 2 operands
node - ['\*', '1', '2']
push node to nodes
push '+' to operators
nodes \[\['\*', '1', '2']]
operators ['+']
5. encounter '3'
nodes [['\*', '1', '2'], '3']
6. end of the input
check if operators is not empty
pop operators stack, resolve rest of the nodes
\[\['+', '3', ['\*', '1', '2']]]
7. check if nodes.length !== 0, something went wrong, throw an error

# Evaluator 
Its going through AST in post-order traversal algorithm.
Evaluates operations.
Can make type coercion and validation.
Produces an input.

### Example
[ '+', '1', [ '*', '2', '3' ] ]

1. start '+'
2. go left to '1'
3. go right [ '*', '2', '3' ]
    4. go left '2'
    5. go right '3'
    6. resolve to 2 * 3 = 6
7. back to '+'
8. resolve to 1 + 6
9. return 7

# Misc

## Separation of Concerns:
- Lexer understands characters.
- Parser understands structure.
- Interpreter understands meaning.

## State Machines and DSL
1. FSM, are used in lexers/tokenizers.
- Each state represents possible stage of recognizing a token.
2. PDA, can parse context-free languages.
- Used in parsers, especially for nested structures.

## Language Processor

1. Interpreter
- Reads code.
- Builds structure (AST).
- Executes it directly.

2. Compiler
- Reads code.
- Builds structure (AST).
- Semantic Analysis, check types, scopes, rules.
- Optimization, simplify expressions.
- Code Generation, output machine code, bytecode, or another language.
