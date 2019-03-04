const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: { main: ["babel-polyfill", "./client/index.js"] },
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "[name].[hash].js"
	},
	devServer: {
		disableHostCheck: true,
		open: false,
		hot: true,
		historyApiFallback: true,
		contentBase: path.join(__dirname, "./dist"),
		compress: true,
		port: 3000,
		noInfo: true,
		stats: {
			minimal: true,
			colors: true
		},
		proxy: {
			"/api": {
				target: "https://localhost/",
				secure: false
			}
		}
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
				test: /.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin("dist", {}),
		new HtmlWebpackPlugin({
			inject: false,
			hash: true,
			template: "./public/index.html",
			filename: "index.html"
		}),
		new WebpackMd5Hash()
	]
};
