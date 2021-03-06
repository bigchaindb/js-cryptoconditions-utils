/* eslint-disable strict, no-console, object-shorthand */
/* eslint-disable import/no-extraneous-dependencies, import/newline-after-import */
'use strict';

const path = require('path');

const webpack = require('webpack');
const combineLoaders = require('webpack-combine-loaders');

const PRODUCTION = process.env.NODE_ENV === 'production';

const PATHS = {
    CC_UTILS: path.resolve(__dirname, 'src/index.js'),

    BUILD: path.resolve(__dirname, 'build'),
    BUNDLE: path.resolve(__dirname, 'bundle'),
    NODE_MODULES: path.resolve(__dirname, 'node_modules'),
};

/** EXTERNAL DEFINITIONS INJECTED INTO APP **/
const DEFINITIONS = {
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    },
};


/** PLUGINS **/
const PLUGINS = [
    new webpack.DefinePlugin(DEFINITIONS),
    new webpack.NoErrorsPlugin(),
];

const PROD_PLUGINS = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        output: {
            comments: false
        },
        sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
        debug: false,
        minimize: true
    }),
];


if (PRODUCTION) {
    PLUGINS.push(...PROD_PLUGINS);
}


/** LOADERS **/
const JS_LOADER = combineLoaders([
    {
        loader: 'babel',
        query: {
            cacheDirectory: true,
        },
    },
]);


const LOADERS = [
    {
        test: /\.jsx?$/,
        exclude: [PATHS.NODE_MODULES],
        loader: JS_LOADER,
    },
];


/** EXPORTED WEBPACK CONFIG **/
module.exports = {
    entry: PATHS.CC_UTILS,

    output: {
        filename: PRODUCTION ? 'bundle.min.js' : 'bundle.js',
        library: 'cryptoconditions-utils',
        libraryTarget: 'umd',
        path: PRODUCTION ? PATHS.BUNDLE : PATHS.BUILD,
    },

    debug: !PRODUCTION,

    devtool: PRODUCTION ? '#source-map' : '#inline-source-map',

    resolve: {
        extensions: ['', '.js', '.jsx'],
        modules: ['node_modules'], // Don't use absolute path here to allow recursive matching
    },

    plugins: PLUGINS,

    module: {
        loaders: LOADERS,
    },
};
