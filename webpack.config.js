var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app.jsx',
        vendor: ['jquery', 'react', 'react-dom', 'reflux', 'reflux-promise', 'q']
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        root: __dirname + '\\src'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
    ],
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx' },
            { test: /\.css$/, loader: 'style!css' }
        ]
    }
};