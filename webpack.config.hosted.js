const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const outputDirectory = "dist";

//const HOST = process.env.HOST || '0.0.0.0';

const HOST = "0.0.0.0";

module.exports = {
	entry: ["babel-polyfill", "./client/index.js"],
	output: {
		pathinfo: true,
		path: path.join(__dirname, outputDirectory),
		filename: "bundle.js",
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: "url-loader?limit=100000"
			}
		]
	},
	devServer: {
		disableHostCheck: true,
		port: 8000,
		open: false,
		hot: true,
		historyApiFallback: true,
		stats: {
			colors: true
		},
		proxy: {
			"/api": {
				target: "http://localhost:9000",
				secure: false
			}
		}
	},
	plugins: [
		new UglifyJSPlugin(), // minify the chunk
		new CleanWebpackPlugin([outputDirectory]),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			favicon: "./public/favicon.ico"
		})
	]
};
