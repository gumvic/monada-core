const Immutable = require("Immutable");

// TODO arguments asserts everywhere

function invoke(object, method) {
  let args = [];
  for(let i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return object[method].apply(object, args);
}

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

// ==
const $equals$equals = Immutable.is;

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

const $undefined = undefined;
const $null = null;
const $false = false;
const $true = true;

function $var(value) {
  return {
    value: value
  };
}

// <~
function $left$tilda($var, value) {
  switch(arguments.length) {
    case 1: return () => $var.value;
    case 2: return () => $var.value = value;
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

module.exports = {
  $typeof,
  $instanceof,
  $try,
  $throw,
  $new,
  invoke,
  $equals$equals,
  $plus,
  $dash,
  $star,
  $slash,
  $percent,
  $right,
  $left,
  $right$equals,
  $left$equals,
  $tilda,
  $pipe,
  $and,
  $caret,
  $right$right,
  $left$left,
  $right$right$right,
  $bang,
  $pipe$pipe,
  $and$and,
  $undefined,
  $null,
  $false,
  $true,
  $var,
  $left$tilda
};
