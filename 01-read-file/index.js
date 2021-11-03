const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

let readableStream = fs.createReadStream(filePath);

readableStream.pipe(stdout);