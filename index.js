const types = require("./src/types");
const native = require("./src/native");
const data = require("./src/data");

module.exports = {
  $monada: {
    exports: {
      ...types.$monada.exports,
      ...native.$monada.exports,
      ...data.$monada.exports
    }
  },
  ...types,
  ...native,
  ...data
};
