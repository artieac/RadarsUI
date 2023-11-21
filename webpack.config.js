const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: {
		AdminApp: './src/main/resources/code/react/Apps/AdminApp/index.js',
		ManageRadarsApp: './src/main/resources/code/react/Apps/ManageRadarsApp/index.js',
		RadarApp: './src/main/resources/code/react/Apps/RadarApp/index.js'
	},
	output: {
		filename: '[name].js',
//		path: path.resolve(__dirname, './static/script/dist')
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
                    { loader: "babel-loader" }
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
	resolve: {
		extensions: ['*', '.tsx', '.js', '.jsx', '.less', '.css'],
        alias: {
          Apps: path.resolve(__dirname, 'src/main/resources/code/react/Apps'),
          SharedComponents: path.resolve(__dirname, 'src/main/resources/code/react/components'),
          Repositories: path.resolve(__dirname, 'src/main/resources/code/react/repositories'),
          Redux: path.resolve(__dirname, 'src/main/resources/code/react/redux'),
          CSS: path.resolve(__dirname, 'src/main/resources/static/css'),
          MainSite: path.resolve(__dirname, 'src/main/resources/code/react/apps/MainSite'),
        }
	},
};