var webpack = require('webpack');
var config = require('./config');
var path = require('path');

module.exports = {
    entry: {
        CommentThreadApp: './client/CommentThreadApp.jsx',
        PostsApp: './client/PostsApp.jsx',
        SubpyFiller: './client/SubpyFiller.jsx',
        vendors: ['react']
    },
    output: {
        path: './client/build',
        publicPath: 'http://localhost:9090/assets/',
        filename: '[name].bundle.js'
    },
    plugin: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js')
    ],
    module: {
        loaders: [
            { test: /\.jsx$/, loaders: ['jsx-loader'] }
        ]
    },
    devServer: {
        port: config.webpackServerPort
    }
};
