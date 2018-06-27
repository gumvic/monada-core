const Immutable = require("Immutable");

const fromJS = Immutable.fromJS;
const fromJSON = Immutable.fromJSON;
const has = Immutable.has;
const hasIn = Immutable.hasIn;
const get = Immutable.get;
const getIn = Immutable.getIn;
const update = Immutable.update;
const updateIn = Immutable.updateIn;
const set = Immutable.set;
const setIn = Immutable.setIn;
const remove = Immutable.remove;
const removeIn = Immutable.removeIn;
const merge = Immutable.merge;
const mergeDeep = Immutable.mergeDeep;
const mergeWith = Immutable.mergeWith;
const mergeDeepWith = Immutable.mergeDeepWith;
const isImmutable = Immutable.isImmutable;
const isList = Immutable.List.isList;
const isMap = Immutable.Map.isMap;
const isRecord = Immutable.Record.isRecord;

// TODO arguments asserts everywhere

/*function invoke(object, method) {
  let args = [];
  for(let i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return object[method].apply(object, args);
}*/

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

function $bang$equals(x, y) {
  return !Immutable.is(x, y);
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

/*function $var(value) {
  return {
    value: value
  };
}*/

// <~
/*function $left$tilda($var, value) {
  switch(arguments.length) {
    case 1: return () => $var.value;
    case 2: return () => $var.value = value;
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}*/

// TODO arguments asserts everywhere

/*function hasp(object, property) {
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
}*/

const List = Immutable.List;

function Map(coll) {
  let map = Immutable.Map().asMutable();
  for(let x of coll) {
    map = map.set(get(x, 0), get(x, 1));
  }
  return map.asImmutable();
}

function recordOf1(name, a) {
  const Factory = Immutable.Record({
    [a]: undefined
  }, name);

  function Record(av) {
    const record = Object.create(Record.prototype);
    Factory.call(record);
    return record.set(a, av);
  }

  Record.prototype = Object.create(Factory.prototype);

  return Record;
}

function recordOf2(name, a, b) {
  const Factory = Immutable.Record({
    [a]: undefined,
    [b]: undefined
  }, name);

  function Record(av, bv) {
    const record = Object.create(Record.prototype);
    Factory.call(record);
    return record.set(a, av).set(b, bv);
  }

  Record.prototype = Object.create(Factory.prototype);

  return Record;
}

// TODO up to 8
function record(name, a, b, c, d, e, f, g, h) {
  switch(arguments.length - 1) {
    case 1: return recordOf1(name, a); break;
    case 2: return recordOf2(name, a, b); break;
    default: throw new TypeError(`Too few or too many fields for a record: ${arguments.length}`);
  }
}

/*const monad = record("Monad", "node", "next");
function isMonad(x) {
  return x instanceof monad;
}

const done = record("Done", "value");
function isDone(x) {
  return x instanceof done;
}

const error = record("Error", "description");
function isError(x) {
  return x instanceof error;
}*/

const $isError = Symbol("isError");
function error(description) {
  return {
    [$isError]: true,
    description,
    toString() {
      return `Error ${description}`;
    }
  };
}
function isError(x) {
  return x && x[$isError];
}

const $isMonad = Symbol("isMonad");
function monad(node, step) {
  return {
    [$isMonad]: true,
    node,
    step,
    toString() {
      return `Monad ${node} => ${step}`;
    }
  };
}
function isMonad(x) {
  return x && x[$isMonad];
}

/*function monad(step) {
  function monad(cur, next) {
    const [_cur, _next] = step(cur);
    if (_next) {
      next = cur =>
    }
    if (isMonad(cur)) {
      return cur(undefined, next);
    }
    else {
      return [_cur, next];
    }
  }
  monad[$isMonad] = true;
  return monad;
}*/

/*function step(monad, next) {
  const [cur, _monad] = monad();
  if (_monad) {
    return [cur, step(_monad, next)];
  }
  else {
    return [cur, next];
  }
}*/

/*function step(monad, next) {
  const [cur, _next] = monad();
  if (_next) {
    next = cur => step(_next(cur), next);
  }
  if(isMonad(cur)) {
    return step(cur, next);
  }
  else {
    return [cur, next];
  }
}

function monad_(step) {
  function monad(cur) {
    //step
  }
  monad[$isMonad] = true;
  return monad;
}*/

const $isDone = Symbol("isDone");
function done(value) {
  return {
    [$isDone]: true,
    value,
    toString() {
      return `Done ${value}`;
    }
  };
}
function isDone(x) {
  return x && x[$isDone];
}

function iterate(coll, r) {
  let res = r();
  if (isDone(res)) {
    return r(res.value);
  }
  for(let x of coll) {
    res = r(res, x);
    if (isDone(res)) {
      return r(res.value);
    }
  }
  return r(res);
}

function monadIterator(monad) {
  return function() {
    let value;
    let steps = [() => monad];
    function next() {
      if(!steps.length) {
        return {
          done: true
        };
      }
      else {
        const step = steps.pop();
        value = step(value);
        while(isMonad(value)) {
          steps.push(value.step);
          value = value.node;
        }
        if (isDone(value)) {
          steps = [];
          value = value.value;
        }
        return {
          value
        };
      }
    }
    return {
      next
    };
  }
}

function seq(monad) {
  return {
    [Symbol.iterator]: monadIterator(monad)
  };
}

function $var(value) {
  return function(newValue) {
    switch(arguments.length) {
      case 0: return value;
      case 1: return value = newValue;
      default: throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}

module.exports = {
  $typeof,
  $instanceof,
  $try,
  $throw,
  $new,
  $equals$equals,
  $bang$equals,
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
  $var,

  fromJS,
  fromJSON,
  List,
  Map,
  record,
  seq,
  monad,
  isMonad,
  done,
  isDone,
  has,
  hasIn,
  get,
  getIn,
  update,
  updateIn,
  set,
  setIn,
  remove,
  removeIn,
  merge,
  mergeDeep,
  mergeWith,
  mergeDeepWith,
  isImmutable,
  isList,
  isMap,
  isRecord,
  iterate,

  error,
  isError
};
