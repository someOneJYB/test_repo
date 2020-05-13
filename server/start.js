const Router = require('koa-router');
const path = require('path')
const staticServer = require('koa-static')
const Koa = require('koa')
const render = require('./render.js').default
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

function initApp() {
    const app = new Koa()
    app.use(bodyParser());//解析Json或者form
    app.use(cors({credentials: true}));//跨域
    return app
}

function initAppMiddleware(app) {
    const router = new Router();
    app.use(router.routes()).use(router.allowedMethods());
    app.use(staticServer(path.resolve(__dirname, '../dist')));
    router.get('/', render);
    app.use(render);
}

// initHMR(app)
//接口
async function initHMR(app) {
    let HMRInitialized = false;
    console.info('文件热更新中');
    const koaWebpack = require('koa-webpack');
    const historyApiFallback = require('koa-history-api-fallback');
    const webpack = require('webpack');
    const webpackConfig = require('../config/webpack.config');
    const compiler = webpack(
        Object.assign({}, webpackConfig, {
            stats: {
                modules: false,
                colors: true,
            },
        })
    );
    return new Promise((resolve, reject) => {
        koaWebpack({
            compiler,
            hotClient: {
                port: 0,
                logLevel: 'error',
                hmr: true,
                reload: true,
            },
            devMiddleware: {
                index: 'index.html',
                publicPath: webpackConfig.output.publicPath,
                watchOptions: {
                    aggregateTimeout: 0,
                },
                writeToDisk: false,
                stats: {
                    modules: false,
                    colors: true,
                    children: false,
                },
            },
        }).then(middleware => {
            console.info('文件热更新结束', middleware);
            if (!HMRInitialized) {
                HMRInitialized = true;
                app.use(historyApiFallback());
                app.use(middleware);
                middleware.devMiddleware.waitUntilValid(resolve);
            }
        })
            .catch(err => {
                console.error('[koa-webpack]:', err);
                reject();
            });
    });
}

async function run() {
    const app = initApp();
    await initHMR(app);
    initAppMiddleware(app);
    return Promise.resolve(app);
}

function listen(app, port = 9344) {
    const server = app.listen(port, '0.0.0.0');
    console.log(`Koa listening on port ${port}`);
    return server;
}

module.exports = {
    listen,
    create: run
};

