const path = require('path');
const dirname = process.cwd();
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        host: '127.0.0.1',  // 我们可以允许我们用任意方式进行访问（127.0.0.1，localhost, 本机ip）
        port: '8888',
        contentBase: path.resolve(dirname, 'dist'),
        hot: true,
        open: true,
        historyApiFallback: true,
    },
}
