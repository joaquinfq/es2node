const builder = require('./src/builder');
const fs      = require('fs');
const path    = require('path');

process.argv.slice(2).forEach(
    filename =>
    {
        filename = path.resolve(filename);
        if (fs.existsSync(filename))
        {
            console.log(builder(fs.readFileSync(filename, 'utf8')));
        }
    }
);
