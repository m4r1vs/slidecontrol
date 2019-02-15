const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = () => ({
	target: "node",
	entry: './server.js',
	output: {
		filename: 'server.bundle.js',
		path: path.resolve(__dirname, 'build')
	},
	externals: [nodeExternals()]
})