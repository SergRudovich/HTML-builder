const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const rl = readline.createInterface({ input:stdin, output:stdout });

const filePath = path.join(__dirname, 'text.txt');

let writeableStream = fs.createWriteStream(filePath);
stdout.write('Input text:\n');

rl.on('close', exit);
rl.on('line', (line) => {
  if (line === 'exit') {
    exit();
    process.exit();
  } else {
    writeableStream.write(line + '\n');
  }
});

function exit() {
  stdout.write('All good!!! By!!');
  writeableStream.end();
}