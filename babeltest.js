var babel = require('@babel/core');
var t = require('@babel/types');
const code = `import {uniq, extend, flatten, cloneDeep } from "lodash"`;
const code1 = `import uniq from "lodash/uniq"`;
const visitor = {
    ImportDeclaration(path, _ref = {opts:{}}){
        const specifiers = path.node.specifiers;
        const source = path.node.source;
        if(source.value.indexOf('lodash') === -1) return;
        if (!t.isImportDefaultSpecifier(specifiers[0]) ) {
            var declarations = specifiers.map((specifier, i) => {         //遍历  uniq extend flatten cloneDeep
                return t.ImportDeclaration(                               //创建importImportDeclaration节点
                    [t.importDefaultSpecifier(specifier.local)],
                    t.StringLiteral(`${source.value}/${specifier.local.name}`)
                )
            })
            path.replaceWithMultiple(declarations)

        }
    }
}

const result = babel.transform(code1, {
    plugins: [{
        visitor: visitor
    }]
})
console.log(result.code)
//
// module.exports = function (babel) {
//     return {
//         visitor
//     };
// }

