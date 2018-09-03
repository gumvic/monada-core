const types = require("./src/types");
const native = require("./src/native");
const data = require("./src/data");

module.exports = {
  $monada: true,
  ...types,
  ...native,
  ...data
};
