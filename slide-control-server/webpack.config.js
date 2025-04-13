const path = require("path");
const ExtendedAPIPlugin = require("webpack").ExtendedAPIPlugin;

module.exports = () => ({
  target: "node",
  entry: path.resolve(__dirname, "server.js"),
  output: {
    filename: "server.bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [new ExtendedAPIPlugin()],
  node: {
    __dirname: false,
  },
});
