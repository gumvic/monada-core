const {
  "type-number": { value: typeNumber },
  "type-string": { value: typeString },
  "type-function": { value: typeFunction },
  "type-and": { value: typeAnd }
} = require("./types");

function $typeof(x) {
  return typeof x;
}

function $instanceof(x, constructor) {
  return x instanceof constructor;
}

function $new(constructor) {
  let args = [];
  for(let i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  // TODO
}

function $try(f, handler) {
  if (handler === undefined) {
    handler = x => x;
  }
  if (typeof f !== "function") {
  	throw new TypeError(`${f} is not a function.`);
  }
  if (typeof handler !== "function") {
  	throw new TypeError(`${handler} is not a function.`);
  }
  try {
    return f();
  }
  catch(e) {
    return handler(e);
  }
}

function $throw(e) {
  // TODO wrap into an Error if not an Error?
  throw e;
}

// +
function $plus(x, y) {
  switch(arguments.length) {
    case 0: return 0;
    case 1: return +x;
    case 2: return x + y;
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

// -
function $dash(x, y) {
  switch(arguments.length) {
    case 0: return 0;
    case 1: return -x;
    case 2: return x - y;
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

// *
function $star(x, y) {
  return x * y;
}

// /
function $slash(x, y) {
  return x / y;
}

// %
function $percent(x, y) {
  return x % y;
}

// >
function $right(x, y) {
  return x > y;
}

// <
function $left(x, y) {
  return x < y;
}

// >=
function $right$equals(x, y) {
  return x >= y;
}

// <=
function $left$equals(x, y) {
  return x <= y;
}

// ~
function $tilda(x) {
  return ~x;
}

// |
function $pipe(x, y) {
  return x | y;
}

// &
function $and(x, y) {
  return x & y;
}

// ^
function $caret(x, y) {
  return x ^ y;
}

// >>
function $right$right(x, y) {
  return x >> y;
}

// <<
function $left$left(x, y) {
  return x << y;
}

// >>>
function $right$right$right(x, y) {
  return x >>> y;
}

// !
function $bang(x) {
  return !x;
}

// ||
function $pipe$pipe(x, y) {
  return x || y;
}

// &&
function $and$and(x, y) {
  return x && y;
}

module.exports = {
  "+": {
    type: typeAnd(
      typeFunction([typeNumber, typeNumber], typeNumber),
      typeFunction([typeString, typeString], typeString)),
    value: $plus
  }
};
