const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //开启多核压缩
const OptmizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const os = require('os');
module.exports = {
    mode: 'production',
    devtool: 'hidden-source-map',
    optimization: {
        // usedExports: true,
        splitChunks: {
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
            cacheGroups: {
                vendors: { // 项目基本框架等
                    chunks: 'all',
                    test: /antd/,
                    priority: 100,
                    name: 'vendors',
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                parallel: os.cpus().length,
                cache: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                    },
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false,
                    }
                }
            }),
            new OptmizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    safe: true,
                    discardComments: {
                        removeAll: true
                    }
                }
            })
        ],

    },
    plugins: [new CleanWebpackPlugin()]
}
