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
const isList = Immutable.List.isList;
const isMap = Immutable.Map.isMap;
const isRecord = Immutable.Record.isRecord;

// TODO arguments asserts everywhere

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

const Monad = record("Monad", "node", "next");
function isMonad(x) {
  return x instanceof Monad;
}

const Done = record("Done", "value");
function isDone(x) {
  return x instanceof Done;
}

function $for(coll, r) {
  let res = r();
  if (isDone(res)) {
    return r(get(res, "value"));
  }
  for(let x of coll) {
    res = r(res, x);
    if (isDone(res)) {
      return r(get(res, "value"));
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
          steps.push(get(value, "next"));
          value = get(value, "node");
        }
        if (isDone(value)) {
          steps = [];
          value = get(value, "value");
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

function isError(x) {
  return x instanceof Error;
}

function error(x) {
  return new Error(x);
}

// TODO move to core.monada
function coerce(spec, value) {
  switch(arguments.length) {
    case 2: return spec(value);
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

function generate(spec) {
  return spec();
}

// TODO move to core.monada
function any(x) {
  switch(arguments.length) {
    case 0:
      return undefined;
    case 1:
      return x;
    default:
      throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

// TODO move to core.monada
function aMap(map) {
  const m = Immutable.Map().withMutations(m => {
    for(let [k, v] of map) {
      m.set(k, generate(v));
    }
    return m;
  });
  return function(value) {
    switch(arguments.length) {
      case 0:
        return m;
      case 1:
        let value_ = Immutable.Map().asMutable();
        for(let [k, spec] of map) {
          const coercedV = coerce(spec, get(value, k));
          if (isError(coercedV)) {
            return error(`{ ${k} -> ${coercedV.message} }`);
          }
          else {
            value_ = value_.set(k, coercedV);
          }
        }
        return value_.asImmutable();
      default:
        throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}

function aFunctionOf0(res) {
  const arity = 0;
  const res_ = generate(res);
  function f() {
    if (arguments.length !== arity) {
      throw new TypeError(`Bad arity: ${arguments.length}`);
    }
    return res_;
  }
  return function(value) {
    switch(arguments.length) {
      case 0:
        return f;
      case 1:
        if (typeof value !== "function") {
          return `${value} is not a function`;
        }
        function value_() {
          if (arguments.length !== arity) {
            throw new TypeError(`Bad arity: ${arguments.length}`);
          }
          const res_ = value();
          const coercedRes = coerce(res, res_);
          if (isError(coercedRes)) {
            throw coercedRes;
          }
          return res_;
        }
        const res_ = value();
        const coercedRes = coerce(res, res_);
        if (isError(coercedRes)) {
          throw coercedRes;
        }
        else {
          return value_;
        }
      default:
        throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}

function aFunctionOf1(a, res) {
  const arity = 1;
  const res_ = generate(res);
  function f(a_) {
    if (arguments.length !== arity) {
      throw new TypeError(`Bad arity: ${arguments.length}`);
    }
    const coercedA = coerce(a, a_);
    if (isError(coercedA)) {
      throw coercedA;
    }
    return res_;
  }
  return function(value) {
    switch(arguments.length) {
      case 0:
        return f;
      case 1:
        if (typeof value !== "function") {
          return `${value} is not a function`;
        }
        function value_(a_) {
          if (arguments.length !== arity) {
            throw new TypeError(`Bad arity: ${arguments.length}`);
          }
          const coercedA = coerce(a, a_);
          if (isError(coercedA)) {
            throw coercedA;
          }
          const res_ = value(coercedA);
          const coercedRes = coerce(res, res_);
          if (isError(coercedRes)) {
            throw coercedRes;
          }
          return res_;
        }
        const res_ = value_(generate(a));
        const coercedRes = coerce(res, res_);
        if (isError(coercedRes)) {
          throw coercedRes;
        }
        else {
          return value_;
        }
      default:
        throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}

function aFunction(a, b) {
  switch(arguments.length) {
    case 1: return aFunctionOf0(a);
    case 2: return aFunctionOf1(a, b);
    default: throw new TypeError(`Bad arity: ${arguments.length}`);
  }
}

module.exports = {
  fromJS,
  fromJSON,
  List,
  Map,
  record,
  seq,
  Monad,
  isMonad,
  Done,
  isDone,
  hasp,
  getp,
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
  isList,
  isMap,
  isRecord,
  $for,
  $var,

  error,
  isError,
  coerce,
  any,
  aMap,
  aFunction
};
