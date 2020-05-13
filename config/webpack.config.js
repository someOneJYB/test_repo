const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge')
const argv = require('yargs-parser')(process.argv.slice(2));
const mode = argv.mode || 'development';
const mergeConfig = require(`./webpack.${mode}.js`);
const LoadablePlugin = require('@loadable/webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const dirname = process.cwd();
const isDebug = (process.env.NODE_ENV === 'development');
const manifestPath = isDebug ? '../vendor/lib/debug/manifest.json' :
    '../vendor/lib/min/manifest.json';
const libPath = isDebug ? '../vendor/lib/debug/*.js' :
    '../vendor/lib/min/*.js';
const publicPath = '/';
const baseConfig = {
    isHash: true,
    publicPath: publicPath,
    outPath: './dist/',
    publicLibPath: publicPath + 'lib/min',
    outLibPath: 'lib/min',
    clean: 'dist',
};
const commonConfig = {
    // resolveLoader: {
    //     modules: [path.resolve(__dirname, '../loaders'), 'node_modules']
    // },
    entry: [path.resolve(dirname, 'src/index.js')],
    output: {
        path: path.resolve(dirname, 'dist'),
        filename: '[name].bundle.[hash:8].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(dirname, 'public/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require(manifestPath),
            },

        ),
        new AddAssetHtmlPlugin([
            {
                filepath: path.resolve(__dirname, libPath),
                outputPath: baseConfig.outLibPath,
                publicPath: baseConfig.publicLibPath,
                includeSourcemap: false
            }
        ]),
        new SpriteLoaderPlugin({ plainSprite: true }),
        new LoadablePlugin({
            filename: 'loadable-stats.json',
            writeToDisk: {
                filename: path.join(__dirname, '..', 'dist'),
            },
        }),
    ],
    resolve: {
        extensions: ['.js', ".ts", ".tsx", '.jsx']
    },
    module: {
        rules: [
            // {
            //     enforce: "pre",
            //     test: /\.jsx?$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader'
            // },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [ {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                }],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                }],
            },
            {
                test: /\.css/,
                use: [{ loader: MiniCssExtractPlugin.loader}, 'css-loader', 'postcss-loader'],
                exclude: /node_modules/,
                include: path.resolve(dirname, 'src')
            },
            {
                test: /\.less/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'postcss-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(dirname, 'src')
            },
            {
                test: /\.svg$/,//(png|jpg|gif|svg)
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: '[name]',
                    name: '[name]'
                },
                include: [path.resolve(__dirname, '../src/svg')]
            },
            // {
            //     test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 name: 'images/[name]-[hash:5].min.[ext]'
            //             },
            //         }
            //     ],
            //     exclude: [path.resolve(__dirname, '../src/svg')]
            // },
            {
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 7500,
                            name: 'images/[name]-[hash:5].min.[ext]'
                        },
                    }
                ],
                exclude: [path.resolve(__dirname, '../src/svg')]
            }
        ]
    }
}
module.exports = merge(commonConfig, mergeConfig)
