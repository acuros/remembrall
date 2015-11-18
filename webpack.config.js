var path = require('path');
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
        root: path.join(__dirname, 'src')
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new webpack.DefinePlugin({
            FB_APP_ID: JSON.stringify('__FB_APP_ID__'),
            ROLE_ARN: JSON.stringify('__ROLE_ARN__')
        })
    ],
    module: {
        loaders: [
            { test: /\.jsx$/, loader: 'jsx' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.less$/, loader: 'style!css!less' }
        ]
    }
};
