const hbs        = require('handlebars');
const helpersHbs = require('../../helpers-hbs');
const path       = require('path');
const parser     = require('./parser');

let block;
let blocks;
let imports;
let source;

helpersHbs.registerAll(hbs);

function createBlock(name, node, value = '')
{
    block = {
        value,
        [name]     : true,
        desc       : parseComments(node),
        methods    : {},
        properties : {},
        super      : ''
    };
    blocks.push(block);

    return block;
}

function getSourceBlock(node)
{
    return source.substring(node.start, node.end);
}

function parseComments(node)
{
    const _comments = node.leadingComments;

    return _comments && _comments.length
        ? _comments.map(c => getSourceBlock(c)).filter(Boolean)
        : [];
}

function parseNode(node)
{
    if (node)
    {
        switch (node.type)
        {
            case 'ClassBody':
                node.body.forEach(parseNode);
                break;
            case 'ClassDeclaration':
                const _block = createBlock('class', node, parseNode(node.id));
                if (node.body)
                {
                    parseNode(node.body);
                }
                _block.exports = node.exports;
                _block.super = parseNode(node.superClass);
                const _properties = Object.values(_block.properties);
                if (_properties.length)
                {
                    const _constructor = _block.methods.constructor;
                    if (typeof _constructor === 'string' && _constructor.includes('super('))
                    {
                        _properties.sort((i1, i2) => i1.toLowerCase().localeCompare(i2.toLowerCase()));
                        _block.methods.constructor = _constructor.replace(
                            /^(\s+)super\([^)]*\);/m,
                            (line, indentation) => helpersHbs.render(
                                hbs,
                                path.join(__dirname, '..', 'tpl', 'properties.hbs'),
                                {
                                    indentation,
                                    properties : _properties,
                                    super      : line
                                }
                            )
                        );
                    }
                }
                break;
            case 'ClassMethod':
            case 'ClassProperty':
                const _value = `    ${parseComments(node).join('\n')}\n    ${getSourceBlock(node)}`;
                if (node.type === 'ClassMethod')
                {
                    block.methods[parseNode(node.key)] = _value;
                }
                else
                {
                    block.properties[parseNode(node.key)] = _value;
                }
                break;
            case 'ExportDefaultDeclaration':
                const _declaration = node.declaration;
                if (_declaration)
                {
                    if (!_declaration.leadingComments)
                    {
                        _declaration.leadingComments = node.leadingComments;
                    }
                    parseNode(_declaration);
                    block.exports = true;
                }
                break;
            case 'ExpressionStatement':
            case 'FunctionDeclaration':
            case 'ObjectExpression':
            case 'VariableDeclaration':
                createBlock('statement', node).value = getSourceBlock(node);
                break;
            case 'Identifier':
                node = node.name;
                break;
            case 'ImportDeclaration':
                const _path = parseNode(node.source);
                imports.push(
                    ...node.specifiers.map(
                        specifier => (
                            {
                                name  : parseNode(specifier),
                                value : _path
                            }
                        )
                    )
                );
                break;
            case 'ImportDefaultSpecifier':
                node = parseNode(node.local);
                break;
            case 'StringLiteral':
                node = node.value;
                break;
            default:
                const _loc = node.loc.start;
                console.log('Nodo desconocido (%d:%d): %s', _loc.line, _loc.column, node.type);
                break;
        }
    }

    return node;
}

module.exports = function builder(code, fn)
{
    blocks  = [];
    imports = [];
    source  = code;

    parser(code).body.forEach(parseNode);

    const _context = {
        blocks,
        imports
    };
    if (typeof fn === 'function')
    {
        fn(_context);
    }
    _context.imports.sort((i1, i2) => i1.name.toLowerCase().localeCompare(i2.name.toLowerCase()));

    return helpersHbs.render(
        hbs,
        path.join(__dirname, '..', 'tpl', 'file.hbs'),
        _context
    );
};
