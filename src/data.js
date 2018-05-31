const Immutable = require("Immutable");

const fromJS = Immutable.fromJS;
const fromJSON = Immutable.fromJSON;
const RecordFactory = Immutable.Record;
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
const isHashmap = Immutable.List.isMap;
const isRecord = Immutable.List.isRecord;

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

function isTuple(coll) {
  return Array.isArray(coll);
}

function tuple(coll) {
  if(isTuple(coll)) {
    return coll;
  }
  else {
    let tuple = [];
    for(let x of coll) {
      tuple.push(x);
    }
    return tuple;
  }
}

function list(coll) {
  return Immutable.List(coll);
}


function hashmap(coll) {
  return Immutable.Map(coll);
}

function record(names) {
  names = tuple(names);

  let namesForFactory = {};
  for(let name of names) {
    if (typeof name !== "string") {
      throw new TypeError(`A record field ${name} must be a string.`);
    }
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
  fromJSON,
  tuple,
  list,
  hashmap,
  record,
  seq,
  monad,
  isMonad,
  done,
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
  isTuple,
  isList,
  isHashmap,
  isRecord,
  transduce
};
