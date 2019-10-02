const webpack = require("webpack"),
  { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            [
              "@babel/preset-env",
              { targets: { chrome: "70", firefox: "63", edge: "17", ie: "11" } }
            ],
            "@babel/preset-react"
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-transform-runtime"
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new BundleAnalyzerPlugin({ analyzerMode: "static" })
  ]
};
