var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app.jsx',
        vendor: [
            'jquery', 'q', 'classnames',
            'react', 'react-dom', 'reflux', 'reflux-promise', 'react-router'
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
            { test: /\.less$/, loader: 'style!css!less' }
        ]
    }
};