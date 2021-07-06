const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
	build: path.resolve(__dirname, '../build'),
	src: path.resolve(__dirname, '../src'),
	js: path.resolve(__dirname, '../src/assets/scripts'),
};

const foldersToErase = ['dist'];

if (process.env.NODE_CLEAN) foldersToErase.push('build');

module.exports = {
	mode: 'production',
	stats: {
		assets: false,
		colors: true,
		version: false,
		hash: true,
		timings: true,
		chunks: false,
		chunkModules: false,
	},
	entry: [
		'@babel/polyfill',
		path.join(PATHS.js, 'main.js'),
	],
	output: {
		path: path.join(PATHS.build),
		filename: 'js/main.js',
	},
	plugins: [
		new CleanWebpackPlugin(
			foldersToErase,
			{
				root: path.resolve(__dirname, '..'),
				verbose: true,
			},
		),
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
				test: /\.jsx?$/,
				use: 'eslint-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
				}],
			},
			{
				test: /\.pug$/,
				use: ['pug-loader'],
			},
			{
				test: /\.(css|styl)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: path.resolve(__dirname, 'postcss.config.prod.js'),
							},
						},
					},
					'stylus-loader',
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
		extensions: ['.js', '.jsx'],
	},
};
