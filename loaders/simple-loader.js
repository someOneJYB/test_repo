var c = require('loader-utils');
var validateOptions = require('schema-utils');

const schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string'
        }
    }
};
module.exports = function(source) {
    const options = c.getOptions(this);
    console.log(source);
    console.log(this)
    validateOptions(schema, options, 'Example Loader');

    // Apply some transformations to the source...

    return `export default ${ JSON.stringify(source) }`;
}
