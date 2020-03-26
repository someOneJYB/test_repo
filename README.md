### 不要再 babel7 中配置 @babel/present-typescript 和 @babel/present-react 一起使用会导致 react 无法被解析，所以在 webpack 中针对 typescript 使用 ts-loader 解析。
### 配置过程大致顺利，只有 img 图片的 publicPath 设置的有问题导致影响整个打包出来引用的资源路径出现问题。
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```
webpack4 对于动态引入的文件会按照按需加载分别打包，提升效率。
