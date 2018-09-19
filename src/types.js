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

function castType(to, from) {
  if (to.type === NONE ||
      from.type === NONE) {
    return true;
  }
  else if (to.type === ANY) {
    return true;
  }
  else if (to.type === AND) {
    for (let _to of to.types) {
      if (!castType(_to, from)) {
        return false;
      }
    }
    return true;
  }
  else if (from.type === AND) {
    for (let _from of from.types) {
      if (castType(to, _from)) {
        return true;
      }
    }
    return false;
  }
  else if (to.type === OR) {
    for (let _to of to.types) {
      if (castType(_to, from)) {
        return true;
      }
    }
    return false;
  }
  else if (from.type === OR) {
    for (let _from of from.types) {
      if (!castType(to, _from)) {
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
    const fromRes = from.fn(...to.args);
    return fromRes && castType(to.res, fromRes);
  }
  else {
    return false;
  }
}

// TODO better name
function matchType(type, value) {
  switch(type.type) {
    case NONE: return true;
    case ANY: return true;
    case UNDEFINED: return value === undefined;
    case NULL: return value === null;
    case BOOLEAN: return type.value ? type.value === value : typeof value === "boolean";
    case NUMBER: return type.value ? type.value === value : typeof value === "number";
    case STRING: return type.value ? type.value === value : typeof value === "string";
    // TODO typeof value === "function" -- and that's all?
    case FUNCTION: return typeof value === "function";
    case AND:
      for (let _type of type.types) {
        if (!match(_type, value)) {
          return false;
        }
      }
      return true;
    case OR:
      for (let _type of type.types) {
        if (match(_type, value)) {
          return true;
        }
      }
      return false;
    default: return false;
  }
}

const typeNone = {
  type: NONE,
  toString() {
    return "?";
  }
};

function isTypeNone({ type }) {
  return type === NONE;
}

const typeAny = {
  type: ANY,
  toString() {
    return "*";
  }
};

function isTypeAny({ type }) {
  return type === ANY;
}

const typeUndefined = {
  type: UNDEFINED,
  toString() {
    return "undefined";
  }
};

function isTypeUndefined({ type }) {
  return type === UNDEFINED;
}

const typeNull = {
  type: NULL,
  toString() {
    return "null";
  }
};

function isTypeNull({ type }) {
  return type === NULL;
}

function typeBoolean(value) {
  return {
    type: BOOLEAN,
    value,
    toString() {
      return value ? `boolean(${value})` : "boolean";
    }
  };
}
typeBoolean.type = BOOLEAN;
typeBoolean.toString = () => "boolean";

function isTypeBoolean({ type }) {
  return type === BOOLEAN;
}

function typeNumber(value) {
  return {
    type: NUMBER,
    value,
    toString() {
      return value ? `number(${value})` : "number";
    }
  };
}
typeNumber.type = NUMBER;
typeNumber.toString = () => "number";

function isTypeNumber({ type }) {
  return type === NUMBER;
}

function typeString(value) {
  return {
    type: STRING,
    value,
    toString() {
      return value ? `string(${value})` : "string";
    }
  };
}
typeString.type = STRING;
typeString.toString = () => "string";

function isTypeString({ type }) {
  return type === STRING;
}

function typeFunction(args, res, fn, readable) {
  fn = fn || ((..._) => res);
  return {
    type: FUNCTION,
    args,
    res,
    fn(..._args) {
      if (_args.length !== args.length) {
        return undefined;
      }
      for (let i = 0; i < _args.length; i++) {
        if (!castType(args[i], _args[i])) {
          return undefined;
        }
      }
      return fn(..._args);
    },
    toString() {
      return readable || `fn(${args.join(", ")}) -> ${res}`;
    }
  };
}
// TODO typeFunction should represent any function?
// or simply let cast deal with the fact that args/res/fn might be empty, like for typeNumber a value might be empty?
//typeFunction.type = FUNCTION;
//typeFunction.args = ?
//typeFunction.res = typeNone;
//typeFunction.fn = (..._) => typeNone;

function isTypeFunction({ type }) {
  return type === FUNCTION;
}

function typeAnd(...types) {
  return {
    type: AND,
    types,
    toString() {
      return `(${types.map(readable).join(" & ")})`;
    }
  };
}

function isTypeAnd({ type }) {
  return type === AND;
}

function typeOr(...types) {
  return {
    type: OR,
    types,
    toString() {
      return `(${types.map(readable).join(" | ")})`;
    }
  };
}

function isTypeOr({ type }) {
  return type === OR;
}

module.exports = {
  "cast-type": {
    type: typeNone,
    value: castType
  },
  "match-type": {
    type: typeNone,
    value: matchType
  },
  "type-none?": {
    type: typeNone,
    value: isTypeNone
  },
  "type-any?": {
    type: typeNone,
    value: isTypeAny
  },
  "type-undefined?": {
    type: typeNone,
    value: isTypeUndefined
  },
  "type-null?": {
    type: typeNone,
    value: isTypeNull
  },
  "type-boolean?": {
    type: typeNone,
    value: isTypeBoolean
  },
  "type-number?": {
    type: typeNone,
    value: isTypeNumber
  },
  "type-string?": {
    type: typeNone,
    value: isTypeString
  },
  "type-function?": {
    type: typeNone,
    value: isTypeFunction
  },
  "type-and?": {
    type: typeNone,
    value: isTypeAnd
  },
  "type-or?": {
    type: typeNone,
    value: isTypeOr
  },
  "type-none": {
    type: typeNone,
    value: typeNone
  },
  "type-any": {
    type: typeNone,
    value: typeAny
  },
  "type-undefined": {
    type: typeNone,
    value: typeUndefined
  },
  "type-null": {
    type: typeNone,
    value: typeNull
  },
  "type-boolean": {
    type: typeNone,
    value: typeBoolean
  },
  "type-number": {
    type: typeNone,
    value: typeNumber
  },
  "type-string": {
    type: typeNone,
    value: typeString
  },
  "type-function": {
    type: typeNone,
    value: typeFunction
  },
  "type-and": {
    type: typeNone,
    value: typeAnd
  },
  "type-or": {
    type: typeNone,
    value: typeOr
  }
};
