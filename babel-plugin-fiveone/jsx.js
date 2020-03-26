const babel = require('@babel/core')
var t = require('@babel/types');
function buildAttrsCall (attribs){
    let properties = [];
    attribs.forEach(attr => {
        let name = attr.name.name;
        let value = attr.value;
        properties.push(t.objectProperty(t.stringLiteral(name), value))
    });
    return t.ObjectExpression(properties);
}
const createVisitor = () => {
    const visitor = {};
    visitor.JSXElement = function(path, file) {
        console.log('exit func', path)
        let openingPath = path.get("openingElement");
        let children = t.react.buildChildren(openingPath.parent);
        console.log(children)
        let tagNode = t.identifier(openingPath.node.name.name);
        // 创建React.createElement 了解 React.createElement 的 babel 解析
        let createElement =  t.memberExpression(t.identifier("React"),t.identifier("createElement"));
        // 创建属性
        let attribs = buildAttrsCall(openingPath.node.attributes, t);
        // 创建React.createElement(tag, attrs, ...chidren)表达式
        let callExpr = t.callExpression(createElement, [tagNode, attribs, ...children]);
        path.replaceWith(t.inherits(callExpr, path.node));
    }
    return {
        visitor,
        // // 配置jsx解析器
        inherits:() => {
            return {
                manipulateOptions(opts, parserOpts) {
                    parserOpts.plugins.push("jsx");
                }
            };

        }
    }
}
// visitor.JSXElement = {
//     // 为什么是exit，因为jsx是DFS而不是BFS;因为要先创建最里面的jsx然后是外面的依次从里到外所以在 exit 里面解析 node
//     exit(path, file){
//         console.log('exit')
//         let openingPath = path.get("openingElement");
//         let children = t.react.buildChildren(openingPath.parent);
//         let tagNode = t.identifier(openingPath.node.name.name);
//         // 创建React.createElement
//         let createElement =  t.memberExpression(t.identifier("React"),t.identifier("createElement"));
//         // 创建属性
//         let attribs = buildAttrsCall(openingPath.node.attributes, t);
//         // 创建React.createElement(tag, attrs, ...chidren)表达式
//         let callExpr = t.callExpression(createElement, [tagNode, attribs, ...children]);
//         path.replaceWith(t.inherits(callExpr, path.node));
//     }
// }
// visitor.Program = function (path, state) {
//     enter(path, state) {
//
//     },
//     exit: (path, state) {
//         console.log('exit')
//     },
//     // console.log(file, id)
//     // for (var _iterator = file.ast.comments, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
//     //     var _ref2;
//     //
//     //     if (_isArray) {
//     //         if (_i >= _iterator.length) break;
//     //         _ref2 = _iterator[_i++];
//     //     } else {
//     //         _i = _iterator.next();
//     //         if (_i.done) break;
//     //         _ref2 = _i.value;
//     //     }
//     //
//     //     var comment = _ref2;
//     //
//     //     var matches = JSX_ANNOTATION_REGEX.exec(comment.value);
//     //     if (matches) {
//     //         id = matches[1];
//     //         if (id === "React.DOM") {
//     //             throw file.buildCodeFrameError(comment, "The @jsx React.DOM pragma has been deprecated as of React 0.12");
//     //         } else {
//     //             break;
//     //         }
//     //     }
//     // }
//     //
//     // state.set("jsxIdentifier", function () {
//     //     return id.split(".").map(function (name) {
//     //         return t.identifier(name);
//     //     }).reduce(function (object, property) {
//     //         return t.memberExpression(object, property);
//     //     });
//     // });
// };
module.exports = function(babel){
    return createVisitor();
}

const code = `
    var html = <div className="huhu">
    <h1>1</h1>
    </div>
`

const result = babel.transform(code, {
    plugins: [
         '@babel/plugin-syntax-jsx',
        {
            visitor: createVisitor().visitor
        }
    ]
})

console.log(result.code)
