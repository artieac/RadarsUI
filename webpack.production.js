const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin")

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ]
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /en/
        )
    ]
});