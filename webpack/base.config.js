const webpack = require("webpack");

module.exports = {
	entry: {
		app: "./client"
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},

	plugins: [new webpack.EnvironmentPlugin(["NODE_ENV"])]
};
