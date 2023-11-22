const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
    target: 'web',
    entry: {
		AdminApp: './src/react/Apps/AdminApp/index.js',
		ManageRadarsApp: './src/react/Apps/ManageRadarsApp/index.js',
        MainSiteApp: './src/react/Apps/MainSiteApp/index.js'
	},
	output: {
		filename: '[name].js',
//		path: path.resolve(__dirname, './src/static/script/dist')
		path: path.resolve(__dirname, './target/classes/static/script/dist'),
	},
    module: {
        rules: [
           {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
           },
           {
                test: /\.js$/,
                use: [
                    {
                         loader: "babel-loader",
                         options: {
                            plugins: ['lodash'],
                            presets: [['@babel/env', { 'targets': { 'node': 6}}]]
                         }
                     }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [ 'autoprefixer', {}, ],
                                ],
                            },
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
//        new BundleAnalyzerPlugin()
    ],
	resolve: {
		extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.less', '.css'],
        alias: {
          Apps: path.resolve(__dirname, './src/react/Apps'),
          SharedComponents: path.resolve(__dirname, './src/react/components'),
          Repositories: path.resolve(__dirname, './src/react/Repositories'),
          Redux: path.resolve(__dirname, './src/react/redux'),
          CSS: path.resolve(__dirname, './src/main/resources/static/css'),
        }
	},
};