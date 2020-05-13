require('@babel/polyfill')
require('ignore-styles')
require('@babel/register')({
    ignore: [/(build|node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react']
});
const app = require('./start');
//
// /**
//  * Initialize koa app and start server
//  */
(async () => {
    app.listen(await app.create());
})();
// require('./start');
