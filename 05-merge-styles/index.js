const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const dstPath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const srcPath = path.resolve(__dirname, 'styles');
const bundleArr = [];

(async function mergeStyles() {
  try {
    const files = await readdir(srcPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.resolve(srcPath, file.name);
      if (file.isFile() && path.extname(filePath) === '.css') {
        const fileData = await readFile(filePath);
        bundleArr.push(fileData);
      }
    }
    await writeFile(dstPath, bundleArr);
  } catch (err) {
    console.error(err);
  }
})();