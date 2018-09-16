const NONE = "none";
const ANY = "any";
const UNDEFINED = "undefined";
const NULL = "null";
const BOOLEAN = "boolean";
const NUMBER = "number";
const STRING = "string";
const FUNCTION = "function";
const AND = "and";
const OR = "or";

function cast(to, from) {
  if (to.type === NONE ||
      from.type === NONE) {
    return true;
  }
  else if (to.type === ANY) {
    return true;
  }
  else if (to.type === AND) {
    for (let _to of to.types) {
      if (!cast(_to, from)) {
        return false;
      }
    }
    return true;
  }
  else if (from.type === AND) {
    for (let _from of from.types) {
      if (cast(to, _from)) {
        return true;
      }
    }
    return false;
  }
  else if (to.type === OR) {
    for (let _to of to.types) {
      if (cast(_to, from)) {
        return true;
      }
    }
    return false;
  }
  else if (from.type === OR) {
    for (let _from of from.types) {
      if (!cast(to, _from)) {
        return false;
      }
    }
    return true;
  }
  else if (
    to.type === UNDEFINED &&
    from.type === UNDEFINED) {
    return true;
  }
  else if (
    to.type === NULL &&
    from.type === NULL) {
    return true;
  }
  else if (
    to.type === BOOLEAN ||
    to.type === NUMBER ||
    to.type === STRING) {
    return to.value === undefined ?
      to.type === from.type :
      (to.type === from.type && to.value === from.value);
  }
  else if (
    to.type === FUNCTION &&
    from.type === FUNCTION) {
    for(let { args: toArgs, res: toRes } of to.variants) {
      let success = false;
      for(let { fn: fromFn } of from.variants) {
        const fromRes = fromFn(...toArgs);
        if (fromRes && cast(toRes, fromRes)) {
          success = true;
          break;
        }
      }
      if (!success) {
        return false;
      }
    }
    return true;
  }
  else {
    return false;
  }
}

function match(type, value) {
  // TODO
}

function readable(type) {
  switch(type.type) {
    case NONE: return "_";
    case ANY: return "*";
    case UNDEFINED: return "undefined";
    case NULL: return "null";
    case BOOLEAN: return type.value ? `boolean(${type.value})` : `boolean`;
    case NUMBER: return type.value ? `number(${type.value})` : `number`;
    case STRING: return type.value ? `string(${type.value})` : `string`;
    case FUNCTION:
      const variants = type.variants
        .map(({ readable: _readable, args, res }) =>
          _readable ||
          `fn(${args.map(readable).join(", ")}) -> ${readable(res)}`);
      return variants.length === 1 ?
        variants[0] :
        `(${variants.join(", ")})`;
    case AND: return `(${type.types.map(readable).join(" & ")})`;
    case OR: return `(${type.types.map(readable).join(" | ")})`;
    default: return "";
  }
}

const tNone = {
  type: NONE
};

const tAny = {
  type: ANY
};

const tUndefined = {
  type: UNDEFINED
};

const tNull = {
  type: NULL
};

function tBoolean(value) {
  return {
    type: BOOLEAN,
    value
  };
}
tBoolean.type = BOOLEAN;

function tNumber(value) {
  return {
    type: NUMBER,
    value
  };
}
tNumber.type = NUMBER;

function tString(value) {
  return {
    type: STRING,
    value
  };
}
tString.type = STRING;

function tFunction(...variants) {
  variants = variants.map(({ args, res, fn, readable }) => ({
    args,
    res,
    fn(..._args) {
      if (_args.length !== args.length) {
        return undefined;
      }
      for (let i = 0; i < _args.length; i++) {
        if (!cast(args[i], _args[i])) {
          return undefined;
        }
      }
      if (fn) {
        return fn(..._args);
      }
      else {
        return res;
      }
    },
    readable
  }));
  return {
    type: FUNCTION,
    variants
  };
}

function tFn(...args) {
  const res = args.pop();
  return tFunction({ args, res });
}

function tAnd(...types) {
  return {
    type: AND,
    types
  };
}

function tOr(...types) {
  return {
    type: OR,
    types
  };
}

module.exports = {
  cast: {
    type: tNone,
    value: cast
  },
  match: {
    type: tNone,
    value: match
  },
  readable: {
    type: tNone,
    value: readable
  },
  NONE: {
    type: tString,
    value: NONE
  },
  ANY: {
    type: tString,
    value: ANY
  },
  UNDEFINED: {
    type: tString,
    value: UNDEFINED
  },
  NULL: {
    type: tString,
    value: NULL
  },
  BOOLEAN: {
    type: tString,
    value: BOOLEAN
  },
  NUMBER: {
    type: tString,
    value: NUMBER
  },
  STRING: {
    type: tString,
    value: STRING
  },
  FUNCTION: {
    type: tString,
    value: FUNCTION
  },
  AND: {
    type: tString,
    value: AND
  },
  OR: {
    type: tString,
    value: OR
  },
  tNone: {
    type: tNone,
    value: tNone
  },
  tAny: {
    type: tNone,
    value: tAny
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
  },
  tFunction: {
    type: tNone,
    value: tFunction
  },
  tFn: {
    type: tNone,
    value: tFn
  },
  tAnd: {
    type: tNone,
    value: tAnd
  },
  tOr: {
    type: tNone,
    value: tOr
  }
};
