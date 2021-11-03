const { mkdir, readdir, copyFile, rm } = require('fs/promises');
const path = require('path');

const dstPath = path.resolve(__dirname, 'files-copy');
const srcPath = path.resolve(__dirname, 'files');

async function copyDir() {
  try {
    const dstDir = await mkdir(dstPath, { recursive: true });
    if (!dstDir) {
      await rm(dstPath, { recursive: true });
      await mkdir(dstPath, { recursive: true });
    }
    const files = await readdir(srcPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.resolve(srcPath, file.name), path.resolve(dstPath, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
