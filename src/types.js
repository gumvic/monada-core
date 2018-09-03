function castType(to, from) {
  return to.castFrom(from) || from.castTo(to);
}

function readableType({ readable }) {
  return readable;
}

function matchType({ type: aType, value: aValue }, { type: bType, value: bValue }) {
  if (
    aType === bType &&
    aValue !== undefined && bValue !== undefined &&
    aValue === bValue) {
    return 1;
  }
  else if (
    aType !== bType ||
    aValue !== bValue) {
    return -1;
  }
  else {
    return 0;
  }
}

const tNone = {
  type: "none",
  castFrom(_) {
    return true;
  },
  castTo(_) {
    return true;
  },
  readable: "?"
};

const tAny = {
  type: "any",
  castFrom(_) {
    return true;
  },
  castTo({ type: toType }) {
    return toType === "any";
  },
  readable: "*"
};

function tPrimitive(type, value) {
  return {
    type,
    value,
    castFrom({ type: fromType, value: fromValue }) {
      return (
        (type === fromType) &&
        (value === undefined || value === fromValue));
    },
    castTo({ type: toType, value: toValue }) {
      return (
        (type === toType) &&
        (value === undefined || value === toValue));
    },
    readable: value === undefined ? type : `${type}(${value})`
  };
}

function tFromValue(value) {
  if (value === null) {
    return tNull;
  }
  else if (typeof value !== "object") {
    return tPrimitive(typeof value, value);
  }
  else {
    return tAny;
  }
}

function checkFunctionArgs(args, _args) {
  if (_args.length !== args.length) {
    return false;
  }
  else {
    for (let i = 0; i < _args.length; i++) {
      if (!castType(args[i], _args[i])) {
        return false;
      }
    }
    return true;
  }
}

function staticFunction(args, res) {
  const readableArgs = args.map(readableType);
  const readableRes = readableType(res);
  return {
    type: "function",
    fn(..._args) {
      return checkFunctionArgs(args, _args) && res;
    },
    castFrom({ type: fromType, fn: fromFn }) {
      if (fromType === "function") {
        const toRes = res;
        const fromRes = fromFn(...args);
        return fromRes && castType(toRes, fromRes);
      }
      else {
        return false;
      }
    },
    castTo(to) {
      // TODO
      return false;
    },
    readable: `fn(${readableArgs.join(", ")}) -> ${readableRes}`
  };
}

function dynamicFunction(args, resFn) {
  const readableArgs = args.map(readableType);
  const readableRes = "?";
  return {
    type: "function",
    fn(..._args) {
      return checkFunctionArgs(args, _args) && resFn(..._args);
    },
    castFrom({ type: fromType, fn: fromFn }) {
      if (fromType === "function") {
        const toRes = resFn(...args);
        const fromRes = fromFn(...args);
        return toRes && fromRes && castType(res, fromRes);
      }
      else {
        return false;
      }
    },
    castTo(to) {
      // TODO
      return false;
    },
    readable: `fn(${readableArgs.join(", ")}) -> ${readableRes}`
  };
}

function tFunction(...args) {
  const res = args.pop();
  if (typeof res === "function") {
    return dynamicFunction(args, res);
  }
  else {
    return staticFunction(args, res);
  }
};

function tMultiFunction(...functions) {
  const readableFunctions = functions.map(readableType);
  return {
    type: "function",
    fn(...args) {
      for(let { fn } of functions) {
        const res = fn(...args);
        if (res) {
          return res;
        }
      }
      return false;
    },
    castFrom(from) {
      for(let to of functions) {
        if(!cast(to, from)) {
          return false;
        }
      }
      return false;
    },
    castTo(to) {
      // TODO
      return false;
    },
    readable: `fns(${readableFunctions.join(", ")})`
  };
}

function tOr(...types) {
  const readableTypes = types.map(readableType);
  return {
    type: "or",
    types,
    castFrom(from) {
      for(let to of types) {
        if (castType(to, from)) {
          return true;
        }
      }
      return false;
    },
    castTo(to) {
      for(let from of types) {
        if (!castType(to, from)) {
          return false;
        }
      }
      return true;
    },
    readable: `(${readableTypes.join(" | ")})`
  };
}

function tAnd(...types) {
  const readableTypes = types.map(readableType);
  return {
    type: "and",
    types,
    castFrom(from) {
      for(let to of types) {
        if (!castType(to, from)) {
          return false;
        }
      }
      return true;
    },
    castTo(to) {
      for(let from of types) {
        if (castType(to, from)) {
          return true;
        }
      }
      return false;
    },
    readable: `(${readableTypes.join(" & ")})`
  };
}

function tNot(type) {
  return {
    type: "not",
    castFrom(from) {
      return !cast(type, from);
    },
    castTo(to) {
      return !cast(to, type);
    },
    readable: `!${readableType(type)}`
  };
}

const tUndefined = tPrimitive("undefined");
const tNull = tPrimitive("null");
const tBoolean = tPrimitive("boolean");
const tNumber = tPrimitive("number");
const tString = tPrimitive("string");

module.exports = {
  matchType: {
    type: tNone,
    value: matchType
  },
  castType: {
    type: tNone,
    value: castType
  },
  readableType: {
    type: tNone,
    value: readableType
  },
  tNone: {
    type: tNone,
    value: tNone
  },
  tAny: {
    type: tNone,
    value: tAny
  },
  tPrimitive: {
    type: tNone,
    value: tPrimitive
  },
  tFromValue: {
    type: tNone,
    value: tFromValue
  },
  tFunction: {
    type: tNone,
    value: tFunction
  },
  tMultiFunction: {
    type: tNone,
    value: tMultiFunction
  },
  tOr: {
    type: tNone,
    value: tOr
  },
  tAnd: {
    type: tNone,
    value: tAnd
  },
  tNot: {
    type: tNone,
    value: tNot
  },
  tUndefined: {
    type: tNone,
    value: tUndefined
  },
  tNull: {
    type: tNone,
    value: tNull
  },
  tBoolean: {
    type: tNone,
    value: tBoolean
  },
  tNumber: {
    type: tNone,
    value: tNumber
  },
  tString: {
    type: tNone,
    value: tString
  }
};
