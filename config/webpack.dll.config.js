const webpack = require('webpack');
const path = require('path');
const lib = require('./libConfig/lib.dependencies');
const isDebug = process.env.NODE_ENV === 'development';
const publicPath = '../vendor/lib';

const outputPath = isDebug ? path.join(__dirname, `${publicPath}/debug`) : path.join(__dirname, `${publicPath}/min`);
let manifestPath = path.join(outputPath, 'manifest.json');


const plugin = [
    // 确保生产环境每次执行dll命令得到的是最新
    new webpack.DllPlugin({
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: manifestPath,
        /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可。
         */
        name: '[name]',
        context: __dirname
    }),
    // new webpack.DefinePlugin({
    //     'process.env.NODE_ENV': JSON.stringify('development')
    // }),
];

if (!isDebug) {
    plugin.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /(en-gb|zh-cn).js/
        )
    );
}
let config = {
    mode: isDebug ? 'development' : 'production',
    devtool: '#source-map',
    context: path.resolve(__dirname),
    entry: {
        lib,
    },
    output: {
        path: outputPath,
        filename: isDebug ? '[name].js' : '[name].[hash:9].js',
        library: '[name]'
    },
    plugins: plugin,

};


module.exports = config;
