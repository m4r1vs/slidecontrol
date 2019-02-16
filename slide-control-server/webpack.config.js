const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ExtendedAPIPlugin = require('webpack').ExtendedAPIPlugin

module.exports = () => ({
	target: "node",
	entry: './server.js',
	output: {
		filename: 'server.bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	plugins: [
		new ExtendedAPIPlugin()
	],
	externals: [nodeExternals()]
})