const Immutable = require("Immutable");

const ImList = Immutable.List;

const ImMap = Immutable.Map;

const RecordFactory = Immutable.Record;

const get = Immutable.get;

function hasp(object, property) {
  return object && object[property] !== undefined;
}

function getp(object, property) {
  return object ? object[property] : undefined;
}

function invoke(object, method) {
  let args = [];
  for(let i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return object[method].apply(object, args);
}

// TODO arguments asserts

function ImRecord() {
  let names = [];
  let namesForFactory = {};
  for(let i = 0; i < arguments.length; i++) {
    const name = arguments[i];
    if (typeof name !== "string") {
      throw new TypeError(`A record field ${name} must be a string.`);
    }
    names.push(name);
    namesForFactory[name] = undefined;
  }

  const Factory = RecordFactory(namesForFactory);

  function Record() {
    const record = Object.create(Record.prototype);
    Factory.call(record);
    return record.withMutations(record => {
      for(let i = 0; i < names.length; i++) {
        const name = names[i];
        const value = arguments[i];
        record = record.set(name, value);
      }
      return record;
    });
  }

  Record.prototype = Object.create(Factory.prototype);

  return Record;
}

function $typeof(x) {
  return typeof x;
}

// ?
function $question(x, constructor) {
  return x instanceof constructor;
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
  if (arguments.length === 1) {
    return +x;
  }
  else if (arguments.length === 2) {
    return x + y;
  }
  else {
    throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

// -
function $dash(x, y) {
  if (arguments.length === 1) {
    return -x;
  }
  else if (arguments.length === 2) {
    return x - y;
  }
  else {
    throw new TypeError(`Bad arity: ${arguments.length}`);
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

/*function $var(f, value) {
  return function() {
    if (arguments.length === 0) {
      return value;
    }
    else if (arguments.length === 1) {
      value = f(value, arguments[0]);
      return value;
    }
  }
}*/

const $monad = Symbol("monad");

function monad(value, next) {
  return {
    [$monad]: true,
    value: value,
    next: next
  };
}

function isMonad(x) {
  return x && x[$monad];
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

// transduce'
function transduce$quote(coll, r) {
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

module.exports = {
  $typeof,
  $question,
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
  $try,
  $throw,
  getp,
  hasp,
  invoke,
  ImList,
  ImMap,
  get,
  ImRecord,
  monad,
  isMonad,
  transduce$quote,
  done,
  isDone
};
