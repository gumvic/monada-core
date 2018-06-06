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
const isList = Immutable.Record.isList;
const isMap = Immutable.Record.isMap;

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

/*function Record() {
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

  function isRecord(x) {
    return x instanceof Record;
  }

  return {
    ctor: Record,
    predicate: isRecord
  };
}*/

const $recordCtor = Symbol("recordCtor");

function recordCtorOf1(a) {
  function ctor(av) {
    return {
      [$recordCtor]: ctor,
      [a]: av
    };
  }
  return ctor;
}

function recordCtorOf2(a, b) {
  function ctor(av, bv) {
    return {
      [$recordCtor]: ctor,
      [a]: av,
      [b]: bv
    };
  }
  return ctor;
}

// TODO up to 8
function record(a, b, c, d, e, f, g, h) {
  let ctor = null;
  switch(names.length) {
    case 1: ctor = recordCtorOf1(a); break;
    case 2: ctor = recordCtorOf2(a, b); break;
    default: throw new TypeError(`Too less or too many fields for a record: ${arguments.length}`);
  }
  function predicate(x) {
    return x && x[$recordCtor] === ctor;
  }
  return {
    ctor,
    predicate
  };
}

function isRecord(x) {
  return x && x[$recordCtor];
}

const MonadRecord = record("node", "next");
const Monad = MonadRecord.ctor;
const isMonad = MonadRecord.predicate;

const DoneRecord = record("value");
const Done = DoneRecord.ctor;
const isDone = DoneRecord.predicate;

function $for(coll, r) {
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
  fromJS,
  fromJSON,
  List,
  Map,
  record,
  seq,
  Monad,
  Done,
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
