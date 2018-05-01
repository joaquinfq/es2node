# es2node [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install es2node](https://nodei.co/npm/es2node.png?compact=true)](https://npmjs.org/package/es2node/)

EcmaScript to NodeJS class converter.

## Example

Input class (ES7+ format):

```js
import jfObject from 'jf-object';

/**
 * Clase de ejemplo.
 *
 *
 * @namespace jf
 * @class     jf.Example
 * @extends   jf.Object
 */
export default class jfExample extends jfObject
{
    /**
     * Nombre de ejemplo.
     *
     * @property name
     * @type     {String}
     */
    name = '';

    /**
     * Valor del ejemplo.
     *
     * @property value
     * @type     {String}
     */
    value = '';

    /**
     * Constructor de la clase.
     *
     * @param {Object|null} config Configuración a aplicar a la instancia.
     */
    constructor(config)
    {
        super();
        if (config)
        {
            this.setProperties(config);
        }
    }

    /**
     * Método de ejemplo.
     *
     * @return {String} Resultado del ejemplo.
     */
    build()
    {
        return `Nombre: ${this.name}\nValor : ${this.value}`;
    }
}
```

Output class (CommonJS):

```js
const jfObject = require('jf-object');

/**
 * Clase de ejemplo.
 *
 *
 * @namespace jf
 * @class     jf.Example
 * @extends   jf.Object
 */
class jfExample extends jfObject
{
    /**
     * Constructor de la clase.
     *
     * @param {Object|null} config Configuración a aplicar a la instancia.
     */
    constructor(config)
    {
        super();
        //-----------------------------------------------------------------------------
        // Propiedades de la clase.
        //-----------------------------------------------------------------------------
        /**
         * Nombre de ejemplo.
         *
         * @property name
         * @type     {String}
         */
        this.name = '';
        /**
         * Valor del ejemplo.
         *
         * @property value
         * @type     {String}
         */
        this.value = '';    
        //-----------------------------------------------------------------------------
        if (config)
        {
            this.setProperties(config);
        }
    }

    /**
     * Método de ejemplo.
     *
     * @return {String} Resultado del ejemplo.
     */
    build()
    {
        return `Nombre: ${this.name}\nValor : ${this.value}`;
    }
}

module.exports = jfExample;
```
