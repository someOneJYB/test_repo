'use strict';

const path = require('path');
const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = require('./env');
const utils = require('./utils');

const DEV_MODE = config.isDevMode();
const APP_PATH = utils.APP_PATH;
console.log('webpack', utils.resolve('server/app'))
const webpackConfig = {
  entry: {
    app: utils.resolve('server/app'),
  },
  output: {
    path: utils.resolve('dist/node'),
    filename: `[name]${DEV_MODE ? '' : '.min'}.js`,
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    // modules: [
    //   APP_PATH,
    //   'node_modules',
    // ],
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: DEV_MODE,
      minimize: !DEV_MODE,
      options: {
        context: APP_PATH,
      },
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   // names: ['vendors', 'manifest'],
    //   names: ['manifest'],
    //   minChunks: Infinity
    // }),
  ],
};

if (!DEV_MODE) {
  webpackConfig.plugins.push(new MinifyPlugin({}, {}));
}

module.exports = webpackConfig;
