const webpack = require("webpack");
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const WebpackBar = require("webpackbar");
const CompressionPlugin = require("compression-webpack-plugin");
const CssCleanupPlugin = require("css-cleanup-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;

module.exports = function(env) {
	return {
		devtool: env === "production" ? "source-map" : "cheap-eval-source-map",
		entry: { main: ["babel-polyfill", "./client/index.js"] },
		mode: env === "development" ? "development" : "production",
		devServer: {
			disableHostCheck: true,
			open: false,
			hot: true,
			historyApiFallback: true,
			contentBase: path.join(__dirname, "../dist"),
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
		output: {
			filename:
				env === "production"
					? "[name].[chunkhash].bundle.js"
					: "[name].bundle.js",
			path: path.resolve(__dirname, "../dist")
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"]
						}
					}
				},
				{
					test: /.(sa|sc|c)ss$/,
					use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
				},
				{
					test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
					loader: "url-loader",
					options: {
						limit: 10000
					}
				}
			]
		},
		optimization: {
			runtimeChunk: true,
			splitChunks: { chunks: "all" }
		},
		plugins: [
			autoprefixer,
			new WebpackBar(),
			new CssCleanupPlugin(),
			new MiniCssExtractPlugin({
				filename: "[name].min.css"
			}),
			new CompressionPlugin({
				test: /\.(js|css)/
			}),
			new UglifyJSPlugin({ sourceMap: true }),
			new ExtractTextPlugin("'styles.[md5:contenthash:hex:20].css'"),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, "../public", "index.html")
			}),
			new CleanWebpackPlugin(["dist"]),
			new BundleAnalyzerPlugin()
		]
	};
};

/*
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");

module.exports = {
	mode: "development",
	context: path.resolve(__dirname),
	devtool: "source-map",
	devServer: {
		hot: true,
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 9000,
		noInfo: true,
		stats: "minimal"
	},
	entry: {
		app: "../client/index.js"
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist")
	},

	module: {
		rules: [
			{
				test: /\.js$/, // include .js files
				enforce: "pre", // preload the jshint loader
				exclude: /node_modules/, // exclude any and all files in the node_modules folder
				use: [
					{
						loader: "babel-loader",
						// more options in the optional jshint object
						//options: {}
							// ⬅ formally jshint property
						//	camelcase: true,
						//	emitErrors: false,
						//	failOnHint: false
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 2 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
						}
					},
					"postcss-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: "file-loader"
					}
				]
			}
		]
	},
	plugins: [
		new WebpackBar(),
		new CleanWebpackPlugin(["dist"]),
		new HtmlWebpackPlugin({
			title: "My killer app"
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};

const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./js/init.js",
	watch: true,
	output: {
		path: path.resolve(__dirname, "js"),
		filename: "init.min.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: [/node_modules/],
				query: {
					presets: ["es2015"],
					plugins: ["transform-object-assign", "transform-runtime"]
				}
			}
		],
		rules: [
			{
				test: /\.js$/, // include .js files
				enforce: "pre", // preload the jshint loader
				exclude: /node_modules/, // exclude any and all files in the node_modules folder
				use: [
					{
						loader: "jshint-loader"
					}
				]
			}
		]
	},
	jshint: {
		// any jshint option http://www.jshint.com/docs/options/
		// i. e.
		camelcase: true,

		// jshint errors are displayed by default as warnings
		// set emitErrors to true to display them as errors
		emitErrors: false,

		// jshint to not interrupt the compilation
		// if you want any file with jshint errors to fail
		// set failOnHint to true
		failOnHint: false,

		// custom reporter function
		reporter: function(errors) {}
	},
	stats: {
		colors: true
	}
	//devtool: 'source-map'
};

==========

module.exports = {
	entry: ["./global.js", "./app.js"],
	output: {
		filename: "bundle.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "jshint-loader"
			}
		],
		loaders: [
			{
				test: [/\.js$/, /\.es6$/],
				exclude: "node_modules",
				loader: "babel-loader"
			},
			{
				test: /\.es6$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					cacheDirectory: true,
					presets: ["react", "es2015"]
				}
			}
		]
	},
	resolve: {
		extensions: ["", ".js", ".es6"]
	}
};

==============

[
	{
		test: [/\.js$/, /\.es6$/],
		exclude: "node_modules",
		loader: "babel-loader"
	}
];

================

var WebpackStripLoader = require("strip-loader");
var devConfig = require("./webpack.config.js");
var stripLoader = {
	test: [/\.js$/, /\.es6$/],
	exclude: /node_modules/,
	loader: WebpackStripLoader.loader("console.log")
};
var reactLoader = {
	test: /\.es6$/,
	exclude: /node_modules/,
	loader: "babel-loader",
	query: {
		cacheDirectory: true,
		presets: ["react", "es2015"]
	}
};
devConfig.module.loaders.push(stripLoader);
devConfig.module.loaders.push(reactLoader);
module.exports = devConfig;

===================

module.exports = {
	entry: ["./global.js", "./app.js"],
	output: {
		filename: "bundle.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "jshint-loader"
			}
		],
		loaders: [
			{
				test: /\.es6$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					cacheDirectory: true,
					presets: ["react", "es2015"]
				}
			}
		]
	},
	resolve: {
		extensions: ["", ".js", ".es6"]
	}
};

==============

var WebpackStripLoader = require('strip-loader');
var devConfig = require('./webpack.config.js');
var stripLoader = {
 test: [/\.js$/, /\.es6$/],
 exclude: /node_modules/,
 loader: WebpackStripLoader.loader('console.log')
}
var reactLoader = {
	test: /\.es6$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					cacheDirectory: true,
					presets: ["react", "es2015"]
				}
}
devConfig.module.loaders.push(stripLoader);
devConfig.module.loaders.push(reactLoader);
module.exports = devConfig;

=================


const merge = require("webpack-merge");
const baseConfig = require("./base.config.js");
var ExtractTextPlugin = require("extract-text-webpack-plugin"),
	autoprefixer = require("autoprefixer"),
	precss = require("precss");

const CssCleanupPlugin = require("css-cleanup-webpack-plugin");

module.exports = {
	plugins: [new CssCleanupPlugin()]
};
module.exports = merge(baseConfig, {
	devtool: "eval-source-map",

	devServer: {
		inline: true,
		contentBase: "src",
		port: "3001"
	},

	module: {
		test: /\.css$/,
		use: [
			"style-loader",
			{
				loader: "css-loader",
				options: {
					importLoaders: 2 // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
				}
			},
			"postcss-loader",
			"sass-loader"
		]
	},

	plugins: [new CssCleanupPlugin()]
});

const webpack = require("webpack");
const WebpackBar = require("webpackbar");

module.exports = {
	context: path.resolve(__dirname),
	devtool: "source-map",
	entry: "./entry.js",
	output: {
		filename: "./output.js",
		path: path.resolve(__dirname)
	},
	plugins: [new WebpackBar()]
};
*/
