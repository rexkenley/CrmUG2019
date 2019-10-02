const dev = require("./config.dev.js"),
  merge = require("webpack-merge");

module.exports = merge(dev, {
  output: {
    libraryTarget: "this"
  }
});
