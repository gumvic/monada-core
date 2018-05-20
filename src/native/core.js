const Immutable = require("Immutable");

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

const $done = Symbol("done");

function done(value) {
  return {
    [$done]: true,
    value: value
  };
}

function isDone(x) {
  return x && x[$done];
}

function into(result, item) {
  if (arguments.length === 0) {
    return [];
  }
  else if (arguments.length === 1) {
    return result;
  }
  else if (arguments.length === 2) {
    result.push(item);
    return result;
  }
  else {
    throw new TypeError("Arity not supported: " + arguments.length.toString());
  }
}

function $for(coll) {
  if (!coll ||
  		typeof coll[Symbol.iterator] !== "function") {
    throw new TypeError(`${coll} is not a transducable.`);
  }
  let r = into;
  for(let i = arguments.length - 1; i > 0; i--) {
    const xf = arguments[i];
    if (typeof xf !== "function") {
    	throw new TypeError(`${xf} is not a transducer.`);
    }
    r = xf(r);
  }
  let res = r();
  for(let x of coll) {
  	res = r(res, x);
    if (isDone(res)) {
      res = res.value;
      break;
    }
  }
  return r(res);
}

const $monad = Symbol("monad");

function monad(value, next) {
  // TODO check that next is a function
  return {
    [$monad]: true,
    value: value,
    next: next
  };
}

function isMonad(x) {
  return x && x[$monad];
}

function size(x) {
  if (x && x.size && typeof x.size === "number") {
    return x.size;
  }
  else if (x && x.length && typeof x.length === "number") {
    return x.size;
  }
  else {
    return 0;
  }
}

function toJS(x) {
	if (x && typeof x.toJS === "function") {
  	return x.toJS();
  }
  else {
  	return x;
  }
}

const fromJS = Immutable.fromJS;

const ImList = Immutable.List;

const ImMap = Immutable.Map;

const get = Immutable.get;

const getIn = Immutable.getIn;

module.exports = {
  type,
  isa,
  dontPanic,
  panic,
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
  $for,
  done,
  isDone,
  monad,
  isMonad,
  size,
  toJS,
  fromJS,
  ImList,
  ImMap,
  get,
  getIn
};
