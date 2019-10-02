const common = require("./config.common.js"),
  merge = require("webpack-merge"),
  path = require("path");

module.exports = merge(common, {
  mode: "production",
  devtool: false
});
