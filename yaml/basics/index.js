const yaml = require('js-yaml');
const fs = require('fs');

try {
    var doc = yaml.safeLoad(fs.readFileSync('data.yml', 'utf8'));
    console.log(JSON.stringify(doc, null, 2));
} catch (e) {
    console.log(e);
}
