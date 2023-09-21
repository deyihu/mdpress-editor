const fs = require('fs');
const path = require('path');
const fileName = 'mdpress-editor';
const p = path.join(__dirname, `./../mdpress/src/lib/${fileName}`);
if (fs.existsSync(p)) {
    const p1 = path.join(__dirname, `./dist/${fileName}.min.js`);
    const str = fs.readFileSync(p1);
    fs.writeFileSync(`${p}/${fileName}.min.js`, str);
}