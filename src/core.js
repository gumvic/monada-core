const Immutable = require("Immutable");

/* Primitives */

function type(x) {
  return typeof x;
}

function isa(x, constructor) {
  return x instanceof constructor;
}

function _try_(f, handler) {
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

// TODO operators
const _equals_equals_ = Immutable.is;

// +
function _plus_(x, y) {
  if (typeof y === undefined) {
    return +x;
  }
  else {
    return x + y;
  }
}

// -
function _dash_(x, y) {
  if (typeof y === undefined) {
    return -x;
  }
  else {
    return x - y;
  }
}

// *
function _star_(x, y) {
  return x * y;
}

// /
function _slash_(x, y) {
  return x / y;
}

// %
function _percent_(x, y) {
  return x % y;
}

// >
function _right_(x, y) {
  return x > y;
}

// <
function _left_(x, y) {
  return x < y;
}

// >=
function _right__equals_(x, y) {
  return x >= y;
}

// <=
function _left__equals_(x, y) {
  return x <= y;
}

// ~
function _tilda_(x) {
  return ~x;
}

// |
function _pipe_(x, y) {
  return x | y;
}

// &
function _and_(x, y) {
  return x & y;
}

// ^
function _caret_(x, y) {
  return x ^ y;
}

// >>
function _right__right_(x, y) {
  return x >> y;
}

// <<
function _left__left_(x, y) {
  return x << y;
}

// >>>
function _right__right__right_(x, y) {
  return x >>> y;
}

// !
function _bang_(x) {
  return !x;
}

// ||
function _pipe__pipe_(x, y) {
  return x || y;
}

// &&
function _and__and_(x, y) {
  return x && y;
}

// TODO as an unary operator
/*function compose() {
  return Array.prototype.reduce.call(arguments, (fs, f) => {
    if (typeof f !== "function") {
    	throw new TypeError(`${f} is not a function.`);
    }
    return (x) => fs(f(x));
  });
}*/


/* Collections */

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

function invoke(obj, method, args) {
  // TODO args should be an array
  return get(obj, method).call(obj, args);
}

function invokeIn(obj, keys, args) {
  // TODO keys should be an array
  // TODO args should be an array
  obj = getIn(obj, keys.slice(0, keys.length - 1));
  const method = keys[keys.length - 1];
  return invoke(obj, method, args);
}

/* Transducers */

class Done {
	constructor(value) {
  	this.value = value;
  }
}

function isDone(x) {
  return x instanceof Done;
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

function _for_(coll, xf) {
  if (typeof xf !== "function") {
  	throw new TypeError(`${xf} is not a transducer.`);
  }
  if (!coll ||
  		typeof coll[Symbol.iterator] !== "function") {
    throw new TypeError(`${coll} is not a transducable.`);
  }
  xf = Array.prototype
    .slice.call(arguments, 2)
    .reduce((xf, f) => {
      if (typeof f !== "function") {
      	throw new TypeError(`${f} is not a function.`);
      }
      return x => xf(f(x));
    }, xf);
  const r = xf(into);
  let res = f();
  for(let x of coll) {
  	res = r(res, x);
    if (res instanceof Done) {
      res = res.value;
      break;
    }
  }
  return r(res);
}

/* Monads */

class Monad {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

function monad(value, next) {
  // TODO check that next is a function
  return new Monad(value, next);
}

function isMonad(x) {
  return x instanceof Monad;
}

module.exports = {
  /* Primitives */
  type,
  isa,
  _try_,
  _equals__equals_,
  _plus_,
  _dash_,
  _star_,
  _slash_,
  _percent_,
  _right_,
  _left_,
  _right__equals_,
  _left__equals_,
  _tilda_,
  _pipe_,
  _and_,
  _caret_,
  _right__right_,
  _left__left_,
  _right__right__right_,
  _bang_,
  _pipe__pipe_,
  _and__and_,
  /* Collections */
  size,
  toJS,
  fromJS,
  ImList,
  ImMap,
  get,
  getIn,
  invoke,
  invokeIn
  /* Transducers */
  _for_,
  done,
  isDone,
  /* Monads */
  monad,
  isMonad
};
