
const fs = require('fs')

function convert(str, filepath) {
    const base64Data = str.replace(/^data:image\/\w+;base64,/, "");
    const bitMap = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, bitMap);
}

const src = fs.readFileSync('/Users/guojun/Desktop/base64');
const filepath = '/Users/guojun/Documents/test.png';
convert(src.toString(), filepath);