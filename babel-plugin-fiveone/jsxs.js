const babel = require('@babel/core')
var t = require('@babel/types');
const options = {}
const THROW_IF_NAMESPACE =
    options.throwIfNamespace === undefined ? true : !!options.throwIfNamespace;

const PRAGMA_DEFAULT = options.pragma || "React.createElement";
const PRAGMA_FRAG_DEFAULT = options.pragmaFrag || "React.Fragment";

const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
const JSX_FRAG_ANNOTATION_REGEX = /\*?\s*@jsxFrag\s+([^\s]+)/;
const d = (api) => {
    // returns a closure that returns an identifier or memberExpression node
    // based on the given id
    const createIdentifierParser = (id) => () => {
        return id
            .split(".")
            .map(name => t.identifier(name))
            .reduce((object, property) => t.memberExpression(object, property));
    };

    const visitor = {}

    visitor.Program = {
        enter(path, state) {
            const { file } = state;

            let pragma = PRAGMA_DEFAULT;
            let pragmaFrag = PRAGMA_FRAG_DEFAULT;
            let pragmaSet = !!options.pragma;
            let pragmaFragSet = !!options.pragmaFrag;

            if (file.ast.comments) {
                for (const comment of (file.ast.comments)) {
                    const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                    if (jsxMatches) {
                        pragma = jsxMatches[1];
                        pragmaSet = true;
                    }
                    const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);
                    if (jsxFragMatches) {
                        pragmaFrag = jsxFragMatches[1];
                        pragmaFragSet = true;
                    }
                }
            }
console.log(pragma)
            state.set("jsxIdentifier", createIdentifierParser(pragma));
            state.set("jsxFragIdentifier", createIdentifierParser(pragmaFrag));
            state.set("usedFragment", false);
            state.set("pragmaSet", pragmaSet);
            state.set("pragmaFragSet", pragmaFragSet);
        },
        exit(path, state) {
            if (
                state.get("pragmaSet") &&
                state.get("usedFragment") &&
                !state.get("pragmaFragSet")
            ) {
                throw new Error(
                    "transform-react-jsx: pragma has been set but " +
                    "pragmaFrag has not been set",
                );
            }
        },
    };

    visitor.JSXAttribute = function(path) {
        console.log('path')
        if (t.isJSXElement(path.node.value)) {
            path.node.value = t.jsxExpressionContainer(path.node.value);
        }
    };

    return {
        name: "transform-react-jsx",
        inherits:() => {
            return {
                manipulateOptions(opts, parserOpts) {
                    parserOpts.plugins.push("jsx");
                }
            };

        },
        visitor,
    };
};


const result = babel.transform(`<div>
<h1><h3>3</h3><h4>4</h4></h1>
</div>`, {
    plugins: [
        '@babel/plugin-syntax-jsx',
        {
            visitor: d().visitor
        }
    ]
})

console.log(result.code)
