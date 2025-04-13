const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => ({
  entry: "./content.js",
  output: {
    filename: "content.min.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV_MODE: argv.mode === "development",
    }),
    new CopyWebpackPlugin([
      "./images/*",
      "./manifest.json",
      "./options.html",
      "./options.js",
      "./background.js",
      "./lib/*",
    ]),
  ],
});
