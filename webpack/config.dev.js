const common = require("./config.common.js"),
  merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map"
});
