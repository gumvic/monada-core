const Immutable = require("Immutable");

const Done = require("./Done");

function type(x) {
  return typeof x;
}

function isa(x, constructor) {
  return x instanceof constructor;
}

// TODO make it accept a monad somehow?
function dontPanic(f, handler) {
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

function panic(e) {
  // TODO wrap into an Error if not an Error?
  throw e;
}

const $undefined = undefined;

const $null = null;

const $false = false;

const $true = true;

// ==
const $equals$equals = Immutable.is;

// +
function $plus(x, y) {
  if (typeof y === undefined) {
    return +x;
  }
  else {
    return x + y;
  }
}

// -
function $dash(x, y) {
  if (typeof y === undefined) {
    return -x;
  }
  else {
    return x - y;
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

function iterate(coll, r) {
  let res = r();
  for(let x of coll) {
  	res = r(res, x);
    if (res instanceof Done) {
      res = res.get("value");
      break;
    }
  }
  return r(res);
}

const $monad = Symbol("monad");

module.exports = {
  type,
  isa,
  dontPanic,
  panic,
  $undefined,
  $null,
  $false,
  $true,
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
  iterate
};
