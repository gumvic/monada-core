const Immutable = require("Immutable");

const fromJS = Immutable.fromJS;
const RecordFactory = Immutable.Record;
const get = Immutable.get;
const getIn = Immutable.getIn;
const set = Immutable.set;
const setIn = Immutable.setIn;
const has = Immutable.has;

// TODO arguments asserts everywhere

function $var(value) {
  return {
    value: value
  };
}

function getv($var) {
  return function() {
    return $var.value;
  }
}

function setv($var, value) {
  return function() {
    $var.value = value;
    return value;
  }
}

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

function record() {
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

function tuple() {
  let args = [];
  for(let i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return args;
}

function list() {
  let args = [];
  for(let i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return Immutable.List(args);
}

function hashmap() {
  let args = [];
  for(let i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return Immutable.Map(args);
}

function range() {
  let args = [];
  for(let i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return Immutable.Range.apply(null, args);
}

const $monad = Symbol("monad");

function monad(current, next) {
  return {
    [$monad]: true,
    current: current,
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

function transduce(coll, r) {
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
          steps.push(value.next);
          value = value.current;
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

module.exports = {
  fromJS,
  record,
  list,
  hashmap,
  tuple,
  getp,
  hasp,
  get,
  getIn,
  set,
  setIn,
  has,
  $var,
  getv,
  setv,
  monad,
  isMonad,
  done,
  isDone,
  seq,
  transduce
};
