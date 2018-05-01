const babylon = require('babylon');

/**
 * Analiza el código fuente y devuelve el AST.
 *
 * @param {String} source Código fuente a analizar.
 *
 * @return {Object} Nodo raíz.
 */
module.exports = function parser(source)
{
    return babylon
        .parse(
            source,
            {
                plugins    : [
                    'asyncGenerators',
                    'bigInt',
                    'classPrivateMethods',
                    'classPrivateProperties',
                    'classProperties',
                    'decorators',
                    'doExpressions',
                    'dynamicImport',
                    'exportDefaultFrom',
                    'exportExtensions',
                    'exportNamespaceFrom',
                    'flow',
                    'functionBind',
                    'functionSent',
                    'importMeta',
                    'jsx',
                    'numericSeparator',
                    'objectRestSpread',
                    'optionalCatchBinding',
                    'optionalChaining',
                    'pipelineOperator',
                    'throwExpressions'
                ],
                ranges     : true,
                sourceType : 'module',
                tokens     : false
            }
        )
        .program;
};
