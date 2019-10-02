const prd = require("./config.prd.js"),
  merge = require("webpack-merge");

module.exports = merge(prd, {
  output: {
    libraryTarget: "this"
  }
});
