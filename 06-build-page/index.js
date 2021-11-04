const { readdir, readFile, writeFile, mkdir, copyFile, rm } = require('fs/promises');
const path = require('path');

const dstDirPath = path.resolve(__dirname, 'project-dist');
const srcAssetsPath = path.resolve(__dirname, 'assets');
const dstStylePath = path.resolve(__dirname, 'project-dist', 'style.css');
const dstHtmlPath = path.resolve(__dirname, 'project-dist', 'index.html');
const srcStylePath = path.resolve(__dirname, 'styles');
const srcHtmlPath = path.resolve(__dirname, 'template.html');
const bundleArr = [];

mkDir(dstDirPath);
copyDir(srcAssetsPath, path.resolve(dstDirPath, 'assets'));
mergeStyles(srcStylePath, dstStylePath);

async function mkDir(dirPath) {
  try {
    const dstDir = await mkdir(dirPath, { recursive: true });
    if (!dstDir) {
      const files = await readdir(path.resolve(dirPath, 'assets'), { withFileTypes: true });
      for (const file of files) {
        if (!file.isFile()) {
          await rm(path.resolve(dirPath, 'assets', file.name), { recursive: true });
        }
      }
      await rm(path.resolve(dirPath, 'assets'), { recursive: true });
      await rm(dirPath, { recursive: true });
      await mkdir(dirPath, { recursive: true });
    }
  } catch (err) {
    // console.error(err);
  }
}

async function copyDir(src, dst) {
  try {
    const dstDir = await mkdir(dst, { recursive: true });
    if (!dstDir) {
      await rm(dst, { recursive: true });
      await mkdir(dst, { recursive: true });
    }
    const files = await readdir(src, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.resolve(src, file.name), path.resolve(dst, file.name));
      } else {
        copyDir(path.resolve(src, file.name), path.resolve(dst, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyles(src, dst) {
  try {
    const files = await readdir(src, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.resolve(src, file.name);
      if (file.isFile() && path.extname(filePath) === '.css') {
        const fileData = await readFile(filePath);
        bundleArr.push(fileData);
      }
    }
    await writeFile(dst, bundleArr);
  } catch (err) {
    console.error(err);
  }
}

