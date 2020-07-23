##### 在经常变化的hook中保持函数的不变性，让依赖函数的子组件不随意渲染
```js
const fn = useMemoFn((args)=>console.log(...args), 13, 14);
// 传递给子组件
```
