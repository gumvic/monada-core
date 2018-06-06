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

function toList(coll) {
  return Immutable.List(coll);
}

function toMap(coll) {
  if (coll && typeof coll[Symbol.iterator] === "function") {
    let map = Immutable.Map().asMutable();
    for(let x of coll) {
      map = map.set(get(x, 0), get(x, 1));
    }
    return map.asImmutable();
  }
  else {
    return Immutable.Map(coll);
  }
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

const $isMonad = Symbol("isMonad");

function monad(node, next) {
  return {
    [$isMonad]: true,
    node: node,
    next: next
  };
}

function isMonad(x) {
  return x && x[$isMonad];
}

function monadNode(monad) {
  return monad.node;
}

function monadNext(monad) {
  return monad.next;
}

const $isDone = Symbol("isDone");

function done(value) {
  return {
    [$isDone]: true,
    value: value
  };
}

function isDone(x) {
  return x && x[$isDone];
}

function doneValue(done) {
  return done.value;
}

function $for(coll, r) {
  let res = r();
  if (isDone(res)) {
    return r(doneValue(res));
  }
  for(let x of coll) {
    res = r(res, x);
    if (isDone(res)) {
      return r(doneValue(res));
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
          steps.push(monadNext(value));
          value = monadNode(value);
        }
        if (isDone(value)) {
          steps = [];
          value = doneValue(value);
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
  fromJS,
  fromJSON,
  toList,
  toMap,
  record,
  seq,
  monad,
  isMonad,
  monadNode,
  monadNext,
  done,
  isDone,
  doneValue,
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
  $var
};
