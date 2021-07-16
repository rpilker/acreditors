const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HelloWorldPlugin = require('test_plugin');

const PATHS = {
	build: path.resolve(__dirname, '../build'),
	src: path.resolve(__dirname, '../src'),
	js: path.resolve(__dirname, '../src/assets/scripts'),
};

module.exports = {
	devServer: {
		port: 3000,
		hot: true,
		inline: true,
		open: true,
		overlay: true,
		host: '0.0.0.0',
	},
	mode: process.env.NODE_ENV || 'development',
	devtool: 'source-map',
	stats: {
		assets: false,
		colors: true,
		version: false,
		hash: true,
		timings: true,
	},
	entry: [
		// '@babel/polyfill',
		path.join(PATHS.js, 'main.js'),
	],
	output: {
		path: path.join(PATHS.build),
		filename: 'js/main.js',
	},
	plugins: [
		// new HelloWorldPlugin({ options: true }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlPlugin({
			template: path.join(PATHS.src, 'templates/pages/index.pug'),
			env: process.env.NODE_ENV,
			baseURL: process.env.npm_package_config_baseURL,
			title: process.env.npm_package_config_name,
			date: process.env.npm_package_config_date,
			section: process.env.npm_package_config_section,
			sectionSlug: process.env.npm_package_config_sectionSlug,
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		}),
		new CopyWebpackPlugin([
			{
				from: path.join(PATHS.src, 'assets/images'),
				to: 'images',
				ignore: ['.gitkeep'],
			},
			{
				from: path.join(PATHS.src, 'assets/json'),
				to: 'json',
				ignore: ['.gitkeep'],
			},
			{
				from: path.join(PATHS.src, '../others/**/*'),
				to: '[path][name].[ext]',
				ignore: ['.gitkeep'],
			},
		]),
	],
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				use: 'eslint-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'esbuild-loader',
					options: {
						target: 'es2015',
					},
				}],
			},
			{
				test: /\.pug$/,
				use: ['simple-pug-loader'],
			},
			{
				test: /\.(css|styl)$/,
				use: [
					'css-hot-loader?fileMap=./css/{fileName}',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: path.resolve(__dirname, 'postcss.config.js'),
							},
							sourceMap: true,
						},
					},
					{
						loader: 'stylus-loader',
						options: { sourceMap: true },
					},
				],
			},
			{
				test: /\.(png|gif|jpg|jpeg|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '../images/[name].[ext]',
						},
					},
				],
			},
			{
				test: /\.(json|geojson)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '../json/[name].[ext]',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.js'],
	},
};
