const Immutable = require("Immutable");

const ImList = Immutable.List;
const ImMap = Immutable.Map;
const RecordFactory = Immutable.Record;
const get = Immutable.get;

function ImRecord() {
  // This way is't supposed to be the fastest
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

const Monad = ImRecord("value", "next");

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

const Done = ImRecord("value");

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
  ImList,
  ImMap,
  get,
  ImRecord,
  Monad,
  iterate,
  Done
};
