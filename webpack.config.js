var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app.jsx',
        vendor: [
            'jquery', 'q', 'classnames', 'underscore',
            'react', 'react-dom', 'reflux', 'reflux-promise', 'react-router', 'react-loading',
            './src/utils/aws-sdk.js'
        ]
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.less'],
        root: __dirname + '\\src'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ],
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.less$/, loader: 'style!css!less' }
        ]
    }
};