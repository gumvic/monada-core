const immutable = require("Immutable");
const {
  tNone: { value: tNone },
  tAny: { value: tAny },
  tBoolean: { value: tBoolean },
  tNumber: { value: tNumber },
  tString: { value: tString },
  tFunction: { value: tFunction } } = require("./types");

const fromJS = immutable.fromJS;
const fromJSON = immutable.fromJSON;
const has = immutable.has;
const hasIn = immutable.hasIn;
const get = immutable.get;
const getIn = immutable.getIn;
const update = immutable.update;
const updateIn = immutable.updateIn;
const set = immutable.set;
const setIn = immutable.setIn;
const remove = immutable.remove;
const removeIn = immutable.removeIn;
const merge = immutable.merge;
const mergeDeep = immutable.mergeDeep;
const mergeWith = immutable.mergeWith;
const mergeDeepWith = immutable.mergeDeepWith;
const isImmutable = immutable.isImmutable;
const isList = immutable.List.isList;
const isMap = immutable.Map.isMap;
const isRecord = immutable.Record.isRecord;

const $equals$equals = immutable.is;

const list = immutable.List;

function map(coll) {
  let map = immutable.Map().asMutable();
  for(let x of coll) {
    map = map.set(get(x, 0), get(x, 1));
  }
  return map.asImmutable();
}

module.exports = {
  "==": {
    type: tFunction(tAny, tAny, tBoolean, ({ type: aType, value: aValue }, { type: bType, value: bValue }) => {
      if (
        aType === bType &&
        aValue !== undefined && bValue !== undefined &&
        aValue === bValue) {
        return tBoolean(true);
      }
      else if (
        aType !== bType ||
        aValue !== bValue) {
        return tBoolean(false);
      }
      else {
        return tBoolean;
      }
    }),
    value: $equals$equals
  },
  list: {
    type: tNone,
    value: list
  },
  map: {
    type: tNone,
    value: map
  }
};
