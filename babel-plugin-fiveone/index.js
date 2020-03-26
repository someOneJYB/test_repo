module.exports = function ({ types: t }) {
    return {
        visitor: {
            // 对import转码
            ImportDeclaration(path, _ref = {opts: {}}) {
                const specifiers = path.node.specifiers;
                const source = path.node.source;
                if (source.value.indexOf('lodash') === -1) return
                if (!t.isImportDefaultSpecifier(specifiers[0]) && !t.isImportNamespaceSpecifier(specifiers[0])) {
                    var declarations = specifiers.map((specifier) => {      //遍历  uniq extend flatten cloneDeep
                        return t.ImportDeclaration(                         //创建importImportDeclaration节点
                            [t.importDefaultSpecifier(specifier.local)],
                            t.StringLiteral(`${source.value}/${specifier.local.name}`)
                        )
                    })
                    path.replaceWithMultiple(declarations)

                }
            }

        }
    }
}

