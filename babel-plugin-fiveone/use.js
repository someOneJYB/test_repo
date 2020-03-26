const babel = require('@babel/core')

const code = `
    var html = <div>
        <h1>good good study, day day up</h1>
    </div>
`

const visitor = {
    VariableDeclarator(path) {
        if (path.node.init.type === 'JSXElement'){
            console.log('start')
            // deal
        }
    }
}

const result = babel.transform(code, {
    plugins: [
        '@babel/plugin-syntax-jsx',
        {
            visitor: visitor
        }
    ]
})

console.log(result.code)
