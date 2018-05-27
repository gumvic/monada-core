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

/*function stepMonad(m, next) {
  if(isMonad(m)) {
    return stepMonad(m.current, _m => stepMonad(m.next(_m), next));
  }
  else {
    return [m, next && (() => next(m))];
  }
}

function monadIterator(monad) {
  return function() {
    let value = undefined;
    let nextStep = () => stepMonad(monad);
    function next() {
      if (!nextStep) {
        return {
          done: true
        };
      }
      else {
        [value, nextStep] = nextStep();
        if (isDone(value)) {
          value = value.value;
          nextStep = undefined;
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
}*/

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

/*function shallowMonadIterator(monad) {
  return function() {
    let value;
    let nextStep = () => monad;
    function next() {
      if(!nextStep) {
        return {
          done: true
        };
      }
      else {
        const { current, next } = nextStep(value);
        if (isDone(current)) {
          value = current.value;
          nextStep = undefined;
        }
        else {
          value = current;
          nextStep = next;
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
}*/

/*function seqIterator(next) {
  return function() {
    return {
      next: function() {
        if(!next) {
          return {
            done: true
          };
        }
        else {
          const res = next();
          if(!res) {
            return {
              done: true
            };
          }
          else {
            next = res[1];
            return {
              value: res[0]
            };
          }
        }
      }
    };
  }
}*/

function seq(monad) {
  return {
    [Symbol.iterator]: monadIterator(monad)
  };
}

/*function withState(f) {
  let state, res, x;
  return function() {
    switch(arguments.length) {
      case 0:
        [res, state] = r();
        return res;
      case 1:
        res = arguments[0];
        [res, state] = r(res);
        return res;
      case 2:
        res = arguments[0];
        x = arguments[1];
        [res, state] = r(res, x);
      default:
        throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}*/

/*function statefun(fun, state) {
  return function(a, b, c, d, e, f, g, h) {
    let res;
    switch(arguments.length) {
      case 0:
        [state, res] = fun(state);
        return res;
      case 1:
        [state, res] = fun(state, a);
        return res;
      case 2:
        [state, res] = fun(state, a, b);
        return res;
      case 3:
        [state, res] = fun(state, a, b, c);
        return res;
      case 4:
        [state, res] = fun(state, a, b, c, d);
        return res;
      case 5:
        [state, res] = fun(state, a, b, c, d, e);
        return res;
      case 6:
        [state, res] = fun(state, a, b, c, d, e, f);
        return res;
      case 7:
        [state, res] = fun(state, a, b, c, d, e, f, g);
        return res;
      case 8:
        [state, res] = fun(state, a, b, c, d, e, f, g, h);
        return res;
      default:
        let args = [state];
        for(let i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        [state, res] = fun.apply(null, args);
        return res;
    }
  }
}

function stateful(r) {
  let state;
  return function(res, x) {
    switch(arguments.length) {
      case 0:
        [res, state] = r();
        return res;
      case 1:
        [res, state] = r([res, state]);
        return res;
      case 2:
        [res, state] = r([res, state], x);
        return res;
      default:
        throw new TypeError(`Bad arity: ${arguments.length}`);
    }
  }
}*/

/*function parseImperatively(monad, actions) {
  if (isMonad(monad)) {
    const { current, next } = monad;
    parseImperatively(current, actions);
    parseImperatively(next(undefined), actions);
  }
  else {
    const action = typeof monad === "function" ? monad : () => monad;
    actions.push(action);
  }
}

function genImperatively(actions) {
  const [a, b, c, d, e, f, g, h] = actions;
  switch(actions.length) {
    case 0:
      return () => undefined;
    case 1:
      return a;
    case 2:
      return () => { a(); return b(); };
    case 3:
      return () => { a(); b(); return c(); };
    case 4:
      return () => { a(); b(); c(); return d(); };
    case 5:
      return () => { a(); b(); c(); d(); return e(); };
    case 6:
      return () => { a(); b(); c(); d(); e(); return f(); };
    case 7:
      return () => { a(); b(); c(); d(); e(); f(); return g(); };
    case 8:
      return () => { a(); b(); c(); d(); e(); f(); g(); return h(); };
    default:
      return () => {
        let res;
        for (let action of actions) {
          res = action();
        }
        return res;
      };
  }
}

function imperatively(monad) {
  let actions = [];
  parseImperatively(monad, actions);
  return genImperatively(actions);
}*/

module.exports = {
  fromJS,
  record,
  list,
  hashmap,
  range,
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
