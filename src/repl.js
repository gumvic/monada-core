const {
  "type-none": { value: typeNone }
} = require("./types");

function symbolFullName(name) {
  return `${global.$monada.currentModuleName}/${name}`;
}

function define(name, data) {
  name = symbolFullName(name);
  const oldData = symbols.byName[name] || {};
  const newData = { ...oldData, data };
  global.$monada.symbols.byName[name] = newData;
  global[namify(name)] = newData.value;
}

function defined(name) {
  name = symbolFullName(name);
  return global.$monada.symbols.byName[name];
}

// TODO can't have nested modules with this approach using just one previousModuleName variable
let previousModuleName;
function beginModule(name) {
  previousModuleName = global.$monada.currentModuleName;
  global.$monada.currentModuleName = name;
}

function endModule() {
  global.$monada.currentModuleName = previousModuleName;
  previousModuleName = undefined;
}

function init() {
  global.$monada = {
    currentModuleName: "core",
    symbols: {
      byName: {}
    }
  };
}

module.exports = {
  "define": {
    type: typeNone,
    value: define
  },
  "defined": {
    type: typeNone,
    value: defined
  },
  "begin-module": {
    type: typeNone,
    value: beginModule
  },
  "end-module": {
    type: typeNone,
    value: endModule
  },
  "init": {
    type: typeNone,
    value: init
  }
};
