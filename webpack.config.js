// webpack --optimize-occurrence-order --optimize-dedupe
// npm run-script dev

var webpack = require('webpack');
var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./app.js",
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
            }

        },{
            test: /\.less$/,
            loader: "style!css!less"
        },{
            test: /.*\/public\/.*\.js$/,
            loader: "uglify"
        },{ 
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, 
            loader: "file" 
        }]
    },
    'uglify-loader': {
        mangle: false
    },
    output: {
        path: __dirname + "/public/",
        filename: "app.min.js"
    },
    plugins: debug ? [] : [
        new webpack.optimize.CommonsChunkPlugin("src/vendor","vendor.bundle.js"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin("styles.css", {allChunks: true}),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
};